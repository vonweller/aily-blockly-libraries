# ChipIntelliASR

CI13XX 离线语音识别结果队列与算法配置诊断积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-asr`
- **版本**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_asr_init` | 语句 | TIMEOUT(value) | `chipintelli_asr_init(math_number(10000))` | `ChipIntelliASR.begin(timeout)` |
| `chipintelli_asr_end` | 语句 | 无 | `chipintelli_asr_end()` | `end()` |
| `chipintelli_asr_read_results` | 语句 | HANDLER(statement) | `chipintelli_asr_read_results() @HANDLER: ...` | `while (read(result))` |
| `chipintelli_asr_available` | 值(Boolean) | 无 | `chipintelli_asr_available()` | `available()` |
| `chipintelli_asr_result_command_id` | 值(Number) | 无 | `chipintelli_asr_result_command_id()` | `result.commandId` |
| `chipintelli_asr_result_semantic_id` | 值(Number) | 无 | `chipintelli_asr_result_semantic_id()` | `result.semanticId` |
| `chipintelli_asr_result_score` | 值(Number) | 无 | `chipintelli_asr_result_score()` | `result.score` |
| `chipintelli_asr_result_frames` | 值(Number) | 无 | `chipintelli_asr_result_frames()` | `result.frames` |
| `chipintelli_asr_result_text` | 值(String) | 无 | `chipintelli_asr_result_text()` | `String(result.text)` |
| `chipintelli_asr_result_text_truncated` | 值(Boolean) | 无 | `chipintelli_asr_result_text_truncated()` | `result.textTruncated` |
| `chipintelli_asr_dropped_results` | 值(Number) | 无 | `chipintelli_asr_dropped_results()` | `droppedResults()` |
| `chipintelli_asr_aec_enabled` | 值(Boolean) | 无 | `chipintelli_asr_aec_enabled()` | `isAECEnabled()` |
| `chipintelli_asr_barge_in_enabled` | 值(Boolean) | 无 | `chipintelli_asr_barge_in_enabled()` | `isBargeInEnabled()` |
| `chipintelli_asr_barge_in_mode` | 值(Number) | 无 | `chipintelli_asr_barge_in_mode()` | `bargeInMode()` |
| `chipintelli_asr_barge_in_mode_value` | 值(Number) | MODE(dropdown) | `chipintelli_asr_barge_in_mode_value(3)` | 常量 0～3 |

## Parameter Options

`MODE`: `0` 禁用、`1` 仅唤醒词、`2` 仅命令词、`3` 唤醒词和命令词。

## ABS 示例

```text
arduino_setup()
    chipintelli_asr_init(math_number(10000))

arduino_loop()
    chipintelli_asr_read_results()
        @HANDLER:
            serial_println(Serial, chipintelli_asr_result_command_id())
            serial_println(Serial, chipintelli_asr_result_text())
```

## 注意事项

1. 当前结果 Getter 应放在 `chipintelli_asr_read_results` 的 `HANDLER` 内。
2. 结果文本缓冲区为 64 字节，使用截断状态积木检测超长文本。
3. AEC/语音打断行为由 Arduino “算法配置”菜单在编译时决定。
