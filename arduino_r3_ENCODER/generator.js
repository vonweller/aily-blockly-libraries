Arduino.forBlock['encoder_init'] = function(block, generator) {
  var variable_encoder = block.getFieldValue('ENCODER');
  var dropdown_pin_a = block.getFieldValue('PIN_A');
  var dropdown_pin_b = block.getFieldValue('PIN_B');
  
  // 添加Encoder库
  generator.addLibrary('Encoder', '#include <Encoder.h>');
  
  // 添加编码器对象的定义
  generator.addObject(variable_encoder, 'Encoder ' + variable_encoder + '(' + dropdown_pin_a + ', ' + dropdown_pin_b + ')');
  
  return '';
};

Arduino.forBlock['encoder_read'] = function(block, generator) {
  var variable_encoder = block.getFieldValue('ENCODER');
  
  // 生成读取编码器值的代码
  var code = variable_encoder + '.read()';
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['encoder_write'] = function(block, generator) {
  var variable_encoder = block.getFieldValue('ENCODER');
  var value_value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  
  // 生成设置编码器值的代码
  var code = variable_encoder + '.write(' + value_value + ');\n';
  
  return code;
};