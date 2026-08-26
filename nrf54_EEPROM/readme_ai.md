# nRF54 EEPROM

Arduino-compatible EEPROM emulation backed by nRF54 on-chip nonvolatile storage.

## Library Info
- **Name**: @aily-project/lib-nrf54-eeprom
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_eeprom_init` | Statement | SIZE(input_value) | `nrf54_eeprom_init(math_number(0))` | `EEPROM.begin((size_t)(1));` |
| `nrf54_eeprom_end` | Statement | (none) | `nrf54_eeprom_end()` | `EEPROM.end();` |
| `nrf54_eeprom_commit` | Statement | (none) | `nrf54_eeprom_commit()` | `EEPROM.commit();` |
| `nrf54_eeprom_read` | Value | ADDRESS(input_value) | `nrf54_eeprom_read(math_number(0))` | `EEPROM.read((int)(1))` |
| `nrf54_eeprom_write` | Statement | ADDRESS(input_value), VALUE(input_value) | `nrf54_eeprom_write(math_number(0), math_number(0))` | `EEPROM.write((int)(1), (uint8_t)(1));` |
| `nrf54_eeprom_update` | Statement | ADDRESS(input_value), VALUE(input_value) | `nrf54_eeprom_update(math_number(0), math_number(0))` | `EEPROM.update((int)(1), (uint8_t)(1));` |
| `nrf54_eeprom_length` | Value | (none) | `nrf54_eeprom_length()` | `EEPROM.length()` |
| `nrf54_eeprom_get` | Value | ADDRESS(input_value), TYPE(dropdown) | `nrf54_eeprom_get(math_number(0), uint8_t)` | `nrf54EepromGet_uint8((int)(1))` |
| `nrf54_eeprom_put` | Statement | ADDRESS(input_value), TYPE(dropdown), VALUE(input_value) | `nrf54_eeprom_put(math_number(0), uint8_t, math_number(0))` | `EEPROM.put((int)(1), (uint8_t)(1));` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | uint8_t, int8_t, uint16_t, int16_t, uint32_t, int32_t, float, double, bool | nrf54_eeprom_get, nrf54_eeprom_put |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_eeprom_init(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_eeprom_read(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
