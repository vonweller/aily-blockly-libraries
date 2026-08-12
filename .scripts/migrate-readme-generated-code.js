#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  AI_HARD_MAX_BYTES,
  allDocumentedBlocks,
  blockContractFor,
} = require('./check-readme-compliance');
const { buildGeneratedCodePreviews } = require('./check-library-generator-coverage');

const ROOT = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function trackedLibraries() {
  return [...new Set(execFileSync('git', ['ls-files', '-z', '*/block.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).split('\0').filter(Boolean).map(file => file.replace(/\\/g, '/').split('/')[0]))].sort();
}

function encodeTableCode(value) {
  return String(value || '')
    .replace(/\|/g, '&#124;')
    .replace(/`/g, '\\`')
    .replace(/\s+/g, ' ')
    .trim();
}

function rewriteGeneratedCodeCells(content, blocks, previews, contract = null) {
  const eol = String(content).includes('\r\n') ? '\r\n' : '\n';
  const hadFinalEol = String(content).endsWith('\n');
  const lines = String(content).split(/\r?\n/);
  if (hadFinalEol && lines[lines.length - 1] === '') lines.pop();
  const visibleTypes = new Set(allDocumentedBlocks(blocks, contract)
    .filter(block => blockContractFor(contract, block.type)?.agentVisible !== false)
    .map(block => block.type));
  let replacements = 0;
  let placeholderReplacements = 0;

  for (let index = 0; index < lines.length; index++) {
    const cells = lines[index].split('|');
    if (cells.length < 7) continue;
    const match = cells[1].trim().match(/^`([^`]+)`$/);
    const type = match?.[1];
    if (!type || !visibleTypes.has(type) || !previews.has(type)) continue;
    const before = cells[5].trim();
    const after = `\`${encodeTableCode(previews.get(type))}\``;
    if (before === after) continue;
    if (/^(?:`)?(?:Dynamic code|See generator|generator)(?:`)?$/i.test(before)) placeholderReplacements++;
    cells[5] = ` ${after} `;
    lines[index] = cells.join('|');
    replacements++;
  }

  return {
    content: lines.join(eol) + (hadFinalEol ? eol : ''),
    replacements,
    placeholderReplacements,
  };
}

function migrate({ apply = false, targets = [] } = {}) {
  const requested = new Set(targets);
  const libraries = trackedLibraries().filter(library => requested.size === 0 || requested.has(library));
  const report = {
    mode: apply ? 'apply' : 'preview',
    libraries: libraries.length,
    changedLibraries: 0,
    replacements: 0,
    placeholderReplacements: 0,
    changes: [],
  };

  for (const library of libraries) {
    const directory = path.join(ROOT, library);
    const readmePath = path.join(directory, 'readme_ai.md');
    if (!fs.existsSync(readmePath)) throw new Error(`${library}: missing lowercase readme_ai.md`);
    const blocks = readJson(path.join(directory, 'block.json'));
    const contractPath = path.join(directory, 'readme_ai.contract.json');
    const contract = fs.existsSync(contractPath) ? readJson(contractPath) : null;
    const generatorPath = path.join(directory, 'generator.js');
    const source = fs.existsSync(generatorPath) ? fs.readFileSync(generatorPath, 'utf8') : '';
    const previewResult = buildGeneratedCodePreviews(library, source, blocks, contract);
    if (previewResult.loadError || previewResult.errors.length > 0) {
      throw new Error(`${library}: cannot build generated-code previews`);
    }
    const before = fs.readFileSync(readmePath, 'utf8');
    const rewritten = rewriteGeneratedCodeCells(before, blocks, previewResult.previews, contract);
    if (rewritten.replacements === 0) continue;
    const bytes = Buffer.byteLength(rewritten.content, 'utf8');
    if (bytes > AI_HARD_MAX_BYTES) {
      throw new Error(`${library}: migrated README is ${bytes} bytes; max is ${AI_HARD_MAX_BYTES}`);
    }
    if (apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changedLibraries++;
    report.replacements += rewritten.replacements;
    report.placeholderReplacements += rewritten.placeholderReplacements;
    report.changes.push({ library, bytes, ...rewritten });
  }
  return report;
}

function main(argv = process.argv.slice(2)) {
  const apply = argv.includes('--apply');
  const targets = argv.filter(arg => arg !== '--apply');
  const report = migrate({ apply, targets });
  console.log(`Generated-code migration (${report.mode}): ${report.changedLibraries}/${report.libraries} libraries`);
  console.log(`Rows updated: ${report.replacements}; placeholder rows replaced: ${report.placeholderReplacements}`);
}

if (require.main === module) main();

module.exports = { encodeTableCode, migrate, rewriteGeneratedCodeCells };
