Arduino.forBlock['esp32_i2s_init'] = function(block, generator) {
    const bclkPin = block.getFieldValue('BCLK');
    const wsPin = block.getFieldValue('WS');
    const dinPin = block.getFieldValue('DIN');
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    generator.addObject(`EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`, `EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`);
    
    return '';
};

Arduino.forBlock['esp32_i2s_begin'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const sampleRate = block.getFieldValue('SAMPLE_RATE');
    const bufferSize = block.getFieldValue('BUFFER_SIZE');
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    
    return `${objectName}.begin(${sampleRate}, ${bufferSize});\n`;
};

Arduino.forBlock['esp32_i2s_read_samples'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.readSamples();\n`;
};

Arduino.forBlock['esp32_i2s_get_level'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const levelType = block.getFieldValue('LEVEL_TYPE');
    
    let methodName;
    switch(levelType) {
        case 'average':
            methodName = 'getAverageLevel';
            break;
        case 'peak':
            methodName = 'getPeakLevel';
            break;
        case 'rms':
            methodName = 'getRMSLevel';
            break;
        case 'decibels':
            methodName = 'getDecibels';
            break;
        case 'percentage':
            methodName = 'getPercentage';
            break;
        default:
            methodName = 'getAverageLevel';
    }
    
    return [`${objectName}.${methodName}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_sound_detected'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const threshold = generator.valueToCode(block, 'THRESHOLD', Arduino.ORDER_NONE) || '1000';
    
    return [`${objectName}.isSoundDetected(${threshold})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_quality'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getQualityLevel()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_get_freq_energy'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    const freqBand = block.getFieldValue('FREQ_BAND');
    
    let methodName;
    switch(freqBand) {
        case 'low':
            methodName = 'getLowFreqEnergy';
            break;
        case 'mid':
            methodName = 'getMidFreqEnergy';
            break;
        case 'high':
            methodName = 'getHighFreqEnergy';
            break;
        default:
            methodName = 'getLowFreqEnergy';
    }
    
    return [`${objectName}.${methodName}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_calibrate'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return `${objectName}.calibrateNoiseFloor();\n`;
};

Arduino.forBlock['esp32_i2s_get_snr'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.getSNR()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_is_ready'] = function(block, generator) {
    const objectName = generator.nameDB_.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
    
    return [`${objectName}.isReady()`, Arduino.ORDER_FUNCTION_CALL];
};

// 简化版本的I2S块 - 自动处理初始化和采样
Arduino.forBlock['esp32_i2s_simple_init'] = function(block, generator) {
    const bclkPin = block.getFieldValue('BCLK');
    const wsPin = block.getFieldValue('WS');
    const dinPin = block.getFieldValue('DIN');
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    generator.addObject(`EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`, `EspI2S microphone(${bclkPin}, ${wsPin}, ${dinPin});`);
    generator.addSetupBegin('esp32_i2s_auto_init', 'microphone.begin(16000, 1024);');
    
    return '';
};

Arduino.forBlock['esp32_i2s_simple_detect'] = function(block, generator) {
    const bclkPin = block.getFieldValue('BCLK');
    const wsPin = block.getFieldValue('WS');
    const dinPin = block.getFieldValue('DIN');
    const threshold = generator.valueToCode(block, 'THRESHOLD', Arduino.ORDER_NONE) || '1000';
    
    const micName = `mic_${bclkPin}_${wsPin}_${dinPin}`;
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    generator.addObject(`EspI2S ${micName}(${bclkPin}, ${wsPin}, ${dinPin});`, `EspI2S ${micName}(${bclkPin}, ${wsPin}, ${dinPin});`);
    generator.addSetupBegin(`${micName}_init`, `${micName}.begin(16000, 1024);`);
    
    // 添加辅助函数来读取并检测声音
    const funcName = `${micName}_soundDetected`;
    generator.addFunction(funcName, `
bool ${funcName}(int threshold) {
    ${micName}.readSamples();
    return ${micName}.isSoundDetected(threshold);
}`);
    
    return [`${funcName}(${threshold})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_i2s_simple_level'] = function(block, generator) {
    const bclkPin = block.getFieldValue('BCLK');
    const wsPin = block.getFieldValue('WS');
    const dinPin = block.getFieldValue('DIN');
    const levelType = block.getFieldValue('LEVEL_TYPE');
    
    const micName = `mic_${bclkPin}_${wsPin}_${dinPin}`;
    
    generator.addLibrary('#include "Esp_I2S.h"', '#include "Esp_I2S.h"');
    generator.addObject(`EspI2S ${micName}(${bclkPin}, ${wsPin}, ${dinPin});`, `EspI2S ${micName}(${bclkPin}, ${wsPin}, ${dinPin});`);
    generator.addSetupBegin(`${micName}_init`, `${micName}.begin(16000, 1024);`);
    
    let methodName;
    switch(levelType) {
        case 'average':
            methodName = 'getAverageLevel';
            break;
        case 'peak':
            methodName = 'getPeakLevel';
            break;
        case 'rms':
            methodName = 'getRMSLevel';
            break;
        case 'decibels':
            methodName = 'getDecibels';
            break;
        case 'percentage':
            methodName = 'getPercentage';
            break;
        default:
            methodName = 'getPercentage';
    }
    
    // 添加辅助函数来读取并获取电平
    const funcName = `${micName}_get${levelType.charAt(0).toUpperCase() + levelType.slice(1)}`;
    generator.addFunction(funcName, `
float ${funcName}() {
    ${micName}.readSamples();
    return ${micName}.${methodName}();
}`);
    
    return [`${funcName}()`, Arduino.ORDER_FUNCTION_CALL];
};
