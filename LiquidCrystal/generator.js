Arduino.forBlock['lcd_print'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || '""';
  var code = 'lcd.print(' + text + ');\n';
  return code;
};

Arduino.forBlock['lcd_set_cursor'] = function(block, generator) {
  var row = generator.valueToCode(block, 'ROW', generator.ORDER_NONE) || '0';
  var col = generator.valueToCode(block, 'COL', generator.ORDER_NONE) || '0';
  var code = 'lcd.setCursor(' + col + ', ' + row + ');\n';
  return code;
};

Arduino.forBlock['lcd_clear'] = function(block, generator) {
  var code = 'lcd.clear();\n';
  return code;
};

Arduino.forBlock['lcd_create_char'] = function(block, generator) {
  var index = generator.valueToCode(block, 'INDEX', generator.ORDER_NONE) || '0';
  var charArray = generator.valueToCode(block, 'CHAR_ARRAY', generator.ORDER_NONE) || '{}';
  var code = 'lcd.createChar(' + index + ', ' + charArray + ');\n';
  return code;
};