# ChipIntelliCWSL

CI13XX 命令词/唤醒词自学习、模板管理与异步事件积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-cwsl`
- **版本**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_cwsl_init` | 语句 | TIMEOUT(value) | `chipintelli_cwsl_init(math_number(10000))` | `begin(timeout)` |
| `chipintelli_cwsl_end` | 语句 | 无 | `chipintelli_cwsl_end()` | `end()` |
| `chipintelli_cwsl_learn` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(value), GROUP_ID(value) | `chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))` | `learnCommand/learnWakeWord` |
| `chipintelli_cwsl_cancel_learning` | 语句 | 无 | `chipintelli_cwsl_cancel_learning()` | `cancelLearning()` |
| `chipintelli_cwsl_erase_template` | 语句 | WORD_TYPE, COMMAND_ID, GROUP_ID | `chipintelli_cwsl_erase_template(COMMAND, math_number(2), math_number(0))` | `eraseCommand/eraseWakeWord` |
| `chipintelli_cwsl_erase_templates` | 语句 | SCOPE(dropdown) | `chipintelli_cwsl_erase_templates(ALL)` | `eraseCommands/eraseWakeWords/eraseAll` |
| `chipintelli_cwsl_read_events` | 语句 | HANDLER(statement) | `chipintelli_cwsl_read_events() @HANDLER: ...` | `while (read(event))` |
| `chipintelli_cwsl_profile_enabled` | 值(Boolean) | 无 | `chipintelli_cwsl_profile_enabled()` | `profileEnabled()` |
| `chipintelli_cwsl_available` | 值(Boolean) | 无 | `chipintelli_cwsl_available()` | `available()` |
| `chipintelli_cwsl_state` | 值(Number) | 无 | `chipintelli_cwsl_state()` | `state()` |
| `chipintelli_cwsl_state_value` | 值(Number) | STATE | `chipintelli_cwsl_state_value(0)` | 常量 0、1、2、3、255 |
| `chipintelli_cwsl_count` | 值(Number) | COUNT_TYPE | `chipintelli_cwsl_count(TEMPLATE)` | 容量查询 |
| `chipintelli_cwsl_dropped_events` | 值(Number) | 无 | `chipintelli_cwsl_dropped_events()` | `droppedEvents()` |
| `chipintelli_cwsl_event_type` | 值(Number) | 无 | `chipintelli_cwsl_event_type()` | `event.type` |
| `chipintelli_cwsl_event_word_type` | 值(Number) | 无 | `chipintelli_cwsl_event_word_type()` | `event.wordType` |
| `chipintelli_cwsl_event_attempt` | 值(Number) | 无 | `chipintelli_cwsl_event_attempt()` | `event.attempt` |
| `chipintelli_cwsl_event_result` | 值(Number) | 无 | `chipintelli_cwsl_event_result()` | `event.result` |
| `chipintelli_cwsl_event_command_id` | 值(Number) | 无 | `chipintelli_cwsl_event_command_id()` | `event.commandId` |
| `chipintelli_cwsl_event_group_id` | 值(Number) | 无 | `chipintelli_cwsl_event_group_id()` | `event.groupId` |
| `chipintelli_cwsl_event_distance` | 值(Number) | 无 | `chipintelli_cwsl_event_distance()` | `event.distance` |
| `chipintelli_cwsl_event_type_value` | 值(Number) | EVENT_TYPE | `chipintelli_cwsl_event_type_value(4)` | 事件常量 1～9 |
| `chipintelli_cwsl_learn_result_value` | 值(Number) | RESULT | `chipintelli_cwsl_learn_result_value(0)` | 尝试结果常量 0～6 |

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
