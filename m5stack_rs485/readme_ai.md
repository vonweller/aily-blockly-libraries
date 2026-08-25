# M5Stack Onboard RS485

## Library Info
- **Name**: @aily-project/lib-m5stack-rs485
- **Version**: 0.1.0

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5stack_rs485_init` | Statement | `m5stack_rs485_init(math_number(115200))` |
| `m5stack_rs485_available` | Number | `m5stack_rs485_available()` |
| `m5stack_rs485_read_byte` | Number | `m5stack_rs485_read_byte()` |
| `m5stack_rs485_read_line` | String | `m5stack_rs485_read_line()` |
| `m5stack_rs485_write_text` | Boolean | `m5stack_rs485_write_text(text("Hello"), TRUE)` |
| `m5stack_rs485_write_byte` | Boolean | `m5stack_rs485_write_byte(math_number(0))` |

The generator uses board-specific official pin maps and controls DIR only where the hardware requires it.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `m5stack_rs485_init` | Statement | BAUD(input_value) | `m5stack_rs485_init(math_number(9600))` | `HardwareSerial& ailyM5RS485 = Serial; ↵ pinMode(2, OUTPUT); ↵ digitalWrite(2, LOW); ↵ ailyM5RS485.begin(1, SERIAL_8N1, 3, 1); ↵ ailyM5RS485.setTimeout(20); ↵ const int8_t ailyM5RS485Dir = 2; ↵ void ailyM5RS485Direction(bool sending) { ↵ if (ailyM5RS485Dir >= 0) { digitalWrite(ailyM5RS485Dir, sending ? HIGH : LOW); delayMicroseconds(100); } ↵ }` |
| `m5stack_rs485_available` | Value | (none) | `m5stack_rs485_available()` | `ailyM5RS485.available()` |
| `m5stack_rs485_read_byte` | Value | (none) | `m5stack_rs485_read_byte()` | `ailyM5RS485.read()` |
| `m5stack_rs485_read_line` | Value | (none) | `m5stack_rs485_read_line()` | `ailyM5RS485ReadLine()` |
| `m5stack_rs485_write_text` | Value | TEXT(input_value), NEWLINE(field_checkbox) | `m5stack_rs485_write_text(text("value"), TRUE)` | `ailyM5RS485WriteText(String(1), true)` |
| `m5stack_rs485_write_byte` | Value | VALUE(input_value) | `m5stack_rs485_write_byte(math_number(0))` | `ailyM5RS485WriteByte((uint8_t)(1))` |
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    m5stack_rs485_init(math_number(9600))
```
