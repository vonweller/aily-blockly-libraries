# CI13XX SD Card

Access FAT16/FAT32 SD cards through the CI13XX GPIO software SPI bus.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-chipintelli-sd |
| Version | 1.0.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | https://github.com/coloz/arduino-ci130x/tree/main/libraries/SD |
| License | GPL-3.0-or-later |

## Supported Boards

CI1302, CI1303, CI1306, CI-D06GT01D, and easyVoice 1306 variants. Use 3.3V only.

## Description

Supports configurable GPIO software-SPI pins, initialization diagnostics, FAT16/FAT32 files, and 8.3-name directory traversal. Software SPI has no DMA.

## Quick Start

1. Connect SD to the variant's `SCK`, `MISO`, `MOSI`, `SS`, 3.3V, and GND.
2. Configure `SCK`, `MISO`, `MOSI`, and `CS` in the automatic initialization block.
3. Open a path into a `File`, check it opened, read or write, then close it.
4. `FILE_WRITE` appends; remove an existing file before overwriting it.
