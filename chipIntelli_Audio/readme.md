# ChipIntelliAudio

Prompt, local-audio and runtime-number playback for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-audio` |
| Version | 1.0.2 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`) at 3.3 V.

## Description

Plays fixed `voice.bin` prompts, imported audio, or decimal values from numeric variables. Includes queue/interrupt, volume, mute, status and completion; numeric speech supports 15 languages.

## Quick Start

1. Initialize and select the runtime-number language.
2. Optionally set prompt voice, volume and speed.
3. Play a prompt, configured local audio or numeric variable; immediate mode interrupts, while queue mode waits.
4. Put follow-up work in the completion event, which dispatches from the Arduino loop.
