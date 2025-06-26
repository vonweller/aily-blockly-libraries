'use strict';

// SparkFun BMI270 Arduino Library 代码生成器，整合全部IMU操作

function addBMI270CommonBlocks(block, generator) {
  generator.addLibrary('BMI270', '#include <SparkFun_BMI270_Arduino_Library.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addVariable('bmi270_imu', 'BMI270 imu;');
  
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
  console.log('BMI270 Common: 开发板信息:', boardConfig);
  console.log('BMI270 Common: 核心类型:', boardCore);
  console.log('BMI270 Common: 板名:', boardName);
  console.log('BMI270 Common: isArduinoCore:', isArduinoCore);
  console.log('BMI270 Common: isESP32Core:', isESP32Core);
  
  // 不为Arduino核心添加宏定义
  if (!isArduinoCore) {  // 简化判断逻辑，只要不是Arduino就使用宏定义
    var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE2'; // 默认值
    
    if (wireOption === 'WIRE1') {
      // generator.addMacro('SDA_PIN1', '#define SDA_PIN1 8  // Wire1 SDA引脚');
      // generator.addMacro('SCL_PIN1', '#define SCL_PIN1 9  // Wire1 SCL引脚');
    } else { // WIRE2
      generator.addMacro('SDA_PIN2', '#define SDA_PIN2 4  // Wire2 SDA引脚');
      generator.addMacro('SCL_PIN2', '#define SCL_PIN2 5  // Wire2 SCL引脚');
    }
  }
}

// 初始化(I2C)
Arduino.forBlock['bmi270_init_i2c'] = function(block, generator) {
  addBMI270CommonBlocks(block, generator);  // 这会添加库引用和共用代码
  var address = block.getFieldValue('ADDRESS') || 'BMI2_I2C_PRIM_ADDR';
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE2'; // 默认值
  
  // 添加I2C地址变量定义
  generator.addVariable('bmi270_i2c_address', 'uint8_t i2cAddress = ' + address + ';  // 0x68');
  
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
  console.log('BMI270 Init: 开发板信息:', boardConfig);
  console.log('BMI270 Init: 核心类型:', boardCore);
  console.log('BMI270 Init: 板名:', boardName);
  console.log('BMI270 Init: isArduinoCore:', isArduinoCore);
  console.log('BMI270 Init: isESP32Core:', isESP32Core);

  // 初始化Wire与指定的SDA和SCL引脚
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
    // 其他非Arduino核心，使用宏定义
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin(SDA_PIN1, SCL_PIN1);  // 初始化硬件 I2C, Wire1 SDA:8, SCL:9 (其他核心)\n';
    } else { // WIRE2
      code = 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (其他核心)\n';
    }
  }
  code += 'Serial.println("BMI270 Example - Basic Readings I2C");\n\n';
  
  // 添加传感器连接检查代码
  code += '// Check if sensor is connected and initialize\n';
  code += 'while (imu.beginI2C(i2cAddress) != BMI2_OK) {\n';
  code += '  // Not connected, inform user\n';
  code += '  Serial.println("Error: BMI270 not connected, check wiring and I2C address!");\n';
  code += '  delay(1000);  // Wait a bit to see if connection is established\n';
  code += '}\n\n';
  code += 'Serial.println("BMI270 connected!");\n';
  
  return code;
};

// // 初始化(SPI)
// Arduino.forBlock['bmi270_init_spi'] = function(block, generator) {
//   addBMI270CommonBlocks(block, generator);
//   var cs_pin = block.getFieldValue('CS_PIN');
//   var clock_freq = block.getFieldValue('CLOCK_FREQ') || '100000';
//   return 'imu.beginSPI(' + cs_pin + ', ' + clock_freq + ');\n';
// };

// 通用IMU方法
Arduino.forBlock['bmi270_get_sensor_data'] = block => 'imu.getSensorData();\n';
Arduino.forBlock['bmi270_get_accel_data'] = block => ['imu.data.accel' + block.getFieldValue('AXIS'), Arduino.ORDER_ATOMIC];
Arduino.forBlock['bmi270_get_gyro_data'] = block => ['imu.data.gyro' + block.getFieldValue('AXIS'), Arduino.ORDER_ATOMIC];

Arduino.forBlock['bmi270_perform_accel_offset_calibration'] = function(block, generator) {
  var axis = block.getFieldValue('AXIS');
  var axisValue;
  
  // 将X/Y/Z转换为对应的BMI270常量值
  switch (axis) {
    case 'X':
      axisValue = 'BMI2_MAP_X_AXIS';
      break;
    case 'Y':
      axisValue = 'BMI2_MAP_Y_AXIS';
      break;
    case 'Z':
      axisValue = 'BMI2_MAP_Z_AXIS';
      break;
    default:
      axisValue = 'BMI2_MAP_Z_AXIS';
  }
  
  return 'imu.performAccelOffsetCalibration(' + axisValue + ');\n';
};
Arduino.forBlock['bmi270_perform_gyro_offset_calibration'] = () => 'imu.performGyroOffsetCalibration();\n';

