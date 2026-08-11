# ESP8266 lwIP Ethernet

Attach ENC28J60, W5100 or W5500 Ethernet to the ESP8266 native lwIP stack.

## Library Info
- **Name**: @aily-project/lib-esp8266-lwip-ethernet
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_lwip_ethernet_create` | Statement | VAR(field_input), DRIVER(dropdown), CS(dropdown) | `esp8266_lwip_ethernet_create("eth", Wiznet5500lwIP, CS)` | `Wiznet5500lwIP eth(CS);` |
| `esp8266_lwip_ethernet_begin_dhcp` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_begin_dhcp($eth)` | `ethInitDHCP(eth)` |
| `esp8266_lwip_ethernet_begin_static` | Value | VAR(field_variable), IP(input_value), GATEWAY(input_value), MASK(input_value), DNS(input_value) | `esp8266_lwip_ethernet_begin_static($eth, IP, GATEWAY, MASK, DNS)` | `ethInitStatic(eth, esp8266LwipParseIP(String("value")), esp8266LwipParseIP(String("value")), esp8266LwipParseIP(String("value")), esp8266LwipParseIP(String("value")))` |
| `esp8266_lwip_ethernet_connected` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_connected($eth)` | `eth.connected()` |
| `esp8266_lwip_ethernet_local_ip` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_local_ip($eth)` | `eth.localIP().toString()` |
| `esp8266_lwip_ethernet_linked` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_linked($eth)` | `eth.isLinked()` |
| `esp8266_lwip_ethernet_link_detectable` | Value | VAR(field_variable) | `esp8266_lwip_ethernet_link_detectable($eth)` | `eth.isLinkDetectable()` |
| `esp8266_lwip_ethernet_set_default` | Statement | VAR(field_variable), ENABLE(dropdown) | `esp8266_lwip_ethernet_set_default($eth, true)` | `eth.setDefault(true);` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_lwip_ethernet_create.DRIVER | Wiznet5500lwIP, Wiznet5100lwIP, ENC28J60lwIP | Selects the generated API option. |
| esp8266_lwip_ethernet_create.CS | board-provided options | Selects the generated API option. |
| esp8266_lwip_ethernet_set_default.ENABLE | true, false | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_lwip_ethernet_create("eth", Wiznet5500lwIP, CS)
```
