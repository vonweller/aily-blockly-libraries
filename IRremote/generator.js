Arduino.forBlock['irrecv_attach'] = function(block, generator) {
  var object = block.getFieldValue('OBJECT');
  var pin = block.getFieldValue('PIN');
  generator.addLibrary('#include <IRremote.h>', '#include <IRremote.h>');
  generator.addLibrary('#include <IRProtocol.h>', '#include <IRProtocol.h>');
  generator.addVariable(object, 'IRrecv ' + object + '(' + pin + ')');
  generator.addSetup('irrecv_begin_' + object, object + '.enableIRIn();');
  return '';
};

Arduino.forBlock['irrecv_decode'] = function(block, generator) {
  var object = block.getFieldValue('OBJECT');
  var code = 'decode_results results;
';
  code += 'if (' + object + '.decode(&results)) {
';
  code += '  printIRResultShort(&Serial, (IRData *)&results, true);
';
  code += '  ' + object + '.resume();
';
  code += '}
';
  return code;
};

// 合并的附加代码
Arduino.forBlock['ir_send_nec'] = function(block, generator) {
  var sendPin = block.getFieldValue('SEND_PIN');
  var address = block.getFieldValue('ADDRESS');
  var command = block.getFieldValue('COMMAND');
  var repeats = block.getFieldValue('REPEATS');
  generator.addLibrary('#include <IRremoteInt.h>', '#include <IRremoteInt.h>');
  generator.addLibrary('#include <TinyIR.h>', '#include <TinyIR.h>');
  var code = 'sendNEC(' + sendPin + ', ' + address + ', ' + command + ', ' + repeats + ', false);';
  return code;
};

Arduino.forBlock['ir_recv_begin'] = function(block, generator) {
  var recvPin = block.getFieldValue('RECV_PIN');
  generator.addLibrary('#include <IRremoteInt.h>', '#include <IRremoteInt.h>');
  generator.addLibrary('#include <TinyIR.h>', '#include <TinyIR.h>');
  var code = 'IrReceiver.begin(' + recvPin + ');';
  return code;
};

Arduino.forBlock['ir_receive'] = function(block, generator) {
  generator.addLibrary('#include <IRremoteInt.h>', '#include <IRremoteInt.h>');
  generator.addLibrary('#include <TinyIR.h>', '#include <TinyIR.h>');
  var code = 'if (IrReceiver.decode()) { IrReceiver.printIRResultMinimal(&Serial); IrReceiver.resume(); }';
  return code;
};