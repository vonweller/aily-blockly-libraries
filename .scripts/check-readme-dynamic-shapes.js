#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  allDocumentedBlocks,
  blockContractFor,
  runtimeBlockDefinitions,
} = require('./check-readme-compliance');

const ROOT = path.resolve(__dirname, '..');

function gitOutput(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function visibleSlotNames(block) {
  return new Set(Object.keys(block)
    .filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
    .flatMap(key => block[key])
    .filter(arg => arg?.name && ![
      'input_dummy', 'field_image', 'field_label', 'field_label_serializable',
    ].includes(arg.type))
    .map(arg => arg.name));
}

function dynamicHooks(block) {
  const hooks = [];
  if (typeof block?.extension === 'string') hooks.push(block.extension);
  if (Array.isArray(block?.extensions)) hooks.push(...block.extensions.filter(value => typeof value === 'string'));
  if (typeof block?.mutator === 'string') hooks.push(block.mutator);
  return [...new Set(hooks)];
}

function stripJsComments(source) {
  let output = '';
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
        output += char;
      } else output += ' ';
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        output += '  ';
        index++;
      } else output += char === '\n' ? '\n' : ' ';
      continue;
    }
    if (quote) {
      output += char;
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      output += char;
    } else if (char === '/' && next === '/') {
      lineComment = true;
      output += '  ';
      index++;
    } else if (char === '/' && next === '*') {
      blockComment = true;
      output += '  ';
      index++;
    } else output += char;
  }
  return output;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < source.length; index++) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') quote = char;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return index;
  }
  return -1;
}

function generatorFunction(source, blockType, seen = new Set()) {
  if (!source || seen.has(blockType)) return null;
  seen.add(blockType);
  const clean = stripJsComments(source);
  const escaped = blockType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const direct = new RegExp(
    `Arduino\\.forBlock\\s*\\[\\s*(['"])${escaped}\\1\\s*\\]\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{`,
  ).exec(clean);
  if (direct) {
    const open = direct.index + direct[0].lastIndexOf('{');
    const close = findMatchingBrace(clean, open);
    return close >= 0 ? clean.slice(open + 1, close) : null;
  }
  const alias = new RegExp(
    `Arduino\\.forBlock\\s*\\[\\s*(['"])${escaped}\\1\\s*\\]\\s*=\\s*Arduino\\.forBlock\\s*\\[\\s*(['"])([^'"]+)\\2\\s*\\]`,
  ).exec(clean);
  return alias ? generatorFunction(source, alias[3], seen) : null;
}

function generatorReads(functionBody) {
  if (!functionBody) return { literal: [], computed: [] };
  const literal = new Set();
  const computed = new Set();
  const literalPatterns = [
    /block\.(?:getFieldValue|getField|getInputTargetBlock)\s*\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g,
    /(?:generator|Arduino)\.(?:valueToCode|statementToCode)\s*\(\s*block\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g,
  ];
  for (const pattern of literalPatterns) {
    for (const match of functionBody.matchAll(pattern)) literal.add(match[1]);
  }
  const computedPatterns = [
    /(?:valueToCode|statementToCode)\s*\(\s*block\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\+/g,
    /(?:valueToCode|statementToCode)\s*\(\s*block\s*,\s*`([A-Za-z_][A-Za-z0-9_]*)\$\{/g,
    /block\.(?:getFieldValue|getField|getInputTargetBlock)\s*\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\+/g,
    /block\.(?:getFieldValue|getField|getInputTargetBlock)\s*\(\s*`([A-Za-z_][A-Za-z0-9_]*)\$\{/g,
  ];
  for (const pattern of computedPatterns) {
    for (const match of functionBody.matchAll(pattern)) computed.add(match[1]);
  }
  // The literal regex also sees the quoted prefix in expressions such as
  // "INPUT" + i. That is a pattern, not a real slot named INPUT.
  for (const prefix of computed) literal.delete(prefix);
  return { literal: [...literal].sort(), computed: [...computed].sort() };
}

function contractCoverage(blockContract) {
  const literal = new Set();
  for (const variant of blockContract?.variants || []) {
    for (const arg of variant?.appendArgs || []) {
      if (arg?.name) literal.add(arg.name);
    }
  }
  const variadic = new Set();
  const variadics = Array.isArray(blockContract?.variadic)
    ? blockContract.variadic
    : (blockContract?.variadic ? [blockContract.variadic] : []);
  for (const item of variadics) if (item?.prefix) variadic.add(item.prefix);
  return { literal, variadic };
}

function auditLibrary(library) {
  const libraryDir = path.join(ROOT, library);
  const staticBlocks = readJson(path.join(libraryDir, 'block.json'));
  const generatorPath = path.join(libraryDir, 'generator.js');
  const generator = fs.existsSync(generatorPath) ? fs.readFileSync(generatorPath, 'utf8') : '';
  const contractPath = path.join(libraryDir, 'readme_ai.contract.json');
  const contract = fs.existsSync(contractPath) ? readJson(contractPath) : null;
  const blocks = allDocumentedBlocks(staticBlocks, contract);
  const runtimeTypes = new Set(runtimeBlockDefinitions(contract).map(block => block.type));
  const results = [];

  for (const block of blocks) {
    const hooks = dynamicHooks(block);
    if (hooks.length === 0 && !runtimeTypes.has(block.type)) continue;
    const blockContract = blockContractFor(contract, block.type);
    const staticSlots = visibleSlotNames(block);
    const reads = generatorReads(generatorFunction(generator, block.type));
    const missingLiteralReads = reads.literal.filter(name => !staticSlots.has(name));
    const coverage = contractCoverage(blockContract);
    const uncoveredLiteralReads = missingLiteralReads.filter(name => !coverage.literal.has(name));
    const uncoveredComputedReads = reads.computed.filter(prefix => (
      !coverage.variadic.has(prefix)
      && ![...coverage.literal].some(name => name.startsWith(prefix))
    ));
    results.push({
      blockType: block.type,
      hooks,
      contract: blockContract
        ? (blockContract.staticShape === true
          ? 'staticShape'
          : (Array.isArray(blockContract.excludedRuntimeArgs) ? 'excludedRuntimeArgs' : 'dynamic'))
        : 'missing',
      missingLiteralReads,
      computedReads: reads.computed,
      uncoveredLiteralReads,
      uncoveredComputedReads,
    });
  }
  return results;
}

function auditAll() {
  const libraries = gitOutput(['ls-files', '-z', '*/block.json']).split('\0').filter(Boolean)
    .map(filePath => filePath.replace(/\\/g, '/').split('/')[0]);
  const details = [];
  for (const library of libraries) {
    for (const result of auditLibrary(library)) details.push({ library, ...result });
  }
  const findings = details.filter(result => (
    result.contract === 'missing'
    || result.uncoveredLiteralReads.length > 0
    || result.uncoveredComputedReads.length > 0
  ));
  return {
    libraries: libraries.length,
    dynamicBlocks: details.length,
    contractedDynamicBlocks: details.filter(result => result.contract !== 'missing').length,
    missingContracts: details.filter(result => result.contract === 'missing').length,
    uncoveredLiteralReads: details.filter(result => result.uncoveredLiteralReads.length > 0).length,
    uncoveredComputedReads: details.filter(result => result.uncoveredComputedReads.length > 0).length,
    findings,
    details,
  };
}

function main() {
  const options = new Set(process.argv.slice(2));
  const report = auditAll();
  if (options.has('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Tracked libraries: ${report.libraries}`);
    console.log(`Dynamic blocks: ${report.dynamicBlocks}`);
    console.log(`Contracted dynamic blocks: ${report.contractedDynamicBlocks}`);
    console.log(`Missing contracts: ${report.missingContracts}`);
    console.log(`Uncovered literal generator reads: ${report.uncoveredLiteralReads}`);
    console.log(`Uncovered computed generator reads: ${report.uncoveredComputedReads}`);
    for (const finding of report.findings) {
      const reasons = [];
      if (finding.contract === 'missing') reasons.push('missing contract');
      if (finding.uncoveredLiteralReads.length) reasons.push(`slots=${finding.uncoveredLiteralReads.join(',')}`);
      if (finding.uncoveredComputedReads.length) reasons.push(`variadic=${finding.uncoveredComputedReads.join(',')}*`);
      console.log(`- ${finding.library}/${finding.blockType}: ${reasons.join('; ')}`);
    }
  }
  if (options.has('--strict') && report.findings.length > 0) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = {
  auditAll,
  auditLibrary,
  dynamicHooks,
  generatorFunction,
  generatorReads,
  stripJsComments,
};
