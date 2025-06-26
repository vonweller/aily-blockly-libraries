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
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE2'; // 默认值
  
  // 添加Wire库和VL53L0X库
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_VL53L0X', '#include <Adafruit_VL53L0X.h>');
  generator.addObject(sensorVarName, 'Adafruit_VL53L0X ' + sensorVarName + ' = Adafruit_VL53L0X();');
  
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
  console.log('VL53L0X Begin: 开发板信息:', boardConfig);
  console.log('VL53L0X Begin: 核心类型:', boardCore);
  console.log('VL53L0X Begin: 板名:', boardName);
  console.log('VL53L0X Begin: isArduinoCore:', isArduinoCore);
  console.log('VL53L0X Begin: isESP32Core:', isESP32Core);
  
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
  
  // 初始化I2C总线
  var code = '// 配置I2C引脚并初始化VL53L0X传感器\n';
  
  if (isArduinoCore) {
    // Arduino核心只需要简单的Wire.begin()
    code += 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code += 'Wire.begin();  // 初始化硬件 I2C, Wire1 (ESP32核心)\n\n';
    } else { // WIRE2
      code += 'Wire.begin(4, 5);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (ESP32核心)\n\n';
    }
  } else {
    // 其他非Arduino核心，使用宏定义
    if (wireOption === 'WIRE1') {
      code += 'Wire.begin(SDA_PIN1, SCL_PIN1);  // 初始化硬件 I2C, Wire1 SDA:8, SCL:9 (其他核心)\n\n';
    } else { // WIRE2
      code += 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (其他核心)\n\n';
    }
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