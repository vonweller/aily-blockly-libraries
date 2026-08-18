const test = require('node:test');
const assert = require('node:assert/strict');

const {
  abiChangedLibraries,
  librariesFromChangedFiles,
  normalizeRepositoryPath,
  parseArgs,
} = require('./check-changed-readme-governance');

test('parseArgs accepts an explicit comparison range', () => {
  assert.deepEqual(parseArgs(['--base', 'base-sha', '--head', 'head-sha']), {
    base: 'base-sha',
    head: 'head-sha',
  });
});

test('parseArgs rejects a base without a head', () => {
  assert.throws(() => parseArgs(['--base', 'base-sha']), /--base requires --head/);
});

test('ABI change discovery maps block and centralized library contract paths', () => {
  assert.deepEqual(
    abiChangedLibraries([
      'adafruit_DHT\\block.json',
      '.scripts/contracts/readme-library-contracts/core-logic.json',
      'adafruit_DHT/generator.js',
    ]).sort(),
    ['adafruit_DHT', 'core-logic'],
  );
});

test('changed-library discovery ignores governance paths and maps centralized contracts', () => {
  assert.deepEqual(
    librariesFromChangedFiles([
      'adafruit_DHT/readme_ai.md',
      '.scripts/check-readme-compliance.js',
      '.scripts/contracts/readme-library-contracts/core-logic.json',
    ], { base: null, head: null }, new Set(['adafruit_DHT', 'core-logic'])),
    ['adafruit_DHT', 'core-logic'],
  );
});

test('repository paths are normalized before library discovery', () => {
  assert.equal(normalizeRepositoryPath('.\\adafruit_DHT\\readme_ai.md'), 'adafruit_DHT/readme_ai.md');
});
