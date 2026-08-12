#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  AI_HARD_MAX_BYTES,
  compareAiAbsContracts,
  validateAiAbsContracts,
  validateAbsCall,
  allDocumentedBlocks,
  blockContractFor,
} = require('./check-readme-compliance');

const ROOT = path.resolve(__dirname, '..');
const README_NAME = 'readme_ai.md';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function gitOutput(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function normalizeRelative(filePath) {
  return filePath.replace(/\\/g, '/');
}

function trackedReadmes() {
  return gitOutput(['ls-files']).split(/\r?\n/).map(line => line.trim()).filter(Boolean)
    .filter(filePath => normalizeRelative(filePath).toLowerCase().endsWith(`/${README_NAME}`));
}

function dirtyReadmes() {
  return new Set(gitOutput(['status', '--porcelain=v1', '-z', '--untracked-files=all'])
    .split('\0').filter(Boolean).map(entry => normalizeRelative(entry.slice(3))));
}

function resolveTargets(targets) {
  const tracked = trackedReadmes();
  if (targets.length === 0) return tracked;
  const requested = new Set(targets.map(target => normalizeRelative(target).replace(/\/$/, '')));
  return tracked.filter(filePath => requested.has(normalizeRelative(path.dirname(filePath))));
}

function argsOf(block) {
  return Object.keys(block || {})
    .filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)))
    .flatMap(key => block[key]);
}

function tableCalls(content, blocks, contract) {
  const blockByType = new Map(blocks.map(block => [block.type, block]));
  const calls = [];
  for (const line of String(content || '').split(/\r?\n/)) {
    const cells = line.split('|');
    if (cells.length < 7) continue;
    const typeMatch = cells[1].trim().match(/^`([^`]+)`$/);
    const block = typeMatch ? blockByType.get(typeMatch[1]) : null;
    if (!block) continue;
    const absCell = cells[4].trim();
    const first = absCell.indexOf('`');
    const last = absCell.lastIndexOf('`');
    if (first < 0 || last <= first) continue;
    const call = absCell.slice(first + 1, last);
    const blockContract = blockContractFor(contract, block.type);
    if (validateAbsCall(block, call, `Block Definitions ${block.type}`, true, blockContract).length === 0) {
      calls.push({ block, call });
    }
  }
  return calls;
}

function isHat(block) {
  const hasStatement = argsOf(block).some(arg => arg?.type === 'input_statement');
  return block.output === undefined
    && block.previousStatement === undefined
    && block.nextStatement === undefined
    && hasStatement;
}

function exampleFor(candidate) {
  const { block, call } = candidate;
  const statement = argsOf(block).find(arg => arg?.type === 'input_statement' && arg.name);
  if (isHat(block)) {
    return statement
      ? `${call}\n    @${statement.name}:\n        serial_println(Serial, text("event"))`
      : call;
  }
  if (block.output !== undefined) {
    return `arduino_loop()\n    serial_println(Serial, ${call})`;
  }
  const root = /(?:^|_)(?:init|setup|begin|create|config|attach)(?:_|$)/i.test(block.type)
    ? 'arduino_setup'
    : 'arduino_loop';
  const child = statement
    ? `\n        @${statement.name}:\n            serial_println(Serial, text("event"))`
    : '';
  return `${root}()\n    ${call}${child}`;
}

function chooseExample(content, blocks, contract) {
  const candidates = tableCalls(content, blocks, contract);
  const rank = candidate => {
    const { block } = candidate;
    if (/(?:^|_)(?:init|setup|begin|create)(?:_|$)/i.test(block.type) && !isHat(block)) return 0;
    if (block.output === undefined && !isHat(block)) return 1;
    if (block.output !== undefined) return 2;
    return 3;
  };
  candidates.sort((left, right) => rank(left) - rank(right));
  return candidates.length > 0 ? exampleFor(candidates[0]) : null;
}

function rewriteReadmeExamples(content, blocks, contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const before = String(content || '');
  const missingFinding = 'ABS examples: missing fenced executable example';
  const example = chooseExample(before, blocks, contract);
  if (!example) return { content: before, addedExample: false };
  const eol = before.includes('\r\n') ? '\r\n' : '\n';
  const suffix = [
    '',
    '## ABS Examples',
    '',
    '### Minimal Executable Usage',
    '',
    '```abs',
    example,
    '```',
    '',
  ].join(eol);
  const rewritten = before.replace(/\s*$/, '') + suffix;
  const delta = compareAiAbsContracts(before, blocks, rewritten, blocks, contract, contract);
  if (delta.added.length > 0 || !delta.removed.some(item => item === missingFinding)) {
    return { content: before, addedExample: false };
  }
  return { content: rewritten, addedExample: true, removedFindings: delta.removed.length };
}

function migrate(options) {
  const dirty = dirtyReadmes();
  const files = resolveTargets(options.targets || []);
  const report = {
    mode: options.apply ? 'apply' : 'preview',
    trackedReadmes: files.length,
    scanned: 0,
    changed: 0,
    addedExamples: 0,
    removedFindings: 0,
    skippedNoSafeCall: 0,
    skippedDirty: [],
    changes: [],
  };
  for (const relativePath of files) {
    const normalized = normalizeRelative(relativePath);
    if (!options.includeDirty && dirty.has(normalized)) {
      report.skippedDirty.push(normalized);
      continue;
    }
    const libraryDir = path.join(ROOT, path.dirname(relativePath));
    const blockPath = path.join(libraryDir, 'block.json');
    if (!fs.existsSync(blockPath)) continue;
    const blocks = readJson(blockPath);
    if (!Array.isArray(blocks)) continue;
    const contractPath = path.join(libraryDir, 'readme_ai.contract.json');
    const contract = fs.existsSync(contractPath) ? readJson(contractPath) : null;
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    if (!validateAiAbsContracts(before, blocks, contract).includes('ABS examples: missing fenced executable example')) {
      continue;
    }
    const rewritten = rewriteReadmeExamples(before, blocks, contract);
    if (!rewritten.addedExample) {
      report.skippedNoSafeCall++;
      continue;
    }
    if (Buffer.byteLength(rewritten.content, 'utf8') > AI_HARD_MAX_BYTES) {
      throw new Error(`${normalized}: example migration exceeds the ${AI_HARD_MAX_BYTES}-byte README hard limit`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.addedExamples++;
    report.removedFindings += rewritten.removedFindings;
    report.changes.push({ library: path.basename(libraryDir), file: normalized });
  }
  return report;
}

function parseArgs(argv) {
  const options = { apply: false, includeDirty: false, json: false, targets: [] };
  for (const arg of argv) {
    if (arg === '--apply') options.apply = true;
    else if (arg === '--include-dirty') options.includeDirty = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else options.targets.push(arg);
  }
  return options;
}

function printUsage() {
  console.log(`Usage:
  node .scripts/migrate-readme-examples.js [library ...] [--json]
  node .scripts/migrate-readme-examples.js [library ...] --apply [--include-dirty] [--json]

Adds one minimal fenced ABS recipe only when an existing canonical table call
validates against the static/runtime contract. Existing prose and examples are preserved.`);
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) return printUsage();
    const report = migrate(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Mode: ${report.mode}`);
      console.log(`Tracked README files: ${report.trackedReadmes}`);
      console.log(`Scanned README files: ${report.scanned}`);
      console.log(`Changed README files: ${report.changed}`);
      console.log(`Added minimal executable examples: ${report.addedExamples}`);
      console.log(`Removed ABS findings: ${report.removedFindings}`);
      console.log(`Skipped libraries without a safe canonical call: ${report.skippedNoSafeCall}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
    }
  } catch (error) {
    console.error(`README example migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { rewriteReadmeExamples, chooseExample, migrate };
