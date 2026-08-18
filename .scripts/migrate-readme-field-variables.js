#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  compareAiAbsContracts,
  validateAiAbsContracts,
  allDocumentedBlocks,
} = require('./check-readme-compliance');
const { loadLibraryContract } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const README_NAME = 'readme_ai.md';
const WRAPPER_FINDING = 'field_variable and must use $name, not variables_get($name)';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function getArgs(block) {
  return Object.keys(block || {})
    .filter(key => /^args\d+$/.test(key) && Array.isArray(block[key]))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
    .flatMap(key => block[key]);
}

function absSlots(block) {
  return getArgs(block).filter(arg => arg && arg.name && ![
    'input_dummy',
    'input_statement',
    'field_image',
    'field_label',
    'field_label_serializable',
  ].includes(arg.type));
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

function splitTopLevel(text, delimiter) {
  const parts = [];
  let start = 0;
  let quote = null;
  let escaped = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') round++;
    else if (char === ')') round--;
    else if (char === '[') square++;
    else if (char === ']') square--;
    else if (char === '{') curly++;
    else if (char === '}') curly--;
    else if (char === delimiter && round === 0 && square === 0 && curly === 0) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

function topLevelEquals(text) {
  const parts = splitTopLevel(text, '=');
  if (parts.length !== 2) return -1;
  let quote = null;
  let escaped = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') round++;
    else if (char === ')') round--;
    else if (char === '[') square++;
    else if (char === ']') square--;
    else if (char === '{') curly++;
    else if (char === '}') curly--;
    else if (char === '=' && round === 0 && square === 0 && curly === 0) return index;
  }
  return -1;
}

function unwrapVariablesGet(value) {
  const match = String(value || '').trim().match(
    /^variables_get\s*\(\s*(\$(?:"(?:\\.|[^"\\])*"|[^\s(),=:+]+)(?::[^\s(),=]+)?)\s*\)$/,
  );
  return match ? match[1] : null;
}

function isFieldVariableReference(value) {
  return /^\$(?:"(?:\\.|[^"\\])*"|[^\s(),=:+]+)(?::[^\s(),=]+)?$/.test(String(value || '').trim());
}

function rewriteCall(callText, block, options = {}) {
  const openIndex = callText.indexOf('(');
  const closeIndex = findMatchingParen(callText, openIndex);
  if (openIndex < 0 || closeIndex < 0) {
    return {
      text: callText,
      replacements: 0,
      inputValueReplacements: 0,
      defaultFieldReplacements: 0,
    };
  }
  const slots = absSlots(block);
  const slotByName = new Map(slots.map(slot => [slot.name, slot]));
  const assigned = new Set();
  let positionalIndex = 0;
  let replacements = 0;
  let inputValueReplacements = 0;
  let defaultFieldReplacements = 0;
  const args = splitTopLevel(callText.slice(openIndex + 1, closeIndex), ',').map(token => {
    const equalsIndex = topLevelEquals(token);
    let prefix = '';
    let value = token;
    let slot;
    if (equalsIndex > 0) {
      const name = token.slice(0, equalsIndex).trim();
      value = token.slice(equalsIndex + 1).trim();
      slot = slotByName.get(name);
      prefix = `${name}=`;
      assigned.add(name);
    } else {
      while (positionalIndex < slots.length && assigned.has(slots[positionalIndex].name)) positionalIndex++;
      slot = slots[positionalIndex++];
      if (slot) assigned.add(slot.name);
    }
    if (slot?.type === 'input_value' && isFieldVariableReference(value)) {
      inputValueReplacements++;
      return `${prefix}variables_get(${value})`;
    }
    if (slot?.type === 'field_variable') {
      let variable = unwrapVariablesGet(value);
      if (variable) replacements++;
      else if (options.repairInvalidField && !isFieldVariableReference(value)) {
        variable = `$${slot.variable || String(slot.name).toLowerCase()}`;
        defaultFieldReplacements++;
      }
      if (variable) return `${prefix}${variable}`;
    }
    return token;
  });
  if (replacements === 0 && inputValueReplacements === 0 && defaultFieldReplacements === 0) {
    return {
      text: callText,
      replacements: 0,
      inputValueReplacements: 0,
      defaultFieldReplacements: 0,
    };
  }
  return {
    text: `${callText.slice(0, openIndex + 1)}${args.join(', ')}${callText.slice(closeIndex)}`,
    replacements,
    inputValueReplacements,
    defaultFieldReplacements,
  };
}

function hasIdentifierBoundary(text, index, length) {
  const before = index > 0 ? text[index - 1] : '';
  const after = text[index + length] || '';
  return (!before || !/[A-Za-z0-9_]/.test(before)) && (!after || !/[A-Za-z0-9_]/.test(after));
}

function rewriteCallsForBlock(text, block, options = {}) {
  const type = block.type;
  let cursor = 0;
  let output = '';
  let replacements = 0;
  let inputValueReplacements = 0;
  let defaultFieldReplacements = 0;
  while (cursor < text.length) {
    const index = text.indexOf(type, cursor);
    if (index < 0) break;
    if (!hasIdentifierBoundary(text, index, type.length)) {
      output += text.slice(cursor, index + type.length);
      cursor = index + type.length;
      continue;
    }
    let openIndex = index + type.length;
    while (/\s/.test(text[openIndex] || '')) openIndex++;
    if (text[openIndex] !== '(') {
      output += text.slice(cursor, openIndex);
      cursor = openIndex;
      continue;
    }
    const closeIndex = findMatchingParen(text, openIndex);
    if (closeIndex < 0) break;
    const rewritten = rewriteCall(text.slice(index, closeIndex + 1), block, options);
    output += text.slice(cursor, index) + rewritten.text;
    replacements += rewritten.replacements;
    inputValueReplacements += rewritten.inputValueReplacements || 0;
    defaultFieldReplacements += rewritten.defaultFieldReplacements || 0;
    cursor = closeIndex + 1;
  }
  return {
    text: output + text.slice(cursor),
    replacements,
    inputValueReplacements,
    defaultFieldReplacements,
  };
}

function rewriteRegion(text, blocks, options = {}) {
  let current = text;
  let replacements = 0;
  let inputValueReplacements = 0;
  let defaultFieldReplacements = 0;
  for (const block of blocks) {
    if (!absSlots(block).some(slot => slot.type === 'field_variable' || slot.type === 'input_value')) continue;
    const rewritten = rewriteCallsForBlock(current, block, options);
    current = rewritten.text;
    replacements += rewritten.replacements;
    inputValueReplacements += rewritten.inputValueReplacements;
    defaultFieldReplacements += rewritten.defaultFieldReplacements;
  }
  return { text: current, replacements, inputValueReplacements, defaultFieldReplacements };
}

function rewriteReadme(content, blocks, contract = null) {
  blocks = allDocumentedBlocks(blocks, contract);
  const lines = String(content || '').split(/(?<=\n)/);
  let fenceLanguage = null;
  let inAbsExamples = false;
  let replacements = 0;
  let inputValueReplacements = 0;
  let defaultFieldReplacements = 0;
  const output = lines.map(line => {
    if (fenceLanguage === null) {
      const heading = line.match(/^##\s+(.+?)\s*(?:\r?\n)?$/);
      if (heading) inAbsExamples = heading[1].toLowerCase() === 'abs examples';
    }
    const marker = line.match(/^\s*```\s*([A-Za-z0-9_-]*)\s*(?:\r?\n)?$/);
    if (marker) {
      if (fenceLanguage === null) fenceLanguage = marker[1].toLowerCase();
      else fenceLanguage = null;
      return line;
    }
    const inExecutableFence = fenceLanguage === ''
      || fenceLanguage === 'abs'
      || (inAbsExamples && fenceLanguage === 'text');
    const isBlockTableRow = /^\s*\|\s*`[^`]+`\s*\|/.test(line);
    if (!inExecutableFence && !isBlockTableRow) return line;
    const rewritten = rewriteRegion(line, blocks, { repairInvalidField: isBlockTableRow });
    replacements += rewritten.replacements;
    inputValueReplacements += rewritten.inputValueReplacements;
    defaultFieldReplacements += rewritten.defaultFieldReplacements;
    return rewritten.text;
  });
  let rewrittenContent = output.join('');
  let noteReplacements = 0;
  rewrittenContent = rewrittenContent.replace(
    /reference it later with `variables_get\(\$varName\)`\./g,
    () => {
      noteReplacements++;
      return 'pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.';
    },
  );
  return {
    content: rewrittenContent,
    replacements,
    inputValueReplacements,
    defaultFieldReplacements,
    noteReplacements,
  };
}

function gitLines(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function gitStatusEntries() {
  return execFileSync(
    'git',
    ['status', '--porcelain=v1', '-z', '--untracked-files=all'],
    { cwd: ROOT, encoding: 'utf8' },
  ).split('\0').filter(Boolean).filter(entry => (
    normalizeRelative(entry.slice(3)).toLowerCase().endsWith(`/${README_NAME}`)
  ));
}

function normalizeRelative(filePath) {
  return filePath.replace(/\\/g, '/');
}

function trackedReadmes() {
  return gitLines(['ls-files']).filter(filePath => (
    normalizeRelative(filePath).toLowerCase().endsWith(`/${README_NAME}`)
  ));
}

function dirtyReadmes() {
  return new Set(gitStatusEntries().map(entry => normalizeRelative(entry.slice(3))));
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
    inputValueReplacements: 0,
    defaultFieldCorrections: 0,
    noteCorrections: 0,
    skippedDirty: [],
    ignoredUntracked: gitStatusEntries()
      .filter(entry => entry.startsWith('?? '))
      .map(entry => normalizeRelative(entry.slice(3))),
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
    const readmePath = path.join(ROOT, relativePath);
    const before = fs.readFileSync(readmePath, 'utf8');
    report.scanned++;
    const rewritten = rewriteReadme(before, blocks, contract);
    if (
      rewritten.replacements === 0
      && rewritten.inputValueReplacements === 0
      && rewritten.defaultFieldReplacements === 0
      && rewritten.noteReplacements === 0
    ) continue;
    const beforeFindings = validateAiAbsContracts(before, blocks, contract);
    const afterFindings = validateAiAbsContracts(rewritten.content, blocks, contract);
    const delta = compareAiAbsContracts(before, blocks, rewritten.content, blocks, contract, contract);
    const beforeWrappers = beforeFindings.filter(item => item.includes(WRAPPER_FINDING)).length;
    const afterWrappers = afterFindings.filter(item => item.includes(WRAPPER_FINDING)).length;
    if (delta.added.length > 0) {
      throw new Error(`${normalized}: migration adds ABS findings: ${delta.added.join('; ')}`);
    }
    // validateAiAbsContracts de-duplicates identical findings inside one
    // fenced example, so the number of diagnostics can be smaller than the
    // number of concrete replacements. Require complete removal instead of
    // equating those two different units.
    if (rewritten.replacements > 0 && afterWrappers !== 0) {
      throw new Error(
        `${normalized}: wrapper findings changed from ${beforeWrappers} to ${afterWrappers}`,
      );
    }
    if (options.apply) fs.writeFileSync(readmePath, rewritten.content, 'utf8');
    report.changed++;
    report.replacements += rewritten.replacements;
    report.inputValueReplacements += rewritten.inputValueReplacements;
    report.defaultFieldCorrections += rewritten.defaultFieldReplacements;
    report.noteCorrections += rewritten.noteReplacements;
    report.changes.push({
      library: path.basename(libraryDir),
      file: normalized,
      replacements: rewritten.replacements,
      inputValueReplacements: rewritten.inputValueReplacements,
      defaultFieldCorrections: rewritten.defaultFieldReplacements,
      noteCorrections: rewritten.noteReplacements,
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
  node .scripts/migrate-readme-field-variables.js [library ...] [--json]
  node .scripts/migrate-readme-field-variables.js [library ...] --apply [--include-dirty] [--json]

The default is preview-only. Apply mode edits only tracked, currently clean
readme_ai.md files and refuses any transformation that adds an ABS finding.`);
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
      console.log(`Scanned clean README files: ${report.scanned}`);
      console.log(`Changed README files: ${report.changed}`);
      console.log(`Removed field_variable wrappers: ${report.replacements}`);
      console.log(`Canonicalized input_value variable reads: ${report.inputValueReplacements}`);
      console.log(`Corrected invalid table field variables: ${report.defaultFieldCorrections}`);
      console.log(`Corrected stale variable notes: ${report.noteCorrections}`);
      console.log(`Skipped dirty README files: ${report.skippedDirty.length}`);
      console.log(`Ignored untracked README files: ${report.ignoredUntracked.length}`);
    }
  } catch (error) {
    console.error(`Field-variable migration failed: ${error.message || error}`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = {
  absSlots,
  rewriteCall,
  rewriteReadme,
  migrate,
};
