
/**
 * Generator functions for OpenJumperTTS library blocks.
 */

// TTS初始化块
Arduino.forBlock['openjumper_tts_init'] = function(block, generator) {
  var rxPin = block.getFieldValue('RX_PIN');
  var txPin = block.getFieldValue('TX_PIN');
  
  // 添加库引用
  generator.addLibrary('OpenJumperTTS', '#include <OpenJumperTTS.h>');
  
  // 创建TTS对象
  generator.addVariable('TTS', '/*在文本前添加标识符可按相应方式播报特定字符串，\n比如在文本前\n添加[n1]:表示按数字播报\n添加[n2]：按数值播报；\n添加[n3]:按电话号码播报\n添加[w0]：表示停顿符\n播放数字*/\nOpenJumperTTS TTS(' + rxPin + ', ' + txPin + ');');
  
  // 添加begin函数到setup
  generator.addSetupBegin('TTS_begin', 'TTS.begin(115200);\n');
  
  return '';
};

// 播放铃声块
Arduino.forBlock['openjumper_tts_play_invoice'] = function(block, generator) {
  var ringtoneNumber = block.getFieldValue('VOICE_TYPE');
  var vnum = generator.valueToCode(block, "VOICE_NUM", Arduino.ORDER_ATOMIC) || '5';

  var code = '';
  if (ringtoneNumber === 'VOICE_Ringtones') {
    code = 'TTS.PlayPromptSound(VOICE_Ringtones,' + vnum + ');\n';
  } else if (ringtoneNumber === 'VOICE_PromptSound') {
    code = 'TTS.PlayPromptSound(VOICE_PromptSound,' + vnum + ');\n';
  } else if (ringtoneNumber === 'VOICE_WarningSound') {
    code = 'TTS.PlayPromptSound(VOICE_WarningSound,' + vnum + ');\n';
  }
  
  return code;
};

// 播放控制块
Arduino.forBlock['openjumper_tts_play_control'] = function(block, generator) {
  var controlAction = block.getFieldValue('CONTROL_ACTION');
  
  // 定义控制常量（如果在库中未定义）
  generator.addMacro('PLAY_CONTROLS', '#define PLAY_STOP 0\n#define PLAY_PAUSE 1\n#define PLAY_CONTINUE 2');
  
  var code = 'TTS.playcontrol(' + controlAction + ');\n';
  return code;
};

// 播放数字值块
Arduino.forBlock['openjumper_tts_play_number'] = function(block, generator) {
  var number = generator.valueToCode(block, 'NUMBER', Arduino.ORDER_ATOMIC) || '0';
  
  var code = 'TTS.PlayNumber(' + number + ');\n';
  return code;
};

// 播放文本块
Arduino.forBlock['openjumper_tts_play_text'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  
  return `TTS.PlayText(${text});\n`;
};

// 设置语音参数
Arduino.forBlock['openjumper_tts_setcfg'] = function(block, generator) {
  var voicetp = block.getFieldValue('SP_TYPE');
  var cfgval = generator.valueToCode(block, "CFGV", Arduino.ORDER_ATOMIC) || '5';

  var code = '';
  if (voicetp === 'setspeechSpeed') {
    code = 'TTS.setspeechSpeed(' + cfgval + ');\n';
  } else if (voicetp === 'setIntonation') {
    code = 'TTS.setIntonation(' + cfgval + ');\n';
  } else if (voicetp === 'setVolume') {
    code = 'TTS.setVolume(' + cfgval + ');\n';
  }
  
  return code;
};

// 恢复默认值块
Arduino.forBlock['openjumper_tts_restore_defaults'] = function(block, generator) {
  var code = 'TTS.RestoreDefaultValues();\n';
  return code;
};
