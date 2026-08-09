# ggwave

Encode and decode short data messages as audible or ultrasonic waveforms.

## Library Info
- **Name**: @aily-project/lib-ggwave
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ggwave_init` | Statement | VAR(field_input), MODE(dropdown), RATE(input_value), FRAME(input_value), PAYLOAD(input_value) | `ggwave_init("ggwave", GGWAVE_OPERATING_MODE_RX_AND_TX, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ggwave_encode` | Statement | VAR(field_variable), TEXT(input_value), PROTOCOL(dropdown), VOLUME(input_value) | `ggwave_encode(variables_get($ggwave), text("value"), GGWAVE_PROTOCOL_AUDIBLE_NORMAL, math_number(0))` | {\n String _ailyGgText = String( |
| `ggwave_waveform` | Value | VAR(field_variable), DATA(dropdown) | `ggwave_waveform(variables_get($ggwave), waveform)` | Dynamic code |
| `ggwave_decode` | Value | VAR(field_variable), BUFFER(field_input), BYTES(input_value) | `ggwave_decode(variables_get($ggwave), "audioBuffer", math_number(0))` | Dynamic code |
| `ggwave_decoded` | Value | VAR(field_variable), DATA(dropdown) | `ggwave_decoded(variables_get($ggwave), text)` | Dynamic code |
| `ggwave_free` | Statement | VAR(field_variable) | `ggwave_free(variables_get($ggwave))` | ggwave_free( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | GGWAVE_OPERATING_MODE_RX_AND_TX, GGWAVE_OPERATING_MODE_TX, GGWAVE_OPERATING_MODE_RX | ggwave_init |
| PROTOCOL | GGWAVE_PROTOCOL_AUDIBLE_NORMAL, GGWAVE_PROTOCOL_AUDIBLE_FAST, GGWAVE_PROTOCOL_AUDIBLE_FASTEST, GGWAVE_PROTOCOL_ULTRASOUND_NORMAL, GGWAVE_PROTOCOL_ULTRASOUND_FAST, GGWAVE_PROTOCOL_ULTRASOUND_FASTEST, GGWAVE_PROTOCOL_DT... | ggwave_encode |
| DATA | waveform, bytes | ggwave_waveform |
| DATA | text, length | ggwave_decoded |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ggwave_init("ggwave", GGWAVE_OPERATING_MODE_RX_AND_TX, math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ggwave_waveform(variables_get($ggwave), waveform))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ggwave_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
