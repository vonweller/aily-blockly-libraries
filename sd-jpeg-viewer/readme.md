# Image Viewer

JPEG/BMP image viewer for SD cards on TFT screens.

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-sd-jpeg-viewer |
| Version | 1.2.10 |
| Author | Bryan |
| License | UNLICENSED |

## Supported Boards

- ESP32 series (requires a TFT_eSPI screen and an SD card)

## Description

Opens JPEG (baseline/progressive) and BMP images from the SD card and renders them full-frame in one screen push. Supports paging with auto-numbered multi-image browsing, grid zoom with panning, reading-direction toggle, spread splitting, margin cropping, and snap scrolling.

## Quick Start

1. Initialize the screen and SD card (for example `tftscr_init`, `xueersi_esp32_sd_init`);
2. Call `sd_jpg_viewer_open` with an image path; it returns whether viewing started;
3. Page with `sd_jpg_viewer_next` / `sd_jpg_viewer_prev`, then release memory with `sd_jpg_viewer_exit`.
