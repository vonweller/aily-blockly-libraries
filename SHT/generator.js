// SHT30统一初始化函数 - 根据板卡类型自动适配
Arduino.forBlock['sht30_init'] = function (block, generator) {
    var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE_8_9'; // 默认值
    
    // 添加必要的库
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('SHT3x', '#include "SHT3x.h"');
    
    // 获取开发板配置信息
    var boardConfig = window['boardConfig'] || {};
    var boardCore = (boardConfig.core || '').toLowerCase();
    var boardName = (boardConfig.name || '').toLowerCase();
    
    // 判断开发板类型
    var isArduinoCore = boardCore.indexOf('arduino') > -1 || 
                       boardName.indexOf('arduino') > -1 || 
                       boardName.indexOf('uno') > -1 || 
                       boardName.indexOf('nano') > -1 || 
                       boardName.indexOf('mega') > -1;
    
    // 初始化I2C总线
    var setupCode = '// 配置I2C引脚并初始化SHT30传感器\n';
    setupCode += 'Serial.println("SHT30初始化...");\n';
    
    if (isArduinoCore) {
        setupCode += 'sht30_init_i2c(); // Arduino使用默认引脚 SDA:A4, SCL:A5\n';
        setupCode += 'Serial.println("Arduino板卡使用默认引脚: SDA=A4, SCL=A5");\n';
    } else {
        if (wireOption === 'WIRE_4_5') {
            setupCode += 'sht30_init_i2c(4, 5); // ESP32/ESP8266使用 SDA:4, SCL:5\n';
            setupCode += 'Serial.println("使用引脚 SDA:4, SCL:5");\n';
        } else {
            setupCode += 'sht30_init_i2c(); // ESP32/ESP8266使用 SDA:8, SCL:9\n';
            setupCode += 'Serial.println("使用引脚 SDA:8, SCL:9");\n';
        }
    }

    generator.addSetup('sht30_init', setupCode);
    return '';
};

// 读取SHT30传感器数据 - 简化版
Arduino.forBlock['sht30_read_data'] = function (block, generator) {
    generator.addLibrary('SHT3x', '#include "SHT3x.h"');
    return 'sht30_read_data();\n';
};

// 读取SHT30温度 - 简化版
Arduino.forBlock['sht30_read_temperature'] = function (block, generator) {
    generator.addLibrary('SHT3x', '#include "SHT3x.h"');
    return ['sht30_get_temperature()', Arduino.ORDER_FUNCTION_CALL];
};

// 读取SHT30湿度 - 简化版
Arduino.forBlock['sht30_read_humidity'] = function (block, generator) {
    generator.addLibrary('SHT3x', '#include "SHT3x.h"');
    return ['sht30_get_humidity()', Arduino.ORDER_FUNCTION_CALL];
};