# Chinese Almanac (lib-huangli)

Solar date to traditional Chinese almanac strings: lunar month-day (leap month), ganzhi year (zodiac), day pillar, twelve day officers, tongshu Yi/Ji lists (51wnl wording), solar terms.

## Library Info

- **Name**: @aily-project/lib-huangli
- **Version**: 1.4.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `huangli_lunar` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_lunar(math_number(1), math_number(1), math_number(1))` | `huangliLunar(1, 1, 1)` |
| `huangli_ganzhi` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_ganzhi(math_number(1), math_number(1), math_number(1))` | `huangliGanzhiYear(1, 1, 1)` |
| `huangli_day_ganzhi` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_day_ganzhi(math_number(1), math_number(1), math_number(1))` | `huangliDayGanzhi(1, 1, 1)` |
| `huangli_zhishen` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_zhishen(math_number(1), math_number(1), math_number(1))` | `huangliZhishen(1, 1, 1)` |
| `huangli_yi` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_yi(math_number(1), math_number(1), math_number(1))` | `huangliYi(1, 1, 1)` |
| `huangli_ji` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_ji(math_number(1), math_number(1), math_number(1))` | `huangliJi(1, 1, 1)` |
| `huangli_yi_line` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value), LINE(dropdown) | `huangli_yi_line(math_number(1), math_number(1), math_number(1), L1)` | `huangliYiLine(1, 1, 1, 1)` |
| `huangli_ji_line` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value), LINE(dropdown) | `huangli_ji_line(math_number(1), math_number(1), math_number(1), L1)` | `huangliJiLine(1, 1, 1, 1)` |
| `huangli_jieqi` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_jieqi(math_number(1), math_number(1), math_number(1))` | `huangliJieqi(1, 1, 1)` |
| `huangli_font` | Statement | SIZE(dropdown) | `huangli_font(S12)` | `huangliSetFontFull(false);` |
| `huangli_center_x` | Value (Number) | TEXT(input_value) | `huangli_center_x(text("value"))` | `huangliCenterX("value")` |
| `huangli_month_ganzhi` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_month_ganzhi(math_number(1), math_number(1), math_number(1))` | `huangliMonthGanzhi(1, 1, 1)` |
| `huangli_huangdao` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_huangdao(math_number(1), math_number(1), math_number(1))` | `huangliHuangdao(1, 1, 1)` |
| `huangli_nayin` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_nayin(math_number(1), math_number(1), math_number(1))` | `huangliNayin(1, 1, 1)` |
| `huangli_chongsha` | Value (String) | YEAR(input_value), MONTH(input_value), DAY(input_value) | `huangli_chongsha(math_number(1), math_number(1), math_number(1))` | `huangliChongsha(1, 1, 1)` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| SIZE | S12, S16 | huangli_font: full GB2312 font, 12px / 16px |
| LINE | L1, L2 | huangli_yi_line / huangli_ji_line: wrapped line 1 / 2 |
| TEXT | string | huangli_center_x input (pixel width measured with the current font) |

YEAR/MONTH/DAY are numeric solar-date inputs (MONTH 1-12).

## ABS Examples

```abs
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, string_add_string(text("农历"), huangli_lunar(math_number(2026), math_number(9), math_number(3))))
    serial_println(Serial, huangli_ganzhi(math_number(2026), math_number(9), math_number(3)))
    serial_println(Serial, huangli_yi(math_number(2026), math_number(9), math_number(3)))
    serial_println(Serial, huangli_jieqi(math_number(2026), math_number(9), math_number(3)))
    time_delay(math_number(60000))
```

## Notes

1. **No dependencies**: pure computation, no init block, no hardware or network access. Generated C++ uses free functions (not objects); the include is `#include "Huangli.h"`.
2. **Sample outputs (2026-09-03)**: `huangli_lunar` → "七月廿二"; `huangli_ganzhi` → "丙午(马)年"; `huangli_day_ganzhi` → "庚辰日"; `huangli_zhishen` → "成日"; `huangli_yi` → "结婚、搬家、签订合同、交易、搬新房、开业、动土、祈福、安床、造车器、祭祀、修造、治病、安香、除虫、结网、开光、普渡、斋醮、打猎"; `huangli_ji` → "合婚订婚、订盟、买车、安葬、行丧、探病"; `huangli_jieqi` → "白露 9月7日" (returns "今日白露" on the term day itself).
3. **Tongshu Yi/Ji source (v1.4.0)**: `huangli_yi`/`huangli_ji` return tongshu lists aligned item-by-item with 51wnl (mobile.51wnl-cq.com), using its modern wording (19 synonym mappings such as 嫁娶→结婚). Data is pre-generated offline, self-checked per day, and stored in `src/Huangli/HuangliYiJiData.h` (PROGMEM, ~148KB), covering 2026-01-01 through 2045-12-31. Outside that range a simplified day-officer version is returned. Rare entries never seen in 51wnl samples keep the classic wording and may differ from its modern labels.
4. **Valid ranges**: lunar / ganzhi year / day ganzhi 1900-2100; solar terms, day officers, Yi/Ji 2000-2070 (Meeus solar-longitude series, UTC+8, minute-level accuracy). Out-of-range results return "--".
5. **Leap month**: `huangli_lunar` prefixes "闰" (e.g. "闰六月初一"); `huangli_ganzhi` switches the year at lunar new year.
6. **Extended items (2026-09-03)**: `huangli_month_ganzhi` → "丙申月"; `huangli_huangdao` → "金匮"; `huangli_nayin` → "白腊金"; `huangli_chongsha` → "冲狗煞南". Matches mainstream almanacs (e.g. the 51wnl page for 2026-09-03).
7. **Folk disclaimer**: Yi/Ji are traditional tongshu content with regional variations; entertainment reference only.
8. **Font compatibility**: outputs contain GB2312 level-2 characters (廿, 祀). The gxepd2 `wqy*_t_gb2312a` block fonts cover level-1 only and leave these blank; call `huangli_font(S12/S16)` first to switch to the full `u8g2_font_wqy12/16_t_gb2312`, then switch back with `gxepd2_u8g2_font` when done. The block uses the sketch's `u8g2Fonts` global (created by `gxepd2_u8g2_begin`); extra flash ~208KB (12px) / ~318KB (16px).
9. **`huangli_center_x`**: returns the X coordinate that centers TEXT on a 250px-wide display, measured with the current u8g2 font (`getUTF8Width`), exact for mixed ASCII/CJK text. Set the target drawing font before taking the value.
10. **`huangli_yi_line`/`huangli_ji_line`**: split the Yi/Ji list into at most two lines with the current u8g2 font (line widths ≤224px/244px for a 250px panel: line 1 starts at x=26, line 2 at x=6), appending "…" at the end of line 2 on overflow. Like `huangli_center_x` they depend on the sketch's `u8g2Fonts` global and require `huangli_font(S12)` first.
