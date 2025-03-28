
// LCD I2C display library generator

// LCD initialize
Arduino.forBlock['lcd_i2c_init'] = function(block, generator) {
  var address = block.getFieldValue("ADDRESS") || '0x27';
  var cols = block.getFieldValue("COLS") || '16';
  var rows = block.getFieldValue("ROWS") || '2';
  
  generator.addLibrary('LCD_I2C', '#include <LiquidCrystal_I2C.h>');
  generator.addVariable('lcd_i2c', 'LiquidCrystal_I2C lcd(' + address + ', ' + cols + ', ' + rows + ');');
  
  var code = 'lcd.init();\n';
  code += 'lcd.backlight();\n';
  
  return code;
};

// LCD clear display
Arduino.forBlock['lcd_clear'] = function(block, generator) {
  return 'lcd.clear();\n';
};

// LCD home (set cursor to 0,0)
Arduino.forBlock['lcd_home'] = function(block, generator) {
  return 'lcd.home();\n';
};

// LCD display - turn on
Arduino.forBlock['lcd_display'] = function(block, generator) {
  return 'lcd.display();\n';
};

// LCD display - turn off
Arduino.forBlock['lcd_no_display'] = function(block, generator) {
  return 'lcd.noDisplay();\n';
};

// LCD backlight - turn on
Arduino.forBlock['lcd_backlight'] = function(block, generator) {
  return 'lcd.backlight();\n';
};

// LCD backlight - turn off
Arduino.forBlock['lcd_no_backlight'] = function(block, generator) {
  return 'lcd.noBacklight();\n';
};

// LCD cursor - turn on
Arduino.forBlock['lcd_cursor'] = function(block, generator) {
  return 'lcd.cursor();\n';
};

// LCD cursor - turn off
Arduino.forBlock['lcd_no_cursor'] = function(block, generator) {
  return 'lcd.noCursor();\n';
};

// LCD blink - turn on
Arduino.forBlock['lcd_blink'] = function(block, generator) {
  return 'lcd.blink();\n';
};

// LCD blink - turn off
Arduino.forBlock['lcd_no_blink'] = function(block, generator) {
  return 'lcd.noBlink();\n';
};

// LCD set cursor position
Arduino.forBlock['lcd_set_cursor'] = function(block, generator) {
  var col = block.getFieldValue("COL") || '0';
  var row = block.getFieldValue("ROW") || '0';
  
  return 'lcd.setCursor(' + col + ', ' + row + ');\n';
};

// LCD print text at current cursor position
Arduino.forBlock['lcd_print'] = function(block, generator) {
  var text = block.getFieldValue("TEXT") || '""';
  
  return 'lcd.print(' + text + ');\n';
};

// LCD print text at specified position (combined set cursor and print)
Arduino.forBlock['lcd_print_position'] = function(block, generator) {
  var col = block.getFieldValue("COL") || '0';
  var row = block.getFieldValue("ROW") || '0';
  var text = block.getFieldValue("TEXT") || '""';
  
  var code = 'lcd.setCursor(' + col + ', ' + row + ');\n';
  code += 'lcd.print(' + text + ');\n';
  
  return code;
};

// LCD text direction - left to right
Arduino.forBlock['lcd_left_to_right'] = function(block, generator) {
  return 'lcd.leftToRight();\n';
};

// LCD text direction - right to left
Arduino.forBlock['lcd_right_to_left'] = function(block, generator) {
  return 'lcd.rightToLeft();\n';
};

// LCD scroll display - left
Arduino.forBlock['lcd_scroll_display_left'] = function(block, generator) {
  return 'lcd.scrollDisplayLeft();\n';
};

// LCD scroll display - right
Arduino.forBlock['lcd_scroll_display_right'] = function(block, generator) {
  return 'lcd.scrollDisplayRight();\n';
};

// LCD autoscroll - enable
Arduino.forBlock['lcd_autoscroll'] = function(block, generator) {
  return 'lcd.autoscroll();\n';
};

// LCD autoscroll - disable
Arduino.forBlock['lcd_no_autoscroll'] = function(block, generator) {
  return 'lcd.noAutoscroll();\n';
};

// LCD create custom character
Arduino.forBlock['lcd_create_char'] = function(block, generator) {
  var charIndex = block.getFieldValue("CHAR_INDEX") || '0';
  var row0 = block.getFieldValue("ROW0") || '0';
  var row1 = block.getFieldValue("ROW1") || '0';
  var row2 = block.getFieldValue("ROW2") || '0';
  var row3 = block.getFieldValue("ROW3") || '0';
  var row4 = block.getFieldValue("ROW4") || '0';
  var row5 = block.getFieldValue("ROW5") || '0';
  var row6 = block.getFieldValue("ROW6") || '0';
  var row7 = block.getFieldValue("ROW7") || '0';
  
  var charArrayName = 'customChar' + charIndex;
  generator.addVariable(charArrayName, 'byte ' + charArrayName + '[8] = {\n' +
    '  ' + row0 + ',\n' +
    '  ' + row1 + ',\n' +
    '  ' + row2 + ',\n' +
    '  ' + row3 + ',\n' +
    '  ' + row4 + ',\n' +
    '  ' + row5 + ',\n' +
    '  ' + row6 + ',\n' +
    '  ' + row7 + '\n' +
    '};');
  
  return 'lcd.createChar(' + charIndex + ', ' + charArrayName + ');\n';
};

// LCD print custom character
Arduino.forBlock['lcd_print_custom_char'] = function(block, generator) {
  var charIndex = block.getFieldValue("CHAR_INDEX") || '0';
  
  return 'lcd.write(' + charIndex + ');\n';
};

// Simplified LCD - initialize and print text at once
Arduino.forBlock['lcd_simple_message'] = function(block, generator) {
  var address = block.getFieldValue("ADDRESS") || '0x27';
  var cols = block.getFieldValue("COLS") || '16';
  var rows = block.getFieldValue("ROWS") || '2';
  var text = block.getFieldValue("TEXT") || '""';
  
  generator.addLibrary('LCD_I2C', '#include <LiquidCrystal_I2C.h>');
  generator.addVariable('lcd_i2c', 'LiquidCrystal_I2C lcd(' + address + ', ' + cols + ', ' + rows + ');');
  generator.addSetup('lcd_init', 'lcd.init();\n  lcd.backlight();');
  
  return 'lcd.clear();\nlcd.home();\nlcd.print(' + text + ');\n';
};

// Simplified LCD - print text on specific line 
Arduino.forBlock['lcd_print_line'] = function(block, generator) {
  var line = block.getFieldValue("LINE") || '0';
  var text = block.getFieldValue("TEXT") || '""';
  
  return 'lcd.setCursor(0, ' + line + ');\nlcd.print(' + text + ');\n';
};
