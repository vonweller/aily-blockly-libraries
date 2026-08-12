# M5Stack Onboard Infrared

## Library Info
- **Name**: @aily-project/lib-m5stack-ir
- **Version**: 0.1.0
- **Bundled runtime**: Arduino-IRremote 4.7.0 source in `src.7z`; no additional IR library package is required

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5stack_ir_init` | Statement | `m5stack_ir_init()` |
| `m5stack_ir_send` | Statement | `m5stack_ir_send(NEC, math_number(0), math_number(52), math_number(0))` |
| `m5stack_ir_send_repeat_frame` | Statement | `m5stack_ir_send_repeat_frame(NEC)` |
| `m5stack_ir_send_pronto` | Value Boolean | `m5stack_ir_send_pronto(text("0000 006D 0001 0000 015B 0057"), math_number(0))` |
| `m5stack_ir_send_raw` | Value Boolean | `m5stack_ir_send_raw(text("9000,4500,560,560"), math_number(38))` |
| `m5stack_ir_send_raw_repeat` | Value Boolean | `m5stack_ir_send_raw_repeat(text("9000,4500,560,560"), math_number(38), math_number(110), math_number(1))` |
| `m5stack_ir_send_pulse_distance` | Statement | Custom carrier, header, mark/space timing, data, bit order, frame period, and repeats |
| `m5stack_ir_send_biphase` | Statement | Custom carrier frequency, time unit, data, bit count, and optional start bit |

`m5stack_ir_send` supports all 23 address/command protocols handled by Arduino-IRremote `IRsend::write`. Pins are selected from `window.boardConfig` and fixed to the official onboard wiring. Raw blocks accept up to 256 positive microsecond durations separated by commas, semicolons, or whitespace. Pronto input is validated and normalized before it reaches Arduino-IRremote. Receiver blocks are not provided because the supported devices expose an onboard transmitter only.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `m5stack_ir_init` | Statement | (none) | `m5stack_ir_init()` | `IrSender.begin(-1, DISABLE_LED_FEEDBACK);` |
| `m5stack_ir_send` | Statement | PROTOCOL(dropdown), ADDRESS(input_value), COMMAND(input_value), REPEATS(input_value) | `m5stack_ir_send(NEC, math_number(0), math_number(0), math_number(0))` | `IrSender.write(NEC, (uint16_t)(1), (uint16_t)(1), (int_fast8_t)constrain((int)(1), -1, 127));` |
| `m5stack_ir_send_repeat_frame` | Statement | PROTOCOL(dropdown) | `m5stack_ir_send_repeat_frame(NEC)` | `IrSender.sendNECRepeat();` |
| `m5stack_ir_send_pronto` | Value | CODE(input_value), REPEATS(input_value) | `m5stack_ir_send_pronto(text("value"), math_number(0))` | `ailyM5IRSendPronto(String("value"), 1)` |
| `m5stack_ir_send_raw` | Value | DATA(input_value), FREQUENCY(input_value) | `m5stack_ir_send_raw(text("value"), math_number(0))` | `ailyM5IRSendRaw(String("value"), 1, 0, 0)` |
| `m5stack_ir_send_raw_repeat` | Value | DATA(input_value), FREQUENCY(input_value), PERIOD(input_value), REPEATS(input_value) | `m5stack_ir_send_raw_repeat(text("value"), math_number(0), math_number(0), math_number(0))` | `ailyM5IRSendRaw(String("value"), 1, 1, 1)` |
| `m5stack_ir_send_pulse_distance` | Statement | FREQUENCY(input_value), HEADER_MARK(input_value), HEADER_SPACE(input_value), ONE_MARK(input_value), ONE_SPACE(input_value), ZERO_MARK(input_value), ZERO_SPACE(input_value), DATA(input_value), BITS(input_value), ORDER(dropdown), PERIOD(input_value), REPEATS(input_value) | `m5stack_ir_send_pulse_distance(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), LSB, math_number(0), math_number(0))` | `IrSender.sendPulseDistanceWidth((uint8_t)constrain((int)(1), 20, 60), (uint16_t)(1), (uint16_t)(1), (uint16_t)(1), (uint16_t)(1), (uint16_t)(1), (uint16_t)(1), (IRDecodedRawDataType)(1), (uint8_t)constrain((int)(1), 1, (int)(sizeof(IRDecodedRawDataType) * 8)), PROTOCOL_IS_LSB_FIRST, (uint16_t)constrain((int)(1), 0, 65535), (int_fast8_t)constrain((int)(1), 0, 127));` |
| `m5stack_ir_send_biphase` | Statement | FREQUENCY(input_value), TIME_UNIT(input_value), DATA(input_value), BITS(input_value), START_BIT(field_checkbox) | `m5stack_ir_send_biphase(math_number(0), math_number(1000), math_number(0), math_number(0), TRUE)` | `IrSender.enableIROut((uint8_t)constrain((int)(1), 20, 60)); ↵ IrSender.sendBiphaseData((uint16_t)(1), (uint32_t)(1), (uint8_t)constrain((int)(1), 1, 32), true);` |
## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PROTOCOL | NEC, NEC2, SAMSUNG, SAMSUNG48, SAMSUNGLG, SONY, PANASONIC, DENON, SHARP, LG, JVC, RC5, RC6, KASEIKYO_JVC, KASEIKYO_DENON, KASEIKYO_SHARP, KASEIKYO_MITSUBISHI, ONKYO, APPLE, BOSEWAVE, FAST, LEGO_PF, OPENLASIR | m5stack_ir_send |
| PROTOCOL | NEC, LG, SAMSUNGLG, OPENLASIR | m5stack_ir_send_repeat_frame |
| ORDER | LSB, MSB | m5stack_ir_send_pulse_distance |

## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    m5stack_ir_init()
```
