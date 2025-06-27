// 初始化SHT30传感器 - 使用boardConfig判断板卡
Arduino.forBlock['sht30_init'] = function (block, generator) {
    // 获取SDA和SCL引脚（仅用于ESP32等支持自定义引脚的板卡）
    const sdaPin = generator.valueToCode(block, 'SDA_PIN', Arduino.ORDER_ATOMIC) || '4';
    const sclPin = generator.valueToCode(block, 'SCL_PIN', Arduino.ORDER_ATOMIC) || '5';
    
    // 添加必要的库
    generator.addLibrary('wire', '#include <Wire.h>');
    
    // 添加传感器地址定义
    generator.addVariable('sht30_addr', '#define SHT30_ADDR 0x44 // SHT30默认I2C地址');
    
    // 添加全局变量定义
    generator.addVariable('sht30_temperature', 'float sht30_temperature = 0.0; // SHT30温度值');
    generator.addVariable('sht30_humidity', 'float sht30_humidity = 0.0; // SHT30湿度值');
    
    // 初始化代码
    let setupCode = '// 初始化I2C通信\n';
    
    // 使用boardConfig判断板卡类型
    if (window['boardConfig'] && window['boardConfig'].core) {
        if (window['boardConfig'].core.indexOf('esp32') > -1) {
            // ESP32板卡
            setupCode += `Wire.begin(${sdaPin}, ${sclPin}); // ESP32 SDA=${sdaPin}, SCL=${sclPin}
Serial.println("使用ESP32 自定义引脚: SDA=" + String(${sdaPin}) + ", SCL=" + String(${sclPin}));\n`;
        } else if (window['boardConfig'].core.indexOf('esp8266') > -1) {
            // ESP8266板卡
            setupCode += `Wire.begin(${sdaPin}, ${sclPin}); // ESP8266 SDA=${sdaPin}, SCL=${sclPin}
Serial.println("使用ESP8266 自定义引脚: SDA=" + String(${sdaPin}) + ", SCL=" + String(${sclPin}));\n`;
        } else {
            // Arduino或其他板卡 - 使用默认引脚
            setupCode += `Wire.begin(); // 默认I2C引脚
Serial.println("使用Arduino默认I2C引脚(A4=SDA, A5=SCL)");\n`;
        }
    } else {
        // 如果无法获取boardConfig，则使用预处理器条件编译（备选方案）
        setupCode += `#if defined(ARDUINO_ARCH_ESP32) || defined(ESP32)
  Wire.begin(${sdaPin}, ${sclPin}); // ESP32 SDA=${sdaPin}, SCL=${sclPin}
  Serial.println("使用ESP32 自定义引脚: SDA=" + String(${sdaPin}) + ", SCL=" + String(${sclPin}));
#elif defined(ARDUINO_ARCH_ESP8266) || defined(ESP8266)
  Wire.begin(${sdaPin}, ${sclPin}); // ESP8266 SDA=${sdaPin}, SCL=${sclPin}
  Serial.println("使用ESP8266 自定义引脚: SDA=" + String(${sdaPin}) + ", SCL=" + String(${sclPin}));
#else
  Wire.begin(); // 使用默认I2C引脚
  Serial.println("使用Arduino默认I2C引脚(A4=SDA, A5=SCL)");
#endif\n`;
    }

    generator.addSetup('sht30_wire_begin', setupCode);
    
    return ''; // 不生成额外代码
};


// 读取SHT30传感器数据 - 自动适配不同板卡
Arduino.forBlock['sht30_read_data'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('wire', '#include <Wire.h>');
    
    // 确保全局变量已定义
    generator.addVariable('sht30_temperature', 'float sht30_temperature = 0.0; // SHT30温度值');
    generator.addVariable('sht30_humidity', 'float sht30_humidity = 0.0; // SHT30湿度值');
    
    // 根据板卡类型生成不同的代码
    let code = '// 读取SHT30传感器数据\n';
    code += 'unsigned int sht30_data[6];\n\n';
    
    // 使用boardConfig判断板卡类型
    if (window['boardConfig'] && window['boardConfig'].core) {
        if (window['boardConfig'].core.indexOf('esp32') > -1 || 
            window['boardConfig'].core.indexOf('esp8266') > -1) {
            // ESP32/ESP8266板卡 - 使用简化版本
            code += `// ESP32/ESP8266 优化版 - 更简洁的读取方式
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
}\n`;
        } else {
            // Arduino或其他板卡 - 使用更稳健的版本
            code += `// Arduino优化版 - 更稳健的读取方式
// 清空I2C缓冲区
while(Wire.available()) Wire.read();

// 发送测量命令
Wire.beginTransmission(SHT30_ADDR);
Wire.write(0x2C);  // 测量命令
Wire.write(0x06);  // 高重复性测量
byte status = Wire.endTransmission();

// 检查命令是否发送成功
if (status != 0) {
  Serial.print("发送命令失败，状态码: ");
  Serial.println(status);
  sht30_temperature = -999.0;
  sht30_humidity = -999.0;
} else {
  // 等待更长时间 - Arduino需要更多时间
  delay(200);  // 增加到200ms
  
  // 请求数据并检查返回字节数
  byte bytesReceived = Wire.requestFrom((uint8_t)SHT30_ADDR, (uint8_t)6);
  
  // 等待一段时间让数据准备好
  delay(10);
  
  if (bytesReceived == 6 && Wire.available() == 6) {
    // 读取6字节数据
    sht30_data[0] = Wire.read();
    sht30_data[1] = Wire.read();
    sht30_data[2] = Wire.read();  // CRC校验字节
    sht30_data[3] = Wire.read();
    sht30_data[4] = Wire.read();
    sht30_data[5] = Wire.read();  // CRC校验字节
    
    // 计算温度和湿度值
    sht30_temperature = ((((sht30_data[0] * 256.0) + sht30_data[1]) * 175.0) / 65535.0) - 45.0;
    sht30_humidity = ((((sht30_data[3] * 256.0) + sht30_data[4]) * 100.0) / 65535.0);
  } else {
    // 数据读取失败
    Serial.print("请求6字节，但收到: ");
    Serial.println(bytesReceived);
    sht30_temperature = -999.0;
    sht30_humidity = -999.0;
  }
}\n`;
        }
    } else {
        // 如果无法获取boardConfig，则使用预处理器条件编译（备选方案）
        code += `// 根据不同板卡使用不同读取方式
#if defined(ARDUINO_ARCH_ESP32) || defined(ESP32) || defined(ARDUINO_ARCH_ESP8266) || defined(ESP8266)
  // ESP32/ESP8266版本 - 简化读取
  Wire.beginTransmission(SHT30_ADDR);
  Wire.write(0x2C);
  Wire.write(0x06);
  Wire.endTransmission();
  delay(50);
  
  Wire.requestFrom(SHT30_ADDR, 6);
  if (Wire.available() == 6) {
    sht30_data[0] = Wire.read();
    sht30_data[1] = Wire.read();
    sht30_data[2] = Wire.read();
    sht30_data[3] = Wire.read();
    sht30_data[4] = Wire.read();
    sht30_data[5] = Wire.read();
    
    sht30_temperature = ((((sht30_data[0] * 256.0) + sht30_data[1]) * 175) / 65535.0) - 45;
    sht30_humidity = ((((sht30_data[3] * 256.0) + sht30_data[4]) * 100) / 65535.0);
  } else {
    sht30_temperature = -999.0;
    sht30_humidity = -999.0;
    Serial.println("无法读取SHT30数据");
  }
#else
  // Arduino版本 - 更稳健读取
  while(Wire.available()) Wire.read();
  
  Wire.beginTransmission(SHT30_ADDR);
  Wire.write(0x2C);
  Wire.write(0x06);
  byte status = Wire.endTransmission();
  
  if (status != 0) {
    Serial.print("发送命令失败，状态码: ");
    Serial.println(status);
    sht30_temperature = -999.0;
    sht30_humidity = -999.0;
  } else {
    delay(200);
    
    byte bytesReceived = Wire.requestFrom((uint8_t)SHT30_ADDR, (uint8_t)6);
    delay(10);
    
    if (bytesReceived == 6 && Wire.available() == 6) {
      sht30_data[0] = Wire.read();
      sht30_data[1] = Wire.read();
      sht30_data[2] = Wire.read();
      sht30_data[3] = Wire.read();
      sht30_data[4] = Wire.read();
      sht30_data[5] = Wire.read();
      
      sht30_temperature = ((((sht30_data[0] * 256.0) + sht30_data[1]) * 175.0) / 65535.0) - 45.0;
      sht30_humidity = ((((sht30_data[3] * 256.0) + sht30_data[4]) * 100.0) / 65535.0);
    } else {
      Serial.print("请求6字节，但收到: ");
      Serial.println(bytesReceived);
      sht30_temperature = -999.0;
      sht30_humidity = -999.0;
    }
  }
#endif\n`;
    }
    
    return code;
};

// 读取SHT30温度
Arduino.forBlock['sht30_read_temperature'] = function (block, generator) {
    // 返回温度变量
    return ['sht30_temperature', Arduino.ORDER_ATOMIC];
};

// 读取SHT30湿度
Arduino.forBlock['sht30_read_humidity'] = function (block, generator) {
    // 返回湿度变量
    return ['sht30_humidity', Arduino.ORDER_ATOMIC];
};
