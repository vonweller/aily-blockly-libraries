// SparkFun TB6612 Motor Driver Library - Combined Generator

Arduino.forBlock['tb6612_motor_init'] = function(block, generator) {
  generator.addLibrary('SparkFun_TB6612', '#include <SparkFun_TB6612.h>');
  var pin1 = generator.valueToCode(block, 'PIN1', Arduino.ORDER_ATOMIC);
  var pin2 = generator.valueToCode(block, 'PIN2', Arduino.ORDER_ATOMIC);
  var pwmPin = generator.valueToCode(block, 'PWM_PIN', Arduino.ORDER_ATOMIC);
  var offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC);
  var stbyPin = generator.valueToCode(block, 'STBY_PIN', Arduino.ORDER_ATOMIC);

  const motorName = Arduino.nameDB_.getName(
    block.getFieldValue('MOTOR_NAME'),
    "VARIABLE"
  );
  
  generator.addVariable(motorName, 'Motor ' + motorName + '(' + pin1 + ', ' + pin2 + ', ' + pwmPin + ', ' + offset + ', ' + stbyPin + ');');
  return '';
};

// Drive, brake, and dual-motor action (forward/back/left/right/brake)
Arduino.forBlock['tb6612_drive'] = function(block, generator) {
  var motorName = block.getFieldValue('MOTOR_NAME');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  var duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC);
  if (duration && duration !== '0') {
    return motorName + '.drive(' + speed + ', ' + duration + ');\n';
  } else {
    return motorName + '.drive(' + speed + ');\n';
  }
};

Arduino.forBlock['tb6612_brake'] = function(block, generator) {
  var motorName = block.getFieldValue('MOTOR_NAME');
  return motorName + '.brake();\n';
};

Arduino.forBlock['tb6612_dual_action'] = function(block, generator) {
  var mode = block.getFieldValue('MODE'); // 'forward', 'back', 'left', 'right', 'brake'
  var m1 = block.getFieldValue('MOTOR1');
  var m2 = block.getFieldValue('MOTOR2');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  // For left/right use different field names if needed
  var mL = block.getFieldValue('LEFT_MOTOR');
  var mR = block.getFieldValue('RIGHT_MOTOR');
  switch (mode) {
    case 'forward':
      if (speed && speed !== '255') return 'forward(' + m1 + ', ' + m2 + ', ' + speed + ');\n';
      else return 'forward(' + m1 + ', ' + m2 + ');\n';
    case 'back':
      if (speed && speed !== '255') return 'back(' + m1 + ', ' + m2 + ', ' + speed + ');\n';
      else return 'back(' + m1 + ', ' + m2 + ');\n';
    case 'left':
      return 'left(' + mL + ', ' + mR + ', ' + speed + ');\n';
    case 'right':
      return 'right(' + mL + ', ' + mR + ', ' + speed + ');\n';
    case 'brake':
      return 'brake(' + m1 + ', ' + m2 + ');\n';
    default:
      return '';
  }
};

// 兼容原有结构
Arduino.forBlock['tb6612_forward'] = function(block, generator) {
  var motor1 = block.getFieldValue('MOTOR1');
  var motor2 = block.getFieldValue('MOTOR2');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  if (speed && speed !== '255') {
    return 'forward(' + motor1 + ', ' + motor2 + ', ' + speed + ');\n';
  } else {
    return 'forward(' + motor1 + ', ' + motor2 + ');\n';
  }
};
Arduino.forBlock['tb6612_back'] = function(block, generator) {
  var motor1 = block.getFieldValue('MOTOR1');
  var motor2 = block.getFieldValue('MOTOR2');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  if (speed && speed !== '255') {
    return 'back(' + motor1 + ', ' + motor2 + ', ' + speed + ');\n';
  } else {
    return 'back(' + motor1 + ', ' + motor2 + ');\n';
  }
};
Arduino.forBlock['tb6612_left'] = function(block, generator) {
  var leftMotor = block.getFieldValue('LEFT_MOTOR');
  var rightMotor = block.getFieldValue('RIGHT_MOTOR');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  return 'left(' + leftMotor + ', ' + rightMotor + ', ' + speed + ');\n';
};
Arduino.forBlock['tb6612_right'] = function(block, generator) {
  var leftMotor = block.getFieldValue('LEFT_MOTOR');
  var rightMotor = block.getFieldValue('RIGHT_MOTOR');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC);
  return 'right(' + leftMotor + ', ' + rightMotor + ', ' + speed + ');\n';
};
Arduino.forBlock['tb6612_brake_both'] = function(block, generator) {
  var motor1 = block.getFieldValue('MOTOR1');
  var motor2 = block.getFieldValue('MOTOR2');
  return 'brake(' + motor1 + ', ' + motor2 + ');\n';
};
