# nRF54 Thread

Experimental OpenThread networking for nRF54 with roles, datasets, Commissioner, Joiner, and UDP.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-nrf54-thread |
| Version | 0.6.81 |
| Author | nRF54 Arduino Core |
| Source | https://github.com/lolren/nrf54-arduino-core |
| License | Original license |

## Supported Boards

nrf54l15clean:nrf54l15clean

## Description

Experimental OpenThread networking for nRF54 with roles, datasets, Commissioner, Joiner, and UDP.

## Quick Start

1. Enable `@aily-project/lib-nrf54-thread` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Board Configuration

Before compiling, set **Tools > Thread Core** to **Experimental Stage Core (Leader/Child/Router + UDP)**. The core's default `Disabled` option does not link OpenThread.
