Arduino.forBlock['lis3dhtr_begin'] = function(block, generator) {
  generator.addLibrary('#include "LIS3DHTR.h"', '#include "LIS3DHTR.h"');
  generator.addVariable('LIS3DHTR<TwoWire> lis3dhtr', 'LIS3DHTR<TwoWire> lis3dhtr;');
  var address = block.getFieldValue('ADDRESS');
  return 'lis3dhtr.begin(' + address + ');';
};

Arduino.forBlock['lis3dhtr_set_range'] = function(block, generator) {
  var range = block.getFieldValue('RANGE');
  return 'lis3dhtr.setFullScaleRange(' + range + ');';
};

Arduino.forBlock['lis3dhtr_set_datarate'] = function(block, generator) {
  var datarate = block.getFieldValue('DATARATE');
  return 'lis3dhtr.setOutputDataRate(' + datarate + ');';
};

Arduino.forBlock['lis3dhtr_get_x'] = function(block, generator) {
  return 'lis3dhtr.getAccelerationX()';
};

Arduino.forBlock['lis3dhtr_get_y'] = function(block, generator) {
  return 'lis3dhtr.getAccelerationY()';
};

Arduino.forBlock['lis3dhtr_get_z'] = function(block, generator) {
  return 'lis3dhtr.getAccelerationZ()';
};

Arduino.forBlock['lis3dhtr_get_temperature'] = function(block, generator) {
  return 'lis3dhtr.getTemperature()';
};

Arduino.forBlock['lis3dhtr_isConnected'] = function(block, generator) {
  return 'lis3dhtr.isConnection()';
};

Arduino.forBlock['lis3dhtr_reset'] = function(block, generator) {
  return 'lis3dhtr.reset();';
};