// LCD I2C display library generator

// 添加一个标志变量，用于跟踪LCD是否已初始化
Arduino.lcdI2CInitialized = false;

// 自动初始化LCD的辅助函数
Arduino.ensureLcdInitialized = function(generator) {
  console.log('ensureLcdInitialized',Arduino.lcdI2CInitialized);
  
  if (!Arduino.lcdI2CInitialized) {
    // 设置默认值
    var defaultAddress = '0x27';
    var defaultCols = '16';
    var defaultRows = '2';
    
    generator.addLibrary('LCD_I2C', '#include <LiquidCrystal_I2C.h>');
    generator.addVariable('lcd_i2c', 'LiquidCrystal_I2C lcd(' + defaultAddress + ', ' + defaultCols + ', ' + defaultRows + ');');
    
    // 添加初始化代码到setup部分
    generator.addSetup('lcd_init', 'lcd.init();\n  lcd.backlight();');
    
    // 标记为已初始化
    // Arduino.lcdI2CInitialized = true;
    return true;
  }
  return false;
};

// LCD initialize
Arduino.forBlock['lcd_i2c_init'] = function(block, generator) {
  var address = block.getFieldValue("ADDRESS") || '0x27';
  var cols = block.getFieldValue("COLS") || '16';
  var rows = block.getFieldValue("ROWS") || '2';
  
  generator.addLibrary('LCD_I2C', '#include <LiquidCrystal_I2C.h>');
  generator.addVariable('lcd_i2c', 'LiquidCrystal_I2C lcd(' + address + ', ' + cols + ', ' + rows + ');');
  
  var code = 'lcd.init();\n';
  code += 'lcd.backlight();\n';
  
  // 标记为已初始化
  Arduino.lcdI2CInitialized = true;
  
  return code;
};

// LCD clear display
Arduino.forBlock['lcd_i2c_clear'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'lcd.clear();\n';
};

// LCD set cursor position
Arduino.forBlock['lcd_i2c_set_cursor'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  var col = generator.valueToCode(block, 'COL', generator.ORDER_ATOMIC) || '0';
  var row = generator.valueToCode(block, 'ROW', generator.ORDER_ATOMIC) || '0';
  
  return 'lcd.setCursor(' + col + ', ' + row + ');\n';
};

// LCD print text at current cursor position
Arduino.forBlock['lcd_i2c_print'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return 'lcd.print(' + text + ');\n';
};

// LCD print text at specified position (combined set cursor and print)
Arduino.forBlock['lcd_i2c_print_position'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  var col = generator.valueToCode(block, 'COL', generator.ORDER_ATOMIC) || '0';
  var row = generator.valueToCode(block, 'ROW', generator.ORDER_ATOMIC) || '0';
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  var code = 'lcd.setCursor(' + col + ', ' + row + ');\n';
  code += 'lcd.print(' + text + ');\n';
  
  return code;
};

// LCD turn backlight on
Arduino.forBlock['lcd_i2c_backlight_on'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'lcd.backlight();\n';
};

// LCD turn backlight off
Arduino.forBlock['lcd_i2c_backlight_off'] = function(block, generator) {
  // 确保LCD已初始化
  Arduino.ensureLcdInitialized(generator);
  return 'lcd.noBacklight();\n';
};