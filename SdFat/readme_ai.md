# SdFat storage

Fast FAT16, FAT32, and exFAT SD card access.

## Library Info
- **Name**: @aily-project/lib-sdfat
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sdfat_init` | Statement | VAR(field_input), CS(dropdown), MHZ(input_value) | `sdfat_init("sd", CS, math_number(0))` | Dynamic code |
| `sdfat_file_open` | Statement | FILE(field_input), SD(field_variable), PATH(input_value), MODE(dropdown) | `sdfat_file_open("sdFile", variables_get($sd), text("value"), O_RDONLY)` | Dynamic code |
| `sdfat_file_write` | Statement | FILE(field_variable), OP(dropdown), DATA(input_value) | `sdfat_file_write(variables_get($sdFile), print, math_number(0))` | Dynamic code |
| `sdfat_file_control` | Statement | FILE(field_variable), OP(dropdown), VALUE(input_value) | `sdfat_file_control(variables_get($sdFile), seek, math_number(0))` | Dynamic code |
| `sdfat_file_read` | Value | FILE(field_variable), DATA(dropdown) | `sdfat_file_read(variables_get($sdFile), read)` | Dynamic code |
| `sdfat_fs_operation` | Statement | SD(field_variable), OP(dropdown), PATH(input_value) | `sdfat_fs_operation(variables_get($sd), mkdir, text("value"))` | Dynamic code |
| `sdfat_exists` | Value | SD(field_variable), PATH(input_value) | `sdfat_exists(variables_get($sd), text("value"))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | O_RDONLY, O_WRONLY &#124; O_CREAT &#124; O_APPEND, O_WRONLY &#124; O_CREAT &#124; O_TRUNC, O_RDWR &#124; O_CREAT | sdfat_file_open |
| OP | print, println | sdfat_file_write |
| OP | seek, truncate, flush, close | sdfat_file_control |
| DATA | read, line, string, available, size, position, open | sdfat_file_read |
| OP | mkdir, rmdir, remove | sdfat_fs_operation |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sdfat_init("sd", CS, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sdfat_file_read(variables_get($sdFile), read))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sdfat_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
