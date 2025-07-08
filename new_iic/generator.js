/**
 * Wire (I2C) library for Arduino - Combined generator code for Blockly
 */

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 通用添加Wire库代码，确保不会重复添加
function ensureWireLibrary(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
}

/**
 * Wire.begin() / Wire.begin(address)
 */
Arduino.forBlock['wire_begin'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC);
  
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
  
  var code = address ? wire + '.begin(' + address + ');\n' : wire + '.begin();\n';
  var fullCode = pinComment + code;
  
  // 为每个Wire实例使用不同的setupKey，避免冲突
  // 主设备模式(无address)和从设备模式(有address)使用不同的key
  var setupKey = address ? 'wire_begin_' + wire + '_' + address : 'wire_begin_' + wire;
  
  // 检查是否已经初始化过这个Wire实例（包括wire_begin_with_settings的初始化）
  var baseSetupKey = 'wire_begin_' + wire;
  if (!generator.setupCodes_ || !generator.setupCodes_[setupKey]) {
    // 额外检查是否已经被wire_begin_with_settings初始化
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      // 检查是否存在该Wire实例的任何初始化记录
      for (var key in generator.setupCodes_) {
        if (key.startsWith('wire_begin_' + wire + '_') && key !== setupKey) {
          isAlreadyInitialized = true;
          break;
        }
      }
    }
    
    if (!isAlreadyInitialized) {
      generator.addSetup(setupKey, fullCode);
    }
  }
  return '';
};

/**
 * Wire.setClock(frequency)
 */
Arduino.forBlock['wire_set_clock'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC);
  return wire + '.setClock(' + frequency + ');\n';
};

/**
 * Wire.begin(sda, scl) for ESP32
 */
Arduino.forBlock['wire_begin_with_settings'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var sda = generator.valueToCode(block, 'SDA', generator.ORDER_ATOMIC);
  var scl = generator.valueToCode(block, 'SCL', generator.ORDER_ATOMIC);
  var code = wire + '.begin(' + sda + ', ' + scl + ');\n';
  
  // 为每个Wire实例使用基础的setupKey，避免与wire_begin冲突
  // 同时使用详细的key来区分不同的引脚配置
  var baseSetupKey = 'wire_begin_' + wire;
  var specificSetupKey = 'wire_begin_' + wire + '_' + sda + '_' + scl;
  
  // 检查是否已经初始化过这个Wire实例（任何形式的初始化）
  if (!generator.setupCodes_ || (!generator.setupCodes_[baseSetupKey] && !generator.setupCodes_[specificSetupKey])) {
    generator.addSetup(specificSetupKey, code);
    // 同时标记基础key，防止后续的wire_begin重复初始化
    generator.addSetup(baseSetupKey, '// Wire ' + wire + ' initialized with custom pins\n');
  }
  
  return '';
};

/**
 * Wire.beginTransmission(address)
 */
Arduino.forBlock['wire_begin_transmission'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC);
  return wire + '.beginTransmission(' + address + ');\n';
};

/**
 * Wire.write(data) 支持多样参数
 */
Arduino.forBlock['wire_write'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC);
  return wire + '.write(' + data + ');\n';
};

/**
 * Wire.endTransmission()
 */
Arduino.forBlock['wire_end_transmission'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return wire + '.endTransmission();\n';
};

/**
 * Wire.requestFrom(address, quantity)
 */
Arduino.forBlock['wire_request_from'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC);
  var quantity = generator.valueToCode(block, 'QUANTITY', generator.ORDER_ATOMIC);
  return wire + '.requestFrom(' + address + ', ' + quantity + ');\n';
};

/**
 * Wire.available()
 */
Arduino.forBlock['wire_available'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return [wire + '.available()', generator.ORDER_FUNCTION_CALL];
};

/**
 * Wire.read()
 */
Arduino.forBlock['wire_read'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return [wire + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wire_variables'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return [wire, generator.ORDER_ATOMIC];
};

/**
 * Wire.onReceive(function)
 */
Arduino.forBlock['wire_on_receive'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var callback = generator.statementToCode(block, 'CALLBACK');
  
  // 根据Wire实例生成唯一的函数名
  var funName = wire.toLowerCase() + 'ReceiveHandler';
  var funcKey = 'wire_receive_' + wire.toLowerCase();
  
  var funcDef = 'void ' + funName + '(int numBytes) {\n' + callback + '}\n';
  generator.addFunction(funcKey, funcDef);
  var setupFunc = wire + '.onReceive(' + funName + ');\n';
  generator.addSetup('wire_on_receive_' + wire, setupFunc);
  return '';
};

/**
 * Wire.onRequest(function)
 */
Arduino.forBlock['wire_on_request'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var callback = generator.statementToCode(block, 'CALLBACK');
  
  // 根据Wire实例生成唯一的函数名
  var funName = wire.toLowerCase() + 'RequestHandler';
  var funcKey = 'wire_request_' + wire.toLowerCase();
  
  var funcDef = 'void ' + funName + '() {\n' + callback + '}\n';
  generator.addFunction(funcKey, funcDef);
  var setupFunc = wire + '.onRequest(' + funName + ');\n';
  generator.addSetup('wire_on_request_' + wire, setupFunc);
  return '';
};

// 动态添加wire_begin_with_settings块的功能（参考core-variables实现）
function addWireBeginWithSettingsBlock() {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 找到I2C类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if (category.name === "I2C" || category.name === "new_iic" ||
          (category.contents && category.contents.some(item => 
            item.type === "wire_begin" || item.type === "wire_set_clock"))) {
        
        // 检查是否已经存在wire_begin_with_settings block
        const blockExists = category.contents.some(item => 
          item.type === "wire_begin_with_settings"
        );

        if (!blockExists) {
          // 在wire_begin后面添加wire_begin_with_settings
          const wireBeginIndex = category.contents.findIndex(item => 
            item.type === "wire_begin"
          );
          
          const newBlock = {
            "kind": "block",
            "type": "wire_begin_with_settings",
            "inputs": {
              "SDA": {
                "shadow": {
                  "type": "math_number",
                  "fields": {
                    "NUM": "21"
                  }
                }
              },
              "SCL": {
                "shadow": {
                  "type": "math_number",
                  "fields": {
                    "NUM": "22"
                  }
                }
              }
            }
          };
          
          if (wireBeginIndex >= 0) {
            // 在wire_begin后面插入新的block
            category.contents.splice(wireBeginIndex + 1, 0, newBlock);
          } else {
            // 如果找不到wire_begin，就添加到前面
            category.contents.unshift(newBlock);
          }
        }
        break;
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 动态更新I2C块的下拉菜单，添加引脚信息（简化版）
function updateI2CBlocksWithPinInfo() {
  try {
    // 检查开发板配置
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c || !boardConfig.i2cPins) {
      return;
    }

    // 使用原始的i2c配置，避免重复添加引脚信息
    const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
    
    // 创建带引脚信息的I2C选项
    const i2cOptionsWithPins = generateI2COptionsWithPins(boardConfig);

    // 备份原始配置并更新全局配置
    if (!boardConfig.i2cOriginal) {
      boardConfig.i2cOriginal = [...originalI2C];
    }
    boardConfig.i2c = i2cOptionsWithPins;

    // 更新工作区中所有现有的I2C块
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const allBlocks = workspace.getAllBlocks();
      allBlocks.forEach(block => {
        if (block.type === 'wire_begin' || block.type === 'wire_begin_with_settings') {
          updateBlockDropdownWithPinInfo(block);
        }
      });
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 简化的I2C块初始化函数
function initializeI2CBlock(block) {
  try {
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    // 延迟初始化，等待boardConfig加载
    setTimeout(() => {
      updateBlockDropdownWithPinInfo(block);
      
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.i2c && boardConfig.i2c.length > 0) {
        const currentValue = wireField.getValue();
        if (!currentValue) {
          wireField.setValue(boardConfig.i2c[0][1]);
        }
        
        // 设置显示文本
        const matchingOption = boardConfig.i2c.find(([text, value]) => value === wireField.getValue());
        if (matchingOption) {
          wireField.setText(matchingOption[0]);
        }
      }
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 简化的I2C块扩展注册
function addI2CPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // wire_begin块的扩展
    if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered('wire_begin_pin_info')) {
      Blockly.Extensions.register('wire_begin_pin_info', function() {
        setTimeout(() => {
          initializeI2CBlock(this);
        }, 50);
      });
    }

    // wire_begin_with_settings块的扩展
    if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered('wire_begin_with_settings_pin_info')) {
      Blockly.Extensions.register('wire_begin_with_settings_pin_info', function() {
        setTimeout(() => {
          initializeI2CBlock(this);
        }, 50);
      });
    }
  } catch (e) {
    // 忽略扩展注册错误
  }
}



// 生成带引脚信息的I2C选项
function generateI2COptionsWithPins(boardConfig) {
  const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
  
  return originalI2C.map(([displayName, value]) => {
    // 如果已经包含引脚信息，直接返回
    if (displayName.includes('SDA=') || displayName.includes('SCL=')) {
      return [displayName, value];
    }
    
    // 添加引脚信息到显示文本中
    if (boardConfig.i2cPins && boardConfig.i2cPins[value]) {
      const pins = boardConfig.i2cPins[value];
      const sdaPin = pins.find(pin => pin[0] === 'SDA');
      const sclPin = pins.find(pin => pin[0] === 'SCL');
      if (sdaPin && sclPin) {
        return [displayName + '(SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + ')', value];
      }
    }
    
    return [displayName, value];
  });
}

// 更新单个block的下拉菜单选项（简化版）
function updateBlockDropdownWithPinInfo(block) {
  try {
    if (!block || (block.type !== 'wire_begin' && block.type !== 'wire_begin_with_settings')) return;
    
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c || !boardConfig.i2cPins) {
      return;
    }
    
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    const optionsWithPins = generateI2COptionsWithPins(boardConfig);
    
    // 更新下拉菜单选项
    if (optionsWithPins.length > 0) {
      // 更新字段的选项生成器
      wireField.menuGenerator_ = optionsWithPins;
      wireField.getOptions = function() {
        return optionsWithPins;
      };
      
      // 更新当前显示文本
      const currentValue = wireField.getValue();
      if (currentValue) {
        const matchingOption = optionsWithPins.find(([text, value]) => value === currentValue);
        if (matchingOption) {
          wireField.setText(matchingOption[0]);
        }
      } else if (optionsWithPins.length > 0) {
        // 设置默认选项
        wireField.setText(optionsWithPins[0][0]);
        wireField.setValue(optionsWithPins[0][1]);
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 刷新I2C工具箱（参考core-variables的实现）
function refreshI2CToolbox(workspace) {
  try {
    if (!workspace) return;
    
    // 使用与core-variables相同的刷新方法
    const originalToolboxDef = workspace.options.languageTree;
    if (originalToolboxDef) {
      workspace.updateToolbox(originalToolboxDef);
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 监听工作区变化，在工作区加载完成后添加ESP32专用块和更新引脚信息
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addI2CPinInfoExtensions();

  // 添加工作区变化监听器
  const addI2CBlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 首先添加wire_begin_with_settings块
        addWireBeginWithSettingsBlock();
        
        // 然后更新引脚信息
        updateI2CBlocksWithPinInfo();
        
        // 刷新工具箱以使用新的块定义
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          refreshI2CToolbox(workspace);
        }
      }, 200);
    }
  };

  // 尝试添加监听器
  try {
    if (Blockly.getMainWorkspace) {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        workspace.addChangeListener(addI2CBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addI2CBlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 如果boardConfig已经存在，立即处理
if (window['boardConfig']) {
  setTimeout(() => {
    addWireBeginWithSettingsBlock();
    updateI2CBlocksWithPinInfo();
    
    // 刷新工具箱
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      refreshI2CToolbox(workspace);
    }
  }, 200);
}

// 添加全局函数，供外部手动调用
window.updateI2CPinInfo = function() {
  updateI2CBlocksWithPinInfo();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshI2CToolbox(workspace);
  }
};

window.addWireBeginWithSettingsToToolbox = function() {
  addWireBeginWithSettingsBlock();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshI2CToolbox(workspace);
  }
};

window.forceAddWireBeginWithSettings = function() {
  addWireBeginWithSettingsBlock();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshI2CToolbox(workspace);
  }
};

window.ensureI2CBlocks = function() {
  addWireBeginWithSettingsBlock();
  updateI2CBlocksWithPinInfo();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshI2CToolbox(workspace);
  }
};
