# ESP8266 NetBIOS

Publish an ESP8266 hostname through NetBIOS name service.

## Library Info
- **Name**: @aily-project/lib-esp8266-netbios
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_netbios_begin` | Value | NAME(input_value) | `esp8266_netbios_begin(NAME)` | `NBNS.begin(String("value").c_str())` |
| `esp8266_netbios_end` | Statement | (none) | `esp8266_netbios_end()` | `NBNS.end();` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| None | None | No dropdown parameters. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    serial_println(Serial, esp8266_netbios_begin(NAME))
```
