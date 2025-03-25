Arduino.forBlock['keyboard_begin'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  return 'Keyboard.begin();\n';
};

Arduino.forBlock['keyboard_end'] = function(block, generator) {
  return 'Keyboard.end();\n';
};

Arduino.forBlock['keyboard_write'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var char = generator.valueToCode(block, 'CHAR', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.write(' + char + ');\n';
};

Arduino.forBlock['keyboard_press'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.press(' + key + ');\n';
};

Arduino.forBlock['keyboard_special_key'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = block.getFieldValue('KEY');
  return [key, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['keyboard_release'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.release(' + key + ');\n';
};

Arduino.forBlock['keyboard_release_all'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  return 'Keyboard.releaseAll();\n';
};

Arduino.forBlock['keyboard_serial_to_key'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  generator.addSetup('serial_begin', 'Serial.begin(9600);');
  
  var code = 'if (Serial.available() > 0) {\n' +
             '  char c = Serial.read();\n' +
             '  Keyboard.write(c + 1);\n' +
             '}\n';
  return code;
};