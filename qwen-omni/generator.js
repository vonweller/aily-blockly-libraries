// 通义千问Qwen-Omni API库代码生成器

Arduino.forBlock['qwen_omni_config'] = function(block, generator) {
  const apiKey = generator.valueToCode(block, 'API_KEY', Arduino.ORDER_ATOMIC) || '""';
  const baseUrl = generator.valueToCode(block, 'BASE_URL', Arduino.ORDER_ATOMIC) || '"https://dashscope.aliyuncs.com/compatible-mode/v1"';

  // 添加必要的库引用
  generator.addLibrary('qwen_wifi', '#include <WiFi.h>');
  generator.addLibrary('qwen_http', '#include <HTTPClient.h>');

  // 添加全局变量
  generator.addVariable('qwen_api_key', 'String qwen_api_key = ' + apiKey + ';');
  generator.addVariable('qwen_base_url', 'String qwen_base_url = ' + baseUrl + ';');
  generator.addVariable('qwen_system_prompt', 'String qwen_system_prompt = "";');
  generator.addVariable('qwen_last_success', 'bool qwen_last_success = false;');
  generator.addVariable('qwen_last_error', 'String qwen_last_error = "";');

  // 添加简化的HTTP请求函数
  generator.addFunction('qwen_simple_request', `
String qwen_simple_request(String model, String message) {
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  http.begin(qwen_base_url + "/chat/completions");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + qwen_system_prompt + "\\"},";
  }
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + message + "\\"}]}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    int start = payload.indexOf("\\"content\\":\\"") + 11;
    int end = payload.indexOf("\\"", start);
    if (start > 10 && end > start) {
      response = payload.substring(start, end);
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      qwen_last_success = false;
      qwen_last_error = "Parse error";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  return '';
};

Arduino.forBlock['qwen_omni_chat'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_simple_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_with_history'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  // 简化版本，暂时与普通对话相同
  const code = `qwen_simple_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_clear_history'] = function() {
  return '// Clear history - simplified version\n';
};

Arduino.forBlock['qwen_omni_set_system_prompt'] = function(block, generator) {
  const systemPrompt = generator.valueToCode(block, 'SYSTEM_PROMPT', Arduino.ORDER_ATOMIC) || '""';
  return `qwen_system_prompt = ${systemPrompt};\n`;
};

Arduino.forBlock['qwen_omni_get_response_status'] = function() {
  return ['qwen_last_success', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['qwen_omni_get_error_message'] = function() {
  return ['qwen_last_error', Arduino.ORDER_ATOMIC];
};
