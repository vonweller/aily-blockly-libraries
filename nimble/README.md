# NimBLEBluetooth

Bluetooth Low Energy (BLE) library for ESP32 and n-able Arduino boards, supporting server and client modes.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-nimble |
| Version | 1.0.1 |
| Author | h2zero |
| Source | https://github.com/h2zero/NimBLE-Arduino |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards supported by this package, plus:

- `n-able-Arduino:arm-ble:BBCmicrobit`
- `n-able-Arduino:arm-ble:BBCmicrobitV2`
- `n-able-Arduino:arm-ble:nRF52DK`
- `n-able-Arduino:arm-ble:nRF52840_DK`
- `n-able-Arduino:arm-ble:nRF52840_dongle`
- `n-able-Arduino:arm-ble:seeed52840sense`

## Description

Provides NimBLE server and client blocks on compatible ESP32 and n-able Arduino boards.

## Quick Start

1. Enable `@aily-project/lib-nimble` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
