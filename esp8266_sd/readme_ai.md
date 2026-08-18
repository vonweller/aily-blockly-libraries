# ESP8266 SD Storage

Built-in SD card file and directory operations for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-sd
- **Version**: 1.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_sd_begin` | Statement | CS_PIN(dropdown) | `esp8266_sd_begin(CS_PIN)` | `if (!SD.begin(CS_PIN)) { ↵ Serial.println("SD card mount failed"); ↵ return; ↵ } ↵ if (SD.cardType() == CARD_NONE) { ↵ Serial.println("No SD card attached"); ↵ SD.end(); ↵ return; ↵ }` |
| `esp8266_sd_end` | Statement | (none) | `esp8266_sd_end()` | `SD.end();` |
| `esp8266_sd_file_exists` | Value | PATH(input_value) | `esp8266_sd_file_exists(PATH)` | `SD.exists("value")` |
| `esp8266_sd_open_file` | Value | VAR(field_variable), PATH(input_value), MODE(dropdown) | `esp8266_sd_open_file($file, text("value"), FILE_READ)` | `file = SD.open("value", FILE_READ)` |
| `esp8266_sd_open_file_to` | Statement | VAR(field_variable), PATH(input_value), MODE(dropdown) | `esp8266_sd_open_file_to($file, text("value"), FILE_READ)` | `file = SD.open("value", FILE_READ);` |
| `esp8266_sd_close_file` | Statement | VAR(field_variable) | `esp8266_sd_close_file($file)` | `file.close();` |
| `esp8266_sd_file_is_open` | Value | VAR(field_variable) | `esp8266_sd_file_is_open($file)` | `((bool)file)` |
| `esp8266_sd_write_file` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_sd_write_file($file, CONTENT)` | `file.print(String("value"));` |
| `esp8266_sd_read_file` | Value | VAR(field_variable) | `esp8266_sd_read_file($file)` | `esp8266SdReadRemaining(file)` |
| `esp8266_sd_read_file_bytes` | Value | VAR(field_variable), LENGTH(input_value) | `esp8266_sd_read_file_bytes($file, LENGTH)` | `esp8266SdReadBytes(file, 1)` |
| `esp8266_sd_read_byte` | Value | VAR(field_variable) | `esp8266_sd_read_byte($file)` | `file.read()` |
| `esp8266_sd_peek_byte` | Value | VAR(field_variable) | `esp8266_sd_peek_byte($file)` | `file.peek()` |
| `esp8266_sd_file_available` | Value | VAR(field_variable) | `esp8266_sd_file_available($file)` | `(file.available() > 0)` |
| `esp8266_sd_file_available_bytes` | Value | VAR(field_variable) | `esp8266_sd_file_available_bytes($file)` | `file.available()` |
| `esp8266_sd_file_size` | Value | VAR(field_variable) | `esp8266_sd_file_size($file)` | `file.size()` |
| `esp8266_sd_file_position` | Value | VAR(field_variable) | `esp8266_sd_file_position($file)` | `file.position()` |
| `esp8266_sd_seek_file` | Value | VAR(field_variable), POSITION(input_value), MODE(dropdown) | `esp8266_sd_seek_file($file, math_number(0), SeekSet)` | `file.seek(1, SeekSet)` |
| `esp8266_sd_flush_file` | Statement | VAR(field_variable) | `esp8266_sd_flush_file($file)` | `file.flush();` |
| `esp8266_sd_write_file_quick` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_sd_write_file_quick(PATH, CONTENT)` | `esp8266SdWriteFile("value", String("value"));` |
| `esp8266_sd_read_file_quick` | Value | PATH(input_value) | `esp8266_sd_read_file_quick(PATH)` | `esp8266SdReadFile("value")` |
| `esp8266_sd_append_file` | Statement | PATH(input_value), CONTENT(input_value) | `esp8266_sd_append_file(PATH, CONTENT)` | `esp8266SdAppendFile("value", String("value"));` |
| `esp8266_sd_delete_file` | Statement | PATH(input_value) | `esp8266_sd_delete_file(PATH)` | `if (!SD.remove("value")) { ↵ Serial.println("Delete failed"); ↵ }` |
| `esp8266_sd_rename_file` | Statement | OLD_PATH(input_value), NEW_PATH(input_value) | `esp8266_sd_rename_file(OLD_PATH, NEW_PATH)` | `if (!SD.rename("value", "value")) { ↵ Serial.println("Rename failed"); ↵ }` |
| `esp8266_sd_create_dir` | Statement | PATH(input_value) | `esp8266_sd_create_dir(PATH)` | `if (!SD.mkdir("value")) { ↵ Serial.println("mkdir failed"); ↵ }` |
| `esp8266_sd_remove_dir` | Statement | PATH(input_value) | `esp8266_sd_remove_dir(PATH)` | `if (!SD.rmdir("value")) { ↵ Serial.println("rmdir failed"); ↵ }` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_sd_begin.CS_PIN | board-provided options | Selects the generated API option. |
| esp8266_sd_open_file.MODE | FILE_READ, FILE_WRITE, FILE_APPEND | Selects the generated API option. |
| esp8266_sd_open_file_to.MODE | FILE_READ, FILE_WRITE, FILE_APPEND | Selects the generated API option. |
| esp8266_sd_seek_file.MODE | SeekSet, SeekCur, SeekEnd | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_sd_begin(CS_PIN)
```
