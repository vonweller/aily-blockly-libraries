// 避免重复加载扩展
if (Blockly.Extensions.isRegistered('array_init_mutator')) {
  Blockly.Extensions.unregister('array_init_mutator');
}

// 数组初始化动态扩展
Blockly.Extensions.register('array_init_mutator', function() {
  this.itemCount_ = 3; // 默认3个项目
  
  // 更新块的形状
  this.updateShape_ = function() {
    const length = parseInt(this.getFieldValue('LENGTH')) || 3;
    
    // 如果长度改变，更新项目数量
    if (this.itemCount_ !== length) {
      // 移除多余的输入
      for (let i = length; i < this.itemCount_; i++) {
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
  
  // 监听长度字段的变化
  this.getField('LENGTH').setValidator((newValue) => {
    const length = parseInt(newValue) || 3;
    if (length >= 1 && length <= 20) {
      setTimeout(() => {
        this.updateShape_();
      }, 0);
      return newValue;
    }
    return null;
  });
});

// 创建一维数组（使用项目列表）
Arduino.forBlock["array_create_with"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const arrayType = block.getFieldValue("TYPE");
  
  // 收集所有连接的 array_create_with_item 块
  let arrayBlocks = [];
  let currentBlock = block.getInputTargetBlock("STACK");
  
  while (currentBlock && currentBlock.type === "array_create_with_item") {
    arrayBlocks.push(currentBlock);
    currentBlock = currentBlock.getNextBlock();
  }
  
  // 根据连接的块数量决定是一维还是二维数组
  if (arrayBlocks.length === 0) {
    // 没有连接任何块，创建默认一维数组
    const defaultValue = arrayType === "String" ? '""' : "0";
    const arrayDeclaration = arrayType + " " + varName + "[3] = {" + defaultValue + ", " + defaultValue + ", " + defaultValue + "};";
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  } else if (arrayBlocks.length === 1) {
    // 一个块，创建一维数组
    const itemBlock = arrayBlocks[0];
    const length = parseInt(itemBlock.getFieldValue('LENGTH')) || 3;
    let items = [];
    
    // 收集该块中的所有值
    for (let i = 0; i < length; i++) {
      const value = Arduino.valueToCode(itemBlock, "VALUE" + i, Arduino.ORDER_ATOMIC) || (arrayType === "String" ? '""' : "0");
      items.push(value);
    }
    
    const arrayDeclaration = arrayType + " " + varName + "[" + length + "] = {" + items.join(", ") + "};";
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  } else if (arrayBlocks.length === 2) {
    // 两个块，创建二维数组
    const firstBlock = arrayBlocks[0];
    const secondBlock = arrayBlocks[1];
    const rows = parseInt(firstBlock.getFieldValue('LENGTH')) || 3;
    const cols = parseInt(secondBlock.getFieldValue('LENGTH')) || 3;
    
    // 构建二维数组的初始值
    let arrayRows = [];
    
    // 处理第一行（来自第一个块）
    let firstRowItems = [];
    for (let i = 0; i < cols; i++) {
      const value = Arduino.valueToCode(firstBlock, "VALUE" + i, Arduino.ORDER_ATOMIC) || (arrayType === "String" ? '""' : "0");
      firstRowItems.push(value);
    }
    arrayRows.push("{" + firstRowItems.join(", ") + "}");
    
    // 处理其余行（使用第二个块的值作为模板）
    for (let row = 1; row < rows; row++) {
      let rowItems = [];
      for (let col = 0; col < cols; col++) {
        // 使用第二个块的值作为模板，如果超出范围则使用默认值
        let value;
        if (col < parseInt(secondBlock.getFieldValue('LENGTH'))) {
          value = Arduino.valueToCode(secondBlock, "VALUE" + col, Arduino.ORDER_ATOMIC) || (arrayType === "String" ? '""' : "0");
        } else {
          value = arrayType === "String" ? '""' : "0";
        }
        rowItems.push(value);
      }
      arrayRows.push("{" + rowItems.join(", ") + "}");
    }
    
    const arrayDeclaration = arrayType + " " + varName + "[" + rows + "][" + cols + "] = {" + arrayRows.join(", ") + "};";
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  } else {
    // 超过两个块，只取前两个作为二维数组处理
    const firstBlock = arrayBlocks[0];
    const secondBlock = arrayBlocks[1];
    const rows = parseInt(firstBlock.getFieldValue('LENGTH')) || 3;
    const cols = parseInt(secondBlock.getFieldValue('LENGTH')) || 3;
    
    // 构建二维数组的初始值（与上面逻辑相同）
    let arrayRows = [];
    
    let firstRowItems = [];
    for (let i = 0; i < cols; i++) {
      const value = Arduino.valueToCode(firstBlock, "VALUE" + i, Arduino.ORDER_ATOMIC) || (arrayType === "String" ? '""' : "0");
      firstRowItems.push(value);
    }
    arrayRows.push("{" + firstRowItems.join(", ") + "}");
    
    for (let row = 1; row < rows; row++) {
      let rowItems = [];
      for (let col = 0; col < cols; col++) {
        // 使用第二个块的值作为模板，如果超出范围则使用默认值
        let value;
        if (col < parseInt(secondBlock.getFieldValue('LENGTH'))) {
          value = Arduino.valueToCode(secondBlock, "VALUE" + col, Arduino.ORDER_ATOMIC) || (arrayType === "String" ? '""' : "0");
        } else {
          value = arrayType === "String" ? '""' : "0";
        }
        rowItems.push(value);
      }
      arrayRows.push("{" + rowItems.join(", ") + "}");
    }
    
    const arrayDeclaration = arrayType + " " + varName + "[" + rows + "][" + cols + "] = {" + arrayRows.join(", ") + "};";
    generator.addVariable("var_declare_" + varName, arrayDeclaration);
  }
  
  return "";
};

// 数组初始化块（作为语句块时不生成代码，只在 array_create_with 中被处理）
Arduino.forBlock["array_create_with_item"] = function (block, generator) {
  // 作为语句块时，不需要生成独立代码
  // 值的获取在 array_create_with 的 generator 中处理
  return "";
};

// 创建一维数组（使用初始值）
Arduino.forBlock["array_create_with_text"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const arrayType = block.getFieldValue("TYPE");
  const arraySize = parseInt(block.getFieldValue("SIZE"));
  
  // 获取初始值，可能来自数组初始化块或文本输入
  let values = Arduino.valueToCode(block, "VALUES", Arduino.ORDER_ATOMIC);
  
  // 如果没有连接任何块，提供默认值
  if (!values) {
    const defaultValue = arrayType === "String" ? '""' : "0";
    const defaultValues = new Array(arraySize).fill(defaultValue);
    values = defaultValues.join(", ");
  }
  
  const arrayDeclaration = arrayType + " " + varName + "[" + arraySize + "] = {" + values + "};";
  generator.addVariable("var_declare_" + varName, arrayDeclaration);
  
  return "";
};

// 获取数组元素
Arduino.forBlock["array_get_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = Arduino.valueToCode(block, "AT", Arduino.ORDER_ADDITIVE) || "0";
  
  const code = varName + "[" + index + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置数组元素
Arduino.forBlock["array_set_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = Arduino.valueToCode(block, "AT", Arduino.ORDER_ADDITIVE) || "0";
  const value = Arduino.valueToCode(block, "TO", Arduino.ORDER_ASSIGNMENT) || "0";
  
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
  
  const arrayDeclaration = arrayType + " " + varName + "[" + rows + "][" + cols + "] = " + text + ";";
  generator.addVariable("var_declare_" + varName, arrayDeclaration);
  
  return "";
};

// 获取二维数组元素
Arduino.forBlock["array2_get_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = Arduino.valueToCode(block, "ROW", Arduino.ORDER_ADDITIVE) || "0";
  const col = Arduino.valueToCode(block, "COL", Arduino.ORDER_ADDITIVE) || "0";
  
  const code = varName + "[" + row + "][" + col + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置二维数组元素
Arduino.forBlock["array2_set_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = Arduino.valueToCode(block, "ROW", Arduino.ORDER_ADDITIVE) || "0";
  const col = Arduino.valueToCode(block, "COL", Arduino.ORDER_ADDITIVE) || "0";
  const value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";
  
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
