// HT16K33 Generator for Arduino
// 避免重复加载
if (typeof Arduino === 'undefined') {
    var Arduino = {};
    Arduino.forBlock = {};
}

// 自动初始化函数
Arduino.ht16k33AutoInit = function(generator, address = '0x70') {
    // 添加库文件
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "HT16K33.h"', '#include "HT16K33.h"');
    
    // 添加对象声明  
    generator.addObject('HT16K33 seg(' + address + ')', 'HT16K33 seg(' + address + ');');
    
    // 添加初始化代码到setup
    generator.addSetupBegin('ht16k33_begin', '  Wire.begin();\n  Wire.setClock(100000);\n  seg.begin();\n  seg.displayOn();\n  seg.setBrightness(8);');
};

// 初始化HT16K33
Arduino.forBlock['ht16k33_init'] = function(block, generator) {
    const address = block.getFieldValue('ADDRESS');
    Arduino.ht16k33AutoInit(generator, address);
    return '';
};

// 简化显示块 - 自动判断数据类型
Arduino.forBlock['ht16k33_simple_display'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    // 生成智能显示代码
    return `// 自动选择显示格式
if (${value} == (int)${value} && ${value} >= -999 && ${value} <= 9999) {
  seg.displayInt(${value});
} else {
  seg.displayFloat(${value}, 2);
}
`;
};

// 显示温度
Arduino.forBlock['ht16k33_display_temperature'] = function(block, generator) {
    const temp = generator.valueToCode(block, 'TEMP', generator.ORDER_ATOMIC) || '25.0';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return `seg.displayFloat(${temp}, 1);
delay(1000);
seg.displayClear();
delay(200);
// 显示度数符号
uint8_t degreeSegments[4] = {0x63, 0x00, 0x00, 0x38}; // °C
seg.displayRaw(degreeSegments);
delay(1000);
`;
};

// 显示电压
Arduino.forBlock['ht16k33_display_voltage'] = function(block, generator) {
    const voltage = generator.valueToCode(block, 'VOLTAGE', generator.ORDER_ATOMIC) || '3.3';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return `seg.displayFloat(${voltage}, 2);
`;
};

// 时钟显示（带闪烁冒号）
Arduino.forBlock['ht16k33_clock_display'] = function(block, generator) {
    const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '12';
    const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
    const blink = block.getFieldValue('BLINK') === 'TRUE';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    if (blink) {
        return `seg.displayTime(${hour}, ${minute}, true);
delay(500);
seg.displayTime(${hour}, ${minute}, false);
delay(500);
`;
    } else {
        return `seg.displayTime(${hour}, ${minute}, true);
`;
    }
};

// 倒计时显示
Arduino.forBlock['ht16k33_countdown'] = function(block, generator) {
    const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '60';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return `seg.displaySeconds(${seconds}, true);
`;
};

// 显示整数
Arduino.forBlock['ht16k33_display_int'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayInt(' + value + ');\n';
};

// 显示浮点数
Arduino.forBlock['ht16k33_display_float'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0.0';
    const decimals = block.getFieldValue('DECIMALS');
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayFloat(' + value + ', ' + decimals + ');\n';
};

// 显示十六进制
Arduino.forBlock['ht16k33_display_hex'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayHex(' + value + ');\n';
};

// 显示时间
Arduino.forBlock['ht16k33_display_time'] = function(block, generator) {
    const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
    const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
    const colon = block.getFieldValue('COLON') === 'TRUE' ? 'true' : 'false';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayTime(' + hour + ', ' + minute + ', ' + colon + ');\n';
};

// 显示日期
Arduino.forBlock['ht16k33_display_date'] = function(block, generator) {
    const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
    const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayDate(' + month + ', ' + day + ');\n';
};

// 清屏
Arduino.forBlock['ht16k33_display_clear'] = function(block, generator) {
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayClear();\n';
};

// 设置亮度
Arduino.forBlock['ht16k33_set_brightness'] = function(block, generator) {
    const brightness = generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC) || '8';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    // 限制亮度范围
    return `int brightness = constrain(${brightness}, 0, 15);
seg.setBrightness(brightness);
`;
};

// 设置闪烁
Arduino.forBlock['ht16k33_set_blink'] = function(block, generator) {
    const blink = block.getFieldValue('BLINK');
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.setBlink(' + blink + ');\n';
};

// 显示开关
Arduino.forBlock['ht16k33_display_on_off'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    if (state === 'ON') {
        return 'seg.displayOn();\n';
    } else {
        return 'seg.displayOff();\n';
    }
};

// 冒号控制
Arduino.forBlock['ht16k33_display_colon'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayColon(' + state + ');\n';
};

// 显示测试
Arduino.forBlock['ht16k33_display_test'] = function(block, generator) {
    const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '100';
    
    // 自动初始化
    Arduino.ht16k33AutoInit(generator);
    
    return 'seg.displayTest(' + delay + ');\n';
};
