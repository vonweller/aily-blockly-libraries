Arduino.forBlock['u8g2_init'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const displayType = block.getFieldValue('DISPLAY_TYPE');
  const protocol = block.getFieldValue('PROTOCOL');
  
  generator.addLibrary('U8G2_LIBRARY', '#include <U8g2lib.h>');
  generator.addLibrary('WIRE_LIBRARY', '#include <Wire.h>');
  
  const constructorName = displayType + protocol;
  generator.addObject('U8G2_' + instance, `U8G2_${constructorName} ${instance};`);
  
  return '';
};

Arduino.forBlock['u8g2_setup'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const pins = generator.valueToCode(block, 'PINS', Arduino.ORDER_ATOMIC);
  
  return '';
};

Arduino.forBlock['u8g2_pins_i2c'] = function(block, generator) {
  const address = block.getFieldValue('ADDRESS');
  return [`U8X8_PIN_NONE, U8X8_PIN_NONE, U8X8_PIN_NONE, U8X8_PIN_NONE, U8X8_PIN_NONE, U8X8_PIN_NONE, U8X8_PIN_NONE, 0x${address}C`, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['u8g2_pins_spi'] = function(block, generator) {
  const dcPin = block.getFieldValue('DC_PIN');
  const csPin = block.getFieldValue('CS_PIN');
  const resetPin = block.getFieldValue('RESET_PIN');
  
  return [`${dcPin}, ${csPin}, ${resetPin}`, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['u8g2_begin'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  
  generator.addSetup('u8g2_begin_' + instance, `${instance}.begin();`);
  generator.addSetup('u8g2_setflipmode_' + instance, `${instance}.setFlipMode(0);`);
  
  return '';
};

Arduino.forBlock['u8g2_clear'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  
  return `${instance}.clearBuffer();\n`;
};

Arduino.forBlock['u8g2_set_font'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const font = block.getFieldValue('FONT');
  
  return `${instance}.setFont(${font});\n`;
};

Arduino.forBlock['u8g2_draw_text'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);
  
  return `${instance}.drawStr(${x}, ${y}, ${text});\n`;
};

Arduino.forBlock['u8g2_draw_line'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC);
  const y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC);
  const x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC);
  const y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC);
  
  return `${instance}.drawLine(${x1}, ${y1}, ${x2}, ${y2});\n`;
};

Arduino.forBlock['u8g2_draw_rectangle'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const width = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC);
  const height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';
  
  if (fill) {
    return `${instance}.drawBox(${x}, ${y}, ${width}, ${height});\n`;
  } else {
    return `${instance}.drawFrame(${x}, ${y}, ${width}, ${height});\n`;
  }
};

Arduino.forBlock['u8g2_draw_circle'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const radius = generator.valueToCode(block, 'RADIUS', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';
  
  if (fill) {
    return `${instance}.drawDisc(${x}, ${y}, ${radius});\n`;
  } else {
    return `${instance}.drawCircle(${x}, ${y}, ${radius});\n`;
  }
};

Arduino.forBlock['u8g2_send_buffer'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  
  return `${instance}.sendBuffer();\n`;
};

Arduino.forBlock['u8g2_simple_text'] = function(block, generator) {
  const instance = generator.nameDB_.getName(block.getFieldValue('U8G2_INSTANCE'), 'VARIABLE');
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);

  // 简化版的显示文本（自带清屏和刷新）
  return `${instance}.clearBuffer();\n${instance}.drawStr(${x}, ${y}, ${text});\n${instance}.sendBuffer();\n`;
};