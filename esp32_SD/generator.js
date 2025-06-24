/**
 * @license
 * SD卡文件系统操作的Blockly to Arduino代码生成器（整合）
 */

'use strict';

// 工具方法：添加 SD/FS 库（去重）
function addSDFSLib(generator) {
  generator.addLibrary('SD_include', '#include <SD.h>');
  generator.addLibrary('FS_include', '#include <FS.h>');
}

// SD卡初始化 - SD.begin([csPin])
Arduino.forBlock['sd_begin'] = function(block, generator) {
  addSDFSLib(generator);
  const csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC) || 'SS';
  const code = `SD.begin(${csPin})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取SD卡类型 - SD.cardType()
Arduino.forBlock['sd_card_type'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.cardType()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取SD卡容量 - SD.cardSize()
Arduino.forBlock['sd_card_size'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.cardSize()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取总空间 - SD.totalBytes()
Arduino.forBlock['sd_total_bytes'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.totalBytes()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取已用空间 - SD.usedBytes()
Arduino.forBlock['sd_used_bytes'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.usedBytes()', Arduino.ORDER_FUNCTION_CALL];
};

// 打开文件/目录 - SD.open(path [, mode])
Arduino.forBlock['sd_open'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  const mode = generator.valueToCode(block, 'MODE', Arduino.ORDER_ATOMIC) || 'FILE_READ';
  return [`SD.open(${path}, ${mode})`, Arduino.ORDER_FUNCTION_CALL];
};

// 创建目录 - SD.mkdir(path)
Arduino.forBlock['sd_mkdir'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.mkdir(${path});\n`;
};

// 删除目录 - SD.rmdir(path)
Arduino.forBlock['sd_rmdir'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.rmdir(${path});\n`;
};

// 删除文件 - SD.remove(path)
Arduino.forBlock['sd_remove'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.remove(${path});\n`;
};

// 重命名文件/目录 - SD.rename(pathFrom, pathTo)
Arduino.forBlock['sd_rename'] = function(block, generator) {
  addSDFSLib(generator);
  const pathFrom = generator.valueToCode(block, 'PATH_FROM', Arduino.ORDER_ATOMIC);
  const pathTo = generator.valueToCode(block, 'PATH_TO', Arduino.ORDER_ATOMIC);
  return `SD.rename(${pathFrom}, ${pathTo});\n`;
};

// 判断文件是否为目录 - File::isDirectory()
Arduino.forBlock['file_is_directory'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.isDirectory()`, Arduino.ORDER_MEMBER];
};

// 遍历目录下的文件 - File::openNextFile()
Arduino.forBlock['file_open_next_file'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.openNextFile()`, Arduino.ORDER_MEMBER];
};

// 获取文件/目录名 - File::name()
Arduino.forBlock['file_name'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.name()`, Arduino.ORDER_MEMBER];
};

// 获取文件大小 - File::size()
Arduino.forBlock['file_size'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.size()`, Arduino.ORDER_MEMBER];
};

// 获取最后修改时间 - File::getLastWrite()
Arduino.forBlock['file_get_last_write'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.getLastWrite()`, Arduino.ORDER_MEMBER];
};

// 可读取字节数 - File::available()
Arduino.forBlock['file_available'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.available()`, Arduino.ORDER_MEMBER];
};

// 读取数据 - File::read()
Arduino.forBlock['file_read'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.read()`, Arduino.ORDER_MEMBER];
};

// 写入数据 - File::write(data)
Arduino.forBlock['file_write'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  return `${fileVar}.write(${data});\n`;
};

// 打印到文件 - File::print(data)
Arduino.forBlock['file_print'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  return `${fileVar}.print(${data});\n`;
};

// 关闭文件 - File::close()
Arduino.forBlock['file_close'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return `${fileVar}.close();\n`;
};
