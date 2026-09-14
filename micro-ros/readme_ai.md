# micro-ROS for ESP32-S3

基于 micro_ros_arduino 2.0.7-humble（esp32s3 预编译）封装的 ROS 2 客户端积木库：WiFi 连接 Agent、节点、发布/订阅（Int32/Float32/Float64/Bool/String）与执行器调度。

## Library Info

- **Name**: @aily-project/lib-micro-ros
- **Version**: 2.2.0

每个积木首次使用都会注入基础头文件（自动去重）：`#include <micro_ros_arduino.h>`、`#include <rcl/rcl.h>`、`#include <rclc/rclc.h>`。下表 Generated Code 一栏不再重复这三行。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `microros_wifi_connect` | Statement | SSID(field_input), PASS(field_input), AGENT_IP(field_input), PORT(field_number) | `microros_wifi_connect("my_wifi", "my_pass", "192.168.1.57", 8888)` | `set_microros_wifi_transports((char *)"my_wifi", (char *)"my_pass", (char *)"192.168.1.57", 8888);` |
| `microros_udp_test` | Statement | AGENT_IP(field_input), PORT(field_number) | `microros_udp_test("192.168.1.57", 8888)` | `#include <WiFiUdp.h>↵{↵  WiFiUDP testUdp;↵  int started = testUdp.begin(12345);↵  Serial.print("[UDP TEST] begin: ");↵  Serial.println(started);↵  for (int i = 0; i < 5; i++) {↵    int packetStarted = testUdp.beginPacket(IPAddress(192, 168, 1, 57), 8888);↵    testUdp.write((const uint8_t *)"AILY_UDP_TEST", sizeof("AILY_UDP_TEST") - 1);↵    int sent = testUdp.endPacket();↵    Serial.print("[UDP TEST] beginPacket: ");↵    Serial.print(packetStarted);↵    Serial.print(", endPacket: ");↵    Serial.println(sent);↵    delay(1000);↵  }↵  testUdp.stop();↵}` |
| `microros_node_init` | Statement | NODE_NAME(field_input) | `microros_node_init("micro_ros_arduino_node")` | `#include <rmw_microros/rmw_microros.h>↵#include <rcl/error_handling.h>↵rcl_allocator_t microros_allocator = rcl_get_default_allocator();↵rclc_support_t microros_support;↵rcl_node_t microros_node;↵{↵  Serial.println("[micro-ROS] 开始探测 Agent");↵  while (true) {↵    rmw_ret_t ret = rmw_uros_ping_agent(1000, 1);↵    Serial.print("[micro-ROS] 探测返回值: ");↵    Serial.println((int)ret);↵    if (ret == RMW_RET_OK) {↵      Serial.println("[micro-ROS] Agent 可达");↵      break;↵    }↵    Serial.println("[micro-ROS] Agent 无响应，1 秒后重试");↵    delay(1000);↵  }↵}↵Serial.println("[micro-ROS] 开始 support 初始化");↵if (rclc_support_init(&microros_support, 0, NULL, &microros_allocator) != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}↵if (rclc_node_init_default(&microros_node, "micro_ros_arduino_node", "", &microros_support) != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}` |
| `microros_publisher_create` | Statement | VAR(field_variable), TYPE(dropdown), TOPIC(field_input) | `microros_publisher_create($publisher, Int32, "topic_name")` | `#include <std_msgs/msg/int32.h>↵rcl_publisher_t publisher;↵std_msgs__msg__Int32 publisher_msg;↵void publisher_publish(int32_t value) {↵  publisher_msg.data = value;↵  rcl_publish(&publisher, &publisher_msg, NULL);↵}↵if (rclc_publisher_init_best_effort(&publisher, &microros_node, ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32), "topic_name") != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}` |
| `microros_publish` | Statement | VAR(field_variable), VALUE(input_value) | `microros_publish($publisher, math_number(1))` | `publisher_publish(1);` |
| `microros_subscriber_create` | Statement | VAR(field_variable), TYPE(dropdown), TOPIC(field_input), DO(input_statement) | `microros_subscriber_create($subscriber, Int32, "topic_name")` | `#include <rclc/executor.h>↵#include <std_msgs/msg/int32.h>↵rcl_subscription_t subscriber;↵std_msgs__msg__Int32 subscriber_msg;↵rclc_executor_t subscriber_executor;↵void subscriber_callback(const void * msgin) {↵  (void)msgin;↵  Serial.println(subscriber_get_data());↵}↵int32_t subscriber_get_data() {↵  return subscriber_msg.data;↵}↵if (rclc_subscription_init_default(&subscriber, &microros_node, ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Int32), "topic_name") != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}↵if (rclc_executor_init(&subscriber_executor, &microros_support.context, 1, &microros_allocator) != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}↵if (rclc_executor_add_subscription(&subscriber_executor, &subscriber, &subscriber_msg, &subscriber_callback, ON_NEW_DATA) != RCL_RET_OK) {↵  Serial.println("[micro-ROS] init FAILED, system halted. Check micro-ROS agent (ip:port) is running and reachable.");↵  while (1) { delay(100); }↵}` |
| `microros_subscriber_data` | Value | VAR(field_variable) | `microros_subscriber_data($subscriber)` | `subscriber_get_data()` |
| `microros_spin_some` | Statement | VAR(field_variable), TIMEOUT_MS(input_value) | `microros_spin_some($subscriber, math_number(100))` | `#include <rclc/executor.h>↵rclc_executor_spin_some(&subscriber_executor, RCL_MS_TO_NS(100));` |

注：`microros_subscriber_create` 的 Generated Code 以 @DO 中放置 `serial_println(Serial, microros_subscriber_data($subscriber))` 为代表；回调体内容由用户积木决定。

## Parameter Options

| Field | Values |
| ----- | ------ |
| TYPE（发布器/订阅器共用） | `Int32`, `Float32`, `Float64`, `Bool`, `String` |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    serial_begin(Serial, 115200)
    microros_wifi_connect("my_wifi", "my_pass", "192.168.1.57", 8888)
    microros_udp_test("192.168.1.57", 8888)
    microros_node_init("micro_ros_arduino_node")
    microros_publisher_create($publisher, Int32, "topic_name")
    microros_subscriber_create($subscriber, Int32, "cmd_topic")
        serial_println(Serial, microros_subscriber_data($subscriber))

arduino_loop()
    microros_publish($publisher, math_number(1))
    microros_spin_some($subscriber, math_number(100))
```

## Notes

1. **顺序**：必须 WiFi 连接 → `microros_node_init` → 创建发布器/订阅器（均放初始化）；`microros_publish` / `microros_spin_some` 放循环。WiFi 连接、节点初始化、发布器/订阅器创建的调用自 2.0.9 起在积木所处的初始化位置原位生成（不再提升到 setup() 开头），micro-ROS 各初始化必须在 WiFi 连接之后才能注册到传输层，请按上述顺序摆放积木。
2. **变量**：`microros_publisher_create($publisher, ...)` 创建 `$publisher`（Publisher 类型）；`microros_subscriber_create($subscriber, ...)` 创建 `$subscriber`（Subscriber 类型）。传给本库 field_variable 槽位；若其它积木需要 input_value，使用 `variables_get($publisher)`。
3. **全局单节点**：`microros_node_init` 生成固定全局 `microros_allocator` / `microros_support` / `microros_node`，整个工程只支持一个 micro-ROS 节点。
4. **生成对象**：发布器生成 `publisher`、`publisher_msg`、`publisher_publish()`；订阅器生成 `subscriber`、`subscriber_msg`、`subscriber_executor`、`subscriber_callback()`、`subscriber_get_data()`。变量名与 C 标识符一致，重名会冲突。
5. **TYPE 决定生成的代码形状**：`Int32/Float32/Float64/Bool` 时 `publisher_publish` 形如 `void publisher_publish(int32_t value)`（类型分别为 `int32_t`/`float`/`double`/`bool`），getter 返回 `subscriber_msg.data`；`String` 时为 `void publisher_publish(const char * value)`，内部调用 `micro_ros_string_utilities_set(publisher_msg.data, value)` 并额外包含 `#include <micro_ros_utilities/string_utilities.h>`，getter 为 `const char * subscriber_get_data() { return subscriber_msg.data.data; }`。
6. **回调上下文**：`@DO` 积木在 `rclc_executor_spin_some` 检测到新消息时于主循环上下文执行；未收到消息时不执行。回调内用 `microros_subscriber_data` 读取最新数据。
7. **阻塞行为**：WiFi 连接每轮最多等待 15 秒、最多重试 3 轮，期间串口实时打印进度；全部失败时打印排查提示（SSID/密码、仅 2.4GHz、信号、MAC 过滤/WPA3）并在 5 秒后自动重启板卡继续重试。`microros_node_init` 在进入 `rclc_support_init` 前会每秒一次循环探测 Agent（`rmw_uros_ping_agent(1000, 1)`）并打印返回值，直到 Agent 可达才继续。任一初始化调用失败会先在串口打印 `[micro-ROS] init FAILED...` 诊断再停机（`while (1) { delay(100); }`）。`microros_spin_some` 的 TIMEOUT_MS 是内部 `rcl_wait` 超时，无数据时最多阻塞该时长。
8. **String 内存**：`micro_ros_string_utilities_set` 每次发布都会重新分配字符串内存且不释放旧缓冲（上游惯用模式）；高频发布 String 话题会持续消耗堆内存，建议高频场景使用数值类型。
9. **QoS**：发布器为 best-effort，订阅器为默认 QoS，经 micro-ROS Agent 与 ROS 2 互通。
10. **板卡与依赖**：仅支持 ESP32-S3（链接 `src/micro_ros_arduino/esp32s3/libmicroros.a`）。需要可达的 micro-ROS Agent（如 `ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`）。未提供 esp32（LX6）等其它架构预编译核心。
11. **UDP 连通性测试**：`microros_udp_test(ip, port)` 在积木当前位置向目标地址连发 5 个 `AILY_UDP_TEST` UDP 包（本地绑定端口 12345，每秒 1 个）并打印 begin/endPacket 返回值，用于连接 Agent 前排查网络连通性/防火墙；`endPacket` 返回 1 表示包已交给协议栈，不代表对端一定收到。
