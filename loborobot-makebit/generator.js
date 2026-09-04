// @aily-project/lib-loborobot-makebit
// 创乐博 MakeBit micro:bit V2 扩展板：小车电机（含前进校正）/ 舵机 / 风扇 / 蜂鸣器 /
// RGB 探照灯（预设色 + 自定义色 + 特效 + 开关亮度 + 全局亮度）
// 全局单例模式：所有积木共享全局对象 makebit（MakeBitCar），无 field_variable。

function makebitEnsure(generator) {
  generator.addLibrary('MakeBit', '#include <MakeBit.h>')
  generator.addVariable('makebit', 'MakeBitCar makebit;')
}

var MAKEBIT_CAR_METHODS = {
  FORWARD: 'run',
  BACKWARD: 'backward',
  LEFT: 'turnLeft',
  RIGHT: 'turnRight',
  STOP: 'stop',
  SPIN_LEFT: 'spinLeft',
  SPIN_RIGHT: 'spinRight'
}

Arduino.forBlock['makebit_car_init'] = function (block, generator) {
  makebitEnsure(generator)
  generator.addSetupBegin('makebit_begin', 'makebit.begin();\n')
  return ''
}

Arduino.forBlock['makebit_car_ctrl'] = function (block, generator) {
  makebitEnsure(generator)
  var action = block.getFieldValue('ACTION')
  if (action === 'STOP') {
    return 'makebit.stop();\n'
  }
  var method = MAKEBIT_CAR_METHODS[action] || 'stop'
  return 'makebit.' + method + '(255);\n'
}

Arduino.forBlock['makebit_car_ctrl_speed'] = function (block, generator) {
  makebitEnsure(generator)
  var action = block.getFieldValue('ACTION')
  if (action === 'STOP') {
    return 'makebit.stop();\n'
  }
  var method = MAKEBIT_CAR_METHODS[action] || 'stop'
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '255'
  return 'makebit.' + method + '(' + speed + ');\n'
}

Arduino.forBlock['makebit_motor'] = function (block, generator) {
  makebitEnsure(generator)
  var motor = block.getFieldValue('MOTOR')
  var dir = block.getFieldValue('DIR')
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '255'
  var method
  if (motor === 'RIGHT') {
    method = dir === 'REV' ? 'rightBackward' : 'rightForward'
  } else {
    method = dir === 'REV' ? 'leftBackward' : 'leftForward'
  }
  return 'makebit.' + method + '(' + speed + ');\n'
}

Arduino.forBlock['makebit_car_trim'] = function (block, generator) {
  makebitEnsure(generator)
  // 前进跑偏校正：左右正转输出百分比 0-100（默认100不校正），只影响正转输出
  var left = generator.valueToCode(block, 'LEFT', Arduino.ORDER_ATOMIC) || '100'
  var right = generator.valueToCode(block, 'RIGHT', Arduino.ORDER_ATOMIC) || '100'
  return 'makebit.setForwardTrim(' + left + ', ' + right + ');\n'
}

Arduino.forBlock['makebit_car_servo'] = function (block, generator) {
  makebitEnsure(generator)
  var angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90'
  return 'makebit.servoAngle(' + angle + ');\n'
}

Arduino.forBlock['makebit_car_fan'] = function (block, generator) {
  makebitEnsure(generator)
  var dir = block.getFieldValue('FANDIR')
  if (dir === 'STOP') {
    return 'makebit.fanStop();\n'
  }
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '255'
  return 'makebit.' + (dir === 'REV' ? 'fanBackward' : 'fanForward') + '(' + speed + ');\n'
}

var MAKEBIT_COLORS = {
  OFF: 'MAKEBIT_COLOR_OFF',
  RED: 'MAKEBIT_COLOR_RED',
  GREEN: 'MAKEBIT_COLOR_GREEN',
  BLUE: 'MAKEBIT_COLOR_BLUE',
  WHITE: 'MAKEBIT_COLOR_WHITE',
  CYAN: 'MAKEBIT_COLOR_CYAN',
  MAGENTA: 'MAKEBIT_COLOR_MAGENTA',
  YELLOW: 'MAKEBIT_COLOR_YELLOW'
}

var MAKEBIT_EFFECTS = {
  FLOW: 'MAKEBIT_EFFECT_FLOW',
  RAINBOW: 'MAKEBIT_EFFECT_RAINBOW',
  BREATH: 'MAKEBIT_EFFECT_BREATH',
  BLINK: 'MAKEBIT_EFFECT_BLINK',
  OFF: 'MAKEBIT_EFFECT_OFF'
}

Arduino.forBlock['makebit_car_rgb'] = function (block, generator) {
  makebitEnsure(generator)
  var color = MAKEBIT_COLORS[block.getFieldValue('COLOR')] || 'MAKEBIT_COLOR_OFF'
  return 'makebit.setRgbColor(' + color + ');\n'
}

Arduino.forBlock['makebit_car_rgb_val'] = function (block, generator) {
  makebitEnsure(generator)
  var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0'
  var g = generator.valueToCode(block, 'G', Arduino.ORDER_ATOMIC) || '0'
  var b = generator.valueToCode(block, 'B', Arduino.ORDER_ATOMIC) || '0'
  return 'makebit.setRgb(' + r + ', ' + g + ', ' + b + ');\n'
}

Arduino.forBlock['makebit_rgb_effect'] = function (block, generator) {
  makebitEnsure(generator)
  var effect = MAKEBIT_EFFECTS[block.getFieldValue('EFFECT')] || 'MAKEBIT_EFFECT_OFF'
  return 'makebit.rgbEffect(' + effect + ');\n'
}

Arduino.forBlock['makebit_rgb_brightness'] = function (block, generator) {
  makebitEnsure(generator)
  // 全部探照灯输出的全局亮度 0-255（默认255全亮）：预设色、特效、亮灭白光与自定义RGB均受影响
  var brightness = generator.valueToCode(block, 'BRIGHTNESS', Arduino.ORDER_ATOMIC) || '255'
  return 'makebit.setRgbBrightness(' + brightness + ');\n'
}

Arduino.forBlock['makebit_buzzer'] = function (block, generator) {
  makebitEnsure(generator)
  var pin = block.getFieldValue('PIN')
  var state = block.getFieldValue('STATE') === 'OFF' ? 'false' : 'true'
  return 'makebit.buzzerWrite(' + pin + ', ' + state + ');\n'
}

Arduino.forBlock['makebit_car_led'] = function (block, generator) {
  makebitEnsure(generator)
  // 探照灯开关：亮=白色预设色（经 setRgbScaled_ 受全局亮度缩放），灭=熄灭
  if (block.getFieldValue('STATE') === 'OFF') {
    return 'makebit.setRgb(0, 0, 0);\n'
  }
  return 'makebit.setRgbColor(MAKEBIT_COLOR_WHITE);\n'
}

Arduino.forBlock['makebit_ultrasonic'] = function (block, generator) {
  makebitEnsure(generator)
  var trig = block.getFieldValue('TRIG')
  var echo = block.getFieldValue('ECHO')
  return ['makebit.ultrasonic(' + trig + ', ' + echo + ')', Arduino.ORDER_ATOMIC]
}
