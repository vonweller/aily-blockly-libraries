Arduino.forBlock['mouse_begin'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  return '';
};

Arduino.forBlock['mouse_click'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  var button = block.getFieldValue('BUTTON');
  return 'Mouse.click(' + button + ');\n';
};

Arduino.forBlock['mouse_move'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  var wheel = generator.valueToCode(block, 'WHEEL', generator.ORDER_ATOMIC) || '0';
  return 'Mouse.move(' + x + ', ' + y + ', ' + wheel + ');\n';
};

Arduino.forBlock['mouse_press'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  var button = block.getFieldValue('BUTTON');
  return 'Mouse.press(' + button + ');\n';
};

Arduino.forBlock['mouse_release'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  var button = block.getFieldValue('BUTTON');
  return 'Mouse.release(' + button + ');\n';
};

Arduino.forBlock['mouse_is_pressed'] = function (block, generator) {
  generator.addLibrary('#include <Mouse.h>', '#include <Mouse.h>');
  generator.addSetupBegin('mouse_begin', 'Mouse.begin();');
  var button = block.getFieldValue('BUTTON');
  var code = 'Mouse.isPressed(' + button + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};