
// 初始化DS18B20传感器
Arduino.forBlock['ds18b20_init'] = function(block, generator) {
  const pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  
  generator.addLibrary('#include <DS18B20.h>', '#include <DS18B20.h>');
  generator.addVariable(`DS18B20 ${varName}`, `DS18B20 ${varName}(${pin})`);
  
  return '';
};

// 读取温度（摄氏度）
Arduino.forBlock['ds18b20_read_temp_c'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getTempC()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取温度（华氏度）
Arduino.forBlock['ds18b20_read_temp_f'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getTempF()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 设置温度报警阈值
Arduino.forBlock['ds18b20_set_alarms'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const lowAlarm = generator.valueToCode(block, 'LOW_ALARM', Arduino.ORDER_ATOMIC);
  const highAlarm = generator.valueToCode(block, 'HIGH_ALARM', Arduino.ORDER_ATOMIC);
  
  return `${varName}.setAlarms(${lowAlarm}, ${highAlarm});\n`;
};

// 获取低温报警阈值
Arduino.forBlock['ds18b20_get_alarm_low'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getAlarmLow()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取高温报警阈值
Arduino.forBlock['ds18b20_get_alarm_high'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getAlarmHigh()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 检查是否有温度报警
Arduino.forBlock['ds18b20_has_alarm'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.hasAlarm()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取传感器分辨率
Arduino.forBlock['ds18b20_get_resolution'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getResolution()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 设置传感器分辨率
Arduino.forBlock['ds18b20_set_resolution'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const resolution = generator.valueToCode(block, 'RESOLUTION', Arduino.ORDER_ATOMIC);
  
  return `${varName}.setResolution(${resolution});\n`;
};

// 获取传感器电源模式
Arduino.forBlock['ds18b20_get_power_mode'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getPowerMode()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 进行温度转换
Arduino.forBlock['ds18b20_do_conversion'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  
  return `${varName}.doConversion();\n`;
};

// 获取连接的设备数量
Arduino.forBlock['ds18b20_get_number_of_devices'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getNumberOfDevices()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 选择下一个传感器
Arduino.forBlock['ds18b20_select_next'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.selectNext()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 选择下一个触发报警的传感器
Arduino.forBlock['ds18b20_select_next_alarm'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.selectNextAlarm()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 重置传感器搜索
Arduino.forBlock['ds18b20_reset_search'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  
  return `${varName}.resetSearch();\n`;
};

// 获取设备型号代码
Arduino.forBlock['ds18b20_get_family_code'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const code = `${varName}.getFamilyCode()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取设备地址
Arduino.forBlock['ds18b20_get_address'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ds18b20';
  const addrVarName = generator.nameDB_.getDistinctName('ds18b20Address', 'Variable');
  
  generator.addVariable(`uint8_t ${addrVarName}[8]`, `uint8_t ${addrVarName}[8]`);
  
  return `${varName}.getAddress(${addrVarName});\n`;
};

// 简化版读取温度（摄氏度）- 自动创建传感器对象
Arduino.forBlock['ds18b20_simple_read_temp_c'] = function(block, generator) {
  const pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
  const varName = generator.nameDB_.getDistinctName('tempSensor', 'Variable');
  
  generator.addLibrary('#include <DS18B20.h>', '#include <DS18B20.h>');
  generator.addVariable(`DS18B20 ${varName}`, `DS18B20 ${varName}(${pin})`);
  
  const code = `${varName}.getTempC()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 简化版读取温度（华氏度）- 自动创建传感器对象
Arduino.forBlock['ds18b20_simple_read_temp_f'] = function(block, generator) {
  const pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC);
  const varName = generator.nameDB_.getDistinctName('tempSensor', 'Variable');
  
  generator.addLibrary('#include <DS18B20.h>', '#include <DS18B20.h>');
  generator.addVariable(`DS18B20 ${varName}`, `DS18B20 ${varName}(${pin})`);
  
  const code = `${varName}.getTempF()`;
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};
