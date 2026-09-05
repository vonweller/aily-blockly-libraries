'use strict';

function ensureNrf54Preferences(generator) {
  generator.addLibrary('nrf54_preferences', '#include <Preferences.h>');
  generator.addObject('nrf54_preferences_object', 'Preferences nrf54Preferences;');
}

function nrf54PreferencesValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function nrf54PreferencesStatement(generator, method, args) {
  ensureNrf54Preferences(generator);
  return 'nrf54Preferences.' + method + '(' + args.join(', ') + ');\n';
}

function nrf54PreferencesOutput(generator, method, args) {
  ensureNrf54Preferences(generator);
  return ['nrf54Preferences.' + method + '(' + args.join(', ') + ')', generator.ORDER_FUNCTION_CALL];
}

Arduino.forBlock['nrf54_preferences_begin'] = function(block, generator) {
  return nrf54PreferencesStatement(generator, 'begin', [
    nrf54PreferencesValue(block, generator, 'NAMESPACE', '"storage"'),
    block.getFieldValue('READONLY') || 'false'
  ]);
};
Arduino.forBlock['nrf54_preferences_end'] = function(block, generator) { return nrf54PreferencesStatement(generator, 'end', []); };
Arduino.forBlock['nrf54_preferences_clear'] = function(block, generator) { return nrf54PreferencesStatement(generator, 'clear', []); };
Arduino.forBlock['nrf54_preferences_remove'] = function(block, generator) { return nrf54PreferencesStatement(generator, 'remove', [nrf54PreferencesValue(block, generator, 'KEY', '"key"')]); };
Arduino.forBlock['nrf54_preferences_is_key'] = function(block, generator) { return nrf54PreferencesOutput(generator, 'isKey', [nrf54PreferencesValue(block, generator, 'KEY', '"key"')]); };
Arduino.forBlock['nrf54_preferences_free_entries'] = function(block, generator) { return nrf54PreferencesOutput(generator, 'freeEntries', []); };
Arduino.forBlock['nrf54_preferences_put_number'] = function(block, generator) {
  const methods = new Set(['putChar', 'putUChar', 'putShort', 'putUShort', 'putInt', 'putUInt', 'putLong', 'putULong', 'putLong64', 'putULong64', 'putFloat', 'putDouble']);
  const method = methods.has(block.getFieldValue('TYPE')) ? block.getFieldValue('TYPE') : 'putInt';
  return nrf54PreferencesStatement(generator, method, [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'VALUE', '0')]);
};
Arduino.forBlock['nrf54_preferences_get_number'] = function(block, generator) {
  const methods = new Set(['getChar', 'getUChar', 'getShort', 'getUShort', 'getInt', 'getUInt', 'getLong', 'getULong', 'getLong64', 'getULong64', 'getFloat', 'getDouble']);
  const method = methods.has(block.getFieldValue('TYPE')) ? block.getFieldValue('TYPE') : 'getInt';
  return nrf54PreferencesOutput(generator, method, [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'DEFAULT', '0')]);
};
Arduino.forBlock['nrf54_preferences_put_bool'] = function(block, generator) { return nrf54PreferencesStatement(generator, 'putBool', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'VALUE', 'false')]); };
Arduino.forBlock['nrf54_preferences_get_bool'] = function(block, generator) { return nrf54PreferencesOutput(generator, 'getBool', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'DEFAULT', 'false')]); };
Arduino.forBlock['nrf54_preferences_put_string'] = function(block, generator) { return nrf54PreferencesStatement(generator, 'putString', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'VALUE', '""')]); };
Arduino.forBlock['nrf54_preferences_get_string'] = function(block, generator) { return nrf54PreferencesOutput(generator, 'getString', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), nrf54PreferencesValue(block, generator, 'DEFAULT', '""')]); };
Arduino.forBlock['nrf54_preferences_put_bytes'] = function(block, generator) {
  const buffer = String(block.getFieldValue('BUFFER') || 'buffer').trim() || 'buffer';
  return nrf54PreferencesStatement(generator, 'putBytes', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), buffer, nrf54PreferencesValue(block, generator, 'LENGTH', '0')]);
};
Arduino.forBlock['nrf54_preferences_get_bytes'] = function(block, generator) {
  const buffer = String(block.getFieldValue('BUFFER') || 'buffer').trim() || 'buffer';
  return nrf54PreferencesOutput(generator, 'getBytes', [nrf54PreferencesValue(block, generator, 'KEY', '"key"'), buffer, nrf54PreferencesValue(block, generator, 'MAX_LENGTH', '0')]);
};
Arduino.forBlock['nrf54_preferences_get_bytes_length'] = function(block, generator) { return nrf54PreferencesOutput(generator, 'getBytesLength', [nrf54PreferencesValue(block, generator, 'KEY', '"key"')]); };
