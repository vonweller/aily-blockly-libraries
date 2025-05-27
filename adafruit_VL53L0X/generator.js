/**
 * VL53L0X激光测距传感器 & SSD1306 OLED 显示屏生成器
 */

// ====== VL53L0X ======
Arduino.forBlock['vl53l0x_create'] = function(block, generator) {
  generator.addLibrary('vl53l0x', '#include <Adafruit_VL53L0X.h>');
  generator.addVariable('vl53l0x', 'Adafruit_VL53L0X lox;');
  return '';
};

// 合并初始化（默认地址和指定地址）
Arduino.forBlock['vl53l0x_begin'] = function(block, generator) {
  const address = generator.valueToCode ?
    generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC) : null;
  let beginCall = 'lox.begin(' + (address ? address : '') + ')';
  generator.addSetupBegin('vl53l0x_begin', `if (!${beginCall}) {\n  Serial.println("Failed to boot VL53L0X");\n  while(1);\n}`);
  return '';
};

Arduino.forBlock['vl53l0x_start_range'] = block => 'lox.startRange();\n';
Arduino.forBlock['vl53l0x_is_range_complete'] = block => ['lox.isRangeComplete()', Arduino.ORDER_FUNCTION_CALL];
Arduino.forBlock['vl53l0x_read_range_result'] = block => ['lox.readRangeResult()', Arduino.ORDER_FUNCTION_CALL];
Arduino.forBlock['vl53l0x_read_range'] = block => ['lox.readRange()', Arduino.ORDER_FUNCTION_CALL];
Arduino.forBlock['vl53l0x_timeout_occurred'] = block => ['lox.timeoutOccurred()', Arduino.ORDER_FUNCTION_CALL];

Arduino.forBlock['vl53l0x_start_range_continuous'] = function(block, generator) {
  const period = generator.valueToCode(block, 'PERIOD_MS', Arduino.ORDER_ATOMIC) || '50';
  return 'lox.startRangeContinuous(' + period + ');\n';
};
Arduino.forBlock['vl53l0x_stop_range_continuous'] = () => 'lox.stopRangeContinuous();\n';

Arduino.forBlock['vl53l0x_ranging_test'] = function(block, generator) {
  generator.addVariable('vl53l0x_measure', 'VL53L0X_RangingMeasurementData_t measure;');
  const debug = generator.valueToCode(block, 'DEBUG', Arduino.ORDER_ATOMIC) || 'false';
  return 'lox.rangingTest(&measure, ' + debug + ');\n';
};
Arduino.forBlock['vl53l0x_get_ranging_measurement'] = function(block, generator) {
  generator.addVariable('vl53l0x_measure', 'VL53L0X_RangingMeasurementData_t measure;');
  const debug = generator.valueToCode(block, 'DEBUG', Arduino.ORDER_ATOMIC) || 'false';
  return 'lox.getRangingMeasurement(&measure, ' + debug + ');\n';
};

Arduino.forBlock['vl53l0x_set_gpio_config'] = function(block, generator) {
  const deviceMode = generator.valueToCode(block, 'DEVICE_MODE', Arduino.ORDER_ATOMIC);
  const gpioFunctionality = generator.valueToCode(block, 'GPIO_FUNCTIONALITY', Arduino.ORDER_ATOMIC);
  const interruptPolarity = generator.valueToCode(block, 'INTERRUPT_POLARITY', Arduino.ORDER_ATOMIC);
  return `lox.setGpioConfig(${deviceMode}, ${gpioFunctionality}, ${interruptPolarity});\n`;
};

Arduino.forBlock['vl53l0x_set_interrupt_thresholds'] = function(block, generator) {
  const low = generator.valueToCode(block, 'LOW', Arduino.ORDER_ATOMIC);
  const high = generator.valueToCode(block, 'HIGH', Arduino.ORDER_ATOMIC);
  const update = generator.valueToCode(block, 'UPDATE', Arduino.ORDER_ATOMIC) || 'false';
  return `lox.setInterruptThresholds(${low}, ${high}, ${update});\n`;
};

Arduino.forBlock['vl53l0x_set_device_mode'] = function(block, generator) {
  const mode = generator.valueToCode(block, 'MODE', Arduino.ORDER_ATOMIC);
  const update = generator.valueToCode(block, 'UPDATE', Arduino.ORDER_ATOMIC) || 'false';
  return `lox.setDeviceMode(${mode}, ${update});\n`;
};

Arduino.forBlock['vl53l0x_clear_interrupt_mask'] = () => 'lox.clearInterruptMask(false);\n';

// 预定义的测距模式常量
Arduino.forBlock['vl53l0x_sense_config'] = function(block) {
  const configType = block.getFieldValue('CONFIG_TYPE');
  const table = {
    LONG_RANGE: 'VL53L0X_SENSE_LONG_RANGE',
    HIGH_SPEED: 'VL53L0X_SENSE_HIGH_SPEED',
    DEFAULT: 'VL53L0X_SENSE_DEFAULT'
  };
  return [table[configType] || table.DEFAULT, Arduino.ORDER_ATOMIC];
};


// ====== SSD1306 OLED ======
Arduino.forBlock['ssd1306_create'] = function(block, generator) {
  const width = block.getFieldValue('WIDTH') || '128';
  const height = block.getFieldValue('HEIGHT') || '64';
  generator.addLibrary('ssd1306', '#include <Adafruit_SSD1306.h>');
  generator.addLibrary('gfx', '#include <Adafruit_GFX.h>');
  generator.addVariable('ssd1306_display', `Adafruit_SSD1306 display(${width}, ${height}, &Wire, -1);`);
  return '';
};

Arduino.forBlock['ssd1306_begin'] = function(block, generator) {
  const address = block.getFieldValue('ADDRESS') || '0x3C';
  generator.addSetupBegin('ssd1306_begin', `if(!display.begin(SSD1306_SWITCHCAPVCC, ${address})) {\n  Serial.println(F("SSD1306 allocation failed"));\n  for(;;);\n}`);
  return '';
};

Arduino.forBlock['ssd1306_clear_display'] = () => 'display.clearDisplay();\n';
Arduino.forBlock['ssd1306_set_text_size'] = function(block, generator) {
  const size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || '1';
  return `display.setTextSize(${size});\n`;
};
Arduino.forBlock['ssd1306_set_text_color'] = function(block, generator) {
  const color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || 'WHITE';
  return `display.setTextColor(${color});\n`;
};
Arduino.forBlock['ssd1306_set_cursor'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  return `display.setCursor(${x}, ${y});\n`;
};
Arduino.forBlock['ssd1306_print'] = function(block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '""';
  return `display.print(${value});\n`;
};
Arduino.forBlock['ssd1306_display'] = () => 'display.display();\n';
