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

test('public block, generator, and toolbox types stay in lockstep', () => {
  const blockTypes = blockDefinitions.map((block) => block.type).sort();
  const generatorTypes = Object.keys(Arduino.forBlock).sort();
  const toolboxTypes = collectToolboxTypes(toolbox).sort();

  assert.equal(blockTypes.length, 59);
  assert.deepEqual(generatorTypes, blockTypes);
  assert.deepEqual(toolboxTypes, blockTypes);
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

test('open uses both layout inputs and installs its dependencies', () => {
  const { generator, result } = invoke('epub_reader_open', {
    PATH: 'bookPath',
    CHARS_PER_LINE: 'columns',
    LINES_PER_PAGE: 'rows'
  });

  assert.match(result, /epubOpenWithLayout\(String\(bookPath\), \(int\)\(columns\), \(int\)\(rows\)\)/);
  assert.match(generator.functions.epubOpenWithLayout, /tft\.width\(\) \/ charsPerLine/);
  assert.match(generator.functions.epubOpenWithLayout, /linesPerPage/);
  assert.equal(generator.objects.epubReader, 'EpubReader epubReader;');
  assert.equal(generator.objects.sdFont, 'SdFont sdFont;');
  assert.ok(generator.libraries.EpubReader);
  assert.ok(generator.libraries.SdFatHelper);
  assert.ok(generator.libraries.TFT_eSPI);
});

test('browser keeps entry metadata aligned and guards indexed access', () => {
  const opened = invoke('epub_reader_browser_open', { DIR: 'directory' });
  const browserCode = opened.generator.functions.brLoadDir;

  assert.match(browserCode, /bool te = brIsEpub\[i\]/);
  assert.ok(browserCode.indexOf('String lower = name') < browserCode.indexOf('brIsEpub[brEntryCount]'));
  assert.equal(opened.generator.objects.brIsEpub, 'bool brIsEpub[64];');

  for (const type of ['epub_reader_browser_is_dir', 'epub_reader_browser_name', 'epub_reader_browser_path']) {
    const { result } = invoke(type, { INDEX: 'selectedIndex' });
    assert.match(result[0], /_i >= 0 && _i < brEntryCount/);
  }
});

test('path-taking blocks accept generated Arduino String expressions', () => {
  const scan = invoke('epub_reader_scan_books', { DIR: 'booksDirectory' });
  assert.match(scan.result, /epubScanBooks\(String\(booksDirectory\)\)/);
  assert.match(scan.generator.functions.epubScanBooks, /const String& dir/);

  const readingFont = invoke('epub_reader_load_sd_font', { PATH: 'fontPath' });
  assert.match(readingFont.result, /sdFont\.load\(String\(fontPath\)\.c_str\(\)\)/);

  const uiFont = invoke('epub_reader_load_ui_font', { PATH: 'fontPath' });
  assert.match(uiFont.result, /uiFont\.load\(String\(fontPath\)\.c_str\(\)\)/);
});

test('standalone navigation and image blocks install required helper functions', () => {
  for (const type of ['epub_reader_toc_page_next', 'epub_reader_toc_page_prev']) {
    const { generator } = invoke(type, { SEL: 'selection' });
    assert.ok(generator.functions.epubShowToc, `${type} omitted TOC rendering helpers`);
    assert.ok(generator.functions.epubTocNav, `${type} omitted TOC navigation helpers`);
  }

  for (const type of [
    'epub_reader_show_full_image',
    'epub_reader_page_img_count',
    'epub_reader_full_img_next',
    'epub_reader_full_img_prev',
    'epub_reader_full_img_exit'
  ]) {
    const { generator } = invoke(type, { INDEX: 'imageIndex' });
    assert.ok(generator.functions.epubShowPage, `${type} omitted reading-view helpers`);
    assert.match(generator.functions.espJpegDecode565, /jd_prepare/);
    assert.match(generator.functions.espJpegDecode565, /decodeProgJpegFull/);
    assert.ok(generator.libraries.ProgJpegFull, `${type} omitted progressive JPEG support`);
  }

  for (const type of [
    'epub_reader_jpg_viewer_open',
    'epub_reader_jpg_viewer_next',
    'epub_reader_jpg_viewer_prev',
    'epub_reader_jpg_viewer_exit'
  ]) {
    const { generator } = invoke(type, { PATH: 'imagePath' });
    assert.ok(generator.functions.epubShowPage, `${type} omitted image decoding helpers`);
    assert.ok(generator.functions.jpegViewerFuncs, `${type} omitted JPEG viewer helpers`);
  }

  const cover = invoke('epub_reader_gen_cover', { PATH: 'bookPath' }).generator;
  assert.ok(cover.functions.espJpegDecode565);
  assert.equal(cover.functions.covJpgHelpers, undefined);
  assert.match(cover.functions.epubGenCover, /uint16_t\* covDecodedBuf = nullptr/);
});
