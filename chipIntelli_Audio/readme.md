# ChipIntelliAudio

Prompt and local-audio playback blocks for ChipIntelli CI1302, CI1303 and CI1306.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-audio` |
| Version | 1.0.1 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Plays voice, command and semantic prompts provisioned in firmware `voice.bin`, or an uploaded local MP3 prepared with the built-in audio editor. Supports queueing, volume, mute and completion events.

## Quick Start

Initialize the player, set volume, then play a configured voice, command, semantic ID or local-audio value. Local-audio IDs start at 500 and identical source/encoding settings are deduplicated. Command-text lookup is not TTS; IDs and text must exist in project resources.
