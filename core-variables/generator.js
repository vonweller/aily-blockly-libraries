Blockly.getMainWorkspace().registerButtonCallback(
  "CREATE_VARIABLE",
  (button) => {
    const workspace = button.getTargetWorkspace();
    Blockly.Variables.createVariableButtonHandler(
      workspace,
      (varName) => {
        Blockly.Msg.VARIABLES_CURRENT_NAME = varName;
        // 获取变量分类
        const toolbox = workspace.getToolbox();
        const allCategories = toolbox.getToolboxItems();
        const variableCategory = allCategories.find(item =>
          item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
        );

        // 获取原始工具箱定义
        const originalToolboxDef = workspace.options.languageTree;

        // 找到变量类别并更新其内容
        for (let category of originalToolboxDef.contents) {
          if ((category.name === "Variables" ||
            (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
            // 更新该类别的内容
            if (category.contents.length === 1) {
              category.contents = [
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
            const varId = workspace.getVariable(varName).getId();
            category.contents.push({
              "kind": "block",
              "type": "variables_get",
              "fields": {
                "VAR": {
                  "id": varId,
                  "name": varName,
                  "type": "string"
                }
              }
            })

            refreshToolbox(workspace);
            break;
          }
        }

        // 触发所有监听器
        // variableCreationListeners.forEach(listener => listener(varName));
      },
      null
    );
  },
);

Blockly.getMainWorkspace().addChangeListener((event) => {
  if (event.type === Blockly.Events.VAR_DELETE) {
    console.log("删除的变量ID: ", event.varId);
    // 获取当前工作区
    const workspace = Blockly.getMainWorkspace();

    // 从工具箱中删除变量
    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
        
        if (category.contents.length === 4) {
          category.contents = [
            {
              "kind": "button",
              "text": "新建变量",
              "callbackKey": "CREATE_VARIABLE"
            }
          ];
        } else {
          // Filter out the deleted variable from category.contents
          category.contents = category.contents.filter(item => {
            // Check if this is a variables_get block with the deleted variable's ID
            if (item.type === "variables_get" &&
              item.fields &&
              item.fields.VAR &&
              item.fields.VAR.id === event.varId) {
              return false; // Remove this item
            }
            return true; // Keep all other items
          });

          const allVariables = workspace.getAllVariables();
          Blockly.Msg.VARIABLES_CURRENT_NAME = allVariables.at(-1)?.name;;
        }

        refreshToolbox(workspace);
        break;
      }
    }
  }
})

// const blockVariableMap = new Map();

// 将原有的函数定义修改为 Blockly 的全局方法
addVariableToToolbox = function (block, varName) {
  try {
    // 获取块的唯一ID
    // const blockId = block.id;

    // 保存块和变量的关系
    // if (!blockVariableMap.has(blockId)) {
    //   blockVariableMap.set(blockId, []);
    // }

    // 添加变量到这个块的列表中
    // const varList = blockVariableMap.get(blockId);
    // if (!varList.includes(varName)) {
    //   varList.push(varName);
    // }

    const workspace = block.workspace;
    if (!workspace || !varName) return;
    // 获取工具箱
    const toolbox = workspace.getToolbox();
    if (!toolbox) return;

    const allCategories = toolbox.getToolboxItems();
    const variableCategory = allCategories.find(item =>
      item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
    );

    const variable = workspace.getVariable(varName);

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
          if (category.contents.length === 1) {
            category.contents = [
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

          // 检查变量是否已存在
          const varExists = category.contents.some(item =>
            item.fields && item.fields.VAR && item.fields.VAR.name === varName
          );

          if (!varExists) {
            category.contents.push({
              "kind": "block",
              "type": "variables_get",
              "fields": {
                "VAR": {
                  "id": variable.getId(),
                  "name": varName,
                  "type": "int"
                }
              }
            });

            Blockly.Msg.VARIABLES_CURRENT_NAME = varName;

            refreshToolbox(workspace, openVariableItem = false);
          }
          break;
      }
    }
  } catch (e) {
    console.log("添加循环变量到工具箱时出错:", e);
  }
};

// 更新toolbox
function refreshToolbox(oldWorkspace, openVariableItem = true) {
  const originalToolboxDef = oldWorkspace.options.languageTree;
  oldWorkspace.updateToolbox(originalToolboxDef);

  const workspace = Blockly.getMainWorkspace();
  const toolbox = workspace.getToolbox();
  const allCategories = toolbox.getToolboxItems();
  const variableCategory = allCategories.find(item =>
      item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
  );
  if (toolbox.isVisible_ && openVariableItem) {
    toolbox.setSelectedItem(variableCategory);
  }
}

// 重命名变量
function renameVariable(block, oldName, newName, vtype) {
  try {
    console.log("rename variable: ", oldName, newName);
    const workspace = block.workspace;
    if (!workspace || !oldName || !newName) return;

    Blockly.Msg.VARIABLES_CURRENT_NAME = newName;
    newNameExisting = Blockly.Variables.nameUsedWithAnyType(newName, workspace);
    if (newNameExisting) {
      console.log(`变量 ${newName} 已存在，无法重命名`);
      return;
    }

    // 获取工具箱
    const toolbox = workspace.getToolbox();
    if (!toolbox) return;

    const allCategories = toolbox.getToolboxItems();
    const variableCategory = allCategories.find(item =>
      item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
    );

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
        if (isOldVarStillReferenced) {
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

        // refreshToolbox(workspace);
        break;
      }
    }
  } catch (e) {
    console.log("重命名变量时出错:", e);
  }
}

function isBlockConnected(block) {
  // 定义主入口块类型（可根据实际情况调整）
  const ENTRY_BLOCK_TYPES = ['arduino_setup', 'arduino_loop'];

  // 递归向上查找
  function findRootBlock(b) {
    if (!b) return null;
    if (!b.previousConnection || !b.previousConnection.isConnected()) {
      return b;
    }
    return findRootBlock(b.previousConnection.targetBlock());
  }

  const rootBlock = findRootBlock(block);

  // 如果根块是入口块，则认为已连接，否则为独立
  if (rootBlock && ENTRY_BLOCK_TYPES.includes(rootBlock.type)) {
    return true;
  }
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
