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
  
  // 确保Serial已初始化（兼容core-serial的去重机制）
  ensureSerialBegin('Serial', generator);
  
  // 添加BH1750对象变量到全局变量区域，与INA219库保持一致
  generator.addVariable(varName, 'BH1750 ' + varName + '(' + address + ');');
  
  // 保存变量名和地址，供后续块使用
  generator.sensorVarName = varName;
  generator.sensorAddress = address;
  
  // 生成初始化代码
  let setupCode = '// 初始化BH1750光照传感器 ' + varName + '\n';
  
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
    
    // 当mode为默认值CONTINUOUS_HIGH_RES_MODE时，可以省略mode参数
    if (mode === 'CONTINUOUS_HIGH_RES_MODE') {
      setupCode += 'if (' + varName + '.begin(' + address + ', &' + wire + ')) {\n';
    } else {
      setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ', ' + address + ', &' + wire + ')) {\n';
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
    
    if (!isAlreadyInitialized) {    // 获取I2C引脚信息并添加到注释中（优先使用自定义引脚信息）
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
    
    // 当mode为默认值CONTINUOUS_HIGH_RES_MODE时，可以省略mode参数
    if (mode === 'CONTINUOUS_HIGH_RES_MODE') {
      setupCode += 'if (' + varName + '.begin()) {\n';
    } else {
      setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ')) {\n';
    }
  }
  
  setupCode += '  Serial.println("BH1750传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: BH1750传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  // 返回初始化代码，让它可以插入到任何代码块中（setup、loop等）
  // 而不是强制添加到setup中
  return setupCode;
}

// BH1750块的引脚信息显示扩展
function addBH1750PinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // BH1750需要支持引脚信息显示的block类型
    const bh1750BlockTypes = [
      'bh1750_init_with_wire'
    ];

    // 为每种block类型注册扩展
    bh1750BlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeBH1750Block(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化BH1750块的WIRE输入显示
function initializeBH1750Block(block) {
  try {
    // 检查block是否有WIRE输入
    const wireInput = block.getInput('WIRE');
    if (!wireInput) return;
    
    // 延迟初始化，等待boardConfig加载
    setTimeout(() => {
      updateBH1750BlockWithPinInfo(block);
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 更新BH1750块的Wire输入显示引脚信息
function updateBH1750BlockWithPinInfo(block) {
  try {
    // 检查block是否有WIRE输入
    const wireInput = block.getInput('WIRE');
    if (!wireInput || !wireInput.connection) return;
    
    // 如果WIRE输入已经连接了其他block，就不需要更新
    if (wireInput.connection.targetBlock()) return;
    
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }
    
    // 创建带引脚信息的下拉选项
    const i2cOptionsWithPins = generateBH1750I2COptionsWithPins(boardConfig);
    
    // 如果输入为空，可以添加一个默认的Wire变量块显示引脚信息
    // 这里暂时不修改已有的输入结构，保持兼容性
    
  } catch (e) {
    // 忽略错误
  }
}

// 为BH1750生成带引脚信息的I2C选项
function generateBH1750I2COptionsWithPins(boardConfig) {
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

// 监听工作区变化，注册BH1750扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addBH1750PinInfoExtensions();

  // 添加工作区变化监听器
  const addBH1750BlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 更新引脚信息
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'bh1750_init_with_wire') {
              updateBH1750BlockWithPinInfo(block);
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
        workspace.addChangeListener(addBH1750BlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addBH1750BlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}
