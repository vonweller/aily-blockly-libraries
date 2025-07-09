Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = "function_name";
Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE = "function_name";
Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "定义函数";
Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = "定义带返回函数";
Blockly.Msg.PROCEDURES_DEFNORETURN_DO = "执行";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = "返回";
Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL = "";
Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL = "";
Blockly.Msg.PROCEDURES_IFRETURN_CONDITION = "如果";
Blockly.Msg.PROCEDURES_IFRETURN_VALUE = "返回值";

// Helper function to convert Chinese to pinyin
function convertToPinyin(text) {
  try {
    if (typeof window !== 'undefined' && window['pinyinPro']) {
      var { pinyin } = window['pinyinPro'];
      return pinyin(text, { toneType: 'none' }).replace(/\s+/g, '_');
    }
  } catch (e) {
    console.warn('PinyinPro not available, using original name');
  }
  return text;
}

Arduino.forBlock["procedures_defreturn"] = function (block) {
  // Define a procedure with a return value.
  const originalName = block.getFieldValue("NAME");

  // Convert Chinese characters to pinyin if present
  let processedName = originalName;
  if (/[\u4e00-\u9fa5]/.test(originalName)) {
    processedName = convertToPinyin(originalName);
  }

  const funcName = Arduino.getProcedureName(processedName);
  let xfix1 = "";
  if (Arduino.STATEMENT_PREFIX) {
    xfix1 += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  if (Arduino.STATEMENT_SUFFIX) {
    xfix1 += Arduino.injectId(Arduino.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Arduino.prefixLines(xfix1, Arduino.INDENT);
  }
  let loopTrap = "";
  if (Arduino.INFINITE_LOOP_TRAP) {
    loopTrap = Arduino.prefixLines(
      Arduino.injectId(Arduino.INFINITE_LOOP_TRAP, block),
      Arduino.INDENT,
    );
  }
  let branch = "";
  if (block.getInput("STACK")) {
    // The 'procedures_defreturn' block might not have a STACK input.
    branch = Arduino.statementToCode(block, "STACK");
  }
  let returnType = "void"; // Default
  let returnValue = "";
  if (block.getInput("RETURN")) {
    // The 'procedures_defnoreturn' block (which shares this code)
    // does not have a RETURN input.
    returnValue =
      Arduino.valueToCode(block, "RETURN", Arduino.ORDER_NONE) || "";

    // Determine return type based on returnValue
    if (returnValue) {
      // Try to guess the type based on content
      if (returnValue.includes("\"") || returnValue.includes("'") ||
        returnValue.includes("String(")) {
        returnType = "String";
      } else if (returnValue === "true" || returnValue === "false" ||
        returnValue.includes(" == ") || returnValue.includes(" != ") ||
        returnValue.includes(" < ") || returnValue.includes(" > ")) {
        returnType = "boolean";
      } else if (returnValue.includes(".") || /\d+\.\d+/.test(returnValue)) {
        returnType = "float";
      } else if (/^-?\d+$/.test(returnValue) || returnValue.includes("int(")) {
        returnType = "int";
      } else if (returnValue.includes("char(") || (returnValue.length === 3 &&
        returnValue.startsWith("'") && returnValue.endsWith("'"))) {
        returnType = "char";
      } else {
        // For complex expressions, default to int
        returnType = "int";
      }
    }
  }
  let xfix2 = "";
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Arduino.INDENT + "return " + returnValue + ";\n";
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    const originalVarInput = variables[i];
    
    // Check if the variable input contains type information (e.g., "int a", "float temperature")
    const typePattern = /^(int|float|double|long|short|byte|boolean|char|String|void|\w+\*?)\s+(\w+)$/;
    const match = originalVarInput.match(typePattern);
    
    if (match) {
      // User input includes type: "int a" -> use as is
      args[i] = originalVarInput;
    } else {
      // User input is just variable name: "a" -> add default type
      const varName = Arduino.getVariableName(originalVarInput);
      args[i] = "int " + varName;
    }
  }

  // Add Chinese function name comment if the original name contains Chinese characters
  let functionComment = "// Custom Function: " + originalName + "\n";

  let code =
    functionComment +
    returnType + " " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\n" +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    "}";
  code = Arduino.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  // TODO(#7600): find better approach than casting to any to override
  // CodeGenerator declaring .definitions protected.
  Arduino.definitions_["%" + funcName] = code;
  Arduino.addFunction(funcName, code);
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
// export const procedures_defnoreturn = procedures_defreturn;
Arduino.forBlock["procedures_defnoreturn"] =
  Arduino.forBlock["procedures_defreturn"];

Arduino.forBlock["procedures_callreturn"] = function (block) {
  // Call a procedure with a return value.
  const originalName = block.getFieldValue("NAME");

  // Convert Chinese characters to pinyin if present
  let processedName = originalName;
  if (/[\u4e00-\u9fa5]/.test(originalName)) {
    processedName = convertToPinyin(originalName);
  }

  const funcName = Arduino.getProcedureName(processedName);
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] =
      Arduino.valueToCode(block, "ARG" + i, Arduino.ORDER_NONE) || "NULL";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["procedures_callnoreturn"] = function (block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = Arduino.forBlock["procedures_callreturn"](block, Arduino);
  return tuple[0] + ";\n";
};

Arduino.forBlock["procedures_ifreturn"] = function (block) {
  // Conditionally return value from a procedure.
  const condition =
    Arduino.valueToCode(block, "CONDITION", Arduino.ORDER_NONE) || "false";
  let code = "if (" + condition + ") {\n";
  if (Arduino.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Arduino.prefixLines(
      Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
      Arduino.INDENT,
    );
  }
  if (block.hasReturnValue_) {
    const value =
      Arduino.valueToCode(block, "VALUE", Arduino.ORDER_NONE) || "null";
    code += Arduino.INDENT + "return " + value + ";\n";
  } else {
    code += Arduino.INDENT + "return;\n";
  }
  code += "}\n";
  return code;
};
