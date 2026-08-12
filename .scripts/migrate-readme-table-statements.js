#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { compareAiAbsContracts, allDocumentedBlocks } = require('./check-readme-compliance');

const ROOT = path.resolve(__dirname, '..');
const README_NAME = 'readme_ai.md';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function findMatchingParen(text, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') depth++;
    else if (char === ')' && --depth === 0) return index;
  }
  return -1;
}

function rewriteReadmeTables(content, blocks, contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const knownBlocks = new Set((blocks || []).map(block => block?.type).filter(Boolean));
  let replacements = 0;
  const changedBlockTypes = new Set();
  const rewritten = String(content || '').split(/(?<=\n)/).map(line => {
    const cells = line.split('|');
    if (cells.length < 7) return line;
    const blockMatch = cells[1].trim().match(/^`([^`]+)`$/);
    if (!blockMatch || !knownBlocks.has(blockMatch[1])) return line;
    const absCell = cells[4];
    const firstTick = absCell.indexOf('`');
    const lastTick = absCell.lastIndexOf('`');
    if (firstTick < 0 || lastTick <= firstTick) return line;
    const call = absCell.slice(firstTick + 1, lastTick);
    const openIndex = call.indexOf('(');
    const closeIndex = findMatchingParen(call, openIndex);
    if (openIndex < 0 || closeIndex < 0) return line;
    const trailing = call.slice(closeIndex + 1).trim();
    if (!/^@(?!extra\s*:)[A-Za-z_][A-Za-z0-9_]*(?:\s*:|\b)/.test(trailing)) return line;
    const parentCall = call.slice(0, closeIndex + 1);
    cells[4] = `${absCell.slice(0, firstTick + 1)}${parentCall}${absCell.slice(lastTick)}`;
    replacements++;
    changedBlockTypes.add(blockMatch[1]);
    return cells.join('|');
  }).join('');
  return { content: rewritten, replacements, blockTypes: Array.from(changedBlockTypes) };
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
  const entries = gitOutput(['status', '--porcelain=v1', '-z', '--untracked-files=all'])
    .split('\0').filter(Boolean);
  return new Set(entries.map(entry => normalizeRelative(entry.slice(3))));
}

function resolveTargets(targets) {
  const tracked = trackedReadmes();
  if (targets.length === 0) return tracked;
  const requested = new Set(targets.map(target => normalizeRelative(target).replace(/\/$/, '')));
  return tracked.filter(filePath => requested.has(normalizeRelative(path.dirname(filePath))));
}

function migrate(options) {
  const dirty = dirtyReadmes();
  const files = resolveTargets(options.targets || []);
  const report = {
    mode: options.apply ? 'apply' : 'preview',
    trackedReadmes: files.length,
    scanned: 0,
    changed: 0,
    replacements: 0,
    unmaskedFindings: 0,
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
    const rewritten = rewriteReadmeTables(before, blocks, contract);
    if (rewritten.replacements === 0) continue;
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    const allowedPrefixes = rewritten.blockTypes.map(type => `Block Definitions ${type}:`);
    const unexpectedAdded = delta.added.filter(finding => (
      !allowedPrefixes.some(prefix => finding.startsWith(prefix))
    ));
    if (unexpectedAdded.length > 0) {
      throw new Error(`${normalized}: migration adds unrelated ABS findings: ${unexpectedAdded.join('; ')}`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.replacements += rewritten.replacements;
    report.unmaskedFindings += delta.added.length;
    report.changes.push({
      library: path.basename(libraryDir),
      file: normalized,
      replacements: rewritten.replacements,
      unmaskedFindings: delta.added.length,
    });
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
  node .scripts/migrate-readme-table-statements.js [library ...] [--json]
  node .scripts/migrate-readme-table-statements.js [library ...] --apply [--include-dirty] [--json]

The migration removes only unsupported inline statement suffixes from the ABS
cell of exact Block Definitions rows. Fenced recipes are not modified.`);
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
      console.log(`Removed inline table statement suffixes: ${report.replacements}`);
      console.log(`Previously masked findings exposed: ${report.unmaskedFindings}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
    }
  } catch (error) {
    console.error(`Table statement migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { rewriteReadmeTables, migrate };
