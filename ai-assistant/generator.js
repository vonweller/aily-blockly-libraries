/**
 * 智能小车AI-assistant通信模块代码生成器
 */

Arduino.forBlock['smartcar_ai_assistant_config'] = function (block, generator) {
  // 获取RX和TX引脚参数
  let rxPin = block.getFieldValue('RX_PIN') || '2';
  let txPin = block.getFieldValue('TX_PIN') || '3';
  
  // 添加SoftwareSerial库
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  
  // 添加命令接收相关的变量
  generator.addVariable('receivedCommand', 'String receivedCommand = "";');
  generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
  
  // 添加初始化代码
  generator.addSetupBegin('serial_begin', '  // 初始化硬件串口\n  if(!Serial) { Serial.begin(9600); }');
  generator.addSetupBegin('myserial_begin', '  // 初始化软串口\n  mySerial.begin(9600);\n  Serial.println("系统启动，等待软串口命令...");');
  
  return '';
};

Arduino.forBlock['smartcar_ai_assistant_receive'] = function (block, generator) {
  // 生成从软串口获取命令的代码
  generator.addLoop('receive_command', `// 从软串口获取命令并保存到receivedCommand变量
if (mySerial.available()) {
    String cmd = "";
    unsigned long startTime = millis();
    // 最多等待100ms来读取全部数据
    while (millis() - startTime < 100) {
        if (mySerial.available()) {
            char c = mySerial.read();
            if (c == 10 || c == 13) {
                break;
            }
            cmd += c;
            delay(2);
        }
    }
    if (cmd.length() > 0) {
        receivedCommand = cmd;
        Serial.print("软串口收到命令: ");
        Serial.println(receivedCommand);
    }
}
`);
  
  return '';
};

Arduino.forBlock['smartcar_serial_command_handler'] = function (block, generator) {
  let actionType = block.getFieldValue('ACTION') || "MOVE_FORWARD";
  
  generator.addLibrary('SmartCar', '#include <SmartCar.h>');
  generator.addObject('smartCar', 'SmartCar smartCar;');
  
  let code = "false";
  
  switch(actionType) {
    case "MOVE_FORWARD":
      code = "(receivedCommand.indexOf(\"MOVE F\") >= 0)";
      break;
      
    case "MOVE_BACKWARD":
      code = "(receivedCommand.indexOf(\"MOVE B\") >= 0)";
      break;
      
    case "TURN_LEFT":
      code = "(receivedCommand.indexOf(\"MOVE L\") >= 0)";
      break;
      
    case "TURN_RIGHT":
      code = "(receivedCommand.indexOf(\"MOVE R\") >= 0)";
      break;
      
    case "STOP":
      code = "(receivedCommand.indexOf(\"MOVE S\") >= 0)";
      break;
      
    case "LED_ON":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"ON\") > 0)";
      break;
      
    case "LED_OFF":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"OFF\") > 0)";
      break;
      
    case "LED_BLINK":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"BLINK\") > 0)";
      break;
      
    case "SERVO_ROTATE":
      code = "(receivedCommand.indexOf(\"SERVO\") >= 0)";
      break;
      
    case "FAN_SPEED":
      code = "(receivedCommand.indexOf(\"FAN_SPEED\") >= 0)";
      break;
      
    case "FAN_ON":
      code = "(receivedCommand.indexOf(\"FAN_ON\") >= 0)";
      break;
      
    case "FAN_OFF":
      code = "(receivedCommand.indexOf(\"FAN_OFF\") >= 0)";
      break;
      
    case "RGB_ON":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"ON\") > 0)";
      break;
      
    case "RGB_OFF":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"OFF\") > 0)";
      break;
      
    case "RGB_BRIGHTNESS":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"LIGHT\") > 0)";
      break;
      
    case "RGB_GRADIENT":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"GRADIENT\") > 0)";
      break;
      
    case "ARM_GRAB":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"GRAB\") > 0)";
      break;
      
    case "ARM_RELEASE":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"RELEASE\") > 0)";
      break;
      
    case "ARM_DOWN":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"DOWN\") > 0)";
      break;
      
    case "RELAY_ON":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"ON\") > 0)";
      break;
      
    case "RELAY_OFF":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"OFF\") > 0)";
      break;
      
    default:
      code = "false";
  }
  
  return [code, Arduino.ORDER_RELATIONAL];
};
