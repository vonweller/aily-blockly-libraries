'use strict';

function nrf54ThreadValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function ensureNrf54Thread(generator) {
  generator.addLibrary('nrf54_thread', '#include <nrf54_thread_experimental.h>');
  generator.addObject('nrf54_thread_using', 'using xiao_nrf54l15::Nrf54ThreadExperimental;');
  generator.addObject('nrf54_thread_object', 'Nrf54ThreadExperimental nrf54Thread;');
  generator.addLoopBegin('nrf54_thread_process', 'nrf54Thread.process();');
}
function ensureNrf54ThreadUdpState(generator) {
  ensureNrf54Thread(generator);
  generator.addVariable('nrf54_thread_udp_data_var', 'String nrf54ThreadUdpData;');
  generator.addVariable('nrf54_thread_udp_peer_var', 'String nrf54ThreadUdpPeerAddress;');
  generator.addVariable('nrf54_thread_udp_port_var', 'uint16_t nrf54ThreadUdpPeerPort = 0U;');
}
function ensureNrf54ThreadStateState(generator) {
  ensureNrf54Thread(generator);
  generator.addVariable('nrf54_thread_callback_role_var', 'String nrf54ThreadCallbackRole;');
  generator.addVariable('nrf54_thread_callback_flags_var', 'uint32_t nrf54ThreadCallbackFlags = 0U;');
}

Arduino.forBlock['nrf54_thread_begin'] = function(block, generator) {
  ensureNrf54Thread(generator);
  const allowed = new Set(['begin', 'beginAsChild', 'beginAsRouter', 'beginChildFirst', 'beginJoinerOnly', 'beginAsSleepyChild']);
  const policy = allowed.has(block.getFieldValue('POLICY')) ? block.getFieldValue('POLICY') : 'begin';
  return 'nrf54Thread.' + policy + '(' + (block.getFieldValue('WIPE') || 'false') + ');\n';
};
Arduino.forBlock['nrf54_thread_stop'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.stop();\n'; };
Arduino.forBlock['nrf54_thread_restart'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.restart(' + (block.getFieldValue('WIPE') || 'false') + ');\n'; };
Arduino.forBlock['nrf54_thread_wipe_settings'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.wipePersistentSettings();\n'; };
Arduino.forBlock['nrf54_thread_use_demo_dataset'] = function(block, generator) {
  ensureNrf54Thread(generator);
  generator.addFunction('nrf54_thread_demo_dataset_helper',
    'bool nrf54ThreadUseDemoDataset() {\n  otOperationalDataset dataset{};\n  Nrf54ThreadExperimental::buildDemoDataset(&dataset);\n  return nrf54Thread.setActiveDataset(dataset);\n}');
  return 'nrf54ThreadUseDemoDataset();\n';
};
Arduino.forBlock['nrf54_thread_set_dataset_hex'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.setActiveDatasetHex(String(' + nrf54ThreadValue(block, generator, 'DATASET', '""') + ').c_str());\n'; };
Arduino.forBlock['nrf54_thread_set_router_eligible'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.setRouterEligible(' + (block.getFieldValue('ENABLED') || 'true') + ');\n'; };
Arduino.forBlock['nrf54_thread_request_router'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.requestRouterRole();\n'; };
Arduino.forBlock['nrf54_thread_set_poll_period'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.setPollPeriod((uint32_t)(' + nrf54ThreadValue(block, generator, 'POLL_MS', '1000') + '));\n'; };
Arduino.forBlock['nrf54_thread_started'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.started()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_attached'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.attached()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_role_name'] = function(block, generator) { ensureNrf54Thread(generator); return ['String(nrf54Thread.roleName())', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_rloc16'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.rloc16()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_partition_id'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.partitionId()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_dataset_configured'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.datasetConfigured()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_last_error'] = function(block, generator) { ensureNrf54Thread(generator); return ['(int)nrf54Thread.lastError()', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nrf54_thread_commissioner_start'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.startCommissioner();\n'; };
Arduino.forBlock['nrf54_thread_commissioner_stop'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.stopCommissioner();\n'; };
Arduino.forBlock['nrf54_thread_commissioner_add_joiner'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.addJoinerToCommissioner(String(' + nrf54ThreadValue(block, generator, 'PSKD', '"J01NME"') + ').c_str(), (uint32_t)(' + nrf54ThreadValue(block, generator, 'SECONDS', '120') + '));\n'; };
Arduino.forBlock['nrf54_thread_commissioner_active'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.commissionerActive()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_joiner_start'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.startJoiner(String(' + nrf54ThreadValue(block, generator, 'PSKD', '"J01NME"') + ').c_str());\n'; };
Arduino.forBlock['nrf54_thread_joiner_stop'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.stopJoiner();\n'; };
Arduino.forBlock['nrf54_thread_joiner_active'] = function(block, generator) { ensureNrf54Thread(generator); return ['nrf54Thread.joinerActive()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_joiner_state'] = function(block, generator) { ensureNrf54Thread(generator); return ['String(nrf54Thread.joinerStateName())', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_thread_open_udp'] = function(block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  ensureNrf54ThreadUdpState(generator);
  generator.addFunction('nrf54_thread_udp_callback',
    'void nrf54ThreadUdpCallback(void* context, const uint8_t* payload, uint16_t length, const otMessageInfo& info) {\n' +
    '  (void)context;\n  nrf54ThreadUdpData = "";\n  nrf54ThreadUdpData.reserve(length);\n' +
    '  for (uint16_t i = 0; i < length; ++i) nrf54ThreadUdpData += (char)payload[i];\n' +
    '  char address[OT_IP6_ADDRESS_STRING_SIZE] = {0};\n  otIp6AddressToString(&info.mPeerAddr, address, sizeof(address));\n' +
    '  nrf54ThreadUdpPeerAddress = address;\n  nrf54ThreadUdpPeerPort = info.mPeerPort;\n' + handler + '\n}');
  return 'nrf54Thread.openUdp((uint16_t)(' + nrf54ThreadValue(block, generator, 'LOCAL_PORT', '12345') + '), nrf54ThreadUdpCallback, nullptr);\n';
};
Arduino.forBlock['nrf54_thread_close_udp'] = function(block, generator) { ensureNrf54Thread(generator); return 'nrf54Thread.closeUdp((uint16_t)(' + nrf54ThreadValue(block, generator, 'LOCAL_PORT', '12345') + '));\n'; };
Arduino.forBlock['nrf54_thread_send_udp'] = function(block, generator) {
  ensureNrf54Thread(generator);
  generator.addFunction('nrf54_thread_send_udp_helper',
    'bool nrf54ThreadSendUdp(uint16_t localPort, const String& peerText, uint16_t peerPort, const String& data) {\n' +
    '  otIp6Address peer{};\n  if (otIp6AddressFromString(peerText.c_str(), &peer) != OT_ERROR_NONE) return false;\n' +
    '  return nrf54Thread.sendUdpFrom(localPort, peer, peerPort, data.c_str(), (uint16_t)data.length());\n}');
  return ['nrf54ThreadSendUdp((uint16_t)(' + nrf54ThreadValue(block, generator, 'LOCAL_PORT', '12345') + '), String(' + nrf54ThreadValue(block, generator, 'PEER_ADDRESS', '"ff03::1"') + '), (uint16_t)(' + nrf54ThreadValue(block, generator, 'PEER_PORT', '12345') + '), String(' + nrf54ThreadValue(block, generator, 'DATA', '""') + '))', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nrf54_thread_udp_data'] = function(block, generator) { ensureNrf54ThreadUdpState(generator); return ['nrf54ThreadUdpData', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nrf54_thread_udp_peer_address'] = function(block, generator) { ensureNrf54ThreadUdpState(generator); return ['nrf54ThreadUdpPeerAddress', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nrf54_thread_udp_peer_port'] = function(block, generator) { ensureNrf54ThreadUdpState(generator); return ['nrf54ThreadUdpPeerPort', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nrf54_thread_on_state_changed'] = function(block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  ensureNrf54ThreadStateState(generator);
  generator.addFunction('nrf54_thread_state_callback',
    'void nrf54ThreadStateCallback(void* context, otChangedFlags flags, Nrf54ThreadExperimental::Role role) {\n' +
    '  (void)context;\n  nrf54ThreadCallbackFlags = (uint32_t)flags;\n  nrf54ThreadCallbackRole = Nrf54ThreadExperimental::roleName(role);\n' + handler + '\n}');
  generator.addSetupEnd('nrf54_thread_state_callback_setup', 'nrf54Thread.setStateChangedCallback(nrf54ThreadStateCallback, nullptr);');
  return '';
};
Arduino.forBlock['nrf54_thread_callback_role'] = function(block, generator) { ensureNrf54ThreadStateState(generator); return ['nrf54ThreadCallbackRole', generator.ORDER_ATOMIC]; };
Arduino.forBlock['nrf54_thread_callback_flags'] = function(block, generator) { ensureNrf54ThreadStateState(generator); return ['nrf54ThreadCallbackFlags', generator.ORDER_ATOMIC]; };
