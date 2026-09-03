// Generators for @aily-project/lib-ps2x (universal PS2 DualShock 2 gamepad
// library for Arduino-compatible boards). Pin dropdowns feed on the board's
// digital-pin data (${board.digitalPins}); the driver honours CMD/DAT/CLK
// remapping on cores that support it (e.g. ESP32) and falls back to the
// board SPI pins on fixed-pad cores (e.g. micro:bit V2). Reference wiring
// for the Chuanglebo MakeBit PS2 socket: ATT=12, CMD=15, DAT=14, CLK=13.
// Read field_variable only with generator.getValue(block, 'VAR', 'field_variable').

// Dropdown values come from board digital-pin data and are numeric strings
// (e.g. "12"); fall back to the MakeBit reference wiring when unset.
function ps2xPinNumber(token, fallback) {
  const n = parseInt(token, 10)
  return Number.isFinite(n) ? String(n) : fallback
}

var PS2X_BUTTON_CPP = {
  TRIANGLE: 'PS2X_TRIANGLE',
  CIRCLE: 'PS2X_CIRCLE',
  CROSS: 'PS2X_CROSS',
  SQUARE: 'PS2X_SQUARE',
  UP: 'PS2X_UP',
  DOWN: 'PS2X_DOWN',
  LEFT: 'PS2X_LEFT',
  RIGHT: 'PS2X_RIGHT',
  L1: 'PS2X_L1',
  R1: 'PS2X_R1',
  L2: 'PS2X_L2',
  R2: 'PS2X_R2',
  SELECT: 'PS2X_SELECT',
  START: 'PS2X_START',
  L3: 'PS2X_L3',
  R3: 'PS2X_R3'
}

var PS2X_STICK_CPP = {
  LX: 'PS2X_LX',
  LY: 'PS2X_LY',
  RX: 'PS2X_RX',
  RY: 'PS2X_RY'
}

Arduino.forBlock['ps2x_init'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const att = ps2xPinNumber(block.getFieldValue('ATT'), '12')
  const cmd = ps2xPinNumber(block.getFieldValue('CMD'), '15')
  const dat = ps2xPinNumber(block.getFieldValue('DAT'), '14')
  const clk = ps2xPinNumber(block.getFieldValue('CLK'), '13')

  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  generator.addObject('ps2x_' + objectName, 'PS2X ' + objectName + '(' + att + ', ' + cmd + ', ' + dat + ', ' + clk + ');')
  generator.addSetupBegin('ps2x_' + objectName + '_begin', objectName + '.begin();\n')
  generator.addLoopBegin('ps2x_' + objectName + '_read', objectName + '.readGamepad();\n')
  return ''
}

Arduino.forBlock['ps2x_connected'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return [objectName + '.connected()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ps2x_button_pressed'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const button = PS2X_BUTTON_CPP[block.getFieldValue('BUTTON')] || 'PS2X_CROSS'
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return [objectName + '.buttonPressed(' + button + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ps2x_button_newpress'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const button = PS2X_BUTTON_CPP[block.getFieldValue('BUTTON')] || 'PS2X_CROSS'
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return [objectName + '.buttonNewPressed(' + button + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ps2x_button_released'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const button = PS2X_BUTTON_CPP[block.getFieldValue('BUTTON')] || 'PS2X_CROSS'
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return [objectName + '.buttonReleased(' + button + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ps2x_stick'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const stick = PS2X_STICK_CPP[block.getFieldValue('STICK')] || 'PS2X_LX'
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return [objectName + '.stick(' + stick + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ps2x_set_vibration'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const small = generator.valueToCode(block, 'SMALL', Arduino.ORDER_ATOMIC) || 'false'
  const large = generator.valueToCode(block, 'LARGE', Arduino.ORDER_ATOMIC) || '0'
  generator.addLibrary('ps2x', '#include "PS2X_microbit.h"')
  return objectName + '.setVibration(' + small + ', (uint8_t)constrain(' + large + ', 0, 255));\n'
}
