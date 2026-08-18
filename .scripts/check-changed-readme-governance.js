#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const {
  allDocumentedBlocks,
} = require('./check-readme-compliance');
const {
  calledTypes,
  exampleRegions,
} = require('./check-readme-cross-library-examples');
const {
  CONTRACT_REPOSITORY_PREFIX,
  libraryFromContractRepositoryPath,
} = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const GLOBAL_LIBRARY_CONTRACTS = new Set([
  '.scripts/contracts/readme-generator-registrations.v1.json',
  '.scripts/contracts/readme-generated-code-no-direct.v1.json',
]);

function normalizeRepositoryPath(filePath) {
  return String(filePath || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function gitOutput(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function parseArgs(argv) {
  const options = { base: null, head: null };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--base' || arg === '--head') {
      if (!argv[index + 1]) throw new Error(`${arg} requires a Git revision`);
      options[arg.slice(2)] = argv[++index];
    } else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (options.base && !options.head) throw new Error('--base requires --head');
  return options;
}

function changedFiles(options) {
  if (options.base && options.head) {
    return gitOutput([
      'diff', '--name-only', '--no-renames', '-z', `${options.base}...${options.head}`,
    ]).split('\0').filter(Boolean).map(normalizeRepositoryPath);
  }
  if (options.head) {
    return gitOutput([
      'diff-tree', '--root', '--no-commit-id', '--name-only', '--no-renames', '-r', '-z', options.head,
    ]).split('\0').filter(Boolean).map(normalizeRepositoryPath);
  }
  const unstaged = gitOutput(['diff', '--name-only', '--no-renames', '-z', 'HEAD']);
  const staged = gitOutput(['diff', '--cached', '--name-only', '--no-renames', '-z', 'HEAD']);
  const untracked = gitOutput(['ls-files', '--others', '--exclude-standard', '-z']);
  return [...new Set(`${unstaged}${staged}${untracked}`.split('\0').filter(Boolean)
    .map(normalizeRepositoryPath))];
}

function readRepositoryFile(revision, repositoryPath) {
  const normalized = normalizeRepositoryPath(repositoryPath);
  if (!revision) {
    const absolutePath = path.join(ROOT, ...normalized.split('/'));
    return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
  }
  try {
    return execFileSync('git', ['show', `${revision}:${normalized}`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function readJsonAt(revision, repositoryPath) {
  const content = readRepositoryFile(revision, repositoryPath);
  if (content == null) return null;
  try {
    return JSON.parse(content.replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

function trackedLibraries() {
  return new Set(gitOutput(['ls-files', '-z', '*/block.json']).split('\0').filter(Boolean)
    .map(filePath => normalizeRepositoryPath(filePath).split('/')[0]));
}

function fileExistsAtRevision(revision, repositoryPath) {
  return revision ? readRepositoryFile(revision, repositoryPath) != null : false;
}

function librariesInGlobalContract(revision, repositoryPath) {
  const contract = readJsonAt(revision, repositoryPath);
  return new Set(Array.isArray(contract?.allow)
    ? contract.allow.map(entry => entry?.library).filter(value => typeof value === 'string' && value)
    : []);
}

function validateChangedGlobalContracts(files) {
  for (const rawPath of files) {
    const filePath = normalizeRepositoryPath(rawPath);
    if (!GLOBAL_LIBRARY_CONTRACTS.has(filePath)) continue;
    const content = readRepositoryFile(null, filePath);
    if (content == null) continue;
    let contract;
    try {
      contract = JSON.parse(content.replace(/^\uFEFF/, ''));
    } catch (error) {
      throw new Error(`${filePath} is not valid JSON: ${error.message}`);
    }
    if (contract?.schemaVersion !== 1 || !Array.isArray(contract?.allow)) {
      throw new Error(`${filePath} must have schemaVersion 1 and an allow array`);
    }
  }
}

function librariesFromChangedFiles(files, options, currentLibraries = trackedLibraries()) {
  const libraries = new Set();
  for (const rawPath of files) {
    const filePath = normalizeRepositoryPath(rawPath);
    const contractLibrary = libraryFromContractRepositoryPath(filePath);
    if (contractLibrary) libraries.add(contractLibrary);

    const firstSlash = filePath.indexOf('/');
    if (firstSlash > 0) {
      const candidate = filePath.slice(0, firstSlash);
      if (currentLibraries.has(candidate)
          || fileExistsAtRevision(options.base, `${candidate}/block.json`)) {
        libraries.add(candidate);
      }
    }

    if (GLOBAL_LIBRARY_CONTRACTS.has(filePath)) {
      for (const library of librariesInGlobalContract(options.base, filePath)) libraries.add(library);
      for (const library of librariesInGlobalContract(null, filePath)) libraries.add(library);
    }
  }
  return [...libraries].sort();
}

function blockTypesAt(revision, library) {
  const staticBlocks = readJsonAt(revision, `${library}/block.json`);
  if (!Array.isArray(staticBlocks)) return new Set();
  const contract = readJsonAt(revision, `${CONTRACT_REPOSITORY_PREFIX}${library}.json`);
  try {
    return new Set(allDocumentedBlocks(staticBlocks, contract).map(block => block?.type).filter(Boolean));
  } catch {
    return new Set(staticBlocks.map(block => block?.type).filter(Boolean));
  }
}

function abiChangedLibraries(files) {
  const libraries = new Set();
  for (const rawPath of files) {
    const filePath = normalizeRepositoryPath(rawPath);
    const contractLibrary = libraryFromContractRepositoryPath(filePath);
    if (contractLibrary) libraries.add(contractLibrary);
    if (/^[^/]+\/block\.json$/.test(filePath)) libraries.add(filePath.split('/')[0]);
  }
  return [...libraries];
}

function currentBlockTypes(libraries, revision) {
  const types = new Set();
  for (const library of libraries) {
    for (const type of blockTypesAt(revision, library)) types.add(type);
  }
  return types;
}

function changedAbiTypes(files, options) {
  const types = new Set();
  for (const library of abiChangedLibraries(files)) {
    for (const type of blockTypesAt(options.base, library)) types.add(type);
    for (const type of blockTypesAt(null, library)) types.add(type);
  }
  return types;
}

function callerLibraries(types, revision, libraries = trackedLibraries()) {
  if (types.size === 0) return new Set();
  const callers = new Set();
  for (const library of libraries) {
    const content = readRepositoryFile(revision, `${library}/readme_ai.md`)
      ?? readRepositoryFile(revision, `${library}/README_AI.md`);
    if (content == null) continue;
    if (exampleRegions(content).some(region => calledTypes(region, types).size > 0)) {
      callers.add(library);
    }
  }
  return callers;
}

function libraryArguments(libraries) {
  return libraries.flatMap(library => ['--library', library]);
}

function runNodeCheck(label, script, args) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, [path.join(ROOT, script), ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${label} failed with exit code ${result.status}`);
}

function printUsage() {
  console.log(`Usage:
  node .scripts/check-changed-readme-governance.js --base <revision> --head <revision>
  node .scripts/check-changed-readme-governance.js --head <revision>
  node .scripts/check-changed-readme-governance.js

With no revisions, staged, unstaged, and untracked workspace files are inspected.`);
}

function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`[readme-changed:error] ${error.message}`);
    process.exitCode = 1;
    return;
  }
  if (options.help) {
    printUsage();
    return;
  }

  try {
    const files = changedFiles(options);
    validateChangedGlobalContracts(files);
    const currentLibrariesSet = trackedLibraries();
    const directlyAffected = librariesFromChangedFiles(files, options, currentLibrariesSet);
    const existingAffected = directlyAffected.filter(library => currentLibrariesSet.has(library));
    const abiTypes = changedAbiTypes(files, options);
    const callers = callerLibraries(abiTypes, null, currentLibrariesSet);
    const crossCheckLibraries = [...new Set([...existingAffected, ...callers])].sort();
    const allCurrentTypes = currentBlockTypes(currentLibrariesSet, null);
    const removedTypes = new Set([...abiTypes].filter(type => !allCurrentTypes.has(type)));
    const removedTypeCallers = callerLibraries(removedTypes, null, currentLibrariesSet);

    console.log(`[readme-changed] changed files: ${files.length}`);
    console.log(`[readme-changed] directly affected libraries: ${existingAffected.join(', ') || '(none)'}`);
    console.log(`[readme-changed] cross-library callers: ${[...callers].filter(library => !existingAffected.includes(library)).sort().join(', ') || '(none)'}`);

    if (removedTypeCallers.size > 0) {
      throw new Error(
        `README ABS examples still call removed block types (${[...removedTypes].sort().join(', ')}): ${[...removedTypeCallers].sort().join(', ')}`,
      );
    }
    if (existingAffected.length === 0) {
      console.log('[readme-changed] no existing changed libraries require README contract checks');
      return;
    }

    runNodeCheck(
      'Changed library README contracts',
      '.scripts/check-readme-compliance.js',
      [...existingAffected, '--strict-abs', '--ai-only'],
    );
    runNodeCheck(
      'Changed library dynamic shapes',
      '.scripts/check-readme-dynamic-shapes.js',
      ['--strict', ...libraryArguments(existingAffected)],
    );
    runNodeCheck(
      'Changed library generator coverage',
      '.scripts/check-library-generator-coverage.js',
      ['--strict', ...libraryArguments(existingAffected)],
    );
    runNodeCheck(
      'Changed library README candidates',
      '.scripts/generate-readme-candidate.js',
      existingAffected,
    );
    runNodeCheck(
      'Repository cross-library examples affected by this change',
      '.scripts/check-readme-cross-library-examples.js',
      libraryArguments(crossCheckLibraries),
    );
    runNodeCheck(
      'Changed library candidate cross-library examples',
      '.scripts/check-readme-cross-library-examples.js',
      ['--readme-root', '.temp/readme-candidates', ...libraryArguments(existingAffected)],
    );
    console.log('\n[readme-changed] all incremental README governance checks passed');
  } catch (error) {
    console.error(`\n[readme-changed:error] ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = {
  abiChangedLibraries,
  blockTypesAt,
  callerLibraries,
  changedAbiTypes,
  changedFiles,
  librariesFromChangedFiles,
  normalizeRepositoryPath,
  parseArgs,
  validateChangedGlobalContracts,
};
