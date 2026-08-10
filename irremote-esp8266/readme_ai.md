# IRremoteESP8266

Send and decode infrared signals on ESP8266 and ESP32.

## Library Info
- **Name**: @aily-project/lib-irremote-esp8266
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ir_esp_send_init` | Statement | VAR(field_input), PIN(dropdown) | `ir_esp_send_init("irSend", PIN)` | Dynamic code |
| `ir_esp_send_code` | Statement | VAR(field_variable), PROTOCOL(dropdown), CODE(input_value), BITS(input_value), REPEATS(input_value) | `ir_esp_send_code(variables_get($irSend), sendNEC, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ir_esp_send_raw` | Statement | VAR(field_variable), ARRAY(field_input), LENGTH(input_value), KHZ(input_value) | `ir_esp_send_raw(variables_get($irSend), "rawData", math_number(0), math_number(0))` | Dynamic code |
| `ir_esp_recv_init` | Statement | VAR(field_input), PIN(dropdown), BUFFER(input_value), TIMEOUT(input_value) | `ir_esp_recv_init("irRecv", PIN, math_number(0), math_number(1000))` | Dynamic code |
| `ir_esp_when_received` | Statement | VAR(field_variable), DO(input_statement) | `ir_esp_when_received(variables_get($irRecv)) @DO: child_block()` | if ( |
| `ir_esp_received_data` | Value | VAR(field_variable), DATA(dropdown) | `ir_esp_received_data(variables_get($irRecv), value)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTOCOL | sendNEC, sendSony, sendRC5, sendRC6, sendSamsung, sendLG, sendPanasonic64 | ir_esp_send_code |
| DATA | value, bits, decode_type, repeat, overflow, text, source | ir_esp_received_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ir_esp_send_init("irSend", PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ir_esp_received_data(variables_get($irRecv), value))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ir_esp_send_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
