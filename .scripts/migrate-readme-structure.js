#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  compareAiAbsContracts,
  allDocumentedBlocks,
  AI_HARD_MAX_BYTES,
} = require('./check-readme-compliance');
const { loadLibraryContract } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const README_NAME = 'readme_ai.md';
const STANDARD_HEADER = '| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |';

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

function getArgs(block) {
  return Object.keys(block || {}).filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
    .flatMap(key => block[key]);
}

function tableCell(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().replace(/\|/g, '&#124;');
}

function parameterOptionsRows(blocks) {
  const seen = new Set();
  const rows = [];
  for (const block of blocks || []) {
    for (const arg of getArgs(block)) {
      if (arg?.type !== 'field_dropdown' || !arg.name) continue;
      const options = Array.isArray(arg.options)
        ? arg.options.map(option => Array.isArray(option) ? option[1] : option)
        : [arg.options].filter(Boolean);
      const values = options.map(value => String(value));
      const key = `${arg.name}\0${values.join('\0')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(`| ${tableCell(arg.name)} | ${tableCell(values.join(', ') || 'runtime-provided')} | ${tableCell(block.type)} |`);
    }
  }
  return rows;
}

function isBlockHeader(line) {
  const cells = String(line || '').split('|').map(cell => cell.trim().toLowerCase());
  return cells.some(cell => cell === 'block type' || cell === '块类型')
    && cells.some(cell => cell === 'abs format' || cell === 'abs格式')
    && cells.some(cell => cell.startsWith('generated code') || cell === '生成代码');
}

function rewriteReadmeStructure(content, pkg, blocks, contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const eol = String(content).includes('\r\n') ? '\r\n' : '\n';
  const hadFinalEol = String(content).endsWith('\n');
  const lines = String(content).split(/\r?\n/);
  if (hadFinalEol && lines[lines.length - 1] === '') lines.pop();
  let normalizedHeadings = 0;
  let normalizedHeaders = 0;
  let insertedLibraryInfo = 0;
  let insertedBlockHeading = 0;
  let insertedParameterOptions = 0;

  const headingRules = [
    [/^##\s*(?:库信息|Library Information)\s*$/i, '## Library Info'],
    [/^##\s*(?:块定义|積木定義)\s*$/i, '## Block Definitions'],
    [/^##\s*(?:参数选项|參數選項)\s*$/i, '## Parameter Options'],
    [/^##\s*ABS\s*示例\s*$/i, '## ABS Examples'],
  ];
  for (let index = 0; index < lines.length; index++) {
    for (const [pattern, replacement] of headingRules) {
      if (pattern.test(lines[index])) {
        if (lines[index] !== replacement) {
          lines[index] = replacement;
          normalizedHeadings++;
        }
        break;
      }
    }
    if (isBlockHeader(lines[index]) && lines[index] !== STANDARD_HEADER) {
      lines[index] = STANDARD_HEADER;
      normalizedHeaders++;
    }
  }

  if (!lines.some(line => /^##\s+Library Info\s*$/i.test(line))) {
    let insertion = lines.findIndex((line, index) => index > 0 && /^##\s+/.test(line));
    if (insertion < 0) insertion = Math.min(lines.length, 1);
    const name = tableCell(pkg?.name || '@aily-project/library');
    const version = tableCell(pkg?.version || '0.0.0');
    lines.splice(insertion, 0, '## Library Info', `- **Name**: ${name}`, `- **Version**: ${version}`, '');
    insertedLibraryInfo++;
  }

  if (!lines.some(line => /^##\s+Block Definitions\s*$/i.test(line))) {
    const headerIndex = lines.findIndex(isBlockHeader);
    if (headerIndex >= 0) {
      lines.splice(headerIndex, 0, '## Block Definitions', '');
      insertedBlockHeading++;
    }
  }

  const optionRows = parameterOptionsRows(blocks);
  if (optionRows.length > 0 && !lines.some(line => /^##\s+Parameter Options\s*$/i.test(line))) {
    let insertion = lines.findIndex(line => /^##\s+ABS(?:\s+Examples|\s*示例)?\s*$/i.test(line));
    if (insertion < 0) insertion = lines.findIndex(line => /^##\s+Notes\s*$/i.test(line));
    if (insertion < 0) insertion = lines.length;
    lines.splice(insertion, 0,
      '## Parameter Options', '',
      '| Parameter | Values | Description |',
      '|-----------|--------|-------------|',
      ...optionRows,
      '');
    insertedParameterOptions++;
  }

  return {
    content: lines.join(eol) + (hadFinalEol ? eol : ''),
    normalizedHeadings,
    normalizedHeaders,
    insertedLibraryInfo,
    insertedBlockHeading,
    insertedParameterOptions,
  };
}

function migrate(options) {
  const dirty = dirtyReadmes();
  const files = resolveTargets(options.targets || []);
  const report = {
    mode: options.apply ? 'apply' : 'preview', trackedReadmes: files.length, scanned: 0, changed: 0,
    normalizedHeadings: 0, normalizedHeaders: 0, insertedLibraryInfo: 0,
    insertedBlockHeading: 0, insertedParameterOptions: 0, skippedDirty: [], changes: [],
  };
  for (const relativePath of files) {
    const normalized = normalizeRelative(relativePath);
    if (!options.includeDirty && dirty.has(normalized)) { report.skippedDirty.push(normalized); continue; }
    const libraryDir = path.join(ROOT, path.dirname(relativePath));
    const blockPath = path.join(libraryDir, 'block.json');
    const packagePath = path.join(libraryDir, 'package.json');
    if (!fs.existsSync(blockPath)) continue;
    const blocks = JSON.parse(fs.readFileSync(blockPath, 'utf8').replace(/^\uFEFF/, ''));
    const pkg = fs.existsSync(packagePath)
      ? JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\uFEFF/, '')) : {};
    if (!Array.isArray(blocks)) continue;
    const contract = loadLibraryContract(path.basename(libraryDir));
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    const rewritten = rewriteReadmeStructure(before, pkg, blocks, contract);
    const edits = rewritten.normalizedHeadings + rewritten.normalizedHeaders + rewritten.insertedLibraryInfo
      + rewritten.insertedBlockHeading + rewritten.insertedParameterOptions;
    if (edits === 0) continue;
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    if (delta.added.length > 0) throw new Error(`${normalized}: migration adds ABS findings: ${delta.added.join('; ')}`);
    if (Buffer.byteLength(rewritten.content, 'utf8') > AI_HARD_MAX_BYTES) {
      throw new Error(`${normalized}: migration exceeds the ${AI_HARD_MAX_BYTES}-byte README hard limit`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    for (const key of ['normalizedHeadings', 'normalizedHeaders', 'insertedLibraryInfo', 'insertedBlockHeading', 'insertedParameterOptions']) {
      report[key] += rewritten[key];
    }
    report.changes.push({ library: path.basename(libraryDir), file: normalized, ...rewritten, content: undefined });
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
  console.log('Usage: node .scripts/migrate-readme-structure.js [library ...] [--apply] [--include-dirty] [--json]');
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) return printUsage();
    const report = migrate(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else for (const [label, key] of [
      ['Mode', 'mode'], ['Tracked README files', 'trackedReadmes'], ['Scanned README files', 'scanned'],
      ['Changed README files', 'changed'], ['Normalized headings', 'normalizedHeadings'],
      ['Normalized table headers', 'normalizedHeaders'], ['Inserted Library Info sections', 'insertedLibraryInfo'],
      ['Inserted Block Definitions headings', 'insertedBlockHeading'],
      ['Inserted Parameter Options sections', 'insertedParameterOptions'], ['Skipped dirty README files', 'skippedDirty'],
    ]) console.log(`${label}: ${Array.isArray(report[key]) ? report[key].length : report[key]}`);
  } catch (error) {
    console.error(`README structure migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { rewriteReadmeStructure, migrate };
