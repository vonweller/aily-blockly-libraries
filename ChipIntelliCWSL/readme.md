# ChipIntelliCWSL

Command- and wake-word self-learning blocks for ChipIntelli CI1302, CI1303 and CI1306.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-cwsl` |
| Version | 1.0.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`).

## Description

Asynchronously learns words, deletes persistent templates, reports capacity, and safely polls learning, deletion and recognition events.

## Quick Start

Select a CWSL algorithm profile, initialize the service, then start learning and poll events from loop. CI1302 CWSL flash space is very tight; include only features the project uses.
