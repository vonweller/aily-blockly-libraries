# PS2 手柄

通用 PS2（DualShock 2）手柄积木库：ATT/CMD/DAT/CLK 四线引脚全部可选（数据来自当前主控的数字引脚表），读取按键、摇杆并控制双震动电机。参考接线预置为创乐博 MakeBit 扩展板（主控 micro:bit V2）板载 PS2 插座。

## Library Info

| Field   | Value                  |
| ------- | ---------------------- |
| Package | @aily-project/lib-ps2x |
| Version | 1.3.21                 |
| Author  | ailyProject            |
| Source  | 本地编写（无上游仓库） |
| License | UNLICENSED             |

## Supported Boards

任何 Arduino 框架的开发板（`compatibility.core: []`）。已按两类核心区分 SPI 引脚能力：

- **支持 SPI 引脚重映射**（ESP32 全系等）：ATT/CMD/DAT/CLK 可任选 GPIO；
- **SPI 焊盘固定**（micro:bit V2 等）：CMD/DAT/CLK 必须接板卡 SPI 焊盘（micro:bit V2 为 P15(MOSI)/P14(MISO)/P13(SCK)），ATT 可任选。

## Description

micro:bit V2 / ESP32 均为 3.3V 逻辑可与接收器直连；5V 板卡（如 AVR UNO）需注意电平匹配。协议层与主控无关：硬件 SPI（模式 3、100 kHz，软件字节位序镜像实现 PS2 的 LSB-first 时序），自动完成手柄配置（锁定模拟模式、映射震动电机），每轮循环开头自动轮询刷新，支持断线自动重连。ESP32 核心不使用硬件 SPI，而由 GPIO 位拆裂（bit-bang）直接驱动 CMD/CLK 并采样 DAT（软件时钟约 100kHz，LSB-first 时序完全由代码定义，任意空闲 GPIO 可用）；micro:bit V2 等固定焊盘核心继续使用硬件 SPI。进入循环后自动通过串口打印一次引脚配置与核心分支；未连接期间诊断行限流为每秒最多 1 行。控制安全门禁自 v1.3.16 起为毫秒时间制并与轮询频率解耦：连接后仅需手柄完全静置 250ms（全按键松开、摇杆居中 ±24）即可解锁控制（等待期间每秒打印一条提示）；模拟量突变阈值随实际轮询间隔自适应（约 13 计数/5ms），慢轮询程序中快速打杆不再被误判为无手柄噪声。ESP32 核心使用硬件批量移位（`SPI.transferBytes`）单事务完成整条命令，避免逐字节软件间隙破坏 2.4G 接收器时序（v1.3.13）。

## Quick Start

- **创乐博 MakeBit**（micro:bit V2）：接收器直接插 PS2 插座，积木选 ATT=12、CMD=15、DAT=14、CLK=13（与板内接线一致）。
- **ESP32 等**：任意 4 个空闲 GPIO，例如 ATT=5、CMD=23、DAT=19、CLK=18，接线与积木选择一致即可。

积木用法：把"初始化 PS2 手柄"放进"初始化"；循环里直接使用"手柄按键/摇杆"积木（数据每轮自动刷新）；"设置手柄震动"放在循环里调用，下一次自动读取时生效。
