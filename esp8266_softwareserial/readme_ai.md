# ESP8266 SoftwareSerial

Software serial communication blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-softwareserial
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_softwareserial_init` | Statement | VAR(field_input), RX_PIN(dropdown), TX_PIN(dropdown), BAUD(dropdown) | `esp8266_softwareserial_init("mySerial", RX_PIN, TX_PIN, 300)` | `mySerial.begin(300);` |
| `esp8266_softwareserial_available` | Value | VAR(field_variable) | `esp8266_softwareserial_available($mySerial)` | `mySerial.available()` |
| `esp8266_softwareserial_read` | Value | VAR(field_variable), TYPE(dropdown) | `esp8266_softwareserial_read($mySerial, "read()")` | `mySerial.read()` |
| `esp8266_softwareserial_print` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_print($mySerial, DATA)` | `mySerial.print(1);` |
| `esp8266_softwareserial_println` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_println($mySerial, DATA)` | `mySerial.println(1);` |
| `esp8266_softwareserial_write` | Statement | VAR(field_variable), DATA(input_value) | `esp8266_softwareserial_write($mySerial, DATA)` | `mySerial.write(1);` |
| `esp8266_softwareserial_listen` | Statement | VAR(field_variable) | `esp8266_softwareserial_listen($mySerial)` | `mySerial.listen();` |
| `esp8266_softwareserial_islistening` | Value | VAR(field_variable) | `esp8266_softwareserial_islistening($mySerial)` | `mySerial.isListening()` |
| `esp8266_softwareserial_overflow` | Value | VAR(field_variable) | `esp8266_softwareserial_overflow($mySerial)` | `mySerial.overflow()` |
| `esp8266_softwareserial_end` | Statement | VAR(field_variable) | `esp8266_softwareserial_end($mySerial)` | `mySerial.end();` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_softwareserial_init.RX_PIN | board-provided options | Selects the generated API option. |
| esp8266_softwareserial_init.TX_PIN | board-provided options | Selects the generated API option. |
| esp8266_softwareserial_init.BAUD | 300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200 | Selects the generated API option. |
| esp8266_softwareserial_read.TYPE | read(), peek(), parseInt(), parseFloat(), readString() | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_softwareserial_init("mySerial", RX_PIN, TX_PIN, 300)
```
