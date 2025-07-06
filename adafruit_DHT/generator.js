Arduino.forBlock['dht_init'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');

    // 创建DHT对象
    var dhtDef = 'DHT dht(' + pin + ', ' + dht_type + ');';
    generator.addVariable('dht_def', dhtDef);

    // 在setup中初始化DHT
    generator.addSetupBegin('dht_begin', 'dht.begin();');

    return '';
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');
    
    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');
    
    // 创建唯一的DHT对象名
    var dhtObjName = 'dht_' + pin + '_' + dht_type.toLowerCase();
    
    // 创建DHT对象（如果不存在）
    var dhtDef = 'DHT ' + dhtObjName + '(' + pin + ', ' + dht_type + ');';
    generator.addVariable(dhtObjName + '_def', dhtDef);
    
    // 在setup中初始化DHT（如果不存在）
    generator.addSetupBegin(dhtObjName + '_begin', dhtObjName + '.begin();');
    
    return [dhtObjName + '.readTemperature()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_humidity'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');
    
    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');
    
    // 创建唯一的DHT对象名
    var dhtObjName = 'dht_' + pin + '_' + dht_type.toLowerCase();
    
    // 创建DHT对象（如果不存在）
    var dhtDef = 'DHT ' + dhtObjName + '(' + pin + ', ' + dht_type + ');';
    generator.addVariable(dhtObjName + '_def', dhtDef);
    
    // 在setup中初始化DHT（如果不存在）
    generator.addSetupBegin(dhtObjName + '_begin', dhtObjName + '.begin();');
    
    return [dhtObjName + '.readHumidity()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_success'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');
    
    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');
    
    // 创建唯一的DHT对象名
    var dhtObjName = 'dht_' + pin + '_' + dht_type.toLowerCase();
    
    // 创建DHT对象（如果不存在）
    var dhtDef = 'DHT ' + dhtObjName + '(' + pin + ', ' + dht_type + ');';
    generator.addVariable(dhtObjName + '_def', dhtDef);
    
    // 在setup中初始化DHT（如果不存在）
    generator.addSetupBegin(dhtObjName + '_begin', dhtObjName + '.begin();');
    
    return ['!isnan(' + dhtObjName + '.readTemperature()) && !isnan(' + dhtObjName + '.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};