# ESP8266 SPI

ESP8266-specific SPI master configuration, transactions and transfers.

## Library Info
- **Name**: @aily-project/lib-esp8266-spi
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_spi_begin` | Statement | (none) | `esp8266_spi_begin()` | `SPI.begin();` |
| `esp8266_spi_end` | Statement | (none) | `esp8266_spi_end()` | `SPI.end();` |
| `esp8266_spi_pins` | Value | SCK(dropdown), MISO(dropdown), MOSI(dropdown), SS(dropdown) | `esp8266_spi_pins(SCK, MISO, MOSI, SS)` | `SPI.pins(SCK, MISO, MOSI, SS)` |
| `esp8266_spi_hw_cs` | Statement | ENABLE(dropdown) | `esp8266_spi_hw_cs(true)` | `SPI.setHwCs(true);` |
| `esp8266_spi_begin_transaction` | Statement | FREQ(input_value), ORDER(dropdown), MODE(dropdown) | `esp8266_spi_begin_transaction(math_number(0), MSBFIRST, SPI_MODE0)` | `SPI.beginTransaction(SPISettings(1, MSBFIRST, SPI_MODE0));` |
| `esp8266_spi_end_transaction` | Statement | (none) | `esp8266_spi_end_transaction()` | `SPI.endTransaction();` |
| `esp8266_spi_transfer8` | Value | DATA(input_value) | `esp8266_spi_transfer8(DATA)` | `SPI.transfer((uint8_t)(1))` |
| `esp8266_spi_transfer16` | Value | DATA(input_value) | `esp8266_spi_transfer16(DATA)` | `SPI.transfer16((uint16_t)(1))` |
| `esp8266_spi_write8` | Statement | DATA(input_value) | `esp8266_spi_write8(DATA)` | `SPI.write((uint8_t)(1));` |
| `esp8266_spi_write16` | Statement | DATA(input_value) | `esp8266_spi_write16(DATA)` | `SPI.write16((uint16_t)(1));` |
| `esp8266_spi_write32` | Statement | DATA(input_value) | `esp8266_spi_write32(DATA)` | `SPI.write32((uint32_t)(1));` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_spi_pins.SCK | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.MISO | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.MOSI | board-provided options | Selects the generated API option. |
| esp8266_spi_pins.SS | board-provided options | Selects the generated API option. |
| esp8266_spi_hw_cs.ENABLE | true, false | Selects the generated API option. |
| esp8266_spi_begin_transaction.ORDER | MSBFIRST, LSBFIRST | Selects the generated API option. |
| esp8266_spi_begin_transaction.MODE | SPI_MODE0, SPI_MODE1, SPI_MODE2, SPI_MODE3 | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_spi_begin()
```
