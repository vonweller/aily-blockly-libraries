// SPI 库 unified generator

// 引入库
Arduino.forBlock['esp32_spi_create'] = function(block, generator) {
  generator.addLibrary('esp32_spi', '#include <SPI.h>');
  const spiType = block.getFieldValue('SPI_TYPE');
  const variableName = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  const code = `SPIClass ${variableName} = SPIClass(${spiType});\n`;
  generator.addVariable(`spi_${variableName}`, code);
  return '';
};

// SPI 初始化，兼容默认和自定义引脚
Arduino.forBlock['esp32_spi_begin'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  return `${spiInstance}->begin();\n`;
};

Arduino.forBlock['esp32_spi_begin_pins'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  const sckPin = generator.valueToCode(block, 'SCK_PIN', Arduino.ORDER_ATOMIC);
  const misoPin = generator.valueToCode(block, 'MISO_PIN', Arduino.ORDER_ATOMIC);
  const mosiPin = generator.valueToCode(block, 'MOSI_PIN', Arduino.ORDER_ATOMIC);
  const csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  
  // 使用数字前缀降低优先级（数字越小优先级越高）
  generator.addSetup('010_spi_begin', `${spiInstance}.begin(${sckPin}, ${misoPin}, ${mosiPin}, ${csPin});\n`);
  return '';
};

// SPI 开始事务
Arduino.forBlock['esp32_spi_begin_transaction'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  const clockSpeed = generator.valueToCode(block, 'CLOCK_SPEED', Arduino.ORDER_ATOMIC) || '1000000';
  const bitOrder = block.getFieldValue('BIT_ORDER');
  const dataMode = block.getFieldValue('DATA_MODE');
  return `${spiInstance}.beginTransaction(SPISettings(${clockSpeed}, ${bitOrder}, ${dataMode}));\n`;
};

// SPI 结束事务
Arduino.forBlock['esp32_spi_end_transaction'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  return `${spiInstance}.endTransaction();\n`;
};

// SPI 传输一个字节数据
Arduino.forBlock['esp32_spi_transfer'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
  const varName = generator.nameDB_.getDistinctName('spiData', Blockly.Variables.NAME_TYPE);
  const code = `uint8_t ${varName} = ${spiInstance}.transfer(${data});\n`;
  return [varName, Arduino.ORDER_ATOMIC];
};

// SPI 获取SS管脚
Arduino.forBlock['esp32_spi_pin_ss'] = function(block, generator) {
  const spiInstance = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || 'SPI';
  return [`${spiInstance}.pinSS()`, Arduino.ORDER_FUNCTION_CALL];
};
