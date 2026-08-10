# nRF54 Preferences

Persistent key/value storage for nRF54 with numeric, boolean, String, and byte values.

## Library Info
- **Name**: @aily-project/lib-nrf54-preferences
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_preferences_begin` | Statement | NAMESPACE(input_value), READONLY(dropdown) | `nrf54_preferences_begin(text("value"), false)` | Dynamic code |
| `nrf54_preferences_end` | Statement | (none) | `nrf54_preferences_end()` | Dynamic code |
| `nrf54_preferences_clear` | Statement | (none) | `nrf54_preferences_clear()` | Dynamic code |
| `nrf54_preferences_remove` | Statement | KEY(input_value) | `nrf54_preferences_remove(text("value"))` | Dynamic code |
| `nrf54_preferences_is_key` | Value | KEY(input_value) | `nrf54_preferences_is_key(text("value"))` | Dynamic code |
| `nrf54_preferences_free_entries` | Value | (none) | `nrf54_preferences_free_entries()` | Dynamic code |
| `nrf54_preferences_put_number` | Statement | KEY(input_value), TYPE(dropdown), VALUE(input_value) | `nrf54_preferences_put_number(text("value"), putChar, math_number(0))` | Dynamic code |
| `nrf54_preferences_get_number` | Value | KEY(input_value), TYPE(dropdown), DEFAULT(input_value) | `nrf54_preferences_get_number(text("value"), getChar, math_number(0))` | Dynamic code |
| `nrf54_preferences_put_bool` | Statement | KEY(input_value), VALUE(input_value) | `nrf54_preferences_put_bool(text("value"), logic_boolean(TRUE))` | Dynamic code |
| `nrf54_preferences_get_bool` | Value | KEY(input_value), DEFAULT(input_value) | `nrf54_preferences_get_bool(text("value"), logic_boolean(TRUE))` | Dynamic code |
| `nrf54_preferences_put_string` | Statement | KEY(input_value), VALUE(input_value) | `nrf54_preferences_put_string(text("value"), text("value"))` | Dynamic code |
| `nrf54_preferences_get_string` | Value | KEY(input_value), DEFAULT(input_value) | `nrf54_preferences_get_string(text("value"), text("value"))` | Dynamic code |
| `nrf54_preferences_put_bytes` | Statement | KEY(input_value), BUFFER(field_input), LENGTH(input_value) | `nrf54_preferences_put_bytes(text("value"), "buffer", math_number(0))` | Dynamic code |
| `nrf54_preferences_get_bytes` | Value | KEY(input_value), BUFFER(field_input), MAX_LENGTH(input_value) | `nrf54_preferences_get_bytes(text("value"), "buffer", math_number(0))` | Dynamic code |
| `nrf54_preferences_get_bytes_length` | Value | KEY(input_value) | `nrf54_preferences_get_bytes_length(text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| READONLY | false, true | nrf54_preferences_begin |
| TYPE | putChar, putUChar, putShort, putUShort, putInt, putUInt, putLong, putULong, putLong64, putULong64, putFloat, putDouble | nrf54_preferences_put_number |
| TYPE | getChar, getUChar, getShort, getUShort, getInt, getUInt, getLong, getULong, getLong64, getULong64, getFloat, getDouble | nrf54_preferences_get_number |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_preferences_begin(text("value"), false)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_preferences_is_key(text("value")))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
