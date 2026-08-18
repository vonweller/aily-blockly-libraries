# nRF54 Matter

Thread-based nRF54 Matter On/Off Light node with commissioning and persistent state control.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-nrf54-matter |
| Version | 0.6.81 |
| Author | nRF54 Arduino Core |
| Source | https://github.com/lolren/nrf54-arduino-core |
| License | Original license |

## Supported Boards

nrf54l15clean:nrf54l15clean

## Description

Thread-based nRF54 Matter On/Off Light node with commissioning and persistent state control.

## Quick Start

1. Enable `@aily-project/lib-nrf54-matter` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Board Configuration

Before compiling, enable both **Tools > Thread Core > Experimental Stage Core (Leader/Child/Router + UDP)** and **Tools > Matter Foundation > Experimental Compile Target (On-Network On/Off Light)**.
