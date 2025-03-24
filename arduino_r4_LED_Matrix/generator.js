Arduino.forBlock['led_matrix_init'] = function(block, generator) {
  generator.addLibrary('Arduino_LED_Matrix', '#include "Arduino_LED_Matrix.h"');
  generator.addLibrary('ArduinoGraphics', '#include "ArduinoGraphics.h"');
  generator.addObject('matrix', 'ArduinoLEDMatrix matrix;');
  
  var code = 'matrix.begin();\n';
  return code;
};

Arduino.forBlock['led_matrix_clear'] = function(block, generator) {
  var code = 'matrix.clear();\n';
  return code;
};

Arduino.forBlock['led_matrix_display_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var direction = block.getFieldValue('DIRECTION');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '100';
  
  var code = 'matrix.beginDraw();\n';
  code += 'matrix.textFont(Font_5x7);\n';
  code += 'matrix.beginText(0, 1, 0xFFFFFF);\n';
  code += 'matrix.println(' + text + ');\n';
  code += 'matrix.textScrollSpeed(' + speed + ');\n';
  code += 'matrix.endText(' + direction + ');\n';
  
  return code;
};

Arduino.forBlock['led_matrix_display_frame'] = function(block, generator) {
  var frame = block.getFieldValue('FRAME');
  var frameCode = '';
  
  generator.addMacro('LED_FRAMES', `
// 预定义帧
const uint32_t SMILE[] = {
  0x003C420000000000, 0x00A5A5420000, 0x00BD423C0000
};

const uint32_t HEART[] = {
  0x00006C920000, 0x0010107C380000, 0x00001010380000
};

const uint32_t EXCLAMATION[] = {
  0x00003C3C000000, 0x003C3C3C000000, 0x0000003C3C0000
};

const uint32_t QUESTION[] = {
  0x1E21211E0000, 0x00000018000000, 0x0000001800000000
};
`);
  
  var code = 'matrix.loadFrame(' + frame + ');\n';
  return code;
};

Arduino.forBlock['led_matrix_play_animation'] = function(block, generator) {
  var animation = block.getFieldValue('ANIMATION');
  var loop = block.getFieldValue('LOOP') === 'TRUE';
  
  generator.addMacro('LED_ANIMATIONS', `
// 预定义动画
const uint32_t HEART_BEAT[][4] = {
  {0x00006C920000, 0x0010107C380000, 0x00001010380000, 300},
  {0x0000182400, 0x00422418180000, 0x0000004218, 300},
  {0x00006C920000, 0x0010107C380000, 0x00001010380000, 300}
};

const uint32_t SMILEY[][4] = {
  {0x003C420000000000, 0x00A5A5420000, 0x00BD423C0000, 500},
  {0x003C420000000000, 0x00A5A5420000, 0x003C42420000, 500}
};
`);
  
  var code = 'matrix.loadSequence(' + animation + ');\n';
  code += 'matrix.play(' + (loop ? 'true' : 'false') + ');\n';
  
  return code;
};