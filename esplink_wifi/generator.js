// Generator.js for the ESPLink WiFi library (ESP32-C3 network coprocessor)

// ---------- 公共工具 ----------

// 库引用，addLibrary自带去重
Arduino.ensureEsplinkWifiLib = function (generator) {
  generator.addLibrary('WiFi', '#include <WiFi.h>');
};

// IP地址转字符串的跨核心实现，由库自带的WiFiPlatform.h提供
Arduino.ensureEsplinkWifiPlatform = function (generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  generator.addLibrary('WiFiPlatform', '#include <WiFiPlatform.h>');
};

// WiFi.poll()负责推进链路并派发事件，必须在主程序中周期调用
Arduino.ensureEsplinkWifiPoll = function (generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  generator.addLoopBegin('esplink_wifi_poll', 'WiFi.poll();');
};

// 字符串参数统一转换，兼容文本块的字面量和String变量
Arduino.esplinkWifiCStr = function (code) {
  return 'String(' + code + ').c_str()';
};

// 变量重命名监听，初始化块共用
Arduino.esplinkWifiAttachVarMonitor = function (block, defaultName, varType) {
  if (block._esplinkWifiVarMonitorAttached) return;
  block._esplinkWifiVarMonitorAttached = true;
  const varField = block.getField('VAR');
  block._esplinkWifiVarLastName = (varField ? varField.getText() : '') || defaultName;
  registerVariableToBlockly(block._esplinkWifiVarLastName, varType);
  if (!varField) return;
  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function (newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._esplinkWifiVarLastName;
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, varType);
      block._esplinkWifiVarLastName = newName;
    }
  };
};

// 读取field_variable指向的对象名已内联到各handler：block.getField('字段').getText()
// 与 core-variables 的 variables_get 一致，发出变量原始名，不经 nameDB_ 规范化

// 文本转IPAddress的辅助函数
Arduino.ensureEsplinkWifiIpHelper = function (generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  let code = '';
  code += 'IPAddress esplinkWiFiIP(const String &text) {\n';
  code += '  IPAddress address;\n';
  code += '  if (!address.fromString(text.c_str())) address = IPAddress();\n';
  code += '  return address;\n';
  code += '}\n';
  generator.addFunction('esplinkWiFiIP', code);
};

// 取出流中已缓存的数据，不阻塞等待
Arduino.ensureEsplinkWifiReadHelper = function (generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  let code = '';
  code += 'String esplinkWiFiReadAvailable(Stream &stream) {\n';
  code += '  String data;\n';
  code += '  while (stream.available() > 0) data += (char)stream.read();\n';
  code += '  return data;\n';
  code += '}\n';
  generator.addFunction('esplinkWiFiReadAvailable', code);
};

// ---------- 连接管理 ----------

Arduino.forBlock['esplink_wifi_begin'] = function (block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiPoll(generator);

  return 'WiFi.begin(' + ssid + ', ' + password + ');\n';
};

Arduino.forBlock['esplink_wifi_begin_advanced'] = function (block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';

  Arduino.ensureEsplinkWifiPoll(generator);

  return 'WiFi.begin(' + Arduino.esplinkWifiCStr(ssid) + ', ' +
    Arduino.esplinkWifiCStr(password) + ', ' + channel + ');\n';
};

Arduino.forBlock['esplink_wifi_connect_quick'] = function (block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const timeout = block.getFieldValue('TIMEOUT') || 20000;

  Arduino.ensureEsplinkWifiPoll(generator);

  let code = '';
  code += 'bool esplinkWiFiConnect(const String &ssid, const String &password, unsigned long timeoutMs) {\n';
  code += '  WiFi.begin(ssid.c_str(), password.c_str());\n';
  code += '  if (WiFi.waitForConnectResult(timeoutMs) == WL_CONNECTED) return true;\n';
  code += '  Serial.print("WiFi连接失败，状态=");\n';
  code += '  Serial.println(WiFi.status());\n';
  code += '  return false;\n';
  code += '}\n';
  ensureSerialBegin('Serial', generator);
  generator.addFunction('esplinkWiFiConnect', code);

  return ['esplinkWiFiConnect(' + ssid + ', ' + password + ', ' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_wait_connected'] = function (block, generator) {
  const timeout = block.getFieldValue('TIMEOUT') || 20000;
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.waitForConnectResult(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_is_connected'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_status'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.status()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_status_type'] = function (block, generator) {
  const status = block.getFieldValue('STATUS') || 'WL_CONNECTED';
  Arduino.ensureEsplinkWifiLib(generator);
  return [status, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_wifi_disconnect'] = function (block, generator) {
  const radioOff = block.getFieldValue('RADIO_OFF') === 'TRUE' ? 'true' : 'false';
  const erase = block.getFieldValue('ERASE') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.disconnect(' + radioOff + ', ' + erase + ');\n';
};

Arduino.forBlock['esplink_wifi_reconnect'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.reconnect();\n';
};

Arduino.forBlock['esplink_wifi_set_auto_reconnect'] = function (block, generator) {
  const enabled = block.getFieldValue('ENABLED') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.setAutoReconnect(' + enabled + ');\n';
};

Arduino.forBlock['esplink_wifi_set_mode'] = function (block, generator) {
  const mode = block.getFieldValue('MODE') || 'WIFI_STA';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.mode(' + mode + ');\n';
};

Arduino.forBlock['esplink_wifi_get_mode'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.getMode()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_poll'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.poll();\n';
};

Arduino.forBlock['esplink_wifi_end'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.end();\n';
};

// ---------- 网络信息与配置 ----------

Arduino.forBlock['esplink_wifi_ip_info'] = function (block, generator) {
  const which = block.getFieldValue('WHICH') || 'localIP';
  Arduino.ensureEsplinkWifiPlatform(generator);

  let call = 'WiFi.localIP()';
  if (which === 'gatewayIP') call = 'WiFi.gatewayIP()';
  else if (which === 'subnetMask') call = 'WiFi.subnetMask()';
  else if (which === 'dns0') call = 'WiFi.dnsIP(0)';
  else if (which === 'dns1') call = 'WiFi.dnsIP(1)';

  return ['espwifi::addressString(' + call + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_ssid'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.SSID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_rssi'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.RSSI()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_channel'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.channel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_mac'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.macAddress()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_set_hostname'] = function (block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.setHostname(' + Arduino.esplinkWifiCStr(name) + ');\n';
};

Arduino.forBlock['esplink_wifi_get_hostname'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['String(WiFi.getHostname())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_config_static'] = function (block, generator) {
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '""';
  const gateway = generator.valueToCode(block, 'GATEWAY', generator.ORDER_ATOMIC) || '""';
  const subnet = generator.valueToCode(block, 'SUBNET', generator.ORDER_ATOMIC) || '""';
  const dns = generator.valueToCode(block, 'DNS', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiIpHelper(generator);

  return 'WiFi.config(esplinkWiFiIP(' + ip + '), esplinkWiFiIP(' + gateway +
    '), esplinkWiFiIP(' + subnet + '), esplinkWiFiIP(' + dns + '));\n';
};

Arduino.forBlock['esplink_wifi_set_dns'] = function (block, generator) {
  const dns1 = generator.valueToCode(block, 'DNS1', generator.ORDER_ATOMIC) || '""';
  const dns2 = generator.valueToCode(block, 'DNS2', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiIpHelper(generator);

  return 'WiFi.setDNS(esplinkWiFiIP(' + dns1 + '), esplinkWiFiIP(' + dns2 + '));\n';
};

Arduino.forBlock['esplink_wifi_host_by_name'] = function (block, generator) {
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiPlatform(generator);

  let code = '';
  code += 'String esplinkWiFiResolve(const String &host) {\n';
  code += '  IPAddress address;\n';
  code += '  if (WiFi.hostByName(host.c_str(), address) != 1) return String("");\n';
  code += '  return espwifi::addressString(address);\n';
  code += '}\n';
  generator.addFunction('esplinkWiFiResolve', code);

  return ['esplinkWiFiResolve(' + host + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_firmware_version'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['String(WiFi.firmwareVersion())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_last_error'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.lastError()', generator.ORDER_FUNCTION_CALL];
};

// ---------- 网络时间 ----------

Arduino.forBlock['esplink_wifi_config_time'] = function (block, generator) {
  const gmtHours = Number(block.getFieldValue('GMT_HOURS') || 0);
  const dstHours = Number(block.getFieldValue('DST_HOURS') || 0);
  const server = generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) || '"pool.ntp.org"';

  Arduino.ensureEsplinkWifiLib(generator);

  return 'WiFi.configTime(' + (gmtHours * 3600) + ', ' + (dstHours * 3600) + ', ' +
    Arduino.esplinkWifiCStr(server) + ');\n';
};

Arduino.forBlock['esplink_wifi_get_time'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['(unsigned long)WiFi.getTime()', generator.ORDER_FUNCTION_CALL];
};

// ---------- 网络扫描 ----------

Arduino.forBlock['esplink_wifi_scan_networks'] = function (block, generator) {
  const hidden = block.getFieldValue('SHOW_HIDDEN') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.scanNetworks(false, ' + hidden + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_start_async'] = function (block, generator) {
  const hidden = block.getFieldValue('SHOW_HIDDEN') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.scanNetworks(true, ' + hidden + ');\n';
};

Arduino.forBlock['esplink_wifi_scan_complete'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.scanComplete()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_ssid'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.SSID((uint8_t)(' + index + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_rssi'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.RSSI((uint8_t)(' + index + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_channel'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.channel((uint8_t)(' + index + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_encryption'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['(int)WiFi.encryptionType((uint8_t)(' + index + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_scan_delete'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.scanDelete();\n';
};

// ---------- 热点(AP)模式 ----------

Arduino.forBlock['esplink_wifi_softap'] = function (block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const channel = block.getFieldValue('CHANNEL') || 1;

  Arduino.ensureEsplinkWifiPoll(generator);

  return 'WiFi.softAP(' + Arduino.esplinkWifiCStr(ssid) + ', ' +
    Arduino.esplinkWifiCStr(password) + ', ' + channel + ');\n';
};

Arduino.forBlock['esplink_wifi_softap_config'] = function (block, generator) {
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '""';
  const gateway = generator.valueToCode(block, 'GATEWAY', generator.ORDER_ATOMIC) || '""';
  const subnet = generator.valueToCode(block, 'SUBNET', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiIpHelper(generator);

  return 'WiFi.softAPConfig(esplinkWiFiIP(' + ip + '), esplinkWiFiIP(' + gateway +
    '), esplinkWiFiIP(' + subnet + '));\n';
};

Arduino.forBlock['esplink_wifi_softap_disconnect'] = function (block, generator) {
  const radioOff = block.getFieldValue('RADIO_OFF') === 'TRUE' ? 'true' : 'false';
  Arduino.ensureEsplinkWifiLib(generator);
  return 'WiFi.softAPdisconnect(' + radioOff + ');\n';
};

Arduino.forBlock['esplink_wifi_softap_ip'] = function (block, generator) {
  Arduino.ensureEsplinkWifiPlatform(generator);
  return ['espwifi::addressString(WiFi.softAPIP())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_softap_station_num'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.softAPgetStationNum()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_wifi_softap_mac'] = function (block, generator) {
  Arduino.ensureEsplinkWifiLib(generator);
  return ['WiFi.softAPmacAddress()', generator.ORDER_FUNCTION_CALL];
};

// ---------- WiFi事件 ----------

Arduino.forBlock['esplink_wifi_on_event'] = function (block, generator) {
  const event = block.getFieldValue('EVENT') || 'ARDUINO_EVENT_MAX';
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'esplink_wifi_on_' + event.replace('ARDUINO_EVENT_', '').toLowerCase();

  Arduino.ensureEsplinkWifiPoll(generator);

  const functionDef = 'void ' + callbackName + '(WiFiEvent_t event) {\n' + handler + '}\n';
  generator.addFunction(callbackName, functionDef);

  const registration = 'WiFi.onEvent(' + callbackName + ', ' + event + ');';
  generator.addSetupBegin(callbackName + '_register', registration);

  return '';
};

// ---------- TCP客户端 ----------

Arduino.forBlock['esplink_tcp_client_create'] = function (block, generator) {
  Arduino.esplinkWifiAttachVarMonitor(block, 'client', 'WiFiClient');

  const varName = block.getFieldValue('VAR') || 'client';

  Arduino.ensureEsplinkWifiPoll(generator);
  registerVariableToBlockly(varName, 'WiFiClient');
  generator.addObject(varName, 'WiFiClient ' + varName + ';');

  return '';
};

Arduino.forBlock['esplink_tcp_client_connect'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';

  Arduino.ensureEsplinkWifiLib(generator);

  return [varName + '.connect(' + Arduino.esplinkWifiCStr(host) + ', (uint16_t)(' + port + '))',
    generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_tcp_client_connected'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['(' + varName + '.connected() != 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_tcp_client_print'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  const newline = block.getFieldValue('NEWLINE') === 'TRUE';

  Arduino.ensureEsplinkWifiLib(generator);

  return varName + (newline ? '.println(' : '.print(') + data + ');\n';
};

Arduino.forBlock['esplink_tcp_client_available'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  Arduino.ensureEsplinkWifiLib(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_tcp_client_read_string'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  Arduino.ensureEsplinkWifiReadHelper(generator);
  return ['esplinkWiFiReadAvailable(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_tcp_client_remote_ip'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  Arduino.ensureEsplinkWifiPlatform(generator);
  return ['espwifi::addressString(' + varName + '.remoteIP())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_tcp_client_stop'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'client';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.stop();\n';
};

// ---------- TLS客户端 ----------

Arduino.forBlock['esplink_tls_client_create'] = function (block, generator) {
  Arduino.esplinkWifiAttachVarMonitor(block, 'secureClient', 'WiFiClientSecure');

  const varName = block.getFieldValue('VAR') || 'secureClient';

  Arduino.ensureEsplinkWifiPoll(generator);
  registerVariableToBlockly(varName, 'WiFiClientSecure');
  generator.addObject(varName, 'WiFiClientSecure ' + varName + ';');

  return '';
};

Arduino.forBlock['esplink_tls_set_pem'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'secureClient';
  const kind = block.getFieldValue('KIND') || 'CA';
  const pem = generator.valueToCode(block, 'PEM', generator.ORDER_ATOMIC) || '""';

  Arduino.ensureEsplinkWifiLib(generator);

  const suffixes = { CA: '_ca', CERT: '_cert', KEY: '_key' };
  const setters = { CA: '.setCACert(', CERT: '.setCertificate(', KEY: '.setPrivateKey(' };
  const storage = varName + (suffixes[kind] || '_ca');

  // 库保留PEM指针直到连接完成，所以必须存放在全局String中
  generator.addObject(storage, 'String ' + storage + ';');

  let code = storage + ' = ' + pem + ';\n';
  code += varName + (setters[kind] || setters.CA) + storage + '.c_str());\n';
  return code;
};

Arduino.forBlock['esplink_tls_use_builtin_ca'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'secureClient';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.useBuiltinCACertBundle();\n';
};

Arduino.forBlock['esplink_tls_set_insecure'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'secureClient';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.setInsecure();\n';
};

// ---------- 快速HTTP ----------

Arduino.ensureEsplinkWifiHttpHelper = function (generator) {
  Arduino.ensureEsplinkWifiPoll(generator);

  let code = '';
  code += 'String esplinkWiFiHttpRequest(const String &url, const String &method, const String &body, const String &contentType) {\n';
  code += '  String rest = url;\n';
  code += '  bool secure = false;\n';
  code += '  if (rest.startsWith("https://")) { secure = true; rest = rest.substring(8); }\n';
  code += '  else if (rest.startsWith("http://")) { rest = rest.substring(7); }\n';
  code += '  String host = rest, path = "/";\n';
  code += '  const int slash = rest.indexOf(\'/\');\n';
  code += '  if (slash >= 0) { host = rest.substring(0, slash); path = rest.substring(slash); }\n';
  code += '  uint16_t port = secure ? 443 : 80;\n';
  code += '  const int colon = host.indexOf(\':\');\n';
  code += '  if (colon >= 0) { port = (uint16_t)host.substring(colon + 1).toInt(); host = host.substring(0, colon); }\n';
  code += '  WiFiClient plain;\n';
  code += '  WiFiClientSecure tls;\n';
  code += '  Client *client = secure ? (Client *)&tls : (Client *)&plain;\n';
  code += '  if (secure) tls.useBuiltinCACertBundle();\n';
  code += '  if (!client->connect(host.c_str(), port)) {\n';
  code += '    Serial.print("HTTP连接失败: ");\n';
  code += '    Serial.println(host);\n';
  code += '    return String("");\n';
  code += '  }\n';
  code += '  String request = method + " " + path + " HTTP/1.1\\r\\nHost: " + host + "\\r\\nConnection: close\\r\\n";\n';
  code += '  if (body.length() > 0) {\n';
  code += '    request += "Content-Type: " + contentType + "\\r\\n";\n';
  code += '    request += "Content-Length: " + String(body.length()) + "\\r\\n";\n';
  code += '  }\n';
  code += '  request += "\\r\\n";\n';
  code += '  client->print(request);\n';
  code += '  if (body.length() > 0) client->print(body);\n';
  code += '  String response;\n';
  code += '  const unsigned long deadline = millis() + 15000;\n';
  code += '  while ((client->connected() || client->available()) && (long)(millis() - deadline) < 0) {\n';
  code += '    while (client->available() && response.length() < 4096) response += (char)client->read();\n';
  code += '    if (response.length() >= 4096) break;\n';
  code += '    WiFi.poll();\n';
  code += '  }\n';
  code += '  client->stop();\n';
  code += '  const int split = response.indexOf("\\r\\n\\r\\n");\n';
  code += '  return split >= 0 ? response.substring(split + 4) : response;\n';
  code += '}\n';
  ensureSerialBegin('Serial', generator);
  generator.addFunction('esplinkWiFiHttpRequest', code);
};

Arduino.forBlock['esplink_http_get'] = function (block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkWifiHttpHelper(generator);
  return ['esplinkWiFiHttpRequest(' + url + ', "GET", "", "")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_http_post'] = function (block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const body = generator.valueToCode(block, 'BODY', generator.ORDER_ATOMIC) || '""';
  const contentType = block.getFieldValue('CONTENT_TYPE') || 'application/json';

  Arduino.ensureEsplinkWifiHttpHelper(generator);

  return ['esplinkWiFiHttpRequest(' + url + ', "POST", ' + body + ', "' + contentType + '")',
    generator.ORDER_FUNCTION_CALL];
};

// ---------- TCP服务器 ----------

Arduino.forBlock['esplink_tcp_server_create'] = function (block, generator) {
  Arduino.esplinkWifiAttachVarMonitor(block, 'server', 'WiFiServer');

  const varName = block.getFieldValue('VAR') || 'server';
  const port = block.getFieldValue('PORT') || 80;

  Arduino.ensureEsplinkWifiPoll(generator);
  registerVariableToBlockly(varName, 'WiFiServer');
  generator.addObject(varName, 'WiFiServer ' + varName + '(' + port + ');');

  return varName + '.begin();\n';
};

Arduino.forBlock['esplink_tcp_server_accept'] = function (block, generator) {
  const serverName = (block.getField('SERVER') && block.getField('SERVER').getText()) || 'server';
  const clientName = (block.getField('CLIENT') && block.getField('CLIENT').getText()) || 'client';

  Arduino.ensureEsplinkWifiLib(generator);
  registerVariableToBlockly(clientName, 'WiFiClient');
  generator.addObject(clientName, 'WiFiClient ' + clientName + ';');

  return clientName + ' = ' + serverName + '.available();\n';
};

Arduino.forBlock['esplink_tcp_server_write'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'server';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.print(' + data + ');\n';
};

Arduino.forBlock['esplink_tcp_server_end'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'server';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.end();\n';
};

// ---------- UDP ----------

Arduino.forBlock['esplink_udp_create'] = function (block, generator) {
  Arduino.esplinkWifiAttachVarMonitor(block, 'udp', 'WiFiUDP');

  const varName = block.getFieldValue('VAR') || 'udp';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '0';

  Arduino.ensureEsplinkWifiPoll(generator);
  registerVariableToBlockly(varName, 'WiFiUDP');
  generator.addObject(varName, 'WiFiUDP ' + varName + ';');

  return varName + '.begin((uint16_t)(' + port + '));\n';
};

Arduino.forBlock['esplink_udp_create_multicast'] = function (block, generator) {
  Arduino.esplinkWifiAttachVarMonitor(block, 'udp', 'WiFiUDP');

  const varName = block.getFieldValue('VAR') || 'udp';
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '0';

  Arduino.ensureEsplinkWifiPoll(generator);
  Arduino.ensureEsplinkWifiIpHelper(generator);
  registerVariableToBlockly(varName, 'WiFiUDP');
  generator.addObject(varName, 'WiFiUDP ' + varName + ';');

  return varName + '.beginMulticast(esplinkWiFiIP(' + ip + '), (uint16_t)(' + port + '));\n';
};

Arduino.forBlock['esplink_udp_send_to'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '0';

  Arduino.ensureEsplinkWifiLib(generator);

  let code = '';
  code += 'bool esplinkWiFiUdpSend(WiFiUDP &udp, const String &host, uint16_t port, const String &data) {\n';
  code += '  if (udp.beginPacket(host.c_str(), port) != 1) return false;\n';
  code += '  udp.print(data);\n';
  code += '  return udp.endPacket() == 1;\n';
  code += '}\n';
  generator.addFunction('esplinkWiFiUdpSend', code);

  return ['esplinkWiFiUdpSend(' + varName + ', ' + host + ', (uint16_t)(' + port + '), ' + data + ')',
    generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_udp_begin_packet'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '0';

  Arduino.ensureEsplinkWifiLib(generator);

  return ['(' + varName + '.beginPacket(' + Arduino.esplinkWifiCStr(host) + ', (uint16_t)(' + port + ')) == 1)',
    generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_udp_write'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.print(' + data + ');\n';
};

Arduino.forBlock['esplink_udp_end_packet'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  Arduino.ensureEsplinkWifiLib(generator);
  return ['(' + varName + '.endPacket() == 1)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esplink_udp_parse_packet'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  Arduino.ensureEsplinkWifiLib(generator);
  return [varName + '.parsePacket()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_udp_read_string'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  Arduino.ensureEsplinkWifiReadHelper(generator);
  return ['esplinkWiFiReadAvailable(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_udp_remote_ip'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  Arduino.ensureEsplinkWifiPlatform(generator);
  return ['espwifi::addressString(' + varName + '.remoteIP())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esplink_udp_stop'] = function (block, generator) {
  const varName = (block.getField('VAR') && block.getField('VAR').getText()) || 'udp';
  Arduino.ensureEsplinkWifiLib(generator);
  return varName + '.stop();\n';
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
