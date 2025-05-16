'use strict';

// SparkFun BMI270 Arduino Library 代码生成器，整合全部IMU操作

function addBMI270CommonBlocks(block, generator) {
  generator.addLibrary('BMI270', '#include <SparkFun_BMI270_Arduino_Library.h>');
  generator.addVariable('bmi270_imu', 'BMI270 imu;');
}

// 初始化(I2C)
Arduino.forBlock['bmi270_init_i2c'] = function(block, generator) {
  addBMI270CommonBlocks(block, generator);
  var address = block.getFieldValue('ADDRESS') || 'BMI2_I2C_PRIM_ADDR';
  return 'imu.beginI2C(' + address + ');\n';
};

// 初始化(SPI)
Arduino.forBlock['bmi270_init_spi'] = function(block, generator) {
  addBMI270CommonBlocks(block, generator);
  var cs_pin = block.getFieldValue('CS_PIN');
  var clock_freq = block.getFieldValue('CLOCK_FREQ') || '100000';
  return 'imu.beginSPI(' + cs_pin + ', ' + clock_freq + ');\n';
};

// 通用IMU方法
Arduino.forBlock['bmi270_get_sensor_data'] = block => 'imu.getSensorData();\n';
Arduino.forBlock['bmi270_get_accel_data'] = block => ['imu.data.accel' + block.getFieldValue('AXIS'), Arduino.ORDER_ATOMIC];
Arduino.forBlock['bmi270_get_gyro_data'] = block => ['imu.data.gyro' + block.getFieldValue('AXIS'), Arduino.ORDER_ATOMIC];
Arduino.forBlock['bmi270_set_accel_odr'] = block => 'imu.setAccelODR(' + block.getFieldValue('RATE') + ');\n';
Arduino.forBlock['bmi270_set_gyro_odr'] = block => 'imu.setGyroODR(' + block.getFieldValue('RATE') + ');\n';
Arduino.forBlock['bmi270_set_accel_power_mode'] = block => 'imu.setAccelPowerMode(' + block.getFieldValue('MODE') + ');\n';
Arduino.forBlock['bmi270_set_gyro_power_mode'] = block => 'imu.setGyroPowerMode(' + block.getFieldValue('MODE1') + ', ' + block.getFieldValue('MODE2') + ');\n';
Arduino.forBlock['bmi270_enable_advanced_power_save'] = () => 'imu.enableAdvancedPowerSave();\n';
Arduino.forBlock['bmi270_disable_advanced_power_save'] = () => 'imu.disableAdvancedPowerSave();\n';
Arduino.forBlock['bmi270_set_config'] = block => 'imu.setConfig(' + block.getFieldValue('CONFIG') + ');\n';
Arduino.forBlock['bmi270_enable_feature'] = block => 'imu.enableFeature(' + block.getFieldValue('FEATURE') + ');\n';
Arduino.forBlock['bmi270_disable_feature'] = block => 'imu.disableFeature(' + block.getFieldValue('FEATURE') + ');\n';
Arduino.forBlock['bmi270_map_interrupt_to_pin'] = block => 'imu.mapInterruptToPin(' + block.getFieldValue('INTERRUPT_TYPE') + ', ' + block.getFieldValue('PIN') + ');\n';
Arduino.forBlock['bmi270_set_interrupt_pin_config'] = block => 'imu.setInterruptPinConfig(' + block.getFieldValue('PIN_CONFIG') + ');\n';
Arduino.forBlock['bmi270_get_interrupt_status'] = block => 'imu.getInterruptStatus(&' + block.getFieldValue('STATUS') + ');\n';
Arduino.forBlock['bmi270_set_fifo_config'] = block => 'imu.setFIFOConfig(' + block.getFieldValue('FIFO_CONFIG') + ');\n';
Arduino.forBlock['bmi270_get_fifo_length'] = block => 'imu.getFIFOLength(&' + block.getFieldValue('LENGTH') + ');\n';
Arduino.forBlock['bmi270_get_fifo_data'] = block => 'imu.getFIFOData(' + block.getFieldValue('BUFFER') + ', &' + block.getFieldValue('SAMPLES') + ');\n';
Arduino.forBlock['bmi270_flush_fifo'] = () => 'imu.flushFIFO();\n';
Arduino.forBlock['bmi270_set_step_count_watermark'] = block => 'imu.setStepCountWatermark(' + block.getFieldValue('WATERMARK') + ');\n';
Arduino.forBlock['bmi270_get_step_count'] = block => 'imu.getStepCount(&' + block.getFieldValue('COUNT') + ');\n';
Arduino.forBlock['bmi270_get_step_activity'] = block => 'imu.getStepActivity(&' + block.getFieldValue('ACTIVITY') + ');\n';
Arduino.forBlock['bmi270_reset_step_count'] = () => 'imu.resetStepCount();\n';
Arduino.forBlock['bmi270_get_wrist_gesture'] = block => 'imu.getWristGesture(&' + block.getFieldValue('GESTURE') + ');\n';
Arduino.forBlock['bmi270_remap_axes'] = block => 'imu.remapAxes(' + block.getFieldValue('REMAP') + ');\n';
Arduino.forBlock['bmi270_perform_component_retrim'] = () => 'imu.performComponentRetrim();\n';
Arduino.forBlock['bmi270_perform_accel_offset_calibration'] = block => 'imu.performAccelOffsetCalibration(' + block.getFieldValue('AXIS') + ');\n';
Arduino.forBlock['bmi270_perform_gyro_offset_calibration'] = () => 'imu.performGyroOffsetCalibration();\n';
Arduino.forBlock['bmi270_save_nvm'] = () => 'imu.saveNVM();\n';
Arduino.forBlock['bmi270_self_test'] = () => 'imu.selfTest();\n';
Arduino.forBlock['bmi270_enable_aux'] = () => 'imu.enableFeature(BMI2_AUX);\n';
Arduino.forBlock['bmi270_set_aux_pullups'] = block => 'imu.setAuxPullUps(' + block.getFieldValue('PULLUP') + ');\n';
Arduino.forBlock['bmi270_read_aux'] = block => 'imu.readAux(' + block.getFieldValue('REG') + ', ' + block.getFieldValue('LEN') + ');\n';
Arduino.forBlock['bmi270_write_aux'] = block => 'imu.writeAux(' + block.getFieldValue('REG') + ', ' + block.getFieldValue('VALUE') + ');\n';
Arduino.forBlock['bmi270_get_status'] = block => 'imu.getStatus(&' + block.getFieldValue('STATUS') + ');\n';
