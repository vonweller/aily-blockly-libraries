# ESP8266 Servo

Servo control using the ESP8266 built-in Servo implementation.

## Library Info
- **Name**: @aily-project/lib-esp8266-servo
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_servo_write` | Statement | PIN(dropdown), ANGLE(input_value) | `esp8266_servo_write(PIN, ANGLE)` | `esp8266_servo_PIN.write(1);` |
| `esp8266_servo_read` | Value | PIN(dropdown) | `esp8266_servo_read(PIN)` | `esp8266_servo_PIN.read()` |
| `esp8266_servo_angle` | Value | ANGLE(field_angle180) | `esp8266_servo_angle(0)` | `0` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_servo_write.PIN | board-provided options | Selects the generated API option. |
| esp8266_servo_read.PIN | board-provided options | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    esp8266_servo_write(PIN, ANGLE)
```
