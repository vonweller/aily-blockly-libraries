// BH1750光照传感器库的代码生成器

// 添加库和变量声明
function ensureBH1750Setup(varName, address, generator) {
  generator.addLibrary('bh1750', '#include <BH1750.h>');
  generator.addVariable(`bh1750_${varName}`, `BH1750 ${varName}(${address});`);
}

// 创建/初始化对象
Arduino.forBlock['bh1750_create'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const address = block.getFieldValue('ADDRESS') || '0x23';
  ensureBH1750Setup(varName, address, generator);
  return '';
};

// 初始化或开始
Arduino.forBlock['bh1750_begin'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const mode = block.getFieldValue('MODE') || 'BH1750::CONTINUOUS_HIGH_RES_MODE';
  const address = block.getFieldValue('ADDRESS') || '0x23';
  const wire = block.getFieldValue('WIRE');
  ensureBH1750Setup(varName, address, generator);
  let code;
  if (wire && wire !== 'Wire') {
    code = `${varName}.begin(${mode}, ${address}, &${wire});\n`;
  } else if (address && address !== '0x23') {
    code = `${varName}.begin(${mode}, ${address});\n`;
  } else {
    code = `${varName}.begin(${mode});\n`;
  }
  generator.addSetup(`bh1750_begin_${varName}`, code);
  return '';
};

// 配置模式
Arduino.forBlock['bh1750_configure'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const mode = block.getFieldValue('MODE');
  return `${varName}.configure(${mode});\n`;
};

// 设置测量时间寄存器
Arduino.forBlock['bh1750_set_mtreg'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '69';
  return `${varName}.setMTreg(${value});\n`;
};

// 检查测量是否就绪
Arduino.forBlock['bh1750_measurement_ready'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  const maxWait = block.getFieldValue('MAX_WAIT') === 'TRUE' ? 'true' : 'false';
  return [`${varName}.measurementReady(${maxWait})`, generator.ORDER_FUNCTION_CALL];
};

// 读取光照强度
Arduino.forBlock['bh1750_read_light_level'] = function(block, generator) {
  const varName = block.getFieldValue('VAR');
  return [`${varName}.readLightLevel()`, generator.ORDER_FUNCTION_CALL];
};
