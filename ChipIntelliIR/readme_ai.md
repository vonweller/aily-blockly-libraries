# ChipIntelliIR

CI13XX 原始红外、NEC 与原厂空调码库积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-ir`
- **版本**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_ir_init_raw` | 语句 | TX_PIN(value), RX_PIN(value), TIMER | `chipintelli_ir_init_raw(math_number(2), math_number(4), 2)` | `begin(...)` |
| `chipintelli_ir_init_air` | 语句 | TX_PIN, RX_PIN, TIMER, RESOURCE_ID | `chipintelli_ir_init_air(math_number(2), math_number(4), 2, math_number(50000))` | `beginAirConditioner(...)` |
| `chipintelli_ir_send_raw` | 语句 | DURATIONS(String) | `chipintelli_ir_send_raw(text("9000,4500,560,560"))` | 解析后 `sendRaw` |
| `chipintelli_ir_send_nec` | 语句 | ADDRESS, COMMAND, REPEATS | `chipintelli_ir_send_nec(math_number(16), math_number(32), math_number(0))` | `sendNEC` |
| `chipintelli_ir_send_extended_nec` | 语句 | ADDRESS, COMMAND, REPEATS | `chipintelli_ir_send_extended_nec(math_number(13483), math_number(32), math_number(0))` | `sendExtendedNEC` |
| `chipintelli_ir_start_receive` | 语句 | TIMEOUT | `chipintelli_ir_start_receive(math_number(5000))` | `startReceive` |
| `chipintelli_ir_stop_receive` | 语句 | 无 | `chipintelli_ir_stop_receive()` | `stopReceive` |
| `chipintelli_ir_read_received` | 语句 | HANDLER(statement) | `chipintelli_ir_read_received() @HANDLER: ...` | 状态 Ready 后 `readRaw` |
| `chipintelli_ir_replay_received` | 语句 | 无 | `chipintelli_ir_replay_received()` | `sendRaw(buffer)` |
| `chipintelli_ir_received_count` | 值(Number) | 无 | `chipintelli_ir_received_count()` | 最近项数 |
| `chipintelli_ir_received_text` | 值(String) | 无 | `chipintelli_ir_received_text()` | 逗号分隔时长 |
| `chipintelli_ir_receive_status` | 值(Number) | 无 | `chipintelli_ir_receive_status()` | `receiveStatus()` |
| `chipintelli_ir_receive_status_value` | 值(Number) | STATUS | `chipintelli_ir_receive_status_value(2)` | 常量 0～4 |
| `chipintelli_ir_is_busy` | 值(Boolean) | 无 | `chipintelli_ir_is_busy()` | `isBusy()` |
| `chipintelli_ir_select_air_brand` | 语句 | BRAND | `chipintelli_ir_select_air_brand(Gree)` | `selectAirBrand` |
| `chipintelli_ir_select_air_code` | 语句 | CODE_ID | `chipintelli_ir_select_air_code(math_number(0))` | `selectAirCode` |
| `chipintelli_ir_air_code` | 值(Number) | 无 | `chipintelli_ir_air_code()` | `airCode()` |
| `chipintelli_ir_send_air_command` | 语句 | COMMAND | `chipintelli_ir_send_air_command(ModeCool)` | `sendAir` |
| `chipintelli_ir_set_air_temperature` | 语句 | TEMPERATURE | `chipintelli_ir_set_air_temperature(math_number(26))` | `setTemperature` |
| `chipintelli_ir_air_power` | 语句 | POWER | `chipintelli_ir_air_power(true)` | `power` |
| `chipintelli_ir_start_air_search` | 语句 | SEARCH_TYPE, SEND_COUNT, INTERVAL | `chipintelli_ir_start_air_search(AllBrands, math_number(3), math_number(3000))` | `startAirSearch` |
| `chipintelli_ir_stop_air_search` | 语句 | 无 | `chipintelli_ir_stop_air_search()` | `stopAirSearch` |
| `chipintelli_ir_read_air_search_event` | 语句 | HANDLER | `chipintelli_ir_read_air_search_event() @HANDLER: ...` | 安全转发事件 |
| `chipintelli_ir_air_search_event` | 值(Number) | 无 | `chipintelli_ir_air_search_event()` | 事件 0～2 |
| `chipintelli_ir_air_search_code` | 值(Number) | 无 | `chipintelli_ir_air_search_code()` | 候选 code ID |
| `chipintelli_ir_air_search_event_value` | 值(Number) | EVENT | `chipintelli_ir_air_search_event_value(0)` | 常量 0～2 |
| `chipintelli_ir_mode` | 值(Number) | 无 | `chipintelli_ir_mode()` | 模式 0～2 |
| `chipintelli_ir_last_error` | 值(Number) | 无 | `chipintelli_ir_last_error()` | 错误枚举 |
| `chipintelli_ir_error_string` | 值(String) | 无 | `chipintelli_ir_error_string()` | 错误说明 |

## Parameter Options

- `TIMER`: `0`、`1`、`2`；TIMER3 被 BLE SDK 占用。
- `SEARCH_TYPE`: `AllBrands` 或 `CurrentBrandModels`。
- `STATUS`: `0` 空闲、`1` 接收中、`2` 已就绪、`3` 超时、`4` 错误。
- `EVENT`: `0` 候选码已发送、`1` 搜索完成、`2` 搜索停止。

## 注意事项

1. 原始模式与空调模式在一次启动中互斥，成功初始化后资源保持到复位。
2. 原始波形每项至少 200 µs，最多 1024 项，载波固定 38 kHz。
3. 空调数据库文件必须位于工程 `recursos/user_file_entries/[50000]ir_data_2024_08_16.bin`。
4. 搜索事件 Getter 应放在 `chipintelli_ir_read_air_search_event` 的 `HANDLER` 内。
5. 接收超时限制为 1～60000 ms；空调温度限制为 16～30 ℃；搜索间隔至少 3000 ms。
