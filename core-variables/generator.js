Blockly.getMainWorkspace().registerButtonCallback(
  "CREATE_VARIABLE",
  (button) => {
    const workspace = button.getTargetWorkspace();
    Blockly.Variables.createVariableButtonHandler(
      workspace,
      (varName) => {
        // console.log("varName: ", varName);
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
            const timestamp = new Date().getTime();
            category.contents.push({
              "kind": "block",
              "type": "variables_get",
              "fields": {
                "VAR": {
                  "id": "varName" + timestamp,
                  "name": varName,
                  "type": "string"
                }
              }
            })

            Blockly.Msg.VARIABLES_CURRENT_NAME = varName;

            toolbox.refreshSelection();

            // 更新整个工具箱
            workspace.updateToolbox(originalToolboxDef);

            // 强制刷新工具箱显示
            if (variableCategory) {
              variableCategory.refreshTheme();

              // 如果工具箱处于打开状态，使用更可靠的方式重新打开类别
              if (toolbox.isOpen_) {
                const categoryId = variableCategory.id_;
                // 保存当前打开的类别ID
                toolbox.setSelectedItem(null);

                // 增加延迟时间，确保DOM有足够时间更新
                setTimeout(() => {
                  // 强制重新构建类别内容
                  variableCategory.updateFlyoutContents(originalToolboxDef);

                  // 重新打开同一个类别
                  toolbox.setSelectedItem(variableCategory);

                  // 额外的刷新以确保UI更新
                  workspace.refreshToolboxSelection();
                }, 50); // 增加延迟时间
              } else {
                // 确保即使工具箱关闭也能更新内容
                variableCategory.updateFlyoutContents(originalToolboxDef);
              }
            }

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

// 重名名变量
// 重命名变量
function renameVariable(block, oldName, newName) {
  try {
    const workspace = block.workspace;
    if (!workspace || !oldName || !newName) return;

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

    Blockly.Msg.VARIABLES_CURRENT_NAME = newName;

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
      }
    }

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

        if (isOldVarStillReferenced) {
          // 如果旧变量仍在使用，添加新变量而不是替换
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
          console.log(`旧变量 ${oldName} 仍在使用，已添加新变量 ${newName}`);
        } else {
          // 如果旧变量未被引用，直接替换名称
          category.contents.forEach(item => {
            if (item.fields && item.fields.VAR && item.fields.VAR.name === oldName) {
              item.fields.VAR.name = newName;
            }
          });
        }

        // 更新工具箱
        if (toolbox && variableCategory) {
          toolbox.refreshSelection();
          workspace.updateToolbox(originalToolboxDef);

          // 强制刷新工具箱显示
          variableCategory.refreshTheme();

          // 如果工具箱处于打开状态，使用更可靠的方式重新打开类别
          if (toolbox.isOpen_) {
            // 保存当前打开的类别ID
            toolbox.setSelectedItem(null);

            // 延迟更新确保DOM有足够时间更新
            setTimeout(() => {
              variableCategory.updateFlyoutContents(originalToolboxDef);
              toolbox.setSelectedItem(variableCategory);
              workspace.refreshToolboxSelection();
            }, 50);
          } else {
            variableCategory.updateFlyoutContents(originalToolboxDef);
          }
        }
        break;
      }
    }
  } catch (e) {
    console.log("重命名变量时出错:", e);
  }
}

// 添加新函数，用于将循环变量添加到工具箱
function addVariableToToolbox(block, varName) {
  try {
    const workspace = block.workspace;
    if (!workspace || !varName) return;

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

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

        // 检查变量是否已存在
        const varExists = category.contents.some(item =>
          item.fields && item.fields.VAR && item.fields.VAR.name === varName
        );

        if (!varExists) {
          // 获取当前时间戳作为ID
          const timestamp = new Date().getTime();
          category.contents.push({
            "kind": "block",
            "type": "variables_get",
            "fields": {
              "VAR": {
                "id": "loopVar" + timestamp,
                "name": varName,
                "type": "int"
              }
            }
          });

          console.log("categoryContents: ", category.contents);

          Blockly.Msg.VARIABLES_CURRENT_NAME = varName;

          // 更新工具箱
          if (toolbox && variableCategory) {
            toolbox.refreshSelection();
            workspace.updateToolbox(originalToolboxDef);

            // 强制刷新工具箱显示
            variableCategory.refreshTheme();

            // 如果工具箱处于打开状态，使用更可靠的方式重新打开类别
            if (toolbox.isOpen_) {
              // 保存当前打开的类别ID
              toolbox.setSelectedItem(null);

              // 延迟更新确保DOM有足够时间更新
              setTimeout(() => {
                variableCategory.updateFlyoutContents(originalToolboxDef);
                toolbox.setSelectedItem(variableCategory);
                workspace.refreshToolboxSelection();
              }, 50);
            } else {
              variableCategory.updateFlyoutContents(originalToolboxDef);
            }
          }
        }
        break;
      }
    }
  } catch (e) {
    console.log("添加循环变量到工具箱时出错:", e);
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
  const previousName = Arduino.previousVariables["lastedDefineName"];

  // Store current name for future comparisons
  Arduino.previousVariables["lastedDefineName"] = name;

  if (previousName && previousName !== name) {
    // If the name has changed, add the new variable to the toolbox
    renameVariable(block, previousName, name);
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
