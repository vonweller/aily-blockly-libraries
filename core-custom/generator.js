Arduino['custom_function_def'] = function(block) {
  const funcName = block.getFieldValue('FUNC_NAME');
  const returnType = block.getFieldValue('RETURN_TYPE');
  const funcBody = block.getFieldValue('FUNC_BODY');
  
  // 处理参数
  let params = '';
  let paramBlock = block.getInputTargetBlock('PARAMS');
  const paramList = [];
  
  while (paramBlock) {
    const paramType = paramBlock.getFieldValue('PARAM_TYPE');
    const paramName = paramBlock.getFieldValue('PARAM_NAME');
    paramList.push(paramType + ' ' + paramName);
    paramBlock = paramBlock.getNextBlock();
  }
  
  params = paramList.join(', ');
  
  // 生成函数定义
  const code = `${returnType} ${funcName}(${params}) {\n${funcBody}\n}\n\n`;
  
  // 将函数添加到全局定义中
  Blockly.Arduino.addDeclaration(funcName, code);
  
  // 返回空字符串，因为这个块不会直接在当前位置生成代码
  return '';
};

Arduino['custom_function_call'] = function(block) {
  const funcName = block.getFieldValue('FUNC_NAME');
  
  // 处理参数
  let args = '';
  let argBlock = block.getInputTargetBlock('ARGS');
  const argList = [];
  
  while (argBlock) {
    const argValue = Blockly.Arduino.valueToCode(
      argBlock, 'ARG', Blockly.Arduino.ORDER_NONE) || '0';
    argList.push(argValue);
    argBlock = argBlock.getNextBlock();
  }
  
  args = argList.join(', ');
  
  // 生成函数调用
  const code = `${funcName}(${args});\n`;
  return code;
};

Arduino['custom_function_param'] = function(block) {
  // 这个块不直接生成代码，它的信息会被 custom_function_def 块处理
  return '';
};

Arduino['custom_function_arg'] = function(block) {
  // 这个块不直接生成代码，它的信息会被 custom_function_call 块处理
  return '';
};

Arduino['custom_function_return'] = function(block) {
  const value = Blockly.Arduino.valueToCode(
    block, 'RETURN_VALUE', Blockly.Arduino.ORDER_NONE) || '0';
  
  return `return ${value};\n`;
};