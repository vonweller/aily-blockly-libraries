'use strict';

// SparkFun BMI270 Arduino Library 代码生成器，整合全部IMU操作

function addBMI270CommonBlocks(block, generator) {
  generator.addLibrary('BMI270', '#include <SparkFun_BMI270_Arduino_Library.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addVariable('bmi270_imu', 'BMI270 imu;');
  
  // 添加I2C引脚宏定义
  generator.addMacro('SDA_PIN', '#define SDA_PIN 4  // ESP32-S3 的默认 SDA 引脚');
  generator.addMacro('SCL_PIN', '#define SCL_PIN 5  // ESP32-S3 的默认 SCL 引脚');
}

// 初始化(I2C)
Arduino.forBlock['bmi270_init_i2c'] = function(block, generator) {
  addBMI270CommonBlocks(block, generator);
  var address = block.getFieldValue('ADDRESS') || 'BMI2_I2C_PRIM_ADDR';
  
  // 添加I2C地址变量定义
  generator.addVariable('bmi270_i2c_address', 'uint8_t i2cAddress = ' + address + ';  // 0x68');
  
  // 初始化Wire与指定的SDA和SCL引脚
  var code = 'Wire.begin(SDA_PIN, SCL_PIN);  // 初始化硬件 I2C\n';
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

