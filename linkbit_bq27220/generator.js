'use strict';

// 板卡适配机制
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

function getBQVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'gauge';
}

// linkbit V2: GPIO9 控制板载 SGM3002 模拟开关，决定 I2C(GPIO20/21) 接到谁
//   1 = BQ27220 电量计   0 = CN2 扩展接口
// 注: GPIO9 同时是 BOOT 脚(复位时拉低进下载模式)，默认选电量计=HIGH 正好是安全电平
const LINKBIT_I2C_SEL_FN = [
  '// linkbit V2: GPIO9 选择 I2C 通道 (1=电量计 BQ27220, 0=扩展接口 CN2)',
  '#define LINKBIT_I2C_SEL 9',
  'void linkbitI2CSel(uint8_t target) {',
  '  pinMode(LINKBIT_I2C_SEL, OUTPUT);',
  '  digitalWrite(LINKBIT_I2C_SEL, target ? HIGH : LOW);',
  '  delayMicroseconds(100);   // 等模拟开关切换稳定',
  '}'
].join('\n');

// 切换 I2C 通道
Arduino.forBlock['bq27220_i2c_select'] = function(block, generator) {
  const target = block.getFieldValue('TARGET') || '1';
  generator.addFunction('linkbit_i2c_sel', LINKBIT_I2C_SEL_FN);
  return 'linkbitI2CSel(' + target + ');\n';
};

Arduino.forBlock['bq27220_init'] = function(block, generator) {
  const BQ27220_TYPE = 'BQ27220';

  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'gauge';
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
          renameVariableInBlockly(block, oldName, newName, BQ27220_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'gauge';
  // linkbit 板卡 I2C 固定：Wire, SDA=20, SCL=21
  const address = block.getFieldValue('ADDRESS') || '0x55';

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('bq27220', '#include "bq27220.h"');
  registerVariableToBlockly(varName, BQ27220_TYPE);
  generator.addObject(varName, 'BQ27220 ' + varName + ';');
  // I2C 走 GPIO20/21(ESP32-C3 的 U0RXD/U0TXD)，复位后被 UART0 占用，须先释放
  generator.addSetup('linkbit_free_uart0', 'Serial0.end(); // 释放 UART0(GPIO20/21) 供 I2C 使用');
  // 板载模拟开关默认切到电量计, 否则 I2C 挂在扩展接口上, 读不到 0x55
  generator.addFunction('linkbit_i2c_sel', LINKBIT_I2C_SEL_FN);
  generator.addSetup('linkbit_i2c_sel_gauge', 'linkbitI2CSel(1); // I2C 通道 -> BQ27220 电量计');
  generator.addSetup('wire_begin', 'Wire.begin(20, 21); Wire.setClock(400000); // linkbit I2C: SDA=20 SCL=21');

  let setupCode = varName + '.begin(&Wire, ' + address + ', 400000);\n';
  return setupCode;
};

Arduino.forBlock['bq27220_basic_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'voltage';

  const methodMap = {
    'voltage': 'getVoltage',
    'current': 'getCurrent',
    'avg_current': 'getAvgCurrent',
    'temperature': 'getTemperature',
    'soc': 'getSoc'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_time_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'tte';

  const methodMap = {
    'tte': 'getTimeToEmpty',
    'ttf': 'getTimeToFull'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_capacity_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'remaining_capacity';

  const methodMap = {
    'remaining_capacity': 'getRemainingCapacity',
    'full_charge_capacity': 'getFullChargeCapacity',
    'cycle_count': 'getCycleCount',
    'soh': 'getSoh'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_set_design_capacity'] = function(block, generator) {
  const varName = getBQVarName(block);
  const capacity = generator.valueToCode(block, 'CAPACITY', generator.ORDER_ATOMIC) || '3000';
  return varName + '.setDesignCapacity((uint16_t)(' + capacity + '));\n';
};
