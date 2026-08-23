# SD File Browser

Visual file browser on a TFT screen with an SD card: directory browsing, entry selection, font loading, and folder deletion.

## Library Info

- **Name**: @aily-project/lib-sd-file-browser
- **Version**: 1.0.25

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sd_browser_open` | Statement | DIR(input_value) | `sd_browser_open(text("/"))` | `sdbr_loadDir(String("value"));` |
| `sd_browser_count` | Value(Number) | (none) | `sd_browser_count()` | `sdbr_entryCount` |
| `sd_browser_is_dir` | Value(Boolean) | INDEX(input_value) | `sd_browser_is_dir(math_number(0))` | `([&]{ int _i=1; return (_i>=0&&_i<sdbr_entryCount)?sdbr_isDir[_i]:false; })()` |
| `sd_browser_is_jpg` | Value(Boolean) | INDEX(input_value) | `sd_browser_is_jpg(math_number(0))` | `([&]{ int _i=1; if(_i<0&#124;&#124;_i>=sdbr_entryCount&#124;&#124;sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return (l.endsWith(".jpg")&#124;&#124;l.endsWith(".jpeg")&#124;&#124;l.endsWith(".bmp")); })()` |
| `sd_browser_is_font` | Value(Boolean) | INDEX(input_value) | `sd_browser_is_font(math_number(0))` | `([&]{ int _i=1; if(_i<0&#124;&#124;_i>=sdbr_entryCount&#124;&#124;sdbr_isDir[_i]) return false; String l=sdbr_names[_i]; l.toLowerCase(); return l.endsWith(".bin"); })()` |
| `sd_browser_name` | Value(String) | INDEX(input_value) | `sd_browser_name(math_number(0))` | `([&]{ int _i=1; return (_i>=0&&_i<sdbr_entryCount)?sdbr_names[_i]:String(""); })()` |
| `sd_browser_path` | Value(String) | INDEX(input_value) | `sd_browser_path(math_number(0))` | `([&]{ int _i=1; return (_i>=0&&_i<sdbr_entryCount)?sdbr_paths[_i]:String(""); })()` |
| `sd_browser_enter` | Statement | INDEX(input_value) | `sd_browser_enter(math_number(0))` | `sdbr_enter(1);` |
| `sd_browser_up` | Statement | (none) | `sd_browser_up()` | `sdbr_goUp();` |
| `sd_browser_up_sel` | Value(Number) | (none) | `sd_browser_up_sel()` | `sdbr_prevSel` |
| `sd_browser_delete_dir` | Statement | INDEX(input_value) | `sd_browser_delete_dir(math_number(0))` | `sdbr_deleteDir(1);` |
| `sd_browser_is_root` | Value(Boolean) | (none) | `sd_browser_is_root()` | `(sdbr_curDir == "/" &#124;&#124; sdbr_curDir == "")` |
| `sd_browser_curdir` | Value(String) | (none) | `sd_browser_curdir()` | `sdbr_curDir` |
| `sd_browser_show` | Statement | SEL(input_value) | `sd_browser_show(math_number(0))` | `sdbr_show(1);` |
| `sd_browser_load_font` | Statement | PATH(input_value) | `sd_browser_load_font(text("/fonts/cjk.bin"))` | `sdFont.load("value");` |
| `sd_browser_unload_font` | Statement | (none) | `sd_browser_unload_font()` | `sdFont.unload();` |
| `sd_browser_font_loaded` | Value(Boolean) | (none) | `sd_browser_font_loaded()` | `sdFont.isLoaded()` |
| `sd_browser_font_height` | Value(Number) | (none) | `sd_browser_font_height()` | `(sdFont.isLoaded() ? sdFont.getCharHeight() : tft.fontHeight())` |
| `sd_browser_font_width` | Value(Number) | (none) | `sd_browser_font_width()` | `(sdFont.isLoaded() ? sdFont.getCharWidth() : 16)` |
| `sd_browser_load_ui_font` | Statement | PATH(input_value) | `sd_browser_load_ui_font(text("/fonts/ui.bin"))` | `uiFontShared = false; uiFont.load("value");` |
| `sd_browser_unload_ui_font` | Statement | (none) | `sd_browser_unload_ui_font()` | `uiFontShared = false; uiFont.unload();` |
| `sd_browser_ui_font_loaded` | Value(Boolean) | (none) | `sd_browser_ui_font_loaded()` | `(uiFontShared ? sdFont.isLoaded() : uiFont.isLoaded())` |
| `sd_browser_share_font` | Statement | (none) | `sd_browser_share_font()` | `uiFontShared = true;` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_global()
    variable_define("selItem", int32_t, math_number(0))

arduino_setup()
    sd_browser_open(text("/"))
    sd_browser_load_font(text("/fonts/test_font16.bin"))
    sd_browser_show(variables_get($selItem))

arduino_loop()
    controls_if(sd_browser_is_dir(variables_get($selItem)))
        @DO0:
            sd_browser_enter(variables_get($selItem))
            variables_set($selItem, math_number(0))
            sd_browser_show(variables_get($selItem))
```

## Notes

1. **Shared side effects**: Every block of this library triggers `addSdBrowserInfra`, injecting the same global side effects into the sketch — includes `#include <TFT_eSPI.h>`, `#include <SD.h>`, `#include <FS.h>`, `#include <EpubReader.h>`, `#include <SdBrowser.h>`; macros `#define SMOOTH_FONT`, `#define COV_THUMB_W 72`, `#define COV_THUMB_H 96`; global object `SdFont sdFont;`.
2. **UI-font side effects**: `sd_browser_load_ui_font`, `sd_browser_unload_ui_font`, `sd_browser_ui_font_loaded`, and `sd_browser_share_font` additionally inject the global objects `SdFont uiFont;` and `bool uiFontShared = false;` (shared with lib-epub-reader, deduplicated by field name).
3. **Separate compilation unit**: All `sdbr_*` functions and global state are defined in `src/SdBrowser/SdBrowser.cpp` and declared in `SdBrowser.h`. Inline sketch code accesses `sdbr_entryCount`, `sdbr_names`, `sdbr_curDir`, and other state through the `extern` declarations in `#include <SdBrowser.h>`.
4. **External link dependencies**: `SdBrowser.cpp` references shared symbols injected into the sketch by other libraries via `extern`: `tft` (lib-jinyichen-st7789), `sdFont` (shared by this library and lib-epub-reader), `g_sdFontTargetSpr`, `epubDrawCoverThumb(const char*, int, int)`, `epubGenCoverAll()`, and `sdfatReinit()` (lib-epub-reader). The project must also have lib-epub-reader and lib-jinyichen-st7789 installed for linking to succeed.
5. **Call locations**: All blocks are plain statement/value blocks and can be called in setup or loop; there is no automatic loop registration and no callback. Navigation state is kept in library globals and persists across calls.
6. **Inline lambdas in value blocks**: `sd_browser_is_dir`/`is_jpg`/`is_font`/`name`/`path` wrap their access to the `sdbr_*` arrays in an immediately invoked lambda of the form `([&]{ ... })()` with bounds checking; this is normal generated code, not a placeholder.
