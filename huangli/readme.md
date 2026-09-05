# Chinese Almanac (lib-huangli)

Solar date to traditional Chinese almanac strings, fully offline.

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-huangli |
| Version | 1.4.0 |
| Author | Bryan |
| Source | local-libraries |
| License | MIT |

## Supported Boards

Any board with Arduino String support; no peripherals. Solar-term/day-officer tables cover 2000-2070; Yi/Ji tables cover 2026-2045 (~148KB flash, ESP32 recommended).

## Description

Feed year/month/day into value blocks to get the lunar date (leap-month prefixed), ganzhi year with zodiac, day pillar, twelve day officers, tongshu Yi/Ji lists aligned with 51wnl (with wrapped-line variants), and the current or next solar term. Terms use an offline Meeus series (UTC+8, minute-level).

## Quick Start

1. No init block; wire year/month/day values into a read block.
2. Typical chain: NTP time blocks -> almanac -> u8g2/serial output.
3. Yi/Ji are folk reference only; outside 2026-2045 a simpler list is returned.
