'use strict';

function ensureChipIntelliASR(generator) {
  generator.addLibrary('chipintelli_asr', '#include <ChipIntelliASR.h>');
}

function ensureChipIntelliASRResult(generator) {
  ensureChipIntelliASR(generator);
  generator.addVariable('chipintelli_asr_result', 'ChipIntelliASRResult ailyChipIntelliASRResult = {};');
}

Arduino.forBlock['chipintelli_asr_init'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  return 'ChipIntelliASR.begin((uint32_t)max(0L, (long)(' + timeout + ')));\n';
};

Arduino.forBlock['chipintelli_asr_end'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return 'ChipIntelliASR.end();\n';
};

Arduino.forBlock['chipintelli_asr_read_results'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'while (ChipIntelliASR.read(ailyChipIntelliASRResult)) {\n' + handler + '}\n';
};

Arduino.forBlock['chipintelli_asr_available'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.available()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_command_id'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.commandId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_semantic_id'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.semanticId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_score'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.score', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_frames'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.frames', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['String(ailyChipIntelliASRResult.text)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text_truncated'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.textTruncated', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_dropped_results'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.droppedResults()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_aec_enabled'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isAECEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_barge_in_enabled'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isBargeInEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_barge_in_mode'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['static_cast<uint8_t>(ChipIntelliASR.bargeInMode())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_barge_in_mode_value'] = function(block, generator) {
  const mode = ['0', '1', '2', '3'].indexOf(block.getFieldValue('MODE')) >= 0 ? block.getFieldValue('MODE') : '0';
  return [mode, generator.ORDER_ATOMIC];
};
