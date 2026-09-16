# Advanced GPIO

## Library Info

- Package: `@aily-project/lib-esp32-gpio`, version 1.0.0
- Author: ailyProject; license: MIT
- Source: [Arduino-ESP32](https://github.com/espressif/arduino-esp32)

## Supported Boards

ESP32 family, Arduino-ESP32 3.x+, 3.3 V. Touch and DAC availability depends on the chip.

## Description

Capacitive touch with calibration, ADC millivolts and averaging, true DAC output, LEDC PWM with percentage duty and fading, deferred interrupts, pin pulls, drive strength, hold and wakeup. No external Arduino library is required.

## Quick Start

1. Add this library and select an ESP32 board.
2. For touch, calibrate an untouched electrode in setup, then read the pressed state in loop.
3. For an LED, use the PWM percentage block; it initializes automatically.
4. See [readme_ai.md](readme_ai.md) for pin restrictions, configuration and examples.
