// 统一的TFT屏幕相关 Generator.js 合并文件

// 初始化、对象定义部分，兼容ST7735/ST7789/ST7796S/自定义
Arduino.forBlock['tft_init'] = function(block, generator) {
  var model = block.getFieldValue('MODEL'); // 可扩展为ST7735、ST7789或ST7796S
  var cs = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC) || block.getFieldValue('CS_PIN') || '10';
  var dc = generator.valueToCode(block, 'DC_PIN', Arduino.ORDER_ATOMIC) || block.getFieldValue('DC_PIN') || '9';
  var rst = generator.valueToCode(block, 'RST_PIN', Arduino.ORDER_ATOMIC) || block.getFieldValue('RST_PIN') || '8';
  var width = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || block.getFieldValue('WIDTH');
  var height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || block.getFieldValue('HEIGHT');
  
  if(model === 'ST7796S') {
    generator.addLibrary('Adafruit_ST7796S', '#include <Adafruit_ST7796S.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    generator.addObject('tft', 'Adafruit_ST7796S tft = Adafruit_ST7796S('+cs+', '+dc+', '+rst+');');
    generator.addSetup('tft_init', 'tft.init('+ (width || 'ST7796S_TFTWIDTH') +', '+ (height || 'ST7796S_TFTHEIGHT') +');');
  } else if(model === 'ST7789') {
    generator.addLibrary('Adafruit_ST7789', '#include <Adafruit_ST7789.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    generator.addObject('tft', 'Adafruit_ST7789 tft = Adafruit_ST7789('+cs+', '+dc+', '+rst+');');
    generator.addSetup('tft_init', 'tft.init('+ (width || 240) +', '+ (height || 320) +');');
  } else {
    generator.addLibrary('Adafruit_ST7735', '#include <Adafruit_ST7735.h>');
    generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
    generator.addObject('tft', 'Adafruit_ST7735 tft = Adafruit_ST7735('+cs+', '+dc+', '+rst+');');
    generator.addSetup('tft_init', 'tft.initR(INITR_BLACKTAB);');
  }
  return '';
};

// 屏幕控制函数通用
Arduino.forBlock['tft_set_rotation'] = function(block, generator) {
  var v = generator.valueToCode(block, 'ROTATION', Arduino.ORDER_ATOMIC) || block.getFieldValue('ROTATION') || '0';
  return 'tft.setRotation(' + v + ');\n';
};
Arduino.forBlock['tft_fill_screen'] = function(block, generator) {
  var v = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('COLOR') || 'ST77XX_BLACK';
  return 'tft.fillScreen(' + v + ');\n';
};
Arduino.forBlock['tft_enable_display'] = function(block, generator) {
  var v = generator.valueToCode(block, 'ENABLED', Arduino.ORDER_ATOMIC) || block.getFieldValue('ENABLED') || 'true';
  return 'tft.enableDisplay(' + v + ');\n';
};
Arduino.forBlock['tft_set_backlight'] = function(block, generator) {
  var v = generator.valueToCode(block, 'LEVEL', Arduino.ORDER_ATOMIC) || block.getFieldValue('LEVEL') || '255';
  return 'tft.setBacklight(' + v + ');\n';
};

Arduino.forBlock['tft_set_addr_window'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  var w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '10';
  return 'tft.setAddrWindow(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};
Arduino.forBlock['tft_start_write'] = function(block) { return 'tft.startWrite();\n'; };
Arduino.forBlock['tft_end_write']   = function(block) { return 'tft.endWrite();\n'; };
Arduino.forBlock['tft_push_color']  = function(block, generator) {
  var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
  return 'tft.pushColor(' + color + ');\n';
};

// 文本、字体、文本属性合并
Arduino.forBlock['tft_set_cursor'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || 0;
  var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || 0;
  return 'tft.setCursor(' + x + ', ' + y + ');\n';
};
Arduino.forBlock['tft_set_text_color'] = function(block, generator) {
  var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || block.getFieldValue('COLOR') || 'ST77XX_WHITE';
  var hasBg = block.getFieldValue('HAS_BG');
  if(hasBg=='TRUE' || hasBg===true){
    var bg   = generator.valueToCode(block, 'BG', Arduino.ORDER_ATOMIC) || 'ST77XX_BLACK';
    return 'tft.setTextColor(' + color + ', ' + bg + ');\n';
  } else{
    return 'tft.setTextColor(' + color + ');\n';
  }
};
Arduino.forBlock['tft_set_text_color_bg'] = function(block, generator) {
  var fg = generator.valueToCode(block, 'FG_COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
  var bg = generator.valueToCode(block, 'BG_COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_BLACK';
  return 'tft.setTextColor(' + fg + ', ' + bg + ');\n';
};
Arduino.forBlock['tft_set_text_size'] = function(block, generator) {
  var size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || block.getFieldValue('SIZE') || 1;
  return 'tft.setTextSize(' + size + ');\n';
};
Arduino.forBlock['tft_set_text_wrap'] = function(block, generator) {
  var wrap = block.getFieldValue('WRAP') || true;
  return 'tft.setTextWrap(' + wrap + ');\n';
};
Arduino.forBlock['tft_set_font'] = function(block, generator) {
  var font = block.getFieldValue('FONT');
  if(font) generator.addLibrary('GFX_Font_'+font, '#include <Fonts/'+font+'.h>');
  return 'tft.setFont(&' + font + ');\n';
};
Arduino.forBlock['tft_cp437'] = function(block, generator) {
  var v = generator.valueToCode(block, 'ENABLE', Arduino.ORDER_ATOMIC) || block.getFieldValue('ENABLE') || 'true';
  return 'tft.cp437(' + v + ');\n';
};
Arduino.forBlock['tft_print'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || block.getFieldValue('TEXT') || '""';
  var newline = block.getFieldValue('NEWLINE') === 'TRUE';
  return 'tft.' + (newline ? 'println' : 'print') + '(' + text + ');\n';
};

// 基本图形、像素、直线、矩形等
['draw_pixel','draw_line','draw_fast_h_line','draw_fast_v_line','draw_rect','fill_rect','draw_round_rect',
 'fill_round_rect','draw_circle','fill_circle','draw_triangle','fill_triangle','draw_bitmap','draw_rgb_bitmap'].forEach(function(cmd){
  Arduino.forBlock['tft_' + cmd] = function(block, generator) {
    var args = ['X','Y','X0','Y0','X1','Y1','X2','Y2','W','H','R','COLOR','BITMAP','FG_COLOR','BG_COLOR']
      .map(function(a){return generator.valueToCode(block, a, Arduino.ORDER_ATOMIC) || block.getFieldValue(a) || undefined;});
    // 定义各种函数映射
    var map = {
      draw_pixel   : 'tft.drawPixel('+args[0]+','+args[1]+','+args[10]+');\n',
      draw_line    : 'tft.drawLine('+args[2]+','+args[3]+','+args[4]+','+args[5]+','+args[10]+');\n',
      draw_fast_h_line : 'tft.drawFastHLine('+args[0]+','+args[1]+','+args[8]+','+args[10]+');\n',
      draw_fast_v_line : 'tft.drawFastVLine('+args[0]+','+args[1]+','+args[9]+','+args[10]+');\n',
      draw_rect    : 'tft.drawRect('+args[0]+','+args[1]+','+args[8]+','+args[9]+','+args[10]+');\n',
      fill_rect    : 'tft.fillRect('+args[0]+','+args[1]+','+args[8]+','+args[9]+','+args[10]+');\n',
      draw_round_rect : 'tft.drawRoundRect('+args[0]+','+args[1]+','+args[8]+','+args[9]+','+args[10]+','+args[11]+');\n',
      fill_round_rect : 'tft.fillRoundRect('+args[0]+','+args[1]+','+args[8]+','+args[9]+','+args[10]+','+args[11]+');\n',
      draw_circle  : 'tft.drawCircle('+args[0]+','+args[1]+','+args[10]+','+args[11]+');\n',
      fill_circle  : 'tft.fillCircle('+args[0]+','+args[1]+','+args[10]+','+args[11]+');\n',
      draw_triangle: 'tft.drawTriangle('+args[2]+','+args[3]+','+args[4]+','+args[5]+','+args[6]+','+args[7]+','+args[10]+');\n',
      fill_triangle: 'tft.fillTriangle('+args[2]+','+args[3]+','+args[4]+','+args[5]+','+args[6]+','+args[7]+','+args[10]+');\n',
      draw_bitmap  : 'tft.drawBitmap('+args[0]+','+args[1]+','+args[12]+','+args[8]+','+args[9]+','+args[10]+');\n',
      draw_rgb_bitmap : 'tft.drawRGBBitmap('+args[0]+','+args[1]+','+args[12]+','+args[8]+','+args[9]+');\n',
    };
    return map[cmd];
  };
});

Arduino.forBlock['tft_draw_char'] = function(block, generator) {
  var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  var chr = generator.valueToCode(block, 'CHAR', Arduino.ORDER_ATOMIC) || "'A'";
  var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'ST77XX_WHITE';
  var bg = generator.valueToCode(block, 'BG', Arduino.ORDER_ATOMIC) || 'ST77XX_BLACK';
  var size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || '1';
  return 'tft.drawChar(' + x + ',' + y + ',' + chr + ',' + color + ',' + bg + ',' + size + ');\n';
};

Arduino.forBlock['tft_invert_display'] = function(block, generator) {
  var inv = block.getFieldValue('INVERT') || block.getFieldValue('ENABLED') || false;
  return 'tft.invertDisplay(' + inv + ');\n';
};

Arduino.forBlock['tft_color565'] = function(block, generator) {
  var r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
  var g = generator.valueToCode(block, 'G', Arduino.ORDER_ATOMIC) || '0';
  var b = generator.valueToCode(block, 'B', Arduino.ORDER_ATOMIC) || '0';
  return ['tft.color565(' + r + ',' + g + ',' + b + ')', Arduino.ORDER_ATOMIC];
};

// 画布(canvas)相关
Arduino.forBlock['tft_create_canvas16'] = function(block, generator) {
  var name = Arduino.nameDB_.getName(block.getFieldValue('NAME'), "VARIABLE");
  var w = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addVariable(name, 'GFXcanvas16 '+name+'('+w+','+h+');');
  return '';
};
Arduino.forBlock['tft_create_canvas1'] = function(block, generator) {
  var name = Arduino.nameDB_.getName(block.getFieldValue('NAME'), "VARIABLE");
  var w = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC) || '10';
  var h = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addVariable(name, 'GFXcanvas1 '+name+'('+w+','+h+');');
  return '';
};
Arduino.forBlock['tft_get_buffer'] = function(block, generator) {
  var canvas = generator.valueToCode(block, 'CANVAS', Arduino.ORDER_ATOMIC) || block.getFieldValue('CANVAS');
  return [canvas + '.getBuffer()', Arduino.ORDER_ATOMIC];
};

// SD文件操作(通用合并)
Arduino.forBlock['sd_begin'] = function(block, generator) {
  var pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC) || block.getFieldValue('CS_PIN') || '10';
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addSetup('sd_begin', 'SD.begin(' + pin + ');');
  return '';
};
Arduino.forBlock['sd_open'] = function(block, generator) {
  var filename = generator.valueToCode(block, 'FILENAME', Arduino.ORDER_ATOMIC)||block.getFieldValue('FILENAME')||'""';
  var mode = block.getFieldValue('MODE')||'FILE_READ';
  var variable_name = Arduino.nameDB_.getName(block.getFieldValue('FILE')||block.getFieldValue('NAME'), "VARIABLE");
  return 'File ' + variable_name + ' = SD.open(' + filename + ', ' + mode + ');\n';
};

// 其他硬件和按钮
Arduino.forBlock['tft_begin'] = function(block, generator) {
  generator.addSetup('tft_begin', 'tft.begin();');
  return '';
};
Arduino.forBlock['tft_get_version'] = function(block) {
  return ['tft.getVersion()', Arduino.ORDER_ATOMIC];
};
Arduino.forBlock['tft_reset'] = function(block) { return 'tft.tftReset();\n'; };
Arduino.forBlock['tft_read_buttons'] = function(block) {
  return ['tft.readButtons()', Arduino.ORDER_ATOMIC];
};

// 屏幕宽高参数、光标位置通用
Arduino.forBlock['tft_width'] = function(block) { return ['tft.width()',   Arduino.ORDER_ATOMIC]; };
Arduino.forBlock['tft_height'] = function(block) { return ['tft.height()', Arduino.ORDER_ATOMIC]; };
Arduino.forBlock['tft_get_cursor_x'] = function(block) { return ['tft.getCursorX()', Arduino.ORDER_ATOMIC]; };
Arduino.forBlock['tft_get_cursor_y'] = function(block) { return ['tft.getCursorY()', Arduino.ORDER_ATOMIC]; };
