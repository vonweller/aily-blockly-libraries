# ESP8266 mDNS

mDNS hostname and service discovery for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-mdns
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_mdns_begin` | Statement | HOSTNAME(input_value) | `esp8266_mdns_begin(HOSTNAME)` | `if (!MDNS.begin("value")) { ↵ Serial.println("Error starting mDNS"); ↵ }` |
| `esp8266_mdns_end` | Statement | (none) | `esp8266_mdns_end()` | `MDNS.end();` |
| `esp8266_mdns_add_service` | Statement | SERVICE(input_value), PROTO(dropdown), PORT(input_value) | `esp8266_mdns_add_service(text("value"), tcp, math_number(0))` | `MDNS.addService("value", "tcp", 1);` |
| `esp8266_mdns_add_service_txt` | Statement | SERVICE(input_value), PROTO(dropdown), KEY(input_value), VALUE(input_value) | `esp8266_mdns_add_service_txt(text("value"), tcp, text("value"), text("value"))` | `MDNS.addServiceTxt("value", "tcp", "value", "value");` |
| `esp8266_mdns_query_service` | Value | SERVICE(input_value), PROTO(dropdown) | `esp8266_mdns_query_service(text("value"), tcp)` | `MDNS.queryService("value", "tcp")` |
| `esp8266_mdns_result` | Value | INDEX(input_value), ATTR(dropdown) | `esp8266_mdns_result(math_number(0), hostname)` | `MDNS.hostname(1)` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_mdns_add_service.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_add_service_txt.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_query_service.PROTO | tcp, udp | Selects the generated API option. |
| esp8266_mdns_result.ATTR | hostname, address, port | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_mdns_begin(HOSTNAME)
```
