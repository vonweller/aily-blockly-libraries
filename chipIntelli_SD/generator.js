'use strict';

function chipIntelliSdEnsureLibrary(generator) {
  generator.addLibrary('chipintelli_sd_include', '#include <SD.h>');
}

function chipIntelliSdValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function chipIntelliSdFileName(block, fieldName, fallback) {
  var field = block.getField(fieldName);
  return field ? field.getText() : fallback;
}

function chipIntelliSdAttachFileVariable(block, fieldName, fallback) {
  var key = '_chipIntelliSd_' + fieldName + '_varMonitorAttached';
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

function chipIntelliSdDeclareFile(block, generator, fieldName, fallback) {
  chipIntelliSdAttachFileVariable(block, fieldName, fallback);
  var name = block.getFieldValue(fieldName) || fallback;
  generator.addObject('chipintelli_sd_file_' + name, 'File ' + name + ';');
  return name;
}

function chipIntelliSdPins(block, generator) {
  return {
    sck: chipIntelliSdValue(block, generator, 'SCK', '5'),
    miso: chipIntelliSdValue(block, generator, 'MISO', '2'),
    mosi: chipIntelliSdValue(block, generator, 'MOSI', '4'),
    cs: chipIntelliSdValue(block, generator, 'CS', '3')
  };
}

Arduino.forBlock['chipintelli_sd_init_pins'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var pins = chipIntelliSdPins(block, generator);
  generator.addSetupBegin(
    'chipintelli_sd_begin',
    'SD.begin(' + pins.sck + ', ' + pins.miso + ', ' + pins.mosi + ', ' + pins.cs + ');'
  );
  return '';
};

Arduino.forBlock['chipintelli_sd_error_info'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var info = block.getFieldValue('INFO') || 'cardErrorCode';
  return ['SD.' + info + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_end'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  return 'SD.end();\n';
};

Arduino.forBlock['chipintelli_sd_exists'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var path = chipIntelliSdValue(block, generator, 'PATH', '"/"');
  return ['SD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_path_operation'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var operation = block.getFieldValue('OP') || 'mkdir';
  var path = chipIntelliSdValue(block, generator, 'PATH', '"/data"');
  return 'SD.' + operation + '(' + path + ');\n';
};

Arduino.forBlock['chipintelli_sd_file_create'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdDeclareFile(block, generator, 'VAR', 'sdFile');
  var path = chipIntelliSdValue(block, generator, 'PATH', '"/data.txt"');
  var mode = block.getFieldValue('MODE') || 'FILE_READ';
  return name + ' = SD.open(' + path + ', ' + mode + ');\n';
};

Arduino.forBlock['chipintelli_sd_file_create_next'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdDeclareFile(block, generator, 'VAR', 'entry');
  var directory = chipIntelliSdFileName(block, 'DIR', 'root');
  var mode = block.getFieldValue('MODE') || 'FILE_READ';
  return name + ' = ' + directory + '.openNextFile(' + mode + ');\n';
};

Arduino.forBlock['chipintelli_sd_file_is_open'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  return ['(bool)' + name, generator.ORDER_ATOMIC];
};

Arduino.forBlock['chipintelli_sd_file_is_directory'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  return [name + '.isDirectory()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_name'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  return ['String(' + name + '.name())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_read'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'read';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_available'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'available';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_position'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'position';
  return [name + '.' + operation + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_seek'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var position = chipIntelliSdValue(block, generator, 'POSITION', '0');
  return [name + '.seek(' + position + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['chipintelli_sd_file_write'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'write';
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_NONE) || '""';
  var base = block.getFieldValue('BASE') || 'AUTO';
  var baseArgument = operation !== 'write' && base !== 'AUTO' ? ', ' + base : '';
  return name + '.' + operation + '(' + data + baseArgument + ');\n';
};

Arduino.forBlock['chipintelli_sd_file_control'] = function(block, generator) {
  chipIntelliSdEnsureLibrary(generator);
  var name = chipIntelliSdFileName(block, 'VAR', 'sdFile');
  var operation = block.getFieldValue('OP') || 'flush';
  return name + '.' + operation + '();\n';
};
