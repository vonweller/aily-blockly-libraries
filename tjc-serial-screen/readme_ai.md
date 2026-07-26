# 淘晶驰串口屏`r`n`r`n淘晶驰串口屏的初始化、控件控制、命令发送和返回帧解析模块。每个发送模块都会自动补齐 `FF FF FF`。
## Library Info
- **Name**: @aily-project/lib-tjc-serial-screen
- **Version**: 1.0.0

## Recommended order

Use one serial initializer first, then `tjc_clear_startup`. Add screen-control blocks after initialization. If replies are required, set `bkcmd`, add `tjc_enable_frame_parser`, then add frame events or value blocks. Connect screen TX -> board RX, screen RX -> board TX, and GND -> GND. The baud rate must match the screen project.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code / Use |
|---|---|---|---|---|
| `tjc_begin_hardware` | Statement | SERIAL(dropdown), SPEED(dropdown) | `tjc_begin_hardware(Serial, 115200)` | Adds `Serial.begin(115200)` in setup. Use a spare hardware UART on Mega/ESP boards when USB serial is needed for debugging. |
| `tjc_begin_software` | Statement | VAR(field_input), SPEED(dropdown), RX(dropdown), TX(dropdown) | `tjc_begin_software("TJCSerial", 9600, 8, 9)` | Adds `SoftwareSerial TJCSerial(8, 9)` and `TJCSerial.begin(9600)`. Recommended for UNO/Nano; keep the speed conservative. |
| `tjc_clear_startup` | Statement | SERIAL(dropdown) | `tjc_clear_startup(Serial)` | Drains currently buffered bytes. Place immediately after initialization to discard the normal `88 FF FF FF` startup frame. |
| `tjc_set_brightness` | Statement | SERIAL(dropdown), VALUE(input_value) | `tjc_set_brightness(Serial, math_number(80))` | Sends `dim=80`. Runtime range is normally 0-100; it does not persist to flash. |
| `tjc_page` | Statement | SERIAL(dropdown), PAGE(input_value) | `tjc_page(Serial, text("main"))` | Sends `page main`. PAGE may be a page name or numeric page ID. |
| `tjc_set_variable` | Statement | TARGET(field_input), VALUE(input_value) | `tjc_set_variable("sys0", math_number(1))` | Sends `sys0=1`; text becomes `name="text"` automatically. TARGET is a TJC variable name, not an Arduino variable. |
| `tjc_set_property` | Statement | SERIAL(dropdown), COMPONENT(field_input), PROPERTY(dropdown), VALUE(input_value) | `tjc_set_property(Serial, "p0", pic, math_number(2))` | Sends `p0.pic=2`. The serial selector is first to make the target UART explicit. Common choices: `txt` text, `val` numeric value, `pic` picture ID, `vis` visibility, `tsw` touch enable, `bco/pco` colors, `font`, `x/y/w/h`. |
| `tjc_send_command` | Statement | COMMAND(input_value), SERIAL(dropdown) | `tjc_send_command(text("ref t0"), Serial)` | Sends any raw TJC command and appends three `0xFF` bytes. Do not append terminators yourself. |
| `tjc_set_bkcmd` | Statement | SERIAL(dropdown), MODE(dropdown) | `tjc_set_bkcmd(Serial, 2)` | Sends `bkcmd=2`: 0 none, 1 success+error, 2 errors only, 3 all. Parsing replies requires the parser block too. |
| `tjc_enable_frame_parser` | Statement | SERIAL(dropdown) | `tjc_enable_frame_parser(Serial)` | Adds a loop reader that splits frames at `FF FF FF`; required before frame events/type/available. |
| `tjc_frame_event` | Hat | TYPE(dropdown), SERIAL(dropdown), HANDLER(statement) | `tjc_frame_event(65, Serial) @HANDLER:` | Runs HANDLER when a matching frame arrives. Types: 65 touch, 66 page ID, 67 coordinates, 70 string, 71 number, 88 startup, `ANY`. |
| `tjc_frame_type` | Value (Number) | SERIAL(dropdown) | `tjc_frame_type(Serial)` | Returns the first byte of the last complete frame, for example 65 or 71. Returns 0 before the first frame. |
| `tjc_frame_available` | Value (Boolean) | SERIAL(dropdown) | `tjc_frame_available(Serial)` | True after a complete terminated frame is received. Use in an `if` condition before consuming frame-dependent logic. |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| PROPERTY | `txt`, `val`, `pic`, `vis`, `tsw`, `bco`, `pco`, `font`, `x`, `y`, `w`, `h` | Component property code; the dropdown displays Chinese and English names. |
| MODE | `0`, `1`, `2`, `3` | `bkcmd` response policy. |
| TYPE | `65`, `66`, `67`, `70`, `71`, `88`, `ANY` | Return-frame first byte. |

## ABS and value rules

`field_input` values are quoted (`"p0"`); dropdown values are stable codes; numeric value inputs use `math_number(80)`; text inputs use `text("main")`; variable values use `variables_get($x)`. Keep the exact `args0` order shown above. Do not put a bare number directly in an `input_value` slot.

## Complete example

```text
arduino_setup()
    tjc_begin_hardware(Serial1, 115200)
    tjc_clear_startup(Serial1)
    tjc_set_bkcmd(Serial1, 2)
    tjc_enable_frame_parser(Serial1)
    tjc_page(Serial1, text("main"))
    tjc_set_property(Serial1, "t0", txt, text("Ready"))

arduino_loop()
    tjc_frame_event(65, Serial1)
        @HANDLER:
            tjc_set_brightness(Serial1, math_number(60))
```

## Common errors

- Reversed TX/RX, missing common ground, or mismatched baud rate prevents all communication.
- On Mega2560, avoid using USB `Serial` for the screen when debugging; use `Serial1/2/3`.
- Do not add quotes around numeric `val`, `pic`, `vis`, `x`, `y`, `w`, or `h` values. Text properties such as `txt` need a text value.
- Do not send `FF FF FF` in the command input; the library appends it exactly once.
- `tjc_clear_startup` must run before parsing, and parser blocks must follow serial initialization.
- Frequent brightness changes should use `dim`; persistent `dims` writes can wear flash.
- For Chinese text, use a UTF-8 project and a screen font containing the required glyphs.

