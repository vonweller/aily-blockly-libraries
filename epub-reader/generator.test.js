const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const libraryDir = __dirname;
const blockDefinitions = JSON.parse(fs.readFileSync(path.join(libraryDir, 'block.json'), 'utf8'));
const toolbox = JSON.parse(fs.readFileSync(path.join(libraryDir, 'toolbox.json'), 'utf8'));

const Arduino = { forBlock: Object.create(null) };
vm.runInNewContext(
  fs.readFileSync(path.join(libraryDir, 'generator.js'), 'utf8'),
  { Arduino },
  { filename: 'epub-reader/generator.js' }
);

function createGenerator(values = {}) {
  const generator = {
    ORDER_ATOMIC: 0,
    libraries: Object.create(null),
    macros: Object.create(null),
    objects: Object.create(null),
    functions: Object.create(null),
    valueToCode(_block, name) {
      return Object.prototype.hasOwnProperty.call(values, name) ? values[name] : '';
    },
    addLibrary(name, code) {
      this.libraries[name] = code;
    },
    addMacro(name, code) {
      this.macros[name] = code;
    },
    addObject(name, code) {
      this.objects[name] = code;
    },
    addFunction(name, code) {
      this.functions[name] = code;
    }
  };
  return generator;
}

function collectToolboxTypes(node, result = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectToolboxTypes(item, result);
  } else if (node && typeof node === 'object') {
    if (node.kind === 'block' && typeof node.type === 'string') result.push(node.type);
    if (node.contents) collectToolboxTypes(node.contents, result);
  }
  return result;
}

function invoke(type, values) {
  const generator = createGenerator(values);
  const result = Arduino.forBlock[type]({}, generator);
  return { generator, result };
}

test('public blocks have generators and toolbox entries reference public blocks', () => {
  const blockTypes = blockDefinitions.map((block) => block.type).sort();
  const generatorTypes = Object.keys(Arduino.forBlock).sort();
  const toolboxTypes = collectToolboxTypes(toolbox).sort();

  assert.equal(blockTypes.length, 49);
  assert.equal(new Set(blockTypes).size, blockTypes.length);
  assert.deepEqual(blockTypes.filter((type) => !generatorTypes.includes(type)), []);
  assert.equal(new Set(toolboxTypes).size, toolboxTypes.length);
  assert.deepEqual(toolboxTypes.filter((type) => !blockTypes.includes(type)), []);
});

test('every generator can run independently with default inputs', () => {
  for (const [type, handler] of Object.entries(Arduino.forBlock)) {
    const generator = createGenerator();
    assert.doesNotThrow(() => {
      const generated = handler({}, generator);
      assert.ok(typeof generated === 'string' || Array.isArray(generated), `${type} returned invalid code`);
    }, type);
  }
});

test('open configures pagination and restores the saved position', () => {
  const { generator, result } = invoke('epub_reader_open', {
    PATH: 'bookPath',
    CHARS_PER_LINE: 'columns',
    LINES_PER_PAGE: 'rows'
  });

  assert.match(result, /epubReader\.open\(bookPath, tft\.width\(\), rows/);
  assert.match(result, /epubReader\.loadPosition\(bookPath\)/);
  assert.equal(generator.objects.epubReader, 'EpubReader epubReader;');
  assert.ok(generator.libraries.EpubReader);
  assert.ok(generator.libraries.SdFatHelper);
});

test('path-taking blocks forward generated expressions', () => {
  const scan = invoke('epub_reader_scan_books', { DIR: 'booksDirectory' });
  assert.match(scan.result, /epubScanBooks\(booksDirectory\)/);
  assert.match(scan.generator.functions.epubScanBooks, /const char\* dir/);

  const readingFont = invoke('epub_reader_load_sd_font', { PATH: 'fontPath' });
  assert.match(readingFont.result, /bootLoadSelectedFont\(fontPath\)/);

  const uiFont = invoke('epub_reader_load_ui_font', { PATH: 'fontPath' });
  assert.match(uiFont.result, /uiFont\.load\(fontPath\)/);
});

test('navigation, image, and history blocks install their dependencies', () => {
  for (const type of ['epub_reader_toc_page_next', 'epub_reader_toc_page_prev']) {
    const { generator, result } = invoke(type, { SEL: 'selection' });
    assert.match(result[0], /selection/);
    assert.ok(generator.libraries.EpubReader);
    assert.ok(generator.libraries.TFT_eSPI);
  }

  for (const type of [
    'epub_reader_show_full_image',
    'epub_reader_page_img_count',
    'epub_reader_full_img_next',
    'epub_reader_full_img_prev',
    'epub_reader_full_img_exit'
  ]) {
    const { generator } = invoke(type, { INDEX: 'imageIndex' });
    assert.ok(generator.libraries.EpubReader);
    assert.ok(generator.libraries.TFT_eSPI);
    assert.ok(generator.objects.epubReader);
  }

  const cover = invoke('epub_reader_gen_cover', { PATH: 'bookPath' }).generator;
  assert.ok(cover.functions.covJpgHelpers);
  assert.ok(cover.functions.covCacheInfra);
  assert.match(cover.functions.epubGenCover, /covGenBuf/);

  const history = invoke('epub_reader_show_history').generator;
  assert.ok(history.functions.epubShowHistory);
  assert.ok(history.functions.epubPanelHelper);

  const resume = invoke('epub_reader_hist_resume');
  assert.ok(resume.generator.functions.epubHistResume);
  assert.match(resume.result[0], /epubHistResume/);
});
