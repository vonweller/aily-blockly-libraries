# ChipIntelliASR

基于 `ChipIntelliASR 2.3.0` 的 CI13XX 离线语音识别积木。事件模型与 OneButton 类似：在 setup 中注册 `attach*` 回调，在 loop 中非阻塞调用 `tick()`；事件积木会自动生成这两部分代码。唤醒词使用独立配置积木，每个唤醒词积木都会生成对应的 `WAKEWORD<n>` 宏，并在当前位置启用唤醒词模式。唤醒后的命令响应窗口默认提供 15 秒输入值，用户可以修改。

## Library Info

- **名称**: `@aily-project/lib-chipintelli-asr`
- **版本**: 2.3.0
- **对象**: 全局单例 `ChipIntelliASR`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_asr_init` | 语句 | 无 | `chipintelli_asr_init()` | 调用无参 `begin()`；不生成唤醒词宏或初始化超时变量 |
| `chipintelli_asr_set_wake_word` | 语句 | WAKE_WORD(field) | `chipintelli_asr_set_wake_word("智能管家")` | 第一个生成 `WAKEWORD1`，后续生成 `WAKEWORD<n>`；当前位置生成 `setWakeWordEnabled(true)` |
| `chipintelli_asr_end` | 语句 | 无 | `chipintelli_asr_end()` | `end()` |
| `chipintelli_asr_on_startup` | 事件 | HANDLER(statement) | `chipintelli_asr_on_startup() @HANDLER: ...` | `attachStartup(callback)`；自动 `tick()` |
| `chipintelli_asr_on_wakeup` | 事件 | HANDLER(statement) | `chipintelli_asr_on_wakeup() @HANDLER: ...` | `attachWakeup(callback)`；自动 `tick()` |
| `chipintelli_asr_on_timeout` | 事件 | HANDLER(statement) | `chipintelli_asr_on_timeout() @HANDLER: ...` | `attachTimeout(callback)`；自动 `tick()` |
| `chipintelli_asr_on_result` | 事件 | HANDLER(statement) | `chipintelli_asr_on_result() @HANDLER: ...` | `onResult(callback)`；自动 `tick()` |
| `chipintelli_asr_on_command` | 事件 | COMMAND(value), HANDLER(statement) | `chipintelli_asr_on_command(chipintelli_asr_command("打开灯")) @HANDLER: ...` | `attachCommand(id, callback)`；自动 `tick()` |
| `chipintelli_asr_on_semantic` | 事件 | SEMANTIC_ID(value), HANDLER(statement) | `chipintelli_asr_on_semantic(math_number(0)) @HANDLER: ...` | `attachSemantic(id, callback)`；自动 `tick()` |
| `chipintelli_asr_command` | 值(Number) | TEXT(field) | `chipintelli_asr_command("打开灯")` | `#define COMMAND2 2 //打开灯`；返回 `COMMAND2` |
| `chipintelli_asr_detach_lifecycle` | 语句 | EVENT(dropdown) | `chipintelli_asr_detach_lifecycle(STARTUP)` | `detachStartup/Wakeup/Timeout()` |
| `chipintelli_asr_detach_command` | 语句 | COMMAND(value) | `chipintelli_asr_detach_command(math_number(2))` | `detachCommand(id)` |
| `chipintelli_asr_detach_semantic` | 语句 | SEMANTIC_ID(value) | `chipintelli_asr_detach_semantic(math_number(31725955))` | `detachSemantic(id)` |
| `chipintelli_asr_detach_handlers` | 语句 | HANDLERS(dropdown) | `chipintelli_asr_detach_handlers(ALL)` | `detachAllCommands/Semantics/All()` |
| `chipintelli_asr_keep_awake_for` | 语句 | TIMEOUT(value, 秒) | `chipintelli_asr_keep_awake_for(math_number(15))` | `keepAwakeFor(timeoutSeconds * 1000)`；工具箱默认 15 秒，可修改 |
| `chipintelli_asr_is_awake` | 值(Boolean) | 无 | `chipintelli_asr_is_awake()` | `isAwake()` |
| `chipintelli_asr_read_results` | 语句 | HANDLER(statement) | `chipintelli_asr_read_results() @HANDLER: ...` | `while (read(result))` |
| `chipintelli_asr_available` | 值(Boolean) | 无 | `chipintelli_asr_available()` | `available()` |
| `chipintelli_asr_result_command_id` | 值(Number) | 无 | `chipintelli_asr_result_command_id()` | `result.commandId` |
| `chipintelli_asr_result_semantic_id` | 值(Number) | 无 | `chipintelli_asr_result_semantic_id()` | `result.semanticId` |
| `chipintelli_asr_result_score` | 值(Number) | 无 | `chipintelli_asr_result_score()` | `result.score` |
| `chipintelli_asr_result_frames` | 值(Number) | 无 | `chipintelli_asr_result_frames()` | `result.frames` |
| `chipintelli_asr_result_is_wake_word` | 值(Boolean) | 无 | `chipintelli_asr_result_is_wake_word()` | `result.isWakeWord` |
| `chipintelli_asr_result_text` | 值(String) | 无 | `chipintelli_asr_result_text()` | `String(result.text)` |
| `chipintelli_asr_result_text_truncated` | 值(Boolean) | 无 | `chipintelli_asr_result_text_truncated()` | `result.textTruncated` |
| `chipintelli_asr_pending_results` | 值(Number) | 无 | `chipintelli_asr_pending_results()` | `pendingResults()` |
| `chipintelli_asr_pending_events` | 值(Number) | 无 | `chipintelli_asr_pending_events()` | `pendingEvents()` |
| `chipintelli_asr_dropped_results` | 值(Number) | 无 | `chipintelli_asr_dropped_results()` | `droppedResults()` |
| `chipintelli_asr_dropped_events` | 值(Number) | 无 | `chipintelli_asr_dropped_events()` | `droppedEvents()` |
| `chipintelli_asr_handler_count` | 值(Number) | 无 | `chipintelli_asr_handler_count()` | `handlerCount()` |
| `chipintelli_asr_handler_capacity` | 值(Number) | 无 | `chipintelli_asr_handler_capacity()` | `handlerCapacity()` |
| `chipintelli_asr_last_error` | 值(Number) | 无 | `chipintelli_asr_last_error()` | `lastError()` 转为整数 |
| `chipintelli_asr_last_error_text` | 值(String) | 无 | `chipintelli_asr_last_error_text()` | `errorString(lastError())` |
| `chipintelli_asr_aec_enabled` | 值(Boolean) | 无 | `chipintelli_asr_aec_enabled()` | `isAECEnabled()` |
| `chipintelli_asr_barge_in_enabled` | 值(Boolean) | 无 | `chipintelli_asr_barge_in_enabled()` | `isBargeInEnabled()` |
| `chipintelli_asr_barge_in_mode` | 值(Number) | 无 | `chipintelli_asr_barge_in_mode()` | `bargeInMode()` 转为整数 |
| `chipintelli_asr_barge_in_mode_value` | 值(Number) | MODE(dropdown) | `chipintelli_asr_barge_in_mode_value(3)` | 常量 0～3 |

## Parameter Options

- `EVENT`: `STARTUP` 启动完成；`WAKEUP` 进入命令会话；`TIMEOUT` 命令会话超时。
- `HANDLERS`: `COMMANDS` 全部命令；`SEMANTICS` 全部语义；`ALL` 命令和语义。
- `MODE`: `0` 禁用；`1` 仅唤醒词；`2` 仅命令词；`3` 唤醒词和命令词。

## ABS 示例

```text
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("智能管家")
    chipintelli_asr_set_wake_word("你好小智")

chipintelli_asr_on_wakeup()
    @HANDLER:
        chipintelli_asr_keep_awake_for(math_number(15))

chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))
    @HANDLER:
        serial_println(Serial, chipintelli_asr_result_text())
```

生成代码会创建独立回调，把完整 `ChipIntelliASRResult` 复制到当前结果变量，在 setup 末尾调用 `attachWakeup()` / `attachCommand()`，并且只向 loop 添加一次 `ChipIntelliASR.tick()`。

## 注意事项

1. 当前结果 Getter 应放在 `on_result`、`on_command` 或 `read_results` 的 HANDLER 内。
2. `onResult()` 观察每个识别结果；命令处理函数按命令 ID 精确匹配。
3. 事件积木使用 `tick()`，轮询积木使用 `read()`；二者消费同一结果队列，通常不要混用。
4. 第一个唤醒词固定使用命令 ID 1；后续唤醒词与普通命令共享从 ID 2 开始的编号空间。每个唤醒词积木独立生成宏，即使文本相同也不会合并；普通命令仍按文本去重。唤醒词积木会在自身位置生成 `setWakeWordEnabled(true)`，因此应放在初始化积木之后。
5. 初始化积木不会自动添加唤醒词宏，也不向用户暴露初始化等待时间；始终生成无参 `begin()`。
6. `keep_awake_for` 设置的是唤醒后的命令响应窗口，只在已经唤醒时生效；工具箱默认 15 秒，用户可修改。
7. 结果文本缓冲区容量为 64 字节；用 `result_text_truncated` 检查截断。
8. AEC 与语音打断能力由 Arduino 的编译时算法配置决定。
9. 只有连接到 `arduino_setup`、`arduino_loop` 或本库事件 Hat 执行链的积木才会贡献头文件、宏、变量、回调以及 setup/loop 片段；孤立积木和工具箱 flyout 积木不参与代码生成。
