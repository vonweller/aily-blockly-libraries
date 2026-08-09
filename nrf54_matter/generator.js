'use strict';

function nrf54MatterValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function ensureNrf54Matter(generator) {
  generator.addLibrary('nrf54_matter', '#include <matter_onnetwork_onoff_light.h>');
  generator.addObject('nrf54_matter_using', 'using namespace xiao_nrf54l15;');
  generator.addObject('nrf54_matter_object', 'Nrf54MatterOnNetworkOnOffLightNode nrf54Matter;');
  generator.addLoopBegin('nrf54_matter_process', 'nrf54Matter.process();');
}
function ensureNrf54MatterStringHelpers(generator) {
  ensureNrf54Matter(generator);
  generator.addFunction('nrf54_matter_manual_code_helper',
    'String nrf54MatterManualCode() {\n  char value[kMatterManualPairingLongCodeLength + 1U] = {0};\n  if (!nrf54Matter.manualPairingCode(value, sizeof(value))) return String();\n  return String(value);\n}');
  generator.addFunction('nrf54_matter_qr_code_helper',
    'String nrf54MatterQrCode() {\n  char value[kMatterQrCodeTextLength + 1U] = {0};\n  if (!nrf54Matter.qrCode(value, sizeof(value))) return String();\n  return String(value);\n}');
}

Arduino.forBlock['nrf54_matter_begin'] = function(block, generator) {
  ensureNrf54Matter(generator);
  generator.addObject('nrf54_matter_config', 'MatterOnNetworkOnOffLightConfig nrf54MatterConfig;');
  return 'nrf54MatterConfig.useDemoDataset = ' + (block.getFieldValue('DEMO') || 'true') + ';\n' +
    'nrf54MatterConfig.wipeThreadSettings = ' + (block.getFieldValue('WIPE') || 'false') + ';\n' +
    'nrf54MatterConfig.autoRequestRouterRole = ' + (block.getFieldValue('ROUTER') || 'false') + ';\n' +
    'nrf54MatterConfig.autoOpenCommissioningWindow = ' + (block.getFieldValue('AUTO_WINDOW') || 'true') + ';\n' +
    'nrf54MatterConfig.commissioningWindowSeconds = (uint16_t)(' + nrf54MatterValue(block, generator, 'SECONDS', '900') + ');\n' +
    'nrf54Matter.begin(&nrf54MatterConfig);\n';
};
Arduino.forBlock['nrf54_matter_end'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.end();\n'; };
Arduino.forBlock['nrf54_matter_use_demo_dataset'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.useDemoThreadDataset();\n'; };
Arduino.forBlock['nrf54_matter_set_dataset_hex'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.useThreadDatasetHex(String(' + nrf54MatterValue(block, generator, 'DATASET', '""') + ').c_str(), ' + (block.getFieldValue('PERSIST') || 'true') + ');\n'; };
Arduino.forBlock['nrf54_matter_factory_reset'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.factoryReset();\n'; };
Arduino.forBlock['nrf54_matter_ready'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.readyForOnNetworkCommissioning()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_open_window'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.openCommissioningWindow((uint16_t)(' + nrf54MatterValue(block, generator, 'SECONDS', '900') + '));\n'; };
Arduino.forBlock['nrf54_matter_close_window'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.closeCommissioningWindow();\n'; };
Arduino.forBlock['nrf54_matter_window_open'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.commissioningWindowOpen()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_window_remaining'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.commissioningWindowSecondsRemaining()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_manual_code'] = function(block, generator) { ensureNrf54MatterStringHelpers(generator); return ['nrf54MatterManualCode()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_qr_code'] = function(block, generator) { ensureNrf54MatterStringHelpers(generator); return ['nrf54MatterQrCode()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_light_set'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().setOn(' + (block.getFieldValue('ON') || 'true') + ', ' + (block.getFieldValue('PERSIST') || 'true') + ');\n'; };
Arduino.forBlock['nrf54_matter_light_toggle'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().toggle(' + (block.getFieldValue('PERSIST') || 'true') + ');\n'; };
Arduino.forBlock['nrf54_matter_light_is_on'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.light().on()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_light_set_level'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().setLevel((uint8_t)(' + nrf54MatterValue(block, generator, 'LEVEL', '254') + '), ' + (block.getFieldValue('PERSIST') || 'true') + ');\n'; };
Arduino.forBlock['nrf54_matter_light_move_level'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().moveToLevel((uint8_t)(' + nrf54MatterValue(block, generator, 'LEVEL', '254') + '), (uint16_t)(' + nrf54MatterValue(block, generator, 'TRANSITION_MS', '500') + '));\n'; };
Arduino.forBlock['nrf54_matter_light_level'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.light().level()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_identify'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().setIdentifyTimeSeconds((uint16_t)(' + nrf54MatterValue(block, generator, 'IDENTIFY_SECONDS', '30') + '));\n'; };
Arduino.forBlock['nrf54_matter_stop_identify'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().stopIdentify();\n'; };
Arduino.forBlock['nrf54_matter_identifying'] = function(block, generator) { ensureNrf54Matter(generator); return ['nrf54Matter.light().identifying()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_matter_startup_behavior'] = function(block, generator) {
  ensureNrf54Matter(generator);
  const allowed = new Set(['kForceOff', 'kForceOn', 'kTogglePrevious', 'kRestorePrevious']);
  const behavior = allowed.has(block.getFieldValue('BEHAVIOR')) ? block.getFieldValue('BEHAVIOR') : 'kRestorePrevious';
  return 'nrf54Matter.light().setStartUpBehavior(MatterOnOffLightStartUpBehavior::' + behavior + ', ' + (block.getFieldValue('PERSIST') || 'true') + ');\n';
};
Arduino.forBlock['nrf54_matter_save_state'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().savePersistentState();\n'; };
Arduino.forBlock['nrf54_matter_clear_state'] = function(block, generator) { ensureNrf54Matter(generator); return 'nrf54Matter.light().clearPersistentState();\n'; };
Arduino.forBlock['nrf54_matter_on_light_change'] = function(block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  ensureNrf54Matter(generator);
  generator.addFunction('nrf54_matter_light_callback', 'void nrf54MatterLightCallback(void* context, bool on) {\n  (void)context;\n  (void)on;\n' + handler + '\n}');
  generator.addSetupEnd('nrf54_matter_light_callback_setup', 'nrf54Matter.light().setOnChangeCallback(nrf54MatterLightCallback, nullptr);');
  return '';
};
Arduino.forBlock['nrf54_matter_on_identify_change'] = function(block, generator) {
  const handler = generator.statementToCode(block, 'HANDLER') || '';
  ensureNrf54Matter(generator);
  generator.addFunction('nrf54_matter_identify_callback', 'void nrf54MatterIdentifyCallback(void* context, bool active, uint16_t remainingSeconds) {\n  (void)context;\n  (void)active;\n  (void)remainingSeconds;\n' + handler + '\n}');
  generator.addSetupEnd('nrf54_matter_identify_callback_setup', 'nrf54Matter.light().setIdentifyCallback(nrf54MatterIdentifyCallback, nullptr);');
  return '';
};
