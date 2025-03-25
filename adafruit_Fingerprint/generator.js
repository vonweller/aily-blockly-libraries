Arduino.forBlock['fingerprint_begin'] = function(block, generator) {
  var baud = block.getFieldValue('BAUDRATE');
  generator.addLibrary('#include <Adafruit_Fingerprint.h>', '#include <Adafruit_Fingerprint.h>');
  generator.addVariable('Adafruit_Fingerprint finger(&Serial, 0x0);', 'Adafruit_Fingerprint finger(&Serial, 0x0);');
  generator.addSetup('finger_begin', 'finger.begin(' + baud + ');');
  return '';
};

Arduino.forBlock['fingerprint_verify'] = function(block, generator) {
  return 'finger.verifyPassword()';
};

Arduino.forBlock['fingerprint_get_image'] = function(block, generator) {
  return 'finger.getImage()';
};

Arduino.forBlock['fingerprint_image2Tz'] = function(block, generator) {
  var slot = block.getFieldValue('SLOT');
  return 'finger.image2Tz(' + slot + ')';
};

Arduino.forBlock['fingerprint_create_model'] = function(block, generator) {
  return 'finger.createModel()';
};

Arduino.forBlock['fingerprint_store_model'] = function(block, generator) {
  var id = block.getFieldValue('ID');
  return 'finger.storeModel(' + id + ');';
};

Arduino.forBlock['fingerprint_delete_model'] = function(block, generator) {
  var id = block.getFieldValue('ID');
  return 'finger.deleteModel(' + id + ');';
};

Arduino.forBlock['fingerprint_finger_fast_search'] = function(block, generator) {
  return 'finger.fingerFastSearch()';
};

Arduino.forBlock['fingerprint_LEDcontrol'] = function(block, generator) {
  var state = block.getFieldValue('STATE');
  var on = (state === 'ON') ? 'true' : 'false';
  return 'finger.LEDcontrol(' + on + ');';
};

Arduino.forBlock['fingerprint_get_template_count'] = function(block, generator) {
  return 'finger.getTemplateCount()';
};