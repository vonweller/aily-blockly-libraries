// 检查并移除已存在的数组动态扩展注册
if (Blockly.Extensions.isRegistered('array_dynamic_extension')) {
  Blockly.Extensions.unregister('array_dynamic_extension');
}

Blockly.Extensions.register('array_dynamic_extension', function () {
  // 最小输入数量
  this.minInputs = 2;
  // 输入项计数
  this.itemCount = this.minInputs;

  // 添加所有动态块需要的方法
  this.findInputIndexForConnection = function (connection) {
    if (!connection.targetConnection || connection.targetBlock()?.isInsertionMarker()) {
      return null;
    }

    let connectionIndex = -1;
    for (let i = 0; i < this.inputList.length; i++) {
      if (this.inputList[i].connection == connection) {
        connectionIndex = i;
      }
    }

    if (connectionIndex == this.inputList.length - 1) {
      return this.inputList.length + 1;
    }

    const nextInput = this.inputList[connectionIndex + 1];
    const nextConnection = nextInput?.connection?.targetConnection;
    if (nextConnection && !nextConnection.getSourceBlock().isInsertionMarker()) {
      return connectionIndex + 1;
    }

    return null;
  };

  this.onPendingConnection = function (connection) {
    const insertIndex = this.findInputIndexForConnection(connection);
    if (insertIndex == null) {
      return;
    }

    this.appendValueInput(`INPUT${Blockly.utils.idGenerator.genUid()}`);
    this.moveNumberedInputBefore(this.inputList.length - 1, insertIndex);
  };

  this.finalizeConnections = function () {
    const targetConns = this.removeUnnecessaryEmptyConns(
      this.inputList.map((i) => i.connection?.targetConnection),
    );

    this.tearDownBlock();
    this.addItemInputs(targetConns);
    this.itemCount = targetConns.length;
  };

  this.tearDownBlock = function () {
    // 只删除动态添加的输入（INPUT2及以后）
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const inputName = this.inputList[i].name;
      // 保留原始的INPUT0和INPUT1，只删除动态添加的
      if (inputName.startsWith('INPUT') && inputName !== 'INPUT0' && inputName !== 'INPUT1') {
        this.removeInput(inputName);
      }
    }
  };

  this.removeUnnecessaryEmptyConns = function (targetConns) {
    const filteredConns = [...targetConns];
    for (let i = filteredConns.length - 1; i >= 0; i--) {
      if (!filteredConns[i] && filteredConns.length > this.minInputs) {
        filteredConns.splice(i, 1);
      }
    }
    return filteredConns;
  };

  this.addItemInputs = function (targetConns) {
    // 从INPUT2开始添加动态输入
    for (let i = this.minInputs; i < targetConns.length; i++) {
      const inputName = `INPUT${i}`;
      const input = this.appendValueInput(inputName);
      input.setCheck(["Array", "String"]);
      const targetConn = targetConns[i];
      if (targetConn) input.connection?.connect(targetConn);
    }
  };

  this.isCorrectlyFormatted = function () {
    // 检查动态输入是否正确格式化
    let dynamicInputIndex = this.minInputs;
    for (let i = 0; i < this.inputList.length; i++) {
      const inputName = this.inputList[i].name;
      if (inputName.startsWith('INPUT') && inputName !== 'INPUT0' && inputName !== 'INPUT1') {
        if (inputName !== `INPUT${dynamicInputIndex}`) return false;
        dynamicInputIndex++;
      }
    }
    return true;
  };
});

// 检查并移除已存在的数组动态变异器注册
if (Blockly.Extensions.isRegistered('array_dynamic_mutator')) {
  Blockly.Extensions.unregister('array_dynamic_mutator');
}

// 定义数组动态变异器来处理序列化
Blockly.Extensions.registerMutator('array_dynamic_mutator', {
  mutationToDom: function () {
    if (!this.isDeadOrDying()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', `${this.itemCount}`);
    return container;
  },

  domToMutation: function (xmlElement) {
    this.itemCount = Math.max(
      parseInt(xmlElement.getAttribute('items') || '0', 10),
      this.minInputs,
    );
    for (let i = this.minInputs; i < this.itemCount; i++) {
      const input = this.appendValueInput(`INPUT${i}`);
      input.setCheck(["Array", "String"]);
    }
  },

  saveExtraState: function () {
    if (!this.isDeadOrDying() && !this.isCorrectlyFormatted()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }
    return {
      itemCount: this.itemCount,
    };
  },

  loadExtraState: function (state) {
    if (typeof state === 'string') {
      this.domToMutation(Blockly.utils.xml.textToDom(state));
      return;
    }
    this.itemCount = state['itemCount'] || 0;
    for (let i = this.minInputs; i < this.itemCount; i++) {
      const input = this.appendValueInput(`INPUT${i}`);
      input.setCheck(["Array", "String"]);
    }
  }
});

// 避免重复加载扩展
if (Blockly.Extensions.isRegistered('array_init_mutator')) {
  Blockly.Extensions.unregister('array_init_mutator');
}

// 数组初始化动态扩展
Blockly.Extensions.register('array_init_mutator', function() {
  this.itemCount_ = 3; // 默认3个项目
  
  // 更新块的形状
  this.updateShape_ = function() {
    // 获取LENGTH输入连接的值
    let length = 3; // 默认长度
    const lengthBlock = this.getInputTargetBlock('LENGTH');
    if (lengthBlock && lengthBlock.type === 'math_number') {
      const lengthValue = lengthBlock.getFieldValue('NUM');
      if (lengthValue && !isNaN(parseInt(lengthValue))) {
        length = Math.max(1, Math.min(20, parseInt(lengthValue))); // 限制在1-20之间
      }
    }
    
    // 如果长度改变，更新项目数量
    if (this.itemCount_ !== length) {
      // 移除多余的输入
      for (let i = length; i < Math.max(this.itemCount_, 20); i++) {
        if (this.getInput(`VALUE${i}`)) {
          this.removeInput(`VALUE${i}`);
        }
      }
      
      // 添加新的输入
      for (let i = this.itemCount_; i < length; i++) {
        const input = this.appendValueInput(`VALUE${i}`)
          .appendField(``);
        
        // 为新增的输入框添加默认的数字块
        setTimeout(() => {
          if (this.workspace && this.workspace.rendered && !this.getInputTargetBlock(`VALUE${i}`)) {
            try {
              const defaultBlock = this.workspace.newBlock('math_number');
              defaultBlock.setFieldValue((i + 1).toString(), 'NUM'); // 设置默认值为索引+1
              defaultBlock.initSvg();
              defaultBlock.render();
              const connection = input.connection;
              if (connection && defaultBlock.outputConnection) {
                connection.connect(defaultBlock.outputConnection);
              }
            } catch (e) {
              console.warn('Failed to create default block:', e);
            }
          }
        }, 50); // 增加延迟确保DOM完全渲染
      }
      
      this.itemCount_ = length;
    }
  };
  
  // 重写 onchange 方法来监听变化
  const originalOnChange = this.onchange;
  this.onchange = function(event) {
    if (originalOnChange) {
      originalOnChange.call(this, event);
    }
    
    // 只响应字段变化事件
    if (event && event.type === Blockly.Events.BLOCK_CHANGE && 
        event.blockId && this.workspace) {
      const changedBlock = this.workspace.getBlockById(event.blockId);
      const lengthBlock = this.getInputTargetBlock('LENGTH');
      
      // 检查变化的块是否是我们LENGTH输入连接的块
      if (changedBlock && lengthBlock && changedBlock.id === lengthBlock.id) {
        setTimeout(() => {
          this.updateShape_();
        }, 50);
      }
    }
  };
  
  // 初始化形状
  this.updateShape_();
});

// 检查并移除已存在的 mutator 扩展注册
if (Blockly.Extensions.isRegistered('array_init_dynamic_mutator')) {
  Blockly.Extensions.unregister('array_init_dynamic_mutator');
}

// 定义 Mutator 来处理序列化
Blockly.Extensions.registerMutator('array_init_dynamic_mutator', {
  /**
   * 将变异状态转换为 DOM 元素
   */
  mutationToDom: function () {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', `${this.itemCount_ || 3}`);
    return container;
  },

  /**
   * 从 DOM 元素恢复变异状态
   */
  domToMutation: function (xmlElement) {
    const itemCount = parseInt(xmlElement.getAttribute('items') || '3', 10);
    this.itemCount_ = itemCount;
    
    // 先清理所有现有的 VALUE 输入
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const inputName = this.inputList[i].name;
      if (inputName && inputName.startsWith('VALUE')) {
        this.removeInput(inputName);
      }
    }
    
    // 重新创建正确数量的输入
    for (let i = 0; i < itemCount; i++) {
      this.appendValueInput(`VALUE${i}`);
    }
  },

  /**
   * 保存额外的状态信息
   */
  saveExtraState: function () {
    return {
      itemCount: this.itemCount_ || 3,
    };
  },

  /**
   * 加载额外的状态信息
   */
  loadExtraState: function (state) {
    if (typeof state === 'string') {
      this.domToMutation(Blockly.utils.xml.textToDom(state));
      return;
    }

    const itemCount = state['itemCount'] || 3;
    this.itemCount_ = itemCount;
    
    // 先清理所有现有的 VALUE 输入
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const inputName = this.inputList[i].name;
      if (inputName && inputName.startsWith('VALUE')) {
        this.removeInput(inputName);
      }
    }
    
    // 重新创建正确数量的输入
    for (let i = 0; i < itemCount; i++) {
      this.appendValueInput(`VALUE${i}`);
    }
  }
});

// 帮助函数：检查块是否在函数作用域内
function isInFunctionScope(block) {
  let currentBlock = block;
  while (currentBlock) {
    // 检查是否在函数定义块内
    if (currentBlock.type === 'procedures_defnoreturn' || 
        currentBlock.type === 'procedures_defreturn' ||
        currentBlock.type === 'function_definition' ||
        currentBlock.type === 'custom_function') {
      return true;
    }
    
    // 检查是否在setup或loop函数内
    if (currentBlock.type === 'arduino_setup' || 
        currentBlock.type === 'arduino_loop') {
      return true;
    }
    
    // 向上遍历查找父级块
    currentBlock = currentBlock.getParent();
  }
  return false;
}

// 帮助函数：获取数据类型的默认值
function getDefaultValue(arrayType) {
  switch (arrayType) {
    case "String":
      return '""';
    case "char":
    case "unsigned char":
      return "'\\0'";
    case "float":
    case "double":
      return "0.0";
    case "int":
    case "unsigned int":
    case "long":
    case "unsigned long":
    case "short":
    case "unsigned short":
    case "byte":
    default:
      return "0";
  }
}

// 创建数组（支持动态多输入，可生成一维/二维数组）
Arduino.forBlock["array_create_with"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const arrayType = block.getFieldValue("TYPE");
  
  // 判断是否在函数作用域内
  const isLocal = isInFunctionScope(block);
  
  // 收集所有连接的输入值
  let inputValues = [];
  
  // 遍历所有输入连接
  for (let i = 0; i < block.inputList.length; i++) {
    const input = block.inputList[i];
    if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
      const value = generator.valueToCode(block, input.name, Arduino.ORDER_ATOMIC);
      if (value && value !== '""') {
        inputValues.push(value);
      }
    }
  }
  
  // 根据输入数量和类型决定如何创建数组
  if (inputValues.length === 0) {
    // 没有连接任何块，使用用户选择的类型和长度创建默认数组
    const lengthValue = block.getFieldValue("LENGTH");
    const arrayLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
    
    // 根据用户选择的类型创建相应的数组声明
    const arrayDeclaration = arrayType + " " + varName + "[" + arrayLength + "];";
    
    if (isLocal) {
      return "  " + arrayDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, arrayDeclaration);
    }
    return "";
  }
  
  // 检查是否有字符串输入（用于字符数组）
  const hasStringInput = inputValues.some(value => value.startsWith('"') && value.endsWith('"'));
  
  if (hasStringInput && inputValues.length === 1) {
    // 单个字符串输入，创建字符数组
    const arrayDeclaration = "char " + varName + "[] = " + inputValues[0] + ";";
    
    if (isLocal) {
      return "  " + arrayDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, arrayDeclaration);
    }
    return "";
  }
  
  if (inputValues.length === 1) {
    // 单个数组输入，创建一维数组
    const arrayText = inputValues[0];
    
    if (arrayText.startsWith('{') && arrayText.endsWith('}')) {
      // 从数组文本中提取元素数量
      const elementsStr = arrayText.slice(1, -1).trim();
      const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
      const length = elements.length || 3;
      
      const arrayDeclaration = arrayType + " " + varName + "[" + length + "] = " + arrayText + ";";
      
      if (isLocal) {
        return "  " + arrayDeclaration + "\n";
      } else {
        generator.addVariable("var_declare_" + varName, arrayDeclaration);
      }
    } else {
      // 其他情况，使用用户选择的类型和长度创建默认数组
      const lengthValue = block.getFieldValue("LENGTH");
      const arrayLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
      
      const arrayDeclaration = arrayType + " " + varName + "[" + arrayLength + "];";
      
      if (isLocal) {
        return "  " + arrayDeclaration + "\n";
      } else {
        generator.addVariable("var_declare_" + varName, arrayDeclaration);
      }
    }
    return "";
  }
  
  if (inputValues.length >= 2) {
    // 多个输入，创建二维数组
    let arrayRows = [];
    let maxCols = 0;
    
    // 处理每个输入作为数组的一行
    for (let i = 0; i < inputValues.length; i++) {
      const inputValue = inputValues[i];
      
      if (inputValue.startsWith('{') && inputValue.endsWith('}')) {
        // 数组格式 {1, 2, 3}
        const elementsStr = inputValue.slice(1, -1).trim();
        const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
        maxCols = Math.max(maxCols, elements.length);
        arrayRows.push(inputValue);
      } else {
        // 单个值，转换为数组格式
        arrayRows.push("{" + inputValue + "}");
        maxCols = Math.max(maxCols, 1);
      }
    }
    
    // 确保所有行有相同的列数（用默认值填充）
    const defaultValue = getDefaultValue(arrayType);
    for (let i = 0; i < arrayRows.length; i++) {
      if (arrayRows[i].startsWith('{') && arrayRows[i].endsWith('}')) {
        const elementsStr = arrayRows[i].slice(1, -1).trim();
        const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
        
        // 补齐到maxCols列
        while (elements.length < maxCols) {
          elements.push(defaultValue);
        }
        
        arrayRows[i] = "{" + elements.join(", ") + "}";
      }
    }
    
    const rows = arrayRows.length;
    const cols = maxCols;
    const arrayDeclaration = arrayType + " " + varName + "[" + rows + "][" + cols + "] = {" + arrayRows.join(", ") + "};";
    
    if (isLocal) {
      return "  " + arrayDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, arrayDeclaration);
    }
    return "";
  }
  
  // 默认情况 - 使用用户选择的类型和长度
  const lengthValue = block.getFieldValue("LENGTH");
  const arrayLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
  
  const arrayDeclaration = arrayType + " " + varName + "[" + arrayLength + "];";
  
  if (isLocal) {
    return "  " + arrayDeclaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  }
  
  return "";
};

// array_create_with_item 作为输出块，返回数组文本
Arduino.forBlock["array_create_with_item"] = function (block, generator) {
  const lengthValue = generator.valueToCode(block, "LENGTH", Arduino.ORDER_ATOMIC);
  const length = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
  let items = [];
  
  // 收集该块中的所有值
  for (let i = 0; i < length; i++) {
    const value = generator.valueToCode(block, "VALUE" + i, Arduino.ORDER_ATOMIC) || getDefaultValue('int');
    items.push(value);
  }
  
  // 返回数组文本格式，如 "{1, 2, 3}"
  const code = '{' + items.join(', ') + '}';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["array_create_with_text"] = function (block, generator) {
  // 获取文本输入值
  const textValue = generator.valueToCode(block, "TEXT", Arduino.ORDER_ATOMIC) || '""';
  
  // 直接返回字符串值，保持原有的引号格式
  return [textValue, Arduino.ORDER_ATOMIC];
};
// // 创建一维数组（使用初始值）
// Arduino.forBlock["array_create_with_text"] = function (block, generator) {
//   const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
//   const arrayType = block.getFieldValue("TYPE");
//   const arraySize = parseInt(block.getFieldValue("SIZE"));
  
//   // 判断是否在函数作用域内
//   const isLocal = isInFunctionScope(block);
  
//   // 获取初始值，可能来自数组初始化块或文本输入
//   let values = generator.valueToCode(block, "VALUES", Arduino.ORDER_ATOMIC);
  
//   // 如果没有连接任何块，提供默认值
//   if (!values) {
//     const defaultValue = getDefaultValue(arrayType);
//     const defaultValues = new Array(arraySize).fill(defaultValue);
//     values = defaultValues.join(", ");
//
  
//   const arrayDeclaration = arrayType + " " + varName + "[" + arraySize + "] = {" + values + "};";
  
//   if (isLocal) {
//     // 在函数内，作为局部变量直接返回代码
//     return "  " + arrayDeclaration + "\n";
//   } else {
//     // 在全局作用域，添加到全局变量
//     generator.addVariable("var_declare_" + varName, arrayDeclaration);
//   }
  
//   return "";
// };

// 获取数组元素
Arduino.forBlock["array_get_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = generator.valueToCode(block, "AT", Arduino.ORDER_ATOMIC) || "0";
  
  const code = varName + "[" + index + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置数组元素
Arduino.forBlock["array_set_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = generator.valueToCode(block, "AT", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "TO", Arduino.ORDER_ASSIGNMENT) || "0";
  
  return varName + "[" + index + "] = " + value + ";\n";
};

// 获取数组长度
Arduino.forBlock["array_length"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const code = "(sizeof(" + varName + ") / sizeof(" + varName + "[0]))";
  return [code, Arduino.ORDER_ATOMIC];
};

// 创建二维数组
Arduino.forBlock["array2_create_with_text"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const arrayType = block.getFieldValue("TYPE");
  const rows = parseInt(block.getFieldValue("ROWS"));
  const cols = parseInt(block.getFieldValue("COLS"));
  const text = block.getFieldValue("TEXT");
  
  // 判断是否在函数作用域内
  const isLocal = isInFunctionScope(block);
  
  const arrayDeclaration = arrayType + " " + varName + "[" + rows + "][" + cols + "] = " + text + ";";
  
  if (isLocal) {
    // 在函数内，作为局部变量直接返回代码
    return "  " + arrayDeclaration + "\n";
  } else {
    // 在全局作用域，添加到全局变量
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  }
  
  return "";
};

// 获取二维数组元素
Arduino.forBlock["array2_get_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  
  const code = varName + "[" + row + "][" + col + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置二维数组元素
Arduino.forBlock["array2_set_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";
  
  return varName + "[" + row + "][" + col + "] = " + value + ";\n";
};

// 获取二维数组行数或列数
Arduino.forBlock["array2_get_length"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const type = block.getFieldValue("TYPE");
  
  let code;
  if (type === "rows") {
    code = "(sizeof(" + varName + ") / sizeof(" + varName + "[0]))";
  } else {
    code = "(sizeof(" + varName + "[0]) / sizeof(" + varName + "[0][0]))";
  }
  
  return [code, Arduino.ORDER_ATOMIC];
};

// 数组循环移位
Arduino.forBlock["array_loop"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const mode = block.getFieldValue("MODE");
  
  if (mode === "left") {
    // 左移函数
    const functionName = "array_left_shift_" + varName;
    const functionCode = "void " + functionName + "() {\n" +
      "  int arraySize = sizeof(" + varName + ") / sizeof(" + varName + "[0]);\n" +
      "  if (arraySize > 1) {\n" +
      "    auto temp = " + varName + "[0];\n" +
      "    for (int i = 0; i < arraySize - 1; i++) {\n" +
      "      " + varName + "[i] = " + varName + "[i + 1];\n" +
      "    }\n" +
      "    " + varName + "[arraySize - 1] = temp;\n" +
      "  }\n" +
      "}";
    generator.addFunction(functionName, functionCode);
    return functionName + "();\n";
  } else {
    // 右移函数
    const functionName = "array_right_shift_" + varName;
    const functionCode = "void " + functionName + "() {\n" +
      "  int arraySize = sizeof(" + varName + ") / sizeof(" + varName + "[0]);\n" +
      "  if (arraySize > 1) {\n" +
      "    auto temp = " + varName + "[arraySize - 1];\n" +
      "    for (int i = arraySize - 1; i > 0; i--) {\n" +
      "      " + varName + "[i] = " + varName + "[i - 1];\n" +
      "    }\n" +
      "    " + varName + "[0] = temp;\n" +
      "  }\n" +
      "}";
    generator.addFunction(functionName, functionCode);
    return functionName + "();\n";
  }
};
