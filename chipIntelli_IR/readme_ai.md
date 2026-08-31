# ChipIntelliIR

CI13XX 原始红外、NEC 与原厂空调码库积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-ir`
- **版本**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_ir_init_raw` | 语句 | TX_PIN(input_value), RX_PIN(input_value), TIMER(dropdown) | `chipintelli_ir_init_raw(math_number(2), math_number(4), 2)` | `ChipIntelliIR.begin((uint8_t)(1), (uint8_t)(1), 0);` |
| `chipintelli_ir_init_air` | 语句 | TX_PIN(input_value), RX_PIN(input_value), TIMER(dropdown), RESOURCE_ID(input_value) | `chipintelli_ir_init_air(math_number(2), math_number(4), 2, math_number(50000))` | `ChipIntelliIR.beginAirConditioner((uint8_t)(1), (uint8_t)(1), 0, (uint16_t)(1));` |
| `chipintelli_ir_send_raw` | 语句 | DURATIONS(input_value) | `chipintelli_ir_send_raw(text("9000,4500,560,560"))` | `ailyChipIntelliIRSendRawText(String("value"));` |
| `chipintelli_ir_send_nec` | 语句 | ADDRESS(input_value), COMMAND(input_value), REPEATS(input_value) | `chipintelli_ir_send_nec(math_number(16), math_number(32), math_number(0))` | `ChipIntelliIR.sendNEC((uint8_t)(1), (uint8_t)(1), (uint8_t)constrain((int)(1), 0, 239));` |
| `chipintelli_ir_send_extended_nec` | 语句 | ADDRESS(input_value), COMMAND(input_value), REPEATS(input_value) | `chipintelli_ir_send_extended_nec(math_number(13483), math_number(32), math_number(0))` | `ChipIntelliIR.sendExtendedNEC((uint16_t)(1), (uint8_t)(1), (uint8_t)constrain((int)(1), 0, 239));` |
| `chipintelli_ir_start_receive` | 语句 | TIMEOUT(input_value) | `chipintelli_ir_start_receive(math_number(5000))` | `ChipIntelliIR.startReceive((uint32_t)constrain((long)(1), 1L, 60000L));` |
| `chipintelli_ir_stop_receive` | 语句 | (none) | `chipintelli_ir_stop_receive()` | `ChipIntelliIR.stopReceive();` |
| `chipintelli_ir_read_received` | 语句 | HANDLER(input_statement) | `chipintelli_ir_read_received()` | `if (ChipIntelliIR.receiveStatus() == ChipIntelliIRClass::ReceiveStatus::Ready && ↵ ChipIntelliIR.readRaw(ailyChipIntelliIRRaw, ChipIntelliIRClass::MaxRawEntries, ailyChipIntelliIRRawCount)) { ↵ }` |
| `chipintelli_ir_replay_received` | 语句 | (none) | `chipintelli_ir_replay_received()` | `if (ailyChipIntelliIRRawCount != 0) { ↵ ChipIntelliIR.sendRaw(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount); ↵ }` |
| `chipintelli_ir_received_count` | 值(Number) | (none) | `chipintelli_ir_received_count()` | `ailyChipIntelliIRRawCount` |
| `chipintelli_ir_received_text` | 值(String) | (none) | `chipintelli_ir_received_text()` | `ailyChipIntelliIRRawText()` |
| `chipintelli_ir_receive_status` | 值(Number) | (none) | `chipintelli_ir_receive_status()` | `static_cast<uint8_t>(ChipIntelliIR.receiveStatus())` |
| `chipintelli_ir_receive_status_value` | 值(Number) | STATUS(dropdown) | `chipintelli_ir_receive_status_value(2)` | `0` |
| `chipintelli_ir_is_busy` | 值(Boolean) | (none) | `chipintelli_ir_is_busy()` | `ChipIntelliIR.isBusy()` |
| `chipintelli_ir_select_air_brand` | 语句 | BRAND(dropdown) | `chipintelli_ir_select_air_brand(Gree)` | `ChipIntelliIR.selectAirBrand(ChipIntelliIRClass::AirBrand::LG);` |
| `chipintelli_ir_select_air_code` | 语句 | CODE_ID(input_value) | `chipintelli_ir_select_air_code(math_number(0))` | `ChipIntelliIR.selectAirCode((uint32_t)(1));` |
| `chipintelli_ir_air_code` | 值(Number) | (none) | `chipintelli_ir_air_code()` | `ChipIntelliIR.airCode()` |
| `chipintelli_ir_send_air_command` | 语句 | COMMAND(dropdown) | `chipintelli_ir_send_air_command(ModeCool)` | `ChipIntelliIR.sendAir(ChipIntelliIRClass::AirCommand::PowerOn);` |
| `chipintelli_ir_set_air_temperature` | 语句 | TEMPERATURE(input_value) | `chipintelli_ir_set_air_temperature(math_number(26))` | `ChipIntelliIR.setTemperature((uint8_t)constrain((int)(1), 16, 30));` |
| `chipintelli_ir_air_power` | 语句 | POWER(dropdown) | `chipintelli_ir_air_power(true)` | `ChipIntelliIR.power(true);` |
| `chipintelli_ir_start_air_search` | 语句 | SEARCH_TYPE(dropdown), SEND_COUNT(input_value), INTERVAL(input_value) | `chipintelli_ir_start_air_search(AllBrands, math_number(3), math_number(3000))` | `ChipIntelliIR.startAirSearch(ChipIntelliIRClass::AirSearchType::AllBrands, ailyChipIntelliIRSearchCallback, nullptr, (uint8_t)constrain((int)(1), 3, 255), (uint32_t)constrain((long)(1), 3000L, 2147483647L));` |
| `chipintelli_ir_stop_air_search` | 语句 | (none) | `chipintelli_ir_stop_air_search()` | `ChipIntelliIR.stopAirSearch();` |
| `chipintelli_ir_read_air_search_event` | 语句 | HANDLER(input_statement) | `chipintelli_ir_read_air_search_event()` | `if (ailyChipIntelliIRSearchPending) { ↵ ailyChipIntelliIRSearchPending = false; ↵ }` |
| `chipintelli_ir_air_search_event` | 值(Number) | (none) | `chipintelli_ir_air_search_event()` | `ailyChipIntelliIRSearchEvent` |
| `chipintelli_ir_air_search_code` | 值(Number) | (none) | `chipintelli_ir_air_search_code()` | `ailyChipIntelliIRSearchCode` |
| `chipintelli_ir_air_search_event_value` | 值(Number) | EVENT(dropdown) | `chipintelli_ir_air_search_event_value(0)` | `0` |
| `chipintelli_ir_mode` | 值(Number) | (none) | `chipintelli_ir_mode()` | `static_cast<uint8_t>(ChipIntelliIR.mode())` |
| `chipintelli_ir_last_error` | 值(Number) | (none) | `chipintelli_ir_last_error()` | `static_cast<uint8_t>(ChipIntelliIR.lastError())` |
| `chipintelli_ir_error_string` | 值(String) | (none) | `chipintelli_ir_error_string()` | `String(ChipIntelliIR.errorString())` |

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
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    chipintelli_ir_init_raw(math_number(2), math_number(4), 2)
```
