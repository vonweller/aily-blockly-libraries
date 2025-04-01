Arduino.forBlock["io_pin_digi"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_mode"] = function (block, generator) {
  const code = block.getFieldValue("MODE");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_state"] = function (block, generator) {
  const code = block.getFieldValue("STATE");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_pin_adc"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_pin_pwm"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_pinmode"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const mode = generator.valueToCode(block, "MODE", Arduino.ORDER_ATOMIC);

  // 记录该引脚已经被手动设置了模式
  if (!generator.pinModeSet) {
    generator.pinModeSet = new Set();
  }
  generator.pinModeSet.add(pin);

  return `pinMode(${pin}, ${mode});\n`;
};
Arduino.forBlock["io_digitalread"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);

  // 如果引脚没有被设置过模式，则自动添加pinMode
  if (!generator.pinModeSet || !generator.pinModeSet.has(pin)) {
    generator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
  }

  return [`digitalRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["io_digitalwrite"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const value = generator.valueToCode(block, "STATE", Arduino.ORDER_ATOMIC);

  // 如果引脚没有被设置过模式，则自动添加pinMode
  if (!generator.pinModeSet || !generator.pinModeSet.has(pin)) {
    generator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
  }

  return `digitalWrite(${pin}, ${value});\n`;
};

Arduino.forBlock["io_analogread"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  return [`analogRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["io_analogwrite"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const value = generator.valueToCode(block, "PWM", Arduino.ORDER_ATOMIC);
  return `analogWrite(${pin}, ${value});\n`;
};

Arduino.forBlock["io_attach_interrupt"] = function (block, generator) {
  console.log("io_attach_interrupt");
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const mode = block.getFieldValue("MODE");
  const callback = generator.statementToCode(block, "HANDLER") || "// no callback";

  console.log("callback", callback);
  console.log("mode: ", mode);
  console.log("pin: ", pin);

  generator.addSetup(`pinMode(${pin})`, `pinMode(${pin}, ${mode});`);
  Arduino.forBlock["io_pin_digi"] = function (block, generator) {
    const code = block.getFieldValue("PIN");
    return [code, Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock["io_mode"] = function (block, generator) {
    const code = block.getFieldValue("MODE");
    return [code, Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock["io_state"] = function (block, generator) {
    const code = block.getFieldValue("STATE");
    return [code, Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock["io_pin_adc"] = function (block, generator) {
    const code = block.getFieldValue("PIN");
    return [code, Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock["io_pin_pwm"] = function (block, generator) {
    const code = block.getFieldValue("PIN");
    return [code, Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock["io_pinmode"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    const mode = generator.valueToCode(block, "MODE", Arduino.ORDER_ATOMIC);

    // 记录该引脚已经被手动设置了模式
    if (!generator.pinModeSet) {
      generator.pinModeSet = new Set();
    }
    generator.pinModeSet.add(pin);

    return `pinMode(${pin}, ${mode});\n`;
  };
  Arduino.forBlock["io_digitalread"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);

    // 如果引脚没有被设置过模式，则自动添加pinMode
    if (!generator.pinModeSet || !generator.pinModeSet.has(pin)) {
      generator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
    }

    return [`digitalRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
  };

  Arduino.forBlock["io_digitalwrite"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    const value = generator.valueToCode(block, "STATE", Arduino.ORDER_ATOMIC);

    // 如果引脚没有被设置过模式，则自动添加pinMode
    if (!generator.pinModeSet || !generator.pinModeSet.has(pin)) {
      generator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
    }

    return `digitalWrite(${pin}, ${value});\n`;
  };

  Arduino.forBlock["io_analogread"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    return [`analogRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
  };

  Arduino.forBlock["io_analogwrite"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    const value = generator.valueToCode(block, "PWM", Arduino.ORDER_ATOMIC);
    return `analogWrite(${pin}, ${value});\n`;
  };

  Arduino.forBlock["io_attach_interrupt"] = function (block, generator) {
    console.log("io_attach_interrupt");
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    const mode = block.getFieldValue("MODE");
    const callback = generator.statementToCode(block, "HANDLER") || "// no callback";

    console.log("callback", callback);
    console.log("mode: ", mode);
    console.log("pin: ", pin);

    generator.addSetup(`pinMode(${pin})`, `pinMode(${pin}, ${mode});`);

    const funcName = `attachInterrupt_${mode}_${pin}`;
    const funcCode = `void ${funcName}() {\n  ${callback}\n}`;
    generator.addFunction(funcName, funcCode);

    // Add the attachInterrupt call to setup
    generator.addLoop(`attachInterrupt_${pin}`,
      `attachInterrupt(digitalPinToInterrupt(${pin}), ${funcName}, ${mode});`);

    return ""; // No code generated in the main loop
  };

  Arduino.forBlock["io_detach_interrupt"] = function (block, generator) {
    const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
    generator.addLoop(`detachInterrupt_${pin}`,
      `detachInterrupt(digitalPinToInterrupt(${pin}));`);
    return ""; // No code generated in the main loop
  }
  const funcName = `attachInterrupt_${mode}_${pin}`;
  const funcCode = `void ${funcName}() {\n  ${callback}\n}`;
  generator.addFunction(funcName, funcCode);

  // Add the attachInterrupt call to setup
  generator.addLoop(`attachInterrupt_${pin}`,
    `attachInterrupt(digitalPinToInterrupt(${pin}), ${funcName}, ${mode});`);

  return ""; // No code generated in the main loop
};

Arduino.forBlock["io_detach_interrupt"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  generator.addLoop(`detachInterrupt_${pin}`,
    `detachInterrupt(digitalPinToInterrupt(${pin}));`);
  return ""; // No code generated in the main loop
}