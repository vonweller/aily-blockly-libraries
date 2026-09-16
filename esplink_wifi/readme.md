# ESPLink WiFi

WiFi, TCP, UDP and TLS for boards without radio, through an ESP32-C3 coprocessor.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-esplink-wifi |
| Version | 1.0.0 |
| Author | ESPLink contributors |
| Source | https://github.com/coloz/arduino-ci130x |
| License | MIT |

## Supported Boards

CI1306 (chipintelli:ci13xx:ci1306) and STM32 (STMicroelectronics:stm32) hosts with a spare hardware UART and enough free RAM.

## Description

TCP/IP, DNS and TLS run on the ESP32-C3; the host keeps the familiar Arduino objects. Covers station and AP modes, scanning, events, TCP client/server, UDP, HTTPS with certificate validation, and one-block HTTP requests.

## Quick Start

1. Host TX to C3 RX, host RX to C3 TX, common GND (3.3V signals).
2. Drop in "quick connect WiFi" with your SSID and password; the link starts by itself at 921600 baud.
3. Read an address with the WiFi info block, then use a TCP client or an HTTP request block.
