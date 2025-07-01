// AGS02MA 气体传感器库生成器

Arduino.forBlock['ags02ma_init'] = function(block, generator) {
  const address = block.getFieldValue('ADDRESS') || '26';
  generator.addLibrary('AGS02MA', '#include <AGS02MA.h>');
  generator.addObject('ags02ma', `AGS02MA ags02ma(${address});`);
  generator.addSetup('ags02ma_begin', 'ags02ma.begin();');
  return '';
};

Arduino.forBlock['ags02ma_set_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  if (mode === 'PPB') {
    return 'ags02ma.setPPBMode();\n';
  } else if (mode === 'UGM3') {
    return 'ags02ma.setUGM3Mode();\n';
  }
  return '';
};

Arduino.forBlock['ags02ma_get_mode'] = function(block, generator) {
  return ['ags02ma.getMode()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_get_sensor_info'] = function(block, generator) {
  const infoType = block.getFieldValue('TYPE');
  switch(infoType){
    case 'VERSION': return ['ags02ma.getSensorVersion()', Arduino.ORDER_FUNCTION_CALL];
    case 'DATE': return ['ags02ma.getSensorDate()', Arduino.ORDER_FUNCTION_CALL];
    case 'ADDRESS': return ['ags02ma.getAddress()', Arduino.ORDER_FUNCTION_CALL];
    default: return ['0', Arduino.ORDER_ATOMIC];
  }
};

Arduino.forBlock['ags02ma_set_address'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC);
  return `ags02ma.setAddress(${address});\n`;
};

Arduino.forBlock['ags02ma_read_concentration'] = function(block, generator) {
  const unit = block.getFieldValue('UNIT');
  switch(unit) {
    case 'PPB': return ['ags02ma.readPPB()', Arduino.ORDER_FUNCTION_CALL];
    case 'PPM': return ['ags02ma.readPPM()', Arduino.ORDER_FUNCTION_CALL];
    case 'UGM3': return ['ags02ma.readUGM3()', Arduino.ORDER_FUNCTION_CALL];
    default: return ['0', Arduino.ORDER_ATOMIC];
  }
};

Arduino.forBlock['ags02ma_data_ready'] = function(block, generator) {
  return ['ags02ma.dataReady()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_is_heated'] = function(block, generator) {
  return ['ags02ma.isHeated()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_zero_calibration'] = function(block, generator) {
  return 'ags02ma.zeroCalibration();\n';
};

Arduino.forBlock['ags02ma_manual_zero_calibration'] = function(block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
  return `ags02ma.manualZeroCalibration(${value});\n`;
};

Arduino.forBlock['ags02ma_get_zero_cal_data'] = function(block, generator) {
  const dataType = block.getFieldValue('DATATYPE');
  const functionName = generator.nameDB_.getDistinctName(`getZeroCal${dataType}`, 'procedure');
  let retCode = '';
  if (dataType === 'STATUS') {
    retCode = 'data.status';
  } else if (dataType === 'VALUE') {
    retCode = 'data.value';
  } else {
    retCode = '0';
  }
  generator.addFunction(functionName, `\nuint16_t ${functionName}() {\n  AGS02MA::ZeroCalibrationData data;\n  ags02ma.getZeroCalibrationData(data);\n  return ${retCode};\n}\n`);
  return [`${functionName}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_read_register'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC);
  const varName = generator.nameDB_.getDistinctName('regData', 'var');
  generator.addDeclaration(varName, `AGS02MA::RegisterData ${varName};`);
  return [`ags02ma.readRegister(${address}, ${varName})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ags02ma_status_error'] = function(block, generator) {
  const infoType = block.getFieldValue('INFO');
  if (infoType === 'STATUS') {
    return ['ags02ma.lastStatus()', Arduino.ORDER_FUNCTION_CALL];
  } else {
    return ['ags02ma.lastError()', Arduino.ORDER_FUNCTION_CALL];
  }
};
