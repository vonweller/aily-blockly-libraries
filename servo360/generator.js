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


// 控制伺服电机角度
Arduino.forBlock['servo360_write'] = function (block, generator) {
  // 获取角度值和伺服对象名称
  const angle = block.getFieldValue('ANGLE') || '90';
  const servoName = getVariableName(block);

  // 添加必要的库引用和对象创建
  generator.addLibrary('servo_include', '#include <Servo.h>');
  generator.addVariable('servo_' + servoName, 'Servo ' + servoName + ';');

  // 生成控制伺服电机角度的代码
  return servoName + '.write(' + angle + ');\n';
};