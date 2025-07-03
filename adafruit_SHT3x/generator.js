// SHT31 温湿度传感器 Generator
Arduino.forBlock['sht31_init'] = function (block, generator) {
    const address = block.getFieldValue('ADDRESS');

    // 添加库文件
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');

    // 添加全局变量
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 添加初始化代码到setup
    const initCode = `  if (!sht31.begin(${address})) {
    Serial.println("找不到SHT31传感器!");
  }`;
    generator.addSetupBegin('sht31_init', initCode);

    return '';
};

Arduino.forBlock['sht31_read_temperature'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return ['sht31.readTemperature()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_read_humidity'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return ['sht31.readHumidity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_read_both'] = function (block, generator) {
    const tempVar = generator.nameDB_.getName(block.getFieldValue('TEMP_VAR'), 'VARIABLE');
    const humVar = generator.nameDB_.getName(block.getFieldValue('HUM_VAR'), 'VARIABLE');
    addVariableToToolbox(block, tempVar);
    addVariableToToolbox(block, humVar);
    generator.addVariable(tempVar, 'float ' + tempVar + ';');
    generator.addVariable(humVar, 'float ' + humVar + ';');
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    const code = `${tempVar} = sht31.readTemperature();\n${humVar} = sht31.readHumidity();`;

    return code + '\n';
};

Arduino.forBlock['sht31_heater_control'] = function (block, generator) {
    const state = block.getFieldValue('STATE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return `sht31.heater(${state});\n`;
};

Arduino.forBlock['sht31_is_heater_enabled'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return ['sht31.isHeaterEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sht31_reset'] = function (block, generator) {
    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    return 'sht31.reset();\n';
};

Arduino.forBlock['sht31_simple_read'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');

    // 确保已初始化
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SHT31.h"', '#include "Adafruit_SHT31.h"');
    generator.addObject('Adafruit_SHT31 sht31 = Adafruit_SHT31();', 'Adafruit_SHT31 sht31 = Adafruit_SHT31();');

    // 自动初始化（简化版本）
    const initCode = `  if (!sht31.begin(0x44)) {
    Serial.println("找不到SHT31传感器!");
  }`;
    generator.addSetupBegin('sht31_auto_init', initCode);

    if (type === 'temperature') {
        return ['sht31.readTemperature()', generator.ORDER_ATOMIC];
    } else {
        return ['sht31.readHumidity()', generator.ORDER_ATOMIC];
    }
};
