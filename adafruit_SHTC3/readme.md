# SHTC3温湿度传感器库

这是一个用于Arduino Blockly的SHTC3数字温湿度传感器库。SHTC3是一款高精度、低功耗的I2C数字温湿度传感器。

## 特性

- 高精度温湿度测量
- I2C通信接口（地址：0x70）
- 低功耗模式支持
- 睡眠/唤醒功能
- 简单易用的Blockly积木块

## 支持的功能

### 基本功能
- **初始化传感器**: 初始化SHTC3传感器
- **读取温度**: 获取当前温度值（摄氏度）
- **读取湿度**: 获取当前湿度值（相对湿度%）
- **同时读取温湿度**: 一次性读取温度和湿度数据

### 高级功能
- **检查连接**: 检查传感器是否正常连接
- **电源管理**: 设置睡眠/唤醒模式
- **功耗模式**: 切换正常/低功耗模式

## 硬件连接

SHTC3传感器使用I2C接口，需要连接以下引脚：

| SHTC3引脚 | Arduino引脚 |
|----------|-------------|
| VCC      | 3.3V 或 5V  |
| GND      | GND         |
| SDA      | SDA (A4)    |
| SCL      | SCL (A5)    |

## 使用示例

### 基本读取温湿度
1. 在setup部分使用"初始化SHTC3温湿度传感器"积木块
2. 在loop部分使用"SHTC3读取温度"和"SHTC3读取湿度"积木块

### 一次性读取温湿度
1. 使用"SHTC3同时读取温湿度"积木块更新数据
2. 然后可以使用存储的温湿度值

### 低功耗应用
1. 使用"SHTC3设置低功耗模式"积木块
2. 读取数据后使用"SHTC3进入睡眠模式"积木块
3. 需要时使用"SHTC3进入唤醒模式"积木块

## 技术规格

- 工作电压：2.4V - 5.5V
- 工作温度：-40°C 到 +125°C
- 温度精度：±0.2°C (典型值)
- 湿度精度：±2% RH (典型值)
- I2C地址：0x70
- 响应时间：<8秒

## 依赖库

本库基于Adafruit SHTC3库，使用前请确保已安装：
- Adafruit SHTC3库
- Adafruit Unified Sensor库
- Adafruit BusIO库

## 版本历史

- v1.0.0: 初始版本，支持基本温湿度读取和电源管理功能

## 许可证

本库遵循BSD许可证，基于Adafruit开源库开发。
