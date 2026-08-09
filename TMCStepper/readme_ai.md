# TMCStepper

Configure TMC2209 UART and TMC2130 SPI stepper drivers with diagnostics.

## Library Info
- **Name**: @aily-project/lib-tmcstepper
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tmc2209_init` | Statement | VAR(field_input), SERIAL(dropdown), BAUD(dropdown), ADDRESS(input_value), RSENSE(input_value) | `tmc2209_init("tmcDriver", SERIAL, BAUD, math_number(0), math_number(0))` | Dynamic code |
| `tmc2130_init` | Statement | VAR(field_input), CS(dropdown), RSENSE(input_value) | `tmc2130_init("tmcDriver", CS, math_number(0))` | Dynamic code |
| `tmc_set_current` | Statement | VAR(field_variable), CURRENT(input_value), HOLD(input_value) | `tmc_set_current(variables_get($tmcDriver), math_number(0), math_number(0))` | Dynamic code |
| `tmc_set_motion` | Statement | VAR(field_variable), MICROSTEPS(input_value), TOFF(input_value) | `tmc_set_motion(variables_get($tmcDriver), math_number(0), math_number(0))` | Dynamic code |
| `tmc2209_mode` | Statement | VAR(field_variable), MODE(dropdown), AUTOSCALE(field_checkbox) | `tmc2209_mode(variables_get($tmcDriver), stealth, TRUE)` | Dynamic code |
| `tmc2209_stall` | Statement | VAR(field_variable), SGTHRS(input_value), TCOOLTHRS(input_value) | `tmc2209_stall(variables_get($tmcDriver), math_number(0), math_number(0))` | Dynamic code |
| `tmc_read` | Value | VAR(field_variable), DATA(dropdown) | `tmc_read(variables_get($tmcDriver), DRV_STATUS)` | Dynamic code |
| `tmc_connection` | Value | VAR(field_variable) | `tmc_connection(variables_get($tmcDriver))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | stealth, spread | tmc2209_mode |
| DATA | DRV_STATUS, TSTEP, microsteps, current | tmc_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tmc2209_init("tmcDriver", SERIAL, BAUD, math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tmc_read(variables_get($tmcDriver), DRV_STATUS))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tmc2209_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
