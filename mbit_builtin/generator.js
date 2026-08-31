'use strict';

if (typeof Arduino === 'undefined') {
  var Arduino = {};
}

function ensureMicrobitSensorRuntime(generator) {
  generator.addLibrary('microbit_builtin_arduino', '#include <Arduino.h>');
  generator.addLibrary('microbit_builtin_wire', '#include <Wire.h>');
  generator.addLibrary('microbit_builtin_math', '#include <math.h>');

  generator.addObject('microbit_builtin_bus', `#if defined(ARDUINO_BBC_MICROBIT_V2)
#define AILY_MICROBIT_INTERNAL_WIRE Wire1
#elif defined(ARDUINO_BBC_MICROBIT)
#define AILY_MICROBIT_INTERNAL_WIRE Wire
#else
#error "@aily-project/lib-microbit-builtins only supports BBC micro:bit v1/v2"
#endif`);

  generator.addObject('microbit_builtin_sensor_state', `static bool _ailyMicrobitBuiltinsReady = false;
static uint8_t _ailyMicrobitMotionType = 0;
static uint8_t _ailyMicrobitCompassType = 0;
static int16_t _ailyMicrobitAccelX = 0;
static int16_t _ailyMicrobitAccelY = 0;
static int16_t _ailyMicrobitAccelZ = 0;
static float _ailyMicrobitMagX = 0;
static float _ailyMicrobitMagY = 0;
static float _ailyMicrobitMagZ = 0;
static int8_t _ailyMicrobitShakeSignX = 0;
static int8_t _ailyMicrobitShakeSignY = 0;
static int8_t _ailyMicrobitShakeSignZ = 0;
static uint8_t _ailyMicrobitShakeCount = 0;
static unsigned long _ailyMicrobitShakeTime = 0;`);

  generator.addFunction('microbit_builtin_i2c_write', `bool _ailyMicrobitI2CWrite(uint8_t address, uint8_t reg, uint8_t value) {
  AILY_MICROBIT_INTERNAL_WIRE.beginTransmission(address);
  AILY_MICROBIT_INTERNAL_WIRE.write(reg);
  AILY_MICROBIT_INTERNAL_WIRE.write(value);
  return AILY_MICROBIT_INTERNAL_WIRE.endTransmission() == 0;
}`);

  generator.addFunction('microbit_builtin_i2c_read', `bool _ailyMicrobitI2CRead(uint8_t address, uint8_t reg, uint8_t *data, uint8_t length) {
  AILY_MICROBIT_INTERNAL_WIRE.beginTransmission(address);
  AILY_MICROBIT_INTERNAL_WIRE.write(reg);
  if (AILY_MICROBIT_INTERNAL_WIRE.endTransmission(false) != 0) return false;
  if (AILY_MICROBIT_INTERNAL_WIRE.requestFrom(address, length) != length) return false;
  for (uint8_t i = 0; i < length; i++) data[i] = AILY_MICROBIT_INTERNAL_WIRE.read();
  return true;
}`);

  generator.addFunction('microbit_builtin_begin_fn', `void _ailyMicrobitBuiltinsBegin() {
  if (_ailyMicrobitBuiltinsReady) return;
  pinMode(PIN_BUTTON_A, INPUT_PULLUP);
  pinMode(PIN_BUTTON_B, INPUT_PULLUP);
  AILY_MICROBIT_INTERNAL_WIRE.begin();
  delay(7);

  uint8_t id = 0;
  if (_ailyMicrobitI2CRead(0x19, 0x0F, &id, 1) && id == 0x33) {
    _ailyMicrobitMotionType = 2;
    _ailyMicrobitI2CWrite(0x19, 0x20, 0x57);
    _ailyMicrobitI2CWrite(0x19, 0x23, 0x80);
  } else if (_ailyMicrobitI2CRead(0x1D, 0x0D, &id, 1) && id == 0x5A) {
    _ailyMicrobitMotionType = 1;
    _ailyMicrobitI2CWrite(0x1D, 0x2A, 0x00);
    _ailyMicrobitI2CWrite(0x1D, 0x2B, 0x10);
    _ailyMicrobitI2CWrite(0x1D, 0x0E, 0x00);
    _ailyMicrobitI2CWrite(0x1D, 0x2A, 0x19);
  }

  if (_ailyMicrobitI2CRead(0x1E, 0x4F, &id, 1) && id == 0x40) {
    _ailyMicrobitCompassType = 2;
    _ailyMicrobitI2CWrite(0x1E, 0x60, 0x00);
    _ailyMicrobitI2CWrite(0x1E, 0x62, 0x01);
  } else if (_ailyMicrobitI2CRead(0x0E, 0x07, &id, 1) && id == 0xC4) {
    _ailyMicrobitCompassType = 1;
    _ailyMicrobitI2CWrite(0x0E, 0x10, 0x00);
    _ailyMicrobitI2CWrite(0x0E, 0x11, 0xA0);
    _ailyMicrobitI2CWrite(0x0E, 0x10, 0x61);
  }

  _ailyMicrobitBuiltinsReady = true;
}`);

  generator.addFunction('microbit_builtin_button_fn', `bool _ailyMicrobitButtonPressed(uint8_t button) {
  _ailyMicrobitBuiltinsBegin();
  bool a = digitalRead(PIN_BUTTON_A) == LOW;
  bool b = digitalRead(PIN_BUTTON_B) == LOW;
  if (button == 0) return a;
  if (button == 1) return b;
  return a && b;
}`);

  generator.addFunction('microbit_builtin_temperature_fn', `float _ailyMicrobitTemperature() {
  NRF_TEMP->EVENTS_DATARDY = 0;
  NRF_TEMP->TASKS_START = 1;
  while (NRF_TEMP->EVENTS_DATARDY == 0) {}
  float value = ((int32_t)NRF_TEMP->TEMP) / 4.0f;
  NRF_TEMP->TASKS_STOP = 1;
  return value;
}`);

  generator.addFunction('microbit_builtin_read_accel_fn', `bool _ailyMicrobitReadAcceleration() {
  _ailyMicrobitBuiltinsBegin();
  uint8_t data[6];
  if (_ailyMicrobitMotionType == 2) {
    if (!_ailyMicrobitI2CRead(0x19, 0x28 | 0x80, data, 6)) return false;
    int16_t rawX = (int16_t)((uint16_t)data[1] << 8 | data[0]);
    int16_t rawY = (int16_t)((uint16_t)data[3] << 8 | data[2]);
    int16_t rawZ = (int16_t)((uint16_t)data[5] << 8 | data[4]);
    _ailyMicrobitAccelX = rawX / 16;
    _ailyMicrobitAccelY = -(rawY / 16);
    _ailyMicrobitAccelZ = rawZ / 16;
    return true;
  }
  if (_ailyMicrobitMotionType == 1) {
    if (!_ailyMicrobitI2CRead(0x1D, 0x01, data, 6)) return false;
    int16_t rawX = (int16_t)((uint16_t)data[0] << 8 | data[1]);
    int16_t rawY = (int16_t)((uint16_t)data[2] << 8 | data[3]);
    int16_t rawZ = (int16_t)((uint16_t)data[4] << 8 | data[5]);
    rawX >>= 6;
    rawY >>= 6;
    rawZ >>= 6;
    _ailyMicrobitAccelX = (int16_t)(-(int32_t)rawX * 2000 / 512);
    _ailyMicrobitAccelY = (int16_t)(-(int32_t)rawY * 2000 / 512);
    _ailyMicrobitAccelZ = (int16_t)((int32_t)rawZ * 2000 / 512);
    return true;
  }
  return false;
}`);

  generator.addFunction('microbit_builtin_accel_value_fn', `int _ailyMicrobitAcceleration(uint8_t axis) {
  if (!_ailyMicrobitReadAcceleration()) return 0;
  if (axis == 0) return _ailyMicrobitAccelX;
  if (axis == 1) return _ailyMicrobitAccelY;
  if (axis == 2) return _ailyMicrobitAccelZ;
  float x = _ailyMicrobitAccelX;
  float y = _ailyMicrobitAccelY;
  float z = _ailyMicrobitAccelZ;
  return (int)sqrtf(x * x + y * y + z * z);
}`);

  generator.addFunction('microbit_builtin_shake_fn', `bool _ailyMicrobitShakeDetected() {
  unsigned long now = millis();
  if (now - _ailyMicrobitShakeTime > 500) _ailyMicrobitShakeCount = 0;
  int16_t values[3] = {_ailyMicrobitAccelX, _ailyMicrobitAccelY, _ailyMicrobitAccelZ};
  int8_t *signs[3] = {&_ailyMicrobitShakeSignX, &_ailyMicrobitShakeSignY, &_ailyMicrobitShakeSignZ};
  bool crossing = false;
  for (uint8_t i = 0; i < 3; i++) {
    int8_t sign = values[i] > 400 ? 1 : (values[i] < -400 ? -1 : 0);
    if (sign != 0 && *signs[i] != 0 && sign != *signs[i]) crossing = true;
    if (sign != 0) *signs[i] = sign;
  }
  if (crossing) {
    _ailyMicrobitShakeTime = now;
    if (++_ailyMicrobitShakeCount >= 4) {
      _ailyMicrobitShakeCount = 0;
      return true;
    }
  }
  return false;
}`);

  generator.addFunction('microbit_builtin_gesture_fn', `bool _ailyMicrobitGesture(uint8_t gesture) {
  if (!_ailyMicrobitReadAcceleration()) return false;
  if (gesture == 11) return _ailyMicrobitShakeDetected();
  int32_t x = _ailyMicrobitAccelX;
  int32_t y = _ailyMicrobitAccelY;
  int32_t z = _ailyMicrobitAccelZ;
  if (gesture == 1) return y > 800;
  if (gesture == 2) return y < -800;
  if (gesture == 3) return x < -800;
  if (gesture == 4) return x > 800;
  if (gesture == 5) return z < -800;
  if (gesture == 6) return z > 800;
  return x * x + y * y + z * z < 160000L;
}`);

  generator.addFunction('microbit_builtin_read_mag_fn', `bool _ailyMicrobitReadMagneticField() {
  _ailyMicrobitBuiltinsBegin();
  uint8_t data[6];
  if (_ailyMicrobitCompassType == 2) {
    if (!_ailyMicrobitI2CRead(0x1E, 0x68 | 0x80, data, 6)) return false;
    int16_t rawX = (int16_t)((uint16_t)data[1] << 8 | data[0]);
    int16_t rawY = (int16_t)((uint16_t)data[3] << 8 | data[2]);
    int16_t rawZ = (int16_t)((uint16_t)data[5] << 8 | data[4]);
    _ailyMicrobitMagX = rawX * 0.15f;
    _ailyMicrobitMagY = -rawY * 0.15f;
    _ailyMicrobitMagZ = rawZ * 0.15f;
    return true;
  }
  if (_ailyMicrobitCompassType == 1) {
    if (!_ailyMicrobitI2CRead(0x0E, 0x01, data, 6)) return false;
    int16_t rawX = (int16_t)((uint16_t)data[0] << 8 | data[1]);
    int16_t rawY = (int16_t)((uint16_t)data[2] << 8 | data[3]);
    int16_t rawZ = (int16_t)((uint16_t)data[4] << 8 | data[5]);
    _ailyMicrobitMagX = -rawX * 0.1f;
    _ailyMicrobitMagY = -rawY * 0.1f;
    _ailyMicrobitMagZ = -rawZ * 0.1f;
    return true;
  }
  return false;
}`);

  generator.addFunction('microbit_builtin_mag_value_fn', `float _ailyMicrobitMagneticField(uint8_t axis) {
  if (!_ailyMicrobitReadMagneticField()) return 0;
  if (axis == 0) return _ailyMicrobitMagX;
  if (axis == 1) return _ailyMicrobitMagY;
  if (axis == 2) return _ailyMicrobitMagZ;
  return sqrtf(_ailyMicrobitMagX * _ailyMicrobitMagX + _ailyMicrobitMagY * _ailyMicrobitMagY + _ailyMicrobitMagZ * _ailyMicrobitMagZ);
}`);

  generator.addFunction('microbit_builtin_heading_fn', `int _ailyMicrobitCompassHeading() {
  if (!_ailyMicrobitReadMagneticField()) return 0;
  float heading = atan2f(_ailyMicrobitMagX, _ailyMicrobitMagY) * 180.0f / PI;
  if (heading < 0) heading += 360.0f;
  return (int)heading;
}`);

  generator.addSetupBegin('microbit_builtin_setup', '_ailyMicrobitBuiltinsBegin();');
}

function ensureMicrobitRadioRuntime(generator) {
  generator.addLibrary('microbit_radio_arduino', '#include <Arduino.h>');

  generator.addObject('microbit_radio_state', `struct AilyMicrobitRadioFrame {
  uint8_t length;
  uint8_t version;
  uint8_t group;
  uint8_t protocol;
  uint8_t payload[32];
};
static AilyMicrobitRadioFrame _ailyMicrobitRadioRx;
static bool _ailyMicrobitRadioReady = false;
static bool _ailyMicrobitRadioPending = false;
static uint8_t _ailyMicrobitRadioGroup = 0;
static int _ailyMicrobitRadioLastRSSI = 0;
static String _ailyMicrobitRadioMessage;`);

  generator.addFunction('microbit_radio_start_receive_fn', `void _ailyMicrobitRadioStartReceive() {
  NRF_RADIO->PACKETPTR = (uint32_t)&_ailyMicrobitRadioRx;
  NRF_RADIO->EVENTS_READY = 0;
  NRF_RADIO->TASKS_RXEN = 1;
  while (NRF_RADIO->EVENTS_READY == 0) {}
  NRF_RADIO->EVENTS_END = 0;
  NRF_RADIO->TASKS_START = 1;
}`);

  generator.addFunction('microbit_radio_power_fn', `void _ailyMicrobitRadioSetPower(uint8_t power) {
  if (power > 7) power = 7;
  static const int8_t levels[8] = {-30, -20, -16, -12, -8, -4, 0, 4};
  NRF_RADIO->TXPOWER = (uint32_t)levels[power];
}`);

  generator.addFunction('microbit_radio_begin_fn', `void _ailyMicrobitRadioBegin(uint8_t group) {
  if (_ailyMicrobitRadioReady && group == _ailyMicrobitRadioGroup) return;
  NVIC_DisableIRQ(RADIO_IRQn);
  NRF_RADIO->INTENCLR = 0xFFFFFFFF;
  NRF_RADIO->EVENTS_DISABLED = 0;
  NRF_RADIO->TASKS_DISABLE = 1;
  while (NRF_RADIO->EVENTS_DISABLED == 0) {}

  if (!_ailyMicrobitRadioReady) {
    // Both supported n-able board variants keep HFXO running for USE_LFSYNT.
    _ailyMicrobitRadioSetPower(6);
    NRF_RADIO->FREQUENCY = 7;
    NRF_RADIO->MODE = RADIO_MODE_MODE_Nrf_1Mbit;
    NRF_RADIO->BASE0 = 0x75626974;
    NRF_RADIO->TXADDRESS = 0;
    NRF_RADIO->RXADDRESSES = 1;
    NRF_RADIO->PCNF0 = 0x00000008;
    NRF_RADIO->PCNF1 = 0x02040000 | 32;
    NRF_RADIO->CRCCNF = RADIO_CRCCNF_LEN_Two;
    NRF_RADIO->CRCINIT = 0xFFFF;
    NRF_RADIO->CRCPOLY = 0x11021;
    NRF_RADIO->DATAWHITEIV = 0x18;
    NRF_RADIO->SHORTS = RADIO_SHORTS_ADDRESS_RSSISTART_Msk;
  }

  _ailyMicrobitRadioGroup = group;
  NRF_RADIO->PREFIX0 = group;
  _ailyMicrobitRadioReady = true;
  _ailyMicrobitRadioStartReceive();
}`);

  generator.addFunction('microbit_radio_send_fn', `void _ailyMicrobitRadioSend(String message) {
  _ailyMicrobitRadioBegin(_ailyMicrobitRadioGroup);
  AilyMicrobitRadioFrame frame;
  uint8_t payloadLength = message.length() > 29 ? 29 : message.length();
  frame.length = payloadLength + 3;
  frame.version = 1;
  frame.group = 0;
  frame.protocol = 1;
  for (uint8_t i = 0; i < payloadLength; i++) frame.payload[i] = (uint8_t)message[i];

  NRF_RADIO->EVENTS_DISABLED = 0;
  NRF_RADIO->TASKS_DISABLE = 1;
  while (NRF_RADIO->EVENTS_DISABLED == 0) {}
  NRF_RADIO->PACKETPTR = (uint32_t)&frame;
  NRF_RADIO->EVENTS_READY = 0;
  NRF_RADIO->TASKS_TXEN = 1;
  while (NRF_RADIO->EVENTS_READY == 0) {}
  NRF_RADIO->EVENTS_END = 0;
  NRF_RADIO->TASKS_START = 1;
  while (NRF_RADIO->EVENTS_END == 0) {}
  NRF_RADIO->EVENTS_DISABLED = 0;
  NRF_RADIO->TASKS_DISABLE = 1;
  while (NRF_RADIO->EVENTS_DISABLED == 0) {}
  _ailyMicrobitRadioStartReceive();
}`);

  generator.addFunction('microbit_radio_poll_fn', `bool _ailyMicrobitRadioPoll() {
  _ailyMicrobitRadioBegin(_ailyMicrobitRadioGroup);
  if (_ailyMicrobitRadioPending) return true;
  if (NRF_RADIO->EVENTS_END == 0) return false;

  bool valid = NRF_RADIO->CRCSTATUS == 1 &&
               _ailyMicrobitRadioRx.length >= 3 &&
               _ailyMicrobitRadioRx.length <= 32 &&
               _ailyMicrobitRadioRx.version == 1 &&
               _ailyMicrobitRadioRx.protocol == 1;
  _ailyMicrobitRadioLastRSSI = -(int)NRF_RADIO->RSSISAMPLE;
  NRF_RADIO->EVENTS_END = 0;

  if (valid) {
    uint8_t payloadLength = _ailyMicrobitRadioRx.length - 3;
    _ailyMicrobitRadioMessage = "";
    for (uint8_t i = 0; i < payloadLength; i++) _ailyMicrobitRadioMessage += (char)_ailyMicrobitRadioRx.payload[i];
    _ailyMicrobitRadioPending = true;
  }

  NRF_RADIO->PACKETPTR = (uint32_t)&_ailyMicrobitRadioRx;
  NRF_RADIO->TASKS_START = 1;
  return _ailyMicrobitRadioPending;
}`);

  generator.addFunction('microbit_radio_receive_fn', `String _ailyMicrobitRadioReceive() {
  if (!_ailyMicrobitRadioPoll()) return String("");
  _ailyMicrobitRadioPending = false;
  return _ailyMicrobitRadioMessage;
}`);
}

Arduino.forBlock['microbit_builtin_setup'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  return '';
};

Arduino.forBlock['microbit_button_is_pressed'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  const button = block.getFieldValue('BUTTON') || '0';
  return ['_ailyMicrobitButtonPressed(' + button + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_temperature'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  return ['_ailyMicrobitTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_acceleration'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  const axis = block.getFieldValue('AXIS') || '0';
  return ['_ailyMicrobitAcceleration(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_gesture_is'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  const gesture = block.getFieldValue('GESTURE') || '1';
  return ['_ailyMicrobitGesture(' + gesture + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_magnetic_field'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  const axis = block.getFieldValue('AXIS') || '0';
  return ['_ailyMicrobitMagneticField(' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_compass_heading'] = function(block, generator) {
  ensureMicrobitSensorRuntime(generator);
  return ['_ailyMicrobitCompassHeading()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_radio_set_group'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  const group = generator.valueToCode(block, 'GROUP', generator.ORDER_ATOMIC) || '0';
  return '_ailyMicrobitRadioBegin((uint8_t)constrain(' + group + ', 0, 255));\n';
};

Arduino.forBlock['microbit_radio_set_power'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  const power = block.getFieldValue('POWER') || '6';
  return '_ailyMicrobitRadioBegin(_ailyMicrobitRadioGroup);\n_ailyMicrobitRadioSetPower(' + power + ');\n';
};

Arduino.forBlock['microbit_radio_send_string'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  const value = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return '_ailyMicrobitRadioSend(String(' + value + '));\n';
};

Arduino.forBlock['microbit_radio_received'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  return ['_ailyMicrobitRadioPoll()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_radio_receive_string'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  return ['_ailyMicrobitRadioReceive()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['microbit_radio_rssi'] = function(block, generator) {
  ensureMicrobitRadioRuntime(generator);
  return ['_ailyMicrobitRadioLastRSSI', generator.ORDER_ATOMIC];
};
