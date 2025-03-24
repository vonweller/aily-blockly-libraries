Arduino.forBlock['softwareserial_create'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  var rxPin = block.getFieldValue('RX_PIN');
  var txPin = block.getFieldValue('TX_PIN');
  
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  generator.addVariable(variable, 'SoftwareSerial ' + variable + '(' + rxPin + ', ' + txPin + ');');
  
  return '';
};

Arduino.forBlock['softwareserial_begin'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  var baudRate = block.getFieldValue('BAUD_RATE');
  
  return variable + '.begin(' + baudRate + ');\n';
};

Arduino.forBlock['softwareserial_listen'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  
  return variable + '.listen();\n';
};

Arduino.forBlock['softwareserial_available'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  
  return [variable + '.available()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['softwareserial_read'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  
  return [variable + '.read()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['softwareserial_write'] = function(block, generator) {
  var variable = block.getFieldValue('SERIAL_VAR');
  var data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  
  return variable + '.write(' + data + ');\n';
};