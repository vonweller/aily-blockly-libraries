# M5Stack Onboard SD Card

Onboard M5Stack SD card blocks that use the official M5Unified pin table and automatically select SPI or SDMMC. Tough uses its official SCK 18/MISO 38/MOSI 23/CS 4 wiring.

## Library Info
- **Name**: @aily-project/lib-m5stack-sd
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `m5stack_sd_init` | Statement | (none) | `m5stack_sd_init()` | `auto ailyM5Config = M5.config(); ↵ M5.begin(ailyM5Config); ↵ M5.update(); ↵ fs::FS* ailyM5SD = nullptr; ↵ String ailyM5SDPath(const String& value) { ↵ if (!value.length() &#124;&#124; value[0] == '/') return value; ↵ return String("/") + value; ↵ } ↵ bool ailyM5SDPresent() { ↵ if (ailyM5SD == &SD_MMC) return SD_MMC.cardType() != CARD_NONE; ↵ if (ailyM5SD == &SD) return SD.cardType() != CARD_NONE; ↵ return false; ↵ } ↵ bool ailyM5SDMount() { ↵ if (ailyM5SD && ailyM5SDPresent()) return true; ↵ if (ailyM5SD == &SD_MMC) SD_MMC.end(); ↵ else if (ailyM5SD == &SD) SD.end(); ↵ ailyM5SD = nullptr; ↵ if (M5.getBoard() == m5::board_t::board_M5Tough) { ↵ SPI.begin(18, 38, 23, 4); ↵ if (SD.begin(4, SPI, 25000000) && SD.cardType() != CARD_NONE) { ailyM5SD = &SD; return true; } ↵ SD.end(); return false; ↵ } ↵ if (!M5.hasSD()) return false; ↵ if (M5.hasSDMMC()) { ↵ SD_MMC.setPins(M5.getPin(m5::pin_name_t::sd_mmc_clk), M5.getPin(m5::pin_name_t::sd_mmc_cmd), M5.getPin(m5::pin_name_t::sd_mmc_d0), M5.getPin(m5::pin_name_t::sd_mmc_d1), M5.getPin(m5::pin_name_t::sd_mmc_d2), M5.getPin(m5::pin_name_t::sd_mmc_d3)); ↵ if (SD_MMC.begin("/sdcard", false) && SD_MMC.cardType() != CARD_NONE) { ailyM5SD = &SD_MMC; return true; } ↵ SD_MMC.end(); ↵ } else { ↵ int clk = M5.getPin(m5::pin_name_t::sd_spi_sclk); ↵ int miso = M5.getPin(m5::pin_name_t::sd_spi_miso); ↵ int mosi = M5.getPin(m5::pin_name_t::sd_spi_mosi); ↵ int cs = M5.getPin(m5::pin_name_t::sd_spi_cs); ↵ if (clk < 0 &#124;&#124; miso < 0 &#124;&#124; mosi < 0 &#124;&#124; cs < 0) return false; ↵ SPI.begin(clk, miso, mosi, cs); ↵ if (SD.begin(cs, SPI, 25000000) && SD.cardType() != CARD_NONE) { ailyM5SD = &SD; return true; } ↵ SD.end(); ↵ } ↵ return false; ↵ } ↵ ailyM5SDMount();` |
| `m5stack_sd_available` | Value | (none) | `m5stack_sd_available()` | `ailyM5SDMount()` |
| `m5stack_sd_exists` | Value | PATH(input_value) | `m5stack_sd_exists(text("value"))` | `(ailyM5SDMount() && ailyM5SD->exists(ailyM5SDPath(String("value"))))` |
| `m5stack_sd_read_text` | Value | PATH(input_value) | `m5stack_sd_read_text(text("value"))` | `ailyM5SDReadText(String("value"))` |
| `m5stack_sd_write_text` | Statement | MODE(dropdown), PATH(input_value), TEXT(input_value) | `m5stack_sd_write_text(WRITE, text("value"), text("value"))` | `ailyM5SDWriteText(String("value"), String(1), false);` |
| `m5stack_sd_write_ok` | Value | MODE(dropdown), PATH(input_value), TEXT(input_value) | `m5stack_sd_write_ok(WRITE, text("value"), text("value"))` | `ailyM5SDWriteText(String("value"), String(1), false)` |
| `m5stack_sd_remove` | Statement | PATH(input_value) | `m5stack_sd_remove(text("value"))` | `ailyM5SDRemove(String("value"));` |
| `m5stack_sd_remove_ok` | Value | PATH(input_value) | `m5stack_sd_remove_ok(text("value"))` | `ailyM5SDRemove(String("value"))` |
| `m5stack_sd_file_size` | Value | PATH(input_value) | `m5stack_sd_file_size(text("value"))` | `ailyM5SDFileSize(String("value"))` |
| `m5stack_sd_mkdir` | Value | PATH(input_value) | `m5stack_sd_mkdir(text("value"))` | `(ailyM5SDMount() && ailyM5SD->mkdir(ailyM5SDPath(String("value"))))` |
| `m5stack_sd_rmdir` | Value | PATH(input_value) | `m5stack_sd_rmdir(text("value"))` | `(ailyM5SDMount() && ailyM5SD->rmdir(ailyM5SDPath(String("value"))))` |
| `m5stack_sd_rename` | Value | FROM(input_value), TO(input_value) | `m5stack_sd_rename(text("from"), text("to"))` | `(ailyM5SDMount() && ailyM5SD->rename(ailyM5SDPath(String("value")), ailyM5SDPath(String("value"))))` |
| `m5stack_sd_list` | Value | PATH(input_value) | `m5stack_sd_list(text("/"))` | `ailyM5SDList(String("value"))` |
| `m5stack_sd_space` | Value | KIND(dropdown) | `m5stack_sd_space(CAPACITY)` | `ailyM5SDSpace(0)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | WRITE, APPEND | m5stack_sd_write_text, m5stack_sd_write_ok |
| KIND | CAPACITY, TOTAL, USED | m5stack_sd_space |

## ABS Examples

### Basic Usage
```
arduino_setup()
    m5stack_sd_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, m5stack_sd_available())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. Mounting verifies `cardType()` and clears a stale filesystem pointer so a removed/reinserted card can be mounted again.
