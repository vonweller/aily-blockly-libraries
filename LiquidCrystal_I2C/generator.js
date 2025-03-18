Arduino.forBlock['lcd_init'] = function(block, generator) {
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0x27';
  var width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '16';
  var height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '2';
  
  generator.addLibrary('#include <LiquidCrystal_PCF8574.h>', '#include <LiquidCrystal_PCF8574.h>');
  generator.addVariable('LiquidCrystal_PCF8574 lcd(address);', 'LiquidCrystal_PCF8574 lcd(' + address + ');');
  generator.addSetup('lcd.begin(' + width + ', ' + height + ');', 'lcd.begin(' + width + ', ' + height + ');');
  
  return '';
};

Arduino.forBlock['lcd_print'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  var row = generator.valueToCode(block, 'ROW', generator.ORDER_ATOMIC) || '0';
  var col = generator.valueToCode(block, 'COL', generator.ORDER_ATOMIC) || '0';
  
  return 'lcd.setCursor(' + col + ', ' + row + ');\nlcd.print(' + text + ');\n';
};

Arduino.forBlock['lcd_clear'] = function(block, generator) {
  return 'lcd.clear();\n';
};