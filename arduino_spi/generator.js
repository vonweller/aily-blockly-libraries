
Arduino.forBlock['spi_begin'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  generator.addSetup('spi_begin', 'SPI.begin();');
  return '';
};

Arduino.forBlock['spi_transfer'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  var code = 'SPI.transfer(' + value + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['spi_transfer16'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  var code = 'SPI.transfer16(' + value + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['spi_begin_transaction'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var clock = generator.valueToCode(block, 'CLOCK', Arduino.ORDER_ATOMIC);
  var bitOrder = block.getFieldValue('BIT_ORDER');
  var dataMode = block.getFieldValue('DATA_MODE');
  var code = 'SPI.beginTransaction(SPISettings(' + clock + ', ' + bitOrder + ', ' + dataMode + '));\n';
  return code;
};

Arduino.forBlock['spi_end_transaction'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  return 'SPI.endTransaction();\n';
};

Arduino.forBlock['spi_set_bit_order'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var bitOrder = block.getFieldValue('BIT_ORDER');
  return 'SPI.setBitOrder(' + bitOrder + ');\n';
};

Arduino.forBlock['spi_set_data_mode'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var dataMode = block.getFieldValue('DATA_MODE');
  return 'SPI.setDataMode(' + dataMode + ');\n';
};

Arduino.forBlock['spi_set_clock_divider'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var clockDiv = block.getFieldValue('CLOCK_DIV');
  return 'SPI.setClockDivider(' + clockDiv + ');\n';
};

// 温度传感器读取功能
Arduino.forBlock['spi_read_temperature'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'readTemperature';
  var functionCode = 'float ' + functionName + '(int csPin) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(0x01); // 读取温度的命令\n' +
                     '  byte msb = SPI.transfer(0x00);\n' +
                     '  byte lsb = SPI.transfer(0x00);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '  return ((msb << 8) | lsb) * 0.0625; // 转换为摄氏度\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  var code = functionName + '(' + csPin + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 压力传感器读取功能
Arduino.forBlock['spi_read_pressure'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'readPressure';
  var functionCode = 'float ' + functionName + '(int csPin) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(0x02); // 读取压力的命令\n' +
                     '  byte msb = SPI.transfer(0x00);\n' +
                     '  byte lsb = SPI.transfer(0x00);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '  return ((msb << 8) | lsb) * 0.1; // 转换为kPa\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  var code = functionName + '(' + csPin + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 数字电位器控制功能
Arduino.forBlock['spi_digital_potentiometer_write'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var channel = generator.valueToCode(block, 'CHANNEL', Arduino.ORDER_ATOMIC);
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'digitalPotWrite';
  var functionCode = 'void ' + functionName + '(int csPin, int channel, int value) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(channel);\n' +
                     '  SPI.transfer(value);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  return functionName + '(' + csPin + ', ' + channel + ', ' + value + ');\n';
};

// 通用SPI寄存器写入功能
Arduino.forBlock['spi_write_register'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var register = generator.valueToCode(block, 'REGISTER', Arduino.ORDER_ATOMIC);
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'writeRegister';
  var functionCode = 'void ' + functionName + '(int csPin, byte reg, byte value) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(reg);\n' +
                     '  SPI.transfer(value);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  return functionName + '(' + csPin + ', ' + register + ', ' + value + ');\n';
};

// 通用SPI寄存器读取功能
Arduino.forBlock['spi_read_register'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var register = generator.valueToCode(block, 'REGISTER', Arduino.ORDER_ATOMIC);
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'readRegister';
  var functionCode = 'byte ' + functionName + '(int csPin, byte reg) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(reg | 0x80); // 通常最高位置1表示读取操作\n' +
                     '  byte value = SPI.transfer(0x00);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '  return value;\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  var code = functionName + '(' + csPin + ', ' + register + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取多个寄存器功能
Arduino.forBlock['spi_read_registers'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var register = generator.valueToCode(block, 'REGISTER', Arduino.ORDER_ATOMIC);
  var count = generator.valueToCode(block, 'COUNT', Arduino.ORDER_ATOMIC);
  var arrayName = block.getFieldValue('ARRAY_NAME');
  
  // 添加CS引脚初始化代码到setup
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  // 添加数组变量声明
  generator.addVariable('byte ' + arrayName + '[' + count + ']', 'byte ' + arrayName + '[' + count + '];');
  
  var functionName = 'readRegisters';
  var functionCode = 'void ' + functionName + '(int csPin, byte reg, byte *buffer, byte count) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(reg | 0x80); // 通常最高位置1表示读取操作\n' +
                     '  for (byte i = 0; i < count; i++) {\n' +
                     '    buffer[i] = SPI.transfer(0x00);\n' +
                     '  }\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  return functionName + '(' + csPin + ', ' + register + ', ' + arrayName + ', ' + count + ');\n';
};

// 简化版传感器读取功能，自动处理SPI初始化
Arduino.forBlock['spi_sensor_read'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var sensorType = block.getFieldValue('SENSOR_TYPE');
  
  // 添加SPI初始化和CS引脚初始化代码到setup
  generator.addSetup('spi_begin', 'SPI.begin();');
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName;
  var functionCode;
  
  if (sensorType === 'TEMPERATURE') {
    functionName = 'readTemperatureSensor';
    functionCode = 'float ' + functionName + '(int csPin) {\n' +
                   '  digitalWrite(csPin, LOW);\n' +
                   '  SPI.transfer(0x01); // 读取温度的命令\n' +
                   '  byte msb = SPI.transfer(0x00);\n' +
                   '  byte lsb = SPI.transfer(0x00);\n' +
                   '  digitalWrite(csPin, HIGH);\n' +
                   '  return ((msb << 8) | lsb) * 0.0625; // 转换为摄氏度\n' +
                   '}\n';
  } else if (sensorType === 'PRESSURE') {
    functionName = 'readPressureSensor';
    functionCode = 'float ' + functionName + '(int csPin) {\n' +
                   '  digitalWrite(csPin, LOW);\n' +
                   '  SPI.transfer(0x02); // 读取压力的命令\n' +
                   '  byte msb = SPI.transfer(0x00);\n' +
                   '  byte lsb = SPI.transfer(0x00);\n' +
                   '  digitalWrite(csPin, HIGH);\n' +
                   '  return ((msb << 8) | lsb) * 0.1; // 转换为kPa\n' +
                   '}\n';
  }
  
  generator.addFunction(functionName, functionCode);
  
  var code = functionName + '(' + csPin + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 简化版数字电位器控制功能
Arduino.forBlock['spi_digital_pot_simple'] = function(block, generator) {
  generator.addLibrary('#include <SPI.h>', '#include <SPI.h>');
  var csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC);
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  
  // 添加SPI初始化和CS引脚初始化代码到setup
  generator.addSetup('spi_begin', 'SPI.begin();');
  generator.addSetup('pinMode_' + csPin, 'pinMode(' + csPin + ', OUTPUT);');
  generator.addSetup('digitalWrite_' + csPin, 'digitalWrite(' + csPin + ', HIGH);');
  
  var functionName = 'setDigitalPotValue';
  var functionCode = 'void ' + functionName + '(int csPin, int value) {\n' +
                     '  digitalWrite(csPin, LOW);\n' +
                     '  SPI.transfer(0x00); // 默认通道 0\n' +
                     '  SPI.transfer(value);\n' +
                     '  digitalWrite(csPin, HIGH);\n' +
                     '}\n';
  
  generator.addFunction(functionName, functionCode);
  
  return functionName + '(' + csPin + ', ' + value + ');\n';
};
