# Adafruit TinyUSB

USB device descriptors, WebUSB serial, MIDI, and enumeration state.

## Library Info
- **Name**: @aily-project/lib-adafruit-tinyusb
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tinyusb_device_init` | Statement | VID(input_value), PID(input_value), MANUFACTURER(input_value), PRODUCT(input_value) | `tinyusb_device_init(math_number(0), math_number(0), text("value"), text("value"))` | Dynamic code |
| `tinyusb_webusb_init` | Statement | VAR(field_input), HOST(field_input) | `tinyusb_webusb_init("webUsb", "example.tinyusb.org/webusb-serial/index.html")` | Dynamic code |
| `tinyusb_webusb_write` | Statement | VAR(field_variable), OP(dropdown), DATA(input_value) | `tinyusb_webusb_write(variables_get($webUsb), print, math_number(0))` | Dynamic code |
| `tinyusb_webusb_data` | Value | VAR(field_variable), DATA(dropdown) | `tinyusb_webusb_data(variables_get($webUsb), available)` | Dynamic code |
| `tinyusb_midi_init` | Statement | VAR(field_input) | `tinyusb_midi_init("usbMidi")` | Dynamic code |
| `tinyusb_midi_note` | Statement | VAR(field_variable), ACTION(dropdown), NOTE(input_value), VELOCITY(input_value), CHANNEL(input_value) | `tinyusb_midi_note(variables_get($usbMidi), sendNoteOn, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tinyusb_midi_control` | Statement | VAR(field_variable), CONTROL(input_value), VALUE(input_value), CHANNEL(input_value) | `tinyusb_midi_control(variables_get($usbMidi), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tinyusb_mounted` | Value | (none) | `tinyusb_mounted()` | TinyUSBDevice.mounted() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OP | print, println, write | tinyusb_webusb_write |
| DATA | available, read, connected | tinyusb_webusb_data |
| ACTION | sendNoteOn, sendNoteOff, sendPolyPressure | tinyusb_midi_note |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tinyusb_device_init(math_number(0), math_number(0), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tinyusb_webusb_data(variables_get($webUsb), available))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tinyusb_webusb_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
