# Wio Terminal LVGL

Blockly ABS reference for a Wio Terminal specific LCD + LVGL library. The generated LVGL code stays on LVGL 7 APIs and aligns with the upstream Wio examples: display flush on `TFT_eSPI`, plus `LV_INDEV_TYPE_ENCODER` instead of touchscreen pointer input.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-lvgl
- **Version**: 1.0.0
- **Verified sources**: Seeed_Arduino_LCD `TFT_eSPI.h` 1.6.1 API, Seeed_Arduino_LvGL 6.1.1 adapted to LVGL 7.0.2

## Practical Surface

### Display path
- `seeed_gfx_setup(VAR, ROTATION)` creates `TFT_eSPI VAR = TFT_eSPI();`, calls `begin()`, then `setRotation()`.
- Drawing/text/sizing blocks still map directly to `TFT_eSPI` methods proven in the upstream header.
- Sprite blocks remain available because `Extensions/Sprite.h` provides `TFT_eSprite` for this LCD stack.

### LVGL path
- `seeed_lvgl_init(TFT, WIDTH, HEIGHT, ROTATION, BUFFER_LINES, TICK_MS)` installs the LVGL v7 display buffer/driver and loop tick handling.
- `seeed_lvgl_wio_encoder_input_create(VAR)` registers a Wio Terminal encoder-style input device.
- Input mapping is fixed to board macros: `WIO_5S_LEFT` / `WIO_5S_UP` => `enc_diff = -1`, `WIO_5S_RIGHT` / `WIO_5S_DOWN` => `enc_diff = 1`, `WIO_5S_PRESS` => pressed state.

### Deliberately removed from this library surface
- Touchscreen blocks: the board-specific default path is not touch-based.
- E-Paper blocks: they belong to a different hardware path, not the built-in Wio Terminal LCD.

## ABS Example

```text
arduino_setup()
    seeed_gfx_setup("tft", 3)
    seeed_lvgl_init($tft, math_number(320), math_number(240), 3, math_number(10), math_number(5))
    seeed_lvgl_wio_encoder_input_create("indev")
    seeed_lvgl_screen_create("screen")
    seeed_lvgl_label_create(global, "label", $screen)
    seeed_lvgl_label_set_text($label, text("Hello Wio LVGL"))
    seeed_lvgl_obj_align($label, LV_ALIGN_CENTER, math_number(0), math_number(0))
    seeed_lvgl_screen_load($screen)
```

## Notes
1. Call `seeed_gfx_setup` before `seeed_lvgl_init`.
2. Do not generate LVGL 8/9 APIs for this library.
3. The encoder block auto-initializes `WIO_5S_*` pins with `INPUT_PULLUP`.
4. This is intentionally a Wio Terminal specific library surface, not a catch-all wrapper for every API that exists in the upstream sources.
