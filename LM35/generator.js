Arduino.forBlock['lm35_setup'] = function(block, generator) {
  var pin = block.getFieldValue('PIN');
  // 存储引脚配置以供读取块使用
  generator.lm35Pin = pin;
  // 不需要特别的初始化代码，因为模拟引脚默认就是INPUT模式
  return `// 初始化LM35温度传感器在引脚${pin}\n`;
};

Arduino.forBlock['lm35_read'] = function(block, generator) {
  var pin = generator.lm35Pin || 'A0';
  
  // LM35输出电压与温度成正比：10mV/°C
  // 对于5V参考电压，Arduino ADC的计算公式：
  // 温度(°C) = (analogRead(pin) * 5.0 / 1024.0) * 100.0
  
  if (!generator.lm35Pin) {
    // 如果用户没有使用设置块，添加警告
    console.warn('未找到LM35初始化块，使用默认引脚A0');
  }
  
  // 确保必要的变量定义只添加一次
  generator.addVariable('lm35_temp', 'float lm35_temp = 0.0;');
  
  return [`(analogRead(${pin}) * 5.0 / 1024.0 * 100.0)`, Arduino.ORDER_MULTIPLICATIVE];
};