# 通义千问 Qwen-Omni API 库（轻量版）

这是一个用于 aily blockly 的阿里云通义千问 Qwen-Omni 大语言模型 API 库的轻量版本，专为解决编译内存限制问题而设计。

## 功能特性

- ✅ 支持通义千问基础文字对话
- ✅ 支持自定义系统提示词
- ✅ 支持错误处理和状态检查
- ✅ 轻量化设计，减少内存占用
- ⚠️ 简化版多轮对话（暂时与单次对话相同）

## 支持的开发板

- ESP32 系列开发板（ESP32、ESP32-C3、ESP32-S3、ESP32-C6、ESP32-H2）
- 需要支持 WiFi 连接

## 依赖库

- WiFi.h（ESP32 内置）
- HTTPClient.h（ESP32 内置）
- 无需额外依赖库

## 使用方法

### 1. 配置 API

首先需要配置通义千问的 API Key 和 Base URL：

```
配置通义千问API
├─ API Key: "sk-your-api-key-here"
└─ Base URL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
```

### 2. 设置系统提示词（可选）

可以设置 AI 助手的角色和行为规则：

```
设置通义千问系统提示词
└─ 系统提示词: "你是一个有用的AI助手"
```

### 3. 进行对话

#### 简单对话
```
通义千问对话
├─ 用户消息: "你好"
├─ 模型: qwen-omni-turbo
└─ 最大输出长度: 2048
```

#### 多轮对话
```
通义千问多轮对话
├─ 用户消息: "继续我们的对话"
├─ 保存历史记录: ✓
├─ 模型: qwen-omni-turbo
└─ 最大输出长度: 2048
```

### 4. 管理对话历史

```
清空通义千问对话历史
```

### 5. 错误处理

```
如果 获取通义千问响应状态
那么
    串口输出 获取通义千问错误信息
```

## API Key 获取方法

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册并登录账号
3. 在控制台中创建应用
4. 获取 API Key

## 支持的模型

- `qwen-omni-turbo`：稳定版本
- `qwen-omni-turbo-latest`：最新版本
- `qwen2.5-omni-7b`：开源版本

## 编译建议

如果遇到 `collect2.exe: error: ld returned 1 exit status` 链接错误：

1. **选择合适的分区方案**：
   - 工具 → 分区方案 → 选择 "Huge APP (3MB No OTA/1MB SPIFFS)"

2. **优化内存使用**：
   - 避免在同一程序中使用过多大型库
   - 考虑分阶段实现功能

3. **检查WiFi连接**：
   - 确保在 setup() 中正确初始化 WiFi

## 注意事项

1. 确保开发板已连接 WiFi
2. API Key 需要有足够的调用额度
3. 这是轻量版本，功能相对简化
4. 建议在 setup() 中配置 API，在 loop() 中进行对话

## 积木使用示例

### 基本对话流程

1. **初始化阶段**（在setup中）：
   - 使用"配置通义千问API"积木设置API Key
   - 使用"设置通义千问系统提示词"积木设置AI角色

2. **对话阶段**（在loop中）：
   - 使用"通义千问对话"或"通义千问多轮对话"积木发送消息
   - 使用"获取通义千问响应状态"检查是否成功
   - 如果失败，使用"获取通义千问错误信息"查看错误

3. **历史管理**：
   - 使用"清空通义千问对话历史"重置对话

## 示例代码

完整的使用示例：

```cpp
void setup() {
  Serial.begin(115200);
  
  // 连接WiFi
  WiFi.begin("your-wifi-ssid", "your-wifi-password");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  // 配置通义千问API
  qwen_api_key = "sk-your-api-key-here";
  qwen_base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1";
  
  // 设置系统提示词
  qwen_system_prompt = "你是一个有用的AI助手";
}

void loop() {
  if (Serial.available()) {
    String userInput = Serial.readString();
    userInput.trim();
    
    // 进行对话
    String response = qwen_make_request("qwen-omni-turbo", userInput, 2048, true, true);
    
    if (qwen_last_success) {
      Serial.println("AI回复: " + response);
    } else {
      Serial.println("错误: " + qwen_last_error);
    }
  }
  
  delay(100);
}
```

## 版本历史

- v0.0.1：初始版本，支持基本的文字对话功能

## 许可证

本库基于阿里云通义千问 API 开发，使用时请遵守阿里云服务条款。
