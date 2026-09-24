# Xiaozhi AI

Voice chat, activation and MCP for ESP32-S3.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-xiaozhi |
| Version | 1.0.0 |
| Author | Shenzhen Xinzhi Future Technology Co., Ltd., Project Contributors |
| Source | [Xiaozhi](https://github.com/78/xiaozhi-esp32); Arduino 2.4.0 |
| License | MIT; bundled dependencies retain their licenses |

## Supported Boards

ESP32 Core 3.x; audio requires ESP32-S3, suitable PSRAM and a large app partition.

## Description

53 blocks for ES8311/I2S/PDM audio, events and MCP.

## Quick Start

Requires **ESP32 WiFi** (@aily-project/lib-esp32-wifi ^1.0.3). In setup, select audio, configure WiFi STA/auto-reconnect, connect with esp32_wifi_begin, then start Xiaozhi. Startup waits for WiFi. Read the activation code in its event. All blocks share one client. The legacy WiFi shortcut remains compatible.

See [ABS examples and wiring notes](readme_ai.md). Hardware testing is pending.
