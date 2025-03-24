Arduino.forBlock['openjumpertts_init'] = function(block, generator) {
  var rxPin = block.getFieldValue('RX_PIN');
  var txPin = block.getFieldValue('TX_PIN');
  var baudrate = block.getFieldValue('BAUDRATE');
  
  generator.addLibrary('OpenJumperTTS', '#include <OpenJumperTTS.h>');
  generator.addVariable('tts', 'OpenJumperTTS tts(' + rxPin + ', ' + txPin + ');');
  
  var code = 'tts.begin(' + baudrate + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_play_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  
  var code = 'tts.PlayText(' + text + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_play_number'] = function(block, generator) {
  var number = generator.valueToCode(block, 'NUMBER', Arduino.ORDER_ATOMIC) || '0';
  
  var code = 'tts.PlayNumber(' + number + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_play_control'] = function(block, generator) {
  var command = block.getFieldValue('COMMAND');
  
  var code = 'tts.playcontrol(' + command + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_play_prompt_sound'] = function(block, generator) {
  var soundType = block.getFieldValue('SOUND_TYPE');
  var soundNumber = block.getFieldValue('SOUND_NUMBER');
  
  var code = 'tts.PlayPromptSound(' + soundType + ', ' + soundNumber + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_set_volume'] = function(block, generator) {
  var volume = block.getFieldValue('VOLUME');
  
  var code = 'tts.setVolume(' + volume + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_set_speed'] = function(block, generator) {
  var speed = block.getFieldValue('SPEED');
  
  var code = 'tts.setspeechSpeed(' + speed + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_set_intonation'] = function(block, generator) {
  var intonation = block.getFieldValue('INTONATION');
  
  var code = 'tts.setIntonation(' + intonation + ');\n';
  return code;
};

Arduino.forBlock['openjumpertts_restore_defaults'] = function(block, generator) {
  var code = 'tts.RestoreDefaultValues();\n';
  return code;
};