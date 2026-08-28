# micro:bit Built-ins

Built-in buttons, temperature, motion, compass and radio for BBC micro:bit v1/v2.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-microbit-builtins |
| Version | 1.0.0 |
| Author | ailyProject |
| Source | https://github.com/lancaster-university/microbit-dal |
| License | MIT |

## Supported Boards

`nRF5:nRF5:BBCmicrobit`, `nRF5:nRF5:BBCmicrobitV2`

## Description

Access buttons A/B, nRF die temperature, acceleration, gestures, magnetic field, approximate heading and the built-in 2.4 GHz radio. MMA8653/MAG3110 and LSM303AGR sensors are auto-detected. Radio uses the official micro:bit datagram frame, group addressing and a 29-byte text payload. It is unencrypted and cannot run alongside BLE.

## Quick Start

1. Read buttons and sensors directly; initialization is automatic.
2. Set the same radio group on both boards.
3. Send text, then check for an available message before reading it.
