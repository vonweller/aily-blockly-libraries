'use strict';

function arduinoSdEnsureLibrary(generator) {
  generator.addLibrary('arduino_sd_include', '#include <SD.h>');
}

function arduinoSdFileName(block, fieldName, fallback) {
  var field = block.getField(fieldName);
  return field ? field.getText() : fallback;
}

function arduinoSdAttachFileVariable(block, fieldName, fallback) {
  var key = '_arduinoSd_' + fieldName + '_varMonitorAttached';
  if (block[key]) return;

  block[key] = true;
  var lastKey = key + '_lastName';
  block[lastKey] = block.getFieldValue(fieldName) || fallback;

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block[lastKey], 'File');
  }

  var field = block.getField(fieldName);
  if (!field) return;

  var originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    if (newName && newName !== block[lastKey]) {
      if (typeof renameVariableInBlockly === 'function') {
        renameVariableInBlockly(block, block[lastKey], newName, 'File');
      }
      block[lastKey] = newName;
    }
  };
}

function arduinoSdDeclareFile(block, generator, fieldName, fallback) {
  arduinoSdAttachFileVariable(block, fieldName, fallback);
  var name = block.getFieldValue(fieldName) || fallback;
  generator.addObject('arduino_sd_file_' + name, 'File ' + name + ';');
  return name;
}

Arduino.forBlock['arduino_sd_init'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  generator.addSetupBegin('arduino_sd_begin', 'SD.begin();');
  return '';
};

Arduino.forBlock['arduino_sd_init_cs'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '10';
  generator.addSetupBegin('arduino_sd_begin', 'SD.begin(' + cs + ');');
  return '';
};

Arduino.forBlock['arduino_sd_init_clock'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '10';
  var clock = generator.valueToCode(block, 'CLOCK', generator.ORDER_ATOMIC) || '4000000';
  generator.addSetupBegin('arduino_sd_begin', 'SD.begin((uint32_t)(' + clock + '), ' + cs + ');');
  return '';
};

Arduino.forBlock['arduino_sd_begin_result'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '10';
  return ['SD.begin(' + cs + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_end'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  return 'SD.end();\n';
};

Arduino.forBlock['arduino_sd_exists'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  return ['SD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_path_operation'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var operation = block.getFieldValue('OP') || 'mkdir';
  var path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/data"';
  return 'SD.' + operation + '(' + path + ');\n';
};

Arduino.forBlock['arduino_sd_file_create'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdDeclareFile(block, generator, 'VAR', 'sdFile');
  var path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/data.txt"';
  var mode = block.getFieldValue('MODE') || 'FILE_READ';
  return name + ' = SD.open(' + path + ', ' + mode + ');\n';
};

Arduino.forBlock['arduino_sd_file_create_next'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdDeclareFile(block, generator, 'VAR', 'entry');
  var directory = arduinoSdFileName(block, 'DIR', 'root');
  var mode = block.getFieldValue('MODE') || 'FILE_READ';
  return name + ' = ' + directory + '.openNextFile(' + mode + ');\n';
};

Arduino.forBlock['arduino_sd_file_is_open'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  return ['(bool)' + name, generator.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_sd_file_is_directory'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  return [name + '.isDirectory()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_name'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  return ['String(' + name + '.name())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_read'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'read';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_available'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'available';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_position'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'position';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_seek'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  return [name + '.seek(' + position + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['arduino_sd_file_write'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'write';
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_NONE) || '""';
  var base = block.getFieldValue('BASE') || 'AUTO';
  var baseArgument = operation !== 'write' && base !== 'AUTO' ? ', ' + base : '';
  return name + '.' + operation + '(' + data + baseArgument + ');\n';
};

Arduino.forBlock['arduino_sd_file_control'] = function(block, generator) {
  arduinoSdEnsureLibrary(generator);
  var name = arduinoSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'flush';
  return name + '.' + operation + '();\n';
};
