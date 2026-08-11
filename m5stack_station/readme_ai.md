# Station Onboard Ports

## Library Info
- **Name**: @aily-project/lib-m5stack-station
- **Version**: 0.1.0

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5station_port_power` | Statement | `m5station_port_power(A, TRUE)` |
| `m5station_all_ports_power` | Statement | `m5station_all_ports_power(TRUE)` |
| `m5station_port_measure` | Number | `m5station_port_measure(A1, VOLTAGE)` |

Voltage is returned in volts and current in milliamperes. Port/channel mappings are fixed from the official Station example and pin map.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `m5station_port_power` | Statement | PORT(dropdown), ENABLED(field_checkbox) | `m5station_port_power(A, TRUE)` | `M5.Power.setExtOutput(true, m5::ext_port_mask_t::ext_PA);` |
| `m5station_all_ports_power` | Statement | ENABLED(field_checkbox) | `m5station_all_ports_power(TRUE)` | `M5.Power.setExtOutput(true, (m5::ext_port_mask_t)0x1F); ↵ digitalWrite(12, HIGH);` |
| `m5station_port_measure` | Value | PORT(dropdown), MEASURE(dropdown) | `m5station_port_measure(A1, VOLTAGE)` | `M5.Power.Ina3221[0].getBusVoltage(0)` |
## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | A, B1, B2, C1, C2, USB | m5station_port_power |
| PORT | A1, A2, B1, B2, C1, C2 | m5station_port_measure |
| MEASURE | VOLTAGE, CURRENT | m5station_port_measure |

## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    m5station_port_power(A, TRUE)
```
