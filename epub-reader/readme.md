# EPUB Reader

## Description

ESP32 Blockly library for reading EPUB ebooks from an SD card on a TFT display. It provides EPUB/ZIP parsing, pagination, chapters, saved positions, SD fonts, bookshelf and file-browser UIs, covers, inline images, and progressive JPEG viewing.

## Library Info

| Package | Version | Author |
| --- | --- | --- |
| `@aily-project/lib-epub-reader` | 1.0.1 | Bryan |

## Supported Boards

ESP32 (`esp32:esp32`). PSRAM is strongly recommended for covers and image decoding. The project must provide an initialized TFT_eSPI-compatible `tft` object and a configured SD card.

## Quick Start

1. Put `.epub` files on the SD card, such as under `/books`.
2. Initialize the TFT, then use `EPUB initialize SD card (SdFat)`.
3. Scan the directory or open a known path with the desired columns and rows.
4. Show the reading page and connect input events to page, chapter, TOC, browser, or image blocks.

Close the reader or JPEG viewer when leaving its screen to release temporary image buffers.
