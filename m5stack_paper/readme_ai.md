# Paper Onboard Sensors

## Library Info
- **Name**: @aily-project/lib-m5stack-paper
- **Version**: 0.1.0
- **Official source**: M5Unit-ENV SHT3X

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5paper_init` | Statement | `m5paper_init()` |
| `m5paper_sht_available` | Boolean | `m5paper_sht_available()` |
| `m5paper_sht_value` | Number | `m5paper_sht_value(TEMPERATURE)` |
| `m5paper_fram_write_byte` | Boolean | `m5paper_fram_write_byte(math_number(0), math_number(0))` |
| `m5paper_fram_read_byte` | Number | `m5paper_fram_read_byte(math_number(0))` |
| `m5paper_fram_write_text` | Boolean | `m5paper_fram_write_text(math_number(0), text("Hello"))` |
| `m5paper_fram_read_text` | String | `m5paper_fram_read_text(math_number(0), math_number(32))` |

SHT readings are cached for 500ms. FRAM addresses and lengths are constrained so no operation crosses the 256-byte capacity.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `m5paper_init` | Statement | (none) | `m5paper_init()` | `auto ailyM5Config = M5.config(); ↵ M5.begin(ailyM5Config); ↵ M5.update(); ↵ SHT3X ailyM5PaperSHT30; ↵ bool ailyM5PaperSHTReady = false; ↵ ailyM5PaperSHTReady = ailyM5PaperSHT30.begin(&Wire, 0x44, 21, 22, 400000U);` |
| `m5paper_sht_available` | Value | (none) | `m5paper_sht_available()` | `ailyM5PaperSHTReady` |
| `m5paper_sht_value` | Value | VALUE(dropdown) | `m5paper_sht_value(TEMPERATURE)` | `ailyM5PaperSHTValue(false)` |
| `m5paper_fram_write_byte` | Value | ADDRESS(input_value), VALUE(input_value) | `m5paper_fram_write_byte(math_number(0), math_number(0))` | `ailyM5PaperFRAMWriteByte((uint8_t)constrain(1, 0, 255), (uint8_t)(1))` |
| `m5paper_fram_read_byte` | Value | ADDRESS(input_value) | `m5paper_fram_read_byte(math_number(0))` | `ailyM5PaperFRAMReadByte((uint8_t)constrain(1, 0, 255))` |
| `m5paper_fram_write_text` | Value | ADDRESS(input_value), TEXT(input_value) | `m5paper_fram_write_text(math_number(0), text("value"))` | `ailyM5PaperFRAMWriteText((uint8_t)constrain(1, 0, 255), String(1))` |
| `m5paper_fram_read_text` | Value | ADDRESS(input_value), LENGTH(input_value) | `m5paper_fram_read_text(math_number(0), math_number(0))` | `ailyM5PaperFRAMReadText((uint8_t)constrain(1, 0, 255), (uint16_t)constrain(1, 0, 256))` |
## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | TEMPERATURE, HUMIDITY | m5paper_sht_value |

## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    m5paper_init()
```
