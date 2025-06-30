// Generator.js: Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 integration

/**
 * Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 生成器统一处理
 */

// 注册 INA219 扩展 - 根据板子类型决定是否显示 I2C 引脚选择
// 避免重复加载
if (Blockly.Extensions.isRegistered('ina219_create_extension')) {
  Blockly.Extensions.unregister('ina219_create_extension');
}

Blockly.Extensions.register('ina219_create_extension', function() {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断是否为 ESP32 系列
  var isESP32 = boardCore.indexOf('esp32') > -1 || 
                boardName.indexOf('esp32') > -1;
  
  // 获取 input_dummy 的引用
  var dummyInput = this.getInput('I2C_PINS');
  
  if (isESP32) {
    // 对于 ESP32，添加 I2C 引脚选择下拉菜单
    dummyInput.appendField('使用');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Wire1 (SDA:4, SCL:5)', 'WIRE_4_5'],
      ['Wire2 (SDA:8, SCL:9)', 'WIRE_DEFAULT']
    ]), 'WIRE_OPTION');
  } else {
    // 对于 Arduino，使用默认引脚 SDA:4, SCL:5，不可选择
    dummyInput.appendField('使用 Wire (SDA:4, SCL:5)');
    
    // 添加一个不可见的字段，以便在生成器中使用
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable('WIRE_4_5'), 'WIRE_OPTION')
      .setVisible(false);
  }
});

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
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE_4_5'; // 默认值
  
  // 添加必要的库
  generator.addLibrary('adafruit_ina219', '#include <Adafruit_INA219.h>');
  generator.addLibrary('wire', '#include <Wire.h>');
  
  // 添加变量定义
  generator.addVariable(v, 'Adafruit_INA219 '+v+';');
  
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型
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
  
  // 返回初始化代码
  var code = '';
  
  if (isArduinoCore) {
    // Arduino核心固定使用 SDA:4, SCL:5
    code = 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n' + v + '.begin();\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    switch (wireOption) {
      case 'WIRE_DEFAULT':
        // Wire2 使用 SDA:8, SCL:9，不需要指定引脚
        code = 'Wire.begin();  // 初始化硬件 I2C，Wire2 (ESP32核心)\n' + v + '.begin();\n';
        break;
      case 'WIRE_4_5':
      default:
        // Wire1 使用 SDA:4, SCL:5
        code = 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5 (ESP32核心)\n' + v + '.begin();\n';
        break;
    }
  } else {
    // 其他非Arduino核心，默认与ESP32相同
    code = 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5\n' + v + '.begin();\n';
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
