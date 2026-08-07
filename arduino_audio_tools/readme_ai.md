# Arduino Audio Tools

Composable I2S audio streams, sample IO, and stream copy pipelines.

## Library Info
- **Name**: @aily-project/lib-arduino-audio-tools
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `audio_tools_i2s_init` | Statement | VAR(field_input), MODE(dropdown), RATE(input_value), CHANNELS(input_value), BITS(input_value), BCLK(dropdown), WS(dropdown), TX(dropdown), RX(dropdown) | `audio_tools_i2s_init("i2sAudio", TX_MODE, math_number(0), math_number(0), math_number(0), BCLK, WS, TX, RX)` | Dynamic code |
| `audio_tools_copy_init` | Statement | VAR(field_input), OUT(field_variable), IN(field_variable), AUTO(field_checkbox) | `audio_tools_copy_init("audioCopier", variables_get($i2sOut), variables_get($i2sIn), TRUE)` | Dynamic code |
| `audio_tools_copy` | Statement | VAR(field_variable) | `audio_tools_copy(variables_get($audioCopier))` | Dynamic code |
| `audio_tools_write_sample` | Statement | VAR(field_variable), SAMPLE(input_value) | `audio_tools_write_sample(variables_get($i2sAudio), math_number(0))` | _ailyAudioSampleOut = (int16_t)( |
| `audio_tools_read_sample` | Value | VAR(field_variable) | `audio_tools_read_sample(variables_get($i2sAudio))` | Dynamic code |
| `audio_tools_available` | Value | VAR(field_variable) | `audio_tools_available(variables_get($i2sAudio))` | Dynamic code |
| `audio_tools_end` | Statement | VAR(field_variable) | `audio_tools_end(variables_get($i2sAudio))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | TX_MODE, RX_MODE, RXTX_MODE | audio_tools_i2s_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    audio_tools_i2s_init("i2sAudio", TX_MODE, math_number(0), math_number(0), math_number(0), BCLK, WS, TX, RX)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, audio_tools_read_sample(variables_get($i2sAudio)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `audio_tools_i2s_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
