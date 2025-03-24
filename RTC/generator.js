Arduino.forBlock['rtc_begin'] = function(block, generator) {
  var rtcType = block.getFieldValue('RTC_TYPE');
  
  generator.addLibrary('RTC', '#include <RTClib.h>');
  
  if (rtcType === 'DS3231') {
    generator.addVariable('rtc', 'RTC_DS3231 rtc;');
  } else if (rtcType === 'DS1307') {
    generator.addVariable('rtc', 'RTC_DS1307 rtc;');
  } else if (rtcType === 'PCF8523') {
    generator.addVariable('rtc', 'RTC_PCF8523 rtc;');
  } else if (rtcType === 'PCF8563') {
    generator.addVariable('rtc', 'RTC_PCF8563 rtc;');
  }
  
  generator.addSetup('rtc.begin', 'rtc.begin();');
  
  var code = '// RTC initialized\n';
  if (rtcType === 'DS3231' || rtcType === 'PCF8523') {
    code += 'if (rtc.lostPower()) {\n';
    code += '  // RTC lost power, lets set the time\n';
    code += '  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));\n';
    code += '}\n';
  }
  
  return code;
};

Arduino.forBlock['rtc_adjust'] = function(block, generator) {
  var year = generator.valueToCode(block, 'YEAR', Arduino.ORDER_ATOMIC) || '2023';
  var month = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1';
  var day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '1';
  var hour = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
  var minute = generator.valueToCode(block, 'MINUTE', Arduino.ORDER_ATOMIC) || '0';
  var second = generator.valueToCode(block, 'SECOND', Arduino.ORDER_ATOMIC) || '0';
  
  var code = 'rtc.adjust(DateTime(' + year + ', ' + month + ', ' + day + ', ' + hour + ', ' + minute + ', ' + second + '));\n';
  return code;
};

Arduino.forBlock['rtc_get_time'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_year'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().year()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_month'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().month()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_day'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().day()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_hour'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().hour()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_minute'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().minute()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_second'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().second()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_weekday'] = function(block, generator) {
  generator.addVariable('now', 'DateTime now;');
  var code = 'rtc.now().dayOfTheWeek()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_temperature'] = function(block, generator) {
  var code = 'rtc.getTemperature()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_format_time'] = function(block, generator) {
  var format = block.getFieldValue('FORMAT');
  var code;
  
  generator.addVariable('now', 'DateTime now;');
  
  if (format === 'FULL') {
    code = 'rtc.now().timestamp(DateTime::TIMESTAMP_FULL)';
  } else if (format === 'TIME') {
    code = 'rtc.now().timestamp(DateTime::TIMESTAMP_TIME)';
  } else if (format === 'DATE') {
    code = 'rtc.now().timestamp(DateTime::TIMESTAMP_DATE)';
  }
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_check_lost_power'] = function(block, generator) {
  var code = 'rtc.lostPower()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};