# Epub Reader

Blockly library for Epub Reader.

## Library Info
- **Name**: @aily-project/lib-epub-reader
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `epub_reader_sd_init` | Statement | (none) | `epub_reader_sd_init()` | `sdfatBegin();` |
| `epub_reader_open` | Statement | PATH(input_value), CHARS_PER_LINE(input_value), LINES_PER_PAGE(input_value) | `epub_reader_open(text("value"), math_number(0), math_number(0))` | `epubOpenWithLayout(String("value"), (int)(1), (int)(1));` |
| `epub_reader_is_open` | Value | (none) | `epub_reader_is_open()` | `epubReader.isOpen()` |
| `epub_reader_get_page` | Value | (none) | `epub_reader_get_page()` | `(epubReader.getPageText(epubPageBuf, sizeof(epubPageBuf)), String(epubPageBuf))` |
| `epub_reader_get_page_num` | Value | (none) | `epub_reader_get_page_num()` | `epubReader.getPageNum()` |
| `epub_reader_next` | Statement | (none) | `epub_reader_next()` | `epubReader.nextPage();` |
| `epub_reader_prev` | Statement | (none) | `epub_reader_prev()` | `epubReader.prevPage();` |
| `epub_reader_has_next` | Value | (none) | `epub_reader_has_next()` | `epubReader.hasNext()` |
| `epub_reader_has_prev` | Value | (none) | `epub_reader_has_prev()` | `epubReader.hasPrev()` |
| `epub_reader_render_page` | Statement | X(input_value), Y(input_value) | `epub_reader_render_page(math_number(0), math_number(0))` | `epubRenderPage(1, 1);` |
| `epub_reader_close` | Statement | (none) | `epub_reader_close()` | `epubReader.close(); brDrawnSel=-1;` |
| `epub_reader_font_height` | Value | (none) | `epub_reader_font_height()` | `tft.fontHeight()` |
| `epub_reader_get_chapter` | Value | (none) | `epub_reader_get_chapter()` | `epubReader.getChapter()` |
| `epub_reader_get_chapter_count` | Value | (none) | `epub_reader_get_chapter_count()` | `epubReader.getChapterCount()` |
| `epub_reader_scan_books` | Statement | DIR(input_value) | `epub_reader_scan_books(text("value"))` | `epubScanBooks(String("value"));` |
| `epub_reader_book_count` | Value | (none) | `epub_reader_book_count()` | `epubBookCount` |
| `epub_reader_book_name` | Value | INDEX(input_value) | `epub_reader_book_name(math_number(0))` | `([&]{ int _i = (int)(1); return (_i >= 0 && _i < epubBookCount) ? epubBookNames[_i] : String(); })()` |
| `epub_reader_book_path` | Value | INDEX(input_value) | `epub_reader_book_path(math_number(0))` | `([&]{ int _i = (int)(1); return (_i >= 0 && _i < epubBookCount) ? epubBookPaths[_i] : String(); })()` |
| `epub_reader_show_bookshelf` | Statement | SEL(input_value) | `epub_reader_show_bookshelf(math_number(0))` | `epubShowBookshelf(1);` |
| `epub_reader_show_page` | Statement | (none) | `epub_reader_show_page()` | `epubShowPage();` |
| `epub_reader_goto_chapter` | Value | INDEX(input_value) | `epub_reader_goto_chapter(math_number(0))` | `epubReader.gotoChapter(1)` |
| `epub_reader_chapter_title_at` | Value | INDEX(input_value) | `epub_reader_chapter_title_at(math_number(0))` | `String(epubReader.getChapterTitleByIndex(1))` |
| `epub_reader_save_pos` | Statement | PATH(input_value) | `epub_reader_save_pos(text("value"))` | `epubReader.savePosition("value");` |
| `epub_reader_load_pos` | Value | PATH(input_value) | `epub_reader_load_pos(text("value"))` | `epubReader.loadPosition("value")` |
| `epub_reader_show_toc` | Statement | SEL(input_value) | `epub_reader_show_toc(math_number(0))` | `epubShowToc(1);` |
| `epub_reader_toc_page_next` | Value | SEL(input_value) | `epub_reader_toc_page_next(math_number(0))` | `epubTocPageNext(1)` |
| `epub_reader_toc_page_prev` | Value | SEL(input_value) | `epub_reader_toc_page_prev(math_number(0))` | `epubTocPagePrev(1)` |
| `epub_reader_load_sd_font` | Statement | PATH(input_value) | `epub_reader_load_sd_font(text("value"))` | `sdFont.load(String("value").c_str());` |
| `epub_reader_sd_font_loaded` | Value | (none) | `epub_reader_sd_font_loaded()` | `sdFont.isLoaded()` |
| `epub_reader_unload_sd_font` | Statement | (none) | `epub_reader_unload_sd_font()` | `sdFont.unload();` |
| `epub_reader_load_ui_font` | Statement | PATH(input_value) | `epub_reader_load_ui_font(text("value"))` | `uiFontShared = false; uiFont.load(String("value").c_str());` |
| `epub_reader_unload_ui_font` | Statement | (none) | `epub_reader_unload_ui_font()` | `uiFontShared = false; uiFont.unload();` |
| `epub_reader_ui_font_loaded` | Value | (none) | `epub_reader_ui_font_loaded()` | `(uiFontShared ? sdFont.isLoaded() : uiFont.isLoaded())` |
| `epub_reader_share_reading_font` | Statement | (none) | `epub_reader_share_reading_font()` | `uiFontShared = true;` |
| `epub_reader_gen_cover` | Statement | PATH(input_value) | `epub_reader_gen_cover(text("value"))` | `epubGenCover("value");` |
| `epub_reader_show_full_image` | Statement | INDEX(input_value) | `epub_reader_show_full_image(math_number(0))` | `(void)epubShowFullImage(1);` |
| `epub_reader_page_img_count` | Value | (none) | `epub_reader_page_img_count()` | `pageImgCount` |
| `epub_reader_full_img_next` | Value | (none) | `epub_reader_full_img_next()` | `epubFullImgNext()` |
| `epub_reader_full_img_prev` | Value | (none) | `epub_reader_full_img_prev()` | `epubFullImgPrev()` |
| `epub_reader_full_img_exit` | Statement | (none) | `epub_reader_full_img_exit()` | `epubFreeFullImg();` |
| `epub_reader_show_fit_image` | Statement | INDEX(input_value) | `epub_reader_show_fit_image(math_number(0))` | `(void)epubShowFitImage(1);` |
| `epub_reader_fit_img_next` | Value | (none) | `epub_reader_fit_img_next()` | `epubFitImgNext()` |
| `epub_reader_fit_img_prev` | Value | (none) | `epub_reader_fit_img_prev()` | `epubFitImgPrev()` |
| `epub_reader_browser_open` | Statement | DIR(input_value) | `epub_reader_browser_open(text("value"))` | `brLoadDir(String("value"));` |
| `epub_reader_browser_count` | Value | (none) | `epub_reader_browser_count()` | `brEntryCount` |
| `epub_reader_browser_is_dir` | Value | INDEX(input_value) | `epub_reader_browser_is_dir(math_number(0))` | `([&]{ int _i = (int)(1); return _i >= 0 && _i < brEntryCount && brIsDir[_i]; })()` |
| `epub_reader_browser_name` | Value | INDEX(input_value) | `epub_reader_browser_name(math_number(0))` | `([&]{ int _i = (int)(1); return (_i >= 0 && _i < brEntryCount) ? brNames[_i] : String(); })()` |
| `epub_reader_browser_path` | Value | INDEX(input_value) | `epub_reader_browser_path(math_number(0))` | `([&]{ int _i = (int)(1); return (_i >= 0 && _i < brEntryCount) ? brPaths[_i] : String(); })()` |
| `epub_reader_browser_enter` | Statement | INDEX(input_value) | `epub_reader_browser_enter(math_number(0))` | `brEnter(1);` |
| `epub_reader_browser_up` | Statement | (none) | `epub_reader_browser_up()` | `brGoUp();` |
| `epub_reader_browser_up_sel` | Value | (none) | `epub_reader_browser_up_sel()` | `brPrevSel` |
| `epub_reader_browser_is_root` | Value | (none) | `epub_reader_browser_is_root()` | `(brCurDir == "/" &#124;&#124; brCurDir == "")` |
| `epub_reader_browser_curdir` | Value | (none) | `epub_reader_browser_curdir()` | `brCurDir` |
| `epub_reader_show_browser` | Statement | SEL(input_value) | `epub_reader_show_browser(math_number(0))` | `epubShowBrowser(1);` |
| `epub_reader_jpg_viewer_open` | Value | PATH(input_value) | `epub_reader_jpg_viewer_open(text("value"))` | `jpgViewerShow(String("value"))` |
| `epub_reader_jpg_viewer_next` | Value | (none) | `epub_reader_jpg_viewer_next()` | `jpgViewerNext()` |
| `epub_reader_jpg_viewer_prev` | Value | (none) | `epub_reader_jpg_viewer_prev()` | `jpgViewerPrev()` |
| `epub_reader_jpg_viewer_exit` | Statement | (none) | `epub_reader_jpg_viewer_exit()` | `jpgViewerExit();` |
| `epub_reader_browser_is_jpg` | Value | INDEX(input_value) | `epub_reader_browser_is_jpg(math_number(0))` | `([&]{ int _bi=(int)(1); if(_bi<0&#124;&#124;_bi>=brEntryCount&#124;&#124;brIsDir[_bi]) return false; String l=brNames[_bi]; l.toLowerCase(); return (l.endsWith(".jpg")&#124;&#124;l.endsWith(".jpeg")); })()` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    epub_reader_sd_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, epub_reader_is_open())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
