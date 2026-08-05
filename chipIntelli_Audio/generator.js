'use strict';

function ensureChipIntelliAudio(generator) {
  generator.addLibrary('chipintelli_audio', '#include <ChipIntelliAudio.h>');
}

function chipIntelliAudioValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function chipIntelliAudioVoiceId(generator, text) {
  const macros = generator.codeDict && generator.codeDict['macros'];

  if (macros && macros[text] !== undefined) {
    const existingId = String(macros[text]).match(/^#define\s+VOICE(\d+)\s+/);
    if (existingId) {
      return Number(existingId[1]);
    }
  }

  let voiceId = 1;
  if (macros) {
    Object.keys(macros).forEach(function(tag) {
      const code = String(macros[tag]);
      const id = code.match(/^#define\s+VOICE(\d+)\s+/);
      if (id) voiceId = Math.max(voiceId, Number(id[1]) + 1);
    });
  }

  generator.addMacro(text, '#define VOICE' + voiceId + ' ' + voiceId + ' //' + text);
  return voiceId;
}

function chipIntelliAudioAudioValue(block) {
  let value = block.getFieldValue('AUDIO');
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  return value && typeof value === 'object' ? value : null;
}

function chipIntelliAudioProjectAudioPath(value) {
  const audioPath = value && typeof value.audioPath === 'string'
    ? value.audioPath.trim().replace(/\\/g, '/').replace(/^\.\//, '')
    : '';
  if (!audioPath || audioPath.startsWith('/') || /^[a-z]:/i.test(audioPath)) return '';
  const segments = audioPath.split('/');
  if (segments.some(function(segment) {
    return !segment || segment === '.' || segment === '..';
  })) return '';
  return audioPath;
}

function chipIntelliAudioLocalAudioTag(audioPath) {
  // field_audio stores the converted MP3 under the project directory and
  // serializes audioPath as a project-relative path. The content-addressed
  // path is also a stable addMacro tag for reusing the first matching macro.
  return audioPath ? 'chipintelli_audio_mp3:' + audioPath : '';
}

function chipIntelliAudioMp3Id(generator, tag, audioPath) {
  const macros = generator.codeDict && generator.codeDict['macros'];
  if (macros && macros[tag] !== undefined) {
    const existingId = String(macros[tag]).match(/^#define\s+VOICEMP3(\d+)\s+/);
    if (existingId) return Number(existingId[1]);
  }

  let mp3Id = 500;
  if (macros) {
    Object.keys(macros).forEach(function(macroTag) {
      const id = String(macros[macroTag]).match(/^#define\s+VOICEMP3(\d+)\s+/);
      if (id) mp3Id = Math.max(mp3Id, Number(id[1]) + 1);
    });
  }

  generator.addMacro(
    tag,
    '#define VOICEMP3' + mp3Id + ' ' + mp3Id + ' //' + audioPath
  );
  return mp3Id;
}

Arduino.forBlock['chipintelli_audio_init'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.begin();\n';
};

Arduino.forBlock['chipintelli_audio_end'] = function(block, generator) {
  ensureChipIntelliAudio(generator);
  return 'ChipIntelliAudio.end();\n';
};

Arduino.forBlock['chipintelli_audio_voice'] = function(block, generator) {
  const text = block.getFieldValue('TEXT') || '';
  const voiceId = chipIntelliAudioVoiceId(generator, text);
  return ['VOICE' + voiceId, generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_audio_local_audio'] = function(block, generator) {
  const value = chipIntelliAudioAudioValue(block);
  const audioPath = chipIntelliAudioProjectAudioPath(value);
  const tag = chipIntelliAudioLocalAudioTag(audioPath);
  if (!tag) return ['0', generator.ORDER_ATOMIC];
  const mp3Id = chipIntelliAudioMp3Id(generator, tag, audioPath);
  return ['VOICEMP3' + mp3Id, generator.ORDER_ATOMIC];
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
