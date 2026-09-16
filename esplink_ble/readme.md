# ESPLink BLE

ArduinoBLE central and peripheral for boards without radio, via an ESP32-C3 controller.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-esplink-ble |
| Version | 1.0.0 |
| Author | Arduino (upstream Host), ESPLink contributors (port) |
| Source | https://github.com/arduino-libraries/ArduinoBLE |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1306 (chipintelli:ci13xx:ci1306) and STM32 (STMicroelectronics:stm32) hosts with a spare hardware UART and enough free RAM.

## Description

The GATT host runs on the board and the radio on the C3, over one UART shared with WiFi. Covers local services and characteristics, advertising, callbacks, scanning, connecting, discovery, and remote read/write/subscribe.

## Quick Start

1. Host TX to C3 RX, host RX to C3 TX, common GND (3.3V).
2. Start BLE, create a service and characteristics, add them, name the device, advertise.
3. Keep the loop short; only one connection is supported.
