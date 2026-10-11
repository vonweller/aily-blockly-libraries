# 9-DOF IMU

Gravity SEN0694 9-DOF IMU with I2C/UART, accel, gyro, mag.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0694 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C or UART. Bundles DFRobot_Multi_DOF_IMU and DFRobot_RTU.

## Description

Gravity SEN0694 9-DOF IMU with I2C/UART, accel, gyro, mag.

## Quick Start

Call sen0694_init_i2c in arduino_setup(), then sen0694_read before sen0694_get_data in arduino_loop(). Default I2C 0x4A.
