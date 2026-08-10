'use strict';

function ensureChipIntelliCWSL(generator) {
  generator.addLibrary('chipintelli_cwsl', '#include <ChipIntelliCWSL.h>');
}

function ensureChipIntelliCWSLEvent(generator) {
  ensureChipIntelliCWSL(generator);
  generator.addVariable('chipintelli_cwsl_event', 'ChipIntelliCWSLEvent ailyChipIntelliCWSLEvent = {};');
}

function chipIntelliCWSLValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['chipintelli_cwsl_init'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const timeout = chipIntelliCWSLValue(block, generator, 'TIMEOUT', '10000');
  return 'ChipIntelliCWSL.begin((uint32_t)max(0L, (long)(' + timeout + ')));\n';
};

Arduino.forBlock['chipintelli_cwsl_end'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return 'ChipIntelliCWSL.end();\n';
};

Arduino.forBlock['chipintelli_cwsl_learn'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const commandId = chipIntelliCWSLValue(block, generator, 'COMMAND_ID', '2');
  const groupId = chipIntelliCWSLValue(block, generator, 'GROUP_ID', '0');
  const method = block.getFieldValue('WORD_TYPE') === 'WAKE' ? 'learnWakeWord' : 'learnCommand';
  return 'ChipIntelliCWSL.' + method + '((uint32_t)(' + commandId + '), (uint16_t)(' + groupId + '));\n';
};

Arduino.forBlock['chipintelli_cwsl_cancel_learning'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return 'ChipIntelliCWSL.cancelLearning();\n';
};

Arduino.forBlock['chipintelli_cwsl_erase_template'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const commandId = chipIntelliCWSLValue(block, generator, 'COMMAND_ID', '2');
  const groupId = chipIntelliCWSLValue(block, generator, 'GROUP_ID', '0');
  const method = block.getFieldValue('WORD_TYPE') === 'WAKE' ? 'eraseWakeWord' : 'eraseCommand';
  return 'ChipIntelliCWSL.' + method + '((uint32_t)(' + commandId + '), (uint16_t)(' + groupId + '));\n';
};

Arduino.forBlock['chipintelli_cwsl_erase_templates'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const methods = {COMMANDS: 'eraseCommands', WAKE_WORDS: 'eraseWakeWords', ALL: 'eraseAll'};
  const method = methods[block.getFieldValue('SCOPE')] || methods.ALL;
  return 'ChipIntelliCWSL.' + method + '();\n';
};

Arduino.forBlock['chipintelli_cwsl_read_events'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  return 'while (ChipIntelliCWSL.read(ailyChipIntelliCWSLEvent)) {\n' + handler + '}\n';
};

Arduino.forBlock['chipintelli_cwsl_profile_enabled'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.profileEnabled()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_available'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.available()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_state'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['static_cast<uint8_t>(ChipIntelliCWSL.state())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_state_value'] = function(block, generator) {
  const value = block.getFieldValue('STATE');
  return [['0', '1', '2', '3', '255'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_count'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  const methods = {
    COMMAND: 'commandCount', WAKE: 'wakeWordCount', TEMPLATE: 'templateCount',
    REMAINING: 'remainingTemplates', MAX: 'maxTemplates'
  };
  const method = methods[block.getFieldValue('COUNT_TYPE')] || methods.TEMPLATE;
  return ['ChipIntelliCWSL.' + method + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_dropped_events'] = function(block, generator) {
  ensureChipIntelliCWSL(generator);
  return ['ChipIntelliCWSL.droppedEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_type'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.type)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_word_type'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.wordType)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_attempt'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.attempt', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_result'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['static_cast<uint8_t>(ailyChipIntelliCWSLEvent.result)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_command_id'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.commandId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_group_id'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.groupId', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_distance'] = function(block, generator) {
  ensureChipIntelliCWSLEvent(generator);
  return ['ailyChipIntelliCWSLEvent.distance', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_event_type_value'] = function(block, generator) {
  const value = block.getFieldValue('EVENT_TYPE');
  return [['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(value) >= 0 ? value : '1', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_cwsl_learn_result_value'] = function(block, generator) {
  const value = block.getFieldValue('RESULT');
  return [['0', '1', '2', '3', '4', '5', '6'].indexOf(value) >= 0 ? value : '0', generator.ORDER_ATOMIC];
};
