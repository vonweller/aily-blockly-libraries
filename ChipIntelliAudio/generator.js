'use strict';

function ensureChipIntelliAudio(generator) {
  generator.addLibrary('chipintelli_audio', '#include <ChipIntelliAudio.h>');
}

function chipIntelliAudioValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['chipintelli_audio_init'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.begin();\n';
};

Arduino.forBlock['chipintelli_audio_end'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.end();\n';
};

Arduino.forBlock['chipintelli_audio_play_voice'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const voiceId = chipIntelliAudioValue(block, generator, 'VOICE_ID', '1');
  const interruptCurrent = block.getFieldValue('MODE') === 'false' ? 'false' : 'true';
  return 'ChipIntelliAudio.playVoice((uint16_t)(' + voiceId + '), ' + interruptCurrent + ');\n';
};

Arduino.forBlock['chipintelli_audio_play_command_id'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const commandId = chipIntelliAudioValue(block, generator, 'COMMAND_ID', '1');
  const option = chipIntelliAudioValue(block, generator, 'OPTION', '-1');
  const interruptCurrent = block.getFieldValue('MODE') === 'false' ? 'false' : 'true';
  return 'ChipIntelliAudio.playCommand((unsigned long)(' + commandId + '), (int)(' + option + '), ' + interruptCurrent + ');\n';
};

Arduino.forBlock['chipintelli_audio_play_command_text'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const commandText = chipIntelliAudioValue(block, generator, 'COMMAND_TEXT', '""');
  const option = chipIntelliAudioValue(block, generator, 'OPTION', '-1');
  const interruptCurrent = block.getFieldValue('MODE') === 'false' ? 'false' : 'true';
  return 'ChipIntelliAudio.playCommand(String(' + commandText + ').c_str(), (int)(' + option + '), ' + interruptCurrent + ');\n';
};

Arduino.forBlock['chipintelli_audio_play_semantic'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const semanticId = chipIntelliAudioValue(block, generator, 'SEMANTIC_ID', '1');
  const option = chipIntelliAudioValue(block, generator, 'OPTION', '-1');
  const interruptCurrent = block.getFieldValue('MODE') === 'false' ? 'false' : 'true';
  return 'ChipIntelliAudio.playSemantic((uint32_t)(' + semanticId + '), (int)(' + option + '), ' + interruptCurrent + ');\n';
};

Arduino.forBlock['chipintelli_audio_stop'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.stop();\n';
};

Arduino.forBlock['chipintelli_audio_set_volume'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const volume = chipIntelliAudioValue(block, generator, 'VOLUME', '70');
  return 'ChipIntelliAudio.setVolume((uint8_t)constrain((int)(' + volume + '), 0, 100));\n';
};

Arduino.forBlock['chipintelli_audio_set_muted'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const muted = chipIntelliAudioValue(block, generator, 'MUTED', 'true');
  return 'ChipIntelliAudio.setMuted((bool)(' + muted + '));\n';
};

Arduino.forBlock['chipintelli_audio_is_ready'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isReady()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_is_playing'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isPlaying()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_volume'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.volume()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_is_muted'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return ['ChipIntelliAudio.isMuted()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_on_finished'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  generator.addVariable('chipintelli_audio_finished_flag', 'volatile bool ailyChipIntelliAudioFinished = false;');
  generator.addFunction('chipintelli_audio_finished_callback',
    'void ailyChipIntelliAudioFinishedCallback(void *context) {\n' +
    '  (void)context;\n' +
    '  ailyChipIntelliAudioFinished = true;\n' +
    '}\n');
  generator.addFunction('chipintelli_audio_finished_handler',
    'void ailyChipIntelliAudioFinishedHandler() {\n' + handler + '}\n');
  generator.addSetupEnd('chipintelli_audio_finished_callback_setup',
    'ChipIntelliAudio.onFinished(ailyChipIntelliAudioFinishedCallback);');
  generator.addLoopBegin('chipintelli_audio_finished_dispatch',
    'if (ailyChipIntelliAudioFinished) {\n' +
    '  ailyChipIntelliAudioFinished = false;\n' +
    '  ailyChipIntelliAudioFinishedHandler();\n' +
    '}');
  return '';
};
