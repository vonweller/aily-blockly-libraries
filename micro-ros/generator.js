// @aily-project/lib-micro-ros generator
// Upstream: micro_ros_arduino 2.0.7-humble (esp32s3 prebuilt libmicroros.a)
// Blocks: WiFi connect / UDP test / node init / publisher / publish / subscriber / read data / spin_some

var MICROROS_MSG_TYPES = {
  Int32: { include: '#include <std_msgs/msg/int32.h>', ctype: 'int32_t', rosType: 'Int32' },
  Float32: { include: '#include <std_msgs/msg/float32.h>', ctype: 'float', rosType: 'Float32' },
  Float64: { include: '#include <std_msgs/msg/float64.h>', ctype: 'double', rosType: 'Float64' },
  Bool: { include: '#include <std_msgs/msg/bool.h>', ctype: 'bool', rosType: 'Bool' },
  String: { include: '#include <std_msgs/msg/string.h>', ctype: 'const char *', rosType: 'String', isString: true }
};

function microrosBaseIncludes(generator) {
  generator.addLibrary('microros_arduino', '#include <micro_ros_arduino.h>');
  generator.addLibrary('microros_rcl', '#include <rcl/rcl.h>');
  generator.addLibrary('microros_rclc', '#include <rclc/rclc.h>');
}

function microrosCStr(value, fallback) {
  var text = String(value === '' || value === null || value === undefined ? fallback : value);
  return '(char *)' + JSON.stringify(text);
}

function microrosMsgType(value) {
  return MICROROS_MSG_TYPES[value] || MICROROS_MSG_TYPES.Int32;
}

function microrosIpAddress(value, fallback) {
  var text = String(value === '' || value === null || value === undefined ? fallback : value);
  var parts = text.split('.');
  var bytes = [];
  var ok = parts.length === 4;
  for (var i = 0; ok && i < 4; i++) {
    var n = parseInt(parts[i], 10);
    if (isNaN(n) || n < 0 || n > 255) {
      ok = false;
    } else {
      bytes.push(n);
    }
  }
  if (!ok) {
    bytes = fallback.split('.').map(Number);
  }
  return 'IPAddress(' + bytes.join(', ') + ')';
}

function microrosHalt() {
  return '{\n  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");\n  while (1) { delay(100); }\n}\n';
}

Arduino.forBlock['microros_wifi_connect'] = function (block, generator) {
  microrosBaseIncludes(generator);
  var ssid = microrosCStr(block.getFieldValue('SSID'), 'my_wifi');
  var pass = microrosCStr(block.getFieldValue('PASS'), 'my_pass');
  var agentIp = microrosCStr(block.getFieldValue('AGENT_IP'), '192.168.1.57');
  var port = block.getFieldValue('PORT');
  if (port === '' || port === null || port === undefined) {
    port = 8888;
  }
  return 'set_microros_wifi_transports(' + ssid + ', ' + pass + ', ' + agentIp + ', ' + port + ');\n';
};

Arduino.forBlock['microros_udp_test'] = function (block, generator) {
  generator.addLibrary('microros_wifi_udp', '#include <WiFiUdp.h>');
  var ip = microrosIpAddress(block.getFieldValue('AGENT_IP'), '192.168.1.57');
  var port = block.getFieldValue('PORT');
  if (port === '' || port === null || port === undefined) {
    port = 8888;
  }
  return '{\n' +
    '  WiFiUDP testUdp;\n' +
    '  int started = testUdp.begin(12345);\n' +
    '  Serial.print("[UDP TEST] begin: ");\n' +
    '  Serial.println(started);\n' +
    '  for (int i = 0; i < 5; i++) {\n' +
    '    int packetStarted = testUdp.beginPacket(' + ip + ', ' + port + ');\n' +
    '    testUdp.write((const uint8_t *)"AILY_UDP_TEST", sizeof("AILY_UDP_TEST") - 1);\n' +
    '    int sent = testUdp.endPacket();\n' +
    '    Serial.print("[UDP TEST] beginPacket: ");\n' +
    '    Serial.print(packetStarted);\n' +
    '    Serial.print(", endPacket: ");\n' +
    '    Serial.println(sent);\n' +
    '    delay(1000);\n' +
    '  }\n' +
    '  testUdp.stop();\n' +
    '}\n';
};

Arduino.forBlock['microros_node_init'] = function (block, generator) {
  microrosBaseIncludes(generator);
  generator.addLibrary('microros_rmw', '#include <rmw_microros/rmw_microros.h>');
  generator.addLibrary('microros_rcl_error', '#include <rcl/error_handling.h>');
  var nodeName = JSON.stringify(String(block.getFieldValue('NODE_NAME') || 'micro_ros_arduino_node'));
  generator.addObject(
    'microros_node_globals',
    'rcl_allocator_t microros_allocator = rcl_get_default_allocator();\n' +
      'rclc_support_t microros_support;\n' +
      'rcl_node_t microros_node;'
  );
  return '{\n' +
    '  Serial.println("[micro-ROS] 开始探测 Agent");\n' +
    '  while (true) {\n' +
    '    rmw_ret_t ret = rmw_uros_ping_agent(1000, 1);\n' +
    '    Serial.print("[micro-ROS] 探测返回值: ");\n' +
    '    Serial.println((int)ret);\n' +
    '    if (ret == RMW_RET_OK) {\n' +
    '      Serial.println("[micro-ROS] Agent 可达");\n' +
    '      break;\n' +
    '    }\n' +
    '    Serial.println("[micro-ROS] Agent 无响应，1 秒后重试");\n' +
    '    delay(1000);\n' +
    '  }\n' +
    '}\n' +
    'Serial.println("[micro-ROS] 开始 support 初始化");\n' +
    'if (rclc_support_init(&microros_support, 0, NULL, &microros_allocator) != RCL_RET_OK) ' +
    microrosHalt() +
    'if (rclc_node_init_default(&microros_node, ' + nodeName + ', "", &microros_support) != RCL_RET_OK) ' +
    microrosHalt();
};

Arduino.forBlock['microros_publisher_create'] = function (block, generator) {
  microrosBaseIncludes(generator);
  var name = generator.getValue(block, 'VAR', 'field_variable');
  var type = microrosMsgType(block.getFieldValue('TYPE'));
  var topic = JSON.stringify(String(block.getFieldValue('TOPIC') || 'topic_name'));

  generator.addLibrary('microros_msg_' + type.rosType, type.include);
  if (type.isString) {
    generator.addLibrary('microros_string_utils', '#include <micro_ros_utilities/string_utilities.h>');
  }

  generator.addObject(
    'microros_pub_' + name,
    'rcl_publisher_t ' + name + ';\n' + 'std_msgs__msg__' + type.rosType + ' ' + name + '_msg;'
  );

  var publishFn;
  if (type.isString) {
    publishFn =
      'void ' + name + '_publish(const char * value) {\n' +
      '  ' + name + '_msg.data = micro_ros_string_utilities_set(' + name + '_msg.data, value);\n' +
      '  rcl_publish(&' + name + ', &' + name + '_msg, NULL);\n' +
      '}';
  } else {
    publishFn =
      'void ' + name + '_publish(' + type.ctype + ' value) {\n' +
      '  ' + name + '_msg.data = value;\n' +
      '  rcl_publish(&' + name + ', &' + name + '_msg, NULL);\n' +
      '}';
  }
  generator.addObject('microros_pub_fn_' + name, publishFn);

  return 'if (rclc_publisher_init_best_effort(&' + name + ', &microros_node, ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, ' +
    type.rosType + '), ' + topic + ') != RCL_RET_OK) ' +
    microrosHalt();
};

Arduino.forBlock['microros_publish'] = function (block, generator) {
  microrosBaseIncludes(generator);
  var name = generator.getValue(block, 'VAR', 'field_variable');
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
  return name + '_publish(' + value + ');\n';
};

Arduino.forBlock['microros_subscriber_create'] = function (block, generator) {
  microrosBaseIncludes(generator);
  generator.addLibrary('microros_executor', '#include <rclc/executor.h>');
  var name = generator.getValue(block, 'VAR', 'field_variable');
  var type = microrosMsgType(block.getFieldValue('TYPE'));
  var topic = JSON.stringify(String(block.getFieldValue('TOPIC') || 'topic_name'));

  generator.addLibrary('microros_msg_' + type.rosType, type.include);
  if (type.isString) {
    generator.addLibrary('microros_string_utils', '#include <micro_ros_utilities/string_utilities.h>');
  }

  generator.addObject(
    'microros_sub_' + name,
    'rcl_subscription_t ' + name + ';\n' +
      'std_msgs__msg__' + type.rosType + ' ' + name + '_msg;\n' +
      'rclc_executor_t ' + name + '_executor;'
  );

  var callbackBody = generator.statementToCode(block, 'DO') || '';
  generator.addObject(
    'microros_sub_cb_' + name,
    'void ' + name + '_callback(const void * msgin) {\n' + '  (void)msgin;\n' + callbackBody + '}'
  );

  var getterFn;
  if (type.isString) {
    getterFn = 'const char * ' + name + '_get_data() {\n' + '  return ' + name + '_msg.data.data;\n' + '}';
  } else {
    getterFn = type.ctype + ' ' + name + '_get_data() {\n' + '  return ' + name + '_msg.data;\n' + '}';
  }
  generator.addObject('microros_sub_get_' + name, getterFn);

  return 'if (rclc_subscription_init_default(&' + name + ', &microros_node, ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, ' +
    type.rosType + '), ' + topic + ') != RCL_RET_OK) ' +
    microrosHalt() +
    'if (rclc_executor_init(&' + name + '_executor, &microros_support.context, 1, &microros_allocator) != RCL_RET_OK) ' +
    microrosHalt() +
    'if (rclc_executor_add_subscription(&' + name + '_executor, &' + name + ', &' + name + '_msg, &' + name +
    '_callback, ON_NEW_DATA) != RCL_RET_OK) ' +
    microrosHalt();
};

Arduino.forBlock['microros_subscriber_data'] = function (block, generator) {
  microrosBaseIncludes(generator);
  var name = generator.getValue(block, 'VAR', 'field_variable');
  return [name + '_get_data()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['microros_spin_some'] = function (block, generator) {
  microrosBaseIncludes(generator);
  generator.addLibrary('microros_executor', '#include <rclc/executor.h>');
  var name = generator.getValue(block, 'VAR', 'field_variable');
  var timeout = generator.valueToCode(block, 'TIMEOUT_MS', Arduino.ORDER_ATOMIC) || '100';
  return 'rclc_executor_spin_some(&' + name + '_executor, RCL_MS_TO_NS(' + timeout + '));\n';
};
