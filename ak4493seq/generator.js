Arduino.forBlock['ak4493seq_init'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = 'ak4493';
    registerVariableToBlockly(block._varLastName, 'AK4493SEQ');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'AK4493SEQ');
          block._varLastName = newName;
        }
      };
    }
  }

  const sdaPin = block.getFieldValue('SDA') || 'PB7';
  const sckPin = block.getFieldValue('SCK') || 'PB6';
  const cad0High = block.getFieldValue('CAD0') === 'true';

  generator.addLibrary('AK4493SEQ', '#include <AK4493SEQ.h>');
  generator.addObject('ak4493seq_obj', 'AK4493SEQ ak4493;');
  ensureSerialBegin('Serial', generator);

  let code = '';
  if (cad0High) {
    code += 'ak4493.begin(' + sdaPin + ', ' + sckPin + ', true);\n';
  } else {
    code += 'ak4493.begin(' + sdaPin + ', ' + sckPin + ', false);\n';
  }
  code += 'Serial.println("AK4493SEQ initialized.");\n';
  return code;
};

Arduino.forBlock['ak4493seq_set_volume'] = function(block, generator) {
  const vol = generator.valueToCode(block, 'VOL', generator.ORDER_ATOMIC) || '255';
  return 'ak4493.setVolume(' + vol + ');\n';
};

Arduino.forBlock['ak4493seq_set_volume_percent'] = function(block, generator) {
  const percent = generator.valueToCode(block, 'PERCENT', generator.ORDER_ATOMIC) || '100';
  return 'ak4493.setVolumePercent(' + percent + ');\n';
};

Arduino.forBlock['ak4493seq_set_mute'] = function(block, generator) {
  const mute = block.getFieldValue('MUTE') === 'true';
  return 'ak4493.setMute(' + mute + ');\n';
};

Arduino.forBlock['ak4493seq_set_power'] = function(block, generator) {
  const power = block.getFieldValue('POWER') === 'true';
  return 'ak4493.setPower(' + power + ');\n';
};

Arduino.forBlock['ak4493seq_set_reset'] = function(block, generator) {
  const rst = block.getFieldValue('RST') === 'true';
  return 'ak4493.setReset(' + rst + ');\n';
};

Arduino.forBlock['ak4493seq_set_filter'] = function(block, generator) {
  const filter = parseInt(block.getFieldValue('FILTER') || '0');
  const filterNames = [
    'AK4493SEQ_FILTER_SHARP',
    'AK4493SEQ_FILTER_SLOW',
    'AK4493SEQ_FILTER_SHORT_SHARP',
    'AK4493SEQ_FILTER_SHORT_SLOW',
    'AK4493SEQ_FILTER_SUPER_SLOW',
    'AK4493SEQ_FILTER_SUPER_SLOW',
    'AK4493SEQ_FILTER_LOW_DISPERSION'
  ];
  const filterName = filterNames[filter] || 'AK4493SEQ_FILTER_SHARP';
  return 'ak4493.setFilter(' + filterName + ');\n';
};

Arduino.forBlock['ak4493seq_set_format'] = function(block, generator) {
  const fmt = parseInt(block.getFieldValue('FMT') || '6');
  const fmtNames = [
    'AK4493SEQ_FMT_16BIT_LSB',
    'AK4493SEQ_FMT_16BIT_LSB',
    'AK4493SEQ_FMT_16BIT_LSB',
    'AK4493SEQ_FMT_16BIT_LSB',
    'AK4493SEQ_FMT_24BIT_LSB',
    'AK4493SEQ_FMT_32BIT_LSB',
    'AK4493SEQ_FMT_24BIT_I2S',
    'AK4493SEQ_FMT_32BIT_I2S'
  ];
  const fmtName = fmtNames[fmt] || 'AK4493SEQ_FMT_24BIT_I2S';
  return 'ak4493.setFormat(' + fmtName + ');\n';
};

Arduino.forBlock['ak4493seq_set_deemphasis'] = function(block, generator) {
  const dem = parseInt(block.getFieldValue('DEM') || '1');
  const demNames = [
    'AK4493SEQ_DEEM_44K',
    'AK4493SEQ_DEEM_OFF',
    'AK4493SEQ_DEEM_48K',
    'AK4493SEQ_DEEM_32K'
  ];
  const demName = demNames[dem] || 'AK4493SEQ_DEEM_OFF';
  return 'ak4493.setDeemphasis(' + demName + ');\n';
};

Arduino.forBlock['ak4493seq_set_gain'] = function(block, generator) {
  const gain = parseInt(block.getFieldValue('GAIN') || '0');
  const gainNames = [
    'AK4493SEQ_GAIN_2_8VPP',
    'AK4493SEQ_GAIN_2_8VPP',
    'AK4493SEQ_GAIN_2_5VPP',
    'AK4493SEQ_GAIN_2_5VPP',
    'AK4493SEQ_GAIN_3_75VPP',
    'AK4493SEQ_GAIN_3_75VPP',
    'AK4493SEQ_GAIN_2_5VPP',
    'AK4493SEQ_GAIN_2_5VPP'
  ];
  const gainName = gainNames[gain] || 'AK4493SEQ_GAIN_2_8VPP';
  return 'ak4493.setGain(' + gainName + ');\n';
};

Arduino.forBlock['ak4493seq_set_att_speed'] = function(block, generator) {
  const ats = parseInt(block.getFieldValue('ATS') || '0');
  return 'ak4493.setATTSpeed(' + ats + ');\n';
};

Arduino.forBlock['ak4493seq_write_reg'] = function(block, generator) {
  const reg = generator.valueToCode(block, 'REG', generator.ORDER_ATOMIC) || '0x00';
  const val = generator.valueToCode(block, 'VAL', generator.ORDER_ATOMIC) || '0x00';
  return 'ak4493.writeReg(' + reg + ', ' + val + ');\n';
};

Arduino.forBlock['ak4493seq_read_reg'] = function(block, generator) {
  const reg = generator.valueToCode(block, 'REG', generator.ORDER_ATOMIC) || '0x00';
  generator.addLibrary('AK4493SEQ', '#include <AK4493SEQ.h>');
  return ['ak4493.readReg(' + reg + ')', generator.ORDER_FUNCTION_CALL];
};
