/**
 * TFT LCD 显示屏的生成器函数
 */

// 定义引脚和初始化屏幕
Arduino.forBlock['tft_lcd_init'] = function (block, generator) {
    // 添加必要的库引用
    generator.addLibrary('TFT_LCD_LIBRARY', '#include <Adafruit_GFX.h>');
    generator.addLibrary('TFT_LCD_LIBRARY', '#include <Adafruit_TFTLCD.h>');
    generator.addLibrary('TFT_LCD_LIBRARY', '#include <TouchScreen.h>');
    generator.addLibrary('TFT_LCD_LIBRARY', '#include <SPI.h>');
    generator.addLibrary('TFT_LCD_LIBRARY', '#include <SD.h>');

    // 添加常量定义
    generator.addMacro('TFT_LCD_PINS', '#define LCD_CS A3');
    generator.addMacro('TFT_LCD_PINS', '#define LCD_CD A2');
    generator.addMacro('TFT_LCD_PINS', '#define LCD_WR A1');
    generator.addMacro('TFT_LCD_PINS', '#define LCD_RD A0');
    generator.addMacro('TFT_LCD_PINS', '#define LCD_RESET A4');

    // 添加显示屏颜色常量
    generator.addMacro('TFT_LCD_COLORS', '#define BLACK   0x0000');
    generator.addMacro('TFT_LCD_COLORS', '#define BLUE    0x001F');
    generator.addMacro('TFT_LCD_COLORS', '#define RED     0xF800');
    generator.addMacro('TFT_LCD_COLORS', '#define GREEN   0x07E0');
    generator.addMacro('TFT_LCD_COLORS', '#define CYAN    0x07FF');
    generator.addMacro('TFT_LCD_COLORS', '#define MAGENTA 0xF81F');
    generator.addMacro('TFT_LCD_COLORS', '#define YELLOW  0xFFE0');
    generator.addMacro('TFT_LCD_COLORS', '#define WHITE   0xFFFF');

    // 创建TFT对象
    generator.addVariable('TFT_LCD_OBJECT', 'Adafruit_TFTLCD tft(LCD_CS, LCD_CD, LCD_WR, LCD_RD, LCD_RESET);');

    // 添加触摸屏引脚定义
    generator.addMacro('TOUCH_SCREEN_PINS', '#define YP A3');
    generator.addMacro('TOUCH_SCREEN_PINS', '#define XM A2');
    generator.addMacro('TOUCH_SCREEN_PINS', '#define YM 9');
    generator.addMacro('TOUCH_SCREEN_PINS', '#define XP 8');

    // 添加触摸屏参数
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define TS_MINX 150');
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define TS_MINY 120');
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define TS_MAXX 920');
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define TS_MAXY 940');
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define MINPRESSURE 10');
    generator.addMacro('TOUCH_SCREEN_PARAMS', '#define MAXPRESSURE 1000');

    // 创建触摸屏对象
    generator.addVariable('TOUCH_SCREEN_OBJECT', 'TouchScreen ts = TouchScreen(XP, YP, XM, YM, 300);');

    // 在setup部分初始化显示屏
    var screenId = block.getFieldValue('SCREEN_ID') || '0x9341';

    generator.addSetupBegin('TFT_LCD_INIT', 'Serial.begin(9600);');
    generator.addSetupBegin('TFT_LCD_INIT', 'tft.reset();');
    generator.addSetupBegin('TFT_LCD_INIT', 'tft.begin(' + screenId + ');');
    generator.addSetupBegin('TFT_LCD_INIT', 'tft.setRotation(2);');
    generator.addSetupBegin('TFT_LCD_INIT', 'tft.fillScreen(BLACK);');

    return '';
};

// 填充屏幕为指定颜色
Arduino.forBlock['tft_fill_screen'] = function (block, generator) {
    var color = block.getFieldValue('COLOR') || 'BLACK';

    var code = 'tft.fillScreen(' + color + ');\n';
    return code;
};

// 设置旋转方向
Arduino.forBlock['tft_set_rotation'] = function (block, generator) {
    var rotation = generator.valueToCode(block, 'ROTATION', generator.ORDER_ATOMIC) || '0';

    var code = 'tft.setRotation(' + rotation + ');\n';
    return code;
};

// 设置屏幕当前文本颜色
Arduino.forBlock['tft_set_text_color'] = function (block, generator) {
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.setTextColor(' + color + ');\n';
    return code;
};

// 设置屏幕文本大小
Arduino.forBlock['tft_set_text_size'] = function (block, generator) {
    var size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '1';

    var code = 'tft.setTextSize(' + size + ');\n';
    return code;
};

// 在屏幕上显示文本
Arduino.forBlock['tft_draw_text'] = function (block, generator) {
    var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';

    var code = 'tft.setCursor(' + x + ', ' + y + ');\n';
    code += 'tft.print(' + text + ');\n';
    return code;
};

// 绘制像素
Arduino.forBlock['tft_draw_pixel'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
    return code;
};

// 绘制线条
Arduino.forBlock['tft_draw_line'] = function (block, generator) {
    var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
    var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
    var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
    var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawLine(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + color + ');\n';
    return code;
};

// 绘制矩形
Arduino.forBlock['tft_draw_rect'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
    return code;
};

// 填充矩形
Arduino.forBlock['tft_fill_rect'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
    return code;
};

// 绘制圆形
Arduino.forBlock['tft_draw_circle'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');\n';
    return code;
};

// 填充圆形
Arduino.forBlock['tft_fill_circle'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.fillCircle(' + x + ', ' + y + ', ' + r + ', ' + color + ');\n';
    return code;
};

// 绘制三角形
Arduino.forBlock['tft_draw_triangle'] = function (block, generator) {
    var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
    var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
    var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
    var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
    var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
    var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
    return code;
};

// 填充三角形
Arduino.forBlock['tft_fill_triangle'] = function (block, generator) {
    var x0 = generator.valueToCode(block, 'X0', generator.ORDER_ATOMIC) || '0';
    var y0 = generator.valueToCode(block, 'Y0', generator.ORDER_ATOMIC) || '0';
    var x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
    var y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
    var x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
    var y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.fillTriangle(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
    return code;
};

// 绘制圆角矩形
Arduino.forBlock['tft_draw_round_rect'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
    var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.drawRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');\n';
    return code;
};

// 填充圆角矩形
Arduino.forBlock['tft_fill_round_rect'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
    var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
    var color = block.getFieldValue('COLOR') || 'WHITE';

    var code = 'tft.fillRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + r + ', ' + color + ');\n';
    return code;
};

// SD卡初始化
Arduino.forBlock['tft_sd_init'] = function (block, generator) {
    var cs_pin = generator.valueToCode(block, 'CS_PIN', generator.ORDER_ATOMIC) || '10';

    generator.addSetupBegin('SD_INIT', 'if (!SD.begin(' + cs_pin + ')) {');
    generator.addSetupBegin('SD_INIT', '  Serial.println("SD card initialization failed!");');
    generator.addSetupBegin('SD_INIT', '  return;');
    generator.addSetupBegin('SD_INIT', '}');
    generator.addSetupBegin('SD_INIT', 'Serial.println("SD card initialized.");');

    return '';
};

// 获取BMP图片文件并显示到屏幕上
Arduino.forBlock['tft_draw_bmp'] = function (block, generator) {
    var filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"image.bmp"';
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';

    // 添加bmpDraw函数
    generator.addFunction('BMP_DRAW_FUNCTION',
        'void bmpDraw(const char *filename, uint8_t x, uint16_t y) {\n' +
        '  File bmpFile;\n' +
        '  int bmpWidth, bmpHeight;\n' +
        '  uint8_t bmpDepth;\n' +
        '  uint32_t bmpImageoffset;\n' +
        '  uint32_t rowSize;\n' +
        '  uint8_t sdbuffer[3*BUFFERSIZE];\n' +
        '  uint8_t buffidx = sizeof(sdbuffer);\n' +
        '  boolean goodBmp = false;\n' +
        '  boolean flip = true;\n' +
        '  int w, h, row, col;\n' +
        '  uint8_t r, g, b;\n' +
        '  uint32_t pos = 0, startTime = millis();\n' +
        '\n' +
        '  if((x >= tft.width()) || (y >= tft.height())) return;\n' +
        '\n' +
        '  Serial.println();\n' +
        '  Serial.print("Loading image \'");\n' +
        '  Serial.print(filename);\n' +
        '  Serial.println("\'...");\n' +
        '\n' +
        '  if ((bmpFile = SD.open(filename)) == NULL) {\n' +
        '    Serial.print("File not found");\n' +
        '    return;\n' +
        '  }\n' +
        '\n' +
        '  if(read16(bmpFile) == 0x4D42) {\n' +
        '    Serial.print("File size: "); Serial.println(read32(bmpFile));\n' +
        '    (void)read32(bmpFile);\n' +
        '    bmpImageoffset = read32(bmpFile);\n' +
        '    Serial.print("Image Offset: "); Serial.println(bmpImageoffset, DEC);\n' +
        '    Serial.print("Header size: "); Serial.println(read32(bmpFile));\n' +
        '    bmpWidth  = read32(bmpFile);\n' +
        '    bmpHeight = read32(bmpFile);\n' +
        '\n' +
        '    if(read16(bmpFile) == 1) {\n' +
        '      bmpDepth = read16(bmpFile);\n' +
        '      Serial.print("Bit Depth: "); Serial.println(bmpDepth);\n' +
        '      if((bmpDepth == 24) && (read32(bmpFile) == 0)) {\n' +
        '        goodBmp = true;\n' +
        '        Serial.print("Image size: ");\n' +
        '        Serial.print(bmpWidth);\n' +
        '        Serial.print(\'x\');\n' +
        '        Serial.println(bmpHeight);\n' +
        '\n' +
        '        rowSize = (bmpWidth * 3 + 3) & ~3;\n' +
        '\n' +
        '        if(bmpHeight < 0) {\n' +
        '          bmpHeight = -bmpHeight;\n' +
        '          flip = false;\n' +
        '        }\n' +
        '\n' +
        '        w = bmpWidth;\n' +
        '        h = bmpHeight;\n' +
        '        if((x+w-1) >= tft.width())  w = tft.width()  - x;\n' +
        '        if((y+h-1) >= tft.height()) h = tft.height() - y;\n' +
        '\n' +
        '        for (row=0; row<h; row++) {\n' +
        '          if(flip)\n' +
        '            pos = bmpImageoffset + (bmpHeight - 1 - row) * rowSize;\n' +
        '          else\n' +
        '            pos = bmpImageoffset + row * rowSize;\n' +
        '          if(bmpFile.position() != pos) {\n' +
        '            bmpFile.seek(pos);\n' +
        '            buffidx = sizeof(sdbuffer);\n' +
        '          }\n' +
        '\n' +
        '          for (col=0; col<w; col++) {\n' +
        '            if (buffidx >= sizeof(sdbuffer)) {\n' +
        '              bmpFile.read(sdbuffer, sizeof(sdbuffer));\n' +
        '              buffidx = 0;\n' +
        '            }\n' +
        '            b = sdbuffer[buffidx++];\n' +
        '            g = sdbuffer[buffidx++];\n' +
        '            r = sdbuffer[buffidx++];\n' +
        '            tft.pushColor(tft.color565(r,g,b));\n' +
        '          }\n' +
        '        }\n' +
        '        Serial.print("Loaded in ");\n' +
        '        Serial.print(millis() - startTime);\n' +
        '        Serial.println(" ms");\n' +
        '      }\n' +
        '    }\n' +
        '  }\n' +
        '\n' +
        '  bmpFile.close();\n' +
        '  if(!goodBmp) Serial.println("BMP format not recognized.");\n' +
        '}\n' +
        '\n' +
        'uint16_t read16(File f) {\n' +
        '  uint16_t result;\n' +
        '  ((uint8_t *)&result)[0] = f.read();\n' +
        '  ((uint8_t *)&result)[1] = f.read();\n' +
        '  return result;\n' +
        '}\n' +
        '\n' +
        'uint32_t read32(File f) {\n' +
        '  uint32_t result;\n' +
        '  ((uint8_t *)&result)[0] = f.read();\n' +
        '  ((uint8_t *)&result)[1] = f.read();\n' +
        '  ((uint8_t *)&result)[2] = f.read();\n' +
        '  ((uint8_t *)&result)[3] = f.read();\n' +
        '  return result;\n' +
        '}'
    );

    generator.addMacro('BMP_BUFFER_SIZE', '#define BUFFERSIZE 20');

    var code = 'bmpDraw(' + filename + ', ' + x + ', ' + y + ');\n';
    return code;
};

// 获取触摸屏输入
Arduino.forBlock['tft_get_touch_point'] = function (block, generator) {
    var variable_x = generator.nameDB_.getName(block.getFieldValue('VAR_X'), 'VARIABLE');
    var variable_y = generator.nameDB_.getName(block.getFieldValue('VAR_Y'), 'VARIABLE');
    var variable_z = generator.nameDB_.getName(block.getFieldValue('VAR_Z'), 'VARIABLE');

    var code = 'TSPoint p = ts.getPoint();\n';
    code += 'pinMode(XM, OUTPUT);\n';
    code += 'pinMode(YP, OUTPUT);\n';
    code += variable_z + ' = p.z;\n';
    code += 'if (' + variable_z + ' > MINPRESSURE && ' + variable_z + ' < MAXPRESSURE) {\n';
    code += '  ' + variable_x + ' = map(p.x, TS_MINX, TS_MAXX, 0, tft.width());\n';
    code += '  ' + variable_y + ' = map(p.y, TS_MINY, TS_MAXY, 0, tft.height());\n';
    code += '}\n';

    return code;
};

// 检查触摸屏是否被按下
Arduino.forBlock['tft_touch_is_pressed'] = function (block, generator) {
    var code = 'TSPoint p = ts.getPoint();\n';
    code += 'pinMode(XM, OUTPUT);\n';
    code += 'pinMode(YP, OUTPUT);\n';
    code += '(p.z > MINPRESSURE && p.z < MAXPRESSURE)';

    return [code, generator.ORDER_RELATIONAL];
};

// 绘制按钮
Arduino.forBlock['tft_draw_button'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
    var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
    var color = block.getFieldValue('COLOR') || 'WHITE';
    var textColor = block.getFieldValue('TEXT_COLOR') || 'BLACK';

    var code = 'tft.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';
    code += 'tft.setTextColor(' + textColor + ');\n';
    code += 'tft.setTextSize(2);\n';
    code += 'tft.setCursor(' + x + ' + 5, ' + y + ' + (' + h + '/2) - 7);\n';
    code += 'tft.print(' + text + ');\n';

    return code;
};

// 检测按钮是否被按下
Arduino.forBlock['tft_button_is_pressed'] = function (block, generator) {
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
    var h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';

    var code = '({ TSPoint p = ts.getPoint(); \n';
    code += '  pinMode(XM, OUTPUT); \n';
    code += '  pinMode(YP, OUTPUT); \n';
    code += '  bool pressed = false; \n';
    code += '  if (p.z > MINPRESSURE && p.z < MAXPRESSURE) { \n';
    code += '    int16_t touchX = map(p.x, TS_MINX, TS_MAXX, 0, tft.width()); \n';
    code += '    int16_t touchY = map(p.y, TS_MINY, TS_MAXY, 0, tft.height()); \n';
    code += '    pressed = (touchX >= ' + x + ' && touchX <= (' + x + ' + ' + w + ') && \n';
    code += '             touchY >= ' + y + ' && touchY <= (' + y + ' + ' + h + ')); \n';
    code += '  } \n';
    code += '  pressed; })';

    return [code, generator.ORDER_FUNCTION_CALL];
};