// Generator.js: Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 integration

/**
 * Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 生成器统一处理
 */

function simpleMethod(block, generator, field, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  return n + '.' + method + '();\n';
}

function singleParam(block, generator, field, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var v = generator.valueToCode(block, field, Arduino.ORDER_ATOMIC);
  return n + '.' + method + '(' + v + ');\n';
}

function doubleParam(block, generator, field1, field2, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var v1 = generator.valueToCode(block, field1, Arduino.ORDER_COMMA);
  var v2 = generator.valueToCode(block, field2, Arduino.ORDER_COMMA);
  return n + '.' + method + '(' + v1 + ', ' + v2 + ');\n';
}





// Adafruit_INA219
Arduino.forBlock['ina219_create_and_begin'] = function(block, generator) {
  var v = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  
  // 添加必要的库
  generator.addLibrary('adafruit_ina219', '#include <Adafruit_INA219.h>');
  generator.addLibrary('wire', '#include <Wire.h>');
  
  // 添加I2C引脚宏定义
  generator.addMacro('SDA_PIN', '#define SDA_PIN 4  // ESP32-S3 的SDA引脚');
  generator.addMacro('SCL_PIN', '#define SCL_PIN 5  // ESP32-S3 的SCL引脚');
  
  // 添加变量定义
  generator.addVariable(v, 'Adafruit_INA219 '+v+';');
  
  // 返回初始化代码
  return 'Wire.begin(SDA_PIN, SCL_PIN);\n' + v + '.begin();\n';
};

// 带下拉选项的读取值块
Arduino.forBlock['ina219_read_value'] = function(block, generator) {
  var v = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var type = block.getFieldValue('TYPE');
  
  // 根据下拉选项返回不同的函数调用
  switch(type) {
    case 'BUS_VOLTAGE':
      return [v + '.getBusVoltage_V()', Arduino.ORDER_FUNCTION_CALL];
    case 'SHUNT_VOLTAGE':
      return [v + '.getShuntVoltage_mV()', Arduino.ORDER_FUNCTION_CALL];
    case 'CURRENT':
      return [v + '.getCurrent_mA()', Arduino.ORDER_FUNCTION_CALL];
    case 'POWER':
      return [v + '.getPower_mW()', Arduino.ORDER_FUNCTION_CALL];
    default:
      return [v + '.getBusVoltage_V()', Arduino.ORDER_FUNCTION_CALL];
  }
};
