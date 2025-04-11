
Arduino.forBlock['tm1650_init'] = function(block, generator) {
  generator.addLibrary('#include<Wire.h>#include<TM1650.h>', '#include<Wire.h>\n#include<TM1650.h>');
  generator.addVariable('TM1650', 'TM1650 tm1;\n');
  generator.addSetup('TM1650', 'Wire.begin();\n  tm1.init();\n');
  return '';
};

Arduino.forBlock['tm1650_set'] = function(block, generator) {
  const tmcmd = block.getFieldValue("TM1650CMD");
  
  const code = 'tm1.' + tmcmd + '();\n';
  return code;
};

Arduino.forBlock['tm1650_displaystring'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TMSTR', Arduino.ORDER_ATOMIC) || '""';
  
  var code = 'tm1.displayString(' + text + ');\n';
  return code;
};

Arduino.forBlock['tm1650_point'] = function(block, generator) {
  const tmpnum = generator.valueToCode(block,"POINT_NUM", Arduino.ORDER_ATOMIC);
  const tmpset = block.getFieldValue("TM1650POINTSET");
  
  return `tm1.setDot(${tmpnum}-1,${tmpset});\n`;
};
