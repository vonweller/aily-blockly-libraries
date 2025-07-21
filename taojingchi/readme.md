# 淘晶驰串口屏驱动库

## 简介
本库为淘晶驰串口屏提供Arduino Blockly支持，可以轻松控制串口屏的各种功能。

## 功能特性
- 支持串口初始化配置
- 背光亮度调节 (0-100)
- 页面切换 (0-16)
- 变量设置 (data01-data16)
- 图片显示控制
- 自定义命令发送
- 数据发送

## 支持的开发板
- Arduino UNO/MEGA (使用软串口)
- ESP32系列 (使用硬件Serial1)
- Arduino UNO R4 系列

## 使用说明

### 初始化
首先需要初始化串口屏连接，设置RX/TX引脚和波特率。

### 基本控制
1. **背光控制**: 调节屏幕亮度，范围0-100
2. **页面切换**: 切换显示页面，范围0-16
3. **变量设置**: 设置屏幕变量值，支持data01-data16
4. **图片显示**: 控制指定页面的图片显示

### 高级功能
- **自定义命令**: 发送任意命令到串口屏
- **数据发送**: 发送键值对数据

## 注意事项
1. ESP32开发板使用硬件Serial1，Arduino开发板使用软串口
2. 串口屏命令需要以3个0xFF结尾
3. 建议在命令之间添加适当的延时(10ms)

## 示例代码
使用本库生成的Arduino代码示例：
```cpp
#include <SoftwareSerial.h>  // Arduino开发板需要
SoftwareSerial taojingchiSerial(2, 3);  // Arduino开发板

void setup() {
    taojingchiSerial.begin(9600);  // 或 Serial1.begin(9600, SERIAL_8N1, 2, 3); ESP32
}

void loop() {
    // 设置背光亮度为80
    taojingchiSerial.print("dim=" + String(80));
    taojingchiSerial.write(0xFF);
    taojingchiSerial.write(0xFF); 
    taojingchiSerial.write(0xFF);
    delay(10);
    
    // 切换到页面1
    taojingchiSerial.print("page" + String(1));
    taojingchiSerial.write(0xFF);
    taojingchiSerial.write(0xFF);
    taojingchiSerial.write(0xFF);
    delay(10);
}
```