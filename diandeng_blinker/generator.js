// 检查并移除已存在的扩展注册
if (Blockly.Extensions.isRegistered('blinker_init_wifi_extension')) {
    Blockly.Extensions.unregister('blinker_init_wifi_extension');
}

Blockly.Extensions.register('blinker_init_wifi_extension', function () {
    // 直接在扩展中添加updateShape_函数
    this.updateShape_ = function (configType) {
        // 先移除消息1和消息2
        if (this.getInput('MESSAGE1')) {
            this.removeInput('MESSAGE1');
        }
        if (this.getInput('MESSAGE2')) {
            this.removeInput('MESSAGE2');
        }

        // 如果是手动配网，添加密钥和WiFi配置字段
        if (configType !== 'EspTouchV2') {
            this.appendDummyInput('MESSAGE1')
                .appendField("密钥")
                .appendField(new Blockly.FieldTextInput(""), "AUTH");

            this.appendDummyInput('MESSAGE2')
                .appendField("WiFi名称")
                .appendField(new Blockly.FieldTextInput(""), "SSID")
                .appendField("WiFi密码")
                .appendField(new Blockly.FieldTextInput(""), "PSWD");
        }
    };

    // 监听MODE字段的变化
    this.getField('MODE').setValidator(function (option) {
        this.getSourceBlock().updateShape_(option);
        return option;
    });

    this.updateShape_(this.getFieldValue('MODE'));
});

Arduino.forBlock['blinker_init_wifi'] = function (block, generator) {
    // 获取用户选择的配网选项
    let configOption = block.getFieldValue('MODE');

    // 添加共通的库和宏定义
    generator.addMacro('#define BLINKER_WIFI', '#define BLINKER_WIFI');
    generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');
    generator.addLoopEnd('Blinker.run()', 'Blinker.run();');

    let code = '';

    if (configOption === "EspTouchV2") {
        // EspTouchV2配网方式
        generator.addMacro('#define BLINKER_ESPTOUCH_V2', '#define BLINKER_ESPTOUCH_V2');
        code = 'Blinker.begin();\n';
    } else {
        // 手动配网方式
        let ssid = block.getFieldValue('SSID') || "Your WiFi SSID";
        let pswd = block.getFieldValue('PSWD') || "Your WiFi Password";
        let auth = block.getFieldValue('AUTH') || "Your Device Secret Key";

        generator.addVariable('char ssid[]', 'char ssid[] = "' + ssid + '";');
        generator.addVariable('char pswd[]', 'char pswd[] = "' + pswd + '";');
        generator.addVariable('char auth[]', 'char auth[] = "' + auth + '";');
        code = 'Blinker.begin(auth, ssid, pswd);\n';
    }

    return code;
};

Arduino.forBlock['blinker_init_ble'] = function (block, generator) {
    generator.addMacro('#define BLINKER_BLE', '#define BLINKER_BLE');
    generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');

    var code = 'Blinker.begin();\n';
    return code;
};

Arduino.forBlock['blinker_reset'] = function (block, generator) {
    return 'Blinker.reset();\n';
};

Arduino.forBlock['blinker_debug_init'] = function (block, generator) {
    // 获取用户选择的串口和速率
    let serial = block.getFieldValue('SERIAL');
    let speed = block.getFieldValue('SPEED');

    let code = serial + '.begin(' + speed + ');\n';
    return code;
};

Arduino.forBlock['blinker_button'] = function (block, generator) {
    // 获取按键名称
    let key = block.getFieldValue('KEY');
    // 获取内部语句块
    let statements = generator.statementToCode(block, 'NAME');

    // 创建按钮对象变量名
    let varName = 'Button_' + key.replace(/-/g, '_');

    // 添加按钮组件对象
    generator.addVariable(varName, 'BlinkerButton ' + varName + '("' + key + '");');

    // 添加按钮回调函数
    let functionName = 'button_' + key.replace(/-/g, '_') + '_callback';
    let functionCode = 'void ' + functionName + '(const String & state) {\n' +
        statements +
        '}\n';

    generator.addFunction(functionName, functionCode);

    // 在setup中添加callback绑定
    generator.addSetup('button_' + key, varName + '.attach(' + functionName + ');');

    return '';
};

Arduino.forBlock['blinker_button_state'] = function (block, generator) {
    // 获取要检查的状态
    let state = block.getFieldValue('STATE');

    let code = 'state == "' + state + '"';
    return [code, Arduino.ORDER_EQUALITY];
};

Arduino.forBlock['blinker_slider'] = function (block, generator) {
    // 获取滑块名称
    let key = block.getFieldValue('KEY');
    // 获取内部语句块
    let statements = generator.statementToCode(block, 'NAME');

    // 创建滑块对象变量名
    let varName = 'Slider_' + key.replace(/-/g, '_');

    // 添加滑块组件对象
    generator.addVariable(varName, 'BlinkerSlider ' + varName + '("' + key + '");');

    // 添加滑块回调函数
    let functionName = 'slider_' + key.replace(/-/g, '_') + '_callback';
    let functionCode = 'void ' + functionName + '(int32_t value) {\n' +
        statements +
        '}\n';

    generator.addFunction(functionName, functionCode);

    // 在setup中添加callback绑定
    generator.addSetup('slider_' + key, varName + '.attach(' + functionName + ');');

    return '';
};

Arduino.forBlock['blinker_slider_value'] = function (block, generator) {
    let code = 'value';
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_colorpicker'] = function (block, generator) {
    // 获取调色器名称
    let key = block.getFieldValue('KEY');
    // 获取内部语句块
    let statements = generator.statementToCode(block, 'NAME');

    // 创建RGB对象变量名
    let varName = 'RGB_' + key.replace(/-/g, '_');

    // 添加RGB组件对象
    generator.addVariable(varName, 'BlinkerRGB ' + varName + '("' + key + '");');

    // 添加RGB回调函数
    let functionName = 'rgb_' + key.replace(/-/g, '_') + '_callback';
    let functionCode = 'void ' + functionName + '(uint8_t r_value, uint8_t g_value, uint8_t b_value, uint8_t bright_value) {\n' +
        statements +
        '}\n';

    generator.addFunction(functionName, functionCode);

    // 在setup中添加callback绑定
    generator.addSetup('rgb_' + key, varName + '.attach(' + functionName + ');');

    return '';
};

Arduino.forBlock['blinker_colorpicker_value'] = function (block, generator) {
    // 获取要获取的颜色分量
    let colorComponent = block.getFieldValue('KEY');

    let code = colorComponent.toLowerCase();
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_joystick'] = function (block, generator) {
    // 获取摇杆名称
    let key = block.getFieldValue('KEY');
    // 获取内部语句块
    let statements = generator.statementToCode(block, 'NAME');

    // 添加摇杆回调函数
    let functionName = 'joystick_' + key.replace(/-/g, '_') + '_callback';
    let functionCode = 'void ' + functionName + '(uint8_t xAxis, uint8_t yAxis) {\n' +
        statements +
        '}\n';

    generator.addFunction(functionName, functionCode);
    generator.addSetup('joystick_' + key, 'Blinker.attachJoystick("' + key + '", ' + functionName + ');');

    return '';
};

Arduino.forBlock['blinker_joystick_value'] = function (block, generator) {
    // 获取要获取的坐标轴
    let axis = block.getFieldValue('KEY');

    let code = axis.toLowerCase() + 'Axis';
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_print'] = function (block, generator) {
    // 检查block是否有KEY输入，以区分两种不同的blinker_print块
    if (block.inputList.some(input => input.name === 'KEY')) {
        // KEY-VALUE版本
        let key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
        let value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
        return 'Blinker.print(' + key + ', ' + value + ');\n';
    } else {
        // 纯TEXT版本
        let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
        return 'Blinker.print(' + text + ');\n';
    }
};

Arduino.forBlock['blinker_log'] = function (block, generator) {
    // 获取日志内容
    let text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

    let code = 'Blinker.log(' + text + ');\n';
    return code;
};

Arduino.forBlock['blinker_vibrate'] = function (block, generator) {
    return 'Blinker.vibrate();\n';
};

Arduino.forBlock['blinker_object_print'] = function (block, generator) {
    // 获取组件名称和更多参数
    let widget = block.getFieldValue('WIDGET');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = 'Blinker.printObject(' + `"${widget}",` + more + ');\n';
    return code;
};

Arduino.forBlock['blinker_state'] = function (block, generator) {
    // 获取状态名称和更多参数
    let state = block.getFieldValue('STATE');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = '{\"state\": \"' + state + '\", ' + more.substr(1);
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_icon'] = function (block, generator) {
    // 获取图标和更多参数
    let icon = block.getFieldValue('ICON');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = '{\"icon\": \"' + icon + '\", ' + more.substr(1);
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_color'] = function (block, generator) {
    // 获取颜色和更多参数
    let color = block.getFieldValue('COLOR');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = '{\"color\": \"' + color + '\", ' + more.substr(1);
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_text'] = function (block, generator) {
    // 获取文本和更多参数
    let text = block.getFieldValue('TEXT');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = '{\"text\": \"' + text + '\", ' + more.substr(1);
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['blinker_value'] = function (block, generator) {
    // 获取数值名称和更多参数
    let text = block.getFieldValue('TEXT');
    let more = generator.valueToCode(block, 'MORE', Arduino.ORDER_ATOMIC) || '{}';

    let code = '{\"value\": ' + text + ', ' + more.substr(1);
    return [code, Arduino.ORDER_ATOMIC];
};

