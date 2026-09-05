# PS2 Gamepad

Read PS2 (DualShock 2) gamepad buttons and sticks, check the connection, and control vibration. The ATT, CMD, DAT, and CLK dropdowns use the selected board's digital-pin list. The example wiring matches the Chuanglebo MakeBit PS2 socket with a micro:bit V2.

## Library Info

- **Name**: @aily-project/lib-ps2xmbit
- **Version**: 1.3.21

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `ps2x_init` | Statement | VAR(field_variable), ATT(dropdown), CMD(dropdown), DAT(dropdown), CLK(dropdown) | `ps2x_init($ps2, 12, 15, 14, 13)` | `PS2X ps2(12, 15, 14, 13); ↵ ps2.begin(); ↵ ps2.readGamepad();` |
| `ps2x_connected` | Value (Boolean) | VAR(field_variable) | `ps2x_connected($ps2)` | `ps2.connected()` |
| `ps2x_button_pressed` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_pressed($ps2, TRIANGLE)` | `ps2.buttonPressed(PS2X_TRIANGLE)` |
| `ps2x_button_newpress` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_newpress($ps2, TRIANGLE)` | `ps2.buttonNewPressed(PS2X_TRIANGLE)` |
| `ps2x_button_released` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_released($ps2, TRIANGLE)` | `ps2.buttonReleased(PS2X_TRIANGLE)` |
| `ps2x_stick` | Value (Number) | VAR(field_variable), STICK(dropdown) | `ps2x_stick($ps2, LX)` | `ps2.stick(PS2X_LX)` |
| `ps2x_set_vibration` | Statement | VAR(field_variable), SMALL(input_value), LARGE(input_value) | `ps2x_set_vibration($ps2, logic_boolean(TRUE), math_number(1))` | `ps2.setVibration(true, (uint8_t)constrain(1, 0, 255));` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| VAR | A PS2X variable such as `$ps2` | Pass the variable directly to every block. |
| ATT / CMD / DAT / CLK | Numeric pin tokens from the selected board | Constructor order is `PS2X(att, cmd, dat, clk)`. Invalid tokens fall back to `12`, `15`, `14`, and `13`, respectively. |
| BUTTON | `TRIANGLE`, `CIRCLE`, `CROSS`, `SQUARE`, `UP`, `DOWN`, `LEFT`, `RIGHT`, `L1`, `R1`, `L2`, `R2`, `SELECT`, `START`, `L3`, `R3` | Gamepad buttons. |
| STICK | `LX`, `LY`, `RX`, `RY` | Left/right stick X/Y axes. |
| SMALL | Boolean input | Small motor on/off. |
| LARGE | Number input | Large motor strength, constrained to `0..255`. |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    ps2x_init($ps2, 12, 15, 14, 13)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, ps2x_stick($ps2, LX))
    serial_println(Serial, ps2x_stick($ps2, RY))
    controls_if(ps2x_connected($ps2))
        @DO0:
            controls_if(ps2x_button_pressed($ps2, CROSS))
                @DO0:
                    ps2x_set_vibration($ps2, logic_boolean(TRUE), math_number(128))
    controls_if(ps2x_button_newpress($ps2, TRIANGLE))
        @DO0:
            ps2x_set_vibration($ps2, logic_boolean(FALSE), math_number(0))
    controls_if(ps2x_button_released($ps2, START))
        @DO0:
            serial_println(Serial, text("released"))
```

## Notes

- **Initialization and polling:** Put `ps2x_init` in `arduino_setup()`. It creates the global PS2X object and injects initialization at the start of setup and one `readGamepad()` call at the start of every loop. No manual polling block is needed. Use the other blocks after initialization, normally in the loop. Pass `$ps2` directly in VAR fields, without `variables_get` or quotes.
- **ESP32 wiring and transport:** ESP32 uses GPIO bit-banging with LSB-first transfers and a 5 microsecond half-bit delay in version 1.3.21. Select suitable available GPIOs for ATT, CMD, DAT, and CLK; DAT must support input and the other three pins must support output.
- **Other cores:** The driver uses hardware SPI at 100 kHz, SPI_MODE3, with bit-order reversal around MSBFIRST transfers. CMD, DAT, and CLK must use the board's MOSI, MISO, and SCK pins on cores with fixed SPI pads; selecting different dropdown values does not remap those pads. For micro:bit V2 / MakeBit, use ATT=P12, CMD=P15, DAT=P14, CLK=P13, represented as `12, 15, 14, 13` in ABS. Use 3.3 V logic and a shared ground.
- **Buttons and sticks:** `button_pressed` stays true while held; `button_newpress` and `button_released` report edges in the current loop. Stick values range from `-100` to `100`, with `0` at the center. Digital-only pads provide buttons but no analog stick movement.
- **Connection and arming:** `ps2x_connected` is true only when the link is valid and controls are armed. The driver validates and filters incoming data, suppresses controls when the link is invalid, and retries configuration after disconnection. Arming requires at least four good polls, more than 1.2 seconds without rejected data, and 250 ms with every button released and every stick centered within 24 raw counts of 128. A disconnected pad returns zero stick values and no pressed buttons.
- **Vibration:** The block stores motor settings for the next automatic poll. A compatible gamepad and receiver must accept the rumble configuration for vibration to work. Use false and zero to request stopping both motors. The driver sends the standard rumble mapping followed by a mirrored mapping, but poll data remains in standard order. If a receiver accepts the mirrored mapping, motor controls may be swapped and enabling the small motor may run the large motor at full strength; this version does not adapt poll byte order to the accepted mapping.
- **Diagnostics:** Serial messages report wiring, connection/control state, rejected frames, and rumble configuration. Diagnostic bytes help distinguish a wiring problem from a receiver that responds but does not accept configuration. The ABS example starts Serial at 115200 baud.
