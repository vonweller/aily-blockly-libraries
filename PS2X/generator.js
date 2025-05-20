Arduino.forBlock['ps2x_init'] = function(block, generator) {
  var clk = block.getFieldValue('CLK');
  var cmd = block.getFieldValue('CMD');
  var att = block.getFieldValue('ATT');
  var dat = block.getFieldValue('DAT');
  
  generator.addLibrary('PS2X', '#include <PS2X.h>');
  generator.addVariable('ps2x', 'PS2X ps2x;');
  generator.addSetupBegin('ps2x_setup', 'ps2x.config_gamepad(' + clk + ', ' + cmd + ', ' + att + ', ' + dat + ');\n  delay(300);');
  
  return '';
};

Arduino.forBlock['ps2x_read'] = function(block, generator) {
  return 'ps2x.read_gamepad();\n';
};

Arduino.forBlock['ps2x_button'] = function(block, generator) {
  var button = block.getFieldValue('BUTTON');
  return ['ps2x.Button(' + button + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ps2x_analog'] = function(block, generator) {
  var analog = block.getFieldValue('ANALOG');
  return ['ps2x.Analog(' + analog + ')', Arduino.ORDER_FUNCTION_CALL];
};