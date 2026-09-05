# Arduino SD Card

Blockly support for Arduino SD 1.3.0, including SPI initialization and typed `File` operations.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-arduino-sd |
| Version | 1.0.0 |
| Author | Arduino |
| Source | https://docs.arduino.cc/libraries/sd/ |
| License | GPL-3.0 (upstream library) |

## Supported Boards

Arduino-compatible boards with SPI and the Arduino SD library.

## Description

Includes initialization, path management, directory iteration, byte I/O, printing, seek, flush, and close.

`FILE_WRITE` appends at the end of an existing file. To overwrite a file, remove it before opening it with `FILE_WRITE`.

## Quick Start

1. Enable `@aily-project/lib-arduino-sd` in Aily Blockly.
2. Add an SD initialization block and select the module's CS pin.
3. Open a path into a `File` variable.
4. Check it opened, read or write it, then close it.
