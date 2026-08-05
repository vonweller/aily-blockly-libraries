# TFT_eSPI

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.47

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(input_value), MISO(input_value), MOSI(input_value), SCLK(input_value), CS(... | `tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)` | Dynamic code |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation(variables_get($tft), "0")` | Dynamic code |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display(variables_get($tft), true)` | Dynamic code |
| `tftespi_get_dimension` | Value (Number) | VAR(field_variable), DIMENSION(dropdown) | `tftespi_get_dimension(variables_get($tft), WIDTH)` | `tft.width()` or `tft.height()` |
| `tftespi_sprite_create` | Statement | VAR(field_input), TFT(field_variable), WIDTH(input_value), HEIGHT(input_value), COLOR_DEPTH(dropdown) | `tftespi_sprite_create("sprite", variables_get($tft), math_number(160), math_number(120), 16)` | Declares `TFT_eSprite sprite(&tft)`, sets color depth, then creates its buffer |
| `tftespi_sprite_push` | Statement | SPRITE(field_variable), X(input_value), Y(input_value) | `tftespi_sprite_push(variables_get($sprite), math_number(0), math_number(0))` | `sprite.pushSprite(0, 0)` |
| `tftespi_sprite_push_transparent` | Statement | SPRITE(field_variable), X(input_value), Y(input_value), TRANSPARENT_COLOR(input_value) | `tftespi_sprite_push_transparent(variables_get($sprite), math_number(0), math_number(0), tftespi_color(TFT_BLACK))` | Pushes the Sprite while skipping pixels matching the transparent color |
| `tftespi_sprite_delete` | Statement | SPRITE(field_variable) | `tftespi_sprite_delete(variables_get($sprite))` | `sprite.deleteSprite()` |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_round_rect(variables_get($tft), math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_WHITE))` | Dynamic code |
| `tftespi_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_round_rect(variables_get($tft), math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_BLUE))` | Dynamic code |
| `tftespi_fill_rect_v_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_v_gradient(variables_get($tft), math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_RED), tftespi_color(TFT_YELLOW))` | Dynamic code |
| `tftespi_fill_rect_h_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_h_gradient(variables_get($tft), math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_GREEN), tftespi_color(TFT_CYAN))` | Dynamic code |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_arc` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), INNER_RADIUS(input_value), START_ANGLE(input_value), END_ANGLE(input_value), COLOR(input_value), BG_COLOR(input_value), ROUND_ENDS(dropdown) | `tftespi_draw_arc(variables_get($tft), math_number(120), math_number(120), math_number(80), math_number(60), math_number(0), math_number(270), tftespi_color(TFT_CYAN), tftespi_color(TFT_BLACK), true)` | `tft.drawSmoothArc(...)` |
| `tftespi_draw_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_draw_ellipse(variables_get($tft), math_number(160), math_number(120), math_number(60), math_number(40), tftespi_color(TFT_WHITE))` | Dynamic code |
| `tftespi_fill_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_fill_ellipse(variables_get($tft), math_number(160), math_number(120), math_number(50), math_number(30), tftespi_color(TFT_ORANGE))` | Dynamic code |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string(variables_get($tft), math_number(0), math_number(0), text("value"))` | Converts text, integer, or decimal input with `String(...)` before drawing |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_set_text_colors` | Statement | VAR(field_variable), COLOR(input_value), BG_COLOR(input_value) | `tftespi_set_text_colors(variables_get($tft), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))` | `tft.setTextColor(fg, bg)` |
| `tftespi_set_text_datum` | Statement | VAR(field_variable), DATUM(dropdown) | `tftespi_set_text_datum(variables_get($tft), MC_DATUM)` | `tft.setTextDatum(MC_DATUM)` |
| `tftespi_set_text_padding` | Statement | VAR(field_variable), WIDTH(input_value) | `tftespi_set_text_padding(variables_get($tft), math_number(100))` | `tft.setTextPadding(100)` |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size(variables_get($tft), "1")` | Dynamic code |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font(variables_get($tft), "1")` | Dynamic code |
| `tftespi_image` | Value (TFTImage) | CUSTOM_IMAGE(field_tftespi_image) | `tftespi_image()` | RGB565 or RGB332 `PROGMEM` pixel array |
| `tftespi_draw_image` | Statement | VAR(field_variable), X(input_value), Y(input_value), IMAGE(input_value) | `tftespi_draw_image(variables_get($tft), math_number(0), math_number(0), tftespi_image())` | Draw image with matching `pushImage()` overload |
| `tftespi_animation` | Value | CUSTOM_ANIMATION(field_tftespi_animation) | `tftespi_animation()` | RGB565 or RGB332 `PROGMEM` frame arrays |
| `tftespi_play_animation` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `tftespi_play_animation(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), NON_BLOCKING, TRUE)` | Dynamic code |
| `tftespi_draw_animation_frame` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `tftespi_draw_animation_frame(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), variables_get(frame))` | Dynamic code |
| `tftespi_animation_frame_count` | Value | ANIMATION(input_value) | `tftespi_animation_frame_count(tftespi_animation())` | Generated frame-count constant |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565(variables_get($tft))` | Dynamic code |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM681... | tftespi_setup |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | tftespi_setup |
| BL_LEVEL | HIGH, LOW | tftespi_setup |
| COLOR_MODE | TFT_RGB, TFT_BGR | tftespi_setup |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | tftespi_set_rotation |
| INVERT | true, false | tftespi_invert_display |
| DIMENSION | WIDTH, HEIGHT | tftespi_get_dimension |
| COLOR_DEPTH | 16, 8, 4, 1 | tftespi_sprite_create |
| ROUND_ENDS | true, false | tftespi_draw_arc |
| DATUM | TL_DATUM, TC_DATUM, TR_DATUM, ML_DATUM, MC_DATUM, MR_DATUM, BL_DATUM, BC_DATUM, BR_DATUM, L_BASELINE, C_BASELINE, R_BASELINE | tftespi_set_text_datum |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | tftespi_set_text_size |
| FONT | 1, 2, 4, 6, 7, 8 | tftespi_set_text_font |
| PLAY_MODE | BLOCKING, NON_BLOCKING | tftespi_play_animation |
| LOOP | TRUE, FALSE | tftespi_play_animation |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | tftespi_color |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tftespi_color_rgb565(variables_get($tft)))
    time_delay(math_number(1000))
```

### Non-blocking GIF or MP4 Animation
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "40000000", math_number(240), math_number(320), math_number(-1), math_number(23), math_number(18), math_number(5), math_number(2), math_number(4), math_number(15), HIGH, TFT_RGB)

arduino_loop()
    tftespi_play_animation(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), NON_BLOCKING, TRUE)
```

### Sprite Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "40000000", math_number(240), math_number(320), math_number(-1), math_number(23), math_number(18), math_number(5), math_number(2), math_number(4), math_number(15), HIGH, TFT_RGB)
    tftespi_sprite_create("sprite", variables_get($tft), math_number(160), math_number(120), 16)
    tftespi_fill_screen(variables_get($sprite), tftespi_color(TFT_BLACK))
    tftespi_draw_string(variables_get($sprite), math_number(10), math_number(10), text("Hello"))
    tftespi_sprite_push(variables_get($sprite), math_number(40), math_number(60))
```

## Notes

1. **Variable**: `tftespi_setup("varName", ...)` creates a `TFT_eSPI` variable; `tftespi_sprite_create("sprite", ...)` creates a `TFT_eSprite` variable. Reference them later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Image conversion**: PNG, JPEG, WebP, and BMP files are converted by `field_tftespi_image` to selectable RGB565 or RGB332 Base64 data. Changing W, H, or format reconverts from the saved original file instead of resampling the previous pixel data. The image field renders at 50 px high in Blockly.
5. **Animation conversion**: GIF and MP4 are decoded in the Blockly editor as selectable RGB565 or RGB332 Base64 frames; generated firmware uses matching `uint16_t` or `uint8_t` `PROGMEM` arrays and automatically calls the matching `pushImage()` overload. For `ILI9341_DRIVER`, `ILI9341_2_DRIVER`, `ST7735_DRIVER`, `ST7789_DRIVER`, and `ST7789_2_DRIVER`, image and animation generation exchanges the red and blue fields to match the display path; other models keep the source layout.
6. **Resource budget**: image and animation data are embedded in firmware. The editor defaults to 160x120 and animation defaults to 10 frames with an 8 MiB serialized payload cap. RGB332 uses one byte per pixel and therefore needs roughly half the storage of RGB565. Reduce width, height, FPS, or frame count if compilation reports that the program is too large. Identical converted resources share generated `PROGMEM` arrays.
7. **MP4 codec and audio**: MP4 decoding depends on the Electron/Chromium WebCodecs codec support. Audio tracks are ignored.
8. **Automatic value text**: `tftespi_draw_string` wraps its input in Arduino `String(...)`, so text, integer, and decimal expressions can use the same display block.
9. **Sprite drawing**: screen dimensions, fill, primitive graphics, and text blocks accept either `TFT_eSPI` or `TFT_eSprite` variables. Image and animation render helpers remain display-only.
10. **Sprite memory**: approximate buffer use is width × height × bytes per pixel. Delete temporary Sprites when they are no longer needed.
11. **Long video**: this block is for short self-contained animations. Long videos should use a separate SD/MJPEG streaming workflow rather than embedding raw frames.
12. **One-shot playback**: non-blocking playback with `LOOP=FALSE` runs once after startup; use controlled-frame blocks when application logic must restart or seek an animation.
13. **Display throughput**: requested FPS is a target. Large frames may play more slowly when conversion and display transfer time exceed the selected frame interval.
