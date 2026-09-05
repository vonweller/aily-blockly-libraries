# PS2 手柄

通用 PS2（DualShock 2）手柄积木库：ATT/CMD/DAT/CLK 四线引脚全部可选（数据来自当前主控的数字引脚表），读取按键、摇杆并控制双震动电机。参考接线预置为创乐博 MakeBit 扩展板（主控 micro:bit V2）板载 PS2 插座。

## Library Info

| Field   | Value                  |
| ------- | ---------------------- |
| Package | @aily-project/lib-ps2xmbit |
| Version | 1.3.21                 |
| Author  | ajie5211               |
| Source  | 本地编写（无上游仓库） |
| License | UNLICENSED             |

## Supported Boards

任何 Arduino 框架的开发板（`compatibility.core: []`）。已按两类核心区分通信实现：

- **ESP32 GPIO 模拟通信**：ATT/CMD/DAT/CLK 可选适合相应输入或输出功能的空闲 GPIO；
- **SPI 焊盘固定**（micro:bit V2 等）：CMD/DAT/CLK 必须接板卡 SPI 焊盘（micro:bit V2 为 P15(MOSI)/P14(MISO)/P13(SCK)），ATT 可任选。

## Description

micro:bit V2 / ESP32 均为 3.3V 逻辑可与接收器直连；5V 板卡（如 AVR UNO）需注意电平匹配。ESP32 使用 GPIO 模拟通信（bit-bang）直接驱动 CMD/CLK 并采样 DAT，按 LSB-first 顺序收发；micro:bit V2 等固定焊盘核心使用硬件 SPI（模式 3、100 kHz，软件字节位序镜像）。初始化自动配置手柄，每轮循环开头自动轮询，支持断线重连；控制解锁需手柄静置，模拟量突变阈值随轮询间隔调整。诊断信息通过串口输出。

**震动兼容性限制**：1.3.21 依次发送标准和交换电机映射，但轮询仍按标准顺序发送。接受交换映射的手柄可能出现大小电机控制对调，小电机开关可能使大电机全速运行。

## Quick Start

- **创乐博 MakeBit**（micro:bit V2）：接收器直接插 PS2 插座，积木选 ATT=12、CMD=15、DAT=14、CLK=13（与板内接线一致）。
- **ESP32 等**：任意 4 个空闲 GPIO，例如 ATT=5、CMD=23、DAT=19、CLK=18，接线与积木选择一致即可。

积木用法：把"初始化 PS2 手柄"放进"初始化"；循环里直接使用"手柄按键/摇杆"积木（数据每轮自动刷新）；"设置手柄震动"放在循环里调用，下一次自动读取时生效。
