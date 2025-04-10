Blockly.getMainWorkspace().registerButtonCallback(
  "CREATE_VARIABLE",
  (button) => {
    const workspace = button.getTargetWorkspace();
    Blockly.Variables.createVariableButtonHandler(
      workspace,
      (varName) => {
        Blockly.Msg.VARIABLES_CURRENT_NAME = varName;

        // 获取原始工具箱定义
        const originalToolboxDef = workspace.options.languageTree;

        // 找到变量类别
        const variableCategory = findVariableCategoryInToolboxDef(originalToolboxDef);
        if (variableCategory) {
          // 更新该类别的内容
          if (variableCategory.contents.length === 1) {
            variableCategory.contents = [
              {
                "kind": "button",
                "text": "新建变量",
                "callbackKey": "CREATE_VARIABLE"
              },
              {
                "kind": "block",
                "type": "variable_define"
              },
              {
                "kind": "block",
                "type": "variables_set"
              }
            ];
          }

          // 获取当前时间戳
          const timestamp = new Date().getTime();
          variableCategory.contents.push({
            "kind": "block",
            "type": "variables_get",
            "fields": {
              "VAR": {
                "id": "varName" + timestamp,
                "name": varName,
                "type": "string"
              }
            }
          });

          refreshToolbox(workspace);
        }
      },
      null
    );
  },
);

// 更新toolbox
function refreshToolbox(oldWorkspace, showCategory = true) {
  const originalToolboxDef = oldWorkspace.options.languageTree;
  oldWorkspace.updateToolbox(originalToolboxDef);

  if (!showCategory) return;

  const workspace = Blockly.getMainWorkspace();
  const variableCategory = getVariableCategory(workspace);

  const toolbox = workspace.getToolbox();
  if (toolbox && toolbox.isVisible_ && variableCategory) {
    toolbox.setSelectedItem(variableCategory);
  }
}

// 重命名变量
function renameVariable(block, oldName, newName, vtype) {
  try {
    console.log("rename variable: ", oldName, newName);
    const workspace = block.workspace;
    if (!workspace || !oldName || !newName) return;
    // TODO 提示 命令规范 C语言变量规范 @downey

    const newNameExisting = Blockly.Variables.nameUsedWithAnyType(newName, workspace);
    if (newNameExisting) {
      console.log(`变量 ${newName} 已存在，无法重命名`);
      return;
    }
    Blockly.Msg.VARIABLES_CURRENT_NAME = newName;

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 检查旧变量是否仍被其他块引用
    const blocks = workspace.getAllBlocks(false);
    let isOldVarStillReferenced = false;

    // 排除当前正在编辑的块，检查其他块是否引用了旧变量
    for (const otherBlock of blocks) {
      if (otherBlock.id !== block.id) {
        // 检查变量获取块
        if (otherBlock.type === 'variables_get' || otherBlock.type === 'variables_get_dynamic') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }
        // 检查变量设置块
        if (otherBlock.type === 'variables_set' || otherBlock.type === 'variables_set_dynamic') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }

        // 检查变量定义块
        if (otherBlock.type === 'variable_define') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }
      }
    }

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      console.log("category: ", category);
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

        console.log("isOldVarStillReferenced: ", isOldVarStillReferenced);
        if (!isOldVarStillReferenced) {
          workspace.createVariable(newName, vtype)
          const timestamp = new Date().getTime();
          category.contents.push({
            "kind": "block",
            "type": "variables_get",
            "fields": {
              "VAR": {
                "id": "varName" + timestamp,
                "name": newName,
                "type": "string"
              }
            }
          });
        } else {
          // 如果旧变量未被引用，直接替换名称
          // 获取旧variable的ID
          const oldVariable = workspace.getVariable(oldName, vtype);
          if (oldVariable) {
            const oldVariableId = oldVariable.getId();
            console.log("oldVariableId: ", oldVariableId);
            workspace.renameVariableById(oldVariableId, newName);
            category.contents.forEach(item => {
              if (item.fields && item.fields.VAR && item.fields.VAR.name === oldName) {
                item.fields.VAR.name = newName;
              }
            });
          }
        }

        refreshToolbox(workspace, false);
        break;
      }
    }
  } catch (e) {
    console.log("重命名变量时出错:", e);
  }
}

function isBlockConnected(block) {
  // 检查上方连接
  if (block.previousConnection && block.previousConnection.isConnected()) {
    return true;
  }

  // 检查下方连接
  if (block.nextConnection && block.nextConnection.isConnected()) {
    return true;
  }

  // 检查输出连接（作为值被其他块使用）
  if (block.outputConnection && block.outputConnection.isConnected()) {
    return true;
  }

  // 如果都没有连接，则是独立的
  return false;
}

// 添加一个防抖函数
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 创建一个防抖版本的重命名变量函数，附加到Arduino对象上
Arduino.debouncedRenameVariable = debounce((block, oldName, newName, vtype) => {
  console.log("执行延迟重命名: ", oldName, "->", newName);
  renameVariable(block, oldName, newName, vtype);
  // 存储当前名称以供将来比较
  Arduino.previousVariables[block.id] = newName;
}, 500); // 500毫秒延迟

Arduino.forBlock["variable_define"] = function (block, generator) {
  const gorp = block.getFieldValue("GORP");
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);

  // Create a storage object for previously defined variables
  if (!Arduino.previousVariables) {
    console.log("create new previousVariables");
    Arduino.previousVariables = {};
  }

  // Compare current name with previously stored name
  const previousName = Arduino.previousVariables[block.id];

  // 检测变量名是否更改
  if (previousName && previousName !== name) {
    // 使用防抖函数延迟更新变量，而不是立即更新
    Arduino.debouncedRenameVariable(block, previousName, name);
  } else {
    Arduino.previousVariables[block.id] = name; // 更新当前名称
  }

  let defaultValue = "";

  if (!value) {
    switch (type) {
      case "string":
        // Arduino中字符串使用String或char数组
        defaultValue = `""`;
        type = "String"; // 确保Arduino使用String类型
        break;
      case "char":
        defaultValue = `''`;
        break;
      default:
        defaultValue = 0;
    }
  } else {
    // 如果有值，使用默认值
    defaultValue = value;
  }

  type = type.replace(/volatile\s/, "");
  if (isBlockConnected(block)) {
    return `${type} ${name} = ${defaultValue};\n`;
  } else {
    if (value) {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name} = ${value};`);
    } else {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name};`);
    }
    return "";
  }
};

Arduino.forBlock["variables_get"] = function (block, generator) {
  // Variable getter.
  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );

  console.log("name: ", code);
  // setLibraryVariable(type, code);
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["variables_set"] = function (block, generator) {
  // Variable setter.
  const value =
    Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";

  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );

  // Arduino.addVariable("variable_float", `volatile float ${varName};`);
  // setLibraryVariable(type, code);
  return `${code} = ${value};\n`;
};

Arduino.forBlock["variables_get_dynamic"] = Arduino.forBlock["variables_get"];
Arduino.forBlock["variables_set_dynamic"] = Arduino.forBlock["variables_set"];

// 获取toolbox分类变量类型
function getVariableCategory(workspace) {
  const toolbox = workspace.getToolbox();
  if (!toolbox) return null;

  const allCategories = toolbox.getToolboxItems();
  return allCategories.find(item =>
    item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
  );
}

// 分类变量类型引用
function findVariableCategoryInToolboxDef(toolboxDef) {
  if (!toolboxDef || !toolboxDef.contents) return null;

  return toolboxDef.contents.find(category =>
    category.name === "Variables" ||
    (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE")
  );
}

// 初始化时加载变量并显示到变量类别中
function initializeVariables(workspace) {
  if (!workspace) return;

  try {
    const variableArr = Blockly.getMainWorkspace().getAllVariables();

    if (variableArr.length === 0) {
      console.log("未找到任何变量");
      return;
    }

    console.log("从块中提取到 " + variableArr.length + " 个变量");

    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    const variableCategory = findVariableCategoryInToolboxDef(originalToolboxDef);
    if (!variableCategory) return;

    if (variableCategory.contents.length === 1) {
      variableCategory.contents = [
        {
          "kind": "button",
          "text": "新建变量",
          "callbackKey": "CREATE_VARIABLE"
        },
        {
          "kind": "block",
          "type": "variable_define"
        },
        {
          "kind": "block",
          "type": "variables_set"
        }
      ];
    }

    Blockly.Msg.VARIABLES_CURRENT_NAME = variableArr[variableArr.length - 1].name;

    variableArr.forEach(variable => {
      variableCategory.contents.push({
        "kind": "block",
        "type": "variables_get",
        "fields": {
          "VAR": {
            "id": variable.id,
            "name": variable.name,
            "type": variable.type || "string"
          }
        }
      });

      if (!workspace.getVariable(variable.name)) {
        workspace.createVariable(variable.name, variable.type, variable.id);
      }
    });

    // 刷新工具箱显示
    refreshToolbox(workspace);

    console.log("已加载 " + variableArr.length + " 个变量到工具箱");
  } catch (e) {
    console.error("初始化变量时出错:", e);
    console.error(e.stack);
  }
}


(function setupVariableInitialization() {
  try {
    const workspace = Blockly.getMainWorkspace();

    workspace.addChangeListener(function (event) {
      if (event.type === Blockly.Events.FINISHED_LOADING) {
        console.log("工作区加载完成，初始化变量");
        setTimeout(() => initializeVariables(workspace), 200);
      }
    });
  } catch (e) {
    console.error("设置变量初始化时出错:", e);
  }
})()


