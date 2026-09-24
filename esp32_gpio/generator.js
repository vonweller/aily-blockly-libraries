// ESP32 advanced GPIO. Helpers are emitted only for the features in use.
// Pin parameters stay at the call site so variables and expressions work in loop.
Arduino.esp32GpioBase = function(generator) {
  generator.addLibrary('esp32_gpio_base', `#include <Arduino.h>
#include <esp_arduino_version.h>
#include <soc/soc_caps.h>
#include <driver/gpio.h>
#include <math.h>
#if !defined(ARDUINO_ARCH_ESP32) || ESP_ARDUINO_VERSION_MAJOR < 3
#error "esp32_gpio requires Arduino-ESP32 3.x or newer"
#endif`);
  generator.addFunction('esp32_gpio_base', `double ailyGpioClamp(double value, double low, double high) {
  if (!isfinite(value)) return low;
  return value < low ? low : (value > high ? high : value);
}
gpio_num_t ailyGpioNativePin(int pin) {
#if defined(BOARD_HAS_PIN_REMAP) && !defined(BOARD_USES_HW_GPIO_NUMBERS)
  if (pin < 0 || pin > 127) return GPIO_NUM_NC;
  return (gpio_num_t)digitalPinToGPIONumber(pin);
#else
  return (gpio_num_t)pin;
#endif
}
bool ailyGpioValidPin(int pin) {
  return pin >= 0 && pin < SOC_GPIO_PIN_COUNT && GPIO_IS_VALID_GPIO(ailyGpioNativePin(pin));
}`);
};

Arduino.esp32GpioValue = function(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || String(fallback);
};

Arduino.esp32GpioTouch = function(generator) {
  Arduino.esp32GpioBase(generator);
  generator.addLibrary('esp32_gpio_touch', `#include <esp_idf_version.h>
#if !SOC_TOUCH_SENSOR_SUPPORTED
#error "esp32_gpio: this chip has no capacitive touch peripheral"
#endif`);
  generator.addVariable('esp32_gpio_touch_state', `uint32_t ailyGpioTouchBaseline[SOC_GPIO_PIN_COUNT] = {};
bool ailyGpioTouchPressed[SOC_GPIO_PIN_COUNT] = {};`);
  generator.addFunction('esp32_gpio_touch', `bool ailyGpioTouchPin(int pin) {
  return ailyGpioValidPin(pin) && digitalPinToTouchChannel(pin) >= 0;
}
uint32_t ailyGpioTouchRead(int pin) {
  return ailyGpioTouchPin(pin) ? (uint32_t)touchRead(pin) : 0;
}
bool ailyGpioTouchThreshold(int pin, double threshold) {
  if (!ailyGpioTouchPin(pin)) return false;
  uint32_t value = touchRead(pin);
  if (!value || !isfinite(threshold) || threshold <= 0) return false;
#if SOC_TOUCH_SENSOR_VERSION == 1
  return value < threshold;
#else
  return value > threshold;
#endif
}
void ailyGpioTouchCalibrate(int pin, double samples) {
  if (!ailyGpioTouchPin(pin)) return;
  ailyGpioTouchBaseline[pin] = 0;
  ailyGpioTouchPressed[pin] = false;
  int count = (int)ailyGpioClamp(samples, 1, 64);
  (void)touchRead(pin);
  delay(20);
  uint64_t total = 0;
  for (int i = 0; i < count; ++i) {
    uint32_t value = touchRead(pin);
    if (!value) return;
    total += value;
    delay(2);
  }
  ailyGpioTouchBaseline[pin] = total / count;
}
uint32_t ailyGpioTouchGetBaseline(int pin) {
  return ailyGpioTouchPin(pin) ? ailyGpioTouchBaseline[pin] : 0;
}
bool ailyGpioTouchIsPressed(int pin, double percent) {
  if (!ailyGpioTouchPin(pin) || !ailyGpioTouchBaseline[pin]) return false;
  uint32_t value = touchRead(pin);
  if (!value) { ailyGpioTouchPressed[pin] = false; return false; }
  double baseline = ailyGpioTouchBaseline[pin];
#if SOC_TOUCH_SENSOR_VERSION == 1
  double change = (baseline - value) * 100.0 / baseline;
#else
  double change = (value - baseline) * 100.0 / baseline;
#endif
  double trigger = ailyGpioClamp(percent, 1, 90);
  ailyGpioTouchPressed[pin] = change >= (ailyGpioTouchPressed[pin] ? trigger * 0.5 : trigger);
  return ailyGpioTouchPressed[pin];
}`);
};

Arduino.esp32GpioPwm = function(generator) {
  Arduino.esp32GpioBase(generator);
  generator.addLibrary('esp32_gpio_pwm', `#if !SOC_LEDC_SUPPORTED
#error "esp32_gpio: this chip has no LEDC peripheral"
#endif`);
  generator.addVariable('esp32_gpio_pwm_state', `uint8_t ailyGpioPwmBits[SOC_GPIO_PIN_COUNT] = {};
bool ailyGpioPwmOK = false;`);
  generator.addFunction('esp32_gpio_pwm', `bool ailyGpioPwmReady(int pin) {
  return ailyGpioValidPin(pin) && ailyGpioPwmBits[pin] && ledcReadFreq(pin) > 0;
}
uint32_t ailyGpioPwmMax(int pin) {
  return (1UL << ailyGpioPwmBits[pin]) - 1;
}
bool ailyGpioPwmAttach(int pin, double frequency, double resolution) {
  ailyGpioPwmOK = false;
  if (!ailyGpioValidPin(pin) || !GPIO_IS_VALID_OUTPUT_GPIO(ailyGpioNativePin(pin)) ||
      !isfinite(frequency) || frequency < 1 || frequency > UINT32_MAX ||
      !isfinite(resolution) || resolution < 1 || resolution > SOC_LEDC_TIMER_BIT_WIDTH) return false;
  uint8_t bits = (uint8_t)resolution;
  if (ailyGpioPwmBits[pin]) {
    if (ledcReadFreq(pin) && !ledcDetach(pin)) return false;
    ailyGpioPwmBits[pin] = 0;
  }
  // Reattach instead of ledcChangeFrequency: never retune another pin's shared timer.
  if (!ledcAttach(pin, (uint32_t)frequency, bits)) return false;
  ailyGpioPwmBits[pin] = bits;
  return ailyGpioPwmOK = ledcWrite(pin, 0);
}
void ailyGpioPwmWrite(int pin, double duty) {
  ailyGpioPwmOK = ailyGpioPwmReady(pin) &&
    ledcWrite(pin, (uint32_t)ailyGpioClamp(duty, 0, ailyGpioPwmMax(pin)));
}
void ailyGpioPwmPercent(int pin, double percent, bool automatic) {
  if (!ailyGpioPwmReady(pin) && (!automatic || !ailyGpioPwmAttach(pin, 1000, 8))) {
    ailyGpioPwmOK = false; return;
  }
  ailyGpioPwmWrite(pin, floor(ailyGpioClamp(percent, 0, 100) * ailyGpioPwmMax(pin) / 100.0 + 0.5));
}
void ailyGpioPwmTone(int pin, double frequency) {
  if (frequency == 0) {
    ailyGpioPwmOK = ailyGpioValidPin(pin);
    if (ailyGpioPwmReady(pin)) ailyGpioPwmWrite(pin, 0);
    return;
  }
  if (ailyGpioPwmAttach(pin, frequency, 10)) ailyGpioPwmPercent(pin, 50, false);
}
void ailyGpioPwmFade(int pin, double from, double to, double milliseconds) {
  ailyGpioPwmOK = false;
  if (!ailyGpioPwmReady(pin)) return;
  uint32_t maximum = ailyGpioPwmMax(pin);
  uint32_t start = (uint32_t)(ailyGpioClamp(from, 0, 100) * maximum / 100.0 + 0.5);
  uint32_t end = (uint32_t)(ailyGpioClamp(to, 0, 100) * maximum / 100.0 + 0.5);
  ailyGpioPwmOK = ledcFade(pin, start, end, (int)ailyGpioClamp(milliseconds, 1, 2147483647));
}
void ailyGpioPwmDetach(int pin) {
  ailyGpioPwmOK = false;
  if (!ailyGpioValidPin(pin)) return;
  ailyGpioPwmOK = ledcDetach(pin);
  if (ailyGpioPwmOK) ailyGpioPwmBits[pin] = 0;
}`);
};

// Separate per-pin registries prevent duplicate listeners and allow runtime pin inputs.
// The ISR only sets a flag under a spinlock. User blocks execute in normal loop context.
Arduino.esp32GpioEvents = function(generator, touch) {
  if (touch) Arduino.esp32GpioTouch(generator);
  else Arduino.esp32GpioBase(generator);
  const prefix = touch ? 'ailyGpioTouchEvent' : 'ailyGpioEvent';
  const valid = touch ? 'ailyGpioTouchPin' : 'ailyGpioValidPin';
  const detach = touch ? 'touchDetachInterrupt' : 'detachInterrupt';
  generator.addVariable(prefix, `portMUX_TYPE ${prefix}Mux = portMUX_INITIALIZER_UNLOCKED;
volatile bool ${prefix}Pending[SOC_GPIO_PIN_COUNT] = {};
void (*${prefix}Callbacks[SOC_GPIO_PIN_COUNT])() = {};`);
  generator.addFunction(prefix, `void ARDUINO_ISR_ATTR ${prefix}ISR(void *arg) {
  int pin = (int)(uintptr_t)arg;
  portENTER_CRITICAL_ISR(&${prefix}Mux);
  ${prefix}Pending[pin] = true;
  portEXIT_CRITICAL_ISR(&${prefix}Mux);
}
void ${prefix}Detach(int pin) {
  if (!${valid}(pin)) return;
  ${detach}(pin);
  portENTER_CRITICAL(&${prefix}Mux);
  ${prefix}Pending[pin] = false;
  portEXIT_CRITICAL(&${prefix}Mux);
  ${prefix}Callbacks[pin] = nullptr;
}
void ${prefix}Attach(int pin, ${touch ? 'double threshold' : 'int mode'}, void (*callback)()) {
  if (!${valid}(pin)) return;
  ${prefix}Detach(pin);
  ${prefix}Callbacks[pin] = callback;
  ${touch
    ? `touchAttachInterruptArg(pin, ${prefix}ISR, (void *)(uintptr_t)pin,
    (touch_value_t)ailyGpioClamp(threshold, 0, (double)((touch_value_t)-1)));`
    : `attachInterruptArg(pin, ${prefix}ISR, (void *)(uintptr_t)pin, mode);`}
}
void ${prefix}Poll() {
  for (int pin = 0; pin < SOC_GPIO_PIN_COUNT; ++pin) {
    portENTER_CRITICAL(&${prefix}Mux);
    bool pending = ${prefix}Pending[pin];
    ${prefix}Pending[pin] = false;
    portEXIT_CRITICAL(&${prefix}Mux);
    if (pending && ${prefix}Callbacks[pin]) ${prefix}Callbacks[pin]();
  }
}`);
  generator.addLoopBegin(prefix, `${prefix}Poll();`);
};

Arduino.esp32GpioCallback = function(block, generator, touch) {
  Arduino.esp32GpioEvents(generator, touch);
  // Full character encoding is collision-free even for Blockly punctuation IDs.
  const id = Array.from(String(block.id)).map(c => c.codePointAt(0).toString(16)).join('_');
  const callback = 'ailyGpioCallback_' + id;
  const body = generator.statementToCode(block, 'DO');
  generator.addFunction(callback, `void ${callback}() {\n${body}}`, true);
  const pin = Arduino.esp32GpioValue(block, generator, 'PIN', 4);
  const argument = touch ? Arduino.esp32GpioValue(block, generator, 'THRESHOLD', 40) : block.getFieldValue('MODE');
  return `${touch ? 'ailyGpioTouchEvent' : 'ailyGpioEvent'}Attach(${pin}, ${argument}, ${callback});\n`;
};

Arduino.forBlock['esp32_gpio_touch_read'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  return [`ailyGpioTouchRead(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_touch_threshold'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  return [`ailyGpioTouchThreshold(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'THRESHOLD', 40)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_touch_calibrate'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  return `ailyGpioTouchCalibrate(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'SAMPLES', 16)});\n`;
};
Arduino.forBlock['esp32_gpio_touch_pressed'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  return [`ailyGpioTouchIsPressed(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'PERCENT', 20)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_touch_baseline'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  return [`ailyGpioTouchGetBaseline(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_touch_cycles'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  generator.addLibrary('esp32_gpio_touch_cycles', `#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 5, 0) || SOC_TOUCH_SENSOR_VERSION >= 3
#error "esp32_gpio: touchSetCycles is unavailable; use the touch_timing block"
#endif`);
  return `touchSetCycles((uint16_t)ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'MEASURE', 4096)}, 1, 65535), (uint16_t)ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'SLEEP', 4096)}, 1, 65535));\n`;
};
Arduino.forBlock['esp32_gpio_touch_timing'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  generator.addLibrary('esp32_gpio_touch_timing', `#if ESP_IDF_VERSION < ESP_IDF_VERSION_VAL(5, 5, 0) && SOC_TOUCH_SENSOR_VERSION < 3
#error "esp32_gpio: touchSetTiming is unavailable; use the touch_cycles block"
#endif`);
  return `touchSetTiming(ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'MEASURE', 500)}, 1, 1000000), (uint32_t)ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'SLEEP', 1000)}, 1, 1000000));\n`;
};
Arduino.forBlock['esp32_gpio_touch_interrupt'] = function(block, generator) {
  return Arduino.esp32GpioCallback(block, generator, true);
};
Arduino.forBlock['esp32_gpio_touch_detach'] = function(block, generator) {
  Arduino.esp32GpioEvents(generator, true);
  return `ailyGpioTouchEventDetach(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)});\n`;
};
Arduino.forBlock['esp32_gpio_touch_wakeup'] = function(block, generator) {
  Arduino.esp32GpioTouch(generator);
  generator.addLibrary('esp32_gpio_sleep', '#include <esp_sleep.h>');
  generator.addFunction('esp32_gpio_touch_wakeup', `void ailyGpioTouchWakeup(int pin, double threshold) {
  if (!ailyGpioTouchPin(pin)) return;
  touchSleepWakeUpEnable(pin, (touch_value_t)ailyGpioClamp(threshold, 0, (double)((touch_value_t)-1)));
  esp_sleep_enable_touchpad_wakeup();
}`);
  return `ailyGpioTouchWakeup(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'THRESHOLD', 40)});\n`;
};

Arduino.forBlock['esp32_gpio_adc_mv'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return [`analogReadMilliVolts(${Arduino.esp32GpioValue(block, generator, 'PIN', 34)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_adc_average'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  generator.addFunction('esp32_gpio_adc_average', `uint32_t ailyGpioAdcAverage(int pin, double samples, bool millivolts) {
  if (!ailyGpioValidPin(pin) || digitalPinToAnalogChannel(pin) < 0) return 0;
  int count = (int)ailyGpioClamp(samples, 1, 64);
  uint64_t total = 0;
  for (int i = 0; i < count; ++i) total += millivolts ? analogReadMilliVolts(pin) : analogRead(pin);
  return total / count;
}`);
  return [`ailyGpioAdcAverage(${Arduino.esp32GpioValue(block, generator, 'PIN', 34)}, ${Arduino.esp32GpioValue(block, generator, 'SAMPLES', 16)}, ${block.getFieldValue('UNIT') === 'MV'})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_adc_resolution'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `analogReadResolution(${block.getFieldValue('BITS')});\n`;
};
Arduino.forBlock['esp32_gpio_adc_attenuation'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `analogSetAttenuation(${block.getFieldValue('ATTENUATION')});\n`;
};
Arduino.forBlock['esp32_gpio_adc_pin_attenuation'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `analogSetPinAttenuation(${Arduino.esp32GpioValue(block, generator, 'PIN', 34)}, ${block.getFieldValue('ATTENUATION')});\n`;
};

Arduino.esp32GpioDac = function(generator) {
  Arduino.esp32GpioBase(generator);
  generator.addLibrary('esp32_gpio_dac', `#if !SOC_DAC_SUPPORTED
#error "esp32_gpio: DAC requires ESP32 or ESP32-S2; use PWM on this chip"
#endif`);
};
Arduino.forBlock['esp32_gpio_dac_pin'] = function(block, generator) {
  Arduino.esp32GpioDac(generator);
  generator.addFunction('esp32_gpio_dac_pin', `int ailyGpioDacPin(int channel) {
#if CONFIG_IDF_TARGET_ESP32
  int pin = channel == 1 ? 25 : 26;
#elif CONFIG_IDF_TARGET_ESP32S2
  int pin = channel == 1 ? 17 : 18;
#else
  int pin = -1;
#endif
#if defined(BOARD_HAS_PIN_REMAP) && !defined(BOARD_USES_HW_GPIO_NUMBERS)
  return gpioNumberToDigitalPin(pin);
#else
  return pin;
#endif
}`);
  return [`ailyGpioDacPin(${block.getFieldValue('CHANNEL')})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_dac_write'] = function(block, generator) {
  Arduino.esp32GpioDac(generator);
  return `dacWrite(${Arduino.esp32GpioValue(block, generator, 'PIN', 25)}, (uint8_t)ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'VALUE', 128)}, 0, 255));\n`;
};
Arduino.forBlock['esp32_gpio_dac_voltage'] = function(block, generator) {
  Arduino.esp32GpioDac(generator);
  return `dacWrite(${Arduino.esp32GpioValue(block, generator, 'PIN', 25)}, (uint8_t)(ailyGpioClamp(${Arduino.esp32GpioValue(block, generator, 'VOLTS', 1.65)}, 0, 3.3) * 255.0 / 3.3 + 0.5));\n`;
};
Arduino.forBlock['esp32_gpio_dac_disable'] = function(block, generator) {
  Arduino.esp32GpioDac(generator);
  return `dacDisable(${Arduino.esp32GpioValue(block, generator, 'PIN', 25)});\n`;
};

Arduino.forBlock['esp32_gpio_pwm_quick'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmPercent(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'PERCENT', 50)}, true);\n`;
};
Arduino.forBlock['esp32_gpio_pwm_attach'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmAttach(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'FREQUENCY', 1000)}, ${Arduino.esp32GpioValue(block, generator, 'BITS', 8)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_write'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmWrite(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'DUTY', 128)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_percent'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmPercent(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'PERCENT', 50)}, false);\n`;
};
Arduino.forBlock['esp32_gpio_pwm_read'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  const fn = block.getFieldValue('WHAT') === 'FREQUENCY' ? 'ledcReadFreq' : 'ledcRead';
  return [`${fn}(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)})`, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp32_gpio_pwm_frequency'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmAttach(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'FREQUENCY', 2000)}, ${Arduino.esp32GpioValue(block, generator, 'BITS', 8)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_tone'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmTone(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'FREQUENCY', 1000)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_fade'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmFade(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${Arduino.esp32GpioValue(block, generator, 'FROM', 0)}, ${Arduino.esp32GpioValue(block, generator, 'TO', 100)}, ${Arduino.esp32GpioValue(block, generator, 'MS', 1000)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_invert'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  generator.addFunction('esp32_gpio_pwm_invert', `void ailyGpioPwmInvert(int pin, bool invert) {
  ailyGpioPwmOK = ailyGpioPwmReady(pin) && ledcOutputInvert(pin, invert);
}`);
  return `ailyGpioPwmInvert(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${block.getFieldValue('INVERT')});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_detach'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return `ailyGpioPwmDetach(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)});\n`;
};
Arduino.forBlock['esp32_gpio_pwm_ok'] = function(block, generator) {
  Arduino.esp32GpioPwm(generator);
  return ['ailyGpioPwmOK', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_gpio_pin_mode'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `pinMode(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}, ${block.getFieldValue('MODE')});\n`;
};
Arduino.forBlock['esp32_gpio_pull'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `gpio_set_pull_mode(ailyGpioNativePin(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}), ${block.getFieldValue('PULL')});\n`;
};
Arduino.forBlock['esp32_gpio_drive'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `gpio_set_drive_capability(ailyGpioNativePin(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}), ${block.getFieldValue('STRENGTH')});\n`;
};
Arduino.forBlock['esp32_gpio_hold'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  const fn = block.getFieldValue('ACTION') === 'ENABLE' ? 'gpio_hold_en' : 'gpio_hold_dis';
  return `${fn}(ailyGpioNativePin(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}));\n`;
};
Arduino.forBlock['esp32_gpio_deep_hold'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  generator.addFunction('esp32_gpio_deep_hold', `void ailyGpioDeepHold(bool enable) {
#if !SOC_GPIO_SUPPORT_HOLD_SINGLE_IO_IN_DSLP
  if (enable) gpio_deep_sleep_hold_en();
  else gpio_deep_sleep_hold_dis();
#else
  // C6/P4 etc.: deep-sleep retention is controlled by each pad's hold bit.
  // There is no global gate. Release individual pads with gpio_hold_dis.
  (void)enable;
#endif
}`);
  return `ailyGpioDeepHold(${block.getFieldValue('ACTION') === 'ENABLE'});\n`;
};
Arduino.forBlock['esp32_gpio_wakeup'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  generator.addLibrary('esp32_gpio_sleep', '#include <esp_sleep.h>');
  const pin = Arduino.esp32GpioValue(block, generator, 'PIN', 4);
  const level = block.getFieldValue('LEVEL');
  if (level === 'DISABLE') return `gpio_wakeup_disable(ailyGpioNativePin(${pin}));\n`;
  return `if (gpio_wakeup_enable(ailyGpioNativePin(${pin}), ${level}) == ESP_OK) {\n  esp_sleep_enable_gpio_wakeup();\n}\n`;
};
Arduino.forBlock['esp32_gpio_reset'] = function(block, generator) {
  Arduino.esp32GpioBase(generator);
  return `gpio_reset_pin(ailyGpioNativePin(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)}));\n`;
};
Arduino.forBlock['esp32_gpio_interrupt'] = function(block, generator) {
  return Arduino.esp32GpioCallback(block, generator, false);
};
Arduino.forBlock['esp32_gpio_interrupt_detach'] = function(block, generator) {
  Arduino.esp32GpioEvents(generator, false);
  return `ailyGpioEventDetach(${Arduino.esp32GpioValue(block, generator, 'PIN', 4)});\n`;
};
