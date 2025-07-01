// PID控制器库 Generator
// 支持基础PID控制、自适应参数调节、基于测量值的比例控制等功能

// 获取变量名的辅助函数
function getVariableName(block, fieldName) {
  const variableField = block.getField(fieldName);
  if (variableField && variableField.getVariable) {
    const variableModel = variableField.getVariable();
    return variableModel.name;
  }
  return block.getFieldValue(fieldName);
}

// 初始化PID控制器
Arduino.forBlock['pid_init'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const inputVar = getVariableName(block, 'INPUT');
    const outputVar = getVariableName(block, 'OUTPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const kp = block.getFieldValue('KP');
    const ki = block.getFieldValue('KI');
    const kd = block.getFieldValue('KD');
    const direction = block.getFieldValue('DIRECTION');

    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量声明 - 分别声明避免冲突
    generator.addVariable(`pid_var_${inputVar}`, `double ${inputVar};`);
    generator.addVariable(`pid_var_${outputVar}`, `double ${outputVar};`);
    generator.addVariable(`pid_var_${setpointVar}`, `double ${setpointVar};`);
    generator.addVariable(`pid_tuning_${pidName}`, `double Kp_${pidName} = ${kp}, Ki_${pidName} = ${ki}, Kd_${pidName} = ${kd};`);
    
    // 添加PID对象
    generator.addObject(`pid_object_${pidName}`, `PID ${pidName}(&${inputVar}, &${outputVar}, &${setpointVar}, Kp_${pidName}, Ki_${pidName}, Kd_${pidName}, ${direction});`);
    
    // 在setup中启用PID
    generator.addSetup(`pid_mode_${pidName}`, `${pidName}.SetMode(AUTOMATIC);`);

    return '';
};

// PID计算
Arduino.forBlock['pid_compute'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    
    return `${pidName}.Compute();\n`;
};

// 设置PID模式
Arduino.forBlock['pid_set_mode'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const mode = block.getFieldValue('MODE');
    
    return `${pidName}.SetMode(${mode});\n`;
};

// 设置PID参数
Arduino.forBlock['pid_set_tunings'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const kp = generator.valueToCode(block, 'KP', Arduino.ORDER_ATOMIC) || '0';
    const ki = generator.valueToCode(block, 'KI', Arduino.ORDER_ATOMIC) || '0';
    const kd = generator.valueToCode(block, 'KD', Arduino.ORDER_ATOMIC) || '0';
    
    return `${pidName}.SetTunings(${kp}, ${ki}, ${kd});\n`;
};

// 设置输出限制
Arduino.forBlock['pid_set_output_limits'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const minVal = generator.valueToCode(block, 'MIN', Arduino.ORDER_ATOMIC) || '0';
    const maxVal = generator.valueToCode(block, 'MAX', Arduino.ORDER_ATOMIC) || '255';
    
    return `${pidName}.SetOutputLimits(${minVal}, ${maxVal});\n`;
};

// 简化PID控制
Arduino.forBlock['pid_simple_control'] = function(block, generator) {
    const inputPin = block.getFieldValue('INPUT_PIN');
    const outputPin = block.getFieldValue('OUTPUT_PIN');
    const setpoint = block.getFieldValue('SETPOINT');
    const kp = block.getFieldValue('KP');
    const ki = block.getFieldValue('KI');
    const kd = block.getFieldValue('KD');
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量
    generator.addVariable('pid_simple_vars', `double pidInput, pidOutput, pidSetpoint = ${setpoint};`);
    generator.addVariable('pid_simple_tuning', `double simplePidKp = ${kp}, simplePidKi = ${ki}, simplePidKd = ${kd};`);
    
    // 添加PID对象
    generator.addObject('pid_simple_object', `PID simplePID(&pidInput, &pidOutput, &pidSetpoint, simplePidKp, simplePidKi, simplePidKd, DIRECT);`);
    
    // 在setup中设置
    generator.addSetup('pid_simple_setup', `simplePID.SetMode(AUTOMATIC);`);
    generator.addSetup(`pid_simple_pin_${outputPin}`, `pinMode(${outputPin}, OUTPUT);`);
    
    return `pidInput = analogRead(${inputPin});\nsimplePID.Compute();\nanalogWrite(${outputPin}, pidOutput);\n`;
};

// 获取PID输入值
Arduino.forBlock['pid_get_input'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    
    return [`${inputVar}`, Arduino.ORDER_ATOMIC];
};

// 获取PID输出值
Arduino.forBlock['pid_get_output'] = function(block, generator) {
    const outputVar = getVariableName(block, 'OUTPUT');
    
    return [`${outputVar}`, Arduino.ORDER_ATOMIC];
};

// 设置PID目标值
Arduino.forBlock['pid_set_setpoint'] = function(block, generator) {
    const setpointVar = getVariableName(block, 'SETPOINT');
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    
    return `${setpointVar} = ${value};\n`;
};

// 设置PID输入值
Arduino.forBlock['pid_set_input'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    
    return `${inputVar} = ${value};\n`;
};

// 自适应PID控制
Arduino.forBlock['pid_adaptive_control'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const threshold = block.getFieldValue('THRESHOLD');
    const aggKp = block.getFieldValue('AGG_KP');
    const aggKi = block.getFieldValue('AGG_KI');
    const aggKd = block.getFieldValue('AGG_KD');
    const consKp = block.getFieldValue('CONS_KP');
    const consKi = block.getFieldValue('CONS_KI');
    const consKd = block.getFieldValue('CONS_KD');
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加自适应参数变量
    generator.addVariable(`adaptive_${pidName}`, `double aggKp_${pidName} = ${aggKp}, aggKi_${pidName} = ${aggKi}, aggKd_${pidName} = ${aggKd};`);
    generator.addVariable(`conservative_${pidName}`, `double consKp_${pidName} = ${consKp}, consKi_${pidName} = ${consKi}, consKd_${pidName} = ${consKd};`);
    
    const code = `double gap_${pidName} = abs(${setpointVar} - ${inputVar});
if (gap_${pidName} < ${threshold}) {
    ${pidName}.SetTunings(consKp_${pidName}, consKi_${pidName}, consKd_${pidName});
} else {
    ${pidName}.SetTunings(aggKp_${pidName}, aggKi_${pidName}, aggKd_${pidName});
}
${pidName}.Compute();
`;
    
    return code;
};

// PID比例控制模式设置 (P_ON_M vs P_ON_E)
Arduino.forBlock['pid_set_proportional_mode'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const mode = block.getFieldValue('MODE'); // P_ON_M 或 P_ON_E
    const direction = block.getFieldValue('DIRECTION');
    
    // 注意：需要重新初始化PID对象来改变比例模式
    const inputVar = getVariableName(block, 'INPUT');
    const outputVar = getVariableName(block, 'OUTPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const kp = generator.valueToCode(block, 'KP', Arduino.ORDER_ATOMIC) || '2';
    const ki = generator.valueToCode(block, 'KI', Arduino.ORDER_ATOMIC) || '5';
    const kd = generator.valueToCode(block, 'KD', Arduino.ORDER_ATOMIC) || '1';
    
    return `${pidName} = PID(&${inputVar}, &${outputVar}, &${setpointVar}, ${kp}, ${ki}, ${kd}, ${mode}, ${direction});\n${pidName}.SetMode(AUTOMATIC);\n`;
};

// 判断条件：PID是否达到目标值
Arduino.forBlock['pid_is_at_setpoint'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const tolerance = block.getFieldValue('TOLERANCE');
    
    const code = `abs(${setpointVar} - ${inputVar}) <= ${tolerance}`;
    return [code, Arduino.ORDER_RELATIONAL];
};

// 获取PID误差值
Arduino.forBlock['pid_get_error'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    
    const code = `(${setpointVar} - ${inputVar})`;
    return [code, Arduino.ORDER_ADDITIVE];
};
