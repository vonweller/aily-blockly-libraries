Arduino.forBlock['blinker_init_wifi'] = function (block, generator) {
    let ssid = block.getFieldValue('SSID') || "Your WiFi SSID";
    let pswd = block.getFieldValue('PSWD') || "Your WiFi Password";
    let auth = block.getFieldValue('AUTH') || "Your Device Secret Key";

    generator.addMacro('#define BLINKER_WIFI', '#define BLINKER_WIFI');
    generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');
    generator.addVariable('char ssid[]', 'char ssid[] = "' + ssid + '";');
    generator.addVariable('char pswd[]', 'char pswd[] = "' + pswd + '";');
    generator.addVariable('char auth[]', 'char auth[] = "' + auth + '";');
    generator.addUserLoop1('Blinker.run()', 'Blinker.run();');
    let code = 'Blinker.begin(auth, ssid, pswd);\n';
    return code;
};

Arduino.forBlock['blinker_init_ble'] = function (block, generator) {
    generator.addMacro('#define BLINKER_BLE', '#define BLINKER_BLE');
    generator.addLibrary('#include <Blinker.h>', '#include <Blinker.h>');

    var code = 'Blinker.begin();\n';
    return code;
};

Arduino.forBlock['blinker_debug_init'] = function (block, generator) {
    var serial_speed = block.getFieldValue('SPEED') || '115200';
    var debug_level = block.getFieldValue('LEVEL') || '';

    var code = 'Serial.begin(' + serial_speed + ');\n';
    code += 'BLINKER_DEBUG.stream(Serial);\n';

    if (debug_level == 'ALL') {
        code += 'BLINKER_DEBUG.debugAll();\n';
    }

    return code;
};

Arduino.forBlock['blinker_create_button'] = function (block, generator) {
    var button_name = block.getFieldValue('NAME');
    var button_key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || "\"btn-abc\"";

    generator.addVariable('BlinkerButton ' + button_name, 'BlinkerButton ' + button_name + '(' + button_key + ');');

    return '';
};

Arduino.forBlock['blinker_create_number'] = function (block, generator) {
    var number_name = block.getFieldValue('NAME');
    var number_key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || "\"num-abc\"";

    generator.addVariable('BlinkerNumber ' + number_name, 'BlinkerNumber ' + number_name + '(' + number_key + ');');

    return '';
};

Arduino.forBlock['blinker_attach_data_callback'] = function (block, generator) {
    var callback_name = block.getFieldValue('CALLBACK') || 'dataRead';

    var code = 'Blinker.attachData(' + callback_name + ');\n';
    return code;
};

Arduino.forBlock['blinker_data_callback_function'] = function (block, generator) {
    var callback_name = block.getFieldValue('CALLBACK') || 'dataRead';
    var statements = generator.statementToCode(block, 'STATEMENTS');

    var code = 'void ' + callback_name + '(const String & data)\n{\n';
    code += statements;
    code += '}\n';

    generator.addFunction(callback_name, code);
    return '';
};

Arduino.forBlock['blinker_button_callback'] = function (block, generator) {
    var button_name = block.getFieldValue('BUTTON');
    var callback_name = block.getFieldValue('CALLBACK');

    var code = button_name + '.attach(' + callback_name + ');\n';
    return code;
};

Arduino.forBlock['blinker_button_callback_function'] = function (block, generator) {
    var callback_name = block.getFieldValue('CALLBACK');
    var statements = generator.statementToCode(block, 'STATEMENTS');

    var code = 'void ' + callback_name + '(const String & state)\n{\n';
    code += statements;
    code += '}\n';

    generator.addFunction(callback_name, code);
    return '';
};

Arduino.forBlock['blinker_get_button_state'] = function (block, generator) {
    var state_check = block.getFieldValue('STATE');

    var code = 'state == ' + state_check;
    return [code, Arduino.ORDER_EQUALITY];
};

Arduino.forBlock['blinker_button_print'] = function (block, generator) {
    var button_name = block.getFieldValue('BUTTON');
    var icon = generator.valueToCode(block, 'ICON', Arduino.ORDER_ATOMIC) || "\"icon_1\"";
    var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || "\"#FFFFFF\"";
    var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || "\"Button\"";
    var state = generator.valueToCode(block, 'STATE', Arduino.ORDER_ATOMIC) || "";

    var code = button_name + '.icon(' + icon + ');\n';
    code += button_name + '.color(' + color + ');\n';
    code += button_name + '.text(' + text + ');\n';

    if (state && state.length > 0) {
        code += button_name + '.print(' + state + ');\n';
    } else {
        code += button_name + '.print();\n';
    }

    return code;
};

Arduino.forBlock['blinker_number_print'] = function (block, generator) {
    var number_name = block.getFieldValue('NUMBER');
    var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);
    var icon = generator.valueToCode(block, 'ICON', Arduino.ORDER_ATOMIC) || "";
    var color = generator.valueToCode(block, 'COLOR', Arduino.ORDER_ATOMIC) || "";
    var unit = generator.valueToCode(block, 'UNIT', Arduino.ORDER_ATOMIC) || "";

    var code = '';
    if (icon && icon.length > 0) {
        code += number_name + '.icon(' + icon + ');\n';
    }
    if (color && color.length > 0) {
        code += number_name + '.color(' + color + ');\n';
    }
    if (unit && unit.length > 0) {
        code += number_name + '.unit(' + unit + ');\n';
    }

    code += number_name + '.print(' + value + ');\n';
    return code;
};

Arduino.forBlock['blinker_print'] = function (block, generator) {
    var key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC);
    var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC);

    var code = 'Blinker.print(' + key + ', ' + value + ');\n';
    return code;
};

Arduino.forBlock['blinker_log'] = function (block, generator) {
    var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC);
    var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || "";

    var code = '';
    if (value && value.length > 0) {
        code = 'BLINKER_LOG(' + message + ', ' + value + ');\n';
    } else {
        code = 'BLINKER_LOG(' + message + ');\n';
    }

    return code;
};

Arduino.forBlock['blinker_vibrate'] = function (block, generator) {
    var code = 'Blinker.vibrate();\n';
    return code;
};