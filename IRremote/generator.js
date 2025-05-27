
Arduino.forBlock['QuickTesting'] = function (block, generator) {
  var irpin = block.getFieldValue("IRPIN");

  generator.addLibrary('MARK_EXCESS_MICROS', '#define MARK_EXCESS_MICROS    20');
  generator.addLibrary('#include <IRremote.hpp>', '#include <IRremote.hpp>');
  generator.addSetupBegin(irpin +'irqkbegin','Serial.begin(115200);\n  while(!Serial)\n   ;\n  IrReceiver.begin('+ irpin +', ENABLE_LED_FEEDBACK);');
  var code = 'if(IrReceiver.decode()) {\n  IrReceiver.printIRResultShort(&Serial);\n  IrReceiver.resume();\n}'
  return code;
};

Arduino.forBlock['irrecv_begin_in'] = function (block, generator) {
  var irpinin = block.getFieldValue('IRPININ');
  
  generator.addLibrary('MARK_EXCESS_MICROS', '#define MARK_EXCESS_MICROS    20');
  generator.addLibrary('#include <IRremote.hpp>', '#include <IRremote.hpp>');
  generator.addSetupBegin(irpinin + 'irqkbegin','IrReceiver.begin('+ irpinin +', ENABLE_LED_FEEDBACK);');
  return '';
};

Arduino.forBlock['irrecv_begin_out'] = function (block, generator) {
  var irpinout = block.getFieldValue('IRPINOUT');
  
  generator.addLibrary('#include <IRremote.hpp>', '#include <IRremote.hpp>');
  generator.addSetupBegin(irpinout + 'irbeginout','IrReceiver.begin('+ irpinout +');');
  return '';
};

Arduino.forBlock['irrecv_datain'] = function (block, generator) {
  const branch = Arduino.statementToCode(block, "IRDATA");
  var code = 'if (IrReceiver.decode()) {\n' + 
      'if(!(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_WAS_OVERFLOW)) {\n' +
      branch +
       '  IrReceiver.resume();\n}' +
       '}\n';
  return code;
};

Arduino.forBlock['irrecv_irdata'] = function (block, generator) {
  var code = 'IrReceiver.decodedIRData.command';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['irrecv_irsend'] = function (block, generator) {
  // 获取输入值
  const address = generator.valueToCode(block, 'IRADDRESS', Arduino.ORDER_ATOMIC) || '0';
  const data = generator.valueToCode(block, 'IROUTDATA', Arduino.ORDER_ATOMIC) || '0';

  // 生成红外发射代码
  const code = `IrSender.sendNEC(${address}, ${data}, 0);//后需要延时至少5ms再发送\n`;
  return code;
};