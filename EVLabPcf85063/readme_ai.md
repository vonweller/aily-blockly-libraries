# EVLab RTC Clock

EasyVoice 1306 Dev only: PCF85063 real-time clock on the default I2C bus

## Library Info
- **Name**: @aily-project/lib-evlab_pcf85063
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `evlabrtc_init` | Statement | VAR(field_input) | `evlabrtc_init("rtc")` | `if (!rtc.begin()) { ↵ Serial.println("实时时钟初始化失败，未在地址 0x51 找到 PCF85063"); ↵ }` |
| `evlabrtc_set_time` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MIN(input_value), SEC(input_value) | `evlabrtc_set_time($rtc, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `rtc.setTime(1, 1, 1, 1, 1, 1);` |
| `evlabrtc_set_compile_time` | Statement | VAR(field_variable) | `evlabrtc_set_compile_time($rtc)` | `rtc.setCompileTime();` |
| `evlabrtc_read` | Statement | VAR(field_variable) | `evlabrtc_read($rtc)` | `rtc.read();` |
| `evlabrtc_get` | Value | VAR(field_variable), FIELD(dropdown) | `evlabrtc_get($rtc, year)` | `rtc.year()` |
| `evlabrtc_format` | Value | VAR(field_variable), FMT(dropdown) | `evlabrtc_format($rtc, datetime)` | `rtc.datetime()` |
| `evlabrtc_lost_power` | Value | VAR(field_variable) | `evlabrtc_lost_power($rtc)` | `rtc.lostPower()` |
| `evlabrtc_present` | Value | VAR(field_variable) | `evlabrtc_present($rtc)` | `rtc.present()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | year, month, day, hour, minute, second, weekday | evlabrtc_get |
| FMT | datetime, dateText, timeText | evlabrtc_format |

## ABS Examples

### Basic Usage
```
arduino_setup()
    evlabrtc_init("rtc")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, evlabrtc_get($rtc, year))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `evlabrtc_init` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
