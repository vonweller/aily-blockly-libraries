# ChipIntelliASR

Offline speech-recognition result blocks for ChipIntelli CI1302, CI1303 and CI1306.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-asr` |
| Version | 1.1.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Safely polls command ID, semantic ID, score, frame count and text, and diagnoses compile-time AEC and voice-interruption profiles.

## Quick Start

Initialize ASR in setup. Put the read-all-results block in loop and use the current-result getters inside its handler.
