function getVariableName(block) {
  const variableField = block.getField('HCNAME');
  const variableModel = variableField.getVariable();
  console.log("name: ", variableModel.name);
  return variableModel.name;
}

Arduino.forBlock['74hc595_create'] = function(block, generator) {
  const hcnm = getVariableName(block);
  var hcnum = generator.valueToCode(block, 'HCNUMBER', Arduino.ORDER_ATOMIC) || '1';
  var hcdtPin = block.getFieldValue("HCDATA_PIN");
  var hclkPin = block.getFieldValue("HCCLOCK_PIN");
  var hclhPin = block.getFieldValue("HCLATCH_PIN");
  generator.addLibrary('#include <ShiftRegister74HC595.h>', '#include <ShiftRegister74HC595.h>');
  generator.addVariable('ShiftRegister74HC595', 'ShiftRegister74HC595<'+hcnum+'> ' + hcnm + '(' + hcdtPin + ', ' + hclkPin + ', ' + hclhPin + ');\n');
  return '';
};

Arduino.forBlock['74hc595_set'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const pin = block.getFieldValue("HCPIN");
  const value = block.getFieldValue("VALUE");
  
  const code = hcnm + '.set(' + pin + ', ' + value + ');\n';
  return code;
};

Arduino.forBlock['74hc595_setAll'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const allst = block.getFieldValue("ALLSTATE");

  const code = hcnm + '.setAll' + allst + '();\n';
  return code;
};

Arduino.forBlock['74hc595_setAllBin'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const hcarray = block.getFieldValue("HCARRAY") || "";

  const code = hcnm + '.setAll(' + hcarray + ');\n';
  return code;
};

Arduino.forBlock['74hc595_getstate'] = function(block, generator) {
  const hcnm = getVariableName(block);
  var hcopstate = generator.valueToCode(block, 'HCOUTPSTATE', Arduino.ORDER_ATOMIC) || '0';

  return hcnm + '.get('+hcopstate+');';
};