Arduino.forBlock['dht_init'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');

    // 创建DHT对象
    var dhtDef = 'DHT dht(' + pin + ', ' + dht_type + ');';
    generator.addVariable('dht_def', dhtDef);

    // 在setup中初始化DHT
    generator.addSetup('dht_begin', 'dht.begin();');

    return '';
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
    return ['dht.readTemperature()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_humidity'] = function (block, generator) {
    return ['dht.readHumidity()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_success'] = function (block, generator) {
    return ['!isnan(dht.readTemperature()) && !isnan(dht.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};