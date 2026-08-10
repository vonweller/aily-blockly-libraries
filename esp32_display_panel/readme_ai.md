# ESP32 Display Panel

Blockly conversion of Espressif `ESP32_Display_Panel` v1.0.4.

## Library Info

- **Name**: @aily-project/lib-esp32-display-panel
- **Version**: 1.0.4
- **Author**: Espressif Systems (Shanghai) Co., Ltd.
- **Source**: https://github.com/esp-arduino-libs/ESP32_Display_Panel
- **License**: Apache-2.0
- **Core**: esp32:esp32; Arduino-ESP32 >= 3.1.0
- **Bundled dependencies**: ESP32_IO_Expander 1.1.1, esp-lib-utils 0.2.3

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp_panel_board_init` | Statement | VAR, MODEL, WIDTH, HEIGHT, MISO, MOSI, SCLK, CS, DC, RST, BL, BL_LEVEL, COLOR_MODE, FREQUENCY | `esp_panel_board_init("panel", "ST7789", 240, 320, -1, 11, 12, 10, 9, 8, 7, true, false, 40000000)` | Create `BusSPI`, selected LCD driver and optional PWM backlight |
| `esp_panel_board_delete` | Statement | VAR | `esp_panel_board_delete($panel)` | release display devices and SPI bus |
| `esp_panel_board_ready` | Value | VAR | `esp_panel_board_ready($panel)` | state check |
| `esp_panel_has_device` | Value | VAR, DEVICE | `esp_panel_has_device($panel, LCD)` | device null check |
| `esp_panel_lcd_color_bar` | Statement | VAR | `esp_panel_lcd_color_bar($panel)` | `LCD::colorBarTest()` |
| `esp_panel_lcd_display` | Statement | VAR, STATE | `esp_panel_lcd_display($panel, true)` | display on/off |
| `esp_panel_lcd_invert` | Statement | VAR, STATE | `esp_panel_lcd_invert($panel, true)` | color inversion |
| `esp_panel_lcd_transform` | Statement | VAR, OP, STATE | `esp_panel_lcd_transform($panel, mirrorX, true)` | LCD transform |
| `esp_panel_lcd_set_gap` | Statement | VAR, X, Y | `esp_panel_lcd_set_gap($panel, 0, 0)` | LCD gap |
| `esp_panel_bitmap_data` | Value | DATA | `esp_panel_bitmap_data("rgb565_data")` | buffer symbol |
| `esp_panel_lcd_draw_bitmap` | Statement | VAR, X, Y, W, H, DATA, TIMEOUT | `esp_panel_lcd_draw_bitmap(...)` | `LCD::drawBitmap()` |
| `esp_panel_lcd_fill_screen` | Statement | VAR, COLOR | `esp_panel_lcd_fill_screen($panel, 0)` | RGB565 fill helper |
| `esp_panel_lcd_fill_rect` | Statement | VAR, X, Y, W, H, COLOR | `esp_panel_lcd_fill_rect(...)` | RGB565 fill helper |
| `esp_panel_rgb565` | Value | R, G, B | `esp_panel_rgb565(255, 255, 255)` | RGB565 helper |
| `esp_panel_lcd_info` | Value | VAR, INFO | `esp_panel_lcd_info($panel, WIDTH)` | frame info |
| `esp_panel_touch_read` | Value | VAR, TIMEOUT | `esp_panel_touch_read($panel, 0)` | cache first point |
| `esp_panel_touch_value` | Value | VALUE | `esp_panel_touch_value(x)` | cached touch field |
| `esp_panel_touch_transform` | Statement | VAR, OP, STATE | `esp_panel_touch_transform($panel, mirrorX, true)` | touch transform |
| `esp_panel_touch_interrupt` | Value | VAR | `esp_panel_touch_interrupt($panel)` | interrupt state |
| `esp_panel_touch_button` | Value | VAR, INDEX, TIMEOUT | `esp_panel_touch_button($panel, 0, 0)` | touch button state |
| `esp_panel_backlight_set` | Statement | VAR, BRIGHTNESS | `esp_panel_backlight_set($panel, 100)` | set brightness |
| `esp_panel_backlight_switch` | Statement | VAR, STATE | `esp_panel_backlight_switch($panel, on)` | backlight on/off |
| `esp_panel_backlight_get` | Value | VAR | `esp_panel_backlight_get($panel)` | current brightness |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | AXS15231B, GC9A01, GC9B71, ILI9341, NV3022B, SH8601, SPD2010, ST7789, ST7796, ST77916, ST77922 | Compile-time LCD driver selection; use one init block. |
| WIDTH / HEIGHT | Positive pixel counts | Native LCD resolution. |
| MISO / MOSI / SCLK / CS / DC / RST / BL | ESP32 GPIO numbers; `-1` means unused where supported | SPI, reset and backlight pin assignment. |
| BL_LEVEL | true / false | `true` means HIGH turns the backlight on; `false` means LOW turns it on. |
| COLOR_MODE | false / true | `false` selects RGB order; `true` selects BGR order. |
| FREQUENCY | 10, 20, 27, 40, 55 or 80 MHz | SPI clock frequency. |
| DEVICE | LCD, TOUCH, BACKLIGHT, EXPANDER | Device availability query. |
| OP | mirrorX, mirrorY, swapXY | LCD/touch coordinate transform. |
| STATE | true/false or on/off | Enables, disables or switches a feature. |
| INFO | WIDTH, HEIGHT, COLOR_BITS | LCD frame information. |
| VALUE | x, y, strength | Cached first touch point field. |

## ABS Example

```text
arduino_setup()
    esp_panel_board_init("panel", "ST7789", 240, 320, -1, 11, 12, 10, 9, 8, 7, true, false, 40000000)
    esp_panel_lcd_color_bar(panel)
    esp_panel_backlight_set(panel, 80)

arduino_loop()
    if esp_panel_touch_read(panel, 0)
        serial_print(esp_panel_touch_value("x"))
        serial_print(esp_panel_touch_value("y"))
```

## Generation and Configuration Notes

1. The selected LCD controller is a compile-time setting. Use one `esp_panel_board_init` block per project.
2. The generator adds the SPI bus, selected LCD driver and PWM-backlight macros both to generated code and through the project build-macro service so bundled library translation units use the same configuration.
3. The source block initializes a global `AilyESPPanel` wrapper that owns `BusSPI`, the selected `LCD_*` instance and the optional PWM backlight.
4. All device operations guard `getLCD()`, `getTouch()`, or `getBacklight()` against `nullptr`.
5. `esp_panel_lcd_fill_screen` and `esp_panel_lcd_fill_rect` require a 16-bit RGB565 LCD. They return without drawing for other color depths.
6. `esp_panel_lcd_draw_bitmap` accepts a raw buffer symbol. Timeout `0` is asynchronous; use `-1` before reusing or freeing the buffer.
7. Touch X/Y/strength values are valid after `esp_panel_touch_read` returns true. A failed read resets them to `-1`.
8. LCD and touch coordinate transforms are independent; update both when the application needs aligned coordinates.
9. The custom SPI initialization block does not create a touch controller or IO expander. Their availability checks return false until a dedicated configuration block is added.
10. Some panels require manufacturer-specific LCD initialization commands even when the controller model matches. Those command tables are outside the TFT_eSPI-style basic pin configuration.
