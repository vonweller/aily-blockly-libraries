# ESP32 WiFiManager Blockly库

这是一个用于ESP32和ESP8266开发板的WiFiManager库的Blockly封装，提供了简单易用的WiFi配置门户和自动连接功能。

## 功能特性

- **自动连接WiFi**: 尝试连接到之前保存的WiFi网络
- **配置门户**: 当连接失败时自动创建配置门户AP
- **静态IP设置**: 支持设置静态IP地址
- **自定义参数**: 支持添加自定义配置参数
- **非阻塞模式**: 支持阻塞和非阻塞两种工作模式
- **超时设置**: 可配置连接超时时间

## 主要Block说明

### 基础功能
- **初始化WiFiManager**: 创建WiFiManager实例
- **自动连接**: 自动连接WiFi网络，支持指定SSID和密码
- **简单自动连接**: 使用默认配置自动连接

### 配置设置
- **设置超时**: 配置门户超时时间设置
- **设置工作模式**: 阻塞/非阻塞模式切换
- **设置静态IP**: 配置静态IP地址、网关和子网掩码

### 高级功能
- **启动配置门户**: 手动启动配置门户
- **处理WiFiManager**: 在非阻塞模式下处理连接状态
- **重置设置**: 清除保存的WiFi凭据

### 自定义参数
- **添加参数**: 向配置门户添加自定义参数
- **获取参数值**: 获取用户输入的参数值

## 使用示例

### 基本使用
1. 在setup()中添加"初始化WiFiManager"
2. 使用"WiFiManager自动连接"尝试连接WiFi
3. 根据连接结果执行相应操作

### 高级配置
```
初始化WiFiManager
↓
设置配置门户超时 30秒
↓
如果 WiFiManager自动连接("MyAP", "password")
  则 串口输出("WiFi连接成功")
  否则 串口输出("连接失败，请配置WiFi")
```

## 兼容性

- **支持的开发板**: ESP32, ESP32-C3, ESP32-S2, ESP32-S3, ESP8266
- **工作电压**: 3.3V
- **依赖**: 需要安装WiFiManager库 (https://github.com/tzapu/WiFiManager)

## 注意事项

1. 该库主要适用于ESP32和ESP8266开发板
2. 需要预先安装tzapu/WiFiManager Arduino库
3. 在使用非阻塞模式时，需要在loop()中调用"处理WiFiManager"
4. 配置门户会创建一个名为指定SSID的WiFi热点

## 源码来源

本库基于tzapu/WiFiManager开源库 (https://github.com/tzapu/WiFiManager)，遵循MIT许可证。

## 版本历史

- v1.0.0: 初始版本，支持基本WiFi管理功能
