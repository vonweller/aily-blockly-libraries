# ChipIntelliAudio

为 CI13XX 播放文本提示音或本地音频。需要播放文本时，直接使用 `chipintelli_audio_play_voice`，并将 `chipintelli_audio_voice` 作为其提示音输入。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-audio`
- **版本**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_audio_init` | 语句 | LANGUAGE(dropdown) | `chipintelli_audio_init("CHIPINTELLI_LANGUAGE_EN")` | 先生成 `#define CHIPINTELLI_LANGUAGE CHIPINTELLI_LANGUAGE_EN`，再引入音频库并调用 `ChipIntelliAudio.begin()` |
| `chipintelli_audio_end` | 语句 | 无 | `chipintelli_audio_end()` | `ChipIntelliAudio.end()` |
| `chipintelli_audio_voice_settings` | 语句 | VOICE_ROLE(dropdown), VOICE_VOLUME(field_number), VOICE_SPEED(field_number) | `chipintelli_audio_voice_settings("小小-伶俐女声", 10, 10)` | 添加供资源生成器读取的音色、音量和语速配置注释 |
| `chipintelli_audio_voice` | 值(Number) | TEXT(field_input) | `chipintelli_audio_voice("你好")` | `VOICE1`，并添加 `#define VOICE1 1 //你好` |
| `chipintelli_audio_local_audio` | 值(Number) | AUDIO(field_audio) | 由 Blockly 字段保存音频工程数据 | `VOICEMP3500`，并添加 `#define VOICEMP3500 500 //audio/<内容哈希>.mp3` |
| `chipintelli_audio_play_voice` | 语句 | VOICE_ID(value, Number；仅允许 `chipintelli_audio_voice`、`chipintelli_audio_local_audio` 或数值型变量), MODE(dropdown) | `chipintelli_audio_play_voice(chipintelli_audio_voice("你好"), true)` | 提示音/本地音频：`playVoice((uint16_t)(id), interrupt)`；数值变量：`playVoice(String(value), interrupt)` |
| `chipintelli_audio_stop` | 语句 | 无 | `chipintelli_audio_stop()` | `stop()` |
| `chipintelli_audio_set_volume` | 语句 | VOLUME(value) | `chipintelli_audio_set_volume(math_number(70))` | `setVolume(...)` |
| `chipintelli_audio_set_muted` | 语句 | MUTED(value) | `chipintelli_audio_set_muted(logic_boolean(TRUE))` | `setMuted(...)` |
| `chipintelli_audio_is_ready` | 值(Boolean) | 无 | `chipintelli_audio_is_ready()` | `isReady()` |
| `chipintelli_audio_is_playing` | 值(Boolean) | 无 | `chipintelli_audio_is_playing()` | `isPlaying()` |
| `chipintelli_audio_volume` | 值(Number) | 无 | `chipintelli_audio_volume()` | `volume()` |
| `chipintelli_audio_is_muted` | 值(Boolean) | 无 | `chipintelli_audio_is_muted()` | `isMuted()` |
| `chipintelli_audio_on_finished` | Hat | HANDLER(statement) | `chipintelli_audio_on_finished() @HANDLER: ...` | 安全转发到 `loop()` |

## Parameter Options

- `LANGUAGE`：在初始化块中选择数值变量播报语言。可选中文（ZH）、英语（EN）、日语（JA）、韩语（KO）、俄语（RU）、西班牙语（ES）、泰语（TH）、德语（DE）、印度尼西亚语（ID）、越南语（VI）、法语（FR）、葡萄牙语（巴西，PT）、波斯语（FA）、土耳其语（TR）和阿拉伯语（现代标准语，AR）。生成器输出 `#define CHIPINTELLI_LANGUAGE CHIPINTELLI_LANGUAGE_*` 并确保其位于 `#include <ChipIntelliAudio.h>` 之前；字段无效时安全回退为 `#define CHIPINTELLI_LANGUAGE CHIPINTELLI_LANGUAGE_ZH`。
- `VOICE_ID`（必须遵守）：只能使用 `chipintelli_audio_voice(...)`、`chipintelli_audio_local_audio` 的输出，或已声明为数值类型的变量。禁止传入字符串字面量、`text(...)`、`String`/字符串类型变量。需要播放文字提示音时，应使用 `chipintelli_audio_voice("提示音文本")`；需要播报运行时数字时，应传入数值型变量。
- `VOICE_ID` 的生成规则：连接 `chipintelli_audio_voice` 或 `chipintelli_audio_local_audio` 时，按 16 位语音 ID 调用 `playVoice`；连接 `variables_get`/`variables_get_dynamic` 数值变量时，生成器自动使用 `String(variable)` 转换，并调用底层数字字符串重载。
- `VOICE_ROLE`：选择生成提示音所用音色；`VOICE_VOLUME` 和 `VOICE_SPEED` 的范围均为 0～20，默认值为 10。
- `MODE=true`：中断当前提示音；`MODE=false`：加入 SDK 播放队列。
- 本地音频默认转换为 16 kHz、单声道、16 kbps MP3；可在音频编辑器中调整转换参数和裁剪区间。
- 本地音频 ID 从 500 开始。宏注释使用裁剪压缩后 MP3 相对项目目录的 `audioPath`；路径相同时复用同一个 ID 和宏。

## ABS 示例

```text
arduino_setup()
    chipintelli_audio_init("CHIPINTELLI_LANGUAGE_ZH")
    chipintelli_audio_set_volume(math_number(70))
    chipintelli_audio_play_voice(chipintelli_audio_voice("你好"), true)

    variable_define("number", int, math_number(300))
    chipintelli_audio_play_voice(variables_get(variables_get($number)), true)

chipintelli_audio_on_finished()
    @HANDLER:
        serial_println(Serial, text("提示音请求完成"))
```

## 注意事项

1. 播放文本提示音时，直接将 `chipintelli_audio_voice("文本")` 接入 `chipintelli_audio_play_voice`；播放本地音频时，将 `chipintelli_audio_local_audio` 接入同一个播放块。
2. 完成事件表示 SDK 已处理完请求，不保证资源查找或实际播放成功。
3. 先在 `arduino_setup()` 中初始化；事件处理代码在主 `loop()` 中执行。
4. `chipintelli_audio_play_voice` 会根据输入来源选择底层重载：提示音/本地音频使用 `ChipIntelliAudio.playVoice(uint16_t, bool)`；数值型变量先转换为 `String`，再使用 `ChipIntelliAudio.playVoice(const String &, bool)`。
5. 数值变量用于按初始化块所选语言拼接播报运行时十进制数值，例如整数 `300` 会转换为 `String(300)` 并播报“三百”。数字字符串重载不是任意文本 TTS，不接受科学计数法。
6. 不要把字符串变量传给 `chipintelli_audio_play_voice`。即使字符串内容是 `"300"`，AI 也应改用数值型变量；生成器只对数值变量执行自动 `String(...)` 转换。
