// BH1750光照传感器库的代码生成器

// 添加库和变量声明
function ensureBH1750Setup(varName, address, generator) {
  // 使用固定的变量名，避免乱码问题
  const fixedVarName = "lightMeter";
  
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addLibrary('bh1750', '#include <BH1750.h>');
  
  // 使用固定的变量名和标识符
  generator.addVariable('bh1750_sensor', `BH1750 ${fixedVarName}(${address});`);
  
  return fixedVarName; // 返回使用的变量名，供后续引用
}

// 注册 BH1750 扩展 - 根据板子类型决定是否显示 I2C 引脚选择
// 避免重复加载
if (Blockly.Extensions.isRegistered('bh1750_init_extension')) {
  Blockly.Extensions.unregister('bh1750_init_extension');
}

Blockly.Extensions.register('bh1750_init_extension', function() {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断是否为 Arduino 核心
  var isArduino = boardCore.indexOf('arduino') > -1 || 
                  boardName.indexOf('arduino') > -1 || 
                  boardName.indexOf('uno') > -1 || 
                  boardName.indexOf('nano') > -1 || 
                  boardName.indexOf('mega') > -1;
  
  // 获取 input_dummy 的引用
  var dummyInput = this.getInput('I2C_PINS');
  
  if (!isArduino) {
    // 对于非Arduino板卡，添加 I2C 引脚选择下拉菜单
    dummyInput.appendField('使用');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Wire1 (SDA:8, SCL:9)', 'WIRE1'],
      ['Wire2 (SDA:4, SCL:5)', 'WIRE2']
    ]), 'WIRE_OPTION');
  } else {
    // 对于 Arduino，使用默认引脚 SDA:A4, SCL:A5，不可选择
    dummyInput.appendField('使用默认引脚 (SDA:A4, SCL:A5)');
    
    // 添加一个不可见的字段，以便在生成器中使用
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable('WIRE_A4_A5'), 'WIRE_OPTION')
      .setVisible(false);
  }
});

// BH1750统一初始化函数 - 根据板卡类型自动适配
Arduino.forBlock['bh1750_init'] = function(block, generator) {
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE1'; // 默认值
  const address = block.getFieldValue('ADDRESS') || '0x23';
  
  // 添加必要的库
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('BH1750', '#include <BH1750.h>');
  
  // 使用固定的变量名
  const varName = generator.sensorVarName || "lightMeter";
  
  // 添加BH1750对象变量
  generator.addVariable('bh1750_sensor', `BH1750 ${varName}(${address});`);
  
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型 (更可靠的检测方法)
  var isArduinoCore = boardCore.indexOf('arduino') > -1 || 
                     boardName.indexOf('arduino') > -1 || 
                     boardName.indexOf('uno') > -1 || 
                     boardName.indexOf('nano') > -1 || 
                     boardName.indexOf('mega') > -1;
                     
  var isESP32Core = boardCore.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp') > -1;
                   
  var isESP8266Core = boardCore.indexOf('esp8266') > -1 || 
                     boardName.indexOf('esp8266') > -1;
  
  // 调试信息
  console.log('BH1750 Init: 开发板信息:', boardConfig);
  console.log('BH1750 Init: 核心类型:', boardCore);
  console.log('BH1750 Init: 板名:', boardName);
  console.log('BH1750 Init: isArduinoCore:', isArduinoCore);
  console.log('BH1750 Init: isESP32Core:', isESP32Core);
  console.log('BH1750 Init: isESP8266Core:', isESP8266Core);
  console.log('BH1750 Init: wireOption:', wireOption);
  
  // 初始化I2C总线
  var setupCode = '// 配置I2C引脚并初始化BH1750传感器\n';
  setupCode += 'Serial.println("BH1750初始化...");\n';
  
  if (isArduinoCore) {
    // Arduino核心固定使用 SDA:A4, SCL:A5
    setupCode += 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n';
    setupCode += 'Serial.println("Arduino板卡使用默认引脚: SDA=A4, SCL=A5");\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire2 SDA:4, SCL:5 (ESP32核心)\n';
      setupCode += 'Serial.println("ESP32使用Wire2 (SDA:4, SCL:5)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire1 SDA:8, SCL:9 (ESP32核心)\n';
      setupCode += 'Serial.println("ESP32使用Wire1 (SDA:8, SCL:9)");\n';
    }
  } else if (isESP8266Core) {
    // ESP8266核心，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire2 SDA:4, SCL:5 (ESP8266核心)\n';
      setupCode += 'Serial.println("ESP8266使用Wire2 (SDA:4, SCL:5)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire1 SDA:8, SCL:9 (ESP8266核心)\n';
      setupCode += 'Serial.println("ESP8266使用Wire1 (SDA:8, SCL:9)");\n';
    }
  } else {
    // 其他非Arduino核心，根据Wire选项初始化
    if (wireOption === 'WIRE2') {
      setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire2 SDA:4, SCL:5 (其他核心)\n';
      setupCode += 'Serial.println("其他板卡使用Wire2 (SDA:4, SCL:5)");\n';
    } else { // WIRE1 或默认
      setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire1 SDA:8, SCL:9 (其他核心)\n';
      setupCode += 'Serial.println("其他板卡使用Wire1 (SDA:8, SCL:9)");\n';
    }
  }
  
  // 添加BH1750初始化代码
  setupCode += `
// 初始化BH1750光照传感器
if (${varName}.begin()) {
  Serial.println("BH1750传感器初始化成功!");
} else {
  Serial.println("警告: BH1750传感器初始化失败，请检查接线!");
}
`;

  generator.addSetup('bh1750_init', setupCode);
  
  // 保存变量名，方便后续块使用
  generator.sensorVarName = varName;
  
  return '';
};


// 初始化或开始
Arduino.forBlock['bh1750_begin'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const mode = block.getFieldValue('MODE') || 'BH1750::CONTINUOUS_HIGH_RES_MODE';
  const address = block.getFieldValue('ADDRESS') || '0x23';
  const wire = block.getFieldValue('WIRE');
  ensureBH1750Setup(varName, address, generator);
  let code;
  if (wire && wire !== 'Wire') {
    code = `${varName}.begin(${mode}, ${address}, &${wire});\n`;
  } else if (address && address !== '0x23') {
    code = `${varName}.begin(${mode}, ${address});\n`;
  } else {
    code = `${varName}.begin(${mode});\n`;
  }
  generator.addSetup(`bh1750_begin_${varName}`, code);
  return '';
};

// 读取光照强度
Arduino.forBlock['bh1750_read_light_level'] = function(block, generator) {
  // 使用固定的变量名
  const varName = generator.sensorVarName || "lightMeter";
  
  return [`${varName}.readLightLevel()`, Arduino.ORDER_FUNCTION_CALL];
};
