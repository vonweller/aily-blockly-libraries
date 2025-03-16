Arduino.forBlock["serial_begin"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const speed = block.getFieldValue("SPEED");
  // 使用tag标记已经初始化了特定串口
  generator.addSetup(`serial_${obj}_begin`, `${obj}.begin(${speed});`);
  return ``;
};

Arduino.forBlock["serial_print"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  // 如果没有初始化过这个串口，自动添加默认初始化
  ensureSerialBegin(obj, generator);
  return `${obj}.print(${content});`;
};

Arduino.forBlock["serial_println"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  ensureSerialBegin(obj, generator);
  return `${obj}.println(${content});`;
};

Arduino.forBlock["serial_read"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const type = block.getFieldValue("TYPE");
  ensureSerialBegin(obj, generator);
  return [`${obj}.${type}()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_available"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.available()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_flush"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return `${obj}.flush();`;
};

Arduino.forBlock["serial_parseint"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.parseInt()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_write"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const data =
    Arduino.valueToCode(block, "DATA", Arduino.ORDER_ATOMIC) || '\"\"';
  ensureSerialBegin(obj, generator);
  return `${obj}.write(${data});`;
};

Arduino.forBlock["serial_read_string"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.readString()`, Arduino.ORDER_FUNCTION_CALL];
};

// 辅助函数，确保串口已被初始化
function ensureSerialBegin(serialPort, generator) {
  // 使用条件方式添加串口初始化代码，如果同名tag的代码已存在则不会重复添加
  generator.addSetup(`serial_${serialPort}_begin`, `${serialPort}.begin(9600);`, true);
}

