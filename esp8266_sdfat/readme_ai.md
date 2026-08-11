# ESP8266 SdFat

Access FAT16, FAT32 and exFAT cards with the ESP8266 bundled SdFat library.

## Library Info
- **Name**: @aily-project/lib-esp8266-sdfat
- **Version**: 0.0.1
- **Author**: Bill Greiman
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_sdfat_create` | Statement | VAR(field_input) | `esp8266_sdfat_create(VAR)` | `SdFs sd;` |
| `esp8266_sdfat_begin` | Value | VAR(field_variable), CS(dropdown), MHZ(input_value) | `esp8266_sdfat_begin($sd, CS, MHZ)` | `sd.begin(CS, SD_SCK_MHZ(1))` |
| `esp8266_sdfat_exists` | Value | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_exists($sd, PATH)` | `sd.exists(String("value").c_str())` |
| `esp8266_sdfat_mkdir` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_mkdir($sd, PATH)` | `sd.mkdir(String("value").c_str());` |
| `esp8266_sdfat_remove` | Statement | VAR(field_variable), PATH(input_value) | `esp8266_sdfat_remove($sd, PATH)` | `sd.remove(String("value").c_str());` |
| `esp8266_sdfat_rename` | Statement | VAR(field_variable), OLD(input_value), NEW(input_value) | `esp8266_sdfat_rename($sd, OLD, NEW)` | `sd.rename(String("value").c_str(), String("value").c_str());` |
| `esp8266_sdfat_sector_count` | Value | VAR(field_variable) | `esp8266_sdfat_sector_count($sd)` | `sd.card()->sectorCount()` |
| `esp8266_sdfat_fat_type` | Value | VAR(field_variable) | `esp8266_sdfat_fat_type($sd)` | `sd.vol()->fatType()` |
| `esp8266_sdfat_format` | Value | VAR(field_variable) | `esp8266_sdfat_format($sd)` | `sd.format(&Serial)` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_sdfat_begin.CS | board-provided options | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_sdfat_create(VAR)
```
