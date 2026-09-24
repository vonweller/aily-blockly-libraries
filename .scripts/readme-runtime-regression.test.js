const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { absFormat, validateAbsCall, validateAiAbsContracts, generateAiReadme, blockDefinitionRows, callsOfType, absCallsOfType, callWithNamedValueInputs } = require('./check-readme-compliance');
const { buildGeneratedCodePreviews } = require('./check-library-generator-coverage');
const { exampleRegions } = require('./check-readme-cross-library-examples');
const { loadLibraryContract } = require('./readme-library-contracts');
const root = path.resolve(__dirname, '..');
const read = (library, file) => fs.readFileSync(path.join(root, library, file), 'utf8');

test('loop examples and representative C++ use identical input values', () => {
  const blocks = JSON.parse(read('core-loop', 'block.json'));
  const result = buildGeneratedCodePreviews('core-loop', read('core-loop', 'generator.js'), blocks, loadLibraryContract('core-loop'));
  assert.deepEqual(result.errors, []);
  assert.equal(absFormat(blocks.find(block => block.type === 'controls_for')), 'controls_for($var, math_number(0), math_number(10), math_number(1))');
  assert.match(result.previews.get('controls_for'), /for \(int var = 0; var < 10; var\+\+\)/);
  assert.match(result.previews.get('controls_repeat_ext'), /count < 1000/);
  assert.match(absFormat(blocks.find(block => block.type === 'controls_whileUntil')), /logic_boolean\(true\)/);
});

test('a nested invalid dropdown in a table is rejected, while checkbox TRUE stays valid', () => {
  const blocks = JSON.parse(read('core-logic', 'block.json'));
  const contract = loadLibraryContract('core-logic');
  const valid = read('core-logic', 'readme_ai.md');
  assert.deepEqual(validateAiAbsContracts(valid, blocks, contract), []);
  const invalid = valid.replace('logic_negate(logic_boolean(true))', 'logic_negate(logic_boolean(TRUE))');
  assert.match(validateAiAbsContracts(invalid, blocks, contract).join('\n'), /nested logic_boolean.*must be one of true, false/);
  const checkbox = { type: 'checkbox', args0: [{ name: 'VALUE', type: 'field_checkbox' }] };
  assert.deepEqual(validateAbsCall(checkbox, 'checkbox(TRUE)', 'checkbox', true), []);
});

test('cross-library discovery includes nested table calls but excludes generated code', () => {
  const content = read('core-loop', 'readme_ai.md');
  const regions = exampleRegions(content);
  assert.ok(regions.some(region => region === 'controls_whileUntil(WHILE, logic_boolean(true))'));
  assert.ok(regions.every(region => !region.includes('for (int')));
  assert.ok(blockDefinitionRows(content).length > 0);
});

test('new README output never advertises uppercase boolean dropdown aliases', () => {
  const blocks = JSON.parse(read('core-loop', 'block.json'));
  const content = generateAiReadme({ name: 'test', version: '1' }, blocks, '', 'core-loop', false, loadLibraryContract('core-loop'));
  assert.doesNotMatch(content, /logic_boolean\(TRUE/);
  assert.match(content, /logic_boolean\(true/);
});

test('nested call discovery ignores quoted examples and comments, including recursive blocks', () => {
  assert.deepEqual(callsOfType('text("logic_boolean(TRUE)") # logic_boolean(FALSE)\nlogic_boolean (true)', 'logic_boolean'), ['logic_boolean (true)']);
  assert.deepEqual(callsOfType('logic_negate(logic_negate(true))', 'logic_negate'), ['logic_negate(logic_negate(true))', 'logic_negate(true)']);
});

test('section checks are occurrence-scoped, multiline-aware and shared across library boundaries', () => {
  const blocks = JSON.parse(read('core-logic', 'block.json')), contract = loadLibraryContract('core-logic');
  const block = blocks.find(block => block.type === 'controls_if');
  const candidate = { block, contract: contract.blocks.controls_if };
  const region = `controls_if()
    @IF0: logic_compare(
        math_number(1), EQ, math_number(2))
    @DO0:
        controls_if()
            @IF0: logic_boolean(true)
controls_if()
    @DO0:
        time_delay(1)`;
  const calls = absCallsOfType(region, 'controls_if');
  assert.equal(calls.length, 3);
  const findings = calls.map(({ call, start }) => validateAbsCall(block,
    callWithNamedValueInputs(region, call, candidate, start), 'case', true, candidate.contract));
  assert.deepEqual(findings.slice(0, 2), [[], []]);
  assert.match(findings[2].join('\n'), /missing IF0/);
});

test('own-library validation accepts structured branch syntax without imposing a sample branch limit', () => {
  const blocks = JSON.parse(read('core-logic', 'block.json')), contract = loadLibraryContract('core-logic');
  const content = read('core-logic', 'readme_ai.md') + '\n```abs\ncontrols_if()\n'
    + [0, 1, 2, 3].map(i => `    @IF${i}: logic_boolean(false)\n    @DO${i}:\n        time_delay(1)`).join('\n') + '\n```';
  assert.deepEqual(validateAiAbsContracts(content, blocks, contract), []);
  const duplicate = content.replace('\n    @IF0: logic_boolean(false)', '\n    @IF0: logic_boolean(false)\n    @IF0: logic_boolean(true)');
  assert.match(validateAiAbsContracts(duplicate, blocks, contract).join('\n'), /assigned more than once/);
  const unknown = content.replace('@IF3:', '@TYPO3:');
  assert.match(validateAiAbsContracts(unknown, blocks, contract).join('\n'), /TYPO3.*not declared/);
});
