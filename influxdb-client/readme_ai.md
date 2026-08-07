# InfluxDB Client

InfluxDB 2 measurements, tags, fields, writes, validation, and line protocol.

## Library Info
- **Name**: @aily-project/lib-influxdb-client
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `influxdb_init` | Statement | VAR(field_input), URL(input_value), ORG(input_value), BUCKET(input_value), TOKEN(input_value) | `influxdb_init("influx", text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `influxdb_point_init` | Statement | VAR(field_input), MEASUREMENT(input_value) | `influxdb_point_init("sensorPoint", text("value"))` | Dynamic code |
| `influxdb_point_add` | Statement | VAR(field_variable), KIND(dropdown), KEY(input_value), VALUE(input_value) | `influxdb_point_add(variables_get($sensorPoint), addTag, text("value"), math_number(0))` | Dynamic code |
| `influxdb_point_clear` | Statement | VAR(field_variable), KIND(dropdown) | `influxdb_point_clear(variables_get($sensorPoint), clearFields)` | Dynamic code |
| `influxdb_write` | Value | CLIENT(field_variable), POINT(field_variable) | `influxdb_write(variables_get($influx), variables_get($sensorPoint))` | Dynamic code |
| `influxdb_validate` | Value | VAR(field_variable) | `influxdb_validate(variables_get($influx))` | Dynamic code |
| `influxdb_info` | Value | VAR(field_variable), INFO(dropdown) | `influxdb_info(variables_get($influx), getLastErrorMessage)` | Dynamic code |
| `influxdb_line_protocol` | Value | CLIENT(field_variable), POINT(field_variable) | `influxdb_line_protocol(variables_get($influx), variables_get($sensorPoint))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KIND | addTag, addField | influxdb_point_add |
| KIND | clearFields, clearTags | influxdb_point_clear |
| INFO | getLastErrorMessage, getServerUrl | influxdb_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    influxdb_init("influx", text("value"), text("value"), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, influxdb_write(variables_get($influx), variables_get($sensorPoint)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `influxdb_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
