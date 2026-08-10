'use strict';

function ensureNrf54Eeprom(generator) {
  generator.addLibrary('nrf54_eeprom', '#include <EEPROM.h>');
}
function nrf54EepromValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function nrf54EepromType(block) {
  const allowed = new Set(['uint8_t', 'int8_t', 'uint16_t', 'int16_t', 'uint32_t', 'int32_t', 'float', 'double', 'bool']);
  const selected = block.getFieldValue('TYPE');
  return allowed.has(selected) ? selected : 'uint8_t';
}
function nrf54EepromHelperSuffix(type) { return type.replace(/_t$/, '').replace(/[^a-zA-Z0-9]/g, '_'); }

Arduino.forBlock['nrf54_eeprom_init'] = function(block, generator) {
  ensureNrf54Eeprom(generator);
  return 'EEPROM.begin((size_t)(' + nrf54EepromValue(block, generator, 'SIZE', '1024') + '));\n';
};
Arduino.forBlock['nrf54_eeprom_end'] = function(block, generator) { ensureNrf54Eeprom(generator); return 'EEPROM.end();\n'; };
Arduino.forBlock['nrf54_eeprom_commit'] = function(block, generator) { ensureNrf54Eeprom(generator); return 'EEPROM.commit();\n'; };
Arduino.forBlock['nrf54_eeprom_read'] = function(block, generator) { ensureNrf54Eeprom(generator); return ['EEPROM.read((int)(' + nrf54EepromValue(block, generator, 'ADDRESS', '0') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_eeprom_write'] = function(block, generator) { ensureNrf54Eeprom(generator); return 'EEPROM.write((int)(' + nrf54EepromValue(block, generator, 'ADDRESS', '0') + '), (uint8_t)(' + nrf54EepromValue(block, generator, 'VALUE', '0') + '));\n'; };
Arduino.forBlock['nrf54_eeprom_update'] = function(block, generator) { ensureNrf54Eeprom(generator); return 'EEPROM.update((int)(' + nrf54EepromValue(block, generator, 'ADDRESS', '0') + '), (uint8_t)(' + nrf54EepromValue(block, generator, 'VALUE', '0') + '));\n'; };
Arduino.forBlock['nrf54_eeprom_length'] = function(block, generator) { ensureNrf54Eeprom(generator); return ['EEPROM.length()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_eeprom_get'] = function(block, generator) {
  ensureNrf54Eeprom(generator);
  const type = nrf54EepromType(block);
  const suffix = nrf54EepromHelperSuffix(type);
  generator.addFunction('nrf54_eeprom_get_' + suffix,
    type + ' nrf54EepromGet_' + suffix + '(int address) {\n' +
    '  ' + type + ' value{};\n' +
    '  EEPROM.get(address, value);\n' +
    '  return value;\n' +
    '}');
  return ['nrf54EepromGet_' + suffix + '((int)(' + nrf54EepromValue(block, generator, 'ADDRESS', '0') + '))', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['nrf54_eeprom_put'] = function(block, generator) {
  ensureNrf54Eeprom(generator);
  const type = nrf54EepromType(block);
  return 'EEPROM.put((int)(' + nrf54EepromValue(block, generator, 'ADDRESS', '0') + '), (' + type + ')(' + nrf54EepromValue(block, generator, 'VALUE', '0') + '));\n';
};
