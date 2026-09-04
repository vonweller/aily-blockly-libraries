# FastLED RGB Light Strip

Blockly blocks for addressable RGB/GRB strips using FastLED.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-fastled` |
| Version | 1.0.4 |
| Author | 奈何col |
| Source | [coloz/FastLED](https://github.com/coloz/FastLED) |
| License | Not specified in package metadata |

## Supported Boards

No core is restricted; metadata lists 3.3 V and 5 V environments. Follow the strip's electrical requirements.

## Description

Controls pixels, ranges, bars, brightness and RGB/HSV colours, plus six animation effects. Supports WS2812B, WS2812, WS2811, NEOPIXEL, WS2801, LPD8806 and APA102. All choices expose one data pin and no separate clock pin.

## Quick Start

1. Connect power, ground and data; select that digital pin in every block.
2. Initialize the pin, chipset and LED count once in setup.
3. End grouped static changes with `fastled_refresh`. Call animated effects repeatedly in the loop; a loop delay controls frame timing.
