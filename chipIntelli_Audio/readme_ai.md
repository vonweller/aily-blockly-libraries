# ChipIntelliAudio

为 CI13XX 播放文本提示音或本地音频。需要播放文本时，直接使用 `chipintelli_audio_play_voice`，并将 `chipintelli_audio_voice` 作为其提示音输入。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-audio`
- **版本**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_audio_init` | 语句 | 无 | `chipintelli_audio_init()` | `ChipIntelliAudio.begin()` |
| `chipintelli_audio_end` | 语句 | 无 | `chipintelli_audio_end()` | `ChipIntelliAudio.end()` |
| `chipintelli_audio_voice` | 值(Number) | TEXT(field_input) | `chipintelli_audio_voice("你好")` | `VOICE1`，并添加 `#define VOICE1 1 //你好` |
| `chipintelli_audio_local_audio` | 值(Number) | AUDIO(field_audio) | 由 Blockly 字段保存音频工程数据 | `VOICEMP3500`，并添加 `#define VOICEMP3500 500 //audio/<内容哈希>.mp3` |
| `chipintelli_audio_play_voice` | 语句 | VOICE_ID(value), MODE(dropdown) | `chipintelli_audio_play_voice(chipintelli_audio_voice("你好"), true)` | `playVoice(id, interrupt)` |
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
- 本地音频默认转换为 16 kHz、单声道、16 kbps MP3；可在音频编辑器中调整转换参数和裁剪区间。
- 本地音频 ID 从 500 开始。宏注释使用裁剪压缩后 MP3 相对项目目录的 `audioPath`；路径相同时复用同一个 ID 和宏。

## ABS 示例

```text
arduino_setup()
    chipintelli_audio_init()
    chipintelli_audio_set_volume(math_number(70))
    chipintelli_audio_play_voice(chipintelli_audio_voice("你好"), true)

chipintelli_audio_on_finished()
    @HANDLER:
        serial_println(Serial, text("提示音请求完成"))
```

## 注意事项

1. 播放文本提示音时，直接将 `chipintelli_audio_voice("文本")` 接入 `chipintelli_audio_play_voice`；播放本地音频时，将 `chipintelli_audio_local_audio` 接入同一个播放块。
2. 完成事件表示 SDK 已处理完请求，不保证资源查找或实际播放成功。
3. 先在 `arduino_setup()` 中初始化；事件处理代码在主 `loop()` 中执行。
