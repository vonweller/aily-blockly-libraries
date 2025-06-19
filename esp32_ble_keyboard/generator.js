// BLE键盘库初始化函数
function initBLEKeyboardLibrary(generator) {
  generator.addLibrary('include_BleKeyboard', '#include <BleKeyboard.h>');
  generator.addObject('BleKeyboard_bleKeyboard;', 'BleKeyboard bleKeyboard;');
}

// BLE键盘库初始化函数（带设备名称）
function initBLEKeyboardLibraryWithName(generator, deviceName) {
  generator.addLibrary('include_BleKeyboard', '#include <BleKeyboard.h>');
  generator.addObject('BleKeyboard_bleKeyboard;', 'BleKeyboard bleKeyboard("' + deviceName + '");');
}

Arduino.forBlock['ble_keyboard_begin'] = function (block, generator) {
  var deviceName = block.getFieldValue('DEVICE_NAME') || 'ESP32 Keyboard';
  initBLEKeyboardLibraryWithName(generator, deviceName);
  generator.addSetupBegin('ble_keyboard_begin', 'bleKeyboard.begin();');
  return '';
};

Arduino.forBlock['ble_keyboard_end'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  return 'bleKeyboard.end();\n';
};

Arduino.forBlock['ble_keyboard_is_connected'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  return ['bleKeyboard.isConnected()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['ble_keyboard_print'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.print(' + text + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_press'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.press(' + processKey(key) + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_release'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.release(' + processKey(key) + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_release_all'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.releaseAll();\n}\n';
};

Arduino.forBlock['ble_keyboard_special_key'] = function (block, generator) {
  var key = block.getFieldValue('KEY');
  return [key, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['ble_keyboard_write'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.write(' + processKey(key) + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_media_key'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var mediaKey = block.getFieldValue('MEDIA_KEY');
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.write(' + mediaKey + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_consumer_key'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var consumerKey = block.getFieldValue('CONSUMER_KEY');
  return 'if (bleKeyboard.isConnected()) {\n  bleKeyboard.write(' + consumerKey + ');\n}\n';
};

Arduino.forBlock['ble_keyboard_set_battery_level'] = function (block, generator) {
  initBLEKeyboardLibrary(generator);
  var level = block.getFieldValue('LEVEL') || 100;
  return 'bleKeyboard.setBatteryLevel(' + level + ');\n';
};

// 处理按键输入的辅助函数
function processKey(key) {
  // 移除引号并获取内容
  var cleanKey = key.replace(/^["']|["']$/g, '');
  
  // 如果是单个字符，使用单引号包围
  if (cleanKey.length === 1) {
    return "'" + cleanKey + "'";
  }
  
  // 如果是多字符字符串，保持双引号
  if (cleanKey.length > 1) {
    return '"' + cleanKey + '"';
  }
  
  // 默认返回空字符
  return '""';
}
