// 引入 ESP32Encoder、Adafruit_GFX/SSD1306、ESP32 Watchdog 多个库，合并相关的 block 定义

Arduino.forBlock['esp32encoder_create'] = function(block, generator) {
  const variable_name = generator.valueToCode(block, 'ENCODER_VAR', Arduino.ORDER_ATOMIC) || 'encoder';
  const always_interrupt = block.getFieldValue('INTERRUPT') === 'TRUE';
  generator.addLibrary('ESP32Encoder', '#include <ESP32Encoder.h>');
  generator.addVariable(variable_name, `ESP32Encoder ${variable_name}(${always_interrupt ? 'true' : 'false'});`);
  return '';
};

Arduino.forBlock['esp32encoder_use_internal_resistors'] = function(block, generator) {
  const pullup_type = block.getFieldValue('PULLUP_TYPE');
  generator.addSetup('esp32encoder_pullup', `ESP32Encoder::useInternalWeakPullResistors(${pullup_type});`);
  return '';
};

['attach_half_quad', 'attach_single_edge', 'set_count', 'clear_count', 'pause_count', 'resume_count', 'set_filter'].forEach(fn => {
  Arduino.forBlock[`esp32encoder_${fn}`] = function(block, generator) {
    const encoder = generator.valueToCode(block, 'ENCODER', Arduino.ORDER_ATOMIC) || 'encoder';
    let params = [];
    if (fn === 'attach_half_quad' || fn === 'attach_single_edge') {
      params.push(generator.valueToCode(block, 'PIN_A', Arduino.ORDER_ATOMIC));
      params.push(generator.valueToCode(block, 'PIN_B', Arduino.ORDER_ATOMIC));
    } else if (fn === 'set_count') {
      params.push(generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC));
    } else if (fn === 'set_filter') {
      params.push(generator.valueToCode(block, 'FILTER_VALUE', Arduino.ORDER_ATOMIC));
    }
    return `${encoder}.${fn.replace('_', '')}(${params.join(', ')});\n`;
  }
});

Arduino.forBlock['esp32encoder_get_count'] = function(block, generator) {
  const encoder = generator.valueToCode(block, 'ENCODER', Arduino.ORDER_ATOMIC) || 'encoder';
  return [`${encoder}.getCount()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32encoder_callback'] = function(block, generator) {
  const encoder = generator.valueToCode(block, 'ENCODER', Arduino.ORDER_ATOMIC) || 'encoder';
  const callback_function = generator.statementToCode(block, 'CALLBACK');
  const callback_name = 'encoder_callback_' + Math.floor(Math.random()*10000);
  generator.addFunction(callback_name, `void ${callback_name}(void* arg) {\n${callback_function}}\n`);
  return `${encoder}._enc_isr_cb = ${callback_name};\n`;
};
