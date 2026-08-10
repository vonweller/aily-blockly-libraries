# ChipIntelliAudio

Prompt and local-audio playback blocks for ChipIntelli CI1302, CI1303 and CI1306.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-audio` |
| Version | 1.0.2 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Plays prompts provisioned in firmware `voice.bin`, or an uploaded local MP3 prepared with the built-in audio editor. Numeric-variable inputs are converted to `String` and spoken as localized runtime numbers. Supports queueing, volume, mute and completion events.

## Quick Start

Initialize the player, set volume, then use the play block with a configured prompt, local-audio value or numeric variable. Prompt and local-audio inputs call the 16-bit voice-ID overload; numeric variables call the localized-number `String` overload. Local-audio IDs start at 500 and identical source/encoding settings are deduplicated.
