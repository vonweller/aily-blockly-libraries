# ChipIntelliCWSL

CI13XX 命令词/唤醒词自学习、模板管理与异步事件积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-cwsl`
- **版本**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_cwsl_init` | 语句 | TIMEOUT(input_value) | `chipintelli_cwsl_init(math_number(10000))` | `ChipIntelliCWSL.begin((uint32_t)max(0L, (long)(1)));` |
| `chipintelli_cwsl_end` | 语句 | (none) | `chipintelli_cwsl_end()` | `ChipIntelliCWSL.end();` |
| `chipintelli_cwsl_learn` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.learnCommand((uint32_t)(1), (uint16_t)(1));` |
| `chipintelli_cwsl_cancel_learning` | 语句 | (none) | `chipintelli_cwsl_cancel_learning()` | `ChipIntelliCWSL.cancelLearning();` |
| `chipintelli_cwsl_erase_template` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_erase_template(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.eraseCommand((uint32_t)(1), (uint16_t)(1));` |
| `chipintelli_cwsl_erase_templates` | 语句 | SCOPE(dropdown) | `chipintelli_cwsl_erase_templates(ALL)` | `ChipIntelliCWSL.eraseCommands();` |
| `chipintelli_cwsl_read_events` | 语句 | HANDLER(input_statement) | `chipintelli_cwsl_read_events()` | `while (ChipIntelliCWSL.read(ailyChipIntelliCWSLEvent)) { ↵ }` |
| `chipintelli_cwsl_profile_enabled` | 值(Boolean) | (none) | `chipintelli_cwsl_profile_enabled()` | `ChipIntelliCWSL.profileEnabled()` |
| `chipintelli_cwsl_available` | 值(Boolean) | (none) | `chipintelli_cwsl_available()` | `ChipIntelliCWSL.available()` |
| `chipintelli_cwsl_state` | 值(Number) | (none) | `chipintelli_cwsl_state()` | `static_cast<uint8_t>(ChipIntelliCWSL.state())` |
| `chipintelli_cwsl_state_value` | 值(Number) | STATE(dropdown) | `chipintelli_cwsl_state_value(0)` | `0` |
| `chipintelli_cwsl_count` | 值(Number) | COUNT_TYPE(dropdown) | `chipintelli_cwsl_count(TEMPLATE)` | `ChipIntelliCWSL.commandCount()` |
| `chipintelli_cwsl_dropped_events` | 值(Number) | (none) | `chipintelli_cwsl_dropped_events()` | `ChipIntelliCWSL.droppedEvents()` |
| `chipintelli_cwsl_event_type` | 值(Number) | (none) | `chipintelli_cwsl_event_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.type)` |
| `chipintelli_cwsl_event_word_type` | 值(Number) | (none) | `chipintelli_cwsl_event_word_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.wordType)` |
| `chipintelli_cwsl_event_attempt` | 值(Number) | (none) | `chipintelli_cwsl_event_attempt()` | `ailyChipIntelliCWSLEvent.attempt` |
| `chipintelli_cwsl_event_result` | 值(Number) | (none) | `chipintelli_cwsl_event_result()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.result)` |
| `chipintelli_cwsl_event_command_id` | 值(Number) | (none) | `chipintelli_cwsl_event_command_id()` | `ailyChipIntelliCWSLEvent.commandId` |
| `chipintelli_cwsl_event_group_id` | 值(Number) | (none) | `chipintelli_cwsl_event_group_id()` | `ailyChipIntelliCWSLEvent.groupId` |
| `chipintelli_cwsl_event_distance` | 值(Number) | (none) | `chipintelli_cwsl_event_distance()` | `ailyChipIntelliCWSLEvent.distance` |
| `chipintelli_cwsl_event_type_value` | 值(Number) | EVENT_TYPE(dropdown) | `chipintelli_cwsl_event_type_value(4)` | `1` |
| `chipintelli_cwsl_learn_result_value` | 值(Number) | RESULT(dropdown) | `chipintelli_cwsl_learn_result_value(0)` | `0` |

## Parameter Options

- `WORD_TYPE`: `COMMAND` 普通命令词，`WAKE` 唤醒词。
- `SCOPE`: `COMMANDS`、`WAKE_WORDS`、`ALL`。
- `COUNT_TYPE`: `COMMAND`、`WAKE`、`TEMPLATE`、`REMAINING`、`MAX`。

## 注意事项

1. 编译前必须选择 CWSL 或 CWSL+AEC 算法配置。
2. 命令 ID 必须已存在于 `cmd_info`；199～208 为打包流程保留 ID。
3. 当前事件 Getter 应放在 `chipintelli_cwsl_read_events` 的 `HANDLER` 内。
4. 学习开始后不可可靠取消；控制 API 只能从 `setup`、`loop` 或普通 RTOS 任务调用。
5. CI1302 的 CWSL 固件空间接近上限，避免在同一工程中同时引入大量未使用功能。
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    chipintelli_cwsl_init(math_number(10000))
```
