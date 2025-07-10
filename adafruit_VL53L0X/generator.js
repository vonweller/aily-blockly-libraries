// 注册 VL53L0X 扩展 - 根据板子类型决定是否显示 I2C 引脚选择
// 避免重复加载
if (Blockly.Extensions.isRegistered('vl53l0x_begin_extension')) {
  Blockly.Extensions.unregister('vl53l0x_begin_extension');
}

Blockly.Extensions.register('vl53l0x_begin_extension', function() {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断是否为 ESP32 系列
  var isESP32 = boardCore.indexOf('esp32') > -1 || 
                boardName.indexOf('esp32') > -1;
  
  // 获取 input_dummy 的引用
  var dummyInput = this.getInput('I2C_PINS');
  
  if (isESP32) {
    // 对于 ESP32，添加 I2C 引脚选择下拉菜单
    dummyInput.appendField('使用');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Wire1 (SDA:4, SCL:5)', 'WIRE_4_5'],
      ['Wire2 (SDA:8, SCL:9)', 'WIRE_DEFAULT']
    ]), 'WIRE_OPTION');
  } else {
    // 对于 Arduino，使用默认引脚 SDA:4, SCL:5，不可选择
    dummyInput.appendField('使用 Wire (SDA:4, SCL:5)');
    
    // 添加一个不可见的字段，以便在生成器中使用
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable('WIRE_4_5'), 'WIRE_OPTION')
      .setVisible(false);
  }
});

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Serial已初始化，兼容core-serial的去重机制
function ensureSerialBegin(serialPort, generator) {
  // 初始化Arduino的Serial相关全局变量，兼容core-serial
  if (!Arduino.addedSerialInitCode) {
    Arduino.addedSerialInitCode = new Set();
  }
  
  // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
  if (!Arduino.addedSerialInitCode.has(serialPort)) {
    // 只有在没有添加过任何初始化代码时才添加默认初始化
    generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(9600);`);
    // 标记为已添加初始化代码
    Arduino.addedSerialInitCode.add(serialPort);
  }
}

// 确保Wire库和VL53L0X库
function ensureVL53L0XLibraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'adafruit_vl53l0x', '#include <Adafruit_VL53L0X.h>');
}

Arduino.forBlock['vl53l0x_config_i2c'] = function(block, generator) {
  var wireOption = block.getFieldValue('WIRE_OPTION');
  
  // 添加Wire库
  generator.addLibrary('Wire', '#include <Wire.h>');
  
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
  
  // 调试信息
  console.log('VL53L0X Config: 开发板信息:', boardConfig);
  console.log('VL53L0X Config: 核心类型:', boardCore);
  console.log('VL53L0X Config: 板名:', boardName);
  console.log('VL53L0X Config: isArduinoCore:', isArduinoCore);
  console.log('VL53L0X Config: isESP32Core:', isESP32Core);
  
  // 不为Arduino核心添加宏定义
  if (!isArduinoCore) {  // 简化判断逻辑，只要不是Arduino就添加宏
    if (wireOption === 'WIRE2') {
      generator.addMacro('SDA_PIN2', '#define SDA_PIN2 4  // Wire2 SDA引脚');
      generator.addMacro('SCL_PIN2', '#define SCL_PIN2 5  // Wire2 SCL引脚');
    } else { 
      
    }
  }
  
  // 初始化I2C总线
  var code = '';
  if (isArduinoCore) {
    // Arduino核心只需要简单的Wire.begin()
    code = 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin();  // 初始化硬件 I2C, Wire1 (ESP32核心)\n';
    } else { // WIRE2
      code = 'Wire.begin(4, 5);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (ESP32核心)\n';
    }
  } else {
    // 其他非Arduino核心，根据Wire选项初始化
    if (wireOption === 'WIRE1') {
      code = 'Wire.begin(SDA_PIN1, SCL_PIN1);  // 初始化硬件 I2C, Wire1 SDA:8, SCL:9 (其他核心)\n';
    } else { // WIRE2
      code = 'Wire.begin(SDA_PIN2, SCL_PIN2);  // 初始化硬件 I2C, Wire2 SDA:4, SCL:5 (其他核心)\n';
    }
  }
  return code;
};

Arduino.forBlock['vl53l0x_begin'] = function(block, generator) {
  // 使用指定的变量名
  var sensorVarName = Arduino.nameDB_.getName(block.getFieldValue('SENSOR'), 'VARIABLE') || 'sensor';
  var wireOption = block.getFieldValue('WIRE_OPTION') || 'WIRE_4_5'; // 默认值
  
  // 添加Wire库和VL53L0X库
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_VL53L0X', '#include <Adafruit_VL53L0X.h>');
  generator.addObject(sensorVarName, 'Adafruit_VL53L0X ' + sensorVarName + ';');
  
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
                     
  var isESP32Core = boardCore.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp32') > -1 || 
                   boardName.indexOf('esp') > -1;
  
  // 调试信息
  console.log('VL53L0X Begin: 开发板信息:', boardConfig);
  console.log('VL53L0X Begin: 核心类型:', boardCore);
  console.log('VL53L0X Begin: 板名:', boardName);
  console.log('VL53L0X Begin: isArduinoCore:', isArduinoCore);
  console.log('VL53L0X Begin: isESP32Core:', isESP32Core);
  
  // 初始化I2C总线
  var code = '// 配置I2C引脚并初始化VL53L0X传感器\n';
  
  if (isArduinoCore) {
    // Arduino核心固定使用 SDA:4, SCL:5
    code += 'Wire.begin();  // 初始化硬件 I2C (Arduino核心)\n\n';
  } else if (isESP32Core) {
    // ESP32核心，根据Wire选项初始化
    switch (wireOption) {
      case 'WIRE_DEFAULT':
        // Wire2 使用 SDA:8, SCL:9，不需要指定引脚
        code += 'Wire.begin();  // 初始化硬件 I2C，Wire2 (ESP32核心)\n\n';
        break;
      case 'WIRE_4_5':
      default:
        // Wire1 使用 SDA:4, SCL:5
        code += 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5 (ESP32核心)\n\n';
        break;
    }
  } else {
    // 其他非Arduino核心，默认使用 SDA:4, SCL:5
    code += 'Wire.begin(4, 5);  // 初始化硬件 I2C，使用 SDA:4, SCL:5\n\n';
  }
  
  // 初始化传感器并检查连接
  code += 'if (!' + sensorVarName + '.begin()) {\n';
  code += '  Serial.println("传感器初始化失败！请检查连接。");\n';
  code += '  while (1); // 初始化失败，停止程序\n';
  code += '}\n\n';
  code += 'Serial.println("传感器初始化成功！");\n';
  return code;
};

// Arduino.forBlock['vl53l0x_read_distance'] = function(block, generator) {
//   // 使用固定的变量名避免乱码
//   var sensorVarName = 'sensor';
  
//   // 读取距离
//   var code = sensorVarName + '.readRange()';
//   return [code, Arduino.ORDER_FUNCTION_CALL];
// };

Arduino.forBlock['vl53l0x_ranging_test'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var measureVarName = 'measure';
  
  // 添加测量结果变量 - 放在loop函数开始部分而不是全局区域
  generator.addLoopBegin(measureVarName, 'VL53L0X_RangingMeasurementData_t ' + measureVarName + ';');
  
  // 进行测量
  var code = '// 获取距离数据（单位：毫米）\n';
  code += sensorVarName + '.rangingTest(&' + measureVarName + ', false);  // 进行一次测量\n';
  return code;
};

Arduino.forBlock['vl53l0x_check_range_valid'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 检查测量结果是否有效
  var code = measureVarName + '.RangeStatus != 4';
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['vl53l0x_get_range_mm'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 获取距离值
  var code = measureVarName + '.RangeMilliMeter';
  return [code, Arduino.ORDER_MEMBER];
};

// VL53L0X初始化传感器（支持Wire实例选择）
Arduino.forBlock['vl53l0x_init_with_wire'] = function(block, generator) {
  const varField = block.getField('SENSOR');
  const varName = varField ? varField.getText() : 'sensor';
  const wire = block.getFieldValue('WIRE') || 'Wire'; // 从field_dropdown获取Wire
  
  // 添加必要的库
  ensureVL53L0XLibraries(generator);
  
  // 确保Serial已初始化（兼容core-serial的去重机制）
  ensureSerialBegin('Serial', generator);
  
  // 添加VL53L0X对象变量，使用用户选择的变量名
  generator.addVariable(varName, 'Adafruit_VL53L0X ' + varName + ';');
  
  // 保存变量名，供后续块使用
  generator.sensorVarName = varName;
  
  // 生成初始化代码
  let setupCode = '// 初始化VL53L0X激光测距传感器 ' + varName + '\n';
  
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
      // 获取I2C引脚信息并添加到注释中（优先使用自定义引脚信息）
      var pinComment = '';
      try {
        let pins = null;
        
        // 优先使用自定义引脚配置
        const customPins = window['customI2CPins'];
        if (customPins && customPins[wire]) {
          pins = customPins[wire];
        }
        // 回退到boardConfig中的引脚信息
        else {
          const boardConfig = window['boardConfig'];
          if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
            pins = boardConfig.i2cPins[wire];
          }
        }
        
        if (pins) {
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
      // 获取I2C引脚信息并添加到注释中（优先使用自定义引脚信息）
      var pinComment = '';
      try {
        let pins = null;
        
        // 优先使用自定义引脚配置
        const customPins = window['customI2CPins'];
        if (customPins && customPins['Wire']) {
          pins = customPins['Wire'];
        }
        // 回退到boardConfig中的引脚信息
        else {
          const boardConfig = window['boardConfig'];
          if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins['Wire']) {
            pins = boardConfig.i2cPins['Wire'];
          }
        }
        
        if (pins) {
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
    
    setupCode += 'if (' + varName + '.begin()) {\n';
  }
  
  setupCode += '  Serial.println("VL53L0X传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: VL53L0X传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  // 返回初始化代码，让它可以插入到任何代码块中（setup、loop等）
  // 而不是强制添加到setup中
  return setupCode;
};

// VL53L0X块的引脚信息显示扩展
function addVL53L0XPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // VL53L0X需要支持引脚信息显示的block类型
    const vl53l0xBlockTypes = [
      'vl53l0x_init_with_wire'
    ];

    // 为每种block类型注册扩展
    vl53l0xBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeVL53L0XBlock(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化VL53L0X块的WIRE字段显示
function initializeVL53L0XBlock(block) {
  try {
    // 检查block是否有WIRE字段（现在是field_dropdown类型）
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    // 延迟初始化，等待boardConfig加载
    setTimeout(() => {
      updateVL53L0XBlockWithPinInfo(block);
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 更新VL53L0X块的Wire字段显示引脚信息
function updateVL53L0XBlockWithPinInfo(block) {
  try {
    // 检查block是否有WIRE字段（现在是field_dropdown类型）
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }
    
    // 创建带引脚信息的下拉选项
    // 由于WIRE字段是field_dropdown类型，引脚信息会通过board.i2c动态加载
    // 如果需要额外的引脚信息显示，可以在这里添加
    
  } catch (e) {
    // 忽略错误
  }
}

// 为VL53L0X生成带引脚信息的I2C选项
function generateVL53L0XI2COptionsWithPins(boardConfig) {
  const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
  
  return originalI2C.map(([displayName, value]) => {
    // 移除已有的引脚信息，重新生成
    const cleanDisplayName = displayName.replace(/\(SDA=\d+,\s*SCL=\d+\)/, '').trim();
    
    // 优先使用自定义引脚信息，再使用boardConfig中的引脚信息
    let pins = null;
    let isCustom = false;
    
    // 检查自定义引脚配置
    const customPins = window['customI2CPins'];
    if (customPins && customPins[value]) {
      pins = customPins[value];
      isCustom = true;
    }
    // 回退到boardConfig中的引脚信息
    else if (boardConfig.i2cPins && boardConfig.i2cPins[value]) {
      pins = boardConfig.i2cPins[value];
      isCustom = false;
    }
    
    if (pins) {
      const sdaPin = pins.find(pin => pin[0] === 'SDA');
      const sclPin = pins.find(pin => pin[0] === 'SCL');
      if (sdaPin && sclPin) {
        const suffix = isCustom ? ' (custom)' : '';
        return [cleanDisplayName + '(SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + ')' + suffix, value];
      }
    }
    
    return [cleanDisplayName, value];
  });
}

// 监听工作区变化，注册VL53L0X扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addVL53L0XPinInfoExtensions();

  // 添加工作区变化监听器
  const addVL53L0XBlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 更新引脚信息
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'vl53l0x_init_with_wire') {
              updateVL53L0XBlockWithPinInfo(block);
            }
          });
        }
      }, 200);
    }
  };

  // 尝试添加监听器
  try {
    if (Blockly.getMainWorkspace) {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        workspace.addChangeListener(addVL53L0XBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addVL53L0XBlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}