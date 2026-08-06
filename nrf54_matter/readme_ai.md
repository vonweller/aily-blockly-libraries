# nRF54 Matter

Thread-based nRF54 Matter On/Off Light node with commissioning and persistent state control.

## Library Info
- **Name**: @aily-project/lib-nrf54-matter
- **Version**: 0.6.81

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_matter_begin` | Statement | DEMO(dropdown), WIPE(dropdown), ROUTER(dropdown), AUTO_WINDOW(dropdown), SECONDS(input_value) | `nrf54_matter_begin(true, true, true, true, math_number(0))` | nrf54MatterConfig.useDemoDataset = |
| `nrf54_matter_end` | Statement | (none) | `nrf54_matter_end()` | nrf54Matter.end();\n |
| `nrf54_matter_use_demo_dataset` | Statement | (none) | `nrf54_matter_use_demo_dataset()` | nrf54Matter.useDemoThreadDataset();\n |
| `nrf54_matter_set_dataset_hex` | Statement | DATASET(input_value), PERSIST(dropdown) | `nrf54_matter_set_dataset_hex(text("value"), true)` | nrf54Matter.useThreadDatasetHex(String( |
| `nrf54_matter_factory_reset` | Statement | (none) | `nrf54_matter_factory_reset()` | nrf54Matter.factoryReset();\n |
| `nrf54_matter_ready` | Value | (none) | `nrf54_matter_ready()` | nrf54Matter.readyForOnNetworkCommissioning() |
| `nrf54_matter_open_window` | Statement | SECONDS(input_value) | `nrf54_matter_open_window(math_number(0))` | nrf54Matter.openCommissioningWindow((uint16_t)( |
| `nrf54_matter_close_window` | Statement | (none) | `nrf54_matter_close_window()` | nrf54Matter.closeCommissioningWindow();\n |
| `nrf54_matter_window_open` | Value | (none) | `nrf54_matter_window_open()` | nrf54Matter.commissioningWindowOpen() |
| `nrf54_matter_window_remaining` | Value | (none) | `nrf54_matter_window_remaining()` | nrf54Matter.commissioningWindowSecondsRemaining() |
| `nrf54_matter_manual_code` | Value | (none) | `nrf54_matter_manual_code()` | nrf54MatterManualCode() |
| `nrf54_matter_qr_code` | Value | (none) | `nrf54_matter_qr_code()` | nrf54MatterQrCode() |
| `nrf54_matter_light_set` | Statement | ON(dropdown), PERSIST(dropdown) | `nrf54_matter_light_set(true, true)` | nrf54Matter.light().setOn( |
| `nrf54_matter_light_toggle` | Statement | PERSIST(dropdown) | `nrf54_matter_light_toggle(true)` | nrf54Matter.light().toggle( |
| `nrf54_matter_light_is_on` | Value | (none) | `nrf54_matter_light_is_on()` | nrf54Matter.light().on() |
| `nrf54_matter_light_set_level` | Statement | LEVEL(input_value), PERSIST(dropdown) | `nrf54_matter_light_set_level(math_number(0), true)` | nrf54Matter.light().setLevel((uint8_t)( |
| `nrf54_matter_light_move_level` | Statement | LEVEL(input_value), TRANSITION_MS(input_value) | `nrf54_matter_light_move_level(math_number(0), math_number(1000))` | nrf54Matter.light().moveToLevel((uint8_t)( |
| `nrf54_matter_light_level` | Value | (none) | `nrf54_matter_light_level()` | nrf54Matter.light().level() |
| `nrf54_matter_identify` | Statement | IDENTIFY_SECONDS(input_value) | `nrf54_matter_identify(math_number(0))` | nrf54Matter.light().setIdentifyTimeSeconds((uint16_t)( |
| `nrf54_matter_stop_identify` | Statement | (none) | `nrf54_matter_stop_identify()` | nrf54Matter.light().stopIdentify();\n |
| `nrf54_matter_identifying` | Value | (none) | `nrf54_matter_identifying()` | nrf54Matter.light().identifying() |
| `nrf54_matter_startup_behavior` | Statement | BEHAVIOR(dropdown), PERSIST(dropdown) | `nrf54_matter_startup_behavior(kForceOff, true)` | nrf54Matter.light().setStartUpBehavior(MatterOnOffLightStartUpBehavior:: |
| `nrf54_matter_save_state` | Statement | (none) | `nrf54_matter_save_state()` | nrf54Matter.light().savePersistentState();\n |
| `nrf54_matter_clear_state` | Statement | (none) | `nrf54_matter_clear_state()` | nrf54Matter.light().clearPersistentState();\n |
| `nrf54_matter_on_light_change` | Hat | HANDLER(input_statement) | `nrf54_matter_on_light_change() @HANDLER: child_block()` | Dynamic code |
| `nrf54_matter_on_identify_change` | Hat | HANDLER(input_statement) | `nrf54_matter_on_identify_change() @HANDLER: child_block()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DEMO | true, false | nrf54_matter_begin |
| WIPE | true, false | nrf54_matter_begin |
| ROUTER | true, false | nrf54_matter_begin |
| AUTO_WINDOW | true, false | nrf54_matter_begin |
| PERSIST | true, false | nrf54_matter_set_dataset_hex, nrf54_matter_light_set, nrf54_matter_light_toggle |
| ON | true, false | nrf54_matter_light_set |
| BEHAVIOR | kForceOff, kForceOn, kTogglePrevious, kRestorePrevious | nrf54_matter_startup_behavior |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_matter_begin(true, true, true, true, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_matter_ready())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Board options**: enable the experimental Thread Core and Matter Foundation compile target before compiling.
