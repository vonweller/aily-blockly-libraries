
// DFRobotDFPlayerMini库的generator函数

// 初始化DFPlayer模块
Arduino.forBlock['dfplayer_begin'] = function(block, generator) {
  var serial_pin_rx = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC);
  var serial_pin_tx = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC);
  const variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  generator.addLibrary('dfplayer', '#include <DFRobotDFPlayerMini.h>');
  generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
  generator.addVariable('dfplayer_' + variable_name, 'DFRobotDFPlayerMini ' + variable_name + ';');
  generator.addVariable('dfplayer_serial_' + variable_name, 'SoftwareSerial ' + variable_name + 'Serial(' + serial_pin_rx + ', ' + serial_pin_tx + ');');
  
  var code = variable_name + 'Serial.begin(9600);\n';
  code += 'if (!' + variable_name + '.begin(' + variable_name + 'Serial)) {\n';
  code += '  Serial.println(F("Unable to begin:"));\n';
  code += '  Serial.println(F("1.Please recheck the connection!"));\n';
  code += '  Serial.println(F("2.Please insert the SD card!"));\n';
  code += '}\n';
  code += variable_name + '.volume(10);\n';
  
  generator.addSetup('dfplayer_begin_' + variable_name, code);
  
  return '';
};

// 播放指定编号的文件
Arduino.forBlock['dfplayer_play'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.play(' + file_number + ');\n';
  return code;
};

// 暂停播放
Arduino.forBlock['dfplayer_pause'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.pause();\n';
  return code;
};

// 继续播放
Arduino.forBlock['dfplayer_start'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.start();\n';
  return code;
};

// 停止播放
Arduino.forBlock['dfplayer_stop'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.stop();\n';
  return code;
};

// 播放下一首
Arduino.forBlock['dfplayer_next'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.next();\n';
  return code;
};

// 播放上一首
Arduino.forBlock['dfplayer_previous'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.previous();\n';
  return code;
};

// 设置音量
Arduino.forBlock['dfplayer_volume'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var volume = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.volume(' + volume + ');\n';
  return code;
};

// 增大音量
Arduino.forBlock['dfplayer_volume_up'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.volumeUp();\n';
  return code;
};

// 减小音量
Arduino.forBlock['dfplayer_volume_down'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.volumeDown();\n';
  return code;
};

// 设置均衡器
Arduino.forBlock['dfplayer_eq'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var eq_type = block.getFieldValue('EQ');
  
  var code = variable_name + '.EQ(' + eq_type + ');\n';
  return code;
};

// 设置输出设备
Arduino.forBlock['dfplayer_output_device'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var device = block.getFieldValue('DEVICE');
  
  var code = variable_name + '.outputDevice(' + device + ');\n';
  return code;
};

// 循环播放特定文件
Arduino.forBlock['dfplayer_loop'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.loop(' + file_number + ');\n';
  return code;
};

// 播放指定文件夹中的文件
Arduino.forBlock['dfplayer_play_folder'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.playFolder(' + folder_number + ', ' + file_number + ');\n';
  return code;
};

// 开启全部循环
Arduino.forBlock['dfplayer_enable_loop_all'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.enableLoopAll();\n';
  return code;
};

// 关闭全部循环
Arduino.forBlock['dfplayer_disable_loop_all'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.disableLoopAll();\n';
  return code;
};

// 播放MP3文件夹中的文件
Arduino.forBlock['dfplayer_play_mp3_folder'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.playMp3Folder(' + file_number + ');\n';
  return code;
};

// 播放广告
Arduino.forBlock['dfplayer_advertise'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.advertise(' + file_number + ');\n';
  return code;
};

// 停止广告
Arduino.forBlock['dfplayer_stop_advertise'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.stopAdvertise();\n';
  return code;
};

// 播放大文件夹中的文件
Arduino.forBlock['dfplayer_play_large_folder'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.playLargeFolder(' + folder_number + ', ' + file_number + ');\n';
  return code;
};

// 循环播放文件夹
Arduino.forBlock['dfplayer_loop_folder'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.loopFolder(' + folder_number + ');\n';
  return code;
};

// 随机播放所有文件
Arduino.forBlock['dfplayer_random_all'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.randomAll();\n';
  return code;
};

// 开启循环
Arduino.forBlock['dfplayer_enable_loop'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.enableLoop();\n';
  return code;
};

// 关闭循环
Arduino.forBlock['dfplayer_disable_loop'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.disableLoop();\n';
  return code;
};

// 读取状态
Arduino.forBlock['dfplayer_read_state'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readState()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取音量
Arduino.forBlock['dfplayer_read_volume'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readVolume()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取均衡器
Arduino.forBlock['dfplayer_read_eq'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readEQ()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取文件数量
Arduino.forBlock['dfplayer_read_file_counts'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readFileCounts()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取当前文件编号
Arduino.forBlock['dfplayer_read_current_file_number'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readCurrentFileNumber()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取文件夹中的文件数量
Arduino.forBlock['dfplayer_read_file_counts_in_folder'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  var folder_number = generator.valueToCode(block, 'FOLDER', Arduino.ORDER_ATOMIC);
  
  var code = variable_name + '.readFileCountsInFolder(' + folder_number + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 检查是否有可用消息
Arduino.forBlock['dfplayer_available'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.available()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取消息类型
Arduino.forBlock['dfplayer_read_type'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.readType()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取消息参数
Arduino.forBlock['dfplayer_read'] = function(block, generator) {
  var variable_name = Arduino.nameDB_.getName(
    block.getFieldValue('NAME'),
    "VARIABLE"
  );
  
  var code = variable_name + '.read()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 简化播放音乐块(组合初始化和播放功能)
Arduino.forBlock['dfplayer_simple_play'] = function(block, generator) {
  var rx_pin = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC);
  var tx_pin = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC);
  var file_number = generator.valueToCode(block, 'FILE', Arduino.ORDER_ATOMIC);
  
  generator.addLibrary('dfplayer', '#include <DFRobotDFPlayerMini.h>');
  generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
  generator.addVariable('dfplayer_simple', 'DFRobotDFPlayerMini myDFPlayer;');
  generator.addVariable('dfplayer_simple_serial', 'SoftwareSerial myDFPlayerSerial(' + rx_pin + ', ' + tx_pin + ');');
  
  var setup_code = 'myDFPlayerSerial.begin(9600);\n';
  setup_code += 'if (!myDFPlayer.begin(myDFPlayerSerial)) {\n';
  setup_code += '  Serial.println(F("Unable to begin DFPlayer"));\n';
  setup_code += '}\n';
  setup_code += 'myDFPlayer.volume(15);\n';
  
  generator.addSetup('dfplayer_simple_setup', setup_code);
  
  var code = 'myDFPlayer.play(' + file_number + ');\n';
  return code;
};
