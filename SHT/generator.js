// SHT3x温湿度传感器库代码生成器

Arduino.forBlock['sht3x_init'] = function(block, generator) {
  var address = block.getFieldValue('ADDRESS');
  var sensorType = block.getFieldValue('SENSOR_TYPE');
  
  // 使用固定的对象名称
  var objectName = 'sht3x_sensor';
  
  // 添加库引用
  generator.addLibrary('sht3x_lib', '#include <SHT3x.h>');
  
  // 添加对象声明，使用构造函数参数
  generator.addObject('sht3x_object', 'SHT3x ' + objectName + '(' + address + ', SHT3x::Zero, 255, SHT3x::' + sensorType + ');');
  
  // 添加初始化代码到setup
  generator.addSetupBegin('sht3x_init', '  ' + objectName + '.Begin();');
  
  return '';
};

Arduino.forBlock['sht3x_update_data'] = function(block, generator) {
  var objectName = 'sht3x_sensor';
  
  var code = objectName + '.UpdateData();\n';
  return code;
};

Arduino.forBlock['sht3x_get_temperature'] = function(block, generator) {
  var objectName = 'sht3x_sensor';
  var scale = block.getFieldValue('SCALE');
  
  var code;
  if (scale === 'Cel') {
    code = objectName + '.GetTemperature()';
  } else {
    code = objectName + '.GetTemperature(SHT3x::' + scale + ')';
  }
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sht3x_get_humidity'] = function(block, generator) {
  var objectName = 'sht3x_sensor';
  
  var code = objectName + '.GetRelHumidity()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sht3x_read_temp_humidity'] = function(block, generator) {
  var objectName = 'sht3x_sensor';
  
  // 这个block结合了更新数据和读取操作，适合快速使用
  var code = objectName + '.UpdateData();\n';
  code += 'Serial.print("Temperature: ");\n';
  code += 'Serial.print(' + objectName + '.GetTemperature());\n';
  code += 'Serial.println("°C");\n';
  code += 'Serial.print("Humidity: ");\n';
  code += 'Serial.print(' + objectName + '.GetRelHumidity());\n';
  code += 'Serial.println("%");\n';
  
  // 确保串口已初始化
  generator.addSetupBegin('serial_init', '  Serial.begin(9600);');
  
  return code;
};