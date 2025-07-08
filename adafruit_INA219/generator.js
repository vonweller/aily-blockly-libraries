// Generator.js: Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 integration

/**
 * Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 生成器统一处理
 */

// 带下拉选项的读取值块
Arduino.forBlock['ina219_read_value'] = function(block, generator) {
  // 从block中获取变量的文本值，而不是变量引用，与ina219_init_with_wire保持一致
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "ina219");
  const type = block.getFieldValue('TYPE') || 'BUS_VOLTAGE';
  
  // 根据下拉选项返回不同的函数调用
  switch(type) {
    case 'BUS_VOLTAGE':
      return [varName + '.getBusVoltage_V()', generator.ORDER_FUNCTION_CALL];
    case 'SHUNT_VOLTAGE':
      return [varName + '.getShuntVoltage_mV()', generator.ORDER_FUNCTION_CALL];
    case 'CURRENT':
      return [varName + '.getCurrent_mA()', generator.ORDER_FUNCTION_CALL];
    case 'POWER':
      return [varName + '.getPower_mW()', generator.ORDER_FUNCTION_CALL];
    default:
      return [varName + '.getBusVoltage_V()', generator.ORDER_FUNCTION_CALL];
  }
};

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和INA219库
function ensureINA219Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'adafruit_ina219', '#include <Adafruit_INA219.h>');
}

// INA219初始化传感器（支持Wire实例选择）
Arduino.forBlock['ina219_init_with_wire'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ina219';
  const address = block.getFieldValue('ADDRESS') || '0x40'; // 从field_input获取地址
  const wire = generator.valueToCode(block, 'WIRE', generator.ORDER_ATOMIC) || 'Wire'; // 从input_value获取Wire
  
  // 添加必要的库
  ensureINA219Libraries(generator);
  
  // 添加INA219对象变量，使用用户选择的变量名
  generator.addVariable(varName, 'Adafruit_INA219 ' + varName + '(' + address + ');');
  
  // 保存变量名和地址，供后续块使用
  generator.sensorVarName = varName;
  generator.sensorAddress = address;
  
  // 生成初始化代码
  let setupCode = '// 初始化INA219电流传感器 ' + varName + '\n';
  
  // 如果指定了特定的Wire实例，使用该实例初始化
  if (wire && wire !== 'Wire' && wire !== '') {
    // 统一使用与new_iic库相同的setupKey命名规范
    const wireBeginKey = 'wire_begin_' + wire;
    
    // 检查是否已经初始化过这个Wire实例（包括wire_begin_with_settings的初始化）
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      // 检查基础key或任何以该Wire实例开头的key
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        // 检查是否存在该Wire实例的wire_begin_with_settings初始化记录
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_' + wire + '_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    
    if (!isAlreadyInitialized) {
      // 获取I2C引脚信息并添加到注释中
      var pinComment = '';
      try {
        const boardConfig = window['boardConfig'];
        if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
          const pins = boardConfig.i2cPins[wire];
          const sdaPin = pins.find(pin => pin[0] === 'SDA');
          const sclPin = pins.find(pin => pin[0] === 'SCL');
          if (sdaPin && sclPin) {
            pinComment = '// ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n';
          }
        }
      } catch (e) {
        // 静默处理错误
      }
      
      generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
    }
    
    setupCode += 'if (' + varName + '.begin(&' + wire + ')) {\n';
  } else {
    // 统一使用与new_iic库相同的setupKey命名规范
    const wireBeginKey = 'wire_begin_Wire';
    
    // 检查是否已经初始化过Wire实例（包括wire_begin_with_settings的初始化）
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      // 检查基础key或任何以Wire开头的key
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        // 检查是否存在Wire实例的wire_begin_with_settings初始化记录
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_Wire_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    
    if (!isAlreadyInitialized) {
      // 获取I2C引脚信息并添加到注释中
      var pinComment = '';
      try {
        const boardConfig = window['boardConfig'];
        if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins['Wire']) {
          const pins = boardConfig.i2cPins['Wire'];
          const sdaPin = pins.find(pin => pin[0] === 'SDA');
          const sclPin = pins.find(pin => pin[0] === 'SCL');
          if (sdaPin && sclPin) {
            pinComment = '// Wire: SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n';
          }
        }
      } catch (e) {
        // 静默处理错误
      }
      
      generator.addSetup(wireBeginKey, pinComment + 'Wire.begin();\n');
    }
    
    setupCode += 'if (' + varName + '.begin()) {\n';
  }
  
  setupCode += '  Serial.println("INA219传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: INA219传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  // 返回初始化代码，让它可以插入到任何代码块中（setup、loop等）
  // 而不是强制添加到setup中
  return setupCode;
};



