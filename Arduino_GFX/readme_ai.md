# Arduino GFX

Hardware SPI color display setup, shapes, text, rotation, and RGB565 colors.

## Library Info
- **Name**: @aily-project/lib-arduino-gfx
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduino_gfx_init` | Statement | VAR(field_input), DRIVER(dropdown), DC(dropdown), CS(dropdown), RST(dropdown), ROTATION(dropdown), IPS(field_checkbox) | `arduino_gfx_init("gfx", Arduino_ILI9341, DC, CS, RST, "0", FALSE)` | Dynamic code |
| `arduino_gfx_fill` | Statement | VAR(field_variable), COLOR(input_value) | `arduino_gfx_fill(variables_get($gfx), math_number(0))` | Dynamic code |
| `arduino_gfx_draw_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), COLOR(input_value) | `arduino_gfx_draw_line(variables_get($gfx), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `arduino_gfx_draw_rect` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `arduino_gfx_draw_rect(variables_get($gfx), drawRect, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `arduino_gfx_draw_circle` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `arduino_gfx_draw_circle(variables_get($gfx), drawCircle, math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `arduino_gfx_text_style` | Statement | VAR(field_variable), COLOR(input_value), BG(input_value), SIZE(input_value), WRAP(field_checkbox) | `arduino_gfx_text_style(variables_get($gfx), math_number(0), math_number(0), math_number(0), TRUE)` | Dynamic code |
| `arduino_gfx_text` | Statement | VAR(field_variable), X(input_value), Y(input_value), OP(dropdown), TEXT(input_value) | `arduino_gfx_text(variables_get($gfx), math_number(0), math_number(0), print, text("value"))` | Dynamic code |
| `arduino_gfx_control` | Statement | VAR(field_variable), ACTION(dropdown), VALUE(input_value) | `arduino_gfx_control(variables_get($gfx), setRotation, math_number(0))` | Dynamic code |
| `arduino_gfx_dimension` | Value | VAR(field_variable), DIM(dropdown) | `arduino_gfx_dimension(variables_get($gfx), width)` | Dynamic code |
| `arduino_gfx_rgb565` | Value | R(input_value), G(input_value), B(input_value) | `arduino_gfx_rgb565(math_number(0), math_number(0), math_number(0))` | ((uint16_t)((( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DRIVER | Arduino_ILI9341, Arduino_ST7789, Arduino_ST7796, Arduino_GC9A01, Arduino_ILI9488, Arduino_ST7735 | arduino_gfx_init |
| ROTATION | 0, 1, 2, 3 | arduino_gfx_init |
| MODE | drawRect, fillRect | arduino_gfx_draw_rect |
| MODE | drawCircle, fillCircle | arduino_gfx_draw_circle |
| OP | print, println | arduino_gfx_text |
| ACTION | setRotation, invertDisplay | arduino_gfx_control |
| DIM | width, height | arduino_gfx_dimension |

## ABS Examples

### Basic Usage
```
arduino_setup()
    arduino_gfx_init("gfx", Arduino_ILI9341, DC, CS, RST, "0", FALSE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, arduino_gfx_dimension(variables_get($gfx), width))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `arduino_gfx_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
