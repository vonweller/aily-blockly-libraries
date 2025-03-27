/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Servo库代码生成器
 */


function getVariableName(block) {
  const variableField = block.getField('OBJECT');
  const variableModel = variableField.getVariable();
  console.log("name: ", variableModel.name);
  return variableModel.name;
}

// 伺服电机初始化/连接
Arduino.forBlock['servo_attach'] = function (block, generator) {
  // 获取引脚号和伺服对象名称
  const pin = block.getFieldValue('PIN') || '9';
  const servoName = getVariableName(block);

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 在setup部分添加伺服电机连接代码
  generator.addSetup('servo_' + servoName + '_attach', servoName + '.attach(' + pin + ');');

  return ''; // 此块不生成循环内的代码
};

// 控制伺服电机角度
Arduino.forBlock['servo_write'] = function (block, generator) {
  // 获取角度值和伺服对象名称
  const angle = block.getFieldValue('ANGLE') || '90';
  const servoName = getVariableName(block);

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 生成控制伺服电机角度的代码
  return servoName + '.write(' + angle + ');\n';
};

// 读取伺服电机当前角度
Arduino.forBlock['servo_read'] = function (block, generator) {
  const servoName = getVariableName(block);
  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');
  return [servoName + '.read()', generator.ORDER_ATOMIC];
};

// 简化使用的组合块 - 直接设置指定引脚上的伺服电机角度
Arduino.forBlock['servo_write_pin'] = function (block, generator) {
  // 获取引脚号、角度值和伺服对象名称
  const pin = block.getFieldValue('PIN') || '9';
  const angle = block.getFieldValue('ANGLE') || '90';

  const servoName = getVariableName(block);

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 在setup部分添加伺服电机连接代码
  generator.addSetup('servo_' + servoName + '_attach', servoName + '.attach(' + pin + ');');

  // 生成控制伺服电机角度的代码
  return servoName + '.write(' + angle + ');\n';
};

// 从电位器控制伺服电机
Arduino.forBlock['servo_potentiometer'] = function (block, generator) {
  // 获取伺服电机引脚和电位器引脚
  const servoPin = block.getFieldValue("SERVO_PIN") || '9';
  const potPin = block.getFieldValue("POT_PIN") || 'A0';
  const servoName = getVariableName(block);

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 在setup部分添加伺服电机连接代码
  generator.addSetup('servo_' + servoName + '_attach', servoName + '.attach(' + servoPin + ');');

  // 生成读取电位器并控制伺服电机的代码
  let code = '';
  code += 'int potValue = analogRead(' + potPin + ');\n';
  code += 'int angle = map(potValue, 0, 1023, 0, 180);\n';
  code += servoName + '.write(angle);\n';
  code += 'delay(15);\n';

  return code;
};

// 断开伺服电机连接
Arduino.forBlock['servo_detach'] = function (block, generator) {
  const servoName = getVariableName(block);
  return servoName + '.detach();\n';
};

// 以微秒为单位控制伺服电机
Arduino.forBlock['servo_write_microseconds'] = function (block, generator) {
  // 获取微秒值和伺服对象名称
  const servoName = getVariableName(block);
  const microseconds = block.getFieldValue("MICROSECONDS") || '1500';

  // 生成以微秒为单位控制伺服电机的代码
  return servoName + '.writeMicroseconds(' + microseconds + ');\n';
};

// 读取伺服电机当前微秒值
Arduino.forBlock['servo_read_microseconds'] = function (block, generator) {
  const servoName = getVariableName(block);
  return [servoName + '.readMicroseconds()', generator.ORDER_ATOMIC];
};

// 检查伺服电机是否已连接
Arduino.forBlock['servo_attached'] = function (block, generator) {
  const servoName = getVariableName(block);
  return [servoName + '.attached()', generator.ORDER_ATOMIC];
};

// 多个伺服电机使用 - 创建伺服电机对象
Arduino.forBlock['servo_create'] = function (block, generator) {
  // 获取伺服电机名称
  const servoName = getVariableName(block);

  // 添加必要的库引用
  generator.addLibrary('servo_include', '#include <Servo.h>');

  // 创建命名的伺服电机对象
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  return ''; // 此块不生成循环内的代码
};

// 多个伺服电机使用 - 连接指定名称的伺服电机
Arduino.forBlock['servo_named_attach'] = function (block, generator) {
  // 获取伺服电机名称和引脚号
  const servoName = getVariableName(block);
  const pin = block.getFieldValue('PIN') || '9';

  // 在setup部分添加伺服电机连接代码
  generator.addSetup('servo_' + servoName + '_attach', servoName + '.attach(' + pin + ');');

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  return ''; // 此块不生成循环内的代码
};

// 多个伺服电机使用 - 控制指定名称的伺服电机角度
Arduino.forBlock['servo_named_write'] = function (block, generator) {
  // 获取伺服电机名称和角度值
  const servoName = getVariableName(block);
  const angle = block.getFieldValue('ANGLE') || '90';

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 生成控制伺服电机角度的代码
  return servoName + '.write(' + angle + ');\n';
};