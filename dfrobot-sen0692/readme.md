# 6-DOF IMU

Gravity SEN0692 6-DOF IMU with I2C/UART, accel, gyro.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0692 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C or UART. Bundles DFRobot_Multi_DOF_IMU and DFRobot_RTU.

## Description

Gravity SEN0692 6-DOF IMU with I2C/UART, accel, gyro.

## Quick Start

Call sen0692_init_i2c in arduino_setup(), then sen0692_read before sen0692_get_data in arduino_loop(). Default I2C 0x4A.
