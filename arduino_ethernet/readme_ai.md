# Arduino Ethernet

Wired Ethernet client, server, UDP, DHCP, and static IP blocks.

## Library Info
- **Name**: @aily-project/lib-arduino-ethernet
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ethernet_init` | Statement | MAC(input_value), MODE(dropdown), IP(input_value) | `ethernet_init(text("value"), dhcp, text("value"))` | Dynamic code |
| `ethernet_network_info` | Value | INFO(dropdown) | `ethernet_network_info(localIP)` | Dynamic code |
| `ethernet_client_create` | Statement | VAR(field_input) | `ethernet_client_create("ethClient")` | Dynamic code |
| `ethernet_client_connect` | Value | VAR(field_variable), HOST(input_value), PORT(input_value) | `ethernet_client_connect(variables_get($ethClient), text("value"), math_number(0))` | Dynamic code |
| `ethernet_client_write` | Statement | VAR(field_variable), OP(dropdown), DATA(input_value) | `ethernet_client_write(variables_get($ethClient), print, math_number(0))` | Dynamic code |
| `ethernet_client_data` | Value | VAR(field_variable), DATA(dropdown) | `ethernet_client_data(variables_get($ethClient), available)` | Dynamic code |
| `ethernet_client_stop` | Statement | VAR(field_variable) | `ethernet_client_stop(variables_get($ethClient))` | Dynamic code |
| `ethernet_server_create` | Statement | VAR(field_input), PORT(input_value) | `ethernet_server_create("ethServer", math_number(0))` | Dynamic code |
| `ethernet_server_accept` | Value | VAR(field_variable) | `ethernet_server_accept(variables_get($ethServer))` | Dynamic code |
| `ethernet_udp_create` | Statement | VAR(field_input), PORT(input_value) | `ethernet_udp_create("ethUdp", math_number(0))` | Dynamic code |
| `ethernet_udp_send` | Statement | VAR(field_variable), DATA(input_value), HOST(input_value), PORT(input_value) | `ethernet_udp_send(variables_get($ethUdp), math_number(0), text("value"), math_number(0))` | Dynamic code |
| `ethernet_udp_data` | Value | VAR(field_variable), DATA(dropdown) | `ethernet_udp_data(variables_get($ethUdp), parsePacket)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | dhcp, static | ethernet_init |
| INFO | localIP, gatewayIP, subnetMask, dnsServerIP, link, hardware | ethernet_network_info |
| OP | print, println | ethernet_client_write |
| DATA | available, read, line, connected | ethernet_client_data |
| DATA | parsePacket, available, read, remoteIP, remotePort | ethernet_udp_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ethernet_init(text("value"), dhcp, text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ethernet_network_info(localIP))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ethernet_client_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
