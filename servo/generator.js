Arduino.forBlock['servo_attach'] = function (block) {
    var pin = Arduino.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
    var angle = Arduino.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC);
    var code = 'servo.attach(' + pin + ');\n';
    return code;
}

Arduino.forBlock['servo_detach'] = function (block) {
    var pin = Arduino.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
    var code = 'servo.detach();\n';
    return code;
}

Arduino.forBlock['servo_write'] = function (block) {
    var angle = Arduino.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC);
    var code = 'servo.write(' + angle + ');\n';
    return code;
}

Arduino.forBlock['servo_pin_write'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var angle = block.getFieldValue('ANGLE');

    // 为每个引脚创建一个唯一的舵机对象
    var servoName = 'servo_pin_' + pin;

    // 添加必要的库和对象声明
    Arduino.addLibrary('servo_lib', '#include <Servo.h>');
    Arduino.addObject('servo_obj_' + servoName, 'Servo ' + servoName + ';');

    // 在setup中添加attach代码
    Arduino.addSetup('servo_attach_' + pin, servoName + '.attach(' + pin + ');');

    // 生成控制代码
    var code = servoName + '.write(' + angle + ');\n';
    return code;
}