Arduino.forBlock['max7219_begin'] = function(block, generator) {
  generator.addLibrary('#include <max7219.h>', '#include <max7219.h>');
  generator.addObject('MAX7219 display', 'MAX7219 display;');
  return 'display.Begin();';
};

Arduino.forBlock['max7219_set_brightness'] = function(block, generator) {
  var brightness = block.getFieldValue('BRIGHTNESS');
  return 'display.MAX7219_SetBrightness(' + brightness + ');';
};

Arduino.forBlock['max7219_display_char'] = function(block, generator) {
  var digit = block.getFieldValue('DIGIT');
  var character = block.getFieldValue('CHARACTER');
  var dp = block.getFieldValue('DP');
  return "display.DisplayChar(" + digit + ", '" + character.charAt(0) + "', " + (dp === "1" ? "true" : "false") + ");";
};

Arduino.forBlock['max7219_clear'] = function(block, generator) {
  return 'display.clearDisplay();';
};

Arduino.forBlock['max7219_display_test_start'] = function(block, generator) {
  return 'display.MAX7219_DisplayTestStart();';
};

Arduino.forBlock['max7219_display_test_stop'] = function(block, generator) {
  return 'display.MAX7219_DisplayTestStop();';
};

Arduino.forBlock['max7219_display_text'] = function(block, generator) {
  var text = block.getFieldValue('TEXT');
  var justify = block.getFieldValue('JUSTIFY');
  return 'display.DisplayText("' + text + '", ' + justify + ');';
};