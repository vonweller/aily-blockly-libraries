# Advanced GPIO

## Library Info

- Package: `@aily-project/lib-esp32-gpio`; version: 1.0.0; license: MIT.
- Platform: `esp32:esp32`, Arduino-ESP32 **3.x or newer**, 3.3 V logic. No external source archive or Arduino dependency. Arduino-ESP32 2.x LEDC channel APIs are intentionally unsupported.
- Purpose: advanced pin features beyond `core-io`: touch, calibrated ADC voltage, averaging, DAC, LEDC PWM, interrupts, pulls, drive strength, hold and sleep wake sources.
- Use `core-io` for ordinary digital reads/writes and raw ADC reads, `esp32_sleep` to enter sleep, and dedicated bus/encoder libraries for I2C/SPI/UART, RMT protocols and pulse counting. This library does not expose every low-level ESP-IDF register or peripheral configuration.
- Chinese UI name: 高级GPIO. All types start with `esp32_gpio_`.

## Quick Selection

| Need | Recommended blocks | Setup needed |
|---|---|---|
| Touch button | `touch_calibrate` then `touch_pressed` (add the type prefix) | Calibrate once, electrode untouched |
| Inspect touch readings | `esp32_gpio_touch_read` | (none) |
| Voltage input | `esp32_gpio_adc_mv` or `esp32_gpio_adc_average` | Optional resolution/attenuation |
| True analog voltage | `esp32_gpio_dac_voltage` with `esp32_gpio_dac_pin` | None; only ESP32/S2 |
| LED brightness | `esp32_gpio_pwm_quick` | Automatic 1000 Hz, 8-bit |
| Precise PWM | `esp32_gpio_pwm_attach`, then `pwm_percent`/`pwm_write` with the prefix | Attach once in setup |
| Button events | `esp32_gpio_pin_mode`, `esp32_gpio_interrupt` | Set input mode; register once |
| Low-power pin state | `esp32_gpio_hold`, `esp32_gpio_deep_hold` | Set mode and level before holding |

## Chip and Pin Compatibility

| Chip | Touch | DAC channels 1 / 2 | ADC guidance |
|---|---|---|---|
| ESP32 | GPIO 0, 2, 4, 12–15, 27, 32, 33; touched values decrease | GPIO25 / GPIO26 | ADC1 is GPIO32–39; prefer it with Wi-Fi |
| ESP32-S2 | GPIO1–14; touched values increase | GPIO17 / GPIO18 | Choose an exposed ADC pin from the board definition |
| ESP32-S3 | GPIO1–14; touched values increase | (none) | Choose an exposed ADC pin from the board definition |
| ESP32-C3/C6/H2 | (none) | None | ADC and PWM depend on the selected board pinout |
| ESP32-P4 | Touch v3, values increase; consult board pinout | (none) | Consult board pinout |

Touch/DAC blocks on unsupported chips produce an explicit compile error, without preventing unrelated GPIO/PWM/ADC blocks from being used. GPIO4 is a touch example for ESP32/S2/S3, not a universal pin for every chip. ADC toolbox shadows use the board's analog-pin selector; examples below use classic ESP32 GPIO34. DAC toolbox shadows select a channel and automatically map it to the chip's pin. Board remapping is applied to direct ESP-IDF GPIO calls as well.

Only exposed, unused pins are available in practice. Flash/PSRAM, USB, UART, onboard devices and boot-strapping can reserve pins. Classic ESP32 GPIO34–39 are input-only and lack internal pull resistors. Never apply 5 V to a GPIO. Drive strength is a hardware capability level, not a current-regulated source. Open-drain HIGH releases the line; use a suitable external pull-up.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp32_gpio_touch_read` | Value (Number) | PIN(input_value) | `esp32_gpio_touch_read(math_number(4))` | `ailyGpioTouchRead(1)` |
| `esp32_gpio_touch_threshold` | Value (Boolean) | PIN(input_value), THRESHOLD(input_value) | `esp32_gpio_touch_threshold(math_number(4), math_number(40))` | `ailyGpioTouchThreshold(1, 1)` |
| `esp32_gpio_touch_calibrate` | Statement | PIN(input_value), SAMPLES(input_value) | `esp32_gpio_touch_calibrate(math_number(4), math_number(16))` | `ailyGpioTouchCalibrate(1, 1);` |
| `esp32_gpio_touch_pressed` | Value (Boolean) | PIN(input_value), PERCENT(input_value) | `esp32_gpio_touch_pressed(math_number(4), math_number(20))` | `ailyGpioTouchIsPressed(1, 1)` |
| `esp32_gpio_touch_baseline` | Value (Number) | PIN(input_value) | `esp32_gpio_touch_baseline(math_number(4))` | `ailyGpioTouchGetBaseline(1)` |
| `esp32_gpio_touch_cycles` | Statement | MEASURE(input_value), SLEEP(input_value) | `esp32_gpio_touch_cycles(math_number(4096), math_number(4096))` | `touchSetCycles((uint16_t)ailyGpioClamp(1, 1, 65535), (uint16_t)ailyGpioClamp(1, 1, 65535));` |
| `esp32_gpio_touch_timing` | Statement | MEASURE(input_value), SLEEP(input_value) | `esp32_gpio_touch_timing(math_number(500), math_number(1000))` | `touchSetTiming(ailyGpioClamp(1, 1, 1000000), (uint32_t)ailyGpioClamp(1, 1, 1000000));` |
| `esp32_gpio_touch_interrupt` | Statement | PIN(input_value), THRESHOLD(input_value), DO(input_statement) | `esp32_gpio_touch_interrupt(math_number(4), math_number(40))` | `ailyGpioTouchEventAttach(1, 1, ailyGpioCallback_67_65_6e_65_72_61_74_6f_72_2d_63_6f_76_65_72_61_67_65_2d_65_73_70_33_32_5f_67_70_69_6f_5f_74_6f_75_63_68_5f_69_6e_74_65_72_72_75_70_74);` |
| `esp32_gpio_touch_detach` | Statement | PIN(input_value) | `esp32_gpio_touch_detach(math_number(4))` | `ailyGpioTouchEventDetach(1);` |
| `esp32_gpio_touch_wakeup` | Statement | PIN(input_value), THRESHOLD(input_value) | `esp32_gpio_touch_wakeup(math_number(4), math_number(40))` | `ailyGpioTouchWakeup(1, 1);` |
| `esp32_gpio_adc_mv` | Value (Number) | PIN(input_value) | `esp32_gpio_adc_mv(math_number(34))` | `analogReadMilliVolts(1)` |
| `esp32_gpio_adc_average` | Value (Number) | PIN(input_value), SAMPLES(input_value), UNIT(dropdown) | `esp32_gpio_adc_average(math_number(34), math_number(16), MV)` | `ailyGpioAdcAverage(1, 1, true)` |
| `esp32_gpio_adc_resolution` | Statement | BITS(dropdown) | `esp32_gpio_adc_resolution(12)` | `analogReadResolution(12);` |
| `esp32_gpio_adc_attenuation` | Statement | ATTENUATION(dropdown) | `esp32_gpio_adc_attenuation(ADC_11db)` | `analogSetAttenuation(ADC_11db);` |
| `esp32_gpio_adc_pin_attenuation` | Statement | PIN(input_value), ATTENUATION(dropdown) | `esp32_gpio_adc_pin_attenuation(math_number(34), ADC_11db)` | `analogSetPinAttenuation(1, ADC_11db);` |
| `esp32_gpio_dac_pin` | Value (Number) | CHANNEL(dropdown) | `esp32_gpio_dac_pin(1)` | `ailyGpioDacPin(1)` |
| `esp32_gpio_dac_write` | Statement | PIN(input_value), VALUE(input_value) | `esp32_gpio_dac_write(esp32_gpio_dac_pin(1), math_number(128))` | `dacWrite(1, (uint8_t)ailyGpioClamp(1, 0, 255));` |
| `esp32_gpio_dac_voltage` | Statement | PIN(input_value), VOLTS(input_value) | `esp32_gpio_dac_voltage(esp32_gpio_dac_pin(1), math_number(1.65))` | `dacWrite(1, (uint8_t)(ailyGpioClamp(1, 0, 3.3) * 255.0 / 3.3 + 0.5));` |
| `esp32_gpio_dac_disable` | Statement | PIN(input_value) | `esp32_gpio_dac_disable(esp32_gpio_dac_pin(1))` | `dacDisable(1);` |
| `esp32_gpio_pwm_quick` | Statement | PIN(input_value), PERCENT(input_value) | `esp32_gpio_pwm_quick(math_number(4), math_number(50))` | `ailyGpioPwmPercent(1, 1, true);` |
| `esp32_gpio_pwm_attach` | Statement | PIN(input_value), FREQUENCY(input_value), BITS(input_value) | `esp32_gpio_pwm_attach(math_number(4), math_number(1000), math_number(8))` | `ailyGpioPwmAttach(1, 1, 1);` |
| `esp32_gpio_pwm_write` | Statement | PIN(input_value), DUTY(input_value) | `esp32_gpio_pwm_write(math_number(4), math_number(128))` | `ailyGpioPwmWrite(1, 1);` |
| `esp32_gpio_pwm_percent` | Statement | PIN(input_value), PERCENT(input_value) | `esp32_gpio_pwm_percent(math_number(4), math_number(50))` | `ailyGpioPwmPercent(1, 1, false);` |
| `esp32_gpio_pwm_read` | Value (Number) | PIN(input_value), WHAT(dropdown) | `esp32_gpio_pwm_read(math_number(4), DUTY)` | `ledcRead(1)` |
| `esp32_gpio_pwm_frequency` | Statement | PIN(input_value), FREQUENCY(input_value), BITS(input_value) | `esp32_gpio_pwm_frequency(math_number(4), math_number(2000), math_number(8))` | `ailyGpioPwmAttach(1, 1, 1);` |
| `esp32_gpio_pwm_tone` | Statement | PIN(input_value), FREQUENCY(input_value) | `esp32_gpio_pwm_tone(math_number(4), math_number(1000))` | `ailyGpioPwmTone(1, 1);` |
| `esp32_gpio_pwm_fade` | Statement | PIN(input_value), FROM(input_value), TO(input_value), MS(input_value) | `esp32_gpio_pwm_fade(math_number(4), math_number(0), math_number(100), math_number(1000))` | `ailyGpioPwmFade(1, 1, 1, 1);` |
| `esp32_gpio_pwm_invert` | Statement | PIN(input_value), INVERT(dropdown) | `esp32_gpio_pwm_invert(math_number(4), true)` | `ailyGpioPwmInvert(1, true);` |
| `esp32_gpio_pwm_detach` | Statement | PIN(input_value) | `esp32_gpio_pwm_detach(math_number(4))` | `ailyGpioPwmDetach(1);` |
| `esp32_gpio_pwm_ok` | Value (Boolean) | (none) | `esp32_gpio_pwm_ok()` | `ailyGpioPwmOK` |
| `esp32_gpio_pin_mode` | Statement | PIN(input_value), MODE(dropdown) | `esp32_gpio_pin_mode(math_number(4), INPUT_PULLDOWN)` | `pinMode(1, INPUT_PULLDOWN);` |
| `esp32_gpio_pull` | Statement | PIN(input_value), PULL(dropdown) | `esp32_gpio_pull(math_number(4), GPIO_PULLUP_ONLY)` | `gpio_set_pull_mode(ailyGpioNativePin(1), GPIO_PULLUP_ONLY);` |
| `esp32_gpio_drive` | Statement | PIN(input_value), STRENGTH(dropdown) | `esp32_gpio_drive(math_number(4), GPIO_DRIVE_CAP_2)` | `gpio_set_drive_capability(ailyGpioNativePin(1), GPIO_DRIVE_CAP_2);` |
| `esp32_gpio_hold` | Statement | PIN(input_value), ACTION(dropdown) | `esp32_gpio_hold(math_number(4), ENABLE)` | `gpio_hold_en(ailyGpioNativePin(1));` |
| `esp32_gpio_deep_hold` | Statement | ACTION(dropdown) | `esp32_gpio_deep_hold(ENABLE)` | `ailyGpioDeepHold(true);` |
| `esp32_gpio_wakeup` | Statement | PIN(input_value), LEVEL(dropdown) | `esp32_gpio_wakeup(math_number(4), GPIO_INTR_LOW_LEVEL)` | `if (gpio_wakeup_enable(ailyGpioNativePin(1), GPIO_INTR_LOW_LEVEL) == ESP_OK) { ↵ esp_sleep_enable_gpio_wakeup(); ↵ }` |
| `esp32_gpio_reset` | Statement | PIN(input_value) | `esp32_gpio_reset(math_number(4))` | `gpio_reset_pin(ailyGpioNativePin(1));` |
| `esp32_gpio_interrupt` | Statement | PIN(input_value), MODE(dropdown), DO(input_statement) | `esp32_gpio_interrupt(math_number(4), FALLING)` | `ailyGpioEventAttach(1, FALLING, ailyGpioCallback_67_65_6e_65_72_61_74_6f_72_2d_63_6f_76_65_72_61_67_65_2d_65_73_70_33_32_5f_67_70_69_6f_5f_69_6e_74_65_72_72_75_70_74);` |
| `esp32_gpio_interrupt_detach` | Statement | PIN(input_value) | `esp32_gpio_interrupt_detach(math_number(4))` | `ailyGpioEventDetach(1);` |

Generated Code is the repository validator’s canonical probe output (numeric probe inputs are 1); ABS Format gives practical toolbox defaults. Helper definitions and dispatcher injection are described below; the probe callback name is generated from its block ID.

## Parameter Options

- `esp32_gpio_adc_average.UNIT`: `MV`, `RAW`.
- `esp32_gpio_adc_resolution.BITS`: `12`, `9`, `10`, `11`, `13`, `14`, `15`, `16`.
- `esp32_gpio_adc_attenuation.ATTENUATION`: `ADC_11db`, `ADC_0db`, `ADC_2_5db`, `ADC_6db`.
- `esp32_gpio_adc_pin_attenuation.ATTENUATION`: `ADC_11db`, `ADC_0db`, `ADC_2_5db`, `ADC_6db`.
- `esp32_gpio_dac_pin.CHANNEL`: `1`, `2`.
- `esp32_gpio_pwm_read.WHAT`: `DUTY`, `FREQUENCY`.
- `esp32_gpio_pwm_invert.INVERT`: `true`, `false`.
- `esp32_gpio_pin_mode.MODE`: `INPUT_PULLDOWN`, `INPUT_PULLUP`, `INPUT`, `OUTPUT`, `OUTPUT_OPEN_DRAIN`.
- `esp32_gpio_pull.PULL`: `GPIO_PULLUP_ONLY`, `GPIO_PULLDOWN_ONLY`, `GPIO_PULLUP_PULLDOWN`, `GPIO_FLOATING`.
- `esp32_gpio_drive.STRENGTH`: `GPIO_DRIVE_CAP_2`, `GPIO_DRIVE_CAP_0`, `GPIO_DRIVE_CAP_1`, `GPIO_DRIVE_CAP_3`.
- `esp32_gpio_hold.ACTION`: `ENABLE`, `DISABLE`.
- `esp32_gpio_deep_hold.ACTION`: `ENABLE`, `DISABLE`.
- `esp32_gpio_wakeup.LEVEL`: `GPIO_INTR_LOW_LEVEL`, `GPIO_INTR_HIGH_LEVEL`, `DISABLE`.
- `esp32_gpio_interrupt.MODE`: `FALLING`, `RISING`, `CHANGE`.

## Behavior and Limits

### Touch

- The Arduino API is **`touchRead()`**, with a lowercase `t`. Raw readings are chip/board/electrode dependent and are not volts. No `pinMode` is needed; do not reuse that pin for PWM or GPIO output.
- Prefer calibration plus percentage detection: keep the pad untouched during setup. Calibration discards an initial reading, waits 20 ms, then averages 1–64 samples with 2 ms gaps. A zero sample invalidates calibration. The baseline block returns 0 until calibration succeeds. Invalid touch pins return 0/false and are never used as array indexes.
- `touch_pressed` requires a baseline; it never silently calibrates on first touch. Trigger percentage is clamped to 1–90. A 20% setting triggers after a 20% change from baseline; release occurs below 10%. It uses the correct direction for the chip. Hysteresis reduces threshold chatter; it is not a timed debounce filter. Recalibrate after wiring, electrode, humidity or timing changes. Use one sensitivity setting per pin.
- `touch_threshold` uses an **absolute raw threshold** with chip-aware comparison. Example only: idle 70, touched 25 on ESP32 suggests 40. On S3, idle 30000 and touched 50000 might suggest 40000. Measure your own values.
- The **hardware threshold** for touch interrupt/wakeup is different: ESP32 uses an absolute threshold; S2/S3/P4 use an increment above the driver's hardware benchmark. Do not copy an absolute S3 polling threshold into an interrupt. The default 40 is only an ESP32 example; calibration/percentage polling is the portable beginner workflow.
- `touch_cycles`: legacy touch driver, ESP-IDF below 5.5 and touch version 1/2; arguments are clock cycles, clamped 1–65535. `touch_timing`: new driver, ESP-IDF 5.5+ or touch v3; arguments are microseconds, clamped 1–1000000. They are **not interchangeable units**. Use only the block matching the installed core; both report a clear compile error on the wrong driver. Timing must be set before the first touch read, calibration or interrupt registration. The actual measurable range still depends on the driver/chip.
- Touch interrupts report driver events; release may also cause callbacks. They are not a guaranteed one-shot press event. For press/release state, read `touch_pressed` in loop. Touch wakeup configures a source and enables touchpad wake; it does not enter sleep. S2/S3 usually allow only one deep-sleep touch channel. Wake thresholds and other wake sources must satisfy the chip's sleep restrictions.

### ADC and DAC

- `adc_mv` uses `analogReadMilliVolts` calibration, not a naive raw/4095 conversion. Attenuation changes measurement range; the usable voltage range and calibration accuracy depend on the chip. Maximum attenuation does not guarantee a linear 0–3.3 V measurement.
- ADC resolution is global. 12 bits is the usual default; higher selected values can be software-shifted rather than additional hardware precision. ADC averaging clamps sample count to 1–64, accumulates in 64 bits and returns an integer mean. It is synchronous. Apply global attenuation first, then per-pin overrides.
- On classic ESP32, Wi-Fi competes with ADC2. Use ADC1 with Wi-Fi. Floating inputs give unstable readings; share ground with the sensor. GPIO34 in the examples must be replaced on other chips.
- DAC is true 8-bit analog output, available on ESP32/S2 only. Raw writes clamp to 0–255; voltage writes clamp to 0–3.3 V and round using a nominal 3.3 V reference. Actual voltage depends on supply, load and DAC error. A 0 value still enables the DAC; `dac_disable` releases it. DAC is not PWM and cannot drive a speaker/motor directly.

### PWM

- `pwm_quick` automatically attaches an unused pin at 1000 Hz / 8 bits, then uses the configuration established by this library. It does not reattach on every iteration. `pwm_attach` provides explicit settings; attach before raw write, percentage write, fade or invert. Pins, frequency and other inputs can be runtime expressions; they are evaluated once at the call site.
- LEDC channels/timers are limited and shared with servo, tone and other PWM libraries. Do not configure the same pin through another library or mix `analogWrite`/native LEDC calls with these blocks: the stored resolution would become stale. The driver allocates channels automatically.
- Resolution must be 1 through the chip's `SOC_LEDC_TIMER_BIT_WIDTH` (20 on classic ESP32; commonly 14 elsewhere). Frequency must be positive; fractional values are truncated. Invalid frequency/resolution combinations or unavailable resources fail. Check `esp32_gpio_pwm_ok` immediately after a setting operation; it starts false and does not report ADC, touch or GPIO errors.
- Percentage duty clamps to 0–100 and rounds against `2^bits−1`; raw duty clamps to 0–`2^bits−1`. Nonfinite numeric values clamp to the lower bound. Core LEDC handling supplies full-on output at the maximum duty.
- `pwm_attach` and `pwm_frequency` detach an existing library-owned channel and attach the new settings, resetting duty to zero. This avoids changing a timer still used by other pins. It can cause an output gap, reset inversion and lose the old configuration if the new attach fails. Apply the desired duty/inversion again. Do not repeatedly reconfigure in loop.
- `pwm_tone` configures 10-bit, approximately 50% duty. Frequency 0 writes zero duty without releasing the channel. Very low frequencies may be outside the clock/divider range; use explicit PWM with a suitable resolution when needed.
- Fade uses the LEDC hardware without waiting; percentages are converted using stored resolution and duration clamps to 1–2147483647 ms. Do not start another fade/write/detach/configuration on that pin until the fade completes. Reads report configured duty/frequency, not the frequency of an external signal.

### Interrupts, Hold and Wakeup

- Register listeners in setup after pin configuration. Each pin has one callback per event kind; registering again replaces it. Detaching clears queued events. GPIO and touch listeners have separate registries, but should not share physical pin ownership.
- The ISR only records a pending flag under a spinlock. The generator injects one dispatcher per event kind at the start of `loop()`. User actions, including Serial output, execute there. Multiple events before a poll coalesce; lengthy delays/network calls increase latency. This is not a hardware pulse counter, and mechanical buttons still need debouncing.
- Callback bodies are global C++ functions. Use global Blockly variables; do not refer to a setup/loop/function local variable or use break/return to control the enclosing setup/loop. Do not call listener registration concurrently from different FreeRTOS tasks. User callbacks should return promptly.
- Set GPIO mode explicitly before digital I/O or interrupts. When mixing advanced modes with `core-io`, add an `io_pinmode` marker too, because its read/write generators may otherwise insert automatic INPUT/OUTPUT setup. This library provides mode statements, not mode value blocks. The open-drain example below uses a core mode block before overriding it with the advanced mode. Inspect generated setup order when combining the two libraries.
- Pad hold freezes configuration and level. On ESP32/S2/S3/C3, deep-sleep digital-pad retention requires per-pin hold and global deep hold. Chips with `SOC_GPIO_SUPPORT_HOLD_SINGLE_IO_IN_DSLP` (including C6/P4) use per-pin hold directly: the global deep-hold block makes no change, including DISABLE; release each pad with `esp32_gpio_hold(..., DISABLE)`. After waking, set the intended mode/level before releasing. P4 revisions below 3.0 cannot retain pad state across deep-sleep wake. RTC/digital-pad behavior varies by chip.
- GPIO wakeup uses HIGH/LOW levels for **light sleep**. Set input mode and pull resistors first. DISABLE removes that pin's wake condition; other pins remain configured. Combine with `esp32_sleep` to enter light sleep. A still-active wake level can cause immediate wakeup. Use the sleep library's RTC/ext0/ext1 features for compatible deep-sleep GPIO wakeup.
- GPIO configuration calls rely on ESP-IDF validation and logging. They do not update `pwm_ok`. Reset is a GPIO reset, not peripheral cleanup: detach interrupts/PWM, disable DAC and release hold first.

## ABS Examples

ABS arguments follow `block.json` order. Dropdowns use the exact machine tokens in Parameter Options, without display labels. Value inputs use nested blocks such as `math_number(4)`, not bare literals. Statement bodies use `@DO:`. Examples require the usual core startup/loop, serial, time, logic and I/O libraries when referenced. Each example is an independent workspace.

### Calibrated touch button (ESP32/S2/S3, GPIO4)

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_gpio_touch_calibrate(math_number(4), math_number(16))

arduino_loop()
    serial_println(Serial, esp32_gpio_touch_read(math_number(4)))
    serial_println(Serial, esp32_gpio_touch_pressed(math_number(4), math_number(20)))
    time_delay(math_number(50))
```

Keep the electrode untouched during startup. No raw threshold from another board is required.

### LED at 50% duty (output-capable GPIO4, series resistor required)

```abs
arduino_setup()
    serial_begin(Serial, 115200)

arduino_loop()
    esp32_gpio_pwm_quick(math_number(4), math_number(50))
    serial_println(Serial, esp32_gpio_pwm_ok())
    time_delay(math_number(100))
```

### Repeated fade with explicit configuration

```abs
arduino_setup()
    esp32_gpio_pwm_attach(math_number(4), math_number(5000), math_number(12))

arduino_loop()
    esp32_gpio_pwm_fade(math_number(4), math_number(0), math_number(100), math_number(1000))
    time_delay(math_number(1100))
    esp32_gpio_pwm_fade(math_number(4), math_number(100), math_number(0), math_number(1000))
    time_delay(math_number(1100))
```

### Stable voltage measurement (classic ESP32 ADC1 GPIO34)

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_gpio_adc_resolution(12)
    esp32_gpio_adc_pin_attenuation(math_number(34), ADC_11db)

arduino_loop()
    serial_println(Serial, esp32_gpio_adc_average(math_number(34), math_number(16), MV))
    time_delay(math_number(100))
```

### DAC voltage (ESP32 or ESP32-S2)

```abs
arduino_setup()
    esp32_gpio_dac_voltage(esp32_gpio_dac_pin(1), math_number(1.65))

arduino_loop()
    time_delay(math_number(1000))
```

### Button interrupt, with actions deferred to loop

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_gpio_pin_mode(math_number(4), INPUT_PULLUP)
    esp32_gpio_interrupt(math_number(4), FALLING)
        @DO:
            serial_println(Serial, text("button edge"))

arduino_loop()
    time_delay(math_number(10))
```

Connect the button between GPIO4 and GND. This reports edges without mechanical debounce. Even though registration is inside setup, the body executes in loop when an event arrives.

### Raw hardware touch events (classic ESP32 only; measured threshold example)

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    esp32_gpio_touch_interrupt(math_number(4), math_number(40))
        @DO:
            serial_println(Serial, text("touch hardware event"))

arduino_loop()
    time_delay(math_number(10))
```

### Open-drain output with core I/O

```abs
arduino_setup()
    io_pinmode(math_number(4), io_mode(OUTPUT))
    esp32_gpio_pin_mode(math_number(4), OUTPUT_OPEN_DRAIN)

arduino_loop()
    io_digitalwrite(math_number(4), io_state(LOW))
    time_delay(math_number(500))
    io_digitalwrite(math_number(4), io_state(HIGH))
    time_delay(math_number(500))
```

The first mode block marks the pin as explicitly configured for core-io. The advanced statement then selects open drain. HIGH releases the output instead of driving 3.3 V.

### Light-sleep wake on button

```abs
arduino_setup()
    esp32_gpio_pin_mode(math_number(4), INPUT_PULLUP)
    esp32_gpio_wakeup(math_number(4), GPIO_INTR_LOW_LEVEL)

arduino_loop()
    esp32_light_sleep_start()
    time_delay(math_number(200))
```

### Hold a digital output through deep sleep (classic ESP32 GPIO18)

```abs
arduino_setup()
    io_pinmode(math_number(18), io_mode(OUTPUT))
    io_digitalwrite(math_number(18), io_state(HIGH))
    esp32_gpio_deep_hold(DISABLE)
    esp32_gpio_hold(math_number(18), DISABLE)
    esp32_gpio_hold(math_number(18), ENABLE)
    esp32_gpio_deep_hold(ENABLE)
    esp32_deep_sleep_timer(math_number(10))
    esp32_deep_sleep_start()

arduino_loop()
    time_delay(math_number(1000))
```

Deep sleep restarts setup. Mode/level are restored before releasing hold; then retention is enabled for the next sleep interval.

## Troubleshooting

| Symptom | Check |
|---|---|
| Touch compile error | Chip lacks touch, or the timing block targets the wrong driver |
| Touch always false | Baseline is zero, invalid touch pin, startup occurred while touching, or percentage too high |
| S3 interrupt triggers unexpectedly | Hardware threshold is an increment, not an absolute polling value; release can also generate events |
| ADC fails with Wi-Fi | On classic ESP32, move from ADC2 to ADC1 |
| DAC compile error on S3/C3/C6 | Use PWM with filtering or an external DAC |
| PWM does nothing | Inspect `pwm_ok`, output capability, channel exhaustion and frequency/resolution limits |
| Callback runs late / edges missing | Shorten blocking loop work; events coalesce; use hardware counting for fast pulses |
| Pin ignores writes | Release hold and detach any peripheral that still owns the pin |
| Sleep wakes immediately | Wake pin is already at the active level or touch threshold is wrong |

## Sources and Validation

- [Arduino touch API](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/touch.html), [LEDC](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html), [ADC](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html), [DAC](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/dac.html).
- [ESP-IDF GPIO and hold/wakeup reference](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/gpio.html).
- Driver availability is checked against the installed core headers (`esp32-hal-touch.h`, `esp32-hal-touch-ng.h`, `esp_idf_version.h`); the 3.3.11 installation uses the new touch driver.
- Run `node --test esp32_gpio/tests/*.test.js` (10 tests; the Blockly integration case uses dependencies from the adjacent `aily-blockly` checkout or `AILY_BLOCKLY_ROOT`). Native behavior tests: `esp32_gpio/tests/run-native-tests.ps1`, using Visual Studio C++ Build Tools on Windows. They execute the emitted C++ helpers with hardware stubs, covering both touch directions, hysteresis, ADC sampling limits, PWM lifecycle and deferred callbacks.
- Run `node esp32_gpio/tests/build-sketches.js`, then `arduino-cli compile --fqbn esp32:esp32:<chip> .temp/esp32-gpio-check/<chip>` for `esp32`, `esp32s2`, `esp32s3`, `esp32c3`, `esp32c6`, `esp32p4`. All six targets were compiled with Arduino-ESP32 3.3.11. Legacy `touch_cycles` requires a legacy-driver core and is deliberately excluded from these new-driver builds. The generated sketches exercise incompatible operations sequentially for compilation and are **not hardware demonstration sketches**.
- Run `node esp32_gpio/tests/check-unsupported.js` to verify that C3 touch/DAC blocks fail with actionable diagnostics. Documentation and locale checks: `node .scripts/check-readme-compliance.js esp32_gpio --strict-abs` and `node .scripts/check-i18n-compliance.js --library esp32_gpio`.
- Actual electrode thresholds, analog accuracy, waveform timing, wakeup and external wiring require hardware verification.
