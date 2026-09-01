# AK4493SEQ 音频DAC驱动库

AK4493SEQ 123dB 768kHz/32-bit 立体声高级DAC的Blockly驱动库，通过软件I2C接口控制。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-ak4493seq |
| 版本 | 1.0.0 |
| 作者 | Asahi Kasei Microdevices |
| 来源 | https://www.akm.com/global/en/products/audio/audio-dac/ak4493seq/ |
| 许可证 | Asahi Kasei Microdevices |

## 支持的开发板

- STM32F103C8 (软件I2C，任意GPIO可配置为SDA/SCK)

## 描述

AK4493SEQ是一款采用VELVET SOUND™技术的123dB高保真立体声DAC。本库通过软件I2C实现对DAC寄存器的读写控制，支持音量调节、静音、数字滤波器选择、音频格式设置、去加重、增益调整等功能。

## 快速开始

1. 初始化块中选择SDA和SCK引脚（下拉菜单选择IO口）
2. 在setup中调用初始化块
3. 使用音量/滤波器等控制块配置DAC参数
