# 10-DOF IMU

Gravity SEN0696 10-DOF IMU with I2C/UART, accel, gyro, mag and barometer.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0696 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C or UART. Bundles DFRobot_Multi_DOF_IMU and DFRobot_RTU.

## Description

Gravity SEN0696 10-DOF IMU with I2C/UART, accel, gyro, mag and barometer.

## Quick Start

Call sen0696_init_i2c in arduino_setup(), then sen0696_read before sen0696_get_data in arduino_loop(). Default I2C 0x4A.
