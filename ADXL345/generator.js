Arduino.forBlock['adxl345_init'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  var addr = block.getFieldValue('ADDR');
  generator.addLibrary('#include "ADXL345.h"', '#include "ADXL345.h"');
  generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
  generator.addVariable('ADXL345 ' + variable, 'ADXL345 ' + variable + '(' + addr + ')');
  return '';
};

Arduino.forBlock['adxl345_start'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.start();';
};

Arduino.forBlock['adxl345_stop'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.stop();';
};

Arduino.forBlock['adxl345_update'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.update();';
};

Arduino.forBlock['adxl345_getX'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.getX();';
};

Arduino.forBlock['adxl345_getY'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.getY();';
};

Arduino.forBlock['adxl345_getZ'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.getZ();';
};

Arduino.forBlock['adxl345_readID'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  return variable + '.readDeviceID();';
};

Arduino.forBlock['adxl345_setRange'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  var range = block.getFieldValue('RANGE');
  return variable + '.writeRange(' + range + ');';
};

Arduino.forBlock['adxl345_setRate'] = function(block, generator) {
  var variable = block.getFieldValue('OBJECT');
  var rate = block.getFieldValue('RATE');
  return variable + '.writeRate(' + rate + ');';
};