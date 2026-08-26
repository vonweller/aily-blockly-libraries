# ESP8266 SPI Slave

Exchange 32-byte data and 32-bit status through the ESP8266 HSPI slave.

## Library Info
- **Name**: @aily-project/lib-esp8266-spislave
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_spislave_begin` | Statement | LENGTH(dropdown) | `esp8266_spislave_begin(4)` | `SPISlave.begin(4);` |
| `esp8266_spislave_end` | Statement | (none) | `esp8266_spislave_end()` | `SPISlave.end();` |
| `esp8266_spislave_set_data` | Statement | DATA(input_value) | `esp8266_spislave_set_data(DATA)` | `{ String esp8266SpiSlaveData = String("value"); SPISlave.setData(esp8266SpiSlaveData.c_str()); }` |
| `esp8266_spislave_set_status` | Statement | STATUS(input_value) | `esp8266_spislave_set_status(STATUS)` | `SPISlave.setStatus((uint32_t)(1));` |
| `esp8266_spislave_on_data` | Hat | HANDLER(input_statement) | `esp8266_spislave_on_data()` | `void esp8266SpiSlaveDataCallback(uint8_t *data, size_t len) { ↵ } ↵ SPISlave.onData(esp8266SpiSlaveDataCallback);` |
| `esp8266_spislave_on_status` | Hat | HANDLER(input_statement) | `esp8266_spislave_on_status()` | `void esp8266SpiSlaveStatusCallback(uint32_t status) { ↵ } ↵ SPISlave.onStatus(esp8266SpiSlaveStatusCallback);` |
| `esp8266_spislave_on_data_sent` | Hat | HANDLER(input_statement) | `esp8266_spislave_on_data_sent()` | `void esp8266SpiSlaveDataSentCallback() { ↵ } ↵ SPISlave.onDataSent(esp8266SpiSlaveDataSentCallback);` |
| `esp8266_spislave_on_status_sent` | Hat | HANDLER(input_statement) | `esp8266_spislave_on_status_sent()` | `void esp8266SpiSlaveStatusSentCallback() { ↵ } ↵ SPISlave.onStatusSent(esp8266SpiSlaveStatusSentCallback);` |
| `esp8266_spislave_received_text` | Value | (none) | `esp8266_spislave_received_text()` | `String((char *)data)` |
| `esp8266_spislave_received_length` | Value | (none) | `esp8266_spislave_received_length()` | `len` |
| `esp8266_spislave_received_status` | Value | (none) | `esp8266_spislave_received_status()` | `status` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_spislave_begin.LENGTH | 4, 2, 1 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_spislave_begin(4)
```
