#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_BLOCKLY_ROOT = path.resolve(ROOT, '..', 'aily-blockly');
const DEFAULT_BUILDER_ROOT = path.resolve(ROOT, '..', 'aily-builder');
const DEFAULT_FIXTURE_PATH = path.join(ROOT, '.scripts', 'contracts', 'readme-runtime-contracts.v1.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasExtraSlot(value) {
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) => (
    /^EXTRA_\d+$/.test(key) || hasExtraSlot(child)
  ));
}

function readFixture(fixturePath) {
  const resolved = path.resolve(fixturePath);
  if (!fs.existsSync(resolved)) throw new Error(`Runtime contract fixture not found: ${resolved}`);
  const fixture = JSON.parse(fs.readFileSync(resolved, 'utf8').replace(/^\uFEFF/, ''));
  assert(fixture?.schemaVersion === 1, 'runtime contract fixture schemaVersion must be 1');
  assert(Array.isArray(fixture.libraries) && fixture.libraries.length > 0, 'runtime fixture libraries must be non-empty');
  assert(
    Array.isArray(fixture.runtimeSourcePaths) && fixture.runtimeSourcePaths.length > 0,
    'runtime fixture runtimeSourcePaths must be non-empty',
  );
  assert(
    new Set(fixture.runtimeSourcePaths).size === fixture.runtimeSourcePaths.length,
    'runtime fixture runtimeSourcePaths must be unique',
  );
  assert(
    fixture.runtimeInitializers === undefined || Array.isArray(fixture.runtimeInitializers),
    'runtime fixture runtimeInitializers must be an array',
  );
  for (const initializerPath of fixture.runtimeInitializers || []) {
    assert(
      fixture.runtimeSourcePaths.includes(initializerPath),
      `runtime initializer must also be fingerprinted: ${initializerPath}`,
    );
  }
  assert(Array.isArray(fixture.cases) && fixture.cases.length > 0, 'runtime fixture cases must be non-empty');
  const ids = new Set();
  for (const contractCase of fixture.cases) {
    assert(contractCase && typeof contractCase.id === 'string' && contractCase.id, 'every runtime case requires id');
    assert(!ids.has(contractCase.id), `duplicate runtime case id: ${contractCase.id}`);
    assert(typeof contractCase.abs === 'string' && contractCase.abs.trim(), `${contractCase.id}: abs must be non-empty`);
    assert(contractCase.expect && typeof contractCase.expect === 'object', `${contractCase.id}: expect must be an object`);
    if (contractCase.compile !== undefined) {
      assert(contractCase.compile && typeof contractCase.compile === 'object', `${contractCase.id}: compile must be an object`);
      assert(
        typeof contractCase.compile.board === 'string' && contractCase.compile.board,
        `${contractCase.id}: compile.board must be non-empty`,
      );
      assert(
        contractCase.compile.artifacts === undefined
          || (Array.isArray(contractCase.compile.artifacts)
            && contractCase.compile.artifacts.every(extension => typeof extension === 'string' && /^\.[a-z0-9]+$/i.test(extension))),
        `${contractCase.id}: compile.artifacts must contain file extensions such as .elf`,
      );
    }
    for (const pathCheck of contractCase.expect.paths || []) {
      assert(
        pathCheck?.block && typeof pathCheck.block.type === 'string' && pathCheck.block.type,
        `${contractCase.id}: every path check requires block.type`,
      );
      assert(typeof pathCheck.path === 'string' && pathCheck.path, `${contractCase.id}: every path check requires path`);
      assert(
        pathCheck.absent === true || Object.prototype.hasOwnProperty.call(pathCheck, 'equals'),
        `${contractCase.id}: path check requires equals or absent=true`,
      );
    }
    for (const binding of contractCase.expect.variableBindings || []) {
      assert(
        binding?.block && typeof binding.block.type === 'string' && binding.block.type,
        `${contractCase.id}: every variable binding requires block.type`,
      );
      assert(typeof binding.field === 'string' && binding.field, `${contractCase.id}: variable binding requires field`);
      assert(typeof binding.name === 'string' && binding.name, `${contractCase.id}: variable binding requires name`);
    }
    assert(
      contractCase.expect.codeIncludes === undefined
        || (Array.isArray(contractCase.expect.codeIncludes)
          && contractCase.expect.codeIncludes.every(fragment => typeof fragment === 'string' && fragment)),
      `${contractCase.id}: codeIncludes must contain non-empty strings`,
    );
    const projectDataSeedNames = new Set();
    for (const seed of contractCase.projectDataSeeds || []) {
      assert(seed && typeof seed.name === 'string' && seed.name, `${contractCase.id}: Project Data seed requires name`);
      assert(!projectDataSeedNames.has(seed.name), `${contractCase.id}: duplicate Project Data seed: ${seed.name}`);
      assert(typeof seed.codec === 'string' && seed.codec, `${contractCase.id}: Project Data seed ${seed.name} requires codec`);
      assert(
        seed.storage === undefined || seed.storage === 'raw-v1' || seed.storage === 'deflate-raw-v1',
        `${contractCase.id}: Project Data seed ${seed.name} has unsupported storage`,
      );
      assert(
        Array.isArray(seed.bytes) && seed.bytes.every(value => Number.isInteger(value) && value >= 0 && value <= 255),
        `${contractCase.id}: Project Data seed ${seed.name} bytes must be integers from 0 to 255`,
      );
      projectDataSeedNames.add(seed.name);
    }
    for (const binding of contractCase.expect.projectDataBindings || []) {
      assert(
        binding?.block && typeof binding.block.type === 'string' && binding.block.type,
        `${contractCase.id}: every Project Data binding requires block.type`,
      );
      assert(typeof binding.field === 'string' && binding.field, `${contractCase.id}: Project Data binding requires field`);
      assert(typeof binding.valuePath === 'string' && binding.valuePath, `${contractCase.id}: Project Data binding requires valuePath`);
      assert(projectDataSeedNames.has(binding.seed), `${contractCase.id}: Project Data binding references unknown seed ${binding.seed}`);
    }
    if (contractCase.expectedFailure !== undefined) {
      assert(
        contractCase.expectedFailure
          && typeof contractCase.expectedFailure.contains === 'string'
          && contractCase.expectedFailure.contains,
        `${contractCase.id}: expectedFailure.contains must be non-empty`,
      );
      assert(
        typeof contractCase.expectedFailure.reason === 'string'
          && contractCase.expectedFailure.reason,
        `${contractCase.id}: expectedFailure.reason must be non-empty`,
      );
    }
    ids.add(contractCase.id);
  }
  return { ...fixture, path: resolved };
}

function selectBlock(blocks, selector) {
  const matches = blocks.filter(block => block.type === selector?.type);
  return matches[Number.isInteger(selector?.index) ? selector.index : 0];
}

function readObjectPath(value, objectPath) {
  let current = value;
  for (const segment of String(objectPath || '').split('.').filter(Boolean)) {
    if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, segment)) {
      return { exists: false, value: undefined };
    }
    current = current[segment];
  }
  return { exists: true, value: current };
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function parseStructuredFieldValue(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function verifyFixtureExpectations(contractCase, saved, blocks, projectDataRefs) {
  const expected = contractCase.expect || {};
  for (const [type, count] of Object.entries(expected.blockCounts || {})) {
    const actual = blocks.filter(block => block.type === type).length;
    assert(actual === count, `${contractCase.id}: expected ${count} ${type} block(s), received ${actual}`);
  }
  for (const check of expected.paths || []) {
    const block = selectBlock(blocks, check.block);
    assert(block, `${contractCase.id}: block selector not found: ${JSON.stringify(check.block)}`);
    const actual = readObjectPath(block, check.path);
    if (check.absent === true) {
      assert(!actual.exists, `${contractCase.id}: ${check.block.type}.${check.path} must be absent`);
    } else {
      assert(actual.exists, `${contractCase.id}: ${check.block.type}.${check.path} must exist`);
      assert(
        sameValue(actual.value, check.equals),
        `${contractCase.id}: ${check.block.type}.${check.path} expected ${JSON.stringify(check.equals)}, received ${JSON.stringify(actual.value)}`,
      );
    }
  }
  for (const binding of expected.variableBindings || []) {
    const block = selectBlock(blocks, binding.block);
    assert(block, `${contractCase.id}: variable binding block not found: ${JSON.stringify(binding.block)}`);
    const field = block?.fields?.[binding.field];
    assert(field?.id, `${contractCase.id}: ${binding.block.type}.${binding.field} must serialize as a variable field`);
    const variable = (saved.variables || []).find(item => item.id === field.id);
    assert(variable?.name === binding.name, `${contractCase.id}: expected variable ${binding.name}, received ${JSON.stringify(variable?.name)}`);
    if (binding.type !== undefined) {
      assert(variable?.type === binding.type, `${contractCase.id}: variable ${binding.name} expected type ${binding.type}, received ${JSON.stringify(variable?.type)}`);
    }
  }
  verifyProjectDataBindings(contractCase, blocks, projectDataRefs);
}

function verifyProjectDataBindings(contractCase, blocks, projectDataRefs, phase = 'serialized ABI') {
  for (const binding of contractCase.expect?.projectDataBindings || []) {
    const block = selectBlock(blocks, binding.block);
    assert(block, `${contractCase.id}: Project Data binding block not found in ${phase}: ${JSON.stringify(binding.block)}`);
    const fieldValue = parseStructuredFieldValue(block?.fields?.[binding.field]);
    const actual = readObjectPath(fieldValue, binding.valuePath);
    const expectedRef = projectDataRefs.get(binding.seed);
    assert(actual.exists, `${contractCase.id}: ${binding.block.type}.${binding.field}.${binding.valuePath} must exist in ${phase}`);
    assert(
      sameValue(actual.value, expectedRef),
      `${contractCase.id}: ${binding.block.type}.${binding.field}.${binding.valuePath} does not preserve Project Data seed ${binding.seed} in ${phase}; received ${JSON.stringify(fieldValue)}`,
    );
  }
}

async function probeProjectDataBlockCreation(
  contractCase,
  parsedRootBlocks,
  projectDataRefs,
  workspace,
  Blockly,
  createBlockFromConfig,
) {
  if (projectDataRefs.size === 0) return;
  for (const config of parsedRootBlocks) {
    const result = await createBlockFromConfig(workspace, JSON.parse(JSON.stringify(config)));
    assert(result?.block, `${contractCase.id}: direct block creation did not return a root block`);
    assert(
      !result.failedBlocks?.length,
      `${contractCase.id}: direct block creation failed: ${JSON.stringify(result.failedBlocks)}`,
    );
  }
  await Promise.resolve();
  const saved = Blockly.serialization.workspaces.save(workspace);
  verifyProjectDataBindings(contractCase, flattenSerializedBlocks(saved), projectDataRefs, 'direct block creation probe');
  Blockly.Events.disable();
  try {
    workspace.clear();
  } finally {
    Blockly.Events.enable();
  }
}

async function materializeProjectDataContract(contractCase, projectDataRuntime) {
  let abs = contractCase.abs;
  const refs = new Map();
  for (const seed of contractCase.projectDataSeeds || []) {
    const token = `{{projectData.${seed.name}}}`;
    assert(abs.includes(token), `${contractCase.id}: ABS does not contain Project Data placeholder ${token}`);
    const ref = await projectDataRuntime.put({
      codec: seed.codec,
      storage: seed.storage || 'raw-v1',
      value: Uint8Array.from(seed.bytes),
    });
    const validation = await projectDataRuntime.getStore().validateReferences([ref]);
    assert(validation.valid, `${contractCase.id}: seeded Project Data resource ${seed.name} failed validation`);
    refs.set(seed.name, ref);
    abs = abs.split(token).join(JSON.stringify(ref));
  }
  assert(!abs.includes('{{projectData.'), `${contractCase.id}: unresolved Project Data placeholder remains in ABS`);
  return { abs, refs };
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function getRuntimeSourceState(blocklyRoot, sourcePaths) {
  const paths = Array.isArray(sourcePaths) ? sourcePaths : [];
  let dirtyOutput = '';
  try {
    dirtyOutput = execFileSync('git', ['status', '--porcelain=v1', '--', ...paths], {
      cwd: blocklyRoot,
      encoding: 'utf8',
    });
  } catch {}
  const dirtyPaths = dirtyOutput.split(/\r?\n/).filter(Boolean).map(line => line.slice(3).replace(/\\/g, '/'));
  const files = paths.map(relativePath => {
    const absolutePath = path.join(blocklyRoot, relativePath);
    assert(fs.existsSync(absolutePath), `runtime source not found: ${absolutePath}`);
    let headBlob = null;
    try {
      headBlob = execFileSync('git', ['rev-parse', `HEAD:${relativePath.replace(/\\/g, '/')}`], {
        cwd: blocklyRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } catch {}
    return {
      path: relativePath.replace(/\\/g, '/'),
      sha256: sha256File(absolutePath),
      headBlob,
      dirty: dirtyPaths.some(dirtyPath => dirtyPath === relativePath.replace(/\\/g, '/')),
    };
  });
  const fingerprint = crypto.createHash('sha256')
    .update(files.map(file => `${file.path}\0${file.sha256}`).join('\n'))
    .digest('hex');
  return { fingerprint, dirtyPaths, files };
}

function getRuntimeDependencyState(blocklyRoot, runtimeRequire) {
  const specifiers = [
    '@angular/core',
    'blockly',
    'blockly/blocks',
    'jsdom',
    'jiti',
    'reflect-metadata',
    'rxjs',
  ];
  const entries = specifiers.map(specifier => {
    const resolvedPath = runtimeRequire.resolve(specifier);
    return {
      specifier,
      path: path.relative(blocklyRoot, resolvedPath).replace(/\\/g, '/'),
      sha256: sha256File(resolvedPath),
    };
  });
  const packageLockPath = path.join(blocklyRoot, 'package-lock.json');
  const packageLockSha256 = fs.existsSync(packageLockPath) ? sha256File(packageLockPath) : null;
  const blocklyPackage = JSON.parse(
    fs.readFileSync(path.join(blocklyRoot, 'node_modules', 'blockly', 'package.json'), 'utf8').replace(/^\uFEFF/, ''),
  );
  const fingerprint = crypto.createHash('sha256')
    .update(JSON.stringify({ packageLockSha256, entries }))
    .digest('hex');
  return {
    fingerprint,
    node: process.version,
    blockly: { name: blocklyPackage.name, version: blocklyPackage.version },
    packageLockSha256,
    entries,
  };
}

function getLibrarySourceState(libraries) {
  const files = libraries.flatMap(library => [
    path.join(library.path, 'package.json'),
    path.join(library.path, 'block.json'),
    library.generatorPath,
  ].map(filePath => ({
    path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    sha256: sha256File(filePath),
  })));
  const fingerprint = crypto.createHash('sha256')
    .update(files.map(file => `${file.path}\0${file.sha256}`).join('\n'))
    .digest('hex');
  return { fingerprint, files };
}

function getBuilderState(builderRoot) {
  const state = getRuntimeSourceState(builderRoot, ['package.json', 'dist/main.js']);
  const pkg = JSON.parse(fs.readFileSync(path.join(builderRoot, 'package.json'), 'utf8').replace(/^\uFEFF/, ''));
  return {
    ...state,
    root: builderRoot,
    revision: getGitRevision(builderRoot),
    name: pkg.name,
    version: pkg.version,
  };
}

function findArtifacts(root, extensions) {
  const expected = new Set(extensions.map(extension => extension.toLowerCase()));
  const result = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (expected.has(path.extname(entry.name).toLowerCase())) result.push(absolutePath);
    }
  };
  if (fs.existsSync(root)) visit(root);
  return result;
}

function compileSketchWithAilyBuilder(builderRoot, projectPath, contractCase, sketchPath) {
  const builderMain = path.join(builderRoot, 'dist', 'main.js');
  assert(fs.existsSync(builderMain), `aily-builder entry not found: ${builderMain}`);
  const buildPath = path.join(projectPath, '.temp', 'compile', contractCase.id);
  const artifacts = contractCase.compile.artifacts || ['.elf', '.hex'];
  const args = [
    builderMain,
    'compile',
    sketchPath,
    '--board',
    contractCase.compile.board,
    '--build-path',
    buildPath,
    '--jobs',
    String(contractCase.compile.jobs || 2),
    '--no-archive-cloud-cache',
  ];
  try {
    execFileSync(process.execPath, args, {
      cwd: builderRoot,
      encoding: 'utf8',
      timeout: contractCase.compile.timeoutMs || 120000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n').trim();
    throw new Error(
      `${contractCase.id}: aily-builder compile failed for ${contractCase.compile.board}`
      + (output ? `\n${output.slice(-8000)}` : ''),
    );
  }
  const generatedArtifacts = findArtifacts(buildPath, artifacts);
  for (const extension of artifacts) {
    assert(
      generatedArtifacts.some(filePath => path.extname(filePath).toLowerCase() === extension.toLowerCase()),
      `${contractCase.id}: aily-builder produced no ${extension} artifact`,
    );
  }
  return {
    board: contractCase.compile.board,
    artifacts: generatedArtifacts.map(filePath => ({
      path: path.relative(buildPath, filePath).replace(/\\/g, '/'),
      bytes: fs.statSync(filePath).size,
      sha256: sha256File(filePath),
    })),
  };
}

function parseArgs(argv) {
  const options = {
    json: false,
    blocklyRoot: process.env.AILY_BLOCKLY_ROOT || DEFAULT_BLOCKLY_ROOT,
    builderRoot: process.env.AILY_BUILDER_ROOT || DEFAULT_BUILDER_ROOT,
    compile: false,
    fixturePath: DEFAULT_FIXTURE_PATH,
    requireCleanRuntime: false,
  };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--aily-blockly-root') options.blocklyRoot = path.resolve(argv[++index] || '');
    else if (arg === '--aily-builder-root') options.builderRoot = path.resolve(argv[++index] || '');
    else if (arg === '--compile') options.compile = true;
    else if (arg === '--fixture') options.fixturePath = path.resolve(argv[++index] || '');
    else if (arg === '--require-clean-runtime') options.requireCleanRuntime = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function printUsage() {
  console.log(`Usage:
  node .scripts/check-readme-runtime-contract.js [--json]
  node .scripts/check-readme-runtime-contract.js --aily-blockly-root <path>
  node .scripts/check-readme-runtime-contract.js --compile [--aily-builder-root <path>]
  node .scripts/check-readme-runtime-contract.js --fixture <path> [--require-clean-runtime]

The runner loads the current aily-blockly TypeScript sources and installed
Blockly runtime read-only. AILY_BLOCKLY_ROOT may be used instead of the flag.
The report fingerprints every loaded contract source; --require-clean-runtime
rejects relevant uncommitted aily-blockly source changes. --compile runs only
fixture cases with a compile declaration through the sibling aily-builder.`);
}

function requireRuntime(blocklyRoot) {
  const packagePath = path.join(blocklyRoot, 'package.json');
  const modulesPath = path.join(blocklyRoot, 'node_modules');
  if (!fs.existsSync(packagePath)) throw new Error(`aily-blockly package.json not found: ${packagePath}`);
  if (!fs.existsSync(modulesPath)) {
    throw new Error(`aily-blockly dependencies are not installed: ${modulesPath}`);
  }
  return createRequire(packagePath);
}

function installDom(runtimeRequire) {
  const { JSDOM } = runtimeRequire('jsdom');
  const dom = new JSDOM(
    '<!doctype html><html><head></head><body><div id="blockly-contract"></div></body></html>',
    { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'dangerously' },
  );
  for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (!(key in globalThis)) {
      try { globalThis[key] = dom.window[key]; } catch {}
    }
  }
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.navigator = dom.window.navigator;
  if (!globalThis.crypto) globalThis.crypto = crypto.webcrypto;
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    measureText: text => ({ width: String(text).length * 8 }),
    createImageData: (width, height) => ({
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4),
    }),
    putImageData() {},
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    drawImage() {},
  });
  dom.window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';
  if (!dom.window.SVGElement.prototype.getBBox) {
    dom.window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 100, height: 20 });
  }
  if (!dom.window.SVGElement.prototype.getComputedTextLength) {
    dom.window.SVGElement.prototype.getComputedTextLength = () => 100;
  }
  globalThis.requestIdleCallback = callback => globalThis.setTimeout(
    () => callback({ didTimeout: false, timeRemaining: () => 50 }),
    0,
  );
  globalThis.cancelIdleCallback = handle => globalThis.clearTimeout(handle);
  return dom;
}

function createWorkspace(Blockly, dom) {
  const div = dom.window.document.createElement('div');
  div.className = 'blockly-contract-workspace';
  dom.window.document.body.appendChild(div);
  Object.defineProperties(div, {
    offsetWidth: { get: () => 800 },
    offsetHeight: { get: () => 600 },
    clientWidth: { get: () => 800 },
    clientHeight: { get: () => 600 },
  });
  const workspace = Blockly.inject(div, {
    toolbox: null,
    sounds: false,
    trashcan: false,
    scrollbars: false,
  });
  return { workspace, div };
}

function readLibrary(libraryName) {
  const libraryPath = path.join(ROOT, libraryName);
  return {
    name: libraryName,
    path: libraryPath,
    pkg: JSON.parse(fs.readFileSync(path.join(libraryPath, 'package.json'), 'utf8').replace(/^\uFEFF/, '')),
    blocks: JSON.parse(fs.readFileSync(path.join(libraryPath, 'block.json'), 'utf8').replace(/^\uFEFF/, '')),
    generatorPath: path.join(libraryPath, 'generator.js'),
  };
}

function createVirtualBlockElectronApi(projectPath, libraries) {
  const virtualRoot = path.join(projectPath, 'node_modules', '@aily-project');
  const packageToLibrary = new Map(libraries.map(library => [path.basename(library.pkg.name), library]));
  return {
    path,
    fs: {
      existsSync(filePath) {
        if (filePath === virtualRoot) return true;
        const packageName = path.basename(path.dirname(filePath));
        return path.basename(filePath) === 'block.json' && packageToLibrary.has(packageName);
      },
      readdirSync(filePath) {
        if (filePath !== virtualRoot) throw new Error(`Unexpected virtual readdir: ${filePath}`);
        return [...packageToLibrary.keys()];
      },
      readFileSync(filePath) {
        const packageName = path.basename(path.dirname(filePath));
        const library = packageToLibrary.get(packageName);
        if (!library) throw new Error(`Unexpected virtual block path: ${filePath}`);
        return JSON.stringify(library.blocks);
      },
    },
  };
}

function loadCurrentBlockMetas(blockDefinitionService, projectPath, electronAPI) {
  const metas = blockDefinitionService.loadBlockDefinitionsFromPath(projectPath, electronAPI);
  blockDefinitionService.setGlobalBlockMetas(metas);
  return metas;
}

function createProjectFileServices(projectPath) {
  const electronService = {
    exists: filePath => fs.existsSync(filePath),
    readFile: filePath => fs.promises.readFile(filePath, 'utf8'),
    async writeFile(filePath, content) {
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, content, 'utf8');
    },
    pathJoin: (...parts) => path.join(...parts),
  };
  const frameBudget = {
    checkpointCount: 0,
    reset() {},
    async checkpoint() {},
  };
  const editorOperationQueue = {
    enqueue(_kind, _label, operation) {
      return Promise.resolve(operation(async () => {}, { frameBudget }));
    },
  };
  return {
    electronService,
    projectService: { currentProjectPath: projectPath, projectRootPath: projectPath },
    invocationContext: { editorOperationQueue, editorFrameBudget: frameBudget },
  };
}

function createHostFsBridge() {
  return {
    ...fs,
    exists: async filePath => fs.existsSync(filePath),
    mkdir: (directoryPath, options) => fs.promises.mkdir(directoryPath, options),
    readdir: directoryPath => fs.promises.readdir(directoryPath),
    lstat: filePath => fs.promises.lstat(filePath),
    rename: (from, to) => fs.promises.rename(from, to),
    unlink: filePath => fs.promises.unlink(filePath),
    readFileBuffer: filePath => fs.readFileSync(filePath),
    readFileBufferAsync: filePath => fs.promises.readFile(filePath),
    writeFileBuffer: (filePath, value) => fs.writeFileSync(filePath, Buffer.from(value)),
    writeFileBufferAsync: (filePath, value) => fs.promises.writeFile(filePath, Buffer.from(value)),
  };
}

function flattenSerializedBlocks(saved) {
  const result = [];
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.type === 'string') result.push(value);
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === 'object') visit(child);
    }
  }
  visit(saved?.blocks?.blocks || []);
  return result;
}

function getGitRevision(blocklyRoot) {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: blocklyRoot, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

async function captureConsoleLogs(operation) {
  const originalLog = console.log;
  const logs = [];
  console.log = (...values) => logs.push(values.map(value => String(value)).join(' '));
  try {
    return { value: await operation(), logs };
  } finally {
    console.log = originalLog;
  }
}

function installRuntimeConsoleFilter() {
  const originalLog = console.log;
  console.log = (...values) => {
    // field-u8g2-bitmap logs every field disposal as a debug aid. Workspace
    // resets are expected in this runner, so keep the contract output focused
    // without suppressing any other runtime message.
    if (values[0] === 'Disposing field') return;
    originalLog(...values);
  };
  return () => {
    console.log = originalLog;
  };
}

async function run(options) {
  const blocklyRoot = path.resolve(options.blocklyRoot);
  const builderRoot = path.resolve(options.builderRoot);
  const fixture = readFixture(options.fixturePath || DEFAULT_FIXTURE_PATH);
  const runtimeSourceState = getRuntimeSourceState(blocklyRoot, fixture.runtimeSourcePaths);
  if (options.requireCleanRuntime && runtimeSourceState.dirtyPaths.length > 0) {
    throw new Error(`aily-blockly contract sources are dirty: ${runtimeSourceState.dirtyPaths.join(', ')}`);
  }
  const runtimeRequire = requireRuntime(blocklyRoot);
  const runtimeDependencyState = getRuntimeDependencyState(blocklyRoot, runtimeRequire);
  const builderState = options.compile ? getBuilderState(builderRoot) : null;
  const dom = installDom(runtimeRequire);
  runtimeRequire('reflect-metadata');
  const Blockly = runtimeRequire('blockly');
  runtimeRequire('blockly/blocks');
  globalThis.Blockly = Blockly;
  const createJiti = runtimeRequire('jiti');
  const jiti = createJiti(path.join(blocklyRoot, 'runtime-contract-entry.js'), {
    interopDefault: true,
    cache: false,
  });

  const fromBlockly = relativePath => jiti(path.join(blocklyRoot, relativePath));
  // Match blockly.component.ts initialization before creating any blocks.
  // Repository-local plugins replace core mutators and are therefore part of
  // the real desktop workspace contract, not optional test helpers.
  for (const initializerPath of fixture.runtimeInitializers || []) {
    fromBlockly(initializerPath);
  }
  const blockDefinitionService = fromBlockly('src/app/tools/aily-chat/services/block-definition.service.ts');
  const { BlocklyAbsParser } = fromBlockly('src/app/tools/aily-chat/tools/absParser.ts');
  const { createBlockFromConfig } = fromBlockly('src/app/tools/aily-chat/tools/editBlockTool.ts');
  const { runSyncAbsFileConcreteHandler } = fromBlockly('src/app/tools/aily-chat/tools/syncAbsFileTool.ts');
  const { convertAbiToAbs } = fromBlockly('src/app/tools/aily-chat/tools/abiAbsConverter.ts');
  const { processJsonVar } = fromBlockly('src/app/editors/blockly-editor/components/blockly/abf.ts');
  const { projectDataRuntime } = fromBlockly('src/app/services/project-data/project-data-runtime.ts');
  const { BitmapUploadService, GlobalServiceManager } = fromBlockly(
    'src/app/editors/blockly-editor/services/bitmap-upload.service.ts',
  );
  const { decorateLibraryBlockDefinitionForProjectData } = fromBlockly(
    'src/app/services/project-data/blockly-project-data-adapter.ts',
  );
  const { BlocklyGeneratorRuntimeService } = fromBlockly(
    'src/app/editors/blockly-editor/services/blockly-generator-runtime.service.ts',
  );

  const libraries = fixture.libraries.map(readLibrary);
  const librarySourceState = getLibrarySourceState(libraries);
  const projectPath = fs.mkdtempSync(path.join(os.tmpdir(), 'aily-readme-runtime-'));
  const electronAPI = createVirtualBlockElectronApi(projectPath, libraries);
  window.electronAPI = electronAPI;
  window.fs = createHostFsBridge();
  window.path = path;
  projectDataRuntime.configure(projectPath);
  GlobalServiceManager.getInstance().setBitmapUploadService(new BitmapUploadService());
  const metas = loadCurrentBlockMetas(blockDefinitionService, projectPath, electronAPI);
  let activeWorkspace = null;
  let contractWorkspace = null;
  let contractWorkspaceDiv = null;
  let definitionOverwriteCount = 0;
  const runtime = new BlocklyGeneratorRuntimeService();
  const restoreConsole = installRuntimeConsoleFilter();
  runtime.activate({
    mode: 'arduino',
    boardConfig: fixture.boardConfig || {},
    getWorkspace: () => activeWorkspace,
  });

  try {
    // The desktop loader evaluates generators after the editor workspace is
    // available. Some core generators register workspace listeners at load
    // time, so the contract runner must preserve that same lifecycle.
    const contractSurface = createWorkspace(Blockly, dom);
    contractWorkspace = contractSurface.workspace;
    contractWorkspaceDiv = contractSurface.div;
    activeWorkspace = contractWorkspace;
    window.blocklyWorkspace = contractWorkspace;
    for (const library of libraries) {
      const source = fs.readFileSync(library.generatorPath, 'utf8');
      runtime.loadGenerator(library.generatorPath, source);
    }
    const originalWarn = console.warn;
    console.warn = (...values) => {
      if (/^Block definition ".+" overwrites previous definition\.$/.test(values.map(String).join(' '))) {
        definitionOverwriteCount++;
        return;
      }
      originalWarn(...values);
    };
    try {
      for (const library of libraries) {
        const processedBlocks = processJsonVar(library.blocks, fixture.boardConfig || {});
        for (const block of processedBlocks) {
          const decorated = decorateLibraryBlockDefinitionForProjectData(block, library.pkg.name);
          Blockly.defineBlocksWithJsonArray([decorated]);
        }
      }
    } finally {
      console.warn = originalWarn;
    }

    const results = [];
    for (const golden of fixture.cases) {
      const workspace = contractWorkspace;
      activeWorkspace = workspace;
      window.blocklyWorkspace = workspace;
      try {
        Blockly.Events.disable();
        try {
          workspace.clear();
        } finally {
          Blockly.Events.enable();
        }
        const projectDataContract = await materializeProjectDataContract(golden, projectDataRuntime);
        const parsed = new BlocklyAbsParser().parse(projectDataContract.abs);
        assert(parsed.success, `${golden.id}: ABS parse failed: ${JSON.stringify(parsed.errors)}`);
        assert(parsed.warnings.length === 0, `${golden.id}: parser warnings: ${JSON.stringify(parsed.warnings)}`);
        await probeProjectDataBlockCreation(
          golden,
          parsed.rootBlocks,
          projectDataContract.refs,
          workspace,
          Blockly,
          createBlockFromConfig,
        );
        const services = createProjectFileServices(projectPath);
        const capturedImport = await captureConsoleLogs(() => (
          runSyncAbsFileConcreteHandler(
            {
              operation: 'import',
              pendingAbsContent: `# Project Data Schema: 1 (external-only)\n\n${projectDataContract.abs}\n`,
            },
            services.projectService,
            services.electronService,
            undefined,
            services.invocationContext,
          )
        ));
        const imported = capturedImport.value;
        assert(!imported.is_error, `${golden.id}: syncAbs import failed: ${imported.content}`);
        const abiPath = path.join(projectPath, 'project.abi');
        assert(fs.existsSync(abiPath), `${golden.id}: syncAbs did not write project.abi`);
        const saved = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        const blocks = flattenSerializedBlocks(saved);
        assert(!hasExtraSlot(saved), `${golden.id}: serialized ABI contains an unmapped EXTRA_N slot`);
        verifyFixtureExpectations(golden, saved, blocks, projectDataContract.refs);

        const exportedAbs = convertAbiToAbs({ ...saved }, { includeHeader: false });
        assert(typeof exportedAbs === 'string' && exportedAbs.trim(), `${golden.id}: ABI export returned empty ABS`);
        const sketchPath = path.join(projectPath, '.temp', 'sketch', 'sketch.ino');
        const codeIncludes = golden.expect?.codeIncludes || [];
        const code = codeIncludes.length > 0 && fs.existsSync(sketchPath)
          ? fs.readFileSync(sketchPath, 'utf8')
          : '';
        for (const fragment of codeIncludes) {
          assert(
            code.includes(fragment),
            `${golden.id}: generated code is missing ${JSON.stringify(fragment)}\nGenerated code:\n${code}`,
          );
        }
        const compileResult = options.compile && golden.compile
          ? compileSketchWithAilyBuilder(builderRoot, projectPath, golden, sketchPath)
          : null;
        assert(
          !golden.expectedFailure,
          `${golden.id}: known failure no longer reproduces; remove expectedFailure only after reviewing and promoting this case`,
        );
        results.push({
          name: golden.id,
          status: 'passed',
          warnings: parsed.warnings.length,
          failedBlocks: 0,
          totalBlocks: imported.metadata?.blockCount || blocks.length,
          serializedBlocks: blocks.length,
          exportedAbsBytes: Buffer.byteLength(exportedAbs, 'utf8'),
          codegenChecked: codeIncludes.length > 0,
          compileChecked: Boolean(compileResult),
          compileResult,
          projectDataResources: projectDataContract.refs.size,
          runtimeLogCount: capturedImport.logs.length,
        });
      } catch (error) {
        const message = error.message || String(error);
        const expectedFailure = golden.expectedFailure;
        if (expectedFailure && message.includes(expectedFailure.contains)) {
          results.push({
            name: golden.id,
            status: 'known-failed',
            error: message,
            reason: expectedFailure.reason,
          });
        } else {
          results.push({ name: golden.id, status: 'failed', error: message });
        }
      } finally {
        activeWorkspace = workspace;
        window.blocklyWorkspace = workspace;
      }
    }

    const compileRequested = fixture.cases.filter(contractCase => contractCase.compile).length;
    if (options.compile) assert(compileRequested > 0, 'compile mode requested but the fixture declares no compile cases');
    return {
      blocklyRoot,
      blocklyRevision: getGitRevision(blocklyRoot),
      fixture: { schemaVersion: fixture.schemaVersion, name: fixture.name, path: fixture.path },
      runtimeSourceState,
      runtimeDependencyState,
      builderState,
      librarySourceState,
      loadedLibraries: libraries.map(library => library.name),
      loadedBlockMetas: metas.size,
      expectedDefinitionOverwrites: definitionOverwriteCount,
      results,
      passed: results.filter(result => result.status === 'passed').length,
      knownFailed: results.filter(result => result.status === 'known-failed').length,
      failed: results.filter(result => result.status === 'failed').length,
      compile: {
        enabled: options.compile,
        requested: options.compile ? compileRequested : 0,
        passed: results.filter(result => result.status === 'passed' && result.compileChecked).length,
      },
    };
  } finally {
    activeWorkspace = null;
    window.blocklyWorkspace = null;
    contractWorkspace?.dispose();
    contractWorkspaceDiv?.remove();
    runtime.destroy();
    projectDataRuntime.reset();
    GlobalServiceManager.getInstance().setBitmapUploadService(null);
    if (fs.existsSync(projectPath) && path.basename(projectPath).startsWith('aily-readme-runtime-')) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }
    dom.window.close();
    restoreConsole();
  }
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printUsage();
      return;
    }
    const report = await run(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Blockly revision: ${report.blocklyRevision}`);
      console.log(`Runtime source fingerprint: ${report.runtimeSourceState.fingerprint}`);
      console.log(`Runtime dependency fingerprint: ${report.runtimeDependencyState.fingerprint}`);
      console.log(
        `Blockly package: ${report.runtimeDependencyState.blockly.name}@${report.runtimeDependencyState.blockly.version}`,
      );
      console.log(`Relevant dirty Blockly sources: ${report.runtimeSourceState.dirtyPaths.length}`);
      if (report.compile.enabled) {
        console.log(`Aily Builder: ${report.builderState.name}@${report.builderState.version}`);
        console.log(`Compile contracts: ${report.compile.passed}/${report.compile.requested} passed`);
      }
      console.log(
        `Runtime golden contracts: ${report.passed} passed, ${report.knownFailed} known failure(s), ${report.failed} failed`,
      );
      for (const result of report.results) {
        if (result.status === 'passed') {
          console.log(`  PASS ${result.name} (${result.serializedBlocks} serialized blocks)`);
        } else if (result.status === 'known-failed') {
          console.log(`  KNOWN ${result.name}: ${result.error}`);
        } else {
          console.log(`  FAIL ${result.name}: ${result.error}`);
        }
      }
    }
    if (report.failed > 0) process.exitCode = 1;
  } catch (error) {
    console.error(`Runtime contract setup failed: ${error.message || error}`);
    process.exitCode = 2;
  }
}

if (require.main === module) main();

module.exports = {
  run,
  readFixture,
  verifyFixtureExpectations,
  getRuntimeSourceState,
  getRuntimeDependencyState,
  flattenSerializedBlocks,
  hasExtraSlot,
};
