# Cubic PS3 Gamepad

Contest PS3 Bluetooth gamepad wrapper for Cubic ESP32.

## Library Info
- **Name**: @aily-project/lib-cubic-ps3
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------|------------|----------------|
| `cubic_ps3_init` | Statement | VAR(field_input) | `cubic_ps3_init("pad")` | `pad.begin();` |
| `cubic_ps3_init_mac` | Statement | VAR(field_input), MAC(input_value) | `cubic_ps3_init_mac("pad", text("aa:bb:..."))` | `pad.begin("value");` |
| `cubic_ps3_set_deadzone` | Statement | VAR(field_variable), DZ(input_value) | `cubic_ps3_set_deadzone($pad, math_number(30))` | `pad.deadzone = 1;` |
| `cubic_ps3_connected` | Value | VAR(field_variable) | `cubic_ps3_connected($pad)` | `pad.isConnected()` |
| `cubic_ps3_just_connected` | Value | VAR(field_variable) | `cubic_ps3_just_connected($pad)` | `pad.justConnected()` |
| `cubic_ps3_just_disconnected` | Value | VAR(field_variable) | `cubic_ps3_just_disconnected($pad)` | `pad.justDisconnected()` |
| `cubic_ps3_button` | Value | VAR(field_variable), BTN(dropdown) | `cubic_ps3_button($pad, BTN_CROSS)` | `pad.button(CubicPs3::BTN_CROSS)` |
| `cubic_ps3_button_pressed` | Value | VAR(field_variable), BTN(dropdown) | `cubic_ps3_button_pressed($pad, BTN_L1)` | `pad.buttonPressed(CubicPs3::BTN_CROSS)` |
| `cubic_ps3_stick` | Value | VAR(field_variable), STICK(dropdown), AXIS(dropdown) | `cubic_ps3_stick($pad, STICK_L, AXIS_Y)` | `pad.stick(CubicPs3::STICK_L, CubicPs3::AXIS_X)` |
| `cubic_ps3_stick_raw` | Value | VAR(field_variable), STICK(dropdown), AXIS(dropdown) | `cubic_ps3_stick_raw($pad, STICK_L, AXIS_Y)` | `pad.stickRaw(CubicPs3::STICK_L, CubicPs3::AXIS_X)` |
| `cubic_ps3_stick_mapped` | Value | VAR(field_variable), STICK(dropdown), AXIS(dropdown), MAX(input_value) | `cubic_ps3_stick_mapped($pad, STICK_L, AXIS_Y, math_number(255))` | `pad.stickMapped(CubicPs3::STICK_L, CubicPs3::AXIS_X, 1)` |
| `cubic_ps3_set_player` | Statement | VAR(field_variable), PLAYER(dropdown) | `cubic_ps3_set_player($pad, 1)` | `pad.setPlayer(1);` |
| `cubic_ps3_rumble` | Statement | VAR(field_variable), INTENSITY(input_value), DURATION(input_value) | `cubic_ps3_rumble($pad, math_number(50), math_number(300))` | `pad.setRumble(1, 1);` |
| `cubic_ps3_address` | Value | VAR(field_variable) | `cubic_ps3_address($pad)` | `pad.address()` |

## Parameter Options

| Parameter | Values |
|-----------|--------|
| BTN | BTN_CROSS/CIRCLE/TRIANGLE/SQUARE/UP/DOWN/LEFT/RIGHT/L1/L2/R1/R2/SELECT/START/PS/L3/R3 |
| STICK | STICK_L, STICK_R |
| AXIS | AXIS_X, AXIS_Y |
| PLAYER | 1..4 |

## ABS Example
```
arduino_setup()
    cubic_ps3_init("pad")
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: cubic_ps3_connected($pad)
        @DO0:
            serial_println(Serial, cubic_ps3_stick($pad, STICK_L, AXIS_Y))
    controls_if()
        @IF0: cubic_ps3_just_disconnected($pad)
        @DO0:
            serial_println(Serial, text("disconnect stop"))
```

## Notes
1. Pair DualShock 3 to printed MAC via SixaxisPairTool.
2. Call pattern matches contest sample: auto MAC, deadzone=30, invert LY/RY.
3. `update()` is auto-injected into loop for edge detection.
4. ESP32 only; src.7z includes Ps3Controller + CubicPs3.
