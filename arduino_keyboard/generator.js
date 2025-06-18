Arduino.forBlock['keyboard_begin'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  return 'Keyboard.begin();\n';
};

Arduino.forBlock['keyboard_end'] = function(block, generator) {
  return 'Keyboard.end();\n';
};

Arduino.forBlock['keyboard_print'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.print(' + text + ');\n';
};

Arduino.forBlock['keyboard_press'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.press(' + processKey(key) + ');\n';
};

Arduino.forBlock['keyboard_special_key'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = block.getFieldValue('KEY');
  return [key, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['keyboard_release'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '\'\\0\'';
  return 'Keyboard.release(' + processKey(key) + ');\n';
};

Arduino.forBlock['keyboard_release_all'] = function(block, generator) {
  generator.addLibrary('#include <Keyboard.h>', '#include <Keyboard.h>');
  return 'Keyboard.releaseAll();\n';
};

function processKey(key) {
  // 使用正则表达式匹配双引号内的内容
  var match = key.match(/"([^"]*)"/);
  if (match && match[1].length > 0) {
    // 取第一个字符并用单引号包围
    return "'" + match[1].charAt(0) + "'";
  }
  return "'\\0'"; // 默认返回空字符
}