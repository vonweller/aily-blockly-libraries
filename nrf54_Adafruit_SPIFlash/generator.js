'use strict';

function nrf54SpiFlashValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function ensureNrf54SpiFlashLibraries(generator) {
  generator.addLibrary('nrf54_spiflash', '#include <Adafruit_SPIFlash.h>\n#include <Adafruit_FlashTransport_QSPI_NRF54.h>\n#include <Adafruit_FlashTransport_SPI.h>');
  generator.addObject('nrf54_flash_transport_pointer', 'Adafruit_FlashTransport* nrf54FlashTransport = nullptr;');
  generator.addObject('nrf54_flash_pointer', 'Adafruit_SPIFlash* nrf54Flash = nullptr;');
}
function ensureNrf54QspiFlash(generator) {
  ensureNrf54SpiFlashLibraries(generator);
  generator.addObject('nrf54_qspi_transport', 'Adafruit_FlashTransport_QSPI_NRF54 nrf54QspiTransport;');
  generator.addObject('nrf54_qspi_flash', 'Adafruit_SPIFlash nrf54QspiFlash(&nrf54QspiTransport);');
}
function ensureNrf54SpiFlash(generator, cs) {
  ensureNrf54SpiFlashLibraries(generator);
  generator.addObject('nrf54_spi_transport', 'Adafruit_FlashTransport_SPI nrf54SpiTransport(' + cs + ', &SPI);');
  generator.addObject('nrf54_spi_flash', 'Adafruit_SPIFlash nrf54SpiFlash(&nrf54SpiTransport);');
}
function ensureNrf54FlashHelpers(generator) {
  generator.addFunction('nrf54_spiflash_read_byte_helper',
    'uint8_t nrf54SpiFlashReadByte(uint32_t address) {\n  uint8_t value = 0;\n  if (nrf54Flash != nullptr) (void)nrf54Flash->readBuffer(address, &value, 1U);\n  return value;\n}');
  generator.addFunction('nrf54_spiflash_write_byte_helper',
    'bool nrf54SpiFlashWriteByte(uint32_t address, uint8_t value) {\n  return nrf54Flash != nullptr && nrf54Flash->writeBuffer(address, &value, 1U);\n}');
  generator.addFunction('nrf54_spiflash_read_text_helper',
    'String nrf54SpiFlashReadText(uint32_t address, size_t length) {\n  String result;\n  if (nrf54Flash == nullptr) return result;\n  result.reserve(length);\n  for (size_t i = 0; i < length; ++i) {\n    uint8_t value = 0;\n    if (!nrf54Flash->readBuffer(address + i, &value, 1U) || value == 0U) break;\n    result += (char)value;\n  }\n  return result;\n}');
  generator.addFunction('nrf54_spiflash_write_text_helper',
    'bool nrf54SpiFlashWriteText(uint32_t address, const String& text) {\n  return nrf54Flash != nullptr && nrf54Flash->writeBuffer(address, reinterpret_cast<const uint8_t*>(text.c_str()), text.length());\n}');
}

Arduino.forBlock['nrf54_spiflash_begin_qspi'] = function(block, generator) { ensureNrf54QspiFlash(generator); return 'nrf54FlashTransport = &nrf54QspiTransport;\nnrf54Flash = &nrf54QspiFlash;\nnrf54Flash->begin();\n'; };
Arduino.forBlock['nrf54_spiflash_begin_spi'] = function(block, generator) { ensureNrf54SpiFlash(generator, block.getFieldValue('CS') || '10'); return 'nrf54FlashTransport = &nrf54SpiTransport;\nnrf54Flash = &nrf54SpiFlash;\nnrf54Flash->begin();\n'; };
Arduino.forBlock['nrf54_spiflash_end'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return 'if (nrf54Flash != nullptr) nrf54Flash->end();\n'; };
Arduino.forBlock['nrf54_spiflash_size'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr ? nrf54Flash->size() : 0U)', generator.ORDER_CONDITIONAL]; };
Arduino.forBlock['nrf54_spiflash_jedec_id'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr ? nrf54Flash->readJEDECID() : 0U)', generator.ORDER_CONDITIONAL]; };
Arduino.forBlock['nrf54_spiflash_jedec_part'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); const shift = (2 - Number(block.getFieldValue('PART') || 0)) * 8; return ['((nrf54Flash != nullptr ? nrf54Flash->readJEDECID() : 0U) >> ' + shift + ') & 0xFFU', generator.ORDER_BITWISE_AND]; };
Arduino.forBlock['nrf54_spiflash_read_byte'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); ensureNrf54FlashHelpers(generator); return ['nrf54SpiFlashReadByte((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'ADDRESS', '0') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_spiflash_write_byte'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); ensureNrf54FlashHelpers(generator); return 'nrf54SpiFlashWriteByte((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'ADDRESS', '0') + '), (uint8_t)(' + nrf54SpiFlashValue(block, generator, 'VALUE', '0') + '));\n'; };
Arduino.forBlock['nrf54_spiflash_read_text'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); ensureNrf54FlashHelpers(generator); return ['nrf54SpiFlashReadText((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'ADDRESS', '0') + '), (size_t)(' + nrf54SpiFlashValue(block, generator, 'LENGTH', '16') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_spiflash_write_text'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); ensureNrf54FlashHelpers(generator); return ['nrf54SpiFlashWriteText((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'ADDRESS', '0') + '), String(' + nrf54SpiFlashValue(block, generator, 'DATA', '""') + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['nrf54_spiflash_erase_sector'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr && nrf54Flash->eraseSector((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'ADDRESS', '0') + ')))', generator.ORDER_LOGICAL_AND]; };
Arduino.forBlock['nrf54_spiflash_erase_chip'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr && nrf54Flash->eraseChip())', generator.ORDER_LOGICAL_AND]; };
Arduino.forBlock['nrf54_spiflash_wait_ready'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr && nrf54Flash->waitUntilReady((uint32_t)(' + nrf54SpiFlashValue(block, generator, 'TIMEOUT', '100') + ')))', generator.ORDER_LOGICAL_AND]; };
Arduino.forBlock['nrf54_spiflash_is_busy'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr && nrf54Flash->isBusy())', generator.ORDER_LOGICAL_AND]; };
Arduino.forBlock['nrf54_spiflash_sector_count'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr ? nrf54Flash->sectorCount() : 0U)', generator.ORDER_CONDITIONAL]; };
Arduino.forBlock['nrf54_spiflash_run_command'] = function(block, generator) { ensureNrf54SpiFlashLibraries(generator); return ['(nrf54Flash != nullptr && nrf54Flash->runCommand((uint8_t)(' + nrf54SpiFlashValue(block, generator, 'COMMAND', '0') + ')))', generator.ORDER_LOGICAL_AND]; };
