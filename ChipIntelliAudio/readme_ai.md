# ChipIntelliAudio

播放 CI13XX `voice.bin` 中已配置的提示音。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-audio`
- **版本**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_audio_init` | 语句 | 无 | `chipintelli_audio_init()` | `ChipIntelliAudio.begin()` |
| `chipintelli_audio_end` | 语句 | 无 | `chipintelli_audio_end()` | `ChipIntelliAudio.end()` |
| `chipintelli_audio_play_voice` | 语句 | VOICE_ID(value), MODE(dropdown) | `chipintelli_audio_play_voice(math_number(1), true)` | `playVoice(id, interrupt)` |
| `chipintelli_audio_play_command_id` | 语句 | COMMAND_ID(value), OPTION(value), MODE(dropdown) | `chipintelli_audio_play_command_id(math_number(1), math_number(-1), true)` | `playCommand(id, option, interrupt)` |
| `chipintelli_audio_play_command_text` | 语句 | COMMAND_TEXT(value), OPTION(value), MODE(dropdown) | `chipintelli_audio_play_command_text(text("命令"), math_number(-1), true)` | `playCommand(text, option, interrupt)` |
| `chipintelli_audio_play_semantic` | 语句 | SEMANTIC_ID(value), OPTION(value), MODE(dropdown) | `chipintelli_audio_play_semantic(math_number(1), math_number(-1), true)` | `playSemantic(...)` |
| `chipintelli_audio_stop` | 语句 | 无 | `chipintelli_audio_stop()` | `stop()` |
| `chipintelli_audio_set_volume` | 语句 | VOLUME(value) | `chipintelli_audio_set_volume(math_number(70))` | `setVolume(...)` |
| `chipintelli_audio_set_muted` | 语句 | MUTED(value) | `chipintelli_audio_set_muted(logic_boolean(TRUE))` | `setMuted(...)` |
| `chipintelli_audio_is_ready` | 值(Boolean) | 无 | `chipintelli_audio_is_ready()` | `isReady()` |
| `chipintelli_audio_is_playing` | 值(Boolean) | 无 | `chipintelli_audio_is_playing()` | `isPlaying()` |
| `chipintelli_audio_volume` | 值(Number) | 无 | `chipintelli_audio_volume()` | `volume()` |
| `chipintelli_audio_is_muted` | 值(Boolean) | 无 | `chipintelli_audio_is_muted()` | `isMuted()` |
| `chipintelli_audio_on_finished` | Hat | HANDLER(statement) | `chipintelli_audio_on_finished() @HANDLER: ...` | 安全转发到 `loop()` |

## Parameter Options

- `MODE=true`：中断当前提示音；`MODE=false`：加入 SDK 播放队列。
- `OPTION=-1`：使用资源中配置的默认提示音选项。

## ABS 示例

```text
arduino_setup()
    chipintelli_audio_init()
    chipintelli_audio_set_volume(math_number(70))
    chipintelli_audio_play_voice(math_number(1), true)

chipintelli_audio_on_finished()
    @HANDLER:
        serial_println(Serial, text("提示音请求完成"))
```

## 注意事项

1. 只能播放固件资源中已有的提示音，不能播放任意文本或 SD 卡音频。
2. 完成事件表示 SDK 已处理完请求，不保证资源查找或实际播放成功。
3. 先在 `arduino_setup()` 中初始化；事件处理代码在主 `loop()` 中执行。
