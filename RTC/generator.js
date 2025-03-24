Arduino.forBlock['rtc_begin'] = function(block, generator) {
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  return 'RTC.begin();\n';
};

Arduino.forBlock['rtc_set_time'] = function(block, generator) {
  const day = block.getFieldValue('DAY');
  const month = block.getFieldValue('MONTH');
  const year = block.getFieldValue('YEAR');
  const hour = block.getFieldValue('HOUR');
  const minute = block.getFieldValue('MINUTE');
  const second = block.getFieldValue('SECOND');
  const dayOfWeek = block.getFieldValue('DAY_OF_WEEK');
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  const code = `RTCTime rtcTimeToSet(${day}, ${month}, ${year}, ${hour}, ${minute}, ${second}, ${dayOfWeek}, SaveLight::SAVING_TIME_INACTIVE);\n` +
               `RTC.setTime(rtcTimeToSet);\n`;
  
  return code;
};

Arduino.forBlock['rtc_get_time'] = function(block, generator) {
  const timeVar = generator.getVariableName(block.getFieldValue('TIME_VAR'));
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  generator.addVariable(`rtc_${timeVar}`, `RTCTime ${timeVar};`);
  
  return `RTC.getTime(${timeVar});\n`;
};

Arduino.forBlock['rtc_time_to_string'] = function(block, generator) {
  const timeVar = generator.getVariableName(block.getFieldValue('TIME_VAR'));
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  return [`${timeVar}.toString()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_get_time_component'] = function(block, generator) {
  const timeVar = generator.getVariableName(block.getFieldValue('TIME_VAR'));
  const component = block.getFieldValue('COMPONENT');
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  return [`${timeVar}.${component}`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_is_running'] = function(block, generator) {
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  return ['RTC.isRunning()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['rtc_create_time_var'] = function(block, generator) {
  const timeVar = generator.getVariableName(block.getFieldValue('TIME_VAR'));
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  generator.addVariable(`rtc_${timeVar}`, `RTCTime ${timeVar};`);
  
  return '';
};

Arduino.forBlock['rtc_set_periodic_callback'] = function(block, generator) {
  const period = block.getFieldValue('PERIOD');
  const callback = generator.statementToCode(block, 'CALLBACK_CODE');
  
  generator.addLibrary('rtc_include', '#include <RTC.h>');
  
  // 创建回调函数
  const functionName = generator.nameDB_.getDistinctName('rtcPeriodicCallback', 'PROCEDURE');
  
  generator.addFunction(`rtc_${functionName}`, `void ${functionName}() {\n${callback}}\n`);
  
  return `RTC.setPeriodicCallback(${functionName}, ${period});\n`;
};