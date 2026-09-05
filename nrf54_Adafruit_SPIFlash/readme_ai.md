# nRF54 Adafruit SPIFlash

Adafruit SPIFlash-compatible access to nRF54 onboard QSPI and generic SPI flash devices.

## Library Info
- **Name**: @aily-project/lib-nrf54-adafruit-spiflash
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_spiflash_begin_qspi` | Statement | (none) | `nrf54_spiflash_begin_qspi()` | `nrf54FlashTransport = &nrf54QspiTransport; ↵ nrf54Flash = &nrf54QspiFlash; ↵ nrf54Flash->begin();` |
| `nrf54_spiflash_begin_spi` | Statement | CS(dropdown) | `nrf54_spiflash_begin_spi(CS)` | `nrf54FlashTransport = &nrf54SpiTransport; ↵ nrf54Flash = &nrf54SpiFlash; ↵ nrf54Flash->begin();` |
| `nrf54_spiflash_end` | Statement | (none) | `nrf54_spiflash_end()` | `if (nrf54Flash != nullptr) nrf54Flash->end();` |
| `nrf54_spiflash_size` | Value | (none) | `nrf54_spiflash_size()` | `(nrf54Flash != nullptr ? nrf54Flash->size() : 0U)` |
| `nrf54_spiflash_jedec_id` | Value | (none) | `nrf54_spiflash_jedec_id()` | `(nrf54Flash != nullptr ? nrf54Flash->readJEDECID() : 0U)` |
| `nrf54_spiflash_jedec_part` | Value | PART(dropdown) | `nrf54_spiflash_jedec_part("0")` | `((nrf54Flash != nullptr ? nrf54Flash->readJEDECID() : 0U) >> 16) & 0xFFU` |
| `nrf54_spiflash_read_byte` | Value | ADDRESS(input_value) | `nrf54_spiflash_read_byte(math_number(0))` | `nrf54SpiFlashReadByte((uint32_t)(1))` |
| `nrf54_spiflash_write_byte` | Statement | ADDRESS(input_value), VALUE(input_value) | `nrf54_spiflash_write_byte(math_number(0), math_number(0))` | `nrf54SpiFlashWriteByte((uint32_t)(1), (uint8_t)(1));` |
| `nrf54_spiflash_read_text` | Value | ADDRESS(input_value), LENGTH(input_value) | `nrf54_spiflash_read_text(math_number(0), math_number(0))` | `nrf54SpiFlashReadText((uint32_t)(1), (size_t)(1))` |
| `nrf54_spiflash_write_text` | Value | ADDRESS(input_value), DATA(input_value) | `nrf54_spiflash_write_text(math_number(0), text("value"))` | `nrf54SpiFlashWriteText((uint32_t)(1), String("value"))` |
| `nrf54_spiflash_erase_sector` | Value | ADDRESS(input_value) | `nrf54_spiflash_erase_sector(math_number(0))` | `(nrf54Flash != nullptr && nrf54Flash->eraseSector((uint32_t)(1)))` |
| `nrf54_spiflash_erase_chip` | Value | (none) | `nrf54_spiflash_erase_chip()` | `(nrf54Flash != nullptr && nrf54Flash->eraseChip())` |
| `nrf54_spiflash_wait_ready` | Value | TIMEOUT(input_value) | `nrf54_spiflash_wait_ready(math_number(1000))` | `(nrf54Flash != nullptr && nrf54Flash->waitUntilReady((uint32_t)(1)))` |
| `nrf54_spiflash_is_busy` | Value | (none) | `nrf54_spiflash_is_busy()` | `(nrf54Flash != nullptr && nrf54Flash->isBusy())` |
| `nrf54_spiflash_sector_count` | Value | (none) | `nrf54_spiflash_sector_count()` | `(nrf54Flash != nullptr ? nrf54Flash->sectorCount() : 0U)` |
| `nrf54_spiflash_run_command` | Value | COMMAND(input_value) | `nrf54_spiflash_run_command(math_number(0))` | `(nrf54Flash != nullptr && nrf54Flash->runCommand((uint8_t)(1)))` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PART | 0, 1, 2 | nrf54_spiflash_jedec_part |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_spiflash_begin_qspi()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_spiflash_size())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
