# TF-UW500 LiDAR

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0755
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0755_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), RX(dropdown), TX(dropdown) | `sen0755_init_uart("lidar", Serial1, RX, TX)` | `lidar.begin();` |
| `sen0755_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `sen0755_init_i2c("lidar", WIRE, "0x10")` | `lidar.begin();` |
| `sen0755_read` | Value | VAR(field_variable) | `sen0755_read($lidar)` | `lidar.readFrame()` |
| `sen0755_get_data` | Value | VAR(field_variable), DATA(dropdown) | `sen0755_get_data($lidar, DIST)` | `lidar.getDistanceMm()` |
| `sen0755_valid` | Value | VAR(field_variable) | `sen0755_valid($lidar)` | `lidar.isValid()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2, Serial | sen0755_init_uart |
| ADDRESS | 0x10 | sen0755_init_i2c |
| DATA | DIST, PEAK, TEMP, CONF | sen0755_get_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0755_init_uart("lidar", Serial1, RX, TX)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0755_read($lidar))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0755_init_uart` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.
