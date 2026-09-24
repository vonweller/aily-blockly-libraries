# Source provenance

Converted from the user-provided `D:\Git\xiaozhi\xiaozhi-arduino` checkout.

- Upstream Arduino library version: **2.4.0**.
- Source commit: `23526e5e02f432ef92a3b3fc95dad5b51288ecac` (clean at import).
- Source metadata URL: https://github.com/78/xiaozhi-esp32 (the upstream project, not a claim that its ESP-IDF tree is the imported Arduino package).
- `src/Xiaozhi/` preserves the source tree, metadata and MIT license, with one existing local adaptation: free functions and out-of-class method definitions in `I2sOpusAudioPort.impl.h` are marked `inline`. The other 40 upstream source files match the referenced checkout byte for byte. The audio entry still belongs in one sketch translation unit.
- `src/AilyXiaozhi/` adds the aily lifecycle/event adapter under MIT.
- Audio dependencies are copied from upstream `extras/arduino-libraries/`.
- Network/JSON dependencies are copied from the locally installed Arduino libraries.

| Packaged Arduino library | Version | License |
|---|---|---|
| Xiaozhi | 2.4.0 | MIT |
| AilyXiaozhi | 1.0.0 | MIT |
| ArduinoJson | 7.4.3 | MIT |
| ArduinoWebsockets | 0.5.4 | GPL-3.0 (see its LICENSE) |
| EspressifOpus | 2.2.1 | See bundled LICENSE |
| EspressifEs8311 | 1.5.6 | Apache-2.0 |

`src.7z` contains `src/` with these six sibling Arduino library directories. Extract it in `xiaozhi/`. The repository ignores expanded `src/`, so the archive is the distributable source. Original sketches, credentials, build caches and model binaries are excluded. Bundled Opus contains the ESP32-S3 binary only. The archive preserves each dependency's license; the adapter's MIT license does not replace dependency licenses.
