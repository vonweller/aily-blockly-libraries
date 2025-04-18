Arduino.forBlock['fastled_init'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const type = block.getFieldValue('TYPE');
    const dataPin = block.getFieldValue('DATA_PIN');
    const numLeds = block.getFieldValue('NUM_LEDS');

    generator.addLibrary('#include <FastLED.h>', '#include <FastLED.h>');
    generator.addVariable(`#define NUM_LEDS ${numLeds}`, `#define NUM_LEDS ${numLeds}`);
    generator.addVariable(`#define DATA_PIN ${dataPin}`, `#define DATA_PIN ${dataPin}`);

    generator.addVariable(`CRGB ${strip}[NUM_LEDS]`, `CRGB ${strip}[NUM_LEDS];`);

    let code = '';

    // 根据不同类型LED选择不同的初始化方法
    if (type === 'WS2801') {
        code = `FastLED.addLeds<WS2801, DATA_PIN, RGB>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'APA102') {
        code = `FastLED.addLeds<APA102, DATA_PIN, BGR>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'LPD8806') {
        code = `FastLED.addLeds<LPD8806, DATA_PIN, RGB>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'NEOPIXEL') {
        code = `FastLED.addLeds<NEOPIXEL, DATA_PIN>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'WS2812') {
        code = `FastLED.addLeds<WS2812, DATA_PIN, GRB>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'WS2812B') {
        code = `FastLED.addLeds<WS2812B, DATA_PIN, GRB>(${strip}, NUM_LEDS);\n`;
    } else if (type === 'WS2811') {
        code = `FastLED.addLeds<WS2811, DATA_PIN, RGB>(${strip}, NUM_LEDS);\n`;
    } else {
        code = `FastLED.addLeds<${type}, DATA_PIN, RGB>(${strip}, NUM_LEDS);\n`;
    }

    generator.addSetup(`FastLED.init_${strip}`, code);
    return '';
};

Arduino.forBlock['fastled_set_pixel'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const pixel = generator.valueToCode(block, 'PIXEL', generator.ORDER_ATOMIC);
    const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC);

    return `${strip}[${pixel}] = ${color};\n`;
};

Arduino.forBlock['fastled_show'] = function (block, generator) {
    return 'FastLED.show();\n';
};

Arduino.forBlock['fastled_clear'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    return `fill_solid(${strip}, NUM_LEDS, CRGB::Black);\n`;
};

Arduino.forBlock['fastled_brightness'] = function (block, generator) {
    const brightness = generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC);
    return `FastLED.setBrightness(${brightness});\n`;
};

Arduino.forBlock['fastled_rgb'] = function (block, generator) {
    const red = generator.valueToCode(block, 'RED', generator.ORDER_ATOMIC);
    const green = generator.valueToCode(block, 'GREEN', generator.ORDER_ATOMIC);
    const blue = generator.valueToCode(block, 'BLUE', generator.ORDER_ATOMIC);

    return [`CRGB(${red}, ${green}, ${blue})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['fastled_preset_color'] = function (block, generator) {
    const color = block.getFieldValue('COLOR');
    
    // 解析十六进制颜色
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // RGB 转 HSV 算法
    // 这里实现RGB到HSV的转换，注意FastLED使用的HSV范围是0-255
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, v = max;
    
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    
    if (max === min) {
        h = 0; // 无色调
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    
    // 将HSV值调整到FastLED使用的范围
    const hsvH = Math.round(h * 255);
    const hsvS = Math.round(s * 255);
    const hsvV = Math.round(v);
    
    return [`CHSV(${hsvH}, ${hsvS}, ${hsvV})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['fastled_fill_solid'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC);

    return `fill_solid(${strip}, NUM_LEDS, ${color});\n`;
};

Arduino.forBlock['fastled_hsv'] = function (block, generator) {
    const hue = generator.valueToCode(block, 'HUE', generator.ORDER_ATOMIC);
    const saturation = generator.valueToCode(block, 'SATURATION', generator.ORDER_ATOMIC);
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC);

    return [`CHSV(${hue}, ${saturation}, ${value})`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['fastled_rainbow'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const initialHue = generator.valueToCode(block, 'INITIAL_HUE', generator.ORDER_ATOMIC);
    const deltaHue = generator.valueToCode(block, 'DELTA_HUE', generator.ORDER_ATOMIC);

    return `fill_rainbow(${strip}, NUM_LEDS, ${initialHue}, ${deltaHue});\n`;
};

Arduino.forBlock['fastled_fire_effect'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const heat = generator.valueToCode(block, 'HEAT', generator.ORDER_ATOMIC);
    const cooling = generator.valueToCode(block, 'COOLING', generator.ORDER_ATOMIC);

    // 添加火焰效果所需变量
    generator.addVariable(`byte heat[NUM_LEDS]`, `byte heat[NUM_LEDS];`);
    
    // 添加Fire2012函数
    const fireFunc = `
void Fire2012(CRGB* leds, byte heat_value, byte cooling_value) {
  // 冷却系数
  int cooling = cooling_value;
  
  // 火焰上升速度
  int sparking = heat_value;
  
  // 每个LED的热量值冷却
  for(int i = 0; i < NUM_LEDS; i++) {
    heat[i] = qsub8(heat[i], random8(0, ((cooling * 10) / NUM_LEDS) + 2));
  }
  
  // 热量从下向上扩散
  for(int k = NUM_LEDS - 1; k >= 2; k--) {
    heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2]) / 3;
  }
  
  // 底部随机产生新的热量
  if(random8() < sparking) {
    int y = random8(7);
    heat[y] = qadd8(heat[y], random8(160, 255));
  }

  // 将热量映射到LED颜色
  for(int j = 0; j < NUM_LEDS; j++) {
    CRGB color = HeatColor(heat[j]);
    leds[j] = color;
  }
}`;

    generator.addFunction('Fire2012', fireFunc);
    
    return `Fire2012(${strip}, ${heat}, ${cooling});\n`;
};

Arduino.forBlock['fastled_meteor'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC);
    const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC);
    const decay = generator.valueToCode(block, 'DECAY', generator.ORDER_ATOMIC);
    const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC);
    
    // 添加流星效果所需变量
    generator.addVariable(`int meteorPosition = 0`, `int meteorPosition = 0;`);
    
    // 添加流星效果函数
    const meteorFunc = `
void meteorEffect(CRGB* leds, CRGB color, int meteorSize, byte decay, int speed) {
  // 淡化所有LED
  for(int i = 0; i < NUM_LEDS; i++) {
    if(random8() < decay) {
      leds[i].fadeToBlackBy(decay);
    }
  }
  
  // 绘制流星
  for(int i = 0; i < meteorSize; i++) {
    if((meteorPosition - i < NUM_LEDS) && (meteorPosition - i >= 0)) {
      leds[meteorPosition - i] = color;
      leds[meteorPosition - i].fadeToBlackBy(i * (255 / meteorSize));
    }
  }
  
  // 移动流星位置
  meteorPosition = (meteorPosition + speed) % (NUM_LEDS + meteorSize);
}`;
    
    generator.addFunction('meteorEffect', meteorFunc);
    
    return `meteorEffect(${strip}, ${color}, ${size}, ${decay}, ${speed});\n`;
};

Arduino.forBlock['fastled_palette_cycle'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const palette = block.getFieldValue('PALETTE');
    const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC);
    
    // 添加调色板循环所需变量
    generator.addVariable(`uint8_t paletteIndex = 0`, `uint8_t paletteIndex = 0;`);
    
    // 添加调色板循环函数
    const paletteFunc = `
void cyclePalette(CRGB* leds, CRGBPalette16 palette, uint8_t speed, uint8_t& index) {
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = ColorFromPalette(palette, index + (i * 255 / NUM_LEDS));
  }
  index += speed;
}`;
    
    generator.addFunction('cyclePalette', paletteFunc);
    
    return `cyclePalette(${strip}, ${palette}, ${speed}, paletteIndex);\n`;
};

Arduino.forBlock['fastled_breathing'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC);
    const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC);
    
    // 添加呼吸灯效果所需变量
    generator.addVariable(`uint8_t breathBrightness = 128`, `uint8_t breathBrightness = 128;`);
    generator.addVariable(`int8_t breathDirection = 1`, `int8_t breathDirection = 1;`);
    
    // 添加呼吸灯效果函数
    const breathFunc = `
void breathingEffect(CRGB* leds, CRGB color, uint8_t speed, uint8_t& brightness, int8_t& direction) {
  // 填充所有LED为基本颜色
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = color;
  }
  
  // 调整亮度
  FastLED.setBrightness(brightness);
  
  // 更新亮度值和方向
  brightness += direction * speed;
  
  // 检查边界并改变方向
  if(brightness >= 250 || brightness <= 5) {
    direction = -direction;
  }
}`;
    
    generator.addFunction('breathingEffect', breathFunc);
    
    return `breathingEffect(${strip}, ${color}, ${speed}, breathBrightness, breathDirection);\n`;
};

Arduino.forBlock['fastled_twinkle'] = function (block, generator) {
    const strip = generator.getVariableName(block.getFieldValue('STRIP'));
    const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC);
    const background = generator.valueToCode(block, 'BACKGROUND', generator.ORDER_ATOMIC);
    const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC);
    
    // 添加闪烁效果函数
    const twinkleFunc = `
void twinkleEffect(CRGB* leds, uint8_t count, CRGB bgColor, CRGB twinkleColor) {
  // 设置背景颜色
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = bgColor;
  }
  
  // 随机点亮一些LED
  for(int i = 0; i < count; i++) {
    int pos = random16(NUM_LEDS);
    leds[pos] = twinkleColor;
  }
}`;
    
    generator.addFunction('twinkleEffect', twinkleFunc);
    
    return `twinkleEffect(${strip}, ${count}, ${background}, ${color});\n`;
};