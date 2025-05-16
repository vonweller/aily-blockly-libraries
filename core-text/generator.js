try {
  const TEXT_GET_SUBSTRING_MUTATOR_MIXIN = {
    mutationToDom: function () {
      const container = document.createElement('mutation');
      container.setAttribute('at1', this.isAt1_ ? 'true' : 'false');
      container.setAttribute('at2', this.isAt2_ ? 'true' : 'false');
      return container;
    },
    domToMutation: function (xmlElement) {
      this.isAt1_ = xmlElement.getAttribute('at1') !== 'false';
      this.isAt2_ = xmlElement.getAttribute('at2') !== 'false';
      this.updateAt_(1, this.isAt1_);
      this.updateAt_(2, this.isAt2_);
    },
    updateAt_: function (n, isAt) {
      // 使用dummy输入而非创建新输入
      const dummyInputName = 'AT' + n + '_DUMMY';
      const dummyInput = this.getInput(dummyInputName);

      if (!dummyInput) {
        console.error('找不到输入：', dummyInputName);
        return;
      }

      // 字段名称
      const fieldName = 'AT' + n;
      // 值输入名称（添加_VALUE后缀）
      const valueInputName = 'AT' + n + '_VALUE';

      // 删除之前可能添加的值输入块
      const existingInput = this.getInput(valueInputName);
      if (existingInput) {
        this.removeInput(valueInputName);
      }

      // 如果需要数值输入，添加一个值输入块
      if (isAt) {
        // 创建值输入块
        const valueInput = this.appendValueInput(valueInputName)
          .setCheck('Number');

        // 找出dummy输入后的下一个输入名称
        const inputList = this.inputList;
        const dummyIndex = inputList.findIndex(input => input.name === dummyInputName);

        // 如果dummy输入不是最后一个输入，将值输入移动到dummy输入之后
        if (dummyIndex < inputList.length - 1) {
          const nextInputName = inputList[dummyIndex + 1].name;
          this.moveInputBefore(valueInputName, nextInputName);
        }
      }

      // 更新状态标记
      if (n === 1) this.isAt1_ = isAt;
      if (n === 2) this.isAt2_ = isAt;
    }
  };

  const TEXT_GET_SUBSTRING_EXTENSION = function () {
    // 初始化
    this.isAt1_ = true; // 默认显示AT1输入
    this.isAt2_ = true; // 默认显示AT2输入

    // WHERE1
    const dropdown1 = this.getField('WHERE1');
    if (dropdown1) {
      dropdown1.setValidator((value) => {
        const isAt = value === 'FROM_START' || value === 'FROM_END';
        this.updateAt_(1, isAt);
        return undefined;
      });
    }

    // WHERE2
    const dropdown2 = this.getField('WHERE2');
    if (dropdown2) {
      dropdown2.setValidator((value) => {
        const isAt = value === 'FROM_START' || value === 'FROM_END';
        this.updateAt_(2, isAt);
        return undefined;
      });
    }

    // 应用初始状态
    this.updateAt_(1, this.isAt1_);
    this.updateAt_(2, this.isAt2_);
  };

  if (Blockly.Extensions.isRegistered('text_getSubstring_mutator')) {
    Blockly.Extensions.unregister('text_getSubstring_mutator');
  }

  Blockly.Extensions.registerMutator(
    'text_getSubstring_mutator',
    TEXT_GET_SUBSTRING_MUTATOR_MIXIN,
    TEXT_GET_SUBSTRING_EXTENSION
  );
} catch (e) {
  console.error("注册text_getSubstring_mutator扩展失败:", e);
}

Arduino.forceString = function (value) {
  const strRegExp = /^\s*'([^']|\\')*'\s*$/;
  if (strRegExp.test(value)) {
    return [value, Arduino.ORDER_ATOMIC];
  }
  return ["String(" + value + ")", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.getSubstringIndex = function (stringName, where, opt_at) {
  if (where === "FIRST") {
    return "0";
  } else if (where === "FROM_END") {
    return stringName + ".length - 1 - " + opt_at;
  } else if (where === "LAST") {
    return stringName + ".length - 1";
  } else {
    return opt_at;
  }
};

Arduino.forBlock["string_add_string"] = function (block) {
  const string1 = block.getFieldValue("STRING1") || "";
  const string2 = block.getFieldValue("STRING2") || "";
  const code =
    Arduino.forceString(`"${string1}"`)[0] + " + " + Arduino.forceString(`"${string2}"`)[0];
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_charAt"] = function (block) {
  const string = block.getFieldValue("STRING") || "";
  const num = block.getFieldValue("NUM") || 0;
  const code = Arduino.forceString(
    Arduino.forceString(`"${string}"`)[0] + `.charAt(${num}-1)`,
  )[0];
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_length"] = function (block) {
  const string = block.getFieldValue("STRING") || "";
  const code = Arduino.forceString(`"${string}"`)[0] + ".length()";
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_indexOf"] = function (block) {
  const string1 = block.getFieldValue("STRING1") || "";
  const string2 = block.getFieldValue("STRING2") || "";
  const code =
    Arduino.forceString(`"${string1}"`)[0] +
    ".indexOf(" +
    Arduino.forceString(`"${string2}"`)[0] +
    ") != -1";
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_substring"] = function (block) {
  const string = block.getFieldValue("STRING") || "";
  const start = block.getFieldValue("START");
  const startIndex = block.getFieldValue("START_INDEX") || 0;
  const last = block.getFieldValue("LAST");
  const lastIndex = block.getFieldValue("LAST_INDEX") || 0;
  const code = `dfstring.substring("${string}",${start},${startIndex},${last},${lastIndex})`;

  Arduino.addLibrary("DFString", "#include <DFString.h>");
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_find_str"] = function (block) {
  const string1 = block.getFieldValue("STRING1") || "";
  const string2 = block.getFieldValue("STRING2") || "";
  const find = block.getFieldValue("FIND") || "";
  const code = `dfstring.${find}(String("${string1}"), String("${string2}"))`;

  Arduino.addLibrary("DFString", "#include <DFString.h>");
  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["string_to"] = function (block) {
  const string = block.getFieldValue("STRING") || "";
  const type = block.getFieldValue("TYPE");
  const code = `String("${string}").${type}()`;

  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["number_to"] = function (block) {
  const num = block.getFieldValue("NUM") || 0;
  const code = `String(char(${num}))`;

  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["toascii"] = function (block) {
  const string = block.getFieldValue("STRING") || "";
  const code = `toascii("${string}")`;

  return [code, Arduino.ORDER_ADDITION];
};

Arduino.forBlock["number_to_string"] = function (block) {
  // 获取连接到NUM输入的块
  const inputBlock = block.getInputTargetBlock("NUM");
  let code;

  // 检查是否为变量块
  if (inputBlock && inputBlock.type === "variables_get") {
    // 这是一个变量块
    const varName = Arduino.getVariableName(inputBlock.getFieldValue("VAR"));
    code = `String(${varName})`;
  } else {
    // 非变量块，使用标准处理方式
    const num = Arduino.valueToCode(block, "NUM", Arduino.ORDER_ATOMIC) || "0";
    code = `String(${num})`;
  }

  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text"] = function (block) {
  // Text value.
  const code = Arduino.quote_(block.getFieldValue("TEXT"));
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["text_join"] = function (block) {
  // Create a string made up of any number of elements of any type.
  const joinBlock = block;
  switch (joinBlock.itemCount_) {
    case 0:
      return ["\"\"", Arduino.ORDER_ATOMIC];
    case 1: {
      const element =
        Arduino.valueToCode(joinBlock, "ADD0", Arduino.ORDER_NONE) || "\"\"";
      const codeAndOrder = Arduino.forceString(element);
      return codeAndOrder;
    }
    case 2: {
      const element0 =
        Arduino.valueToCode(joinBlock, "ADD0", Arduino.ORDER_NONE) || "\"\"";
      const element1 =
        Arduino.valueToCode(joinBlock, "ADD1", Arduino.ORDER_NONE) || "\"\"";
      const code = Arduino.forceString(element0)[0] + " + " + Arduino.forceString(element1)[0];
      return [code, Arduino.ORDER_ADDITION];
    }
    default: {
      // Arduino不支持数组join方法，使用String连接替代
      let code = "String(\"\")";
      for (let i = 0; i < joinBlock.itemCount_; i++) {
        const element = Arduino.valueToCode(joinBlock, "ADD" + i, Arduino.ORDER_NONE) || "\"\"";
        code += " + " + Arduino.forceString(element)[0];
      }
      return [code, Arduino.ORDER_ADDITION];
    }
  }
};

Arduino.forBlock["text_append"] = function (block) {
  // Append to a variable in place.
  const varName = Arduino.getVariableName(block.getFieldValue("VAR"));
  const value = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_NONE) || "\"\"";

  try {
    addVariableToToolbox(block, varName);
  } catch (e) {
    console.error("添加变量到工具箱失败:", e);
  }

  const code = varName + " += " + Arduino.forceString(value)[0] + ";\n";
  return code;
};

Arduino.forBlock["text_length"] = function (block) {
  // String length - Arduino使用length()方法而不是length属性
  const text = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_MEMBER) || "\"\"";
  return [text + ".length()", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_isEmpty"] = function (block) {
  // Is the string empty?
  const text = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_MEMBER) || "\"\"";
  return [text + ".length() == 0", Arduino.ORDER_EQUALITY];
};

Arduino.forBlock["text_indexOf"] = function (block) {
  // Search the text for a substring.
  const operator = block.getFieldValue("END") === "FIRST" ? "indexOf" : "lastIndexOf";
  const substring = Arduino.valueToCode(block, "FIND", Arduino.ORDER_NONE) || "\"\"";
  const text = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_MEMBER) || "\"\"";

  try {
    addVariableToToolbox(block, text);
  } catch (e) {
    console.error("添加变量到工具箱失败:", e);
  }

  // Arduino String类使用相同的方法名，但返回值与JS略有不同
  const code = text + "." + operator + "(" + substring + ")";
  // Adjust index if using one-based indices.
  if (block.workspace.options.oneBasedIndex) {
    return [code + " + 1", Arduino.ORDER_ADDITION];
  }
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_charAt"] = function (block) {
  // Get letter at index.
  const where = block.getFieldValue("WHERE") || "FROM_START";
  const textOrder = where === "RANDOM" ? Arduino.ORDER_NONE : Arduino.ORDER_MEMBER;
  const text = Arduino.valueToCode(block, "VALUE", textOrder) || "\"\"";

  try {
    addVariableToToolbox(block, text);
  } catch (e) {
    console.error("添加变量到工具箱失败:", e);
  }

  switch (where) {
    case "FIRST": {
      const code = text + ".charAt(0)";
      return [code, Arduino.ORDER_FUNCTION_CALL];
    }
    case "LAST": {
      // Arduino不支持slice，使用charAt(length-1)替代
      const code = text + ".charAt(" + text + ".length()-1)";
      return [code, Arduino.ORDER_FUNCTION_CALL];
    }
    case "FROM_START": {
      const at = Arduino.getAdjusted(block, "AT");
      const code = text + ".charAt(" + at + ")";
      return [code, Arduino.ORDER_FUNCTION_CALL];
    }
    case "FROM_END": {
      const at = Arduino.getAdjusted(block, "AT", 1, true);
      // 从末尾计算位置
      const code = text + ".charAt(" + text + ".length()-1-" + at + ")";
      return [code, Arduino.ORDER_FUNCTION_CALL];
    }
    case "RANDOM": {
      // Arduino需要自定义随机字符选择函数
      Arduino.addDefinition('text_random_letter',
        'char textRandomLetter(String text) {\n' +
        '  if (text.length() == 0) return 0;\n' +
        '  int index = random(text.length());\n' +
        '  return text.charAt(index);\n' +
        '}\n');
      const code = "textRandomLetter(" + text + ")";
      return [code, Arduino.ORDER_FUNCTION_CALL];
    }
  }
  throw Error("Unhandled option (text_charAt).");
};

Arduino.forBlock["tt_getSubstring"] = function (block) {
  // Get substring.
  const text = Arduino.valueToCode(block, "STRING", Arduino.ORDER_NONE) || "\"\"";
  const where1 = block.getFieldValue("WHERE1");
  const where2 = block.getFieldValue("WHERE2");

  try {
    addVariableToToolbox(block, text);
  } catch (e) {
    console.error("添加变量到工具箱失败:", e);
  }

  console.log("where1: ", where1)
  console.log("where2: ", where2)

  let at1;
  switch (where1) {
    case "FROM_START":
      // 从AT1_VALUE输入获取值
      at1 = Arduino.valueToCode(block, "AT1_VALUE", Arduino.ORDER_NONE) || "0";
      break;
    case "FROM_END":
      // 从AT1_VALUE输入获取值
      const at1Value = Arduino.valueToCode(block, "AT1_VALUE", Arduino.ORDER_NONE) || "0";
      at1 = text + ".length() - 1 - " + at1Value;
      break;
    case "FIRST":
      at1 = "0";
      break;
    default:
      throw Error("Unhandled option (text_getSubstring).");
  }

  let at2;
  switch (where2) {
    case "FROM_START":
      // 从AT2_VALUE输入获取值
      at2 = Arduino.valueToCode(block, "AT2_VALUE", Arduino.ORDER_NONE) || "0";
      break;
    case "FROM_END":
      // 从AT2_VALUE输入获取值
      const at2Value = Arduino.valueToCode(block, "AT2_VALUE", Arduino.ORDER_NONE) || "0";
      at2 = text + ".length() - " + at2Value;
      break;
    case "LAST":
      at2 = text + ".length()";
      break;
    default:
      throw Error("Unhandled option (text_getSubstring).");
  }

  // Arduino String的substring方法语法
  const code = text + ".substring(" + at1 + ", " + at2 + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_changeCase"] = function (block) {
  // Change capitalization.
  const operator = block.getFieldValue("CASE");
  const text = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_MEMBER) || "\"\"";
  let code;

  // 为Arduino添加自定义函数
  if (operator === "UPPERCASE") {
    Arduino.addFunction('text_to_upper',
      'String textToUpper(String text) {\n' +
      '  String result = text;\n' +
      '  result.toUpperCase();\n' +
      '  return result;\n' +
      '}\n');
    code = "textToUpper(" + text + ")";
  } else if (operator === "LOWERCASE") {
    Arduino.addFunction('text_to_lower',
      'String textToLower(String text) {\n' +
      '  String result = text;\n' +
      '  result.toLowerCase();\n' +
      '  return result;\n' +
      '}\n');
    code = "textToLower(" + text + ")";
  } else if (operator === "TITLECASE") {
    // Arduino不内置标题大小写函数，需要自定义实现
    Arduino.addFunction('text_to_title',
      'String textToTitleCase(String text) {\n' +
      '  String result = "";\n' +
      '  bool capitalizeNext = true;\n' +
      '  for (unsigned int i = 0; i < text.length(); i++) {\n' +
      '    char c = text.charAt(i);\n' +
      '    if (isSpace(c) || c == \'\\t\' || c == \'\\n\') {\n' +
      '      capitalizeNext = true;\n' +
      '      result += c;\n' +
      '    } else if (capitalizeNext) {\n' +
      '      result += (char)toupper(c);\n' +
      '      capitalizeNext = false;\n' +
      '    } else {\n' +
      '      result += (char)tolower(c);\n' +
      '    }\n' +
      '  }\n' +
      '  return result;\n' +
      '}\n');
    code = "textToTitleCase(" + text + ")";
  }

  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_trim"] = function (block) {
  // Trim spaces.
  const mode = block.getFieldValue("MODE");
  const text = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_MEMBER) || "\"\"";

  // Arduino需要自定义修剪函数
  let functionName;
  if (mode === "BOTH") {
    Arduino.addFunction('text_trim',
      'String textTrim(String text) {\n' +
      '  String result = text;\n' +
      '  result.trim();\n' +
      '  return result;\n' +
      '}\n');
    functionName = "textTrim";
  } else if (mode === "LEFT") {
    Arduino.addFunction('text_trim_left',
      'String textTrimLeft(String text) {\n' +
      '  int i = 0;\n' +
      '  while (i < text.length() && isSpace(text.charAt(i))) {\n' +
      '    i++;\n' +
      '  }\n' +
      '  return text.substring(i);\n' +
      '}\n');
    functionName = "textTrimLeft";
  } else if (mode === "RIGHT") {
    Arduino.addFunction('text_trim_right',
      'String textTrimRight(String text) {\n' +
      '  int i = text.length() - 1;\n' +
      '  while (i >= 0 && isSpace(text.charAt(i))) {\n' +
      '    i--;\n' +
      '  }\n' +
      '  return text.substring(0, i + 1);\n' +
      '}\n');
    functionName = "textTrimRight";
  }

  const code = functionName + "(" + text + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_print"] = function (block) {
  // Print statement.
  const msg = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_NONE) || "''";
  return "window.alert(" + msg + ");\n";
};

Arduino.forBlock["text_prompt_ext"] = function (block) {
  // Prompt function.
  let msg;
  if (block.getField("TEXT")) {
    // Internal message.
    msg = Arduino.quote_(block.getFieldValue("TEXT"));
  } else {
    // External message.
    msg = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_NONE) || "''";
  }
  let code = "window.prompt(" + msg + ")";
  const toNumber = block.getFieldValue("TYPE") === "NUMBER";
  if (toNumber) {
    code = "Number(" + code + ")";
  }
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// export const text_prompt = text_prompt_ext;
Arduino.forBlock["text_prompt"] = Arduino.forBlock["text_prompt_ext"];

Arduino.forBlock["text_count"] = function (block) {
  const text = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_NONE) || "\"\"";
  const sub = Arduino.valueToCode(block, "SUB", Arduino.ORDER_NONE) || "\"\"";

  // Arduino需要自定义函数计数子字符串出现次数
  Arduino.addFunction('text_count',
    'int textCount(String text, String sub) {\n' +
    '  if (sub.length() == 0) return text.length() + 1;\n' +
    '  int count = 0;\n' +
    '  int index = text.indexOf(sub);\n' +
    '  while (index != -1) {\n' +
    '    count++;\n' +
    '    index = text.indexOf(sub, index + 1);\n' +
    '  }\n' +
    '  return count;\n' +
    '}\n');

  const code = "textCount(" + text + ", " + sub + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_replace"] = function (block) {
  const text = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_NONE) || "\"\"";
  const from = Arduino.valueToCode(block, "FROM", Arduino.ORDER_NONE) || "\"\"";
  const to = Arduino.valueToCode(block, "TO", Arduino.ORDER_NONE) || "\"\"";

  // Arduino需要自定义替换函数，String.replace()只替换第一个匹配项
  Arduino.addFunction('text_replace_all',
    'String textReplaceAll(String text, String from, String to) {\n' +
    '  String result = text;\n' +
    '  int index = result.indexOf(from);\n' +
    '  while (index != -1) {\n' +
    '    result = result.substring(0, index) + to + result.substring(index + from.length());\n' +
    '    index = result.indexOf(from, index + to.length());\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n');

  const code = "textReplaceAll(" + text + ", " + from + ", " + to + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["text_reverse"] = function (block) {
  console.log("使用到了text_reverse");
  const text = Arduino.valueToCode(block, "TEXT", Arduino.ORDER_MEMBER) || "\"\"";

  console.log("text_reverse: ", text);

  // Arduino需要自定义反转函数
  Arduino.addFunction('text_reverse',
    'String textReverse(String text) {\n' +
    '  String result = "";\n' +
    '  for (int i = text.length() - 1; i >= 0; i--) {\n' +
    '    result += text.charAt(i);\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n');

  const code = "textReverse(" + text + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};
