# ChipIntelliIR

Raw infrared, NEC and air-conditioner control blocks for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-ir` |
| Version | 1.0.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK/database terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`). Defaults: TX 2, RX 4, TIMER2.

## Description

Supports fixed-38-kHz raw I/O, standard and extended NEC, and the official 36-brand air-conditioner database and search.

## Quick Start

Raw and air-conditioner modes are mutually exclusive per boot. Air mode also requires the bundled `[50000]ir_data_2024_08_16.bin` in project `recursos/user_file_entries/`.
