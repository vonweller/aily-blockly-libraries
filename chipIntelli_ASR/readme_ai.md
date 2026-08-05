# ChipIntelliASR

基于 `ChipIntelliASR 2.2.0` 的 CI13XX 离线语音识别积木。事件模型与 OneButton 类似：在 setup 中注册 `attach*` 回调，在 loop 中非阻塞调用 `tick()`；事件积木会自动生成这两部分代码。

## Library Info

- **名称**: `@aily-project/lib-chipintelli-asr`
- **版本**: 2.2.0
- **对象**: 全局单例 `ChipIntelliASR`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_asr_init` | 语句 | WAKE_WORD(field), TIMEOUT(field, 秒) | `chipintelli_asr_init("智能管家", "10")` | `#define COMMAND1 1 //智能管家`；`begin(10000)` |
| `chipintelli_asr_end` | 语句 | 无 | `chipintelli_asr_end()` | `end()` |
| `chipintelli_asr_on_startup` | 事件 | HANDLER(statement) | `chipintelli_asr_on_startup() @HANDLER: ...` | `attachStartup(callback)`；自动 `tick()` |
| `chipintelli_asr_on_wakeup` | 事件 | HANDLER(statement) | `chipintelli_asr_on_wakeup() @HANDLER: ...` | `attachWakeup(callback)`；自动 `tick()` |
| `chipintelli_asr_on_timeout` | 事件 | HANDLER(statement) | `chipintelli_asr_on_timeout() @HANDLER: ...` | `attachTimeout(callback)`；自动 `tick()` |
| `chipintelli_asr_on_result` | 事件 | HANDLER(statement) | `chipintelli_asr_on_result() @HANDLER: ...` | `onResult(callback)`；自动 `tick()` |
| `chipintelli_asr_on_command` | 事件 | COMMAND(value), HANDLER(statement) | `chipintelli_asr_on_command(chipintelli_asr_command("打开灯")) @HANDLER: ...` | `attachCommand(id, callback)`；自动 `tick()` |
| `chipintelli_asr_on_semantic` | 事件 | SEMANTIC_ID(value), HANDLER(statement) | `chipintelli_asr_on_semantic(math_number(31725955)) @HANDLER: ...` | `attachSemantic(id, callback)`；自动 `tick()` |
| `chipintelli_asr_command` | 值(Number) | TEXT(field) | `chipintelli_asr_command("打开灯")` | `#define COMMAND2 2 //打开灯`；返回 `COMMAND2` |
| `chipintelli_asr_detach_lifecycle` | 语句 | EVENT(dropdown) | `chipintelli_asr_detach_lifecycle(STARTUP)` | `detachStartup/Wakeup/Timeout()` |
| `chipintelli_asr_detach_command` | 语句 | COMMAND(value) | `chipintelli_asr_detach_command(math_number(2))` | `detachCommand(id)` |
| `chipintelli_asr_detach_semantic` | 语句 | SEMANTIC_ID(value) | `chipintelli_asr_detach_semantic(math_number(31725955))` | `detachSemantic(id)` |
| `chipintelli_asr_detach_handlers` | 语句 | HANDLERS(dropdown) | `chipintelli_asr_detach_handlers(ALL)` | `detachAllCommands/Semantics/All()` |
| `chipintelli_asr_keep_awake_for` | 语句 | TIMEOUT(value, 秒) | `chipintelli_asr_keep_awake_for(math_number(10))` | `keepAwakeFor(timeoutSeconds * 1000)` |
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
    chipintelli_asr_init("智能管家", "10")

chipintelli_asr_on_wakeup()
    @HANDLER:
        chipintelli_asr_keep_awake_for(math_number(10))

chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))
    @HANDLER:
        serial_println(Serial, chipintelli_asr_result_text())
```

生成代码会创建独立回调，把完整 `ChipIntelliASRResult` 复制到当前结果变量，在 setup 末尾调用 `attachWakeup()` / `attachCommand()`，并且只向 loop 添加一次 `ChipIntelliASR.tick()`。

## 注意事项

1. 当前结果 Getter 应放在 `on_result`、`on_command`、`on_semantic` 或 `read_results` 的 HANDLER 内。
2. `onResult()` 先观察每个结果；随后优先匹配命令 ID，没有精确命令处理函数时才匹配语义 ID。
3. 事件积木使用 `tick()`，轮询积木使用 `read()`；二者消费同一结果队列，通常不要混用。
4. 唤醒词固定使用命令 ID 1；普通命令按文本去重，并从 ID 2 开始按首次使用顺序编号。
5. 结果文本缓冲区容量为 64 字节；用 `result_text_truncated` 检查截断。
6. AEC 与语音打断能力由 Arduino 的编译时算法配置决定。
