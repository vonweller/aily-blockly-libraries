// BH1750光照传感器库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和BH1750库
function ensureBH1750Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'bh1750', '#include <BH1750.h>');
}

// 添加库和变量声明
function ensureBH1750Setup(varName, address, generator) {
  ensureBH1750Libraries(generator);
  
  // 使用传入的变量名和地址
  const variableKey = 'bh1750_sensor_' + varName;
  generator.addVariable(variableKey, 'BH1750 ' + varName + '(' + address + ');');
  
  return varName; // 返回使用的变量名，供后续引用
};

// 读取光照强度
Arduino.forBlock['bh1750_read_light_level'] = function(block, generator) {
  // 从block中获取变量的文本值，而不是变量引用
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "lightMeter");
  
  return [varName + '.readLightLevel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bh1750_init_with_wire'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'lightMeter';
  const mode = block.getFieldValue('MODE') || 'CONTINUOUS_HIGH_RES_MODE';
  const address = block.getFieldValue('ADDRESS') || '0x23';
  const wire = generator.valueToCode(block, 'WIRE', generator.ORDER_ATOMIC) || 'Wire';
  
  // 添加必要的库
  ensureBH1750Libraries(generator);
  
  // 添加BH1750对象变量，使用用户选择的变量名
  generator.addVariable('bh1750_sensor', 'BH1750 ' + varName + '(' + address + ');');
  
  // 保存变量名和地址，供后续块使用
  generator.sensorVarName = varName;
  generator.sensorAddress = address;
  
  // 生成初始化代码
  let setupCode = '// 初始化BH1750光照传感器 ' + varName + '\n  ';
  
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
            pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
          }
        }
      } catch (e) {
        // 静默处理错误
      }
      
      generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
    }
    
    // 当mode为默认值CONTINUOUS_HIGH_RES_MODE时，可以省略mode参数
    if (mode === 'CONTINUOUS_HIGH_RES_MODE') {
      setupCode += 'if (' + varName + '.begin(' + address + ', &' + wire + ')) {\n  ';
    } else {
      setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ', ' + address + ', &' + wire + ')) {\n  ';
    }
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
            pinComment = '  // Wire: SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
          }
        }
      } catch (e) {
        // 静默处理错误
      }
      
      generator.addSetup(wireBeginKey, pinComment + 'Wire.begin();\n');
    }
    
    // 当mode为默认值CONTINUOUS_HIGH_RES_MODE时，可以省略mode参数
    if (mode === 'CONTINUOUS_HIGH_RES_MODE') {
      setupCode += 'if (' + varName + '.begin()) {\n  ';
    } else {
      setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ')) {\n  ';
    }
  }
  
  setupCode += '  Serial.println("BH1750传感器 ' + varName + ' 初始化成功!");\n  ';
  setupCode += '} else {\n  ';
  setupCode += '  Serial.println("警告: BH1750传感器 ' + varName + ' 初始化失败，请检查接线!");\n  ';
  setupCode += '}\n  ';
  
  generator.addSetup('bh1750_init_' + varName, setupCode);
  
  return '';
}
