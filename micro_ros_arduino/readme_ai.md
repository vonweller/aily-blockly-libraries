# micro-ROS Arduino

micro-ROS node, executor, and std_msgs Int32 publish/subscribe blocks.

## Library Info
- **Name**: @aily-project/lib-micro-ros-arduino
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `micro_ros_node_init` | Statement | VAR(field_input), NAME(input_value), NAMESPACE(input_value), HANDLES(input_value) | `micro_ros_node_init("microRos", text("value"), text("value"), math_number(0))` | Dynamic code |
| `micro_ros_publisher_init` | Statement | VAR(field_input), NODE(field_variable), TOPIC(input_value) | `micro_ros_publisher_init("rosPublisher", variables_get($microRos), text("value"))` | Dynamic code |
| `micro_ros_publish_int32` | Statement | VAR(field_variable), VALUE(input_value) | `micro_ros_publish_int32(variables_get($rosPublisher), math_number(0))` | Dynamic code |
| `micro_ros_subscriber_init` | Statement | VAR(field_input), NODE(field_variable), TOPIC(input_value), DO(input_statement) | `micro_ros_subscriber_init("rosSubscriber", variables_get($microRos), text("value")) @DO: child_block()` | Dynamic code |
| `micro_ros_received_int32` | Value | VAR(field_variable) | `micro_ros_received_int32(variables_get($rosSubscriber))` | Dynamic code |
| `micro_ros_spin` | Statement | VAR(field_variable), MS(input_value) | `micro_ros_spin(variables_get($microRos), math_number(1000))` | rclc_executor_spin_some(& |

## ABS Examples

### Basic Usage
```
arduino_setup()
    micro_ros_node_init("microRos", text("value"), text("value"), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, micro_ros_received_int32(variables_get($rosSubscriber)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `micro_ros_node_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
