'use strict';

function ensureChipIntelliASR(generator) {
  generator.addLibrary('chipintelli_asr', '#include <ChipIntelliASR.h>');
}

function ensureChipIntelliASRResult(generator) {
  ensureChipIntelliASR(generator);
  generator.addVariable(
    'chipintelli_asr_result',
    'ChipIntelliASRResult ailyChipIntelliASRResult = {};'
  );
}

function chipIntelliASRValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function chipIntelliASRText(block, fieldName, fallback) {
  const value = block.getFieldValue(fieldName);
  const text = String(value === null || value === undefined ? '' : value).trim();
  return text || fallback;
}

function chipIntelliASRMacroName(commandId) {
  return 'COMMAND' + commandId;
}

function chipIntelliASRState(generator) {
  const macros = generator.codeDict && generator.codeDict.macros;
  if (!generator._chipIntelliASRState || generator._chipIntelliASRState.macros !== macros) {
    generator._chipIntelliASRState = {
      macros: macros,
      nextCommandId: 2,
      commandIds: Object.create(null),
      callbackIndexes: Object.create(null),
      nextCallbackIndex: 1
    };
  }
  return generator._chipIntelliASRState;
}

function chipIntelliASRAddWakeWord(block, generator) {
  const text = chipIntelliASRText(block, 'WAKE_WORD', '智能管家');
  generator.addMacro(
    'chipintelli_asr_wake',
    '#define ' + chipIntelliASRMacroName(1) + ' 1 //' + text
  );
}

function chipIntelliASRAddCommandMacro(block, generator) {
  const text = chipIntelliASRText(block, 'TEXT', '打开灯');
  const state = chipIntelliASRState(generator);

  if (!Object.prototype.hasOwnProperty.call(state.commandIds, text)) {
    const commandId = state.nextCommandId++;
    state.commandIds[text] = commandId;
    generator.addMacro(
      'chipintelli_asr_command:' + text,
      '#define ' + chipIntelliASRMacroName(commandId) + ' ' + commandId + ' //' + text
    );
  }

  return chipIntelliASRMacroName(state.commandIds[text]);
}

function chipIntelliASRCallbackName(block, generator, eventName) {
  const state = chipIntelliASRState(generator);
  const blockId = String(block.id || 'anonymous_' + state.nextCallbackIndex);
  const key = eventName + ':' + blockId;
  if (!Object.prototype.hasOwnProperty.call(state.callbackIndexes, key)) {
    state.callbackIndexes[key] = state.nextCallbackIndex++;
  }
  return 'ailyChipIntelliASRCallback' + state.callbackIndexes[key];
}

function chipIntelliASRAddTick(generator) {
  ensureChipIntelliASR(generator);
  generator.addLoopBegin('chipintelli_asr_tick', 'ChipIntelliASR.tick();');
}

function chipIntelliASRAddLifecycleEvent(block, generator, eventName, method) {
  ensureChipIntelliASR(generator);
  const callbackName = chipIntelliASRCallbackName(block, generator, eventName);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction(
    callbackName,
    'void ' + callbackName + '() {\n' + handler + '}\n'
  );
  generator.addSetupEnd(
    'chipintelli_asr_attach_' + callbackName,
    'ChipIntelliASR.' + method + '(' + callbackName + ');'
  );
  chipIntelliASRAddTick(generator);
  return '';
}

function chipIntelliASRAddResultEvent(block, generator, eventName, setupCode) {
  ensureChipIntelliASRResult(generator);
  const callbackName = chipIntelliASRCallbackName(block, generator, eventName);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction(
    callbackName,
    'void ' + callbackName + '(const ChipIntelliASRResult &result) {\n' +
    '  ailyChipIntelliASRResult = result;\n' +
    handler +
    '}\n'
  );
  generator.addSetupEnd(
    'chipintelli_asr_attach_' + callbackName,
    setupCode(callbackName)
  );
  chipIntelliASRAddTick(generator);
  return '';
}

Arduino.forBlock['chipintelli_asr_init'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  chipIntelliASRAddWakeWord(block, generator);
  const timeoutSeconds = chipIntelliASRText(block, 'TIMEOUT', '10');
  return 'ChipIntelliASR.begin((uint32_t)max(0L, (long)(' + timeoutSeconds + ')) * 1000UL);\n';
};

Arduino.forBlock['chipintelli_asr_end'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return 'ChipIntelliASR.end();\n';
};

Arduino.forBlock['chipintelli_asr_on_startup'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'startup',
    'attachStartup'
  );
};

Arduino.forBlock['chipintelli_asr_on_wakeup'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'wakeup',
    'attachWakeup'
  );
};

Arduino.forBlock['chipintelli_asr_on_timeout'] = function(block, generator) {
  return chipIntelliASRAddLifecycleEvent(
    block,
    generator,
    'timeout',
    'attachTimeout'
  );
};

Arduino.forBlock['chipintelli_asr_on_result'] = function(block, generator) {
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'result',
    function(callbackName) {
      return 'ChipIntelliASR.onResult(' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_on_command'] = function(block, generator) {
  const command = chipIntelliASRValue(block, generator, 'COMMAND', '0');
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'command',
    function(callbackName) {
      return 'ChipIntelliASR.attachCommand((uint16_t)(' + command + '), ' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_on_semantic'] = function(block, generator) {
  const semanticId = chipIntelliASRValue(block, generator, 'SEMANTIC_ID', '0');
  return chipIntelliASRAddResultEvent(
    block,
    generator,
    'semantic',
    function(callbackName) {
      return 'ChipIntelliASR.attachSemantic((uint32_t)(' + semanticId + '), ' + callbackName + ');';
    }
  );
};

Arduino.forBlock['chipintelli_asr_command'] = function(block, generator) {
  return [chipIntelliASRAddCommandMacro(block, generator), generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_detach_lifecycle'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const methods = {
    STARTUP: 'detachStartup',
    WAKEUP: 'detachWakeup',
    TIMEOUT: 'detachTimeout'
  };
  const method = methods[block.getFieldValue('EVENT')] || methods.STARTUP;
  return 'ChipIntelliASR.' + method + '();\n';
};

Arduino.forBlock['chipintelli_asr_detach_command'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const command = chipIntelliASRValue(block, generator, 'COMMAND', '0');
  return 'ChipIntelliASR.detachCommand((uint16_t)(' + command + '));\n';
};

Arduino.forBlock['chipintelli_asr_detach_semantic'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const semanticId = chipIntelliASRValue(block, generator, 'SEMANTIC_ID', '0');
  return 'ChipIntelliASR.detachSemantic((uint32_t)(' + semanticId + '));\n';
};

Arduino.forBlock['chipintelli_asr_detach_handlers'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const methods = {
    COMMANDS: 'detachAllCommands',
    SEMANTICS: 'detachAllSemantics',
    ALL: 'detachAll'
  };
  const method = methods[block.getFieldValue('HANDLERS')] || methods.ALL;
  return 'ChipIntelliASR.' + method + '();\n';
};

Arduino.forBlock['chipintelli_asr_keep_awake_for'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  const timeoutSeconds = chipIntelliASRValue(block, generator, 'TIMEOUT', '10');
  return 'ChipIntelliASR.keepAwakeFor((uint32_t)max(0L, (long)(' + timeoutSeconds + ')) * 1000UL);\n';
};

Arduino.forBlock['chipintelli_asr_is_awake'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.isAwake()', generator.ORDER_ATOMIC];
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

Arduino.forBlock['chipintelli_asr_result_is_wake_word'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.isWakeWord', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['String(ailyChipIntelliASRResult.text)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_result_text_truncated'] = function(block, generator) {
  ensureChipIntelliASRResult(generator);
  return ['ailyChipIntelliASRResult.textTruncated', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_pending_results'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.pendingResults()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_pending_events'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.pendingEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_dropped_results'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.droppedResults()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_dropped_events'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.droppedEvents()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_handler_count'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.handlerCount()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_handler_capacity'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return ['ChipIntelliASR.handlerCapacity()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_asr_last_error'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return [
    'static_cast<uint8_t>(ChipIntelliASR.lastError())',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['chipintelli_asr_last_error_text'] = function(block, generator) {
  ensureChipIntelliASR(generator);
  return [
    'String(ChipIntelliASR.errorString(ChipIntelliASR.lastError()))',
    generator.ORDER_ATOMIC
  ];
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
  return [
    'static_cast<uint8_t>(ChipIntelliASR.bargeInMode())',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['chipintelli_asr_barge_in_mode_value'] = function(block, generator) {
  const selected = block.getFieldValue('MODE');
  const mode = ['0', '1', '2', '3'].indexOf(selected) >= 0 ? selected : '0';
  return [mode, generator.ORDER_ATOMIC];
};
