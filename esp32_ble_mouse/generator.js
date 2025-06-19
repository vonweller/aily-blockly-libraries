// ESP32 BLE Mouse Library Generator

Arduino.forBlock['ble_mouse_init'] = function(block, generator) {
    var deviceName = generator.valueToCode(block, 'DEVICE_NAME', Arduino.ORDER_ATOMIC) || '"BLE Mouse"';
    var manufacturer = generator.valueToCode(block, 'MANUFACTURER', Arduino.ORDER_ATOMIC) || '"aily Project"';
    var battery = generator.valueToCode(block, 'BATTERY', Arduino.ORDER_ATOMIC) || '100';
    
    generator.addLibrary('ble_mouse', '#include <BleMouse.h>');
    generator.addObject('ble_mouse_obj', 'BleMouse bleMouse(' + deviceName + ', ' + manufacturer + ', ' + battery + ');');
    
    return '';
};

Arduino.forBlock['ble_mouse_begin'] = function(block, generator) {
    generator.addSetupEnd('ble_mouse_begin', 'bleMouse.begin();');
    return '';
};

Arduino.forBlock['ble_mouse_is_connected'] = function(block, generator) {
    return ['bleMouse.isConnected()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['ble_mouse_move'] = function(block, generator) {
    var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
    
    return 'if(bleMouse.isConnected()) {\n' +
           '  bleMouse.move(' + x + ', ' + y + ');\n' +
           '}\n';
};

Arduino.forBlock['ble_mouse_click'] = function(block, generator) {
    var button = block.getFieldValue('BUTTON');
    var action = block.getFieldValue('ACTION');
    
    var code = 'if(bleMouse.isConnected()) {\n';
    
    if (action === 'press') {
        code += '  bleMouse.press(' + button + ');\n';
    } else if (action === 'release') {
        code += '  bleMouse.release(' + button + ');\n';
    } else if (action === 'click') {
        code += '  bleMouse.click(' + button + ');\n';
    }
    
    code += '}\n';
    return code;
};

Arduino.forBlock['ble_mouse_scroll'] = function(block, generator) {
    var scroll = generator.valueToCode(block, 'SCROLL', Arduino.ORDER_ATOMIC) || '0';
    
    return 'if(bleMouse.isConnected()) {\n' +
           '  bleMouse.move(0, 0, ' + scroll + ');\n' +
           '}\n';
};
