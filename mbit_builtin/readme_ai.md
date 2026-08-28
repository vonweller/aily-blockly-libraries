# micro:bit Built-ins

Built-in input, sensor and radio blocks for BBC micro:bit v1/v2.

## Library Info
- **Name**: @aily-project/lib-microbit-builtins
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `microbit_builtin_setup` | Statement | (none) | `microbit_builtin_setup()` | `_ailyMicrobitBuiltinsBegin();` |
| `microbit_button_is_pressed` | Value | BUTTON(dropdown) | `microbit_button_is_pressed(0)` | `_ailyMicrobitButtonPressed(0)` |
| `microbit_temperature` | Value | (none) | `microbit_temperature()` | `_ailyMicrobitTemperature()` |
| `microbit_acceleration` | Value | AXIS(dropdown) | `microbit_acceleration(0)` | `_ailyMicrobitAcceleration(0)` |
| `microbit_gesture_is` | Value | GESTURE(dropdown) | `microbit_gesture_is(1)` | `_ailyMicrobitGesture(1)` |
| `microbit_magnetic_field` | Value | AXIS(dropdown) | `microbit_magnetic_field(0)` | `_ailyMicrobitMagneticField(0)` |
| `microbit_compass_heading` | Value | (none) | `microbit_compass_heading()` | `_ailyMicrobitCompassHeading()` |
| `microbit_radio_set_group` | Statement | GROUP(input_value) | `microbit_radio_set_group(math_number(1))` | `_ailyMicrobitRadioBegin((uint8_t)constrain(1, 0, 255));` |
| `microbit_radio_set_power` | Statement | POWER(dropdown) | `microbit_radio_set_power(6)` | `_ailyMicrobitRadioSetPower(6);` |
| `microbit_radio_send_string` | Statement | TEXT(input_value) | `microbit_radio_send_string(text("hello"))` | `_ailyMicrobitRadioSend(String("hello"));` |
| `microbit_radio_received` | Value | (none) | `microbit_radio_received()` | `_ailyMicrobitRadioPoll()` |
| `microbit_radio_receive_string` | Value | (none) | `microbit_radio_receive_string()` | `_ailyMicrobitRadioReceive()` |
| `microbit_radio_rssi` | Value | (none) | `microbit_radio_rssi()` | `_ailyMicrobitRadioLastRSSI` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | `0`, `1`, `2` | A, B or A+B |
| AXIS | `0`, `1`, `2`, `3` | X, Y, Z or vector strength |
| GESTURE | `1`, `2`, `3`, `4`, `5`, `6`, `7`, `11` | Logo up/down, tilt left/right, screen up/down, free fall or shake |
| POWER | `0` ... `7` | Common micro:bit transmit-power level |
| GROUP | `0` ... `255` | Hardware-filtered radio group |

## ABS Examples

### Read Built-in Inputs
```
arduino_setup()
    microbit_builtin_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, microbit_temperature())
    serial_println(Serial, microbit_acceleration(3))
    time_delay(math_number(100))
```

### Send Radio Text
```
arduino_setup()
    microbit_radio_set_group(math_number(1))

arduino_loop()
    microbit_radio_send_string(text("hello"))
    time_delay(math_number(1000))
```

### Receive Radio Text
```
arduino_setup()
    microbit_radio_set_group(math_number(1))
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if(microbit_radio_received())
        serial_println(Serial, microbit_radio_receive_string())
```

## Notes

1. Sensor and button value blocks initialize the built-in hardware automatically.
2. Acceleration values use milli-g; magnetic-field values use microtesla.
3. Radio text is UTF-8 byte data truncated to the official datagram maximum of 29 bytes.
4. The radio group must match on sender and receiver; default group is 0.
5. RSSI is updated after a valid packet is polled.
6. ABS parameters follow `block.json` argument order.
