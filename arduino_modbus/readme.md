# Arduino Modbus通信库

这是一个用于Arduino平台的Modbus通信库，支持RTU和TCP两种通信方式，可以作为客户端或服务器使用。

## 功能特性

- **Modbus RTU**: 支持通过RS485进行RTU通信
- **Modbus TCP**: 支持通过WiFi/以太网进行TCP通信
- **客户端模式**: 可以读写远程Modbus设备的数据
- **服务器模式**: 可以作为Modbus设备响应客户端请求
- **数据类型支持**: 支持线圈(Coils)、离散输入(Discrete Inputs)、保持寄存器(Holding Registers)、输入寄存器(Input Registers)

## 支持的开发板

- Arduino UNO、MEGA
- Arduino MKR系列（WiFi 1010, MKR1000等）
- ESP32系列开发板
- Arduino R4 WiFi
- 其他支持Arduino框架的开发板

## 使用说明

### 硬件连接

#### RTU模式 (RS485)
- 需要RS485转换模块（如MKR 485 Shield）
- 连接A/Y和B/Z线到对应的Modbus设备

#### TCP模式
- 需要WiFi或以太网连接
- 确保设备与Modbus TCP服务器在同一网络

### 基本使用

1. **初始化客户端**：使用对应的初始化块
2. **配置服务器**：如果作为服务器，需要配置数据区域
3. **读写操作**：使用相应的读写块进行数据交换

## 依赖库

此库依赖以下Arduino库：
- ArduinoRS485
- ArduinoModbus
- WiFi (用于TCP模式)

请确保在Arduino IDE中安装这些依赖库。

## 示例程序

库中包含了丰富的示例程序，展示了各种使用场景：
- RTU客户端和服务器示例
- TCP客户端和服务器示例
- 传感器数据读取示例

## 注意事项

1. RTU模式需要正确的硬件连接和波特率设置
2. TCP模式需要稳定的网络连接
3. 设备ID范围：1-247（RTU）、1-255（TCP）
4. 地址范围：0-65535
5. 寄存器值范围：0-65535

## 错误处理

使用"获取Modbus最后错误信息"块可以获取详细的错误信息，便于调试和故障排除。