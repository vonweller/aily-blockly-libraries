Arduino.forBlock['shift_register_create'] = function(block, generator) {
  var obj = block.getFieldValue("OBJECT");
  var serialPin = block.getFieldValue("SERIAL_PIN");
  var clockPin = block.getFieldValue("CLOCK_PIN");
  var latchPin = block.getFieldValue("LATCH_PIN");
  generator.addLibrary('#include <ShiftRegister74HC595.h>', '#include <ShiftRegister74HC595.h>');
  generator.addVariable('ShiftRegister74HC595<8> ' + obj, 'ShiftRegister74HC595<8> ' + obj + '(' + serialPin + ', ' + clockPin + ', ' + latchPin + ')');
  return '';
};

Arduino.forBlock['shift_register_set'] = function(block, generator) {
  var obj = block.getFieldValue("OBJECT");
  var pin = block.getFieldValue("PIN");
  var value = block.getFieldValue("VALUE");
  return obj + '.set(' + pin + ', ' + value + ');';
};

Arduino.forBlock['shift_register_update'] = function(block, generator) {
  var obj = block.getFieldValue("OBJECT");
  return obj + '.updateRegisters();';
};

Arduino.forBlock['shift_register_setAllLow'] = function(block, generator) {
  var obj = block.getFieldValue("OBJECT");
  return obj + '.setAllLow();';
};

Arduino.forBlock['shift_register_setAllHigh'] = function(block, generator) {
  var obj = block.getFieldValue("OBJECT");
  return obj + '.setAllHigh();';
};