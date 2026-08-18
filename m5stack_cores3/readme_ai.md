# CoreS3 Onboard Sensors

## Library Info
- **Name**: @aily-project/lib-m5stack-cores3
- **Version**: 0.1.0
- **Official source**: M5CoreS3 1.0.1

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5cores3_ltr_init` | Statement | `m5cores3_ltr_init()` |
| `m5cores3_ltr_available` | Boolean | `m5cores3_ltr_available()` |
| `m5cores3_ltr_value` | Number | `m5cores3_ltr_value(PROXIMITY)` |
| `m5cores3_camera_init` | Statement | `m5cores3_camera_init()` |
| `m5cores3_camera_available` | Boolean | `m5cores3_camera_available()` |
| `m5cores3_camera_capture_display` | Boolean | `m5cores3_camera_capture_display()` |

Do not combine camera initialization with LTR access: the official GC0308 driver releases M5Unified's internal I2C bus for SCCB ownership.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `m5cores3_ltr_init` | Statement | (none) | `m5cores3_ltr_init()` | `auto ailyM5Config = M5.config(); ↵ M5.begin(ailyM5Config); ↵ M5.update(); ↵ bool ailyM5CoreS3LTRReady = false; ↵ bool ailyM5CoreS3LTRBegin() { ↵ Ltr5xx_Init_Basic_Para config = LTR5XX_BASE_PARA_CONFIG_DEFAULT; ↵ if (!CoreS3.Ltr553.begin(&config)) return false; ↵ return CoreS3.Ltr553.setPsMode(LTR5XX_PS_ACTIVE_MODE) && CoreS3.Ltr553.setAlsMode(LTR5XX_ALS_ACTIVE_MODE); ↵ } ↵ ailyM5CoreS3LTRReady = ailyM5CoreS3LTRBegin();` |
| `m5cores3_ltr_available` | Value | (none) | `m5cores3_ltr_available()` | `ailyM5CoreS3LTRReady` |
| `m5cores3_ltr_value` | Value | VALUE(dropdown) | `m5cores3_ltr_value(PROXIMITY)` | `(ailyM5CoreS3LTRReady ? CoreS3.Ltr553.getPsValue() : 0)` |
| `m5cores3_camera_init` | Statement | (none) | `m5cores3_camera_init()` | `auto ailyM5Config = M5.config(); ↵ M5.begin(ailyM5Config); ↵ M5.update(); ↵ bool ailyM5CoreS3CameraReady = false; ↵ ailyM5CoreS3CameraReady = CoreS3.Camera.begin();` |
| `m5cores3_camera_available` | Value | (none) | `m5cores3_camera_available()` | `ailyM5CoreS3CameraReady` |
| `m5cores3_camera_capture_display` | Value | (none) | `m5cores3_camera_capture_display()` | `ailyM5CoreS3CameraCaptureDisplay()` |
## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | PROXIMITY, AMBIENT | m5cores3_ltr_value |

## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    m5cores3_ltr_init()
```
