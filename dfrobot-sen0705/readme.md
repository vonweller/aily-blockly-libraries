# 4x8 Tactile

DFRobot SEN0705 4x8 flexible tactile pressure array over UART.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0705 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://github.com/DFRobot/DFRobot_TactileSensor |
| License | MIT |

## Supported Boards

Arduino-compatible boards with UART. 5V supply. Default baud 115200. Bundles DFRobot_TactileSensor and DFRobot_RTU.

## Description

DFRobot SEN0705 4x8 flexible tactile pressure array over UART.

## Quick Start

Call sen0705_init in setup, then sen0705_read before sen0705_cell. Array is 4 rows x 8 cols, 0-based.
