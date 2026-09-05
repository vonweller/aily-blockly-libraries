# ESP8266 SSDP

Configure and publish a UPnP/SSDP device description.

## Library Info
- **Name**: @aily-project/lib-esp8266-ssdp
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_ssdp_set_text` | Statement | FIELD(dropdown), VALUE(input_value) | `esp8266_ssdp_set_text(setDeviceType, text("value"))` | `SSDP.setDeviceType(String("value"));` |
| `esp8266_ssdp_set_http_port` | Statement | PORT(input_value) | `esp8266_ssdp_set_http_port(PORT)` | `SSDP.setHTTPPort(1);` |
| `esp8266_ssdp_set_ttl` | Statement | TTL(input_value) | `esp8266_ssdp_set_ttl(TTL)` | `SSDP.setTTL(1);` |
| `esp8266_ssdp_set_interval` | Statement | SECONDS(input_value) | `esp8266_ssdp_set_interval(SECONDS)` | `SSDP.setInterval(1);` |
| `esp8266_ssdp_begin` | Value | (none) | `esp8266_ssdp_begin()` | `SSDP.begin()` |
| `esp8266_ssdp_end` | Statement | (none) | `esp8266_ssdp_end()` | `SSDP.end();` |
| `esp8266_ssdp_schema` | Statement | SERVER(field_variable) | `esp8266_ssdp_schema($server)` | `SSDP.schema(server.client());` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_ssdp_set_text.FIELD | setDeviceType, setUUID, setName, setURL, setSchemaURL, setSerialNumber, setModelName, setModelNumber, setModelURL, setManufacturer, setManufacturerURL | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    serial_println(Serial, esp8266_ssdp_begin())
```
