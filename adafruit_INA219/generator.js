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
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE2'; // 默认值
  
  // 添加必要的库
  generator.addLibrary('adafruit_ina219', '#include <Adafruit_INA219.h>');
  generator.addLibrary('wire', '#include <Wire.h>');
  
  // 添加变量定义
  generator.addVariable(v, 'Adafruit_INA219 '+v+';');
  
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型 (更可靠的检测方法)
  var isArduinoCore = boardCore.indexOf('arduino') > -1 || 
                     boardName.indexOf('arduino') > -1 || 
                     boardName.indexOf('uno') > -1 || 
                     boardName.indexOf('nano') > -1 || 
                     boardName.indexOf('mega') > -1;
                     
  var isESP32Core = boardCore.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp') > -1;
  
  // 调试信息
  console.log('INA219: 开发板信息:', boardConfig);
  console.log('INA219: 核心类型:', boardCore);
  console.log('INA219: 板名:', boardName);
  console.log('INA219: isArduinoCore:', isArduinoCore);
  console.log('INA219: isESP32Core:', isESP32Core);
  
  // 不为Arduino核心添加宏定义
  if (!isArduinoCore) {  // 简化判断逻辑，只要不是Arduino就添加宏
    if (wireOption === 'WIRE1') {
      // generator.addMacro('SDA_PIN1', '#define SDA_PIN1 8  // Wire1 SDA引脚');
      // generator.addMacro('SCL_PIN1', '#define SCL_PIN1 9  // Wire1 SCL引脚');
    } else { // WIRE2
      generator.addMacro('SDA_PIN2', '#define SDA_PIN2 4  // Wire2 SDA引脚');
      generator.addMacro('SCL_PIN2', '#define SCL_PIN2 5  // Wire2 SCL引脚');
    }
  }
  
  // 返回初始化代码
  var code = '';
  if (isArduinoCore) {
    // Arduino核心只需要简单的Wire.begin()
    code = 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n' + v + '.begin();\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin();  // 初始化硬件 I2C, Wire1 (ESP32核心)\n' + v + '.begin();\n';
    } else { // WIRE2
      code = 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (ESP32核心)\n' + v + '.begin();\n';
    }
  } else {
    // 其他非Arduino核心，使用宏定义
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin(SDA_PIN1, SCL_PIN1);  // 初始化硬件 I2C, Wire1 SDA:8, SCL:9 (其他核心)\n' + v + '.begin();\n';
    } else { // WIRE2
      code = 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (其他核心)\n' + v + '.begin();\n';
    }
  }
  return code;
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
