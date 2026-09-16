# SEN0754 Ultrasonic Liquid Level Sensor

Blockly blocks for the DFRobot SEN0754 ultrasonic liquid-level sensor (3 m, IP67).

## Library Info

| Field   | Value |
| ------- | ----- |
| Package | @aily-project/lib-sen0754 |
| Version | 0.1.0 |
| Author  | Vonweller |
| Source  | https://wiki.dfrobot.com.cn/SKU_SEN0754 |
| License | MIT |

## Supported Boards

ESP32-series boards (UniHiker K10 / ESP32-S3) using UART1 or UART2 at 115200 baud.

## Description

Reads empty height and temperature over UART Modbus RTU, then converts liquid level as install height minus empty height. Realtime reads take about 100 ms; processed reads take at least 2 s.

## Quick Start

1. Wire 5V, GND, sensor TX (green) to board RX (16), sensor RX (blue) to board TX (17).
2. Place the init block and set UART pins.
3. Set install height in millimeters.
4. In loop, read realtime or processed values, then read liquid level.
