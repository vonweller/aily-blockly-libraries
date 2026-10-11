# TF-UW500 Underwater LiDAR

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0755 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://wiki.dfrobot.com.cn/SKU_SEN0755 |
| License | MIT |

## Supported Boards

Arduino-compatible boards with UART or I2C. Sensor supply is 5V. UART 3.3V TTL.

## Description

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Quick Start

Factory default communication may be I2C 0x10. UART default 115200 8N1. Call sen0755_read before sen0755_get_data.
