# ESP8266 System

ESP8266 chip, heap, flash, reset and deep-sleep system functions.

## Library Info
- **Name**: @aily-project/lib-esp8266-system
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_system_info_number` | Value | INFO(dropdown) | `esp8266_system_info_number(getChipId)` | `ESP.getChipId()` |
| `esp8266_system_info_text` | Value | INFO(dropdown) | `esp8266_system_info_text(getSdkVersion)` | `String(ESP.getSdkVersion())` |
| `esp8266_system_restart` | Statement | (none) | `esp8266_system_restart()` | `ESP.restart();` |
| `esp8266_system_erase_config` | Value | (none) | `esp8266_system_erase_config()` | `ESP.eraseConfig()` |
| `esp8266_system_deep_sleep` | Statement | TIME(input_value), MODE(dropdown) | `esp8266_system_deep_sleep(math_number(1000), RF_DEFAULT)` | `ESP.deepSleep((uint64_t)(1), RF_DEFAULT);` |
| `esp8266_system_deep_sleep_instant` | Statement | TIME(input_value), MODE(dropdown) | `esp8266_system_deep_sleep_instant(math_number(1000), RF_DEFAULT)` | `ESP.deepSleepInstant((uint64_t)(1), RF_DEFAULT);` |
| `esp8266_system_deep_sleep_max` | Value | (none) | `esp8266_system_deep_sleep_max()` | `ESP.deepSleepMax()` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_system_info_number.INFO | getChipId, getFreeHeap, getMaxFreeBlockSize, getHeapFragmentation, getFreeContStack, getFlashChipId, getFlashChipRealSize, getFlashChipSize, getFlashChipSpeed, getSketchSize, getFreeSketchSpace, getCycleCount | Selects the generated API option. |
| esp8266_system_info_text.INFO | getSdkVersion, getCoreVersion, getFullVersion, getSketchMD5, getResetReason, getResetInfo | Selects the generated API option. |
| esp8266_system_deep_sleep.MODE | RF_DEFAULT, WAKE_RFCAL, WAKE_NO_RFCAL, WAKE_RF_DISABLED | Selects the generated API option. |
| esp8266_system_deep_sleep_instant.MODE | RF_DEFAULT, WAKE_RFCAL, WAKE_NO_RFCAL, WAKE_RF_DISABLED | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    esp8266_system_restart()
```
