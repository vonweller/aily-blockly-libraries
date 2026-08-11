# ChipIntelliAudio

Plays generated voice prompts or project-local audio on CI13XX devices. Use `chipintelli_audio_voice` for fixed prompt text and pass its numeric output to `chipintelli_audio_play_voice`.

## Library Info

- **Name**: `@aily-project/lib-chipintelli-audio`
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_audio_init` | Statement | LANGUAGE(dropdown) | `chipintelli_audio_init("CHIPINTELLI_LANGUAGE_EN")` | `ChipIntelliAudio.begin();` |
| `chipintelli_audio_end` | Statement | (none) | `chipintelli_audio_end()` | `ChipIntelliAudio.end();` |
| `chipintelli_audio_voice_settings` | Statement | VOICE_ROLE(dropdown), VOICE_VOLUME(field_number), VOICE_SPEED(field_number) | `chipintelli_audio_voice_settings("小小-伶俐女声", 10, 10)` | `//VOICE_ROLE:"小小-伶俐女声";VOICE_VOLUME:10;VOICE_SPEED:10;` |
| `chipintelli_audio_voice` | Value | TEXT(field_input) | `chipintelli_audio_voice("Hello")` | `VOICE1` |
| `chipintelli_audio_local_audio` | Value | AUDIO(field_audio) | `chipintelli_audio_local_audio({"audioPath":""})` | `0` |
| `chipintelli_audio_play_voice` | Statement | VOICE_ID(input_value), MODE(dropdown) | `chipintelli_audio_play_voice(chipintelli_audio_voice("Hello"), true)` | `ChipIntelliAudio.playVoice((uint16_t)(1), true);` |
| `chipintelli_audio_stop` | Statement | (none) | `chipintelli_audio_stop()` | `ChipIntelliAudio.stop();` |
| `chipintelli_audio_set_volume` | Statement | VOLUME(input_value) | `chipintelli_audio_set_volume(math_number(70))` | `ChipIntelliAudio.setVolume((uint8_t)constrain((int)(1), 0, 100));` |
| `chipintelli_audio_set_muted` | Statement | MUTED(input_value) | `chipintelli_audio_set_muted(logic_boolean(TRUE))` | `ChipIntelliAudio.setMuted((bool)(true));` |
| `chipintelli_audio_is_ready` | Value | (none) | `chipintelli_audio_is_ready()` | `ChipIntelliAudio.isReady()` |
| `chipintelli_audio_is_playing` | Value | (none) | `chipintelli_audio_is_playing()` | `ChipIntelliAudio.isPlaying()` |
| `chipintelli_audio_volume` | Value | (none) | `chipintelli_audio_volume()` | `ChipIntelliAudio.volume()` |
| `chipintelli_audio_is_muted` | Value | (none) | `chipintelli_audio_is_muted()` | `ChipIntelliAudio.isMuted()` |
| `chipintelli_audio_on_finished` | Hat | HANDLER(input_statement) | `chipintelli_audio_on_finished()` | `volatile bool ailyChipIntelliAudioFinished = false; ↵ void ailyChipIntelliAudioFinishedCallback(void *context) { ↵ (void)context; ↵ ailyChipIntelliAudioFinished = true; ↵ } ↵ void ailyChipIntelliAudioFinishedHandler() { ↵ } ↵ ChipIntelliAudio.onFinished(ailyChipIntelliAudioFinishedCallback); ↵ if (ailyChipIntelliAudioFinished) { ↵ ailyChipIntelliAudioFinished = false; ↵ ailyChipIntelliAudioFinishedHandler(); ↵ }` |

## Parameter Options

- `LANGUAGE` selects the language used when speaking numeric variables. Supported values cover Chinese, English, Japanese, Korean, Russian, Spanish, Thai, German, Indonesian, Vietnamese, French, Portuguese, Persian, Turkish, and Arabic. The generator emits `CHIPINTELLI_LANGUAGE_*` before the library include and falls back to Chinese for an invalid value.
- `VOICE_ID` must be the output of `chipintelli_audio_voice(...)`, the output of a configured `chipintelli_audio_local_audio(...)`, or a declared numeric variable. Do not pass text literals, `text(...)`, or string variables.
- A prompt or local-audio block uses `playVoice(uint16_t, bool)`. A numeric variable is converted with `String(value)` and uses `playVoice(const String &, bool)`.
- `VOICE_ROLE` selects the generated voice. `VOICE_VOLUME` and `VOICE_SPEED` range from 0 to 20 and default to 10.
- `MODE=true` interrupts the current prompt; `MODE=false` queues the request.
- Local audio defaults to 16 kHz, mono, 16 kbps MP3. The audio editor can change conversion and trimming settings.
- Local-audio IDs start at 500. The macro comment stores the converted MP3 path relative to the project, and identical paths reuse the same ID.

## ABS Examples

```abs
arduino_setup()
    chipintelli_audio_init("CHIPINTELLI_LANGUAGE_EN")
    chipintelli_audio_set_volume(math_number(70))
    chipintelli_audio_play_voice(chipintelli_audio_voice("System ready"), true)

    variable_define("number", int, math_number(300))
    chipintelli_audio_play_voice($number, true)

chipintelli_audio_on_finished()
    @HANDLER:
        serial_println(Serial, text("Voice request completed"))
```

## Notes

1. Configure local audio in its Blockly audio editor before using its output; the empty JSON state in the signature means that no project audio has been selected and generates `0`.
2. The completion event means the SDK finished handling the request. It does not guarantee that a resource was found or physically played.
3. Initialize in `arduino_setup()`. The completion handler is dispatched from the main `loop()`.
4. Numeric variables speak runtime decimal values in the selected language. This overload is not arbitrary text-to-speech and does not accept scientific notation.
5. Never pass a string variable to `chipintelli_audio_play_voice`; use a numeric variable for runtime numbers or `chipintelli_audio_voice` for fixed text.
