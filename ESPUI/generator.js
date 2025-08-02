// ESPUI库代码生成器
// 基于ESPUI库 https://github.com/s00500/ESPUI
// 版本对齐：ESPUI v2.2.4

// 全局变量：控件ID、事件回调注册与绑定
let espuiControlCounter = 1;
let espuiCallbacks = new Map(); // key: controlId -> Set(callbackName)
let espuiControlMap = new Map(); // 控件ID到控件信息
let espuiUserEventMap = new Map(); // 控件ID -> Set(用户自定义回调名)

function ensureSet(map, key) {
  if (!map.has(key)) map.set(key, new Set());
  return map.get(key);
}

// 获取或生成唯一控件ID
function getControlId(generator, controlType, blockId) {
  const id = espuiControlCounter++;
  espuiControlMap.set(id, { type: controlType, blockId, variableName: `control_${id}` });
  return id;
}

// 生成唯一回调函数名
function getCallbackName(type, id) {
  return `${type}Callback_${id}`;
}

// 统一事件分发器：将控件事件分发给用户通过“espui_on_event”注册的回调
function addDispatcherOnce(generator) {
  if (generator._espuiDispatcherAdded) return;
  const dispatcher = `
void __espui_dispatch_event(uint16_t cid, Control* sender, int type) {
 // 可扩展：根据 type 记录日志或统计
 switch (type) {
   case B_DOWN: case B_UP: case S_ACTIVE: case S_INACTIVE:
   case SL_VALUE: case N_VALUE: case T_VALUE:
   default: break;
 }
}
`;
  generator.addFunction('__espui_dispatch_event', dispatcher.trim());
  generator._espuiDispatcherAdded = true;
}

// 绑定时合并：默认自动回调 + 用户自定义回调（如有）
function composeCallbackForControl(generator, baseName, controlId, interestedTypes /* Set of int macros as strings */) {
  addDispatcherOnce(generator);
  const composed = `${baseName}_composed_${controlId}`;
  const userSet = espuiUserEventMap.get(controlId) || new Set();
  // 生成一个组合回调：先派发，再调用用户所有注册回调（这些回调内部自行判断type）
  let body = `
void ${composed}(Control* sender, int type) {
 __espui_dispatch_event(${controlId}, sender, type);
`;
  userSet.forEach(fn => {
    body += `  ${fn}(sender, type);\n`;
  });
  body += `}\n`;
  generator.addFunction(composed, body);
  return composed;
}

// 初始化ESPUI（对齐 v2.2.4：支持端口参数）
Arduino.forBlock['espui_begin'] = function(block, generator) {
  const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"ESPUI"';
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || 'nullptr';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || 'nullptr';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';

  // 添加必要的库引用
  generator.addLibrary('wifi_or_esp8266', '#ifdef ESP32\n#include <WiFi.h>\n#else\n#include <ESP8266WiFi.h>\n#endif');
  generator.addLibrary('espui_lib', '#include <ESPUI.h>');

  // 在setup中初始化（用户可在此之前完成 WiFi）
  const code =
`  ESPUI.setVerbosity(Verbosity::Quiet);
 ESPUI.begin(${title}, ${username}, ${password}, ${port});
`;
  generator.addSetupEnd('espui_begin', code);
  return '';
};

// 颜色枚举已按 v2.2.4 对齐，控件创建与 upstream 签名一致

// Tab/容器/父子结构支持
// 创建标签页（Tab）
Arduino.forBlock['espui_tab'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Tab"';
  const controlId = getControlId(generator, 'tab', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Tab, ${text}, "", ControlColor::None);\n`;
  generator.addSetupEnd(`tab_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建面板容器（Panel）
Arduino.forBlock['espui_panel'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Panel"';
  const color = block.getFieldValue('COLOR');
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'panel', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  if (parent) {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Panel, ${text}, "", ControlColor::${color}, ${parent});\n`;
    generator.addSetupEnd(`panel_init_${controlId}`, initCode);
  } else {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Panel, ${text}, "", ControlColor::${color});\n`;
    generator.addSetupEnd(`panel_init_${controlId}`, initCode);
  }
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建标签（支持父控件）
Arduino.forBlock['espui_label'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Label"';
  const color = block.getFieldValue('COLOR');
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'label', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  if (parent) {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Label, ${text}, ${text}, ControlColor::${color}, ${parent});\n`;
    generator.addSetupEnd(`label_init_${controlId}`, initCode);
  } else {
    const initCode = `  ${controlVar} = ESPUI.label(${text}, ControlColor::${color}, ${text});\n`;
    generator.addSetupEnd(`label_init_${controlId}`, initCode);
  }
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建按钮（带初始文本，支持父控件）
Arduino.forBlock['espui_button'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Button"';
  const color = block.getFieldValue('COLOR');
  const initValue = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'button', block.id);
  const baseCb = getCallbackName('button', controlId);
  const controlVar = `control_${controlId}`;
  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == B_DOWN) { Serial.println("Button ${controlId} pressed"); }
 else if (type == B_UP) { Serial.println("Button ${controlId} released"); }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["B_DOWN","B_UP"]));
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  if (parent) {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Button, ${text}, ${initValue}, ControlColor::${color}, ${parent}, &${composed});\n`;
    generator.addSetupEnd(`button_init_${controlId}`, initCode);
  } else {
    const initCode = `  ${controlVar} = ESPUI.button(${text}, &${composed}, ControlColor::${color}, ${initValue});\n`;
    generator.addSetupEnd(`button_init_${controlId}`, initCode);
  }
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建开关（支持父控件）
Arduino.forBlock['espui_switcher'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Switch"';
  const color = block.getFieldValue('COLOR');
  const state = block.getFieldValue('STATE') || 'false';
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'switcher', block.id);
  const baseCb = getCallbackName('switch', controlId);
  const controlVar = `control_${controlId}`;
  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == S_ACTIVE || type == S_INACTIVE) {
   Serial.print("Switch ${controlId} state: ");
   Serial.println(sender->value);
 }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["S_ACTIVE","S_INACTIVE"]));
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  if (parent) {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Switcher, ${text}, String(${state} ? "1":"0"), ControlColor::${color}, ${parent}, &${composed});\n`;
    generator.addSetupEnd(`switcher_init_${controlId}`, initCode);
  } else {
    const initCode = `  ${controlVar} = ESPUI.switcher(${text}, &${composed}, ControlColor::${color}, ${state});\n`;
    generator.addSetupEnd(`switcher_init_${controlId}`, initCode);
  }
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建滑条（支持父控件）
Arduino.forBlock['espui_slider'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Slider"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '50';
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'slider', block.id);
  const baseCb = getCallbackName('slider', controlId);
  const controlVar = `control_${controlId}`;
  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == SL_VALUE) {
   Serial.print("Slider ${controlId} value: ");
   Serial.println(sender->value);
 }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["SL_VALUE"]));
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  if (parent) {
    const initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Slider, ${text}, String(${value}), ControlColor::${color}, ${parent}, &${composed});\n`;
    generator.addSetupEnd(`slider_init_${controlId}`, initCode);
  } else {
    const initCode = `  ${controlVar} = ESPUI.slider(${text}, &${composed}, ControlColor::${color}, ${value}, ${min}, ${max});\n`;
    generator.addSetupEnd(`slider_init_${controlId}`, initCode);
  }
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建文本输入框
Arduino.forBlock['espui_text'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Text"';
  const color = block.getFieldValue('COLOR');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  const controlId = getControlId(generator, 'text', block.id);
  const baseCb = getCallbackName('text', controlId);
  const controlVar = `control_${controlId}`;

  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == T_VALUE) {
   Serial.print("Text ${controlId} value: ");
   Serial.println(sender->value);
 }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["T_VALUE"]));

  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  const initCode = `  ${controlVar} = ESPUI.text(${text}, &${composed}, ControlColor::${color}, ${value});\n`;
  generator.addSetupEnd(`text_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建选择器（Select，支持父控件）
Arduino.forBlock['espui_select'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Select"';
  const color = block.getFieldValue('COLOR');
  const optionsJson = generator.valueToCode(block, 'OPTIONS_JSON', generator.ORDER_ATOMIC) || '"[]"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'select', block.id);
  const baseCb = getCallbackName('select', controlId);
  const controlVar = `control_${controlId}`;

  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == S_VALUE || type == S_ACTIVE) {
   Serial.print("Select ${controlId} value: ");
   Serial.println(sender->value);
 }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["S_VALUE","S_ACTIVE"]));
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);

  // 初始化：创建控件
  let initCode;
  if (parent) {
    initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Select, ${text}, ${value}, ControlColor::${color}, ${parent}, &${composed});\n`;
  } else {
    // v2.2.4 没有独立便捷API，使用 addControl
    initCode = `  ${controlVar} = ESPUI.addControl(ControlType::Select, ${text}, ${value}, ControlColor::${color});\n`;
  }
  // 解析并添加选项：期望 [[label,value],[label,value],...]
  initCode +=
`  do {
   AllocateJsonDocument(doc, 512);
   deserializeJson(doc, ${optionsJson});
   for (JsonArray::iterator it = doc.as<JsonArray>().begin(); it != doc.as<JsonArray>().end(); ++it) {
     JsonArray pair = (*it).as<JsonArray>();
     if (pair.size() >= 2) {
       String olabel = pair[0].as<const char*>();
       String oval = pair[1].as<const char*>();
       ESPUI.addControl(ControlType::Option, olabel.c_str(), oval, ControlColor::None, ${controlVar});
     }
   }
 } while(0);
`;
  generator.addSetupEnd(`select_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 更新选择器值
Arduino.forBlock['espui_update_select'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  return `ESPUI.updateSelect(${controlId}, String(${value}));\n`;
};

// 创建文件显示（fileDisplay，支持父控件）
Arduino.forBlock['espui_file_display'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"File"';
  const color = block.getFieldValue('COLOR');
  const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"/index.txt"';
  const parent = generator.valueToCode(block, 'PARENT', generator.ORDER_ATOMIC);
  const controlId = getControlId(generator, 'fileDisplay', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  let initCode;
  if (parent) {
    initCode = `  ${controlVar} = ESPUI.addControl(ControlType::File, ${text}, String(${filename}), ControlColor::${color}, ${parent});\n`;
  } else {
    initCode = `  ${controlVar} = ESPUI.fileDisplay(${text}, ControlColor::${color}, String(${filename}));\n`;
  }
  generator.addSetupEnd(`filedisplay_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建数字输入框
Arduino.forBlock['espui_number'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Number"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const controlId = getControlId(generator, 'number', block.id);
  const baseCb = getCallbackName('number', controlId);
  const controlVar = `control_${controlId}`;

  if (!espuiCallbacks.has(baseCb)) {
    const cb = `
void ${baseCb}(Control* sender, int type) {
 if (type == N_VALUE) {
   Serial.print("Number ${controlId} value: ");
   Serial.println(sender->value);
 }
}
`.trim();
    generator.addFunction(baseCb, cb);
    espuiCallbacks.set(baseCb, true);
  }
  const composed = composeCallbackForControl(generator, baseCb, controlId, new Set(["N_VALUE"]));

  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  const initCode = `  ${controlVar} = ESPUI.number(${text}, &${composed}, ControlColor::${color}, ${value}, ${min}, ${max});\n`;
  generator.addSetupEnd(`number_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建图表
Arduino.forBlock['espui_graph'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Graph"';
  const color = block.getFieldValue('COLOR');
  const controlId = getControlId(generator, 'graph', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  const initCode = `  ${controlVar} = ESPUI.graph(${text}, ControlColor::${color});\n`;
  generator.addSetupEnd(`graph_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 创建仪表盘
Arduino.forBlock['espui_gauge'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Gauge"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const controlId = getControlId(generator, 'gauge', block.id);
  const controlVar = `control_${controlId}`;
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  const initCode = `  ${controlVar} = ESPUI.gauge(${text}, ControlColor::${color}, ${value}, ${min}, ${max});\n`;
  generator.addSetupEnd(`gauge_init_${controlId}`, initCode);
  return [controlVar, generator.ORDER_ATOMIC];
};

// 更新控件值（对齐 v2.2.4）
Arduino.forBlock['espui_update_control'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  return `ESPUI.updateControlValue(${controlId}, String(${value}));\n`;
};

// 更新控件标签（对齐 v2.2.4）
Arduino.forBlock['espui_update_label'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '""';
  return `ESPUI.updateControlLabel(${controlId}, ${label});\n`;
};

// 控件事件处理：生成用户回调并登记，用于合并进组合回调
Arduino.forBlock['espui_on_event'] = function(block, generator) {
  const controlIdCode = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const eventType = block.getFieldValue('EVENT_TYPE');
  const statements = generator.statementToCode(block, 'DO');

  // 控件ID可能是表达式，尝试在生成期要求常量或创建基于ID表达式的包装回调
  // 为保持简单，若为字面量数字则提取，否则仍生成但无法自动合并，只能在运行时通过派发器日志。
  const cid = Number(controlIdCode.replace(/[^\d]/g, '')) || 0;
  const userFn = `customCallback_${cid}_${eventType}`;

  const callbackFunc = `
void ${userFn}(Control* sender, int type) {
 if (type == ${eventType}) {
${statements || "    // Custom event handler"}
 }
}
`.trim();
  generator.addFunction(userFn, callbackFunc);
  const setRef = ensureSet(espuiUserEventMap, cid);
  setRef.add(userFn);
  return '';
};

// 获取控件值
Arduino.forBlock['espui_get_control_value'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const code = `ESPUI.getControl(${controlId})->value`;
  return [code, generator.ORDER_ATOMIC];
};

// 添加图表数据点
Arduino.forBlock['espui_add_graph_point'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return `ESPUI.addGraphPoint(${controlId}, ${value});\n`;
};

// 清空图表
Arduino.forBlock['espui_clear_graph'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  return `ESPUI.clearGraph(${controlId});\n`;
};

// WiFi设置（保持原有简化形态，建议用户先联网再 begin）
Arduino.forBlock['espui_wifi_setup'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"MyESP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE');
  let setupCode = '';
  if (mode === 'STA') {
    setupCode = `  WiFi.mode(WIFI_STA);\n  WiFi.begin(${ssid}, ${password});\n  while (WiFi.status() != WL_CONNECTED) { delay(500); }\n`;
  } else {
    setupCode = `  WiFi.mode(WIFI_AP);\n  WiFi.softAP(${ssid}, ${password});\n`;
  }
  generator.addSetupEnd('wifi_setup', setupCode);
  return '';
};

// WiFi连接状态
Arduino.forBlock['espui_wifi_status'] = function(block, generator) {
  return ['(WiFi.status() == WL_CONNECTED)', generator.ORDER_ATOMIC];
};

// 获取IP地址
Arduino.forBlock['espui_get_ip'] = function(block, generator) {
  return ['WiFi.localIP().toString()', generator.ORDER_ATOMIC];
};