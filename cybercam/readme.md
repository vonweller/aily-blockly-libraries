# CyberCAM Python

Evidence-backed Python blocks for documented 01Studio CyberCAM K230 camera, display, AI, GPIO, PWM, UART, networking, files, audio, IMU, and system APIs.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-cybercam |
| Version | 1.0.0 |
| Author | ailyProject; hardware APIs by 01Studio |
| Source | https://github.com/01studio-lab/01studio_wiki/tree/main/docs/cybercam |
| License | MIT |

## Supported Boards

01Studio CyberCAM K230 (Python mode)

## Description

Library covers verified Python contracts rather than every physical hardware feature. Network protocol blocks operate over an already configured network. Touch, Wi-Fi management, Bluetooth, generic I2C, SPI, GPIO interrupts, and ADC remain excluded pending verified executable CyberCAM Python APIs.

## Quick Start

1. Enable `@aily-project/lib-cybercam` in Aily Blockly.
2. Place initialization blocks under `cybercam_start`, then place capture, processing, and display blocks under `cybercam_forever`.
