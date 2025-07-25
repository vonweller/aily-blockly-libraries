# 通义千问库测试示例

## 最小测试程序

这是一个最简单的测试程序，用于验证库是否能正常编译和工作：

### 积木组合

1. **在 setup 部分**：
   ```
   配置通义千问API
   ├─ API Key: "sk-your-api-key-here"
   └─ Base URL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
   
   设置通义千问系统提示词
   └─ 系统提示词: "你是一个有用的AI助手，请简短回复"
   ```

2. **在 loop 部分**：
   ```
   如果 串口可用数据 > 0
   那么
       变量 userInput = 串口读取字符串
       变量 response = 通义千问对话
                      ├─ 用户消息: userInput
                      └─ 模型: qwen-omni-turbo
       
       如果 获取通义千问响应状态
       那么
           串口输出 "AI回复: " + response
       否则
           串口输出 "错误: " + 获取通义千问错误信息
   ```

### 生成的Arduino代码示例

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

String qwen_api_key = "sk-your-api-key-here";
String qwen_base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1";
String qwen_system_prompt = "";
bool qwen_last_success = false;
String qwen_last_error = "";

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
  
  String requestBody = "{\"model\":\"" + model + "\",\"messages\":[";
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\"role\":\"system\",\"content\":\"" + qwen_system_prompt + "\"},";
  }
  requestBody += "{\"role\":\"user\",\"content\":\"" + message + "\"}]}";
  
  int httpResponseCode = http.POST(requestBody);
  String response = "";
  
  if (httpResponseCode == 200) {
    String payload = http.getString();
    int start = payload.indexOf("\"content\":\"") + 11;
    int end = payload.indexOf("\"", start);
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
}

void setup() {
  Serial.begin(115200);
  
  // 连接WiFi
  WiFi.begin("your-wifi-ssid", "your-wifi-password");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  
  // 配置API
  qwen_api_key = "sk-your-api-key-here";
  qwen_base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1";
  qwen_system_prompt = "你是一个有用的AI助手，请简短回复";
}

void loop() {
  if (Serial.available() > 0) {
    String userInput = Serial.readString();
    userInput.trim();
    
    String response = qwen_simple_request("qwen-omni-turbo", userInput);
    
    if (qwen_last_success) {
      Serial.println("AI回复: " + response);
    } else {
      Serial.println("错误: " + qwen_last_error);
    }
  }
  
  delay(100);
}
```

## 测试步骤

1. 确保ESP32已连接WiFi
2. 替换代码中的WiFi凭据和API Key
3. 编译并上传代码
4. 打开串口监视器
5. 输入消息测试AI对话功能

## 故障排除

- 如果编译失败，尝试选择"Huge APP"分区方案
- 如果API调用失败，检查网络连接和API Key
- 如果解析失败，可能是API响应格式变化，需要调整解析逻辑
