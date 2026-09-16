# ESPLink BLE

ArduinoBLE central and peripheral for a host board without radio; GATT runs on the host and the radio on an ESP32-C3 controller.

## Library Info
- **Name**: @aily-project/lib-esplink-ble
- **Version**: 1.0.0

Every BLE block adds the library reference `#include <BLE.h>`, which also pulls in ESPLink; the C3 link blocks (`esplink_begin` and the rest of the `esplink_*` group) add `#include <ESPLink.h>` directly. The Generated Code column lists the code each block emits at its own position, plus any extra fragment it writes elsewhere, marked as `object:`, `function:`, `setup:` or `loop:`.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esplink_ble_begin` | Statement | (none) | `esplink_ble_begin()` | setup begin: `Serial.begin(9600);` ↵ loop: `BLE.poll();` ↵ `if (!BLE.begin()) {` ↵ `  Serial.print("BLE启动失败，错误码=");` ↵ `  Serial.println(BLEESPLink.lastError());` ↵ `}` |
| `esplink_ble_end` | Statement | (none) | `esplink_ble_end()` | `BLE.end();` |
| `esplink_ble_poll` | Statement | (none) | `esplink_ble_poll()` | `BLE.poll();` |
| `esplink_ble_connected` | Value (Boolean) | (none) | `esplink_ble_connected()` | `BLE.connected()` |
| `esplink_ble_address` | Value (String) | (none) | `esplink_ble_address()` | `BLE.address()` |
| `esplink_ble_disconnect` | Statement | (none) | `esplink_ble_disconnect()` | `BLE.disconnect();` |
| `esplink_ble_set_timeout` | Statement | TIMEOUT(field_number) | `esplink_ble_set_timeout(3000)` | `BLE.setTimeout(3000);` |
| `esplink_ble_healthy` | Value (Boolean) | (none) | `esplink_ble_healthy()` | `BLEESPLink.healthy()` |
| `esplink_ble_last_error` | Value (Number) | (none) | `esplink_ble_last_error()` | `BLEESPLink.lastError()` |
| `esplink_ble_create_service` | Statement | VAR(field_input), UUID(field_input) | `esplink_ble_create_service("bleService", "19B10000-E8F2-537E-4F6C-D104768A1214")` | object: `BLEService bleService("19B10000-E8F2-537E-4F6C-D104768A1214");` ↵ loop: `BLE.poll();` ↵ the block itself emits no inline code |
| `esplink_ble_create_characteristic` | Statement | VAR(field_input), UUID(field_input), TYPE(dropdown), READ(field_checkbox), WRITE(field_checkbox), NOTIFY(field_checkbox), INDICATE(field_checkbox) | `esplink_ble_create_characteristic("bleValue", "19B10001-E8F2-537E-4F6C-D104768A1214", BLEUnsignedIntCharacteristic, TRUE, FALSE, TRUE, FALSE)` | object: `BLEUnsignedIntCharacteristic bleValue("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead &#124; BLENotify);` ↵ loop: `BLE.poll();` ↵ the block itself emits no inline code |
| `esplink_ble_create_string_characteristic` | Statement | VAR(field_input), UUID(field_input), SIZE(field_number), READ(field_checkbox), WRITE(field_checkbox), NOTIFY(field_checkbox), INDICATE(field_checkbox) | `esplink_ble_create_string_characteristic("bleText", "19B10002-E8F2-537E-4F6C-D104768A1214", 32, TRUE, TRUE, FALSE, FALSE)` | object: `BLEStringCharacteristic bleText("19B10002-E8F2-537E-4F6C-D104768A1214", BLERead &#124; BLEWrite, 32);` ↵ loop: `BLE.poll();` ↵ the block itself emits no inline code |
| `esplink_ble_service_add_characteristic` | Statement | SERVICE(field_variable), CHAR(field_variable) | `esplink_ble_service_add_characteristic($bleService, $bleValue)` | `bleService.addCharacteristic(bleValue);` |
| `esplink_ble_add_service` | Statement | SERVICE(field_variable) | `esplink_ble_add_service($bleService)` | `BLE.addService(bleService);` |
| `esplink_ble_set_local_name` | Statement | NAME(input_value) | `esplink_ble_set_local_name(text("ESPLink-Device"))` | object: `String esplink_ble_local_name;` ↵ `esplink_ble_local_name = "ESPLink-Device";` ↵ `BLE.setLocalName(esplink_ble_local_name.c_str());` |
| `esplink_ble_set_device_name` | Statement | NAME(input_value) | `esplink_ble_set_device_name(text("ESPLink-Device"))` | object: `String esplink_ble_device_name;` ↵ `esplink_ble_device_name = "ESPLink-Device";` ↵ `BLE.setDeviceName(esplink_ble_device_name.c_str());` |
| `esplink_ble_set_advertised_service` | Statement | SERVICE(field_variable) | `esplink_ble_set_advertised_service($bleService)` | `BLE.setAdvertisedService(bleService);` |
| `esplink_ble_advertise` | Statement | (none) | `esplink_ble_advertise()` | loop: `BLE.poll();` ↵ `BLE.advertise();` |
| `esplink_ble_stop_advertise` | Statement | (none) | `esplink_ble_stop_advertise()` | `BLE.stopAdvertise();` |
| `esplink_ble_set_advertising_interval` | Statement | INTERVAL(field_number) | `esplink_ble_set_advertising_interval(100)` | `BLE.setAdvertisingInterval(160);` |
| `esplink_ble_set_connectable` | Statement | ENABLED(field_checkbox) | `esplink_ble_set_connectable(TRUE)` | `BLE.setConnectable(true);` |
| `esplink_ble_char_write_number` | Statement | CHAR(field_variable), VALUE(input_value) | `esplink_ble_char_write_number($bleValue, math_number(42))` | `bleValue.writeValue(42);` |
| `esplink_ble_char_write_string` | Statement | CHAR(field_variable), VALUE(input_value) | `esplink_ble_char_write_string($bleText, text("hello"))` | `bleText.writeValue(String("hello"));` |
| `esplink_ble_char_value_number` | Value (Number) | CHAR(field_variable) | `esplink_ble_char_value_number($bleValue)` | `bleValue.value()` |
| `esplink_ble_char_value_string` | Value (String) | CHAR(field_variable) | `esplink_ble_char_value_string($bleText)` | `bleText.value()` |
| `esplink_ble_char_written` | Value (Boolean) | CHAR(field_variable) | `esplink_ble_char_written($bleValue)` | `bleValue.written()` |
| `esplink_ble_char_subscribed` | Value (Boolean) | CHAR(field_variable) | `esplink_ble_char_subscribed($bleValue)` | `bleValue.subscribed()` |
| `esplink_ble_on_char_written` | Hat | CHAR(field_variable), HANDLER(input_statement) | `esplink_ble_on_char_written($bleValue)` | function: `void esplink_ble_written_bleValue(BLEDevice device, BLECharacteristic characteristic) { <HANDLER> }` ↵ setup end: `bleValue.setEventHandler(BLEWritten, esplink_ble_written_bleValue);` ↵ loop: `BLE.poll();` ↵ the block itself emits no inline code |
| `esplink_ble_on_device_event` | Hat | EVENT(dropdown), HANDLER(input_statement) | `esplink_ble_on_device_event(BLEConnected)` | function: `void esplink_ble_event_bleconnected(BLEDevice device) { <HANDLER> }` ↵ setup end: `BLE.setEventHandler(BLEConnected, esplink_ble_event_bleconnected);` ↵ loop: `BLE.poll();` ↵ the block itself emits no inline code |
| `esplink_ble_scan` | Statement | (none) | `esplink_ble_scan()` | loop: `BLE.poll();` ↵ `BLE.scan();` |
| `esplink_ble_scan_for` | Statement | MODE(dropdown), FILTER(input_value) | `esplink_ble_scan_for(scanForUuid, text("19B10000-E8F2-537E-4F6C-D104768A1214"))` | loop: `BLE.poll();` ↵ `BLE.scanForUuid(String("19B10000-E8F2-537E-4F6C-D104768A1214"));` |
| `esplink_ble_stop_scan` | Statement | (none) | `esplink_ble_stop_scan()` | `BLE.stopScan();` |
| `esplink_ble_device_create` | Statement | VAR(field_input) | `esplink_ble_device_create("peer")` | object: `BLEDevice peer;` ↵ loop: `BLE.poll();` ↵ `peer = BLE.available();` |
| `esplink_ble_device_found` | Value (Boolean) | DEV(field_variable) | `esplink_ble_device_found($peer)` | `((bool)peer)` |
| `esplink_ble_device_connect` | Value (Boolean) | DEV(field_variable) | `esplink_ble_device_connect($peer)` | `peer.connect()` |
| `esplink_ble_device_discover` | Value (Boolean) | DEV(field_variable) | `esplink_ble_device_discover($peer)` | `peer.discoverAttributes()` |
| `esplink_ble_device_connected` | Value (Boolean) | DEV(field_variable) | `esplink_ble_device_connected($peer)` | `peer.connected()` |
| `esplink_ble_device_disconnect` | Statement | DEV(field_variable) | `esplink_ble_device_disconnect($peer)` | `peer.disconnect();` |
| `esplink_ble_device_address` | Value (String) | DEV(field_variable) | `esplink_ble_device_address($peer)` | `peer.address()` |
| `esplink_ble_device_local_name` | Value (String) | DEV(field_variable) | `esplink_ble_device_local_name($peer)` | `peer.localName()` |
| `esplink_ble_device_rssi` | Value (Number) | DEV(field_variable) | `esplink_ble_device_rssi($peer)` | `peer.rssi()` |
| `esplink_ble_remote_char_create` | Statement | DEV(field_variable), VAR(field_input), UUID(field_input) | `esplink_ble_remote_char_create($peer, "remoteValue", "19B10001-E8F2-537E-4F6C-D104768A1214")` | object: `BLECharacteristic remoteValue;` ↵ loop: `BLE.poll();` ↵ `remoteValue = peer.characteristic("19B10001-E8F2-537E-4F6C-D104768A1214");` |
| `esplink_ble_remote_can` | Value (Boolean) | CHAR(field_variable), WHAT(dropdown) | `esplink_ble_remote_can($remoteValue, canSubscribe)` | `remoteValue.canSubscribe()` |
| `esplink_ble_remote_read` | Statement | CHAR(field_variable) | `esplink_ble_remote_read($remoteValue)` | `remoteValue.read();` |
| `esplink_ble_remote_value_number` | Value (Number) | CHAR(field_variable) | `esplink_ble_remote_value_number($remoteValue)` | function: `long esplinkBleReadNumber(BLECharacteristic &characteristic)` returning the cached value as 4, 2 or 1 byte unsigned integer according to `valueLength()` ↵ `esplinkBleReadNumber(remoteValue)` |
| `esplink_ble_remote_value_string` | Value (String) | CHAR(field_variable) | `esplink_ble_remote_value_string($remoteValue)` | function: `String esplinkBleReadString(BLECharacteristic &characteristic)` copying `valueLength()` bytes of `value()` into a String ↵ `esplinkBleReadString(remoteValue)` |
| `esplink_ble_remote_write_number` | Statement | CHAR(field_variable), VALUE(input_value) | `esplink_ble_remote_write_number($remoteValue, math_number(1))` | `remoteValue.writeValue((uint32_t)(1));` |
| `esplink_ble_remote_write_string` | Statement | CHAR(field_variable), VALUE(input_value) | `esplink_ble_remote_write_string($remoteValue, text("hello"))` | `remoteValue.writeValue(String("hello").c_str());` |
| `esplink_ble_remote_subscribe` | Value (Boolean) | CHAR(field_variable) | `esplink_ble_remote_subscribe($remoteValue)` | `remoteValue.subscribe()` |
| `esplink_ble_remote_value_updated` | Value (Boolean) | CHAR(field_variable) | `esplink_ble_remote_value_updated($remoteValue)` | `remoteValue.valueUpdated()` |
| `esplink_begin` | Statement | (none) | `esplink_begin()` | library: `#include <ESPLink.h>` ↵ loop begin: `ESPLink.poll();` ↵ inline: `ESPLink.begin();` |
| `esplink_begin_serial` | Statement | SERIAL(dropdown), BAUD(dropdown) | `esplink_begin_serial(Serial2, 921600)` | library: `#include <ESPLink.h>` ↵ loop begin: `ESPLink.poll();` ↵ inline: `ESPLink.begin(Serial2, 921600);` |
| `esplink_bind_stream` | Statement | SERIAL(dropdown) | `esplink_bind_stream(Serial2)` | library: `#include <ESPLink.h>` ↵ loop begin: `ESPLink.poll();` ↵ inline: `ESPLink.begin(static_cast<Stream &>(Serial2));` |
| `esplink_end` | Statement | (none) | `esplink_end()` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.end();` |
| `esplink_poll` | Statement | (none) | `esplink_poll()` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.poll();` |
| `esplink_ready` | Value (Boolean) | (none) | `esplink_ready()` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.ready()` |
| `esplink_ping` | Value (Boolean) | TIMEOUT(field_number) | `esplink_ping(1000)` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.ping(1000)` |
| `esplink_session` | Value (Number) | (none) | `esplink_session()` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.session()` |
| `esplink_last_error` | Value (Number) | (none) | `esplink_last_error()` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.lastError()` |
| `esplink_error_code` | Value (Number) | CODE(dropdown) | `esplink_error_code(c3::Timeout)` | library: `#include <ESPLink.h>` ↵ inline: `c3::Timeout` |
| `esplink_firmware_version` | Value (String) | (none) | `esplink_firmware_version()` | library: `#include <ESPLink.h>` ↵ inline: `String(ESPLink.capabilities().firmwareVersion)` |
| `esplink_capability` | Value (Number) | ITEM(dropdown) | `esplink_capability(maxPayload)` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.capabilities().maxPayload` |
| `esplink_has_feature` | Value (Boolean) | FEATURE(dropdown) | `esplink_has_feature(c3::WiFi)` | library: `#include <ESPLink.h>` ↵ inline: `((ESPLink.capabilities().features & c3::WiFi) != 0)` |
| `esplink_stat` | Value (Number) | ITEM(dropdown) | `esplink_stat(retries)` | library: `#include <ESPLink.h>` ↵ inline: `ESPLink.stats().retries` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | BLEIntCharacteristic, BLEUnsignedIntCharacteristic, BLEByteCharacteristic, BLEShortCharacteristic, BLELongCharacteristic, BLEUnsignedLongCharacteristic, BLEFloatCharacteristic, BLEDoubleCharacteristic, BLEBoolCharacteristic | C++ class used for a numeric characteristic; its size is fixed by the type |
| EVENT | BLEConnected, BLEDisconnected | Device event for `esplink_ble_on_device_event` |
| MODE | scanForUuid, scanForName, scanForAddress | Scan filter kind for `esplink_ble_scan_for` |
| WHAT | valid, canRead, canWrite, canSubscribe | Query for `esplink_ble_remote_can` |
| SERIAL | (board.serialPort) | Link UART, filled from the board configuration |
| BAUD | 921600, 115200, 460800, 230400, 1000000 | Link baud; must match the C3 firmware |
| CODE | c3::Ok, c3::InvalidArgument, c3::Unsupported, c3::NoMemory, c3::Busy, c3::Timeout, c3::NotConnected, c3::IoError, c3::ProtocolError, c3::OutcomeUnknown, c3::StaleHandle, c3::BufferTooSmall, c3::ResultExpired, c3::SecurityError, c3::WouldBlock, c3::LinkLost, c3::NotFound | Error constants for `esplink_error_code` |
| FEATURE | c3::WiFi, c3::TCP, c3::UDP, c3::TLS, c3::HCI, c3::IPv6, c3::StationAP, c3::OTA, c3::MDNS | Firmware feature bits for `esplink_has_feature` |
| ITEM (`esplink_capability`) | maxPayload, maxHciPacket, maxSockets, maxBLEConnections, features, bootID | Handshake capability fields |
| ITEM (`esplink_stat`) | transmitted, received, retries, timeouts, crcErrors, malformed, oversized, ignored, sessionChanges, rxBytes, rxBatches, workerWakeups | Link statistics counters |

## ABS Examples

### Peripheral with a notifying counter
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_ble_begin()
    esplink_ble_create_service("counterService", "19B10000-E8F2-537E-4F6C-D104768A1214")
    esplink_ble_create_characteristic("counter", "19B10001-E8F2-537E-4F6C-D104768A1214", BLEUnsignedIntCharacteristic, TRUE, FALSE, TRUE, FALSE)
    esplink_ble_service_add_characteristic($counterService, $counter)
    esplink_ble_add_service($counterService)
    esplink_ble_set_local_name(text("ESPLink-Counter"))
    esplink_ble_set_advertised_service($counterService)
    esplink_ble_advertise()

arduino_loop()
    esplink_ble_char_write_number($counter, time_millis())
    time_delay(math_number(1000))
```

### Peripheral that reacts to a write
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_ble_begin()
    esplink_ble_create_service("controlService", "19B10000-E8F2-537E-4F6C-D104768A1214")
    esplink_ble_create_string_characteristic("command", "19B10002-E8F2-537E-4F6C-D104768A1214", 32, TRUE, TRUE, FALSE, FALSE)
    esplink_ble_service_add_characteristic($controlService, $command)
    esplink_ble_add_service($controlService)
    esplink_ble_set_local_name(text("ESPLink-Control"))
    esplink_ble_set_advertised_service($controlService)
    esplink_ble_advertise()

esplink_ble_on_char_written($command)
    @HANDLER:
        serial_println(Serial, esplink_ble_char_value_string($command))

esplink_ble_on_device_event(BLEDisconnected)
    @HANDLER:
        esplink_ble_advertise()

arduino_loop()
    time_delay(math_number(1))
```

### Central subscribing to a peer
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_ble_begin()
    esplink_ble_set_timeout(3000)
    esplink_ble_scan_for(scanForUuid, text("19B10000-E8F2-537E-4F6C-D104768A1214"))

arduino_loop()
    esplink_ble_device_create("peer")
    controls_if()
        @IF0: esplink_ble_device_found($peer)
        @DO0:
            esplink_ble_stop_scan()
            controls_if()
                @IF0: logic_operation(esplink_ble_device_connect($peer), AND, esplink_ble_device_discover($peer))
                @DO0:
                    esplink_ble_remote_char_create($peer, "remoteCounter", "19B10001-E8F2-537E-4F6C-D104768A1214")
                    esplink_ble_remote_subscribe($remoteCounter)
    controls_if()
        @IF0: esplink_ble_remote_value_updated($remoteCounter)
        @DO0:
            serial_println(Serial, esplink_ble_remote_value_number($remoteCounter))
    time_delay(math_number(1))
```

### Link health check
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_ble_begin()

arduino_loop()
    controls_if()
        @IF0: logic_negate(esplink_ble_healthy())
        @DO0:
            serial_println(Serial, esplink_ble_last_error())
            esplink_ble_end()
    time_delay(math_number(1000))
```

## Notes

1. **Variables**: `esplink_ble_create_service` creates a `BLEService` variable; `esplink_ble_create_characteristic` and `esplink_ble_create_string_characteristic` create `BLECharacteristic` variables; `esplink_ble_device_create` creates a `BLEDevice`; `esplink_ble_remote_char_create` creates a `BLERemoteCharacteristic`. Pass them to field_variable slots as bare `$name`.
2. **Local and remote characteristics are different Blockly types**: local characteristic blocks only accept `BLECharacteristic` variables, remote ones only `BLERemoteCharacteristic`. Do not mix them: a local typed characteristic returns its value directly, while a remote one returns a byte buffer that the remote value blocks decode. Match the value block to the characteristic kind as well — use the number blocks with `esplink_ble_create_characteristic` variables and the text blocks with `esplink_ble_create_string_characteristic` variables.
3. **Object declarations are global**: services and characteristics are emitted as global objects, so the create blocks themselves produce no inline code. Put them in setup, then add characteristics to the service, then register the service, then advertise, in that order.
4. **Polling is automatic**: every startup block inserts `BLE.poll();` at the start of `loop()`, which also services the ESPLink transport. Callbacks run in that same context, so keep handlers short and avoid long delays in the loop.
5. **ESPLink starts itself**: `esplink_ble_begin` brings up the link. Place `esplink_begin_serial` before it only to change the UART or baud.
6. **One connection at a time**: this port supports a single peer, because CCCD, prepared write and pairing state are shared. ATT MTU starts at 23 and is capped at 242 bytes, which bounds string characteristic sizes.
7. **Central sequence**: scan, take a device, stop scanning, connect, discover attributes, then take a characteristic. Connecting while scanning fails. Release device and characteristic variables after a disconnect.
8. **Notifications**: `esplink_ble_remote_subscribe` returns false when the characteristic has no notify property; check with `esplink_ble_remote_can($char, canSubscribe)` first. `esplink_ble_remote_value_updated` becomes true when a notification arrives.
9. **Written flag**: `esplink_ble_char_written` clears itself once read, so store the result if it is needed more than once. `esplink_ble_on_char_written` is the event-driven alternative.
10. **Name lifetime**: the advertising data stores a pointer to the name, so `esplink_ble_set_local_name` and `esplink_ble_set_device_name` copy the text into a dedicated global `String` first.
11. **Advertising interval**: the block takes milliseconds and emits the protocol unit of 0.625 ms, clamped to a minimum of 20 ms.
12. **Recovery**: when `esplink_ble_healthy()` becomes false the controller session is lost. Call `esplink_ble_end`, restore the link, call `esplink_ble_begin` again, and register the GATT database and advertising once more.
13. **Shared link**: WiFi and BLE use one UART and one RPC channel; a long DNS, TCP or TLS request delays BLE processing.
14. **Not available**: extended and periodic advertising, coded PHY control, mesh, L2CAP channels and Bluetooth Classic are not exposed by this host API. The controller is an ESP32-C3, which has BLE only.
15. **C3 link blocks**: the `esplink_*` group is the shared UART transport. No block from it is required — `esplink_ble_begin` starts the link itself. Use `esplink_begin_serial` before it only to change UART or baud, and the diagnostic blocks (`esplink_ready`, `esplink_ping`, `esplink_stat`, ...) to check wiring before any BLE traffic. The same group is also shipped by `@aily-project/lib-esplink-wifi` with identical definitions, so both libraries can be installed together.
