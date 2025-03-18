Arduino.forBlock['lm35_read'] = function(block, generator) {
  generator.addLibrary('#include <LM35.h>', '#include <LM35.h>');
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC);
  const variableName = generator.getVariableName('temperature');
  generator.addVariable(`float ${variableName} = 0;`, `float ${variableName} = 0;`);
  const code = `${variableName} = LM35.read(${pin});\n`;
  return code;
};