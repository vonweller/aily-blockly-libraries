// 注册 SHT30 扩展 - 根据板子类型决定是否显示 I2C 引脚选择
// 避免重复加载
if (Blockly.Extensions.isRegistered('sht30_init_extension')) {
  Blockly.Extensions.unregister('sht30_init_extension');
}

Blockly.Extensions.register('sht30_init_extension', function() {
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
      ['Wire1 (SDA:8, SCL:9)', 'WIRE_8_9'],
      ['Wire2 (SDA:4, SCL:5)', 'WIRE_4_5']
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

// SHT30统一初始化函数 - 根据板卡类型自动适配
Arduino.forBlock['sht30_init'] = function (block, generator) {
    var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE_8_9'; // 默认值
    
    // 添加必要的库
    generator.addLibrary('Wire', '#include <Wire.h>');
    
    // 添加传感器地址定义
    generator.addVariable('sht30_addr', '#define SHT30_ADDR 0x44 // SHT30默认I2C地址');
    
    // 添加全局变量定义
    generator.addVariable('sht30_temperature', 'float sht30_temperature = 0.0; // SHT30温度值');
    generator.addVariable('sht30_humidity', 'float sht30_humidity = 0.0; // SHT30湿度值');
    
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
    console.log('SHT30 Init: 开发板信息:', boardConfig);
    console.log('SHT30 Init: 核心类型:', boardCore);
    console.log('SHT30 Init: 板名:', boardName);
    console.log('SHT30 Init: isArduinoCore:', isArduinoCore);
    console.log('SHT30 Init: isESP32Core:', isESP32Core);
    console.log('SHT30 Init: isESP8266Core:', isESP8266Core);
    console.log('SHT30 Init: wireOption:', wireOption);
    
    // 初始化I2C总线
    var setupCode = '// 配置I2C引脚并初始化SHT30传感器\n';
    setupCode += 'Serial.println("SHT30初始化...");\n';
    
    if (isArduinoCore) {
        // Arduino核心固定使用 SDA:A4, SCL:A5
        setupCode += 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n';
        setupCode += 'Serial.println("Arduino板卡使用默认引脚: SDA=A4, SCL=A5");\n';
    } else if (isESP32Core) {
        // ESP32核心，根据Wire选项初始化
        if (wireOption === 'WIRE_4_5') {
            setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire1 SDA:4, SCL:5 (ESP32核心)\n';
            setupCode += 'Serial.println("ESP32使用Wire1 (SDA:4, SCL:5)");\n';
        } else { // WIRE_8_9 或默认
            setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire2 SDA:8, SCL:9 (ESP32核心)\n';
            setupCode += 'Serial.println("ESP32使用Wire2 (SDA:8, SCL:9)");\n';
        }
    } else if (isESP8266Core) {
        // ESP8266核心，根据Wire选项初始化
        if (wireOption === 'WIRE_4_5') {
            setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire1 SDA:4, SCL:5 (ESP8266核心)\n';
            setupCode += 'Serial.println("ESP8266使用Wire1 (SDA:4, SCL:5)");\n';
        } else { // WIRE_8_9 或默认
            setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire2 SDA:8, SCL:9 (ESP8266核心)\n';
            setupCode += 'Serial.println("ESP8266使用Wire2 (SDA:8, SCL:9)");\n';
        }
    } else {
        // 其他非Arduino核心，根据Wire选项初始化
        if (wireOption === 'WIRE_4_5') {
            setupCode += 'Wire.begin(4, 5);  // 初始化硬件 I2C，Wire1 SDA:4, SCL:5 (其他核心)\n';
            setupCode += 'Serial.println("其他板卡使用Wire1 (SDA:4, SCL:5)");\n';
        } else { // WIRE_8_9 或默认
            setupCode += 'Wire.begin(8, 9);  // 初始化硬件 I2C，Wire2 SDA:8, SCL:9 (其他核心)\n';
            setupCode += 'Serial.println("其他板卡使用Wire2 (SDA:8, SCL:9)");\n';
        }
    }
    
    // 检查SHT30传感器连接
    setupCode += `
// 检查SHT30是否连接
Wire.beginTransmission(SHT30_ADDR);
byte error = Wire.endTransmission();
if (error == 0) {
  Serial.println("SHT30传感器连接成功!");
} else {
  Serial.print("SHT30传感器连接失败，错误码: ");
  Serial.println(error);
  Serial.println("请检查接线和地址设置!");
}
`;

    generator.addSetup('sht30_init', setupCode);
    return '';
};

// 读取SHT30传感器数据（清理重复代码，只保留一个版本）
Arduino.forBlock['sht30_read_data'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('Wire', '#include <Wire.h>');
    
    // 确保全局变量已定义
    generator.addVariable('sht30_temperature', 'float sht30_temperature = 0.0; // SHT30温度值');
    generator.addVariable('sht30_humidity', 'float sht30_humidity = 0.0; // SHT30湿度值');
    
    var code = `// 读取SHT30传感器数据
unsigned int sht30_data[6];

// 发送测量命令
Wire.beginTransmission(SHT30_ADDR);
Wire.write(0x2C); // 测量命令
Wire.write(0x06); // 高重复性测量
Wire.endTransmission();
delay(50); // 给传感器一些时间进行测量

// 读取数据
Wire.requestFrom(SHT30_ADDR, 6);
if (Wire.available() == 6) {
  sht30_data[0] = Wire.read();
  sht30_data[1] = Wire.read();
  sht30_data[2] = Wire.read(); // CRC校验字节
  sht30_data[3] = Wire.read();
  sht30_data[4] = Wire.read();
  sht30_data[5] = Wire.read(); // CRC校验字节
  
  // 计算温度和湿度值
  sht30_temperature = ((((sht30_data[0] * 256.0) + sht30_data[1]) * 175) / 65535.0) - 45;
  sht30_humidity = ((((sht30_data[3] * 256.0) + sht30_data[4]) * 100) / 65535.0);
} else {
  // 数据读取失败
  sht30_temperature = -999.0;
  sht30_humidity = -999.0;
  Serial.println("无法读取SHT30数据");
}
`;

    return code;
};

// 读取SHT30温度
Arduino.forBlock['sht30_read_temperature'] = function (block, generator) {
    var code = 'sht30_temperature';
    return [code, Arduino.ORDER_ATOMIC];
};

// 读取SHT30湿度
Arduino.forBlock['sht30_read_humidity'] = function (block, generator) {
    var code = 'sht30_humidity';
    return [code, Arduino.ORDER_ATOMIC];
};

// 检查SHT30是否连接
Arduino.forBlock['sht30_is_connected'] = function (block, generator) {
    var code = `(Wire.beginTransmission(SHT30_ADDR) == 0 && Wire.endTransmission() == 0)`;
    return [code, Arduino.ORDER_ATOMIC];
};