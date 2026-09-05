# AK4493SEQ Audio DAC Library

AK4493SEQ 123dB 768kHz/32-bit Stereo Premium DAC driver via software I2C.

## Library Info
- **Name**: @aily-project/lib-ak4493seq
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ak4493seq_init` | Statement | SDA(dropdown), SCK(dropdown), CAD0(dropdown) | `ak4493seq_init(PB7, PB6, false)` | `ak4493.begin(PB7, PB6, false);` |
| `ak4493seq_set_volume` | Statement | VAR(field_variable), VOL(input_value) | `ak4493seq_set_volume($ak4493, math_number(255))` | `ak4493.setVolume(255);` |
| `ak4493seq_set_volume_percent` | Statement | VAR(field_variable), PERCENT(input_value) | `ak4493seq_set_volume_percent($ak4493, math_number(80))` | `ak4493.setVolumePercent(80);` |
| `ak4493seq_set_mute` | Statement | VAR(field_variable), MUTE(dropdown) | `ak4493seq_set_mute($ak4493, true)` | `ak4493.setMute(true);` |
| `ak4493seq_set_power` | Statement | VAR(field_variable), POWER(dropdown) | `ak4493seq_set_power($ak4493, true)` | `ak4493.setPower(true);` |
| `ak4493seq_set_reset` | Statement | VAR(field_variable), RST(dropdown) | `ak4493seq_set_reset($ak4493, true)` | `ak4493.setReset(true);` |
| `ak4493seq_set_filter` | Statement | VAR(field_variable), FILTER(dropdown) | `ak4493seq_set_filter($ak4493, 0)` | `ak4493.setFilter(AK4493SEQ_FILTER_SHARP);` |
| `ak4493seq_set_format` | Statement | VAR(field_variable), FMT(dropdown) | `ak4493seq_set_format($ak4493, 6)` | `ak4493.setFormat(AK4493SEQ_FMT_24BIT_I2S);` |
| `ak4493seq_set_deemphasis` | Statement | VAR(field_variable), DEM(dropdown) | `ak4493seq_set_deemphasis($ak4493, 1)` | `ak4493.setDeemphasis(AK4493SEQ_DEEM_OFF);` |
| `ak4493seq_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `ak4493seq_set_gain($ak4493, 0)` | `ak4493.setGain(AK4493SEQ_GAIN_2_8VPP);` |
| `ak4493seq_set_att_speed` | Statement | VAR(field_variable), ATS(dropdown) | `ak4493seq_set_att_speed($ak4493, 0)` | `ak4493.setATTSpeed(0);` |
| `ak4493seq_write_reg` | Statement | VAR(field_variable), REG(input_value), VAL(input_value) | `ak4493seq_write_reg($ak4493, math_number(0), math_number(14))` | `ak4493.writeReg(0x00, 0x0E);` |
| `ak4493seq_read_reg` | Value | VAR(field_variable), REG(input_value) | `ak4493seq_read_reg($ak4493, math_number(0))` | `ak4493.readReg(0x00)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CAD0 | false, true | I2C address bit: Low=0x20, High=0x22 |
| MUTE | true, false | true=ON(mute), false=OFF |
| POWER | true, false | true=ON, false=OFF |
| RST | true, false | true=Release, false=Assert(reset) |
| FILTER | 0-6 | 0=Sharp, 1=Slow, 2=ShortSharp, 3=ShortSlow, 4=SuperSlow, 6=LowDispersion |
| FMT | 0,4,5,6,7 | 0=16bitLSB, 4=24bitLSB, 5=32bitLSB, 6=24bitI2S, 7=32bitI2S |
| DEM | 0,1,2,3 | 0=44.1k, 1=OFF, 2=48k, 3=32k |
| GAIN | 0,2,3,4,6 | 0=2.8Vpp, 2=2.5Vpp, 3=1.6Vpp, 4=2.2Vpp, 6=1.9Vpp |
| ATS | 0,1,2,3 | Volume transition speed: 0=4080/fs ... 3=255/fs |
| VOL | 0-255 | 0=MUTE, 255=0dB, 0.5dB/step |

## ABS Examples

### Basic Usage
```abs
arduino_setup()
    ak4493seq_init(PB7, PB6, false)
    ak4493seq_set_filter($ak4493, 2)
    ak4493seq_set_format($ak4493, 6)
    ak4493seq_set_volume_percent($ak4493, math_number(80))
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, text("AK4493SEQ running"))
    time_delay(math_number(1000))
```

## Notes

1. **Init block**: Auto-creates global `AK4493SEQ ak4493;` object. The init block uses SDA/SCK dropdown from board digital pins.
2. **Software I2C**: Uses GPIO bit-banging, not hardware I2C. SDA uses open-drain mode.
3. **Volume**: `set_volume(255)` = 0dB (max), `set_volume(0)` = MUTE. Use `set_volume_percent` for intuitive 0-100% control.
4. **Register map**: 0x00-0x15 (22 registers). See AK4493SEQ datasheet for details.
