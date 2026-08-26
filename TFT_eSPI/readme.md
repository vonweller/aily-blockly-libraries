# TFT_eSPI

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tft-espi |
| Version | 2.5.53 |
| Author | ailyProject |
| Source | https://github.com/Bodmer/TFT_eSPI |
| License | Original license |

## Supported Boards

ESP32, RP2040, STMicroelectronics:stm32, adafruit:samd, Seeeduino:samd, adafruit:nrf52

## Description

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Quick Start

1. Enable `@aily-project/lib-tft-espi` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Static Images

Upload PNG, JPEG, WebP, or BMP images and convert them to RGB565 or RGB332 pixel data. Images are embedded in `PROGMEM` and rendered at the selected coordinates with `pushImage()`. The source image is retained by the editor so changing width, height, or colour format always reconverts from the original file.

Image pixels and drawing primitives use the same standard RGB channel layout. Select `TFT_RGB` or `TFT_BGR` in the setup block to match the panel; the controller colour-order setting applies consistently to fills, text, images, and animations.

If red and blue are reversed, change the setup block's colour order rather than enabling display inversion or changing the image byte-swap setting.

## GIF and MP4 Animation

Upload GIF or MP4 in the animation field and choose RGB565 for higher colour fidelity or RGB332 for roughly twice the frame capacity. The generated `PROGMEM` frames are rendered through the matching `pushImage()` overload automatically. Blocking, non-blocking, looped, and selected-frame playback are supported. Keep clips short; MP4 audio is ignored.
