# nRF54 Preferences

Persistent key/value storage for nRF54 with numeric, boolean, String, and byte values.

## Library Info
- **Name**: @aily-project/lib-nrf54-preferences
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_preferences_begin` | Statement | NAMESPACE(input_value), READONLY(dropdown) | `nrf54_preferences_begin(text("value"), false)` | `nrf54Preferences.begin("value", false);` |
| `nrf54_preferences_end` | Statement | (none) | `nrf54_preferences_end()` | `nrf54Preferences.end();` |
| `nrf54_preferences_clear` | Statement | (none) | `nrf54_preferences_clear()` | `nrf54Preferences.clear();` |
| `nrf54_preferences_remove` | Statement | KEY(input_value) | `nrf54_preferences_remove(text("value"))` | `nrf54Preferences.remove("value");` |
| `nrf54_preferences_is_key` | Value | KEY(input_value) | `nrf54_preferences_is_key(text("value"))` | `nrf54Preferences.isKey("value")` |
| `nrf54_preferences_free_entries` | Value | (none) | `nrf54_preferences_free_entries()` | `nrf54Preferences.freeEntries()` |
| `nrf54_preferences_put_number` | Statement | KEY(input_value), TYPE(dropdown), VALUE(input_value) | `nrf54_preferences_put_number(text("value"), putChar, math_number(0))` | `nrf54Preferences.putChar("value", 1);` |
| `nrf54_preferences_get_number` | Value | KEY(input_value), TYPE(dropdown), DEFAULT(input_value) | `nrf54_preferences_get_number(text("value"), getChar, math_number(0))` | `nrf54Preferences.getChar("value", 1)` |
| `nrf54_preferences_put_bool` | Statement | KEY(input_value), VALUE(input_value) | `nrf54_preferences_put_bool(text("value"), logic_boolean(TRUE))` | `nrf54Preferences.putBool("value", true);` |
| `nrf54_preferences_get_bool` | Value | KEY(input_value), DEFAULT(input_value) | `nrf54_preferences_get_bool(text("value"), logic_boolean(TRUE))` | `nrf54Preferences.getBool("value", true)` |
| `nrf54_preferences_put_string` | Statement | KEY(input_value), VALUE(input_value) | `nrf54_preferences_put_string(text("value"), text("value"))` | `nrf54Preferences.putString("value", "value");` |
| `nrf54_preferences_get_string` | Value | KEY(input_value), DEFAULT(input_value) | `nrf54_preferences_get_string(text("value"), text("value"))` | `nrf54Preferences.getString("value", "value")` |
| `nrf54_preferences_put_bytes` | Statement | KEY(input_value), BUFFER(field_input), LENGTH(input_value) | `nrf54_preferences_put_bytes(text("value"), "buffer", math_number(0))` | `nrf54Preferences.putBytes("value", buffer, 1);` |
| `nrf54_preferences_get_bytes` | Value | KEY(input_value), BUFFER(field_input), MAX_LENGTH(input_value) | `nrf54_preferences_get_bytes(text("value"), "buffer", math_number(0))` | `nrf54Preferences.getBytes("value", buffer, 1)` |
| `nrf54_preferences_get_bytes_length` | Value | KEY(input_value) | `nrf54_preferences_get_bytes_length(text("value"))` | `nrf54Preferences.getBytesLength("value")` |

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
