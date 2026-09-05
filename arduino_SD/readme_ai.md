# Arduino SD Card

Blockly support for Arduino SD 1.3.0, including SPI initialization and FAT file and directory operations.

## Library Info
- **Name**: @aily-project/lib-arduino-sd
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `arduino_sd_init` | Statement | (none) | `arduino_sd_init()` | `SD.begin();` |
| `arduino_sd_init_cs` | Statement | CS(input_value) | `arduino_sd_init_cs(math_number(0))` | `SD.begin(1);` |
| `arduino_sd_init_clock` | Statement | CS(input_value), CLOCK(input_value) | `arduino_sd_init_clock(math_number(0), math_number(0))` | `SD.begin((uint32_t)(1), 1);` |
| `arduino_sd_begin_result` | Value | CS(input_value) | `arduino_sd_begin_result(math_number(0))` | `SD.begin(1)` |
| `arduino_sd_end` | Statement | (none) | `arduino_sd_end()` | `SD.end();` |
| `arduino_sd_exists` | Value | PATH(input_value) | `arduino_sd_exists(text("value"))` | `SD.exists("value")` |
| `arduino_sd_path_operation` | Statement | OP(dropdown), PATH(input_value) | `arduino_sd_path_operation(mkdir, text("value"))` | `SD.mkdir("value");` |
| `arduino_sd_file_create` | Statement | PATH(input_value), MODE(dropdown), VAR(field_input) | `arduino_sd_file_create(text("value"), FILE_READ, "sdFile")` | `sdFile = SD.open("value", FILE_READ);` |
| `arduino_sd_file_create_next` | Statement | DIR(field_variable), MODE(dropdown), VAR(field_input) | `arduino_sd_file_create_next($root, FILE_READ, "entry")` | `entry = root.openNextFile(FILE_READ);` |
| `arduino_sd_file_is_open` | Value | VAR(field_variable) | `arduino_sd_file_is_open($sdFile)` | `(bool)sdFile` |
| `arduino_sd_file_is_directory` | Value | VAR(field_variable) | `arduino_sd_file_is_directory($sdFile)` | `sdFile.isDirectory()` |
| `arduino_sd_file_name` | Value | VAR(field_variable) | `arduino_sd_file_name($sdFile)` | `String(sdFile.name())` |
| `arduino_sd_file_read` | Value | VAR(field_variable), OP(dropdown) | `arduino_sd_file_read($sdFile, read)` | `sdFile.read()` |
| `arduino_sd_file_available` | Value | VAR(field_variable), OP(dropdown) | `arduino_sd_file_available($sdFile, available)` | `sdFile.available()` |
| `arduino_sd_file_position` | Value | VAR(field_variable), OP(dropdown) | `arduino_sd_file_position($sdFile, position)` | `sdFile.position()` |
| `arduino_sd_file_seek` | Value | VAR(field_variable), POSITION(input_value) | `arduino_sd_file_seek($sdFile, math_number(0))` | `sdFile.seek(1)` |
| `arduino_sd_file_write` | Statement | VAR(field_variable), OP(dropdown), DATA(input_value), BASE(dropdown) | `arduino_sd_file_write($sdFile, write, math_number(0), AUTO)` | `sdFile.write(1);` |
| `arduino_sd_file_control` | Statement | VAR(field_variable), OP(dropdown) | `arduino_sd_file_control($sdFile, flush)` | `sdFile.flush();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OP | mkdir, remove, rmdir | arduino_sd_path_operation |
| MODE | FILE_READ, FILE_WRITE | arduino_sd_file_create, arduino_sd_file_create_next |
| OP | read, peek | arduino_sd_file_read |
| OP | available, availableForWrite | arduino_sd_file_available |
| OP | position, size | arduino_sd_file_position |
| OP | write, print, println | arduino_sd_file_write |
| BASE | AUTO, BIN, OCT, DEC, HEX | arduino_sd_file_write |
| OP | flush, rewindDirectory, close | arduino_sd_file_control |

## ABS Examples

### Basic Usage
```
arduino_setup()
    arduino_sd_init_cs(math_number(10))
    arduino_sd_file_create(text("/data.txt"), FILE_WRITE, "sdFile")
    arduino_sd_file_write($sdFile, println, text("hello"), AUTO)
    arduino_sd_file_control($sdFile, close)
```

## Notes

1. **Variable**: `arduino_sd_file_create` and `arduino_sd_file_create_next` create Blockly variables. Use `$varName` for `field_variable` slots.
2. **Write mode**: `FILE_WRITE` appends. Remove the existing file before opening it to overwrite.
3. **Parameter order**: ABS parameters follow `block.json` argument order.
