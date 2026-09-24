# grokEyes

Animated robot eyes for TFT_eSPI displays.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-grok-eyes |
| Version | 2.2.1 |
| Author | grokEyes contributors |
| Source | [grokEyes](https://github.com/coloz/grokEyes) |
| License | MIT AND BSD-3-Clause; see LICENSE |

## Supported Boards

ESP32 and RP2040 with TFT_eSPI and sufficient sprite memory.

## Description

35 blocks expose 25 named expressions, 21 Xiaozhi aliases, 18 shapes and 39 states, plus blinking, gaze, turns, layout and themes. Depends on lib-tft-espi 2.5.54.

## Quick Start

1. Initialize a TFT_eSPI screen with your controller, dimensions and pins.
2. Initialize grokEyes using that screen; enable automatic update.
3. Check initialization success, then select an expression or state.
4. Use the animation wait block between actions to keep eyes moving.

See the [block reference](readme_ai.md). Hardware verification is pending.

## Source and compatibility

This wrapper packages grokEyes 2.2.0 snapshot `ab4dde909c75e68321412108457ef4bf9d211da2`. Select expressions by name, such as **Happy / 开心** (`GROK_EXPRESSION_HAPPY`). All 11 locales use the same enum values. Existing numbered dropdown selections in saved JSON/XML projects are migrated on load; change old text names such as `expression02` to `happy`.

The default dark theme has a pure-black background. CH13613 uses aligned QSPI updates; a 480×480 RGB565 canvas requires about 450 KiB and matching PSRAM settings.
