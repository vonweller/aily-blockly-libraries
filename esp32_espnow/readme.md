# ESP32 ESP-NOW Blockly库

这是一个为ESP32 ESP-NOW功能设计的Arduino Blockly库，支持在可视化编程环境中使用ESP-NOW无线通信协议。

## 功能特性

- **串口模式**：点对点通信，类似串口通信但使用无线方式
- **广播模式**：支持主机向多个从机广播消息
- **网络模式**：支持多设备组网，自动选择主机
- **数据接收回调**：可以设置接收数据时的处理逻辑

## 支持的块

### 串口模式块
- ESP-NOW串口模式初始化
- ESP-NOW串口有数据可读取
- ESP-NOW串口读取数据
- ESP-NOW串口发送数据

### 广播模式块
- ESP-NOW广播主机初始化
- ESP-NOW广播发送消息
- ESP-NOW广播从机初始化

### 网络模式块
- ESP-NOW网络模式初始化
- ESP-NOW网络发送数据
- ESP-NOW网络当前设备是主机

### 数据接收块
- 当ESP-NOW接收到数据时
- 获取ESP-NOW接收到的数据
- 获取ESP-NOW发送者MAC地址

### 工具块
- 获取ESP32 MAC地址

## 使用示例

### 点对点通信示例
```
初始化：ESP-NOW串口模式初始化 对端MAC地址 "F4:12:FA:40:64:4C" WiFi频道 1 工作模式 Station模式

发送数据：ESP-NOW串口发送数据 "Hello World"

接收数据：
如果 ESP-NOW串口有数据可读取 则
    显示 ESP-NOW串口读取数据
```

### 广播通信示例

**主机端：**
```
初始化：ESP-NOW广播主机初始化 WiFi频道 6
发送：ESP-NOW广播发送消息 "广播消息"
```

**从机端：**
```
初始化：ESP-NOW广播从机初始化 WiFi频道 6
接收：当ESP-NOW接收到数据时
    显示 获取ESP-NOW接收到的数据
    显示 获取ESP-NOW发送者MAC地址
```

### 网络模式示例
```
初始化：ESP-NOW网络模式初始化 WiFi频道 4 设备数量 3

如果 ESP-NOW网络当前设备是主机 则
    ESP-NOW网络发送数据 传感器值
否则
    等待接收主机数据
```

## 依赖库

本库需要以下Arduino库支持：
- ESP32_NOW_Serial (ESP32 Arduino Core内置)
- ESP32_NOW (ESP32 Arduino Core内置)
- WiFi (ESP32 Arduino Core内置)

## 兼容性

- 支持ESP32、ESP32-C3、ESP32-S3、ESP32-C6、ESP32-H2等ESP32系列芯片
- 工作电压：3.3V
- 需要ESP32 Arduino Core 2.0.0或更高版本

## 注意事项

1. ESP-NOW协议要求通信的设备必须在同一WiFi频道
2. MAC地址格式必须为：XX:XX:XX:XX:XX:XX（十六进制，用冒号分隔）
3. 不同工作模式（AP/Station）下设备的MAC地址可能不同
4. ESP-NOW最大数据包长度为250字节
5. 建议在setup()中初始化ESP-NOW，在loop()中处理数据收发

## 版本历史

- v1.0.0：初始版本，支持串口模式、广播模式和网络模式

## 参考文档

https://docs.espressif.com/projects/arduino-esp32/en/latest/libraries.html