# ChipIntelliASR

OneButton-style offline speech-recognition events for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-asr` |
| Version | 2.3.0 |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Event blocks register handlers and add `ChipIntelliASR.tick()` to `loop()`. Wake-word blocks emit `WAKEWORD<n>` macros and return `setWakeWordEnabled(true)` at their position. `keepAwakeFor()` has a user-editable 15-second toolbox default.

## Quick Start

Initialize first, then add wake-word blocks. Put the wake-window block inside a wake event. Avoid mixing events with polling.
