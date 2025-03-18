Arduino.forBlock['ds18b20_init'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    
    // 添加需要的库
    generator.addLibrary('OneWire', '#include <OneWire.h>');
    generator.addLibrary('DallasTemperature', '#include <DallasTemperature.h>');
    
    // 添加对象声明
    generator.addObject('OneWire', `OneWire oneWire(${pin});`);
    generator.addObject('DallasTemperature', 'DallasTemperature sensors(&oneWire);');
    
    // 在setup中初始化传感器
    generator.addSetup('ds18b20_init', 'sensors.begin();');
    
    return '';
  };
  
  Arduino.forBlock['ds18b20_get_temp_c'] = function(block, generator) {
    const index = block.getFieldValue('INDEX');
    
    // 确保请求了温度更新
    generator.addUserSetup('ds18b20_request', 'sensors.requestTemperatures();');
    
    return [`sensors.getTempCByIndex(${index})`, Arduino.ORDER_FUNCTION_CALL];
  };
  
  Arduino.forBlock['ds18b20_get_temp_f'] = function(block, generator) {
    const index = block.getFieldValue('INDEX');
    
    // 确保请求了温度更新
    generator.addUserSetup('ds18b20_request', 'sensors.requestTemperatures();');
    
    return [`sensors.getTempFByIndex(${index})`, Arduino.ORDER_FUNCTION_CALL];
  };
  
  Arduino.forBlock['ds18b20_request_temps'] = function(block, generator) {
    return 'sensors.requestTemperatures();\n';
  };
  
  Arduino.forBlock['ds18b20_get_device_count'] = function(block, generator) {
    return ['sensors.getDeviceCount()', Arduino.ORDER_FUNCTION_CALL];
  };