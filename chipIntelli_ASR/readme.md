# ChipIntelliASR

OneButton-style offline speech-recognition events for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-asr` |
| Version | 2.2.0 |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Registers lifecycle, command, semantic and all-result handlers through `attach*`. Event blocks add one non-blocking `ChipIntelliASR.tick()` to `loop()`. Result fields, wake-window control and diagnostics are also exposed. Wake words use command ID 1; other words are deduplicated from ID 2.

## Quick Start

Initialize ASR in setup, then add event blocks. Do not normally mix events with polling: `tick()` and `read()` consume the same queue.
