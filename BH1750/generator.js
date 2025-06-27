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

// 创建/初始化对象
Arduino.forBlock['bh1750_create'] = function(block, generator) {
  const address = block.getFieldValue('ADDRESS') || '0x23';
  
  // 不再使用块中的变量名，而是使用固定的变量名
  const sensorVarName = ensureBH1750Setup("", address, generator);
  
  // 保存变量名，方便后续块使用
  generator.sensorVarName = sensorVarName;
  
  return '';
};

// 初始化I2C总线和BH1750 - 自动适配不同板卡
Arduino.forBlock['bh1750_setup'] = function(block, generator) {
  const address = block.getFieldValue('ADDRESS') || '0x23';
  const sda = generator.valueToCode(block, 'SDA_PIN', Arduino.ORDER_ATOMIC);
  const scl = generator.valueToCode(block, 'SCL_PIN', Arduino.ORDER_ATOMIC);
  
  // 使用固定的变量名
  const varName = generator.sensorVarName || "lightMeter";
  
  let wireCode = '// 初始化I2C通信\n';
  
  // 使用boardConfig判断板卡类型
  if (window['boardConfig'] && window['boardConfig'].core) {
    if (window['boardConfig'].core.indexOf('esp32') > -1) {
      // ESP32板卡
      if (sda && scl) {
        wireCode += `Wire.begin(${sda}, ${scl}); // ESP32 SDA=${sda}, SCL=${scl}
Serial.println("使用ESP32自定义引脚: SDA=" + String(${sda}) + ", SCL=" + String(${scl}));\n`;
      } else {
        wireCode += `Wire.begin(21, 22); // ESP32默认引脚 SDA=4, SCL=4
Serial.println("使用ESP32默认引脚: SDA=21, SCL=22");\n`;
      }
    } else if (window['boardConfig'].core.indexOf('esp8266') > -1) {
      // ESP8266板卡
      if (sda && scl) {
        wireCode += `Wire.begin(${sda}, ${scl}); // ESP8266 SDA=${sda}, SCL=${scl}
Serial.println("使用ESP8266自定义引脚: SDA=" + String(${sda}) + ", SCL=" + String(${scl}));\n`;
      } else {
        wireCode += `Wire.begin(4, 5); // ESP8266默认引脚 SDA=4, SCL=5
Serial.println("使用ESP8266默认引脚: SDA=4, SCL=5");\n`;
      }
    } else {
      // Arduino或其他板卡 - 使用默认引脚
      wireCode += `Wire.begin(); // 使用Arduino默认I2C引脚(A4=SDA, A5=SCL)
Serial.println("使用Arduino默认I2C引脚(A4=SDA, A5=SCL)");\n`;
    }
  } else {
    // 如果无法获取boardConfig，则使用传统判断方式
    if (sda && scl) {
      wireCode += `// 使用自定义引脚
#if defined(ARDUINO_ARCH_ESP32) || defined(ESP32) || defined(ARDUINO_ARCH_ESP8266) || defined(ESP8266)
  Wire.begin(${sda}, ${scl}); // 使用指定的SDA和SCL引脚
  Serial.println("使用指定引脚: SDA=" + String(${sda}) + ", SCL=" + String(${scl}));
#else
  // Arduino不支持自定义引脚
  Wire.begin(); // 使用默认I2C引脚
  Serial.println("Arduino不支持自定义I2C引脚，使用默认引脚");
#endif\n`;
    } else {
      wireCode += `// 使用默认引脚
#if defined(ARDUINO_ARCH_ESP32) || defined(ESP32)
  Wire.begin(21, 22); // ESP32默认引脚
  Serial.println("使用ESP32默认引脚: SDA=21, SCL=22");
#elif defined(ARDUINO_ARCH_ESP8266) || defined(ESP8266)
  Wire.begin(4, 5); // ESP8266默认引脚
  Serial.println("使用ESP8266默认引脚: SDA=4, SCL=5");
#else
  Wire.begin(); // Arduino默认引脚
  Serial.println("使用Arduino默认引脚(A4=SDA, A5=SCL)");
#endif\n`;
    }
  }
  
  generator.addSetup('wire_begin', wireCode);
  
  // 添加BH1750初始化代码
  const bh1750Code = `// 初始化BH1750光照传感器
if (${varName}.begin()) {
  Serial.println("BH1750传感器初始化成功!");
} else {
  Serial.println("警告: BH1750传感器初始化失败，请检查接线!");
}\n`;
  
  generator.addSetup('bh1750_begin', bh1750Code);
  
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

// 配置模式
Arduino.forBlock['bh1750_configure'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const mode = block.getFieldValue('MODE');
  return `${varName}.configure(${mode});\n`;
};

// 设置测量时间寄存器
Arduino.forBlock['bh1750_set_mtreg'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '69';
  return `${varName}.setMTreg(${value});\n`;
};

// 检查测量是否就绪
Arduino.forBlock['bh1750_measurement_ready'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const maxWait = block.getFieldValue('MAX_WAIT') === 'TRUE' ? 'true' : 'false';
  return [`${varName}.measurementReady(${maxWait})`, Arduino.ORDER_FUNCTION_CALL];
};

// 读取光照强度
Arduino.forBlock['bh1750_read_light_level'] = function(block, generator) {
  // 使用固定的变量名
  const varName = generator.sensorVarName || "lightMeter";
  
  return [`${varName}.readLightLevel()`, Arduino.ORDER_FUNCTION_CALL];
};
