# NTC热敏温度传感器 Arduino Blockly库

这是一个用于Arduino Blockly的NTC热敏温度传感器库，基于[NTC_Thermistor](https://github.com/bobwolff68/NTC_Thermistor)开源库开发。

## 功能特性

- 支持多种Arduino开发板（UNO、MEGA、ESP32等）
- 提供摄氏度、华氏度、开尔文温度读取
- 自动识别ESP32设备并使用高精度读取
- 简化的block设计，易于使用
- 自动变量命名（ntc_temp_引脚号）

## Block说明

### 1. NTC初始化Block
- **功能**: 初始化NTC热敏温度传感器
- **参数**: 
  - 引脚：选择模拟引脚
  - 参考电阻：分压电路中的参考电阻值（欧姆）
  - 标称电阻：NTC在标称温度下的电阻值（欧姆）
  - 标称温度：NTC的标称温度（摄氏度）
  - B值：NTC的B参数值

### 2. 温度读取Blocks
- **ntc_read_celsius**: 读取摄氏温度
- **ntc_read_fahrenheit**: 读取华氏温度  
- **ntc_read_kelvin**: 读取开尔文温度
- **ntc_simple_read**: 简化版读取（使用默认参数）

## 使用示例

1. 首先使用"NTC初始化"block设置传感器参数
2. 然后使用对应的温度读取block获取温度值
3. 变量会自动根据引脚号生成（如：ntc_temp_A0）

## 默认参数

- 参考电阻：10kΩ
- 标称电阻：10kΩ  
- 标称温度：25°C
- B值：3950

## 兼容性

- Arduino UNO/MEGA
- ESP32系列（ESP32、ESP32-C3、ESP32-S3）
- Arduino UNO R4
- 工作电压：3.3V、5V

## 注意事项

- 确保NTC传感器正确连接到分压电路
- ESP32设备会自动使用校准后的ADC读取以获得更高精度
- 不同的NTC型号可能需要调整B值和标称参数

## 电路连接

```
VCC ----[参考电阻]----+----[NTC热敏电阻]---- GND
                     |
                   模拟引脚
```

## 开源协议

本库基于NTC_Thermistor开源库开发，遵循其开源协议。
