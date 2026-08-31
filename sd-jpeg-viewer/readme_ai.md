# SD JPEG Viewer

Block library for viewing JPEG/BMP images from the SD card: open an image, page forward/back, toggle zoom, pan, and exit the viewer.

## Library Info

- **Name**: @aily-project/lib-sd-jpeg-viewer
- **Version**: 1.2.10
- **Description**: Standalone SD-card JPEG image viewer library
- **License**: UNLICENSED

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sd_jpg_viewer_open` | Value (Boolean) | PATH(input_value) | `sd_jpg_viewer_open(text("/img/1.jpg"))` | `jpgv_show(String("value"))` |
| `sd_jpg_viewer_next` | Value (Boolean) | (none) | `sd_jpg_viewer_next()` | `jpgv_next()` |
| `sd_jpg_viewer_prev` | Value (Boolean) | (none) | `sd_jpg_viewer_prev()` | `jpgv_prev()` |
| `sd_jpg_viewer_exit` | Statement | (none) | `sd_jpg_viewer_exit()` | `jpgv_exit();` |
| `sd_jpg_viewer_zoom` | Statement | (none) | `sd_jpg_viewer_zoom()` | `jpgv_zoomToggle();` |
| `sd_jpg_viewer_pan` | Statement | DX(input_value), DY(input_value) | `sd_jpg_viewer_pan(math_number(1), math_number(0))` | `jpgv_pan(1, 1);` |
| `sd_jpg_viewer_dir` | Value (Boolean) | (none) | `sd_jpg_viewer_dir()` | `jpgv_toggleRTL()` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    tftscr_init()
    xueersi_esp32_sd_init()

arduino_loop()
    controls_if(sd_jpg_viewer_open(text("/img/1.jpg")))
        @DO0:
            controls_if(logic_negate(sd_jpg_viewer_next()))
                @DO0:
                    sd_jpg_viewer_exit()
    time_delay(math_number(100))
```

## Notes

1. **Dependencies**: The generated code references the global `tft` (TFT_eSPI) and the SD card. Initialize the screen and SD card first (for example `tftscr_init`, `xueersi_esp32_sd_init`); those blocks come from @aily-project/lib-jinyichen-st7789 and @aily-project/lib-xueersi-esp32-sd.
2. **Object lifetime**: Viewer state is kept in globals of the generated code; no object needs to be created. `sd_jpg_viewer_open` opens and displays an image and returns whether it succeeded; `sd_jpg_viewer_next` / `sd_jpg_viewer_prev` page and return whether viewing continues (false means the viewer has exited); `sd_jpg_viewer_exit` closes the viewer.
3. **Output blocks**: Boolean output blocks must be consumed through value inputs (for example `controls_if`, `logic_negate`) and cannot sit directly in a statement chain; `sd_jpg_viewer_exit` / `sd_jpg_viewer_zoom` / `sd_jpg_viewer_pan` are statement blocks.
4. **Zoom mode**: `sd_jpg_viewer_zoom` toggles between the full-page view and the zoomed view. In zoomed mode the image is browsed as a fixed grid of tiles, and `sd_jpg_viewer_pan(DX, DY)` moves the viewport by multiples of the screen width/height (effective only in zoomed mode). When an image is opened, surrounding blank margins are cropped automatically (a small margin is kept). Landscape (width greater than height) double-page scans are auto-detected and split at the spine into two logical pages (RTL reads the right half first); paging in both full-page and zoomed modes finishes both halves before switching to the next file. Long-strip images snap their scroll stops to the emptiest rows. A minimap in the bottom-right corner shows the current logical page scaled down together with the grid, with the current cell highlighted.
5. **Direction**: `sd_jpg_viewer_dir` takes effect only in zoomed mode: it toggles the reading order (default right-to-left, switching to left-to-right), mirrors the current cell to the symmetric position (the image content itself does not move), and returns `true` when handled. Outside zoomed mode it does nothing and returns `false`. Typical wiring: `controls_if(logic_negate(sd_jpg_viewer_dir()))` so the viewer is exited only when not zoomed. In zoomed mode a badge in the bottom-left corner shows the current direction: `G<` for right-to-left (manga style), `G>` for left-to-right.
6. **Formats and rendering**: Supports JPEG (baseline/progressive) and BMP read from the SD card; oversized images are scaled proportionally and displayed in scrollable segments. Rendering draws into a full frame buffer and pushes it to the screen in one shot (about 150KB PSRAM), so paging and panning switch instantly without line-by-line refresh.
