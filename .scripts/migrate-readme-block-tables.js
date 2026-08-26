#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  compareAiAbsContracts,
  generateBlockTableRow,
  paramsDescriptionForBlock,
  validateAbsCall,
  allDocumentedBlocks,
  blockContractFor,
  AI_HARD_MAX_BYTES,
} = require('./check-readme-compliance');
const { loadLibraryContract } = require('./readme-library-contracts');

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

function tableRowInfo(line, knownBlocks) {
  const cells = line.split('|');
  if (cells.length < 7) return null;
  const blockMatch = cells[1].trim().match(/^`([^`]+)`$/);
  if (!blockMatch || !knownBlocks.has(blockMatch[1])) return null;
  const absCell = cells[4];
  const firstTick = absCell.indexOf('`');
  const lastTick = absCell.lastIndexOf('`');
  return {
    blockType: blockMatch[1],
    call: firstTick >= 0 && lastTick > firstTick ? absCell.slice(firstTick + 1, lastTick) : null,
    cells,
    absCell,
    paramsCell: cells[3],
    firstTick,
    lastTick,
  };
}

function callFromGeneratedRow(row, knownBlocks) {
  return tableRowInfo(row, knownBlocks)?.call || null;
}

function hasUncontractedRuntimeShape(block, blockContract) {
  if (blockContract) return false;
  return Boolean(block?.mutator) || (Array.isArray(block?.extensions) && block.extensions.length > 0);
}

function isRepairableFinding(message) {
  return /contains non-executable "\.\.\." placeholder$/.test(message)
    || /missing [A-Za-z_][A-Za-z0-9_]*\([^)]+\) example$/.test(message)
    || /is [A-Za-z_][A-Za-z0-9_]*, not a value-input block$/.test(message)
    || /is field_variable and must /.test(message)
    || /has unbalanced parentheses$/.test(message)
    || /is not an ABS block call$/.test(message)
    || / must be one of /.test(message)
    || / must be TRUE or FALSE$/.test(message)
    || / must be a numeric field value$/.test(message)
    || / must use structured JSON (?:array|object)$/.test(message);
}

function canonicalRow(block, generatorContent, blockContract, knownBlocks) {
  const row = generateBlockTableRow(block, generatorContent, false, blockContract);
  const call = callFromGeneratedRow(row, knownBlocks);
  if (!call) return null;
  const findings = validateAbsCall(block, call, `Block Definitions ${block.type}`, true, blockContract);
  return findings.length === 0 ? { row, call } : null;
}

function findTableEnd(lines, knownBlocks) {
  let firstRow = lines.findIndex(line => Boolean(tableRowInfo(line, knownBlocks)));
  if (firstRow < 0) {
    firstRow = lines.findIndex(line => /^\s*\|/.test(line) && /ABS\s*(?:Format|格式)/i.test(line));
  }
  if (firstRow < 0) return -1;
  let end = firstRow + 1;
  while (end < lines.length && /^\s*\|/.test(lines[end])) end++;
  return end;
}

function insertCanonicalTable(lines, rows) {
  const header = [
    '| Block Type | Connection | Parameters (args order) | ABS Format | Generated Code |',
    '|------------|------------|-------------------------|------------|----------------|',
    ...rows,
  ];
  const blockDefinitions = lines.findIndex(line => /^##\s+Block Definitions\s*$/i.test(line));
  if (blockDefinitions >= 0) {
    let sectionEnd = blockDefinitions + 1;
    while (sectionEnd < lines.length && !/^##\s+/.test(lines[sectionEnd])) sectionEnd++;
    lines.splice(sectionEnd, 0, '', '### Canonical ABS Signatures', '', ...header);
    return;
  }
  const absExamples = lines.findIndex(line => /^##\s+ABS Examples\s*$/i.test(line));
  const insertion = absExamples >= 0 ? absExamples : lines.length;
  lines.splice(insertion, 0, ...(insertion > 0 && lines[insertion - 1] ? [''] : []), '## Block Definitions', '', ...header, '');
}

function rewriteReadmeBlockTables(content, blocks, generatorContent = '', contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const eol = String(content).includes('\r\n') ? '\r\n' : '\n';
  const hadFinalEol = String(content).endsWith('\n');
  const lines = String(content).split(/\r?\n/);
  if (hadFinalEol && lines[lines.length - 1] === '') lines.pop();
  const blockByType = new Map((blocks || []).map(block => [block?.type, block]).filter(([type]) => type));
  const knownBlocks = new Set(blockByType.keys());
  const existingRows = new Set();
  let canonicalizedRows = 0;
  let canonicalizedParameters = 0;
  let skippedRuntimeShape = 0;
  let skippedUnsupportedField = 0;

  for (let index = 0; index < lines.length; index++) {
    const info = tableRowInfo(lines[index], knownBlocks);
    if (!info) continue;
    existingRows.add(info.blockType);
    const block = blockByType.get(info.blockType);
    const blockContract = blockContractFor(contract, info.blockType);
    const expectedParams = paramsDescriptionForBlock(block, blockContract);
    const actualParams = String(info.paramsCell || '')
      .replace(/&#124;/g, '|')
      .replace(/\\`/g, '`')
      .replace(/\s+/g, ' ')
      .trim();
    const repairParams = actualParams !== expectedParams;
    const findings = validateAbsCall(
      block,
      info.call,
      `Block Definitions ${info.blockType}`,
      true,
      blockContract,
    );
    const repairCall = findings.length > 0 && findings.every(isRepairableFinding);
    if (!repairParams && !repairCall) continue;
    if (findings.length > 0 && !repairCall) continue;
    if (hasUncontractedRuntimeShape(block, blockContract)) {
      skippedRuntimeShape++;
      continue;
    }
    const canonical = canonicalRow(block, generatorContent, blockContract, knownBlocks);
    if (!canonical) {
      skippedUnsupportedField++;
      continue;
    }
    info.cells[3] = ` ${expectedParams.replace(/\|/g, '&#124;')} `;
    if (repairCall) {
      info.cells[4] = info.firstTick >= 0 && info.lastTick > info.firstTick
        ? `${info.absCell.slice(0, info.firstTick + 1)}${canonical.call}${info.absCell.slice(info.lastTick)}`
        : ` \`${canonical.call}\` `;
      canonicalizedRows++;
    }
    lines[index] = info.cells.join('|');
    if (repairParams) canonicalizedParameters++;
  }

  const missingRows = [];
  for (const block of blocks || []) {
    if (!block?.type || existingRows.has(block.type)) continue;
    const blockContract = blockContractFor(contract, block.type);
    if (hasUncontractedRuntimeShape(block, blockContract)) {
      skippedRuntimeShape++;
      continue;
    }
    const canonical = canonicalRow(block, generatorContent, blockContract, knownBlocks);
    if (!canonical) {
      skippedUnsupportedField++;
      continue;
    }
    missingRows.push(canonical.row);
  }

  let insertedRows = 0;
  let createdCanonicalTable = false;
  if (missingRows.length > 0) {
    const tableEnd = findTableEnd(lines, knownBlocks);
    if (tableEnd >= 0) {
      lines.splice(tableEnd, 0, ...missingRows);
      insertedRows = missingRows.length;
    } else {
      insertCanonicalTable(lines, missingRows);
      insertedRows = missingRows.length;
      createdCanonicalTable = true;
    }
  }

  let canonicalizedHeaders = 0;
  for (let index = 0; index < lines.length; index++) {
    if (/^\s*\|\s*Block Type\s*\|\s*Connection\s*\|\s*Parameters \(args0 order\)/.test(lines[index])) {
      lines[index] = lines[index].replace('Parameters (args0 order)', 'Parameters (block.json order)');
      canonicalizedHeaders++;
    }
  }

  return {
    content: lines.join(eol) + (hadFinalEol ? eol : ''),
    canonicalizedRows,
    canonicalizedParameters,
    canonicalizedHeaders,
    insertedRows,
    createdCanonicalTable,
    skippedRuntimeShape,
    skippedUnsupportedField,
  };
}

function migrate(options) {
  const dirty = dirtyReadmes();
  const files = resolveTargets(options.targets || []);
  const report = {
    mode: options.apply ? 'apply' : 'preview',
    trackedReadmes: files.length,
    scanned: 0,
    changed: 0,
    canonicalizedRows: 0,
    canonicalizedParameters: 0,
    canonicalizedHeaders: 0,
    insertedRows: 0,
    createdCanonicalTables: 0,
    removedFindings: 0,
    skippedRuntimeShape: 0,
    skippedUnsupportedField: 0,
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
    const contract = loadLibraryContract(path.basename(libraryDir));
    const generatorPath = path.join(libraryDir, 'generator.js');
    const generatorContent = fs.existsSync(generatorPath) ? fs.readFileSync(generatorPath, 'utf8') : '';
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    const rewritten = rewriteReadmeBlockTables(before, blocks, generatorContent, contract);
    report.skippedRuntimeShape += rewritten.skippedRuntimeShape;
    report.skippedUnsupportedField += rewritten.skippedUnsupportedField;
    if (rewritten.canonicalizedRows === 0 && rewritten.canonicalizedParameters === 0
      && rewritten.canonicalizedHeaders === 0 && rewritten.insertedRows === 0) continue;
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    if (delta.added.length > 0) {
      throw new Error(`${normalized}: migration adds ABS findings: ${delta.added.join('; ')}`);
    }
    if (delta.removed.length === 0 && rewritten.canonicalizedHeaders === 0) {
      throw new Error(`${normalized}: migration changed table rows without removing an ABS finding`);
    }
    if (Buffer.byteLength(rewritten.content, 'utf8') > AI_HARD_MAX_BYTES) {
      throw new Error(`${normalized}: migration exceeds the ${AI_HARD_MAX_BYTES}-byte README hard limit`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.canonicalizedRows += rewritten.canonicalizedRows;
    report.canonicalizedParameters += rewritten.canonicalizedParameters;
    report.canonicalizedHeaders += rewritten.canonicalizedHeaders;
    report.insertedRows += rewritten.insertedRows;
    if (rewritten.createdCanonicalTable) report.createdCanonicalTables++;
    report.removedFindings += delta.removed.length;
    report.changes.push({
      library: path.basename(libraryDir),
      file: normalized,
      canonicalizedRows: rewritten.canonicalizedRows,
      canonicalizedParameters: rewritten.canonicalizedParameters,
      canonicalizedHeaders: rewritten.canonicalizedHeaders,
      insertedRows: rewritten.insertedRows,
      createdCanonicalTable: rewritten.createdCanonicalTable,
      removedFindings: delta.removed.length,
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
  node .scripts/migrate-readme-block-tables.js [library ...] [--json]
  node .scripts/migrate-readme-block-tables.js [library ...] --apply [--include-dirty] [--json]

The migration repairs only invalid canonical ABS table calls and inserts exact
rows for static blocks. Uncontracted extension/mutator shapes and structured
custom fields are skipped for runtime-backed review.`);
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
      console.log(`Canonicalized invalid table calls: ${report.canonicalizedRows}`);
      console.log(`Canonicalized Parameters cells: ${report.canonicalizedParameters}`);
      console.log(`Canonicalized table headers: ${report.canonicalizedHeaders}`);
      console.log(`Inserted missing static rows: ${report.insertedRows}`);
      console.log(`Created canonical table sections: ${report.createdCanonicalTables}`);
      console.log(`Removed ABS findings: ${report.removedFindings}`);
      console.log(`Skipped uncontracted runtime-shape rows: ${report.skippedRuntimeShape}`);
      console.log(`Skipped structured/unsupported field rows: ${report.skippedUnsupportedField}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
    }
  } catch (error) {
    console.error(`Block table migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { rewriteReadmeBlockTables, migrate };
