function getVariableName(block) {
  const variableField = block.getField('ENCODER');
  const variableModel = variableField.getVariable();
  console.log("name: ", variableModel.name);
  return variableModel.name;
}

Arduino.forBlock['encoder_init'] = function(block, generator) {
  const variable_encoder = getVariableName(block);
  var dropdown_pin_a = block.getFieldValue('PIN_A') || '2';
  var dropdown_pin_b = block.getFieldValue('PIN_B') || '3';
  
  generator.addLibrary('Encoder', '#include <Encoder.h>');
  
  generator.addObject(`${variable_encoder}`, `Encoder  ${variable_encoder}(` + dropdown_pin_a + ', ' + dropdown_pin_b + ');');
  
  return '';
};

Arduino.forBlock['encoder_read'] = function(block, generator) {
  const variable_encoder = getVariableName(block);
  
  var code = variable_encoder + '.read()';
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['encoder_write'] = function(block, generator) {
  const variable_encoder = getVariableName(block);
  var value_value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  
  var code = variable_encoder + '.write(' + value_value + ');\n';
  
  return code;
};