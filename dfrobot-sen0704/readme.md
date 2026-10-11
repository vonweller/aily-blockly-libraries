# 6x6 Tactile

DFRobot SEN0704 6x6 flexible tactile pressure array over UART.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0704 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://github.com/DFRobot/DFRobot_TactileSensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards with UART. 5V supply. Default baud 115200. Bundles DFRobot_TactileSensor and DFRobot_RTU.

## Description

DFRobot SEN0704 6x6 flexible tactile pressure array over UART.

## Quick Start

Call sen0704_init in setup, then sen0704_read before sen0704_cell. Array is 6 rows x 6 cols, 0-based.
