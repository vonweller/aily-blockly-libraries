# ESP8266 Ticker

Non-blocking periodic and one-shot timer callbacks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-ticker
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_ticker_attach_ms` | Statement | TICKER(field_input), INTERVAL(input_value), CALLBACK(input_statement) | `esp8266_ticker_attach_ms(TICKER, INTERVAL)` | `ticker1.attach_ms(1, esp8266_ticker_callback_1);` |
| `esp8266_ticker_once_ms` | Statement | TICKER(field_input), INTERVAL(input_value), CALLBACK(input_statement) | `esp8266_ticker_once_ms(TICKER, INTERVAL)` | `ticker1.once_ms(1, esp8266_ticker_callback_2);` |
| `esp8266_ticker_detach` | Statement | TICKER(field_variable) | `esp8266_ticker_detach($ticker1)` | `ticker1.detach();` |
| `esp8266_ticker_active` | Value | TICKER(field_variable) | `esp8266_ticker_active($ticker1)` | `ticker1.active()` |

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
    esp8266_ticker_attach_ms(TICKER, INTERVAL)
        @CALLBACK:
            serial_println(Serial, text("event"))
```
