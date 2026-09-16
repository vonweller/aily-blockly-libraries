# SEN0754 Ultrasonic Liquid Level Sensor

Drive a DFRobot SEN0754 ultrasonic liquid-level sensor over UART Modbus RTU at a fixed 115200 baud. Read realtime or processed empty height, convert it to liquid level, and report temperature.

## Library Info

- **Name**: @aily-project/lib-sen0754
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `sen0754_init` | Statement | VAR(field_variable), SERIAL(dropdown), RX(field_number), TX(field_number) | `sen0754_init($liquidLevelSensor, Serial1, 16, 17)` | `HardwareSerial liquidLevelSensorSerial(1); ↵ SEN0754 liquidLevelSensor(liquidLevelSensorSerial); ↵ liquidLevelSensorSerial.begin(115200, SERIAL_8N1, 16, 17);` |
| `sen0754_set_install_height` | Statement | VAR(field_variable), HEIGHT(input_value) | `sen0754_set_install_height($liquidLevelSensor, math_number(2000))` | `liquidLevelSensor.setInstallHeight(1);` |
| `sen0754_read_realtime` | Statement | VAR(field_variable) | `sen0754_read_realtime($liquidLevelSensor)` | `liquidLevelSensor.readRealtime();` |
| `sen0754_read_processed` | Statement | VAR(field_variable) | `sen0754_read_processed($liquidLevelSensor)` | `liquidLevelSensor.readProcessed();` |
| `sen0754_get_water_level` | Value (Number) | VAR(field_variable) | `sen0754_get_water_level($liquidLevelSensor)` | `liquidLevelSensor.getWaterLevel()` |
| `sen0754_get_distance` | Value (Number) | VAR(field_variable) | `sen0754_get_distance($liquidLevelSensor)` | `liquidLevelSensor.getDistance()` |
| `sen0754_get_temperature` | Value (Number) | VAR(field_variable) | `sen0754_get_temperature($liquidLevelSensor)` | `liquidLevelSensor.getTemperature()` |
| `sen0754_is_valid` | Value (Boolean) | VAR(field_variable) | `sen0754_is_valid($liquidLevelSensor)` | `liquidLevelSensor.isValid()` |

## Parameter Options

### sen0754_init.SERIAL

| Display | Actual Value |
| ------- | ------------ |
| Serial1 (UART1) | `Serial1` |
| Serial2 (UART2) | `Serial2` |

## ABS Examples

Read the realtime value and store liquid level in a variable:

```abs
arduino_global()
    variable_define("level", int, math_number(0))

arduino_setup()
    sen0754_init($liquidLevelSensor, Serial1, 16, 17)
    sen0754_set_install_height($liquidLevelSensor, math_number(2000))

arduino_loop()
    sen0754_read_realtime($liquidLevelSensor)
    controls_if(sen0754_is_valid($liquidLevelSensor))
        variables_set($level, sen0754_get_water_level($liquidLevelSensor))
```

Use the processed value when the liquid surface is moving (response is at least 2 seconds; do not poll faster than that):

```abs
arduino_loop()
    sen0754_read_processed($liquidLevelSensor)
    variables_set($level, sen0754_get_distance($liquidLevelSensor))
```

## Notes

1. **Variable**: `sen0754_init($liquidLevelSensor, ...)` creates `$liquidLevelSensor` (C++ type `SEN0754`). Pass `$liquidLevelSensor` to every field_variable slot in this library.
2. Init also creates a global `HardwareSerial <object>Serial(1 or 2);` and starts it in setup with `begin(115200, SERIAL_8N1, RX, TX)`. Baud is fixed at 115200.
3. One UART can attach one sensor. At most two sensors are supported (Serial1 and Serial2).
4. Wiring: board RX pin to the sensor green TX wire; board TX pin to the sensor blue RX wire. Defaults 16/17 come from the official ESP32 sample; change them to free pins on the target board.
5. Read blocks may block up to about 1 second (retry every 100ms until timeout). Realtime response is about 100ms; processed response is at least 2 seconds.
6. Liquid level = install height − empty height. Default install height is 2000 mm; change it with `sen0754_set_install_height`. Empty height `-3` mm means no liquid was detected.
7. Temperature is the sensor compensation output at 0.1°C resolution.
8. Generated code uses ESP32 `HardwareSerial` custom pins. It targets ESP32-series boards (for example UniHiker K10 / ESP32-S3) and does not support AVR software serial.
9. Range, signal level, denoise level, and algorithm mode must be set with Modbus write commands from the DFRobot protocol PDF. This library only covers the public realtime and processed read commands.
