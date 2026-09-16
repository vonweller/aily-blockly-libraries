// Generator.js for the ESPLink BLE library (ArduinoBLE host over an ESP32-C3 controller)

// ---------- 公共工具 ----------

// 库引用，addLibrary自带去重。BLE.h同时引入ESPLink
Arduino.ensureEsplinkBleLib = function (generator) {
  generator.addLibrary('BLE', '#include <BLE.h>');
};

// BLE.poll()负责推进主机协议栈并执行回调
Arduino.ensureEsplinkBlePoll = function (generator) {
  Arduino.ensureEsplinkBleLib(generator);
  generator.addLoopBegin('esplink_ble_poll', 'BLE.poll();');
};

// 字符串参数统一转换，兼容文本块的字面量和String变量
Arduino.esplinkBleCStr = function (code) {
  return 'String(' + code + ').c_str()';
};

// 变量重命名监听，创建类块共用
Arduino.esplinkBleAttachVarMonitor = function (block, defaultName, varType) {
  if (block._esplinkBleVarMonitorAttached) return;
  block._esplinkBleVarMonitorAttached = true;
  block._esplinkBleVarLastName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(block._esplinkBleVarLastName, varType);
  const varField = block.getField('VAR');
  if (!varField) return;
  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function (newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._esplinkBleVarLastName;
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, varType);
      block._esplinkBleVarLastName = newName;
    }
  };
};

// 读取field_variable指向的对象名
Arduino.esplinkBleVarName = function (block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
};

// 由复选框拼出特征属性掩码，至少保留可读
Arduino.esplinkBleProperties = function (block) {
  const flags = [];
  if (block.getFieldValue('READ') === 'TRUE') flags.push('BLERead');
  if (block.getFieldValue('WRITE') === 'TRUE') flags.push('BLEWrite');
  if (block.getFieldValue('NOTIFY') === 'TRUE') flags.push('BLENotify');
  if (block.getFieldValue('INDICATE') === 'TRUE') flags.push('BLEIndicate');
  return flags.length > 0 ? flags.join(' | ') : 'BLERead';
};

// 对端特征是通用BLECharacteristic，读取需要按长度还原
Arduino.ensureEsplinkBleReadHelpers = function (generator) {
  Arduino.ensureEsplinkBleLib(generator);

  let numberCode = '';
  numberCode += 'long esplinkBleReadNumber(BLECharacteristic &characteristic) {\n';
  numberCode += '  const int length = characteristic.valueLength();\n';
  numberCode += '  if (length >= 4) { uint32_t value = 0; characteristic.readValue(value); return (long)value; }\n';
  numberCode += '  if (length >= 2) { uint16_t value = 0; characteristic.readValue(value); return (long)value; }\n';
  numberCode += '  if (length >= 1) { uint8_t value = 0; characteristic.readValue(value); return (long)value; }\n';
  numberCode += '  return 0;\n';
  numberCode += '}\n';
  generator.addFunction('esplinkBleReadNumber', numberCode);

  let stringCode = '';
  stringCode += 'String esplinkBleReadString(BLECharacteristic &characteristic) {\n';
  stringCode += '  String text;\n';
  stringCode += '  const uint8_t *data = characteristic.value();\n';
  stringCode += '  const int length = characteristic.valueLength();\n';
  stringCode += '  for (int index = 0; index < length; index++) text += (char)data[index];\n';
  stringCode += '  return text;\n';
  stringCode += '}\n';
  generator.addFunction('esplinkBleReadString', stringCode);
};

// ---------- 初始化与链路 ----------

Arduino.forBlock['esplink_ble_begin'] = function (block, generator) {
  Arduino.ensureEsplinkBlePoll(generator);
  ensureSerialBegin('Serial', generator);

  // 原先丢弃了 BLE.begin() 的返回值，控制器起不来时用户看不到任何提示
  let code = 'if (!BLE.begin()) {\n';
  code += '  Serial.print("BLE启动失败，错误码=");\n';
  code += '  Serial.println(BLEESPLink.lastError());\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esplink_ble_end'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.end();\n';
};

Arduino.forBlock['esplink_ble_poll'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.poll();\n';
};

Arduino.forBlock['esplink_ble_connected'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return ['BLE.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_address'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return ['BLE.address()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_disconnect'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.disconnect();\n';
};

Arduino.forBlock['esplink_ble_set_timeout'] = function (block, generator) {
  const timeout = block.getFieldValue('TIMEOUT') || 3000;
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.setTimeout(' + timeout + ');\n';
};

Arduino.forBlock['esplink_ble_healthy'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return ['BLEESPLink.healthy()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_last_error'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return ['BLEESPLink.lastError()', generator.ORDER_FUNCTION_CALL];
};

// ---------- 外设：服务与特征 ----------

Arduino.forBlock['esplink_ble_create_service'] = function (block, generator) {
  Arduino.esplinkBleAttachVarMonitor(block, 'bleService', 'BLEService');

  const varName = block.getFieldValue('VAR') || 'bleService';
  const uuid = block.getFieldValue('UUID') || '';

  Arduino.ensureEsplinkBlePoll(generator);
  registerVariableToBlockly(varName, 'BLEService');
  generator.addObject(varName, 'BLEService ' + varName + '("' + uuid + '");');

  return '';
};

Arduino.forBlock['esplink_ble_create_characteristic'] = function (block, generator) {
  Arduino.esplinkBleAttachVarMonitor(block, 'bleValue', 'BLECharacteristic');

  const varName = block.getFieldValue('VAR') || 'bleValue';
  const uuid = block.getFieldValue('UUID') || '';
  const type = block.getFieldValue('TYPE') || 'BLEIntCharacteristic';
  const properties = Arduino.esplinkBleProperties(block);

  Arduino.ensureEsplinkBlePoll(generator);
  registerVariableToBlockly(varName, 'BLECharacteristic');
  generator.addObject(varName, type + ' ' + varName + '("' + uuid + '", ' + properties + ');');

  return '';
};

Arduino.forBlock['esplink_ble_create_string_characteristic'] = function (block, generator) {
  Arduino.esplinkBleAttachVarMonitor(block, 'bleText', 'BLECharacteristic');

  const varName = block.getFieldValue('VAR') || 'bleText';
  const uuid = block.getFieldValue('UUID') || '';
  const size = block.getFieldValue('SIZE') || 32;
  const properties = Arduino.esplinkBleProperties(block);

  Arduino.ensureEsplinkBlePoll(generator);
  registerVariableToBlockly(varName, 'BLECharacteristic');
  generator.addObject(varName, 'BLEStringCharacteristic ' + varName + '("' + uuid + '", ' + properties + ', ' + size + ');');

  return '';
};

Arduino.forBlock['esplink_ble_service_add_characteristic'] = function (block, generator) {
  const serviceName = Arduino.esplinkBleVarName(block, 'SERVICE', 'bleService');
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  Arduino.ensureEsplinkBleLib(generator);
  return serviceName + '.addCharacteristic(' + charName + ');\n';
};

Arduino.forBlock['esplink_ble_add_service'] = function (block, generator) {
  const serviceName = Arduino.esplinkBleVarName(block, 'SERVICE', 'bleService');
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.addService(' + serviceName + ');\n';
};

Arduino.forBlock['esplink_ble_set_local_name'] = function (block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkBleLib(generator);
  // 广播数据保存的是字符串指针，必须放在全局变量中
  generator.addObject('esplink_ble_local_name', 'String esplink_ble_local_name;');

  let code = 'esplink_ble_local_name = ' + name + ';\n';
  code += 'BLE.setLocalName(esplink_ble_local_name.c_str());\n';
  return code;
};

Arduino.forBlock['esplink_ble_set_device_name'] = function (block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkBleLib(generator);
  generator.addObject('esplink_ble_device_name', 'String esplink_ble_device_name;');

  let code = 'esplink_ble_device_name = ' + name + ';\n';
  code += 'BLE.setDeviceName(esplink_ble_device_name.c_str());\n';
  return code;
};

Arduino.forBlock['esplink_ble_set_advertised_service'] = function (block, generator) {
  const serviceName = Arduino.esplinkBleVarName(block, 'SERVICE', 'bleService');
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.setAdvertisedService(' + serviceName + ');\n';
};

Arduino.forBlock['esplink_ble_advertise'] = function (block, generator) {
  Arduino.ensureEsplinkBlePoll(generator);
  return 'BLE.advertise();\n';
};

Arduino.forBlock['esplink_ble_stop_advertise'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.stopAdvertise();\n';
};

Arduino.forBlock['esplink_ble_set_advertising_interval'] = function (block, generator) {
  const interval = Number(block.getFieldValue('INTERVAL') || 100);
  // 协议单位为0.625毫秒
  const units = Math.max(32, Math.round(interval / 0.625));
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.setAdvertisingInterval(' + units + ');\n';
};

Arduino.forBlock['esplink_ble_set_connectable'] = function (block, generator) {
  const enabled = block.getFieldValue('ENABLED') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.setConnectable(' + enabled + ');\n';
};

// ---------- 本机特征读写 ----------

Arduino.forBlock['esplink_ble_char_write_number'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkBleLib(generator);
  return charName + '.writeValue(' + value + ');\n';
};

Arduino.forBlock['esplink_ble_char_write_string'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleText');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkBleLib(generator);
  return charName + '.writeValue(String(' + value + '));\n';
};

Arduino.forBlock['esplink_ble_char_value_number'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.value()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_char_value_string'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleText');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.value()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_char_written'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.written()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_char_subscribed'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.subscribed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_on_char_written'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'bleValue');
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'esplink_ble_written_' + charName;

  Arduino.ensureEsplinkBlePoll(generator);

  const functionDef = 'void ' + callbackName + '(BLEDevice device, BLECharacteristic characteristic) {\n' + handler + '}\n';
  generator.addFunction(callbackName, functionDef);

  const registration = charName + '.setEventHandler(BLEWritten, ' + callbackName + ');';
  generator.addSetupEnd(callbackName + '_register', registration);

  return '';
};

Arduino.forBlock['esplink_ble_on_device_event'] = function (block, generator) {
  const event = block.getFieldValue('EVENT') || 'BLEConnected';
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'esplink_ble_event_' + event.toLowerCase();

  Arduino.ensureEsplinkBlePoll(generator);

  const functionDef = 'void ' + callbackName + '(BLEDevice device) {\n' + handler + '}\n';
  generator.addFunction(callbackName, functionDef);

  const registration = 'BLE.setEventHandler(' + event + ', ' + callbackName + ');';
  generator.addSetupEnd(callbackName + '_register', registration);

  return '';
};

// ---------- 中心模式 ----------

Arduino.forBlock['esplink_ble_scan'] = function (block, generator) {
  Arduino.ensureEsplinkBlePoll(generator);
  return 'BLE.scan();\n';
};

Arduino.forBlock['esplink_ble_scan_for'] = function (block, generator) {
  const mode = block.getFieldValue('MODE') || 'scanForUuid';
  const filter = generator.valueToCode(block, 'FILTER', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkBlePoll(generator);

  return 'BLE.' + mode + '(String(' + filter + '));\n';
};

Arduino.forBlock['esplink_ble_stop_scan'] = function (block, generator) {
  Arduino.ensureEsplinkBleLib(generator);
  return 'BLE.stopScan();\n';
};

Arduino.forBlock['esplink_ble_device_create'] = function (block, generator) {
  Arduino.esplinkBleAttachVarMonitor(block, 'peer', 'BLEDevice');

  const varName = block.getFieldValue('VAR') || 'peer';

  Arduino.ensureEsplinkBlePoll(generator);
  registerVariableToBlockly(varName, 'BLEDevice');
  generator.addObject(varName, 'BLEDevice ' + varName + ';');

  return varName + ' = BLE.available();\n';
};

Arduino.forBlock['esplink_ble_device_found'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return ['((bool)' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_ble_device_connect'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.connect()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_device_discover'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.discoverAttributes()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_device_connected'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_device_disconnect'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return varName + '.disconnect();\n';
};

Arduino.forBlock['esplink_ble_device_address'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.address()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_device_local_name'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.localName()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_device_rssi'] = function (block, generator) {
  const varName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  Arduino.ensureEsplinkBleLib(generator);
  return [varName + '.rssi()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_remote_char_create'] = function (block, generator) {
  Arduino.esplinkBleAttachVarMonitor(block, 'remoteValue', 'BLERemoteCharacteristic');

  const deviceName = Arduino.esplinkBleVarName(block, 'DEV', 'peer');
  const varName = block.getFieldValue('VAR') || 'remoteValue';
  const uuid = block.getFieldValue('UUID') || '';

  Arduino.ensureEsplinkBlePoll(generator);
  registerVariableToBlockly(varName, 'BLERemoteCharacteristic');
  generator.addObject(varName, 'BLECharacteristic ' + varName + ';');

  return varName + ' = ' + deviceName + '.characteristic("' + uuid + '");\n';
};

Arduino.forBlock['esplink_ble_remote_can'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  const what = block.getFieldValue('WHAT') || 'valid';

  Arduino.ensureEsplinkBleLib(generator);

  if (what === 'valid') return ['((bool)' + charName + ')', generator.ORDER_ATOMIC];
  return [charName + '.' + what + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_remote_read'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  Arduino.ensureEsplinkBleLib(generator);
  return charName + '.read();\n';
};

Arduino.forBlock['esplink_ble_remote_value_number'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  Arduino.ensureEsplinkBleReadHelpers(generator);
  return ['esplinkBleReadNumber(' + charName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_remote_value_string'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  Arduino.ensureEsplinkBleReadHelpers(generator);
  return ['esplinkBleReadString(' + charName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_remote_write_number'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkBleLib(generator);
  return charName + '.writeValue((uint32_t)(' + value + '));\n';
};

Arduino.forBlock['esplink_ble_remote_write_string'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkBleLib(generator);
  return charName + '.writeValue(' + Arduino.esplinkBleCStr(value) + ');\n';
};

Arduino.forBlock['esplink_ble_remote_subscribe'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.subscribe()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ble_remote_value_updated'] = function (block, generator) {
  const charName = Arduino.esplinkBleVarName(block, 'CHAR', 'remoteValue');
  Arduino.ensureEsplinkBleLib(generator);
  return [charName + '.valueUpdated()', generator.ORDER_FUNCTION_CALL];
};

// ---------- ESPLink 链路（与BLE/WiFi库共用，两个库中定义一致） ----------

// 统一的库引用，addLibrary自带去重
Arduino.ensureESPLinkLib = function (generator) {
  generator.addLibrary('ESPLink', '#include <ESPLink.h>');
};

// 主程序中推进协作式传输
Arduino.ensureESPLinkPoll = function (generator) {
  generator.addLoopBegin('esplink_poll', 'ESPLink.poll();');
};

Arduino.forBlock['esplink_begin'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  Arduino.ensureESPLinkPoll(generator);
  return 'ESPLink.begin();\n';
};

Arduino.forBlock['esplink_begin_serial'] = function (block, generator) {
  const serial = block.getFieldValue('SERIAL') || 'Serial';
  const baud = block.getFieldValue('BAUD') || '921600';

  Arduino.ensureESPLinkLib(generator);
  Arduino.ensureESPLinkPoll(generator);

  return 'ESPLink.begin(' + serial + ', ' + baud + ');\n';
};

Arduino.forBlock['esplink_bind_stream'] = function (block, generator) {
  const serial = block.getFieldValue('SERIAL') || 'Serial';

  Arduino.ensureESPLinkLib(generator);
  Arduino.ensureESPLinkPoll(generator);

  return 'ESPLink.begin(static_cast<Stream &>(' + serial + '));\n';
};

Arduino.forBlock['esplink_end'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return 'ESPLink.end();\n';
};

Arduino.forBlock['esplink_poll'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return 'ESPLink.poll();\n';
};

Arduino.forBlock['esplink_ready'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.ready()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_ping'] = function (block, generator) {
  const timeout = block.getFieldValue('TIMEOUT') || 1000;
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.ping(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_session'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.session()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_last_error'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.lastError()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_error_code'] = function (block, generator) {
  const code = block.getFieldValue('CODE') || 'c3::Ok';
  Arduino.ensureESPLinkLib(generator);
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_firmware_version'] = function (block, generator) {
  Arduino.ensureESPLinkLib(generator);
  return ['String(ESPLink.capabilities().firmwareVersion)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_capability'] = function (block, generator) {
  const item = block.getFieldValue('ITEM') || 'maxPayload';
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.capabilities().' + item, generator.ORDER_MEMBER];
};

Arduino.forBlock['esplink_has_feature'] = function (block, generator) {
  const feature = block.getFieldValue('FEATURE') || 'c3::WiFi';
  Arduino.ensureESPLinkLib(generator);
  return ['((ESPLink.capabilities().features & ' + feature + ') != 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_stat'] = function (block, generator) {
  const item = block.getFieldValue('ITEM') || 'retries';
  Arduino.ensureESPLinkLib(generator);
  return ['ESPLink.stats().' + item, generator.ORDER_MEMBER];
};
