// ESP32舵机库的代码生成器

Arduino.forBlock['esp32_servo_attach'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  const dropdown_pin = block.getFieldValue('PIN');
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成连接代码
  const code = `${variable_object}.attach(${dropdown_pin});\n`;
  return code;
};

Arduino.forBlock['esp32_servo_write'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  const value_angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成写入角度代码
  const code = `${variable_object}.write(${value_angle});\n`;
  return code;
};

Arduino.forBlock['esp32_servo_write_microseconds'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  const value_microseconds = generator.valueToCode(block, 'MICROSECONDS', generator.ORDER_ATOMIC) || '1500';
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成写入脉宽代码
  const code = `${variable_object}.writeMicroseconds(${value_microseconds});\n`;
  return code;
};

Arduino.forBlock['esp32_servo_read'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成读取角度代码
  const code = `${variable_object}.read()`;
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_servo_read_microseconds'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成读取脉宽代码
  const code = `${variable_object}.readMicroseconds()`;
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_servo_detach'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成断开连接代码
  const code = `${variable_object}.detach();\n`;
  return code;
};

Arduino.forBlock['esp32_servo_attached'] = function(block, generator) {
  const variable_object = generator.getVariableName(block.getFieldValue('OBJECT'));
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 添加对象声明
  generator.addObject(`Servo ${variable_object}`, `Servo ${variable_object};`);
  
  // 生成检查连接状态代码
  const code = `${variable_object}.attached()`;
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_servo_simple_write'] = function(block, generator) {
  const dropdown_pin = block.getFieldValue('PIN');
  const value_angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  // 添加库引用
  generator.addLibrary('#include <ESP32Servo.h>', '#include <ESP32Servo.h>');
  
  // 为每个引脚创建一个舵机对象
  const servo_var = `servo_pin_${dropdown_pin}`;
  generator.addObject(`Servo ${servo_var}`, `Servo ${servo_var};`);
  
  // 在setup中添加attach代码
  generator.addSetup(`servo_pin_${dropdown_pin}_attach`, `${servo_var}.attach(${dropdown_pin});`);
  
  // 生成写入角度代码
  const code = `${servo_var}.write(${value_angle});\n`;
  return code;
}; 