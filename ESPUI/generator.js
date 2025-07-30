// ESPUI库代码生成器
// 基于ESPUI库 https://github.com/s00500/ESPUI

// 全局变量，用于跟踪控件ID和回调函数
let espuiControlCounter = 1;
let espuiCallbacks = new Set();
let espuiControlMap = new Map(); // 存储控件ID到控件信息的映射

// 获取或生成唯一控件ID
function getControlId(generator, controlType, blockId) {
  const id = espuiControlCounter++;
  espuiControlMap.set(id, {
    type: controlType,
    blockId: blockId,
    variableName: `control_${id}`
  });
  return id;
}

// 生成唯一回调函数名
function getCallbackName(type, id) {
  return `${type}Callback_${id}`;
}

// 初始化ESPUI
Arduino.forBlock['espui_begin'] = function(block, generator) {
  const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"ESPUI"';
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  // 添加必要的库引用
  generator.addLibrary('espui_lib', '#include <ESPUI.h>');
  generator.addLibrary('wifi_lib', '#include <WiFi.h>');
  generator.addLibrary('async_tcp', '#ifdef ESP32\n#include <AsyncTCP.h>\n#elif defined(ESP8266)\n#include <ESPAsyncTCP.h>\n#endif');
  generator.addLibrary('espasync_webserver', '#include <ESPAsyncWebServer.h>');
  
  // 在setup中初始化
  const code = `ESPUI.setVerbosity(Verbosity::Quiet);\n` +
               `ESPUI.begin(${title}, ${username}, ${password});\n`;
  
  generator.addSetupEnd('espui_begin', code);
  
  return '';
};

// 创建标签
Arduino.forBlock['espui_label'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Label"';
  const color = block.getFieldValue('COLOR');
  const controlId = getControlId(generator, 'label', block.id);
  const controlVar = `control_${controlId}`;
  
  // 声明控件变量
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  
  const code = `${controlVar} = ESPUI.label(${text}, ${text}, ControlColor::${color})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建按钮
Arduino.forBlock['espui_button'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Button"';
  const color = block.getFieldValue('COLOR');
  const controlId = getControlId(generator, 'button', block.id);
  const callbackName = getCallbackName('button', controlId);
  const controlVar = `control_${controlId}`;
  
  // 添加按钮回调函数（如果还没有）
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  // Button event handler for control ${controlId}\n` +
                        `  switch (type) {\n` +
                        `    case B_DOWN:\n` +
                        `      Serial.println("Button ${controlId} pressed");\n` +
                        `      break;\n` +
                        `    case B_UP:\n` +
                        `      Serial.println("Button ${controlId} released");\n` +
                        `      break;\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  // 声明控件变量
  generator.addVariable(controlVar, `uint16_t ${controlVar};`);
  
  const code = `${controlVar} = ESPUI.button(${text}, ${text}, ControlColor::${color}, &${callbackName})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建开关
Arduino.forBlock['espui_switcher'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Switch"';
  const color = block.getFieldValue('COLOR');
  const state = block.getFieldValue('STATE');
  const controlId = getControlId(generator);
  const callbackName = getCallbackName('switch', controlId);
  
  // 添加开关回调函数（如果还没有）
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  // Switch event handler for control ${controlId}\n` +
                        `  switch (type) {\n` +
                        `    case S_ACTIVE:\n` +
                        `      Serial.print("Switch ${controlId} value: ");\n` +
                        `      Serial.println(sender->value);\n` +
                        `      break;\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  const code = `ESPUI.switcher(${text}, ${state}, ControlColor::${color}, &${callbackName})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建滑条
Arduino.forBlock['espui_slider'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Slider"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '50';
  const controlId = getControlId(generator);
  const callbackName = getCallbackName('slider', controlId);
  
  // 添加滑条回调函数（如果还没有）
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  // Slider event handler for control ${controlId}\n` +
                        `  switch (type) {\n` +
                        `    case SL_VALUE:\n` +
                        `      Serial.print("Slider ${controlId} value: ");\n` +
                        `      Serial.println(sender->value);\n` +
                        `      break;\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  const code = `ESPUI.slider(${text}, &${callbackName}, ControlColor::${color}, ${value}, ${min}, ${max})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建文本输入框
Arduino.forBlock['espui_text'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Text"';
  const color = block.getFieldValue('COLOR');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  const controlId = getControlId(generator);
  const callbackName = getCallbackName('text', controlId);
  
  // 添加文本输入框回调函数（如果还没有）
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  // Text input event handler for control ${controlId}\n` +
                        `  switch (type) {\n` +
                        `    case T_VALUE:\n` +
                        `      Serial.print("Text ${controlId} value: ");\n` +
                        `      Serial.println(sender->value);\n` +
                        `      break;\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  const code = `ESPUI.text(${text}, &${callbackName}, ControlColor::${color}, ${value})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建数字输入框
Arduino.forBlock['espui_number'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Number"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  const controlId = getControlId(generator);
  const callbackName = getCallbackName('number', controlId);
  
  // 添加数字输入框回调函数（如果还没有）
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  // Number input event handler for control ${controlId}\n` +
                        `  switch (type) {\n` +
                        `    case N_VALUE:\n` +
                        `      Serial.print("Number ${controlId} value: ");\n` +
                        `      Serial.println(sender->value);\n` +
                        `      break;\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  const code = `ESPUI.number(${text}, &${callbackName}, ControlColor::${color}, ${value}, ${min}, ${max})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建图表
Arduino.forBlock['espui_graph'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Graph"';
  const color = block.getFieldValue('COLOR');
  
  const code = `ESPUI.graph(${text}, ControlColor::${color})`;
  return [code, generator.ORDER_ATOMIC];
};

// 创建仪表盘
Arduino.forBlock['espui_gauge'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"Gauge"';
  const color = block.getFieldValue('COLOR');
  const min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  const max = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '100';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  
  const code = `ESPUI.gauge(${text}, ControlColor::${color}, ${value}, ${min}, ${max})`;
  return [code, generator.ORDER_ATOMIC];
};

// 更新控件值
Arduino.forBlock['espui_update_control'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  const code = `ESPUI.updateControlValue(${controlId}, String(${value}));\n`;
  return code;
};

// 更新控件标签
Arduino.forBlock['espui_update_label'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '""';
  
  const code = `ESPUI.updateControlLabel(${controlId}, ${label});\n`;
  return code;
};

// 控件事件处理
Arduino.forBlock['espui_on_event'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  const eventType = block.getFieldValue('EVENT_TYPE');
  const statements = generator.statementToCode(block, 'DO');
  
  // 生成自定义事件处理代码
  const callbackName = `customCallback_${controlId}_${eventType}`;
  
  if (!espuiCallbacks.has(callbackName)) {
    const callbackFunc = `void ${callbackName}(Control* sender, int type) {\n` +
                        `  if (type == ${eventType}) {\n` +
                        `    ${statements || "// Custom event handler"}\n` +
                        `  }\n` +
                        `}`;
    
    generator.addFunction(callbackName, callbackFunc);
    espuiCallbacks.add(callbackName);
  }
  
  // 添加控件与回调的绑定代码
  const bindingCode = `// Custom event handler binding will be set during control creation\n`;
  generator.addSetupEnd(`event_binding_${controlId}`, bindingCode);
  
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
  
  const code = `ESPUI.addGraphPoint(${controlId}, ${value});\n`;
  return code;
};

// 清空图表
Arduino.forBlock['espui_clear_graph'] = function(block, generator) {
  const controlId = generator.valueToCode(block, 'CONTROL_ID', generator.ORDER_ATOMIC) || '0';
  
  const code = `ESPUI.clearGraph(${controlId});\n`;
  return code;
};

// WiFi设置
Arduino.forBlock['espui_wifi_setup'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"MyESP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE');
  
  let setupCode = '';
  if (mode === 'STA') {
    setupCode = `WiFi.mode(WIFI_STA);\n` +
                `WiFi.begin(${ssid}, ${password});\n` +
                `while (WiFi.status() != WL_CONNECTED) {\n` +
                `  delay(1000);\n` +
                `  Serial.println("Connecting to WiFi...");\n` +
                `}\n` +
                `Serial.println("WiFi connected!");\n` +
                `Serial.print("IP address: ");\n` +
                `Serial.println(WiFi.localIP());\n`;
  } else {
    setupCode = `WiFi.mode(WIFI_AP);\n` +
                `WiFi.softAP(${ssid}, ${password});\n` +
                `Serial.println("AP started!");\n` +
                `Serial.print("AP IP address: ");\n` +
                `Serial.println(WiFi.softAPIP());\n`;
  }
  
  generator.addSetupEnd('wifi_setup', setupCode);
  
  return '';
};

// WiFi连接状态
Arduino.forBlock['espui_wifi_status'] = function(block, generator) {
  const code = `(WiFi.status() == WL_CONNECTED)`;
  return [code, generator.ORDER_ATOMIC];
};

// 获取IP地址
Arduino.forBlock['espui_get_ip'] = function(block, generator) {
  const code = `WiFi.localIP().toString()`;
  return [code, generator.ORDER_ATOMIC];
};