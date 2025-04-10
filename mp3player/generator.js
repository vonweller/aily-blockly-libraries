
// MP3初始化块
Arduino.forBlock['gd3800_init'] = function(block, generator) {
  generator.addLibrary('GD3800_Serial', '#include <GD3800_Serial.h>');  
  generator.addVariable('MP3INIT', 'GD3800_Serial mp3(12, 11);'); 
  generator.addSetup('mp3being', 'mp3.begin(9600);');
  
  return '';
};

// MP3设置
Arduino.forBlock['gd3800_set'] = function(block, generator) {
  const gd3800_state = block.getFieldValue("GD3800_SETSTATE");
  
  const code = `mp3.${gd3800_state}();\n`;
  return code;
};

// MP3播放
Arduino.forBlock['gd3800_play'] = function(block, generator) {
  const mnum = generator.valueToCode(block, "MUSICNUM", Arduino.ORDER_ATOMIC);
  return `mp3.playFileByIndexNumber(${mnum});\n`;
};

// MP3模块设定播放循环模式
Arduino.forBlock['gd3800_cyclemode'] = function(block, generator) {
  const gd3800_emode = block.getFieldValue("GD3800_CYMODE");
  
  const code = `mp3.setLoopMode(${gd3800_emode});\n`;
  return code;
};

// MP3模块设定播放音效
Arduino.forBlock['gd3800_equalizer'] = function(block, generator) {
  const gd3800_emode = block.getFieldValue("GD3800_EQMODE");
  
  const code = `mp3.setEqualizer(${gd3800_emode});\n`;
  return code;
};

// MP3模块设置音量
Arduino.forBlock['gd3800_setvolume'] = function(block, generator) {
  const svol = generator.valueToCode(block, "SETVOLUME", Arduino.ORDER_ATOMIC);
  return `mp3.setVolume(${svol});\n`;
};