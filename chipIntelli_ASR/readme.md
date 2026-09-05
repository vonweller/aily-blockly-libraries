# ChipIntelliASR

Offline wake-word, command and semantic recognition for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-asr` |
| Version | 2.3.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`) at 3.3 V.

## Description

Supports multiple wake words, command/semantic handlers, result access, queue diagnostics, AEC and barge-in status. Event blocks register setup callbacks and add non-blocking `tick()` processing; polling is available as an alternative.

## Quick Start

1. Initialize, then add wake words.
2. Use either events or `read_results`; both consume the same queue.
3. Put `keep_awake_for` in a wake handler to extend a session. Its editable toolbox input starts at 15 seconds; omitting the block leaves the SDK/firmware default unchanged.
