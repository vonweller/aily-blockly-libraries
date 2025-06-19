# ESP32 BLE键盘库

## 简介
这是一个用于ESP32的BLE（蓝牙低功耗）键盘库，基于ESP32-BLE-Composite-HID库开发。该库允许ESP32模拟成蓝牙键盘，支持标准键盘输入、特殊功能键、媒体控制键等功能。

## 特性
- 支持标准键盘字符输入
- 支持特殊功能键（Ctrl、Alt、Shift等）
- 支持媒体控制键（播放、暂停、音量等）
- 支持消费者键（计算器、浏览器等）
- 支持电池电量显示
- 连接状态检测
- 低功耗蓝牙通信

## 支持的开发板
- ESP32
- ESP32-S3
- ESP32-C3

## 依赖库
本库依赖于ESP32-BLE-Composite-HID库，源代码已包含在src目录中。

## API说明

### 主要类
- `BleCompositeHID` - 主要的蓝牙HID管理类
- `KeyboardDevice` - 键盘设备类
- `KeyboardConfiguration` - 键盘配置类

### 主要方法
- `keyPress(keyCode)` - 按下普通键
- `keyRelease(keyCode)` - 释放普通键
- `modifierKeyPress(modifier)` - 按下修饰键
- `modifierKeyRelease(modifier)` - 释放修饰键
- `mediaKeyPress(mediaKey)` - 按下媒体键
- `mediaKeyRelease(mediaKey)` - 释放媒体键

## 使用说明

### 基本使用
1. 首先初始化BLE键盘（会自动启用媒体键支持）
2. 等待设备连接
3. 发送键盘输入

### 注意事项
- 在发送键盘指令前，建议先检查连接状态
- ESP32需要启用蓝牙功能
- 修饰键（Ctrl、Shift等）需要使用专门的修饰键API
- 媒体键默认已启用

## 许可证
本库基于开源的ESP32-BLE-Composite-HID库，遵循其原有许可证。

## 作者
- 原始库作者：Mystfit
- aily blockly适配：aily Project
