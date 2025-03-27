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

            let contents = category.contents;
            // console.log("contents1: ", contents);

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
      },
      null
    );
  },
);

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

  if (!value) {
    console.log("value: ", value);
    switch (type) {
      case "string":
        value = `""`;
        break;
      case "char":
        value = `''`;
        break;
      default:
        value = 0;
    }
  }

  type = type.replace(/volatile\s/, "");
  if (isBlockConnected(block)) {
    return `${type} ${name} = ${value};\n`;
  } else {
    Arduino.addVariable(`${type}_${name}`, `${type} ${name};`);
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
