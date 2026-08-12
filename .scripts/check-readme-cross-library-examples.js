#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  validateAbsCall,
  fencedCodeBlocks,
  unfencedAbsExampleBlocks,
  callsOfType,
  allDocumentedBlocks,
  blockContractFor,
} = require('./check-readme-compliance');
const { loadLibraryContract } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

function trackedLibraries() {
  const output = execFileSync('git', ['ls-files', '-z', '*/block.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return [...new Set(output.split('\0').filter(Boolean).map(file => file.split('/')[0]))].sort();
}

function visibleArgs(block) {
  return Object.keys(block)
    .filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
    .flatMap(key => block[key])
    .filter(arg => arg && arg.name && ![
      'input_dummy',
      'input_statement',
      'field_image',
      'field_label',
      'field_label_serializable',
    ].includes(arg.type));
}

function loadContract(libDir) {
  return loadLibraryContract(path.basename(libDir)) || {};
}

function runtimeShapeIsDocumentable(block, contractForBlock) {
  if (contractForBlock && contractForBlock.staticShape === true) return true;
  if (Array.isArray(contractForBlock?.variants)) {
    return contractForBlock.variants.some(variant => variant?.document !== false);
  }
  // A mutator-only block with no static arguments (for example text_join)
  // has no deterministic signature until workspace mutation state is known.
  return !(block.mutator && visibleArgs(block).length === 0);
}

function exampleRegions(content) {
  const fenced = fencedCodeBlocks(content);
  const unfenced = unfencedAbsExampleBlocks(content);
  return [...fenced, ...unfenced];
}

function calledTypes(text, knownTypes) {
  const found = new Set();
  const matcher = /\b([A-Za-z0-9_]*)\s*\(/g;
  let match;
  while ((match = matcher.exec(text))) {
    if (knownTypes.has(match[1])) found.add(match[1]);
  }
  return found;
}

function acceptedValueNames(candidate) {
  const names = new Set(visibleArgs(candidate.block)
    .filter(arg => arg.type === 'input_value')
    .map(arg => arg.name));
  const variants = Array.isArray(candidate.contract?.variants) ? candidate.contract.variants : [];
  for (const variant of variants) {
    for (const arg of Array.isArray(variant?.appendArgs) ? variant.appendArgs : []) {
      if (arg?.type === 'input_value' && arg.name) names.add(arg.name);
    }
  }
  return names;
}

function acceptsValueName(candidate, name, accepted = acceptedValueNames(candidate)) {
  if (accepted.has(name)) return true;
  const variadics = Array.isArray(candidate.contract?.variadic)
    ? candidate.contract.variadic
    : (candidate.contract?.variadic ? [candidate.contract.variadic] : []);
  return variadics.some(item => {
    const escaped = String(item?.prefix || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = name.match(new RegExp(`^${escaped}(\\d+)$`));
    return match && Number(match[1]) >= Number(item.startIndex || 0) && item.type === 'input_value';
  });
}

function candidateAbiSignature(candidate) {
  const args = visibleArgs(candidate.block).map(arg => ({
    name: arg.name,
    type: arg.type,
    check: arg.check ?? null,
    named: arg.named === true,
    options: arg.type === 'field_dropdown' && Array.isArray(arg.options)
      ? arg.options.map(option => Array.isArray(option) ? option[1] : option)
      : null,
  }));
  const connection = candidate.block.output !== undefined
    ? 'output'
    : candidate.block.previousStatement !== undefined
      ? 'statement'
      : 'hat';
  const variants = Array.isArray(candidate.contract?.variants)
    ? candidate.contract.variants.filter(variant => variant?.document !== false).map(variant => ({
      when: variant.when || {},
      appendArgs: (variant.appendArgs || []).map(arg => ({
        name: arg.name,
        type: arg.type,
        named: arg.named === true,
        required: arg.required === true,
      })),
    }))
    : [];
  const variadics = (Array.isArray(candidate.contract?.variadic)
    ? candidate.contract.variadic
    : (candidate.contract?.variadic ? [candidate.contract.variadic] : []))
    .map(item => ({ prefix: item?.prefix, startIndex: item?.startIndex, type: item?.type }));
  return JSON.stringify({ args, connection, variants, variadics });
}

function callWithNamedValueInputs(region, call, candidate) {
  const lines = String(region || '').split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!line.trim().startsWith(call)) continue;
    const parentIndent = line.match(/^\s*/)[0].length;
    let markerIndent = null;
    const named = [];
    const accepted = acceptedValueNames(candidate);
    for (let childIndex = index + 1; childIndex < lines.length; childIndex++) {
      const childLine = lines[childIndex];
      if (!childLine.trim() || childLine.trim().startsWith('#')) continue;
      const childIndent = childLine.match(/^\s*/)[0].length;
      if (childIndent <= parentIndent) break;
      if (markerIndent == null) {
        if (!childLine.trim().startsWith('@')) return call;
        markerIndent = childIndent;
      }
      if (childIndent !== markerIndent) continue;
      const marker = childLine.trim().match(/^@(\w+):\s*(.+)$/);
      if (marker && acceptsValueName(candidate, marker[1], accepted)) named.push(`${marker[1]}=${marker[2]}`);
    }
    if (named.length === 0) return call;
    const open = call.indexOf('(');
    const existing = call.slice(open + 1, -1).trim();
    return `${call.slice(0, -1)}${existing ? ', ' : ''}${named.join(', ')})`;
  }
  return call;
}

function main(argv = process.argv.slice(2)) {
  const rootIndex = argv.indexOf('--readme-root');
  if (rootIndex >= 0 && !argv[rootIndex + 1]) {
    console.error('[error] --readme-root requires a directory');
    process.exitCode = 1;
    return;
  }
  const readmeRoot = rootIndex >= 0
    ? path.resolve(ROOT, argv[rootIndex + 1])
    : ROOT;
  const libraries = trackedLibraries();
  const catalog = new Map();
  const libraryData = new Map();

  for (const libName of libraries) {
    const libDir = path.join(ROOT, libName);
    const staticBlocks = readJson(path.join(libDir, 'block.json'));
    if (!Array.isArray(staticBlocks)) continue;
    const contract = loadContract(libDir);
    const blocks = allDocumentedBlocks(staticBlocks, contract);
    libraryData.set(libName, { blocks, contract });
    for (const block of blocks) {
      if (!block || !block.type) continue;
      if (!catalog.has(block.type)) catalog.set(block.type, []);
      catalog.get(block.type).push({
        libName,
        block,
        contract: blockContractFor(contract, block.type),
      });
    }
  }

  const findings = [];
  const knownTypes = new Set(catalog.keys());
  const duplicateCatalogTypes = [...catalog.values()].filter(candidates => candidates.length > 1).length;
  const conflictingDuplicateTypes = [...catalog.values()].filter(candidates =>
    candidates.length > 1 && new Set(candidates.map(candidateAbiSignature)).size > 1).length;
  let checkedCalls = 0;
  let checkedLibraries = 0;
  let ambiguousExternalCalls = 0;

  for (const [libName, data] of libraryData) {
    const readmePath = path.join(readmeRoot, libName, 'readme_ai.md');
    if (!fs.existsSync(readmePath)) continue;
    const content = fs.readFileSync(readmePath, 'utf8').replace(/^\uFEFF/, '');
    const ownTypes = new Set(data.blocks.map(block => block.type));
    const regions = exampleRegions(content);
    checkedLibraries++;

    regions.forEach((region, regionIndex) => {
      for (const type of calledTypes(region, knownTypes)) {
        if (ownTypes.has(type)) continue;
        for (const call of callsOfType(region, type)) {
          const candidates = (catalog.get(type) || []).filter(candidate =>
            runtimeShapeIsDocumentable(candidate.block, candidate.contract));
          if (candidates.length === 0) continue;
          checkedCalls++;
          const location = `${libName}/readme_ai.md ABS example ${regionIndex + 1}: ${call}`;
          const candidateResults = candidates.map(candidate => ({
            candidate,
            messages: validateAbsCall(
              candidate.block,
              callWithNamedValueInputs(region, call, candidate),
              location,
              true,
              candidate.contract,
            ),
          }));
          const successful = candidateResults.filter(result => result.messages.length === 0);
          if (successful.length > 0) {
            const successfulSignatures = new Set(successful.map(result => candidateAbiSignature(result.candidate)));
            if (successfulSignatures.size > 1) {
              ambiguousExternalCalls++;
              findings.push(`${location} matches multiple incompatible library owners: ${successful.map(result => result.candidate.libName).join(', ')}`);
            }
            continue;
          }
          candidateResults.sort((left, right) => left.messages.length - right.messages.length);
          findings.push(...candidateResults[0].messages);
        }
      }
    });
  }

  const sourceLabel = readmeRoot === ROOT ? 'repository' : path.relative(ROOT, readmeRoot);
  console.log(`Cross-library README_AI examples (${sourceLabel}): ${checkedLibraries} libraries, ${checkedCalls} external calls, ${findings.length} errors`);
  console.log(`Duplicate block types (all/incompatible ABI): ${duplicateCatalogTypes}/${conflictingDuplicateTypes}; ambiguous external calls: ${ambiguousExternalCalls}`);
  for (const finding of findings) console.log(`  [error] ${finding}`);
  if (findings.length > 0) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  callWithNamedValueInputs,
  runtimeShapeIsDocumentable,
};
