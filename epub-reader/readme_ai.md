# EPUB Reader

EPUB e-book reader library: ZIP unpacking, HTML parsing, automatic pagination, chapter/TOC navigation, bookshelf and reading-history UI, SD-font loading, cover thumbnails, and full-page image viewing on a TFT screen.

## Library Info

- **Name**: @aily-project/lib-epub-reader
- **Version**: 1.2.7

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `epub_reader_open` | Statement | PATH(input_value), CHARS_PER_LINE(input_value), LINES_PER_PAGE(input_value) | `epub_reader_open(text("/book.epub"), math_number(25), math_number(13))` | `covCacheFree(); if (covGenBuf) { free(covGenBuf); covGenBuf = nullptr; } epubReader.open("value", tft.width(), 1, sdFont.isLoaded() ? (sdFont.getCharWidth() * 11 + 8) / 16 : 7, sdFont.isLoaded() ? sdFont.getCharWidth() : 16); if (epubReader.isOpen()) epubReader.loadPosition("value");` |
| `epub_reader_is_open` | Value (Boolean) | (none) | `epub_reader_is_open()` | `epubReader.isOpen()` |
| `epub_reader_get_page` | Value (String) | (none) | `epub_reader_get_page()` | `(epubReader.getPageText(epubPageBuf, sizeof(epubPageBuf)), String(epubPageBuf))` |
| `epub_reader_get_page_num` | Value (Number) | (none) | `epub_reader_get_page_num()` | `epubReader.getPageNum()` |
| `epub_reader_next` | Statement | (none) | `epub_reader_next()` | `epubReader.nextPage();` |
| `epub_reader_prev` | Statement | (none) | `epub_reader_prev()` | `epubReader.prevPage();` |
| `epub_reader_has_next` | Value (Boolean) | (none) | `epub_reader_has_next()` | `epubReader.hasNext()` |
| `epub_reader_has_prev` | Value (Boolean) | (none) | `epub_reader_has_prev()` | `epubReader.hasPrev()` |
| `epub_reader_render_page` | Statement | X(input_value), Y(input_value) | `epub_reader_render_page(math_number(2), math_number(20))` | `epubRenderPage(1, 1);` |
| `epub_reader_close` | Statement | (none) | `epub_reader_close()` | `epubReader.close(); brDrawnSel=-1;` |
| `epub_reader_font_height` | Value (Number) | (none) | `epub_reader_font_height()` | `tft.fontHeight()` |
| `epub_reader_get_chapter` | Value (Number) | (none) | `epub_reader_get_chapter()` | `epubReader.getChapter()` |
| `epub_reader_get_chapter_count` | Value (Number) | (none) | `epub_reader_get_chapter_count()` | `epubReader.getChapterCount()` |
| `epub_reader_scan_books` | Statement | DIR(input_value) | `epub_reader_scan_books(text("/books"))` | `epubScanBooks("value");` |
| `epub_reader_book_count` | Value (Number) | (none) | `epub_reader_book_count()` | `epubBookCount` |
| `epub_reader_book_name` | Value (String) | INDEX(input_value) | `epub_reader_book_name(math_number(0))` | `epubBookNames[1]` |
| `epub_reader_book_path` | Value (String) | INDEX(input_value) | `epub_reader_book_path(math_number(0))` | `epubBookPaths[1]` |
| `epub_reader_show_bookshelf` | Statement | SEL(input_value) | `epub_reader_show_bookshelf(math_number(0))` | `epubShowBookshelf(1);` |
| `epub_reader_show_page` | Statement | (none) | `epub_reader_show_page()` | `epubShowPage();` |
| `epub_reader_goto_chapter` | Value (Boolean) | INDEX(input_value) | `epub_reader_goto_chapter(math_number(0))` | `epubReader.gotoChapter(1)` |
| `epub_reader_chapter_title_at` | Value (String) | INDEX(input_value) | `epub_reader_chapter_title_at(math_number(0))` | `String(epubReader.getChapterTitleByIndex(1))` |
| `epub_reader_save_pos` | Statement | PATH(input_value) | `epub_reader_save_pos(text("/book.epub"))` | `epubReader.savePosition("value");` |
| `epub_reader_load_pos` | Value (Boolean) | PATH(input_value) | `epub_reader_load_pos(text("/book.epub"))` | `epubReader.loadPosition("value")` |
| `epub_reader_show_toc` | Statement | SEL(input_value) | `epub_reader_show_toc(math_number(0))` | `epubShowToc(1);` |
| `epub_reader_toc_page_next` | Value (Number) | SEL(input_value) | `epub_reader_toc_page_next(math_number(0))` | `epubTocPageNext(1)` |
| `epub_reader_toc_page_prev` | Value (Number) | SEL(input_value) | `epub_reader_toc_page_prev(math_number(0))` | `epubTocPagePrev(1)` |
| `epub_reader_load_sd_font` | Statement | PATH(input_value) | `epub_reader_load_sd_font(text("/fonts/cjk.bin"))` | `bootLoadSelectedFont("value");` |
| `epub_reader_select_font` | Statement | PATH(input_value) | `epub_reader_select_font(text("/fonts/cjk.bin"))` | `selectFont("value");` |
| `epub_reader_sd_font_loaded` | Value (Boolean) | (none) | `epub_reader_sd_font_loaded()` | `sdFont.isLoaded()` |
| `epub_reader_unload_sd_font` | Statement | (none) | `epub_reader_unload_sd_font()` | `sdFont.unload();` |
| `epub_reader_load_ui_font` | Statement | PATH(input_value) | `epub_reader_load_ui_font(text("/fonts/ui.bin"))` | `uiFontShared = false; uiFont.load("value");` |
| `epub_reader_unload_ui_font` | Statement | (none) | `epub_reader_unload_ui_font()` | `uiFontShared = false; uiFont.unload();` |
| `epub_reader_ui_font_loaded` | Value (Boolean) | (none) | `epub_reader_ui_font_loaded()` | `(uiFontShared ? sdFont.isLoaded() : uiFont.isLoaded())` |
| `epub_reader_share_reading_font` | Statement | (none) | `epub_reader_share_reading_font()` | `uiFontShared = true;` |
| `epub_reader_gen_cover` | Statement | PATH(input_value) | `epub_reader_gen_cover(text("/book.epub"))` | `epubGenCover("value");` |
| `epub_reader_show_full_image` | Statement | INDEX(input_value) | `epub_reader_show_full_image(math_number(0))` | `(void)epubShowFullImage(1);` |
| `epub_reader_page_img_count` | Value (Number) | (none) | `epub_reader_page_img_count()` | `pageImgCount` |
| `epub_reader_full_img_next` | Value (Number) | (none) | `epub_reader_full_img_next()` | `epubFullImgNext()` |
| `epub_reader_full_img_prev` | Value (Number) | (none) | `epub_reader_full_img_prev()` | `epubFullImgPrev()` |
| `epub_reader_full_img_exit` | Statement | (none) | `epub_reader_full_img_exit()` | `epubFreeFullImg();` |
| `epub_reader_show_fit_image` | Statement | INDEX(input_value) | `epub_reader_show_fit_image(math_number(0))` | `(void)epubShowFitImage(1);` |
| `epub_reader_fit_img_next` | Value (Number) | (none) | `epub_reader_fit_img_next()` | `epubFitImgNext()` |
| `epub_reader_fit_img_prev` | Value (Number) | (none) | `epub_reader_fit_img_prev()` | `epubFitImgPrev()` |
| `epub_reader_show_history` | Statement | (none) | `epub_reader_show_history()` | `epubShowHistory();` |
| `epub_reader_hist_count` | Value (Number) | (none) | `epub_reader_hist_count()` | `epubReader.histCount()` |
| `epub_reader_hist_next` | Statement | (none) | `epub_reader_hist_next()` | `epubHistMove(1);` |
| `epub_reader_hist_prev` | Statement | (none) | `epub_reader_hist_prev()` | `epubHistMove(-1);` |
| `epub_reader_hist_resume` | Value (Boolean) | (none) | `epub_reader_hist_resume()` | `epubHistResume()` |
| `epub_reader_cur_path` | Value (String) | (none) | `epub_reader_cur_path()` | `String(epubReader.getPath())` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    tftscr_init()
    tftscr_fill_screen(tftscr_color(TFT_BLACK))
    xueersi_esp32_sd_init()
    epub_reader_scan_books(text("/books"))
    epub_reader_open(text("/book.epub"), math_number(25), math_number(13))
    controls_if(epub_reader_is_open())
        @DO0:
            epub_reader_render_page(math_number(2), math_number(20))

arduino_loop()

xueersi_esp32_button_on_event(DOWN, CLICK)
    @DO:
        epub_reader_next()
        tftscr_fill_screen(tftscr_color(TFT_BLACK))
        epub_reader_render_page(math_number(2), math_number(20))

xueersi_esp32_button_on_event(UP, CLICK)
    @DO:
        epub_reader_prev()
        tftscr_fill_screen(tftscr_color(TFT_BLACK))
        epub_reader_render_page(math_number(2), math_number(20))
```

## Notes

1. **Global objects**: `epub_reader_open` injects the global `EpubReader epubReader;` plus a static page buffer (`epubPageBuf`); font blocks inject the shared globals `SdFont sdFont;` and (for UI-font blocks) `SdFont uiFont;` / `bool uiFontShared = false;`. The `uiFont` / `uiFontShared` fields are shared with lib-sd-file-browser and are deduplicated by field name. No manual object creation is needed.
2. **Dependencies**: initialize the SD card (`xueersi_esp32_sd_init`) and the TFT screen (`tftscr_init`) before use; the generated code references the global `tft` provided by lib-jinyichen-st7789. PSRAM is required; parsing a large book can take roughly 2-3x the file size of PSRAM.
3. **CHARS_PER_LINE input**: `epub_reader_open` reads the CHARS_PER_LINE input but the generated call derives characters per line from the screen width and the loaded font width, so the input value does not appear in the generated code.
4. **Reading position**: `epub_reader_save_pos` writes both the per-book position (NVS `epub_pos`) and the recent-books list (NVS `epub_hist`, up to 20 books, most recent first, deduplicated); `epub_reader_open` automatically calls `loadPosition` after a successful open, and `epub_reader_load_pos` restores a saved position on demand.
5. **History UI**: `epub_reader_show_history` renders the recent-reading list (book name + chapter progress, selection highlighted, same style as the TOC page); `epub_reader_hist_next` / `epub_reader_hist_prev` move the selection; `epub_reader_hist_resume` opens the selected book and restores its position (returns true on success); `epub_reader_hist_count` returns the entry count.
6. **TOC paging**: `epub_reader_show_toc(SEL)` renders the chapter list with the given item highlighted; `epub_reader_toc_page_next` / `epub_reader_toc_page_prev` return the selection index of the next / previous TOC page (wrapping around) for the next `epub_reader_show_toc` call.
7. **Call locations**: all blocks are plain statement/value blocks usable in setup or loop (UI blocks are typically wired to button events); there is no automatic loop registration and no callback. Reader state persists in the globals of the generated code until `epub_reader_close`.
