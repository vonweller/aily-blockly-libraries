# nRF54 Thread

Experimental OpenThread networking for nRF54 with roles, datasets, Commissioner, Joiner, and UDP.

## Library Info
- **Name**: @aily-project/lib-nrf54-thread
- **Version**: 0.6.81

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nrf54_thread_begin` | Statement | POLICY(dropdown), WIPE(dropdown) | `nrf54_thread_begin(begin, true)` | nrf54Thread. |
| `nrf54_thread_stop` | Statement | (none) | `nrf54_thread_stop()` | nrf54Thread.stop();\n |
| `nrf54_thread_restart` | Statement | WIPE(dropdown) | `nrf54_thread_restart(true)` | nrf54Thread.restart( |
| `nrf54_thread_wipe_settings` | Statement | (none) | `nrf54_thread_wipe_settings()` | nrf54Thread.wipePersistentSettings();\n |
| `nrf54_thread_use_demo_dataset` | Statement | (none) | `nrf54_thread_use_demo_dataset()` | nrf54ThreadUseDemoDataset();\n |
| `nrf54_thread_set_dataset_hex` | Statement | DATASET(input_value) | `nrf54_thread_set_dataset_hex(text("value"))` | nrf54Thread.setActiveDatasetHex(String( |
| `nrf54_thread_set_router_eligible` | Statement | ENABLED(dropdown) | `nrf54_thread_set_router_eligible(true)` | nrf54Thread.setRouterEligible( |
| `nrf54_thread_request_router` | Statement | (none) | `nrf54_thread_request_router()` | nrf54Thread.requestRouterRole();\n |
| `nrf54_thread_set_poll_period` | Statement | POLL_MS(input_value) | `nrf54_thread_set_poll_period(math_number(1000))` | nrf54Thread.setPollPeriod((uint32_t)( |
| `nrf54_thread_started` | Value | (none) | `nrf54_thread_started()` | nrf54Thread.started() |
| `nrf54_thread_attached` | Value | (none) | `nrf54_thread_attached()` | nrf54Thread.attached() |
| `nrf54_thread_role_name` | Value | (none) | `nrf54_thread_role_name()` | String(nrf54Thread.roleName()) |
| `nrf54_thread_rloc16` | Value | (none) | `nrf54_thread_rloc16()` | nrf54Thread.rloc16() |
| `nrf54_thread_partition_id` | Value | (none) | `nrf54_thread_partition_id()` | nrf54Thread.partitionId() |
| `nrf54_thread_dataset_configured` | Value | (none) | `nrf54_thread_dataset_configured()` | nrf54Thread.datasetConfigured() |
| `nrf54_thread_last_error` | Value | (none) | `nrf54_thread_last_error()` | (int)nrf54Thread.lastError() |
| `nrf54_thread_commissioner_start` | Statement | (none) | `nrf54_thread_commissioner_start()` | nrf54Thread.startCommissioner();\n |
| `nrf54_thread_commissioner_stop` | Statement | (none) | `nrf54_thread_commissioner_stop()` | nrf54Thread.stopCommissioner();\n |
| `nrf54_thread_commissioner_add_joiner` | Statement | PSKD(input_value), SECONDS(input_value) | `nrf54_thread_commissioner_add_joiner(text("value"), math_number(0))` | nrf54Thread.addJoinerToCommissioner(String( |
| `nrf54_thread_commissioner_active` | Value | (none) | `nrf54_thread_commissioner_active()` | nrf54Thread.commissionerActive() |
| `nrf54_thread_joiner_start` | Statement | PSKD(input_value) | `nrf54_thread_joiner_start(text("value"))` | nrf54Thread.startJoiner(String( |
| `nrf54_thread_joiner_stop` | Statement | (none) | `nrf54_thread_joiner_stop()` | nrf54Thread.stopJoiner();\n |
| `nrf54_thread_joiner_active` | Value | (none) | `nrf54_thread_joiner_active()` | nrf54Thread.joinerActive() |
| `nrf54_thread_joiner_state` | Value | (none) | `nrf54_thread_joiner_state()` | String(nrf54Thread.joinerStateName()) |
| `nrf54_thread_open_udp` | Statement | LOCAL_PORT(input_value), HANDLER(input_statement) | `nrf54_thread_open_udp(math_number(0)) @HANDLER: child_block()` | nrf54Thread.openUdp((uint16_t)( |
| `nrf54_thread_close_udp` | Statement | LOCAL_PORT(input_value) | `nrf54_thread_close_udp(math_number(0))` | nrf54Thread.closeUdp((uint16_t)( |
| `nrf54_thread_send_udp` | Value | LOCAL_PORT(input_value), PEER_ADDRESS(input_value), PEER_PORT(input_value), DATA(input_value) | `nrf54_thread_send_udp(math_number(0), text("value"), math_number(0), text("value"))` | nrf54ThreadSendUdp((uint16_t)( |
| `nrf54_thread_udp_data` | Value | (none) | `nrf54_thread_udp_data()` | nrf54ThreadUdpData |
| `nrf54_thread_udp_peer_address` | Value | (none) | `nrf54_thread_udp_peer_address()` | nrf54ThreadUdpPeerAddress |
| `nrf54_thread_udp_peer_port` | Value | (none) | `nrf54_thread_udp_peer_port()` | nrf54ThreadUdpPeerPort |
| `nrf54_thread_on_state_changed` | Hat | HANDLER(input_statement) | `nrf54_thread_on_state_changed() @HANDLER: child_block()` | Dynamic code |
| `nrf54_thread_callback_role` | Value | (none) | `nrf54_thread_callback_role()` | nrf54ThreadCallbackRole |
| `nrf54_thread_callback_flags` | Value | (none) | `nrf54_thread_callback_flags()` | nrf54ThreadCallbackFlags |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| POLICY | begin, beginAsChild, beginAsRouter, beginChildFirst, beginJoinerOnly, beginAsSleepyChild | nrf54_thread_begin |
| WIPE | true, false | nrf54_thread_begin, nrf54_thread_restart |
| ENABLED | true, false | nrf54_thread_set_router_eligible |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nrf54_thread_begin(begin, true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nrf54_thread_started())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Board option**: select `Tools > Thread Core > Experimental Stage Core (Leader/Child/Router + UDP)` before compiling.
