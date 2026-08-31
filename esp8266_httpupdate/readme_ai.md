# ESP8266 HTTP Update

HTTP firmware and filesystem update blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-httpupdate
- **Version**: 1.0.0
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_httpupdate_set_led_pin` | Statement | PIN(input_value), LED_ON(dropdown) | `esp8266_httpupdate_set_led_pin(math_number(2), HIGH)` | `ESPhttpUpdate.setLedPin(1, HIGH);` |
| `esp8266_httpupdate_set_md5` | Statement | MD5(input_value) | `esp8266_httpupdate_set_md5(MD5)` | `ESPhttpUpdate.setMD5sum("value");` |
| `esp8266_httpupdate_set_auth` | Statement | USER(input_value), PASSWORD(input_value) | `esp8266_httpupdate_set_auth(USER, PASSWORD)` | `ESPhttpUpdate.setAuthorization("value", "value");` |
| `esp8266_httpupdate_update` | Statement | URL(input_value) | `esp8266_httpupdate_update(URL)` | `ret = ESPhttpUpdate.update(esp8266HttpUpdateClient, "value");` |
| `esp8266_httpupdate_update_spiffs` | Statement | URL(input_value) | `esp8266_httpupdate_update_spiffs(URL)` | `ret = ESPhttpUpdate.updateFS(esp8266HttpUpdateClient, "value");` |
| `esp8266_httpupdate_on_start` | Hat | HANDLER(input_statement) | `esp8266_httpupdate_on_start()` | `void httpupdate_start_httpUpdate() { ↵ } ↵ ESPhttpUpdate.onStart(httpupdate_start_httpUpdate);` |
| `esp8266_httpupdate_on_end` | Hat | HANDLER(input_statement) | `esp8266_httpupdate_on_end()` | `void httpupdate_end_httpUpdate() { ↵ } ↵ ESPhttpUpdate.onEnd(httpupdate_end_httpUpdate);` |
| `esp8266_httpupdate_on_progress` | Hat | HANDLER(input_statement) | `esp8266_httpupdate_on_progress()` | `void httpupdate_progress_httpUpdate(int cur, int total) { ↵ } ↵ ESPhttpUpdate.onProgress(httpupdate_progress_httpUpdate);` |
| `esp8266_httpupdate_on_error` | Hat | HANDLER(input_statement) | `esp8266_httpupdate_on_error()` | `void httpupdate_error_httpUpdate(int err) { ↵ } ↵ ESPhttpUpdate.onError(httpupdate_error_httpUpdate);` |
| `esp8266_httpupdate_get_last_error` | Value | (none) | `esp8266_httpupdate_get_last_error()` | `ESPhttpUpdate.getLastError()` |
| `esp8266_httpupdate_get_last_error_string` | Value | (none) | `esp8266_httpupdate_get_last_error_string()` | `ESPhttpUpdate.getLastErrorString()` |
| `esp8266_httpupdate_result` | Value | (none) | `esp8266_httpupdate_result()` | `ret` |
| `esp8266_httpupdate_result_list` | Value | CODE(dropdown) | `esp8266_httpupdate_result_list(HTTP_UPDATE_FAILED)` | `HTTP_UPDATE_FAILED` |
| `esp8266_httpupdate_process_current` | Value | (none) | `esp8266_httpupdate_process_current()` | `cur` |
| `esp8266_httpupdate_process_total` | Value | (none) | `esp8266_httpupdate_process_total()` | `total` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_httpupdate_set_led_pin.LED_ON | HIGH, LOW | Selects the generated API option. |
| esp8266_httpupdate_result_list.CODE | HTTP_UPDATE_FAILED, HTTP_UPDATE_NO_UPDATES, HTTP_UPDATE_OK | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    esp8266_httpupdate_set_led_pin(math_number(2), HIGH)
```
