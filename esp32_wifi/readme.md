# ESP32 WiFi库

## 简介
ESP32 WiFi库为aily blockly提供了完整的WiFi功能支持，包括：
- WiFi网络连接和断开
- WiFi热点模式
- 网络扫描
- HTTP客户端功能
- WiFi事件处理

## 功能特性

### WiFi连接管理
- **连接WiFi网络**：支持连接到指定的WiFi网络
- **检查连接状态**：实时检查WiFi连接状态
- **断开连接**：主动断开WiFi连接
- **获取网络信息**：获取本地IP地址和信号强度

### 网络扫描
- **扫描网络**：扫描周围可用的WiFi网络
- **获取扫描结果**：获取扫描到的网络名称

### 热点模式
- **创建热点**：将ESP32设置为WiFi热点
- **获取热点IP**：获取热点模式下的IP地址

### 网络客户端
- **连接服务器**：连接到指定的服务器和端口
- **发送数据**：向服务器发送数据
- **接收数据**：从服务器接收数据
- **关闭连接**：关闭网络连接

### HTTP功能
- **HTTP GET请求**：发送HTTP GET请求并获取响应

### 事件处理
- **WiFi事件**：处理WiFi连接、断开等事件

## 使用示例

### 基本WiFi连接
```
连接WiFi网络 "your-ssid" 密码 "your-password"
等待直到 WiFi已连接
串口输出 "WiFi连接成功"
串口输出 获取本地IP地址
```

### HTTP请求
```
连接WiFi网络 "your-ssid" 密码 "your-password"
等待直到 WiFi已连接
设置变量 response 为 HTTP GET请求 "http://httpbin.org/get"
串口输出 response
```

## 兼容性
- **支持开发板**：ESP32、ESP32-C3、ESP32-S3
- **工作电压**：3.3V
- **依赖库**：WiFi.h（ESP32核心库自带）

## 注意事项
1. 确保ESP32已连接到WiFi网络再使用HTTP客户端功能
3. 使用热点模式时会断开原有的WiFi连接
4. 网络扫描功能可能需要几秒钟时间完成

## 参考文档
- [ESP32 Arduino WiFi库文档](https://docs.espressif.com/projects/arduino-esp32/en/latest/libraries.html)