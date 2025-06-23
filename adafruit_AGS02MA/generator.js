// 导入AGS02MA库和初始化全局变量，只添加一次
Arduino.forBlock['ags02ma_init'] = function(block, generator) {
  generator.addLibrary('AGS02MA', '#include <Adafruit_AGS02MA.h>');
  generator.addVariable('ags02ma', 'Adafruit_AGS02MA ags;');
  generator.addSetup('ags02ma_begin', 'ags.begin(&Wire, 0x1A);\n');
  return '';
};

// 获取固件版本
// 获取气体电阻值
// 获取TVOC浓度
// 打印传感器详细信息
Arduino.forBlock['ags02ma_firmware_version'] = function(block, generator) {
  return ['ags.getFirmwareVersion()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_gas_resistance'] = function(block, generator) {
  return ['ags.getGasResistance()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_tvoc'] = function(block, generator) {
  return ['ags.getTVOC()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_print_details'] = function(block, generator) {
  return 'ags.printSensorDetails();\n';
};
