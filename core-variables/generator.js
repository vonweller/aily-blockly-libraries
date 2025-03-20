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
          const newContents = [
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
          variableCategory.updateToolboxContents(newContents);
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
