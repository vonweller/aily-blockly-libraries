#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  absFormat,
  compareAiAbsContracts,
  validateAiAbsContracts,
  allDocumentedBlocks,
  blockContractFor,
  AI_HARD_MAX_BYTES,
} = require('./check-readme-compliance');

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

function connectionType(block) {
  if (block.output !== undefined) return 'Value';
  const args = Object.keys(block)
    .filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
    .flatMap(key => block[key]);
  const hasStatementInput = args.some(arg => arg?.type === 'input_statement');
  if (block.previousStatement === undefined && block.nextStatement === undefined && hasStatementInput) return 'Hat';
  if (/setup|loop/i.test(block.type || '') && block.previousStatement === undefined) return 'Hat';
  return 'Statement';
}

function isInitBlock(block) {
  return /(?:^|_)(init|setup|begin|create|config|attach)(?:_|$)/i.test(block.type || '');
}

function renderVariantExample(block, blockContract, variantIndex) {
  const variant = blockContract.variants[variantIndex];
  const call = absFormat(block, false, blockContract, variantIndex);
  const statements = (variant.appendArgs || []).filter(arg => arg?.type === 'input_statement');
  const lines = [`### Runtime Variant: ${block.type}/${variant.id}`, '```abs'];
  if (connectionType(block) === 'Hat') {
    lines.push(call);
    for (const statement of statements) {
      lines.push(`    @${statement.name}:`, `        ${statement.example}`);
    }
  } else if (block.output !== undefined) {
    lines.push('arduino_loop()', `    serial_println(Serial, ${call})`);
  } else if (isInitBlock(block)) {
    lines.push('arduino_setup()', `    ${call}`);
    for (const statement of statements) {
      lines.push(`        @${statement.name}:`, `            ${statement.example}`);
    }
  } else {
    lines.push('arduino_loop()', `    ${call}`);
    for (const statement of statements) {
      lines.push(`        @${statement.name}:`, `            ${statement.example}`);
    }
  }
  lines.push('```');
  return lines.join('\n');
}

function appendMissingRuntimeVariantExamples(content, blocks, contract) {
  blocks = allDocumentedBlocks(blocks, contract);
  const findings = new Set(validateAiAbsContracts(content, blocks, contract));
  const snippets = [];
  const addedVariants = [];
  for (const block of blocks) {
    const blockContract = blockContractFor(contract, block?.type);
    const variants = Array.isArray(blockContract?.variants) ? blockContract.variants : [];
    for (const [variantIndex, variant] of variants.entries()) {
      if (variant?.document === false) continue;
      const finding = `${block.type} runtime variant ${variant.id} has no complete ABS example`;
      if (!findings.has(finding)) continue;
      snippets.push(renderVariantExample(block, blockContract, variantIndex));
      addedVariants.push(`${block.type}/${variant.id}`);
    }
  }
  if (snippets.length === 0) return { content, addedVariants };

  const eol = String(content).includes('\r\n') ? '\r\n' : '\n';
  const normalizedSnippets = snippets.map(snippet => snippet.replace(/\n/g, eol)).join(`${eol}${eol}`);
  const trimmed = String(content).replace(/[\r\n]+$/, '');
  const heading = /^##\s+Runtime Variant Examples\s*$/im.test(trimmed)
    ? ''
    : `## Runtime Variant Examples${eol}${eol}`;
  return {
    content: `${trimmed}${eol}${eol}${heading}${normalizedSnippets}${eol}`,
    addedVariants,
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
    addedVariants: 0,
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
    const contractPath = path.join(libraryDir, 'readme_ai.contract.json');
    if (!fs.existsSync(blockPath) || !fs.existsSync(contractPath)) continue;
    const blocks = JSON.parse(fs.readFileSync(blockPath, 'utf8').replace(/^\uFEFF/, ''));
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8').replace(/^\uFEFF/, ''));
    if (!Array.isArray(blocks)) continue;
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    const rewritten = appendMissingRuntimeVariantExamples(before, blocks, contract);
    if (rewritten.addedVariants.length === 0) continue;
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    if (delta.added.length > 0) {
      throw new Error(`${normalized}: migration adds ABS findings: ${delta.added.join('; ')}`);
    }
    if (delta.removed.length < rewritten.addedVariants.length) {
      throw new Error(`${normalized}: not every inserted runtime variant removed a finding`);
    }
    if (Buffer.byteLength(rewritten.content, 'utf8') > AI_HARD_MAX_BYTES) {
      throw new Error(`${normalized}: migration exceeds the ${AI_HARD_MAX_BYTES}-byte README hard limit`);
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.addedVariants += rewritten.addedVariants.length;
    report.removedFindings += delta.removed.length;
    report.changes.push({
      library: path.basename(libraryDir),
      file: normalized,
      addedVariants: rewritten.addedVariants,
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
  node .scripts/migrate-readme-runtime-variants.js [library ...] [--json]
  node .scripts/migrate-readme-runtime-variants.js [library ...] --apply [--include-dirty] [--json]

Adds only missing, contract-declared runtime-shape examples. The migration is
idempotent and refuses to write when it adds an ABS finding or exceeds 32KB.`);
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
      console.log(`Added runtime variants: ${report.addedVariants}`);
      console.log(`Removed ABS findings: ${report.removedFindings}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
    }
  } catch (error) {
    console.error(`Runtime-variant migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { appendMissingRuntimeVariantExamples, renderVariantExample, migrate };
