// EVLabPcf85063 generator — EasyVoice 1306 Dev 板载 PCF85063 实时时钟
'use strict';

// 板卡只有一条 I2C 总线，不让用户填引脚。去重标签与板上其它 I2C 库保持一致，
// 这样同时使用多个设备时 Wire.begin() 只会发一次。
function evlabRtcEnsureWire(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  var pinComment = '';
  try {
    var boardConfig = window['boardConfig'];
    if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins['Wire']) {
      var pins = boardConfig.i2cPins['Wire'];
      var sdaPin = pins.find(function (p) { return p[0] === 'SDA'; });
      var sclPin = pins.find(function (p) { return p[0] === 'SCL'; });
      if (sdaPin && sclPin) pinComment = '// Wire: SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n';
    }
  } catch (e) {}
  generator.addSetupBegin('wire_Wire_begin', pinComment + 'Wire.begin();\n');
}

// 初始化块的 field_input 对象名需要注册为 EVLabPcf85063 类型的工作区变量，
// 并在用户改名时同步重命名；监听器只挂一次。
function evlabRtcAttachVariable(block) {
  if (block._evlabRtcVarMonitorAttached) return;
  block._evlabRtcVarMonitorAttached = true;
  block._rLast = block.getFieldValue('VAR') || 'rtc';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._rLast, 'EVLabPcf85063');
  var vf = block.getField('VAR');
  if (vf) {
    var o = vf.onFinishEditing_;
    vf.onFinishEditing_ = function (nn) {
      if (typeof o === 'function') o.call(this, nn);
      var ws = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      var on = block._rLast;
      if (ws && nn && nn !== on) {
        if (typeof renameVariableInBlockly === 'function') renameVariableInBlockly(block, on, nn, 'EVLabPcf85063');
        block._rLast = nn;
      }
    };
  }
}

function evlabRtcInclude(generator) {
  generator.addLibrary('EVLabPcf85063', '#include <EVLabPcf85063.h>');
}

Arduino.forBlock['evlabrtc_init'] = function (block, generator) {
  evlabRtcInclude(generator);
  evlabRtcAttachVariable(block);
  var objectName = block.getFieldValue('VAR') || 'rtc';
  generator.addObject('evlabrtc_' + objectName, 'EVLabPcf85063 ' + objectName + ';');
  evlabRtcEnsureWire(generator);
  ensureSerialBegin('Serial', generator);
  // begin() 返回是否在 0x51 上找到芯片；时钟没接好时给出提示
  return 'if (!' + objectName + '.begin()) {\n  Serial.println("实时时钟初始化失败，未在地址 0x51 找到 PCF85063");\n}\n';
};

Arduino.forBlock['evlabrtc_set_time'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  var year = generator.valueToCode(block, 'YEAR', Arduino.ORDER_ATOMIC) || '0';
  var month = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '0';
  var day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '0';
  var hour = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
  var minute = generator.valueToCode(block, 'MIN', Arduino.ORDER_ATOMIC) || '0';
  var second = generator.valueToCode(block, 'SEC', Arduino.ORDER_ATOMIC) || '0';
  return objectName + '.setTime(' + year + ', ' + month + ', ' + day + ', ' + hour + ', ' + minute + ', ' + second + ');\n';
};

Arduino.forBlock['evlabrtc_set_compile_time'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  return objectName + '.setCompileTime();\n';
};

Arduino.forBlock['evlabrtc_read'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  return objectName + '.read();\n';
};

Arduino.forBlock['evlabrtc_get'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  var field = block.getFieldValue('FIELD');
  return [objectName + '.' + field + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabrtc_format'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  var fmt = block.getFieldValue('FMT');
  return [objectName + '.' + fmt + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabrtc_lost_power'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  return [objectName + '.lostPower()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabrtc_present'] = function (block, generator) {
  evlabRtcInclude(generator);
  var objectName = generator.getValue(block, 'VAR', 'field_variable');
  return [objectName + '.present()', generator.ORDER_FUNCTION_CALL];
};
