#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  absFormat,
  compareAiAbsContracts,
  validateAbsCall,
  allDocumentedBlocks,
  blockContractFor,
  AI_HARD_MAX_BYTES,
} = require('./check-readme-compliance');
const { loadLibraryContract } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const README_NAME = 'readme_ai.md';

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

function callsOnLine(line, blockByType) {
  const matches = [];
  for (const [type, block] of blockByType) {
    let from = 0;
    while (from < line.length) {
      const start = line.indexOf(`${type}(`, from);
      if (start < 0) break;
      const before = start > 0 ? line[start - 1] : '';
      if (before && /[A-Za-z0-9_]/.test(before)) {
        from = start + type.length;
        continue;
      }
      const open = start + type.length;
      const end = findMatchingParen(line, open);
      if (end < 0) break;
      matches.push({ start, end: end + 1, type, block, call: line.slice(start, end + 1) });
      from = start + type.length + 1;
    }
  }
  return matches.sort((left, right) => {
    const leftLength = left.end - left.start;
    const rightLength = right.end - right.start;
    return leftLength - rightLength || right.start - left.start;
  });
}

function rewriteExampleLine(line, blockByType, contract) {
  let output = line;
  let replacements = 0;
  const repairedTypes = new Set();
  for (let guard = 0; guard < 50; guard++) {
    const match = callsOnLine(output, blockByType).find(candidate => {
      const blockContract = blockContractFor(contract, candidate.type);
      return validateAbsCall(candidate.block, candidate.call, candidate.type, true, blockContract).length > 0;
    });
    if (!match) break;
    const blockContract = blockContractFor(contract, match.type);
    const canonical = absFormat(match.block, false, blockContract);
    if (validateAbsCall(match.block, canonical, match.type, true, blockContract).length > 0) break;
    output = output.slice(0, match.start) + canonical + output.slice(match.end);
    replacements++;
    repairedTypes.add(match.type);
  }
  return { line: output, replacements, repairedTypes };
}

function rewriteReadmeExampleCalls(content, blocks, contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const eol = String(content).includes('\r\n') ? '\r\n' : '\n';
  const hadFinalEol = String(content).endsWith('\n');
  const lines = String(content).split(/\r?\n/);
  if (hadFinalEol && lines[lines.length - 1] === '') lines.pop();
  const blockByType = new Map((blocks || []).filter(block => block?.type).map(block => [block.type, block]));
  let inAbsExamples = false;
  let fence = null;
  let replacements = 0;
  const repairedTypes = new Set();

  for (let index = 0; index < lines.length; index++) {
    if (!fence) {
      const heading = lines[index].match(/^##\s+(.+?)\s*$/);
      if (heading) inAbsExamples = heading[1].trim().toLowerCase().startsWith('abs');
    }
    const marker = lines[index].match(/^\s*```\s*([A-Za-z0-9_-]*)\s*$/);
    if (marker) {
      if (!fence) {
        const language = marker[1].toLowerCase();
        fence = { executable: language === '' || language === 'abs' || (inAbsExamples && language === 'text') };
      } else fence = null;
      continue;
    }
    const executable = fence ? fence.executable : inAbsExamples;
    if (!executable) continue;
    const rewritten = rewriteExampleLine(lines[index], blockByType, contract);
    if (rewritten.replacements > 0) {
      lines[index] = rewritten.line;
      replacements += rewritten.replacements;
      for (const type of rewritten.repairedTypes) repairedTypes.add(type);
    }
  }

  return {
    content: lines.join(eol) + (hadFinalEol ? eol : ''),
    replacements,
    repairedTypes: [...repairedTypes].sort(),
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
    replacements: 0,
    removedFindings: 0,
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
    const blocks = JSON.parse(fs.readFileSync(blockPath, 'utf8').replace(/^\uFEFF/, ''));
    if (!Array.isArray(blocks)) continue;
    const contract = loadLibraryContract(path.basename(libraryDir));
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    const rewritten = rewriteReadmeExampleCalls(before, blocks, contract);
    if (rewritten.replacements === 0) continue;
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    if (delta.added.length > 0) {
      throw new Error(`${normalized}: migration adds ABS findings: ${delta.added.join('; ')}`);
    }
    if (delta.removed.length === 0) {
      throw new Error(`${normalized}: migration changed examples without removing an ABS finding`);
    }
    if (Buffer.byteLength(rewritten.content, 'utf8') > AI_HARD_MAX_BYTES) {
      throw new Error(`${normalized}: migration exceeds the ${AI_HARD_MAX_BYTES}-byte README hard limit`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.replacements += rewritten.replacements;
    report.removedFindings += delta.removed.length;
    report.changes.push({
      library: path.basename(libraryDir),
      file: normalized,
      replacements: rewritten.replacements,
      repairedTypes: rewritten.repairedTypes,
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
  node .scripts/migrate-readme-example-calls.js [library ...] [--json]
  node .scripts/migrate-readme-example-calls.js [library ...] --apply [--include-dirty] [--json]

Repairs only invalid calls to blocks owned by the current library inside ABS
example regions. Every replacement uses a validated canonical call and the
whole-file contract diff must remove findings without adding any.`);
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
      console.log(`Canonicalized invalid example calls: ${report.replacements}`);
      console.log(`Removed ABS findings: ${report.removedFindings}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
    }
  } catch (error) {
    console.error(`Example-call migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { rewriteReadmeExampleCalls, migrate };
