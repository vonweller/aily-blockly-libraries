# ESP8266 I2S

ESP8266-specific I2S audio input and output.

## Library Info
- **Name**: @aily-project/lib-esp8266-i2s
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_i2s_begin` | Value | RATE(input_value), BITS(dropdown) | `esp8266_i2s_begin(math_number(0), 16)` | `I2S.begin(I2S_PHILIPS_MODE, 1, 16)` |
| `esp8266_i2s_end` | Statement | (none) | `esp8266_i2s_end()` | `I2S.end();` |
| `esp8266_i2s_available` | Value | (none) | `esp8266_i2s_available()` | `I2S.available()` |
| `esp8266_i2s_available_for_write` | Value | (none) | `esp8266_i2s_available_for_write()` | `I2S.availableForWrite()` |
| `esp8266_i2s_read` | Value | (none) | `esp8266_i2s_read()` | `I2S.read()` |
| `esp8266_i2s_peek` | Value | (none) | `esp8266_i2s_peek()` | `I2S.peek()` |
| `esp8266_i2s_write` | Statement | SAMPLE(input_value) | `esp8266_i2s_write(SAMPLE)` | `I2S.write((int32_t)(1));` |
| `esp8266_i2s_flush` | Statement | (none) | `esp8266_i2s_flush()` | `I2S.flush();` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_i2s_begin.BITS | 16, 24 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    serial_println(Serial, esp8266_i2s_begin(math_number(0), 16))
```
