#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const {
  generateAiReadmeWithinLimit,
  validateAiAbsContracts,
  allDocumentedBlocks,
  AI_HARD_MAX_BYTES,
} = require('./check-readme-compliance');
const { buildGeneratedCodePreviews } = require('./check-library-generator-coverage');
const { loadLibraryContract } = require('./readme-library-contracts');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT = path.join(ROOT, '.temp', 'readme-candidates');
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function resolveLibrary(target) {
  const resolved = path.resolve(ROOT, target);
  const relative = path.relative(ROOT, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Library target must be a child of the repository root: ${target}`);
  }
  return resolved;
}

function generateCandidate(target, outputRoot = DEFAULT_OUTPUT) {
  const libraryDir = resolveLibrary(target);
  const libraryName = path.basename(libraryDir);
  const packagePath = path.join(libraryDir, 'package.json');
  const blockPath = path.join(libraryDir, 'block.json');
  if (!fs.existsSync(packagePath) || !fs.existsSync(blockPath)) {
    throw new Error(`${libraryName} must contain package.json and block.json`);
  }

  const pkg = readJson(packagePath);
  const blocks = readJson(blockPath);
  if (!Array.isArray(blocks)) throw new Error(`${libraryName}/block.json must be an array`);
  const generatorPath = path.join(libraryDir, 'generator.js');
  const generatorContent = fs.existsSync(generatorPath) ? fs.readFileSync(generatorPath, 'utf8') : '';
  const contract = loadLibraryContract(libraryName);
  const codePreviewResult = buildGeneratedCodePreviews(libraryName, generatorContent, blocks, contract);
  if (codePreviewResult.loadError || codePreviewResult.errors.length > 0) {
    const details = codePreviewResult.loadError
      || codePreviewResult.errors.map(item => `${item.blockType}: ${item.error}`).join('\n');
    throw new Error(`${libraryName} generated-code preview failed:\n${details}`);
  }
  const candidate = generateAiReadmeWithinLimit(
    pkg,
    blocks,
    generatorContent,
    libraryName,
    contract,
    codePreviewResult.previews,
  );
  const contractFindings = validateAiAbsContracts(candidate, blocks, contract);
  if (contractFindings.length > 0) {
    throw new Error(
      `${libraryName} candidate failed ABS contract validation:\n- ${contractFindings.join('\n- ')}`
    );
  }
  const bytes = Buffer.byteLength(candidate, 'utf8');
  if (bytes > AI_HARD_MAX_BYTES) {
    throw new Error(`${libraryName} candidate is ${bytes} bytes; hard max is ${AI_HARD_MAX_BYTES}`);
  }

  const outputDir = path.join(path.resolve(outputRoot), libraryName);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'readme_ai.md');
  fs.writeFileSync(outputPath, candidate.replace(/\r\n/g, '\n').trimEnd() + '\n', 'utf8');
  return {
    libraryName,
    outputPath,
    bytes,
    blockCount: allDocumentedBlocks(blocks, contract).length,
  };
}

function printUsage() {
  console.log(`Usage:
  node .scripts/generate-readme-candidate.js <library> [<library> ...]
  node .scripts/generate-readme-candidate.js --all

Output:
  .temp/readme-candidates/<library>/readme_ai.md

The source README is never modified. Candidates still require human review for
runtime extensions, mutators, lifecycle rules, and meaningful workflows.`);
}

function trackedLibraryTargets() {
  const output = execFileSync('git', ['ls-files', '-z', '*/block.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return [...new Set(output.split('\0').filter(Boolean).map(file => file.split('/')[0]))].sort();
}

function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    return;
  }
  const all = argv.includes('--all');
  const explicitTargets = argv.filter(arg => arg !== '--all');
  if (all && explicitTargets.length > 0) {
    console.error('[candidate:error] --all cannot be combined with explicit library targets');
    process.exitCode = 1;
    return;
  }
  const targets = all ? trackedLibraryTargets() : explicitTargets;
  if (targets.length === 0) {
    printUsage();
    return;
  }
  let failed = false;
  let generated = 0;
  for (const target of targets) {
    try {
      const result = generateCandidate(target);
      generated++;
      if (!all) console.log(`[candidate] ${result.libraryName}: ${result.outputPath} (${result.blockCount} blocks, ${result.bytes} bytes)`);
    } catch (error) {
      failed = true;
      console.error(`[candidate:error] ${target}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (all) console.log(`[candidate] generated ${generated}/${targets.length} tracked library candidates`);
  if (failed) process.exitCode = 1;
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { generateCandidate };
