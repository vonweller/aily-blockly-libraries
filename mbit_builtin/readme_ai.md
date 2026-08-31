# micro:bit Built-ins

Built-in input, sensor and radio blocks for BBC micro:bit v1/v2.

## Library Info
- **Name**: @aily-project/lib-microbit-builtins
- **Version**: 1.0.1
- **Supported boards**: `n-able-Arduino:arm-ble:BBCmicrobit`, `n-able-Arduino:arm-ble:BBCmicrobitV2`

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `microbit_builtin_setup` | Statement | (none) | `microbit_builtin_setup()` | `#if defined(ARDUINO_BBC_MICROBIT_V2) ↵ #define AILY_MICROBIT_INTERNAL_WIRE Wire1 ↵ #elif defined(ARDUINO_BBC_MICROBIT) ↵ #define AILY_MICROBIT_INTERNAL_WIRE Wire ↵ #else ↵ #error "@aily-project/lib-microbit-builtins only supports BBC micro:bit v1/v2" ↵ #endif ↵ static bool _ailyMicrobitBuiltinsReady = false; ↵ static uint8_t _ailyMicrobitMotionType = 0; ↵ static uint8_t _ailyMicrobitCompassType = 0; ↵ static int16_t _ailyMicrobitAccelX = 0; ↵ static int16_t _ailyMicrobitAccelY = 0; ↵ static int16_t _ailyMicrobitAccelZ = 0; ↵ static float _ailyMicrobitMagX = 0; ↵ static float _ailyMicrobitMagY = 0; ↵ static float _ailyMicrobitMagZ = 0; ↵ static int8_t _ailyMicrobitShakeSignX = 0; ↵ static int8_t _ailyMicrobitShakeSignY = 0; ↵ static int8_t _ailyMicrobitShakeSignZ = 0; ↵ static uint8_t _ailyMicrobitShakeCount = 0; ↵ static unsigned long _ailyMicrobitShakeTime = 0; ↵ bool _ailyMicrobitI2CWrite(uint8_t address, uint8_t reg, uint8_t value) { ↵ AILY_MICROBIT_INTERNAL_WIRE.beginTransmission(address); ↵ AILY_MICROBIT_INTERNAL_WIRE.write(reg); ↵ AILY_MICROBIT_INTERNAL_WIRE.write(value); ↵ return AILY_MICROBIT_INTERNAL_WIRE.endTransmission() == 0; ↵ } ↵ bool _ailyMicrobitI2CRead(uint8_t address, uint8_t reg, uint8_t *data, uint8_t length) { ↵ AILY_MICROBIT_INTERNAL_WIRE.beginTransmission(address); ↵ AILY_MICROBIT_INTERNAL_WIRE.write(reg); ↵ if (AILY_MICROBIT_INTERNAL_WIRE.endTransmission(false) != 0) return false; ↵ if (AILY_MICROBIT_INTERNAL_WIRE.requestFrom(address, length) != length) return false; ↵ for (uint8_t i = 0; i < length; i++) data[i] = AILY_MICROBIT_INTERNAL_WIRE.read(); ↵ return true; ↵ } ↵ void _ailyMicrobitBuiltinsBegin() { ↵ if (_ailyMicrobitBuiltinsReady) return; ↵ pinMode(PIN_BUTTON_A, INPUT_PULLUP); ↵ pinMode(PIN_BUTTON_B, INPUT_PULLUP); ↵ AILY_MICROBIT_INTERNAL_WIRE.begin(); ↵ delay(7); ↵ uint8_t id = 0; ↵ if (_ailyMicrobitI2CRead(0x19, 0x0F, &id, 1) && id == 0x33) { ↵ _ailyMicrobitMotionType = 2; ↵ _ailyMicrobitI2CWrite(0x19, 0x20, 0x57); ↵ _ailyMicrobitI2CWrite(0x19, 0x23, 0x80); ↵ } else if (_ailyMicrobitI2CRead(0x1D, 0x0D, &id, 1) && id == 0x5A) { ↵ _ailyMicrobitMotionType = 1; ↵ _ailyMicrobitI2CWrite(0x1D, 0x2A, 0x00); ↵ _ailyMicrobitI2CWrite(0x1D, 0x2B, 0x10); ↵ _ailyMicrobitI2CWrite(0x1D, 0x0E, 0x00); ↵ _ailyMicrobitI2CWrite(0x1D, 0x2A, 0x19); ↵ } ↵ if (_ailyMicrobitI2CRead(0x1E, 0x4F, &id, 1) && id == 0x40) { ↵ _ailyMicrobitCompassType = 2; ↵ _ailyMicrobitI2CWrite(0x1E, 0x60, 0x00); ↵ _ailyMicrobitI2CWrite(0x1E, 0x62, 0x01); ↵ } else if (_ailyMicrobitI2CRead(0x0E, 0x07, &id, 1) && id == 0xC4) { ↵ _ailyMicrobitCompassType = 1; ↵ _ailyMicrobitI2CWrite(0x0E, 0x10, 0x00); ↵ _ailyMicrobitI2CWrite(0x0E, 0x11, 0xA0); ↵ _ailyMicrobitI2CWrite(0x0E, 0x10, 0x61); ↵ } ↵ _ailyMicrobitBuiltinsReady = true; ↵ } ↵ bool _ailyMicrobitButtonPressed(uint8_t button) { ↵ _ailyMicrobitBuiltinsBegin(); ↵ bool a = digitalRead(PIN_BUTTON_A) == LOW; ↵ bool b = digitalRead(PIN_BUTTON_B) == LOW; ↵ if (button == 0) return a; ↵ if (button == 1) return b; ↵ return a && b; ↵ } ↵ float _ailyMicrobitTemperature() { ↵ NRF_TEMP->EVENTS_DATARDY = 0; ↵ NRF_TEMP->TASKS_START = 1; ↵ while (NRF_TEMP->EVENTS_DATARDY == 0) {} ↵ float value = ((int32_t)NRF_TEMP->TEMP) / 4.0f; ↵ NRF_TEMP->TASKS_STOP = 1; ↵ return value; ↵ } ↵ bool _ailyMicrobitReadAcceleration() { ↵ _ailyMicrobitBuiltinsBegin(); ↵ uint8_t data[6]; ↵ if (_ailyMicrobitMotionType == 2) { ↵ if (!_ailyMicrobitI2CRead(0x19, 0x28 &#124; 0x80, data, 6)) return false; ↵ int16_t rawX = (int16_t)((uint16_t)data[1] << 8 &#124; data[0]); ↵ int16_t rawY = (int16_t)((uint16_t)data[3] << 8 &#124; data[2]); ↵ int16_t rawZ = (int16_t)((uint16_t)data[5] << 8 &#124; data[4]); ↵ _ailyMicrobitAccelX = rawX / 16; ↵ _ailyMicrobitAccelY = -(rawY / 16); ↵ _ailyMicrobitAccelZ = rawZ / 16; ↵ return true; ↵ } ↵ if (_ailyMicrobitMotionType == 1) { ↵ if (!_ailyMicrobitI2CRead(0x1D, 0x01, data, 6)) return false; ↵ int16_t rawX = (int16_t)((uint16_t)data[0] << 8 &#124; data[1]); ↵ int16_t rawY = (int16_t)((uint16_t)data[2] << 8 &#124; data[3]); ↵ int16_t rawZ = (int16_t)((uint16_t)data[4] << 8 &#124; data[5]); ↵ rawX >>= 6; ↵ rawY >>= 6; ↵ rawZ >>= 6; ↵ _ailyMicrobitAccelX = (int16_t)(-(int32_t)rawX * 2000 / 512); ↵ _ailyMicrobitAccelY = (int16_t)(-(int32_t)rawY * 2000 / 512); ↵ _ailyMicrobitAccelZ = (int16_t)((int32_t)rawZ * 2000 / 512); ↵ return true; ↵ } ↵ return false; ↵ } ↵ int _ailyMicrobitAcceleration(uint8_t axis) { ↵ if (!_ailyMicrobitReadAcceleration()) return 0; ↵ if (axis == 0) return _ailyMicrobitAccelX; ↵ if (axis == 1) return _ailyMicrobitAccelY; ↵ if (axis == 2) return _ailyMicrobitAccelZ; ↵ float x = _ailyMicrobitAccelX; ↵ float y = _ailyMicrobitAccelY; ↵ float z = _ailyMicrobitAccelZ; ↵ return (int)sqrtf(x * x + y * y + z * z); ↵ } ↵ bool _ailyMicrobitShakeDetected() { ↵ unsigned long now = millis(); ↵ if (now - _ailyMicrobitShakeTime > 500) _ailyMicrobitShakeCount = 0; ↵ int16_t values[3] = {_ailyMicrobitAccelX, _ailyMicrobitAccelY, _ailyMicrobitAccelZ}; ↵ int8_t *signs[3] = {&_ailyMicrobitShakeSignX, &_ailyMicrobitShakeSignY, &_ailyMicrobitShakeSignZ}; ↵ bool crossing = false; ↵ for (uint8_t i = 0; i < 3; i++) { ↵ int8_t sign = values[i] > 400 ? 1 : (values[i] < -400 ? -1 : 0); ↵ if (sign != 0 && *signs[i] != 0 && sign != *signs[i]) crossing = true; ↵ if (sign != 0) *signs[i] = sign; ↵ } ↵ if (crossing) { ↵ _ailyMicrobitShakeTime = now; ↵ if (++_ailyMicrobitShakeCount >= 4) { ↵ _ailyMicrobitShakeCount = 0; ↵ return true; ↵ } ↵ } ↵ return false; ↵ } ↵ bool _ailyMicrobitGesture(uint8_t gesture) { ↵ if (!_ailyMicrobitReadAcceleration()) return false; ↵ if (gesture == 11) return _ailyMicrobitShakeDetected(); ↵ int32_t x = _ailyMicrobitAccelX; ↵ int32_t y = _ailyMicrobitAccelY; ↵ int32_t z = _ailyMicrobitAccelZ; ↵ if (gesture == 1) return y > 800; ↵ if (gesture == 2) return y < -800; ↵ if (gesture == 3) return x < -800; ↵ if (gesture == 4) return x > 800; ↵ if (gesture == 5) return z < -800; ↵ if (gesture == 6) return z > 800; ↵ return x * x + y * y + z * z < 160000L; ↵ } ↵ bool _ailyMicrobitReadMagneticField() { ↵ _ailyMicrobitBuiltinsBegin(); ↵ uint8_t data[6]; ↵ if (_ailyMicrobitCompassType == 2) { ↵ if (!_ailyMicrobitI2CRead(0x1E, 0x68 &#124; 0x80, data, 6)) return false; ↵ int16_t rawX = (int16_t)((uint16_t)data[1] << 8 &#124; data[0]); ↵ int16_t rawY = (int16_t)((uint16_t)data[3] << 8 &#124; data[2]); ↵ int16_t rawZ = (int16_t)((uint16_t)data[5] << 8 &#124; data[4]); ↵ _ailyMicrobitMagX = rawX * 0.15f; ↵ _ailyMicrobitMagY = -rawY * 0.15f; ↵ _ailyMicrobitMagZ = rawZ * 0.15f; ↵ return true; ↵ } ↵ if (_ailyMicrobitCompassType == 1) { ↵ if (!_ailyMicrobitI2CRead(0x0E, 0x01, data, 6)) return false; ↵ int16_t rawX = (int16_t)((uint16_t)data[0] << 8 &#124; data[1]); ↵ int16_t rawY = (int16_t)((uint16_t)data[2] << 8 &#124; data[3]); ↵ int16_t rawZ = (int16_t)((uint16_t)data[4] << 8 &#124; data[5]); ↵ _ailyMicrobitMagX = -rawX * 0.1f; ↵ _ailyMicrobitMagY = -rawY * 0.1f; ↵ _ailyMicrobitMagZ = -rawZ * 0.1f; ↵ return true; ↵ } ↵ return false; ↵ } ↵ float _ailyMicrobitMagneticField(uint8_t axis) { ↵ if (!_ailyMicrobitReadMagneticField()) return 0; ↵ if (axis == 0) return _ailyMicrobitMagX; ↵ if (axis == 1) return _ailyMicrobitMagY; ↵ if (axis == 2) return _ailyMicrobitMagZ; ↵ return sqrtf(_ailyMicrobitMagX * _ailyMicrobitMagX + _ailyMicrobitMagY * _ailyMicrobitMagY + _ailyMicrobitMagZ * _ailyMicrobitMagZ); ↵ } ↵ int _ailyMicrobitCompassHeading() { ↵ if (!_ailyMicrobitReadMagneticField()) return 0; ↵ float heading = atan2f(_ailyMicrobitMagX, _ailyMicrobitMagY) * 180.0f / PI; ↵ if (heading < 0) heading += 360.0f; ↵ return (int)heading; ↵ } ↵ _ailyMicrobitBuiltinsBegin();` |
| `microbit_button_is_pressed` | Value | BUTTON(dropdown) | `microbit_button_is_pressed(0)` | `_ailyMicrobitButtonPressed(0)` |
| `microbit_temperature` | Value | (none) | `microbit_temperature()` | `_ailyMicrobitTemperature()` |
| `microbit_acceleration` | Value | AXIS(dropdown) | `microbit_acceleration(0)` | `_ailyMicrobitAcceleration(0)` |
| `microbit_gesture_is` | Value | GESTURE(dropdown) | `microbit_gesture_is(1)` | `_ailyMicrobitGesture(1)` |
| `microbit_magnetic_field` | Value | AXIS(dropdown) | `microbit_magnetic_field(0)` | `_ailyMicrobitMagneticField(0)` |
| `microbit_compass_heading` | Value | (none) | `microbit_compass_heading()` | `_ailyMicrobitCompassHeading()` |
| `microbit_radio_set_group` | Statement | GROUP(input_value) | `microbit_radio_set_group(math_number(1))` | `_ailyMicrobitRadioBegin((uint8_t)constrain(1, 0, 255));` |
| `microbit_radio_set_power` | Statement | POWER(dropdown) | `microbit_radio_set_power(0)` | `_ailyMicrobitRadioBegin(_ailyMicrobitRadioGroup); ↵ _ailyMicrobitRadioSetPower(0);` |
| `microbit_radio_send_string` | Statement | TEXT(input_value) | `microbit_radio_send_string(text("hello"))` | `_ailyMicrobitRadioSend(String("value"));` |
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
2. Acceleration values use milli-g and official micro:bit simple Cartesian axes; magnetic-field values use the same axes and microtesla.
3. Radio text is UTF-8 byte data truncated to the official datagram maximum of 29 bytes.
4. The radio group must match on sender and receiver; default group is 0.
5. RSSI is updated after a valid packet is polled.
6. Raw micro:bit radio and BLE/NimBLE cannot be used at the same time.
7. ABS parameters follow `block.json` argument order.
