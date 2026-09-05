# ChipIntelliASR

基于 `ChipIntelliASR 2.3.0` 的 CI13XX 离线语音识别积木。事件积木在 setup 中注册 `attach*` 回调，并在 loop 中非阻塞调用 `tick()`。每个唤醒词积木生成对应的 `WAKEWORD<n>` 宏并在当前位置启用唤醒词模式。`keep_awake_for` 的工具箱影子输入初始为 15 秒，但只有实际放置该积木才会调用 `keepAwakeFor()`。

## Library Info

- **Name**: `@aily-project/lib-chipintelli-asr`
- **Version**: 2.3.0
- **Object**: global singleton `ChipIntelliASR`

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_asr_init` | 语句 | (none) | `chipintelli_asr_init()` | `ChipIntelliASR.begin();` |
| `chipintelli_asr_set_wake_word` | 语句 | WAKE_WORD(field_input) | `chipintelli_asr_set_wake_word("智能管家")` | `ChipIntelliASR.setWakeWordEnabled(true);` |
| `chipintelli_asr_end` | 语句 | (none) | `chipintelli_asr_end()` | `ChipIntelliASR.end();` |
| `chipintelli_asr_on_startup` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_startup()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachStartup(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_wakeup` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_wakeup()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachWakeup(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_timeout` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_timeout()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachTimeout(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_result` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_result()` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.onResult(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_command` | 事件 | COMMAND(input_value), HANDLER(input_statement) | `chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.attachCommand((uint16_t)(1), ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_semantic` | 事件 | SEMANTIC_ID(input_value), HANDLER(input_statement) | `chipintelli_asr_on_semantic(math_number(0))` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.attachSemantic((uint32_t)(1), ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_command` | 值(Number) | TEXT(field_input) | `chipintelli_asr_command("打开灯")` | `COMMAND2` |
| `chipintelli_asr_detach_lifecycle` | 语句 | EVENT(dropdown) | `chipintelli_asr_detach_lifecycle(STARTUP)` | `ChipIntelliASR.detachStartup();` |
| `chipintelli_asr_detach_command` | 语句 | COMMAND(input_value) | `chipintelli_asr_detach_command(math_number(2))` | `ChipIntelliASR.detachCommand((uint16_t)(1));` |
| `chipintelli_asr_detach_semantic` | 语句 | SEMANTIC_ID(input_value) | `chipintelli_asr_detach_semantic(math_number(31725955))` | `ChipIntelliASR.detachSemantic((uint32_t)(1));` |
| `chipintelli_asr_detach_handlers` | 语句 | HANDLERS(dropdown) | `chipintelli_asr_detach_handlers(COMMANDS)` | `ChipIntelliASR.detachAllCommands();` |
| `chipintelli_asr_keep_awake_for` | 语句 | TIMEOUT(input_value) | `chipintelli_asr_keep_awake_for(math_number(15))` | `ChipIntelliASR.keepAwakeFor((uint32_t)max(0L, (long)(1)) * 1000UL);` |
| `chipintelli_asr_is_awake` | 值(Boolean) | (none) | `chipintelli_asr_is_awake()` | `ChipIntelliASR.isAwake()` |
| `chipintelli_asr_read_results` | 语句 | HANDLER(input_statement) | `chipintelli_asr_read_results()` | `while (ChipIntelliASR.read(ailyChipIntelliASRResult)) { ↵ }` |
| `chipintelli_asr_available` | 值(Boolean) | (none) | `chipintelli_asr_available()` | `ChipIntelliASR.available()` |
| `chipintelli_asr_result_command_id` | 值(Number) | (none) | `chipintelli_asr_result_command_id()` | `ailyChipIntelliASRResult.commandId` |
| `chipintelli_asr_result_semantic_id` | 值(Number) | (none) | `chipintelli_asr_result_semantic_id()` | `ailyChipIntelliASRResult.semanticId` |
| `chipintelli_asr_result_score` | 值(Number) | (none) | `chipintelli_asr_result_score()` | `ailyChipIntelliASRResult.score` |
| `chipintelli_asr_result_frames` | 值(Number) | (none) | `chipintelli_asr_result_frames()` | `ailyChipIntelliASRResult.frames` |
| `chipintelli_asr_result_is_wake_word` | 值(Boolean) | (none) | `chipintelli_asr_result_is_wake_word()` | `ailyChipIntelliASRResult.isWakeWord` |
| `chipintelli_asr_result_text` | 值(String) | (none) | `chipintelli_asr_result_text()` | `String(ailyChipIntelliASRResult.text)` |
| `chipintelli_asr_result_text_truncated` | 值(Boolean) | (none) | `chipintelli_asr_result_text_truncated()` | `ailyChipIntelliASRResult.textTruncated` |
| `chipintelli_asr_pending_results` | 值(Number) | (none) | `chipintelli_asr_pending_results()` | `ChipIntelliASR.pendingResults()` |
| `chipintelli_asr_pending_events` | 值(Number) | (none) | `chipintelli_asr_pending_events()` | `ChipIntelliASR.pendingEvents()` |
| `chipintelli_asr_dropped_results` | 值(Number) | (none) | `chipintelli_asr_dropped_results()` | `ChipIntelliASR.droppedResults()` |
| `chipintelli_asr_dropped_events` | 值(Number) | (none) | `chipintelli_asr_dropped_events()` | `ChipIntelliASR.droppedEvents()` |
| `chipintelli_asr_handler_count` | 值(Number) | (none) | `chipintelli_asr_handler_count()` | `ChipIntelliASR.handlerCount()` |
| `chipintelli_asr_handler_capacity` | 值(Number) | (none) | `chipintelli_asr_handler_capacity()` | `ChipIntelliASR.handlerCapacity()` |
| `chipintelli_asr_last_error` | 值(Number) | (none) | `chipintelli_asr_last_error()` | `static_cast<uint8_t>(ChipIntelliASR.lastError())` |
| `chipintelli_asr_last_error_text` | 值(String) | (none) | `chipintelli_asr_last_error_text()` | `String(ChipIntelliASR.errorString(ChipIntelliASR.lastError()))` |
| `chipintelli_asr_aec_enabled` | 值(Boolean) | (none) | `chipintelli_asr_aec_enabled()` | `ChipIntelliASR.isAECEnabled()` |
| `chipintelli_asr_barge_in_enabled` | 值(Boolean) | (none) | `chipintelli_asr_barge_in_enabled()` | `ChipIntelliASR.isBargeInEnabled()` |
| `chipintelli_asr_barge_in_mode` | 值(Number) | (none) | `chipintelli_asr_barge_in_mode()` | `static_cast<uint8_t>(ChipIntelliASR.bargeInMode())` |
| `chipintelli_asr_barge_in_mode_value` | 值(Number) | MODE(dropdown) | `chipintelli_asr_barge_in_mode_value(0)` | `0` |

## Parameter Options

- `EVENT`: `STARTUP` 启动完成；`WAKEUP` 进入命令会话；`TIMEOUT` 命令会话超时。
- `HANDLERS`: `COMMANDS` 全部命令；`SEMANTICS` 全部语义；`ALL` 命令和语义。
- `MODE`: `0` 禁用；`1` 仅唤醒词；`2` 仅命令词；`3` 唤醒词和命令词。

## ABS Examples

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("智能管家")
    chipintelli_asr_set_wake_word("你好小智")
    serial_begin(Serial, 115200)

chipintelli_asr_on_wakeup()
    @HANDLER:
        chipintelli_asr_keep_awake_for(math_number(15))

chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))
    @HANDLER:
        serial_println(Serial, chipintelli_asr_result_text())
```

生成代码会创建独立回调，把完整 `ChipIntelliASRResult` 复制到当前结果变量，在 setup 末尾调用 `attachWakeup()` / `attachCommand()`，并且只向 loop 添加一次 `ChipIntelliASR.tick()`。

### Polling Alternative

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("智能管家")
    serial_begin(Serial, 115200)

arduino_loop()
    chipintelli_asr_read_results()
        @HANDLER:
            serial_println(Serial, chipintelli_asr_result_text())
```

## Notes

1. 当前结果 Getter 应放在 `on_result`、`on_command` 或 `read_results` 的 HANDLER 内。
2. `onResult()` 观察每个识别结果；命令处理函数按命令 ID 精确匹配。
3. 事件积木使用 `tick()`，轮询积木使用 `read()`；二者消费同一结果队列，通常不要混用。
4. 第一个唤醒词固定使用命令 ID 1；后续唤醒词与普通命令共享从 ID 2 开始的编号空间。每个唤醒词积木独立生成宏，即使文本相同也不会合并；普通命令仍按文本去重。唤醒词积木会在自身位置生成 `setWakeWordEnabled(true)`，因此应放在初始化积木之后。
5. 初始化积木不会自动添加唤醒词宏，也不向用户暴露初始化等待时间；始终生成无参 `begin()`。
6. `keep_awake_for` 只在已经唤醒时按输入秒数重置命令响应窗口。15 秒只是工具箱自动连接的可编辑影子输入；如果程序中没有该积木，本库不会调用 `keepAwakeFor()`，实际窗口继续使用当前 CI13XX SDK/固件默认值，而本库文件没有声明该默认值。
7. 结果文本缓冲区容量为 64 字节；用 `result_text_truncated` 检查截断。
8. AEC 与语音打断能力由 Arduino 的编译时算法配置决定；相关 Getter 只报告当前编译配置，不会修改它。
9. `chipintelli_asr_on_semantic` 在 `block.json` 和 generator 中存在，但当前 `toolbox.json` 未列出；其 ABS 调用仍是有效的公开块调用。
