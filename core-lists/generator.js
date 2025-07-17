// // 引入变量工具箱批量移除工具
// function removeVariableFromToolboxById(workspace, varId) {
//   if (!workspace || !varId) return;
//   const originalToolboxDef = workspace.options.languageTree;
//   if (!originalToolboxDef) return;
//   const blockTypes = ["variables_get", "variable_define", "variables_set", "type_cast"];
//   for (let category of originalToolboxDef.contents) {
//     if ((category.name === "Variables" ||
//       (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
//       category.contents = category.contents.filter(item => {
//         if (
//           blockTypes.includes(item.type) &&
//           item.fields && item.fields.VAR &&
//           item.fields.VAR.id === varId
//         ) {
//           return false;
//         }
//         return true;
//       });
//       const allVariables = workspace.getAllVariables();
//       if (allVariables.length === 0) {
//         category.contents = [{
//           "kind": "button",
//           "text": "新建变量",
//           "callbackKey": "CREATE_VARIABLE"
//         }];
//       }
//       if (typeof refreshToolbox === 'function') refreshToolbox(workspace);
//       break;
//     }
//   }
// }
// 检查并移除已存在的数组动态扩展注册
if (Blockly.Extensions.isRegistered('list_dynamic_extension')) {
  Blockly.Extensions.unregister('list_dynamic_extension');
}

Blockly.Extensions.register('list_dynamic_extension', function () {
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

  // 新增：同步 LENGTH 字段的方法
  this.syncLengthFromConnectedBlocks = function () {
    // 查找连接的 list_create_with_item 块
    for (let i = 0; i < this.inputList.length; i++) {
      const input = this.inputList[i];
      if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
        const connectedBlock = input.connection?.targetBlock();
        if (connectedBlock && connectedBlock.type === 'list_create_with_item') {
          // 获取 list_create_with_item 块的 LENGTH 值
          const lengthBlock = connectedBlock.getInputTargetBlock('LENGTH');
          if (lengthBlock && lengthBlock.type === 'math_number') {
            const lengthValue = lengthBlock.getFieldValue('NUM');
            if (lengthValue && !isNaN(parseInt(lengthValue))) {
              // 更新当前块的 LENGTH 字段
              this.setFieldValue(lengthValue, 'LENGTH');
              return; // 只同步第一个找到的 list_create_with_item 块
            }
          }
        }
      }
    }
  };

  // 新增：自动检测并设置数组类型
  this.autoDetectArrayType = function () {
    // 检查所有连接的输入
    for (let i = 0; i < this.inputList.length; i++) {
      const input = this.inputList[i];
      if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
        const connectedBlock = input.connection?.targetBlock();
        if (connectedBlock) {
          // 检查是否连接了字符串相关的块
          if (connectedBlock.type === 'text' || 
              connectedBlock.type === 'list_create_with_text' ||
              (connectedBlock.type === 'variables_get' && this.isStringVariable(connectedBlock))) {
            // 自动切换到字符类型并清空长度
            if (this.getFieldValue('TYPE') !== 'char') {
              this.setFieldValue('char', 'TYPE');
            }
            // 清空LENGTH字段
            if (this.getField('LENGTH')) {
              this.setFieldValue('', 'LENGTH');
            }
            return;
          }
          // 如果连接的是数组项块，检查其内容
          else if (connectedBlock.type === 'list_create_with_item') {
            // 检查数组项块中是否包含字符串
            if (this.hasStringContentInArrayItem(connectedBlock)) {
              if (this.getFieldValue('TYPE') !== 'char') {
                this.setFieldValue('char', 'TYPE');
              }
              // 清空LENGTH字段
              if (this.getField('LENGTH')) {
                this.setFieldValue('', 'LENGTH');
              }
              return;
            }
          }
        }
      }
    }
  };

  // 辅助方法：检查是否为字符串变量
  this.isStringVariable = function (variableBlock) {
    // 这里可以根据变量名或其他方式判断是否为字符串变量
    // 简单实现：检查变量名是否包含string、str、text等关键词
    if (variableBlock.type === 'variables_get') {
      const varName = variableBlock.getFieldValue('VAR');
      if (varName) {
        const varNameLower = varName.toLowerCase();
        return varNameLower.includes('string') || 
               varNameLower.includes('str') || 
               varNameLower.includes('text') ||
               varNameLower.includes('char');
      }
    }
    return false;
  };

  // 辅助方法：检查数组项块中是否包含字符串内容
  this.hasStringContentInArrayItem = function (arrayItemBlock) {
    // 检查数组项块的所有VALUE输入
    for (let i = 0; i < arrayItemBlock.inputList.length; i++) {
      const input = arrayItemBlock.inputList[i];
      if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('VALUE')) {
        const connectedBlock = input.connection?.targetBlock();
        if (connectedBlock && (connectedBlock.type === 'text')) {
          return true;
        }
      }
    }
    return false;
  };

  // 重写 onchange 方法来监听变化
  const originalOnChange = this.onchange;
  this.onchange = function(event) {
    if (originalOnChange) {
      originalOnChange.call(this, event);
    }
    
    // 监听块变化事件
    if (event && event.type === Blockly.Events.BLOCK_CHANGE && this.workspace) {
      const changedBlock = this.workspace.getBlockById(event.blockId);
      
      // 检查变化的块是否是连接到我们输入的 list_create_with_item 块的 LENGTH 数字块
      if (changedBlock && changedBlock.type === 'math_number') {
        // 检查这个数字块是否是某个连接到我们的 list_create_with_item 块的 LENGTH 输入
        for (let i = 0; i < this.inputList.length; i++) {
          const input = this.inputList[i];
          if (input.type === Blockly.INPUT_VALUE && input.name.startsWith('INPUT')) {
            const connectedBlock = input.connection?.targetBlock();
            if (connectedBlock && connectedBlock.type === 'list_create_with_item') {
              const lengthBlock = connectedBlock.getInputTargetBlock('LENGTH');
              if (lengthBlock && lengthBlock.id === changedBlock.id) {
                // 找到了，同步 LENGTH 值
                setTimeout(() => {
                  this.syncLengthFromConnectedBlocks();
                }, 50);
                return;
              }
            }
          }
        }
      }
    }
    
    // 监听块连接/断开事件
    if (event && (event.type === Blockly.Events.BLOCK_MOVE || 
                  event.type === Blockly.Events.BLOCK_CREATE ||
                  event.type === Blockly.Events.BLOCK_DELETE)) {
      // 延迟同步以确保连接完成
      setTimeout(() => {
        this.syncLengthFromConnectedBlocks();
        this.autoDetectArrayType(); // 添加自动类型检测
      }, 100);
    }
  };
});

// 检查并移除已存在的数组动态变异器注册
if (Blockly.Extensions.isRegistered('list_dynamic_mutator')) {
  Blockly.Extensions.unregister('list_dynamic_mutator');
}

// 定义数组动态变异器来处理序列化
Blockly.Extensions.registerMutator('list_dynamic_mutator', {
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
if (Blockly.Extensions.isRegistered('list_init_mutator')) {
  Blockly.Extensions.unregister('list_init_mutator');
}

// 数组初始化动态扩展
Blockly.Extensions.register('list_init_mutator', function() {
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
  
  // 初始化默认的 VALUE 输入
  this.initializeDefaultInputs_ = function() {
    for (let i = 0; i < this.itemCount_; i++) {
      if (!this.getInput(`VALUE${i}`)) {
        const input = this.appendValueInput(`VALUE${i}`)
          .appendField(``);
      }
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
  
  // 初始化默认输入
  this.initializeDefaultInputs_();
});

// 检查并移除已存在的 mutator 扩展注册
if (Blockly.Extensions.isRegistered('list_init_dynamic_mutator')) {
  Blockly.Extensions.unregister('list_init_dynamic_mutator');
}

// 定义 Mutator 来处理序列化
Blockly.Extensions.registerMutator('list_init_dynamic_mutator', {
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
function getDefaultValue(listType) {
  switch (listType) {
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
Arduino.forBlock["list_create_with"] = function (block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'list';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          const oldVar = workspace.getVariable(oldName, 'LISTS');
          const existVar = workspace.getVariable(newName, 'LISTS');
          if (oldVar && !existVar) {
            workspace.renameVariableById(oldVar.getId(), newName);
            if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          }
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }
  
  const varName = block.getFieldValue("VAR") || "list";
  const listType = block.getFieldValue("TYPE");

  // 注册变量到Blockly工具箱
  const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  if (workspace && varName) {
    let variable = workspace.getVariable(varName, 'LISTS');
    if (!variable) {
      // 如果变量不存在，创建一个新的变量
      variable = workspace.createVariable(varName, 'LISTS', null, 'list');
      // 添加到工具箱中
      if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
    }
  }

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
    const listLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;

    // 根据用户选择的类型创建相应的数组声明
    const listDeclaration = listType + " " + varName + "[" + listLength + "]" + ";";

    if (isLocal) {
      return listDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, listDeclaration);
    }
    return "";
  }
  
  // 检查是否有字符串输入（用于字符数组）
  const hasStringInput = inputValues.some(value => value.startsWith('"') && value.endsWith('"'));
  
  if (hasStringInput && inputValues.length === 1) {
    // 单个字符串输入，创建字符数组
    const listDeclaration = "char " + varName + "[] = " + inputValues[0] + ";";
    
    if (isLocal) {
      return listDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, listDeclaration);
    }
    return "";
  }
  
  if (inputValues.length === 1) {
    // 单个数组输入，创建一维数组
    const listText = inputValues[0];
    
    if (listText.startsWith('{') && listText.endsWith('}')) {
      // 从数组文本中提取元素数量
      const elementsStr = listText.slice(1, -1).trim();
      const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
      const length = elements.length || 3;
      
      const listDeclaration = listType + " " + varName + "[" + length + "] = " + listText + ";";
      
      if (isLocal) {
        return listDeclaration + "\n";
      } else {
        generator.addVariable("var_declare_" + varName, listDeclaration);
      }
    } else {
      // 其他情况，使用用户选择的类型和长度创建默认数组
      const lengthValue = block.getFieldValue("LENGTH");
      const listLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
      
      const listDeclaration = listType + " " + varName + "[" + listLength + "];";
      
      if (isLocal) {
        return listDeclaration + "\n";
      } else {
        generator.addVariable("var_declare_" + varName, listDeclaration);
      }
    }
    return "";
  }
  
  if (inputValues.length >= 2) {
    // 多个输入，创建二维数组
    let listRows = [];
    let maxCols = 0;
    
    // 处理每个输入作为数组的一行
    for (let i = 0; i < inputValues.length; i++) {
      const inputValue = inputValues[i];
      
      if (inputValue.startsWith('{') && inputValue.endsWith('}')) {
        // 数组格式 {1, 2, 3}
        const elementsStr = inputValue.slice(1, -1).trim();
        const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
        maxCols = Math.max(maxCols, elements.length);
        listRows.push(inputValue);
      } else {
        // 单个值，转换为数组格式
        listRows.push("{" + inputValue + "}");
        maxCols = Math.max(maxCols, 1);
      }
    }
    
    // 确保所有行有相同的列数（用默认值填充）
    const defaultValue = getDefaultValue(listType);
    for (let i = 0; i < listRows.length; i++) {
      if (listRows[i].startsWith('{') && listRows[i].endsWith('}')) {
        const elementsStr = listRows[i].slice(1, -1).trim();
        const elements = elementsStr ? elementsStr.split(',').map(s => s.trim()) : [];
        
        // 补齐到maxCols列
        while (elements.length < maxCols) {
          elements.push(defaultValue);
        }
        
        listRows[i] = "{" + elements.join(", ") + "}";
      }
    }
    
    const rows = listRows.length;
    const cols = maxCols;
    const listDeclaration = listType + " " + varName + "[" + rows + "][" + cols + "] = {" + listRows.join(", ") + "};";
    
    if (isLocal) {
      return listDeclaration + "\n";
    } else {
      generator.addVariable("var_declare_" + varName, listDeclaration);
    }
    return "";
  }
  
  // 默认情况 - 使用用户选择的类型和长度
  const lengthValue = block.getFieldValue("LENGTH");
  const listLength = lengthValue && !isNaN(parseInt(lengthValue)) ? parseInt(lengthValue) : 3;
  
  const listDeclaration = listType + " " + varName + "[" + listLength + "];";
  
  if (isLocal) {
    return listDeclaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, listDeclaration);
  }
  
  return "";
};

// list_create_with_item 作为输出块，返回数组文本
Arduino.forBlock["list_create_with_item"] = function (block, generator) {
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

// 获取数组元素
Arduino.forBlock["list_get_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = generator.valueToCode(block, "AT", Arduino.ORDER_ATOMIC) || "0";
  
  const code = varName + "[" + index + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置数组元素
Arduino.forBlock["list_set_index"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const index = generator.valueToCode(block, "AT", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "TO", Arduino.ORDER_ASSIGNMENT) || "0";
  
  return varName + "[" + index + "] = " + value + ";\n";
};

// 获取数组长度
Arduino.forBlock["list_length"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const code = "(sizeof(" + varName + ") / sizeof(" + varName + "[0]))";
  return [code, Arduino.ORDER_ATOMIC];
};

// 创建二维数组
Arduino.forBlock["list2_create_with_text"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const listType = block.getFieldValue("TYPE");
  const rows = parseInt(block.getFieldValue("ROWS"));
  const cols = parseInt(block.getFieldValue("COLS"));
  const text = block.getFieldValue("TEXT");

  // 判断是否在函数作用域内
  const isLocal = isInFunctionScope(block);

  const listDeclaration = listType + " " + varName + "[" + rows + "][" + cols + "] = " + text + ";";

  if (isLocal) {
    // 在函数内，作为局部变量直接返回代码
    return "  " + listDeclaration + "\n";
  } else {
    // 在全局作用域，添加到全局变量
    generator.addVariable("var_declare_" + varName, listDeclaration);
  }

  return "";
};

// 获取二维数组元素
Arduino.forBlock["list2_get_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  
  const code = varName + "[" + row + "][" + col + "]";
  return [code, Arduino.ORDER_ATOMIC];
};

// 设置二维数组元素
Arduino.forBlock["list2_set_value"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";
  
  return varName + "[" + row + "][" + col + "] = " + value + ";\n";
};

// 获取二维数组行数或列数
Arduino.forBlock["list2_get_length"] = function (block, generator) {
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
Arduino.forBlock["list_loop"] = function (block, generator) {
  const { name: varName } = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const mode = block.getFieldValue("MODE");
  
  if (mode === "left") {
    // 左移函数
    const functionName = "list_left_shift_" + varName;
    const functionCode = "void " + functionName + "() {\n" +
      "  int listSize = sizeof(" + varName + ") / sizeof(" + varName + "[0]);\n" +
      "  if (listSize > 1) {\n" +
      "    auto temp = " + varName + "[0];\n" +
      "    for (int i = 0; i < listSize - 1; i++) {\n" +
      "      " + varName + "[i] = " + varName + "[i + 1];\n" +
      "    }\n" +
      "    " + varName + "[listSize - 1] = temp;\n" +
      "  }\n" +
      "}";
    generator.addFunction(functionName, functionCode);
    return functionName + "();\n";
  } else {
    // 右移函数
    const functionName = "list_right_shift_" + varName;
    const functionCode = "void " + functionName + "() {\n" +
      "  int listSize = sizeof(" + varName + ") / sizeof(" + varName + "[0]);\n" +
      "  if (listSize > 1) {\n" +
      "    auto temp = " + varName + "[listSize - 1];\n" +
      "    for (int i = listSize - 1; i > 0; i--) {\n" +
      "      " + varName + "[i] = " + varName + "[i - 1];\n" +
      "    }\n" +
      "    " + varName + "[0] = temp;\n" +
      "  }\n" +
      "}";
    generator.addFunction(functionName, functionCode);
    return functionName + "();\n";
  }
};
