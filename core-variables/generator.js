Blockly.getMainWorkspace().registerButtonCallback(
  "CREATE_VARIABLE",
  (button) => {
    const workspace = button.getTargetWorkspace();
    Blockly.Variables.createVariableButtonHandler(
      workspace,
      (varName) => {
        console.log("变量创建成功:", varName);
        // 获取变量分类
        const toolbox = workspace.getToolbox();
        console.log('toolbox', toolbox);
        const allCategories = toolbox.getToolboxItems();
        console.log('allCategories', allCategories);
        const variableCategory = allCategories.find(item =>
          item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
        );
        console.log(variableCategory);

        // 检查是否是第一次创建变量
        if (variableCategory.getContents().length === 1) {
          // 只有"新建变量"按钮时，添加变量块
          // 获取当前工具箱的配置
          const toolboxDef = workspace.options.languageTree;

          // 找到变量类别并更新其内容
          for (let category of toolboxDef.contents) {
            if ((category.name === "Variables" ||
              (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

              // 更新该类别的内容
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
                  "type": "variables_get"
                },
                {
                  "kind": "block",
                  "type": "variables_set"
                }
              ];

              console.log('更新toolbox');
              // 使用工作区的方法更新整个工具箱
              workspace.updateToolbox(toolboxDef);
              break;
            }
          }
        }
      },
      null
    );
  },
);

Arduino.forBlock["variable_define"] = function (block) {
  const gorp = block.getFieldValue("GORP");
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);
  if (!value) {
    value = ["volatile String*"].includes(type) ? `""` : 0;
  }
  if (gorp === "part") {
    type = type.replace(/volatile\s/, "");
    return `${type} ${name} = ${value};\n`;
  }
  Arduino.addVariable(`${type}_${name}`, `${type} ${name};`);
  return `${name} = ${value};\n`;
};

if (typeof setLibraryVariable === 'undefined') {
  const setLibraryVariable = (type, code) => {
    Arduino.addVariable(
      `${type}_${code}`,
      `${type} ${code} = ${["string"].includes(type) ? `""` : 0};`,
    );
  };
}

Arduino.forBlock["variables_get"] = function (block) {
  // Variable getter.
  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );
  console.log(code, type);
  setLibraryVariable(type, code);
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["variables_set"] = function (block) {
  // Variable setter.
  const value =
    Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";

  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );

  // Arduino.addVariable("variable_float", `volatile float ${varName};`);
  setLibraryVariable(type, code);
  return `${code} = ${value};\n`;
};

Arduino.forBlock["variables_get_dynamic"] = Arduino.forBlock["variables_get"];
Arduino.forBlock["variables_set_dynamic"] = Arduino.forBlock["variables_set"];
