# Adafruit SHT4x温湿度传感器库

## 简介

本库为Adafruit SHT4x系列温湿度传感器提供Arduino Blockly支持。SHT4x是高精度数字温湿度传感器，采用I2C通信协议，具有出色的测量精度和稳定性。

## 支持的传感器型号

- SHT40 - 基础型号
- SHT41 - 带校准证书
- SHT45 - 高精度型号

## 主要特性

- **高精度测量**：温度精度±0.2°C，湿度精度±1.8%RH
- **I2C通信**：支持标准I2C接口，地址0x44或0x45
- **可配置精度**：支持高、中、低三种测量精度
- **内置加热器**：用于去湿和提高测量可靠性
- **低功耗**：适合电池供电应用

## 硬件连接

### 标准连接（Arduino UNO/Nano）
- VCC → 3.3V 或 5V
- GND → GND  
- SDA → A4
- SCL → A5

### ESP32连接
- VCC → 3.3V
- GND → GND
- SDA → GPIO21
- SCL → GPIO22

## 使用说明

### 基础使用

1. **初始化传感器**
   - 使用"初始化SHT4x传感器"块来初始化传感器
   - 可选择I2C地址（0x44默认，0x45备选）

2. **读取数据**
   - 使用"SHT4x读取温度"块获取温度值（单位：摄氏度）
   - 使用"SHT4x读取湿度"块获取湿度值（单位：%RH）

3. **批量读取**
   - 使用"SHT4x读取温湿度"块同时读取温湿度
   - 配合"获取最后读取的温度/湿度"块获取数值

### 高级功能

1. **精度设置**
   - 高精度：最高测量精度，耗时最长
   - 中等精度：平衡精度和速度
   - 低精度：最快测量速度

2. **加热器功能**
   - 用于去除传感器表面水汽
   - 提供多种加热模式（温度和时间组合）

3. **设备管理**
   - 读取传感器序列号
   - 软件重置传感器

### 简化使用模式

对于简单应用，可以使用"简单读取SHT4x"块，该块会自动处理初始化和数据读取。

## 编程示例

### 基础温湿度监测
```
初始化SHT4x传感器 地址 0x44
永远循环：
  变量 温度 = SHT4x读取温度
  变量 湿度 = SHT4x读取湿度
  串口打印 "温度：" + 温度 + "°C"
  串口打印 "湿度：" + 湿度 + "%"
  等待 1000 毫秒
```

### 高精度测量
```
初始化SHT4x传感器 地址 0x44
设置SHT4x精度 高精度
永远循环：
  SHT4x读取温湿度
  串口打印 "温度：" + 获取最后读取的温度 + "°C"
  串口打印 "湿度：" + 获取最后读取的湿度 + "%"
  等待 2000 毫秒
```

## 注意事项

1. **电源要求**：传感器支持3.3V和5V供电
2. **I2C上拉电阻**：确保SDA和SCL线路有适当的上拉电阻（通常4.7kΩ）
3. **测量间隔**：建议读取间隔不小于500ms
4. **环境条件**：避免在极端温湿度环境下使用
5. **加热器使用**：加热器功能会增加功耗，请根据需要使用

## 依赖库

本库需要以下Arduino库：
- Adafruit_SHT4x
- Adafruit_Sensor
- Wire（I2C通信）

## 技术支持

如遇问题，请参考：
1. [Adafruit SHT4x官方文档](https://learn.adafruit.com/adafruit-sht40-temperature-humidity-sensor)
2. [SHT4x数据手册](https://www.sensirion.com/en/environmental-sensors/humidity-sensors/digital-humidity-sensors-for-various-applications/)

## 版本历史

- v1.0.0 - 初始版本，支持基础温湿度读取和高级配置功能
