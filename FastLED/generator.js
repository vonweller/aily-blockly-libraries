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
    return [color, generator.ORDER_ATOMIC];
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