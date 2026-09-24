# micro-ROS for ESP32-S3

让 ESP32-S3 通过 WiFi 连接 micro-ROS Agent，与 ROS 2 交换话题消息的积木库。

## Library Info

| Field | Value |
| ----- | ----- |
| Package | @aily-project/lib-micro-ros |
| Version | 2.2.0 |
| Author | micro-ROS (upstream), Aily local wrap |
| Source | micro_ros_arduino 2.0.7-humble（esp32s3 预编译版） |
| License | Apache-2.0 |

## Supported Boards

ESP32-S3（内置 `src/micro_ros_arduino/esp32s3/libmicroros.a` 预编译核心；未提供其它架构的预编译库）。

## Description

基于 micro-ROS（ROS 2）提供客户端能力：WiFi 连接 Agent、UDP 连通性测试、节点初始化、std_msgs 基本类型（Int32/Float32/Float64/Bool/String）的话题发布与订阅、订阅回调触发与执行器调度。需要在同一网络中运行 micro-ROS Agent。WiFi 连接带超时与串口诊断（每轮 15 秒、最多 3 轮，仍失败则打印原因并 5 秒后自动重启重试）；节点初始化前会循环探测 Agent 可达性（每秒一次，带串口诊断）再进入初始化；任一 micro-ROS 初始化失败会先在串口打印原因再停机。

## Quick Start

1. 在 ROS 2 机器上启动 Agent：`ros2 run micro_ros_agent micro_ros_agent udp4 --port 8888`
2. 初始化中依次放置：micro-ROS 通过 WiFi 连接 → 初始化节点 → 创建发布器/订阅器
3. 循环中：发布消息 / 处理订阅器的新消息
