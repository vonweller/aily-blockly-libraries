// 注册 VL53L0X 扩展 - 根据板子类型决定是否显示 I2C 引脚选择
// 避免重复加载
if (Blockly.Extensions.isRegistered('vl53l0x_begin_extension')) {
  Blockly.Extensions.unregister('vl53l0x_begin_extension');
}

Blockly.Extensions.register('vl53l0x_begin_extension', function() {
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

Arduino.forBlock['vl53l0x_config_i2c'] = function(block, generator) {
  var wireOption = block.getFieldValue('WIRE_OPTION');
  
  // 添加Wire库
  generator.addLibrary('Wire', '#include <Wire.h>');
  
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
  console.log('VL53L0X Config: 开发板信息:', boardConfig);
  console.log('VL53L0X Config: 核心类型:', boardCore);
  console.log('VL53L0X Config: 板名:', boardName);
  console.log('VL53L0X Config: isArduinoCore:', isArduinoCore);
  console.log('VL53L0X Config: isESP32Core:', isESP32Core);
  
  // 不为Arduino核心添加宏定义
  if (!isArduinoCore) {  // 简化判断逻辑，只要不是Arduino就添加宏
    if (wireOption === 'WIRE2') {
      generator.addMacro('SDA_PIN2', '#define SDA_PIN2 4  // Wire2 SDA引脚');
      generator.addMacro('SCL_PIN2', '#define SCL_PIN2 5  // Wire2 SCL引脚');
    } else { 
      
    }
  }
  
  // 初始化I2C总线
  var code = '';
  if (isArduinoCore) {
    // Arduino核心只需要简单的Wire.begin()
    code = 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin();  // 初始化硬件 I2C, Wire1 (ESP32核心)\n';
    } else { // WIRE2
      code = 'Wire.begin(4, 5);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (ESP32核心)\n';
    }
  } else {
    // 其他非Arduino核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin(SDA_PIN1, SCL_PIN1);  // 初始化硬件 I2C, Wire1 SDA:8, SCL:9 (其他核心)\n';
    } else { // WIRE2
      code = 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (其他核心)\n';
    }
  }
  return code;
};

Arduino.forBlock['vl53l0x_begin'] = function(block, generator) {
  // 使用指定的变量名
  var sensorVarName = Arduino.nameDB_.getName(block.getFieldValue('SENSOR'), 'VARIABLE') || 'sensor';
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE_4_5'; // 默认值
  
  // 添加Wire库和VL53L0X库
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_VL53L0X', '#include <Adafruit_VL53L0X.h>');
  generator.addObject(sensorVarName, 'Adafruit_VL53L0X ' + sensorVarName + ';');
  
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
  console.log('VL53L0X Begin: 开发板信息:', boardConfig);
  console.log('VL53L0X Begin: 核心类型:', boardCore);
  console.log('VL53L0X Begin: 板名:', boardName);
  console.log('VL53L0X Begin: isArduinoCore:', isArduinoCore);
  console.log('VL53L0X Begin: isESP32Core:', isESP32Core);
  
  // 初始化I2C总线
  var code = '// 配置I2C引脚并初始化VL53L0X传感器\n';
  
  if (isArduinoCore) {
    // Arduino核心固定使用 SDA:4, SCL:5
    code += 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    switch (wireOption) {
      case 'WIRE_DEFAULT':
        // Wire2 使用 SDA:8, SCL:9，不需要指定引脚
        code += 'Wire.begin();  // 初始化硬件 I2C，Wire2 (ESP32核心)\n\n';
        break;
      case 'WIRE_4_5':
      default:
        // Wire1 使用 SDA:4, SCL:5
        code += 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5 (ESP32核心)\n\n';
        break;
    }
  } else {
    // 其他非Arduino核心，默认使用 SDA:4, SCL:5
    code += 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5\n\n';
  }
  
  // 初始化传感器并检查连接
  code += 'if (!' + sensorVarName + '.begin()) {\n';
  code += '  Serial.println("传感器初始化失败！请检查连接。");\n';
  code += '  while (1); // 初始化失败，停止程序\n';
  code += '}\n\n';
  code += 'Serial.println("传感器初始化成功！");\n';
  return code;
};

// Arduino.forBlock['vl53l0x_read_distance'] = function(block, generator) {
//   // 使用固定的变量名避免乱码
//   var sensorVarName = 'sensor';
  
//   // 读取距离
//   var code = sensorVarName + '.readRange()';
//   return [code, Arduino.ORDER_FUNCTION_CALL];
// };

Arduino.forBlock['vl53l0x_ranging_test'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var measureVarName = 'measure';
  
  // 添加测量结果变量 - 放在loop函数开始部分而不是全局区域
  generator.addLoopBegin(measureVarName, 'VL53L0X_RangingMeasurementData_t ' + measureVarName + ';');
  
  // 进行测量
  var code = '// 获取距离数据（单位：毫米）\n';
  code += sensorVarName + '.rangingTest(&' + measureVarName + ', false);  // 进行一次测量\n';
  return code;
};

Arduino.forBlock['vl53l0x_check_range_valid'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 检查测量结果是否有效
  var code = measureVarName + '.RangeStatus != 4';
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['vl53l0x_get_range_mm'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 获取距离值
  var code = measureVarName + '.RangeMilliMeter';
  return [code, Arduino.ORDER_MEMBER];
};