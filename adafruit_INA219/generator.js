// Generator.js: Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 integration

/**
 * Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 生成器统一处理
 */

function simpleMethod(block, generator, field, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  return n + '.' + method + '();\n';
}

function singleParam(block, generator, field, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var v = generator.valueToCode(block, field, Arduino.ORDER_ATOMIC);
  return n + '.' + method + '(' + v + ');\n';
}

function doubleParam(block, generator, field1, field2, method) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var v1 = generator.valueToCode(block, field1, Arduino.ORDER_COMMA);
  var v2 = generator.valueToCode(block, field2, Arduino.ORDER_COMMA);
  return n + '.' + method + '(' + v1 + ', ' + v2 + ');\n';
}

// Adafruit_NeoPixel
Arduino.forBlock['neopixel_create'] = function(block, generator) {
  var vname = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var pnum = generator.valueToCode(block, 'NUM_PIXELS', Arduino.ORDER_ATOMIC);
  var pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
  var type = generator.valueToCode(block, 'TYPE', Arduino.ORDER_ATOMIC);
  generator.addLibrary('adafruit_neopixel', '#include <Adafruit_NeoPixel.h>');
  generator.addVariable(vname, 'Adafruit_NeoPixel ' + vname + '(' + pnum + ', ' + pin + ', ' + type + ');');
  return '';
};
Arduino.forBlock['neopixel_begin'] = function(b,g){return simpleMethod(b,g,'VAR','begin');};
Arduino.forBlock['neopixel_show'] = function(b,g){return simpleMethod(b,g,'VAR','show');};
Arduino.forBlock['neopixel_set_pixel_color'] = function(block, generator) {
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var i = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC);
  var c = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC);
  return n + '.setPixelColor(' + i + ', ' + c + ');\n';
};
Arduino.forBlock['neopixel_num_pixels'] = function(b,g){var n=Arduino.nameDB_.getName(b.getFieldValue('VAR'),'VARIABLE');return [n+'.numPixels()',Arduino.ORDER_FUNCTION_CALL];};
Arduino.forBlock['neopixel_color'] = function(block, generator) {
  var n=Arduino.nameDB_.getName(block.getFieldValue('VAR'),'VARIABLE');
  var r=generator.valueToCode(block,'R',Arduino.ORDER_COMMA);
  var g_=generator.valueToCode(block,'G',Arduino.ORDER_COMMA);
  var b=generator.valueToCode(block,'B',Arduino.ORDER_COMMA);
  return [n+'.Color('+r+','+g_+','+b+')',Arduino.ORDER_FUNCTION_CALL];
};

// Adafruit_SSD1306
Arduino.forBlock['ssd1306_begin'] = function(block, generator) {
  var v=Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  var s=generator.valueToCode(block, 'VCCSTATE', Arduino.ORDER_COMMA);
  var a=generator.valueToCode(block, 'I2C_ADDRESS', Arduino.ORDER_COMMA);
  generator.addLibrary('adafruit_ssd1306', '#include <Adafruit_SSD1306.h>');
  generator.addLibrary('adafruit_gfx', '#include <Adafruit_GFX.h>');
  return v+'.begin('+s+','+a+');\n';
};
Arduino.forBlock['ssd1306_set_rotation'] = function(b,g){return singleParam(b,g,'ROTATION','setRotation');};
Arduino.forBlock['ssd1306_set_text_size'] = function(b,g){return singleParam(b,g,'SIZE','setTextSize');};
Arduino.forBlock['ssd1306_set_text_color'] = function(b,g){return singleParam(b,g,'COLOR','setTextColor');};
Arduino.forBlock['ssd1306_clear_display'] = function(b,g){return simpleMethod(b,g,'VAR','clearDisplay');};
Arduino.forBlock['ssd1306_display'] = function(b,g){return simpleMethod(b,g,'VAR','display');};
Arduino.forBlock['ssd1306_set_cursor'] = function(block,generator){return doubleParam(block,generator,'X','Y','setCursor');};
Arduino.forBlock['ssd1306_print'] = function(block,generator){
  var n = Arduino.nameDB_.getName(block.getFieldValue('VAR'),'VARIABLE');
  var vv = generator.valueToCode(block,'VALUE',Arduino.ORDER_ATOMIC);
  var pp = generator.valueToCode(block,'PRECISION',Arduino.ORDER_COMMA);
  if(pp && pp.length>0) return n+'.print('+vv+','+pp+');\n';
  return n+'.print('+vv+');\n';
};

// Adafruit_INA219
Arduino.forBlock['ina219_create'] = function(block, generator) {
  var v=Arduino.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
  generator.addLibrary('adafruit_ina219', '#include <Adafruit_INA219.h>');
  generator.addVariable(v, 'Adafruit_INA219 '+v+';');
  return '';
};
Arduino.forBlock['ina219_begin'] = function(b,g){return simpleMethod(b,g,'VAR','begin');};
Arduino.forBlock['ina219_get_bus_voltage'] = function(b,g){var n=Arduino.nameDB_.getName(b.getFieldValue('VAR'),'VARIABLE');return [n+'.getBusVoltage_V()',Arduino.ORDER_FUNCTION_CALL];};
Arduino.forBlock['ina219_get_shunt_voltage'] = function(b,g){var n=Arduino.nameDB_.getName(b.getFieldValue('VAR'),'VARIABLE');return [n+'.getShuntVoltage_mV()',Arduino.ORDER_FUNCTION_CALL];};
Arduino.forBlock['ina219_get_current'] = function(b,g){var n=Arduino.nameDB_.getName(b.getFieldValue('VAR'),'VARIABLE');return [n+'.getCurrent_mA()',Arduino.ORDER_FUNCTION_CALL];};
Arduino.forBlock['ina219_get_power'] = function(b,g){var n=Arduino.nameDB_.getName(b.getFieldValue('VAR'),'VARIABLE');return [n+'.getPower_mW()',Arduino.ORDER_FUNCTION_CALL];};
