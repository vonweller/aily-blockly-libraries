Arduino.forBlock['vl53l0x_begin'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  
  // 添加需要的库和变量
  generator.addLibrary('Adafruit_VL53L0X', '#include <Adafruit_VL53L0X.h>');
  generator.addObject(sensor, 'Adafruit_VL53L0X ' + sensor + ';');
  
  // 初始化传感器
  var code = sensor + '.begin();\n';
  return code;
};

Arduino.forBlock['vl53l0x_read_distance'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  
  // 读取距离
  var code = sensor + '.readRange()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vl53l0x_start_continuous'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  var period = block.getFieldValue('PERIOD');
  
  // 启动连续测量
  var code = sensor + '.startRangeContinuous(' + period + ');\n';
  return code;
};

Arduino.forBlock['vl53l0x_stop_continuous'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  
  // 停止连续测量
  var code = sensor + '.stopRangeContinuous();\n';
  return code;
};

Arduino.forBlock['vl53l0x_is_range_complete'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  
  // 检查测量是否完成
  var code = sensor + '.isRangeComplete()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vl53l0x_set_mode'] = function(block, generator) {
  var sensor = block.getFieldValue('SENSOR');
  var mode = block.getFieldValue('MODE');
  
  // 设置传感器模式
  var code = sensor + '.configSensor(' + mode + ');\n';
  return code;
};