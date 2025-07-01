// ESP32 WiFi库代码生成器

// WiFi连接
Arduino.forBlock['esp32_wifi_begin'] = function(block, generator) {
    const ssid = generator.valueToCode(block, 'SSID', Arduino.ORDER_ATOMIC) || '""';
    const password = generator.valueToCode(block, 'PASSWORD', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.begin(${ssid}, ${password});\n`;
    return code;
};

// WiFi连接状态
Arduino.forBlock['esp32_wifi_status'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.status()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// WiFi已连接
Arduino.forBlock['esp32_wifi_connected'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = '(WiFi.status() == WL_CONNECTED)';
    return [code, Arduino.ORDER_RELATIONAL];
};

// 断开WiFi连接
Arduino.forBlock['esp32_wifi_disconnect'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.disconnect();\n';
    return code;
};

// 获取本地IP地址
Arduino.forBlock['esp32_wifi_local_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.localIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取信号强度
Arduino.forBlock['esp32_wifi_rssi'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.RSSI()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 扫描WiFi网络
Arduino.forBlock['esp32_wifi_scan'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.scanNetworks()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取扫描结果
Arduino.forBlock['esp32_wifi_get_scan_result'] = function(block, generator) {
    const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.SSID(${index})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 创建WiFi热点
Arduino.forBlock['esp32_wifi_ap_mode'] = function(block, generator) {
    const ssid = generator.valueToCode(block, 'SSID', Arduino.ORDER_ATOMIC) || '""';
    const password = generator.valueToCode(block, 'PASSWORD', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.softAP(${ssid}, ${password});\n`;
    return code;
};

// 获取热点IP地址
Arduino.forBlock['esp32_wifi_ap_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.softAPIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 连接到服务器
Arduino.forBlock['esp32_wifi_client_connect'] = function(block, generator) {
    const host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC) || '""';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = `wifiClient.connect(${host}, ${port})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 发送数据
Arduino.forBlock['esp32_wifi_client_print'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = `wifiClient.print(${data});\n`;
    return code;
};

// 客户端有数据可读
Arduino.forBlock['esp32_wifi_client_available'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.available()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取服务器响应
Arduino.forBlock['esp32_wifi_client_read_string'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.readString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 关闭客户端连接
Arduino.forBlock['esp32_wifi_client_stop'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.stop();\n';
    return code;
};

// HTTP GET请求
Arduino.forBlock['esp32_wifi_http_get'] = function(block, generator) {
    const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <HTTPClient.h>', '#include <HTTPClient.h>');
    generator.addVariable('HTTPClient http', 'HTTPClient http;');
    
    generator.addFunction('esp32_wifi_http_get_function', 
        'String httpGET(String url) {\n' +
        '  http.begin(url);\n' +
        '  int httpCode = http.GET();\n' +
        '  String payload = "";\n' +
        '  if (httpCode > 0) {\n' +
        '    payload = http.getString();\n' +
        '  }\n' +
        '  http.end();\n' +
        '  return payload;\n' +
        '}\n'
    );
    
    const code = `httpGET(${url})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// WiFi事件处理
Arduino.forBlock['esp32_wifi_event_handler'] = function(block, generator) {
    const event = block.getFieldValue('EVENT');
    const handler = generator.statementToCode(block, 'HANDLER');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const functionName = `wifiEvent_${event.replace(/ARDUINO_EVENT_WIFI_STA_/, '').toLowerCase()}`;
    
    generator.addFunction(`${functionName}_function`,
        `void ${functionName}(WiFiEvent_t event, WiFiEventInfo_t info) {\n${handler}}\n`
    );
    
    generator.addSetupBegin(`wifi_event_${event}`, `WiFi.onEvent(${functionName}, ${event});\n`);
    
    return '';
};

// 扩展：简化的WiFi连接块
if (Blockly.Extensions.isRegistered('esp32_wifi_simple_connect_extension')) {
    Blockly.Extensions.unregister('esp32_wifi_simple_connect_extension');
}

Blockly.Extensions.register('esp32_wifi_simple_connect_extension', function() {
    // 可以添加额外的验证或行为
});
