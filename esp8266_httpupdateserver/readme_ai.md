# ESP8266 HTTP Update Server

Browser-based firmware update server for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-httpupdateserver
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_httpupdateserver_setup` | Statement | VAR(field_variable) | `esp8266_httpupdateserver_setup($server)` | `httpUpdater.setup(&server);` |
| `esp8266_httpupdateserver_setup_path` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_httpupdateserver_setup_path($server, PATH)` | `httpUpdater.setup(&server, "value");` |
| `esp8266_httpupdateserver_setup_auth` | Statement | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_setup_auth($server, USERNAME, PASSWORD)` | `httpUpdater.setup(&server, "value", "value");` |
| `esp8266_httpupdateserver_setup_full` | Statement | VAR(field_variable), PATH(input_value), USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_setup_full($server, PATH, USERNAME, PASSWORD)` | `httpUpdater.setup(&server, "value", "value", "value");` |
| `esp8266_httpupdateserver_update_credentials` | Statement | USERNAME(input_value), PASSWORD(input_value) | `esp8266_httpupdateserver_update_credentials(USERNAME, PASSWORD)` | `httpUpdater.updateCredentials("value", "value");` |

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
arduino_setup()
    esp8266_httpupdateserver_setup($server)
```
