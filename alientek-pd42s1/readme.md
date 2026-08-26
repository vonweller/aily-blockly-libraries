# 正点原子 PD42S1 闭环步进驱动器积木库

通过 UART 串口协议控制正点原子 PD42S1 闭环步进电机驱动器的 Aily Blockly 积木库。

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-alientek-pd42s1 |
| Version | 1.0.0 |
| Author | 正点原子团队(ALIENTEK) |
| Source | 【正点原子】PD42S1步进电机闭环驱动器 → 4，Arduino例程 → 【正点原子】DNESP32S3开发板 |
| License | Copyright (c) 2020-2032 广州市星翼电子科技有限公司 |

## Supported Boards

ESP32 系列板卡（esp32:esp32 内核），如正点原子 DNESP32S3、Unihiker K10 等具有空闲 UART 的板卡。

## Description

封装 PD42S1 全部 71 个协议功能，以及板卡侧 EN/STEP/DIR 脉冲输出与 IO 启停电平控制：闭环/开环的速度、位置、力矩控制，脉冲与脉宽模式，IO 启停，回零与限位，21 类参数读取，20 类参数设置以及系统维护指令。串口引脚与波特率可配置，应答帧自动解析并打印到串口0。

## Quick Start

1. 接线：板卡 TX → 驱动器 RX，板卡 RX → 驱动器 TX，共地（TTL 电平）。
2. 放入「PD42S1 初始化」积木，按接线设置 TX/RX 引脚（默认 19/20）与波特率（默认 115200）。
3. 用运动控制积木控制电机；用「读取」积木查询状态，结果自动打印到串口0 调试口。
