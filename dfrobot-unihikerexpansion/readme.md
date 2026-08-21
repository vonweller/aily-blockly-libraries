# 行空板扩展板DFR1231

封装 DFRobot_UnihikerExpansion Arduino 库，为行空板K10 + DFR1231 IO扩展板提供 C0–C3 多功能口的数字输出/输入积木。

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-dfrobot-unihikerexpansion |
| Version | 1.0.0 |
| Author | ZhixinLiu (DFRobot) |
| Source | https://github.com/DFRobot/DFRobot_UnihikerExpansion |
| License | MIT |

## Supported Boards

行空板K10（UNIHIKER:esp32:k10），需搭配 DFR1231 行空板IO扩展板。扩展板芯片走 I2C（默认地址 0x33），占用 K10 边缘连接器的 SDA/SCL（GPIO47/48）。

## Description

上游库以 I2C 与扩展板芯片通信。本积木库封装 C0–C3 多功能口的数字输出、数字输入与电平读取：先初始化扩展板，再把 C 口设为数字输出或数字输入模式，然后写入或读取电平。初始化会在 setup 开头阻塞等待设备就绪（设备未接时会停在这里）。

## Quick Start

1. 把 K10 插到 DFR1231 扩展板上。
2. 在 setup 里放入「初始化 DFR1231 行空板扩展板」。
3. 对每个要用的 C 口调用「设置扩展板 C口 C0 模式为 数字输出」。
4. 用「设置扩展板 C口 C0 电平为 高电平/低电平」驱动外设（如继电器模块输入端）。
