# ESP8266 WiFi

WiFi station, access point, scanning and SmartConfig blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-wifi
- **Version**: 1.0.3
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `esp8266_wifi_begin(SSID, PASSWORD)` | `WiFi.begin(1, 1);` |
| `esp8266_wifi_begin_advanced` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value), BSSID(input_value) | `esp8266_wifi_begin_advanced(SSID, PASSWORD, CHANNEL, BSSID)` | `WiFi.begin(1, 1, 1, 1);` |
| `esp8266_wifi_disconnect` | Statement | ERASE_AP(dropdown) | `esp8266_wifi_disconnect(FALSE)` | `WiFi.disconnect(false);` |
| `esp8266_wifi_status` | Value | (none) | `esp8266_wifi_status()` | `WiFi.status()` |
| `esp8266_wifi_status_type` | Value | STATUS(dropdown) | `esp8266_wifi_status_type(WL_NO_SHIELD)` | `WL_NO_SHIELD` |
| `esp8266_wifi_is_connected` | Value | (none) | `esp8266_wifi_is_connected()` | `WiFi.isConnected()` |
| `esp8266_wifi_local_ip` | Value | (none) | `esp8266_wifi_local_ip()` | `WiFi.localIP().toString()` |
| `esp8266_wifi_mac_address` | Value | (none) | `esp8266_wifi_mac_address()` | `WiFi.macAddress()` |
| `esp8266_wifi_rssi` | Value | (none) | `esp8266_wifi_rssi()` | `WiFi.RSSI()` |
| `esp8266_wifi_ssid` | Value | (none) | `esp8266_wifi_ssid()` | `WiFi.SSID()` |
| `esp8266_wifi_scan_networks` | Value | ASYNC(dropdown) | `esp8266_wifi_scan_networks(FALSE)` | `WiFi.scanNetworks(false)` |
| `esp8266_wifi_get_ssid` | Value | INDEX(input_value) | `esp8266_wifi_get_ssid(INDEX)` | `WiFi.SSID(1)` |
| `esp8266_wifi_get_rssi` | Value | INDEX(input_value) | `esp8266_wifi_get_rssi(INDEX)` | `WiFi.RSSI(1)` |
| `esp8266_wifi_get_encryption_type` | Value | INDEX(input_value) | `esp8266_wifi_get_encryption_type(INDEX)` | `WiFi.encryptionType(1)` |
| `esp8266_wifi_encryption_type` | Value | TYPE(dropdown) | `esp8266_wifi_encryption_type(WIFI_AUTH_OPEN)` | `WIFI_AUTH_OPEN` |
| `esp8266_wifi_scan_complete` | Value | (none) | `esp8266_wifi_scan_complete()` | `WiFi.scanComplete()` |
| `esp8266_wifi_scan_delete` | Statement | (none) | `esp8266_wifi_scan_delete()` | `WiFi.scanDelete();` |
| `esp8266_wifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `esp8266_wifi_softap(SSID, PASSWORD, CHANNEL)` | `WiFi.softAP(1, 1, 1);` |
| `esp8266_wifi_softap_config` | Statement | IP(field_input), GATEWAY(field_input), SUBNET(field_input) | `esp8266_wifi_softap_config(IP, GATEWAY, SUBNET)` | `WiFi.softAPConfig(IPAddress(192, 168, 4, 1), IPAddress(192, 168, 4, 1), IPAddress(255, 255, 255, 0));` |
| `esp8266_wifi_softap_disconnect` | Statement | WIFI_OFF(dropdown) | `esp8266_wifi_softap_disconnect(FALSE)` | `WiFi.softAPdisconnect(false);` |
| `esp8266_wifi_softap_station_count` | Value | (none) | `esp8266_wifi_softap_station_count()` | `WiFi.softAPgetStationNum()` |
| `esp8266_wifi_softap_ip` | Value | (none) | `esp8266_wifi_softap_ip()` | `WiFi.softAPIP().toString()` |
| `esp8266_wifi_set_mode` | Statement | MODE(dropdown) | `esp8266_wifi_set_mode(WIFI_STA)` | `WiFi.mode(WIFI_STA);` |
| `esp8266_wifi_get_mode` | Value | (none) | `esp8266_wifi_get_mode()` | `WiFi.getMode()` |
| `esp8266_wifi_mode` | Value | MODE(dropdown) | `esp8266_wifi_mode(WIFI_MODE_STA)` | `WIFI_MODE_STA` |
| `esp8266_wifi_set_auto_reconnect` | Statement | AUTO_RECONNECT(dropdown) | `esp8266_wifi_set_auto_reconnect(TRUE)` | `WiFi.setAutoReconnect(true);` |
| `esp8266_wifi_wait_for_connect_result` | Value | TIMEOUT(input_value) | `esp8266_wifi_wait_for_connect_result(TIMEOUT)` | `WiFi.waitForConnectResult(1)` |
| `esp8266_wifi_reconnect` | Statement | (none) | `esp8266_wifi_reconnect()` | `WiFi.reconnect();` |
| `esp8266_wifi_smartconfig_start` | Statement | (none) | `esp8266_wifi_smartconfig_start()` | `WiFi.beginSmartConfig();` |
| `esp8266_wifi_smartconfig_stop` | Statement | (none) | `esp8266_wifi_smartconfig_stop()` | `WiFi.stopSmartConfig();` |
| `esp8266_wifi_smartconfig_done` | Value | (none) | `esp8266_wifi_smartconfig_done()` | `WiFi.smartConfigDone()` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_wifi_disconnect.ERASE_AP | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_status_type.STATUS | WL_NO_SHIELD, WL_STOPPED, WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECTED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED | Selects the generated API option. |
| esp8266_wifi_scan_networks.ASYNC | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_encryption_type.TYPE | WIFI_AUTH_OPEN, WIFI_AUTH_WEP, WIFI_AUTH_WPA_PSK, WIFI_AUTH_WPA2_PSK, WIFI_AUTH_WPA_WPA2_PSK, WIFI_AUTH_WPA2_ENTERPRISE, WIFI_AUTH_WPA3_PSK, WIFI_AUTH_WPA2_WPA3_PSK | Selects the generated API option. |
| esp8266_wifi_softap_disconnect.WIFI_OFF | FALSE, TRUE | Selects the generated API option. |
| esp8266_wifi_set_mode.MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_MODE_NULL | Selects the generated API option. |
| esp8266_wifi_mode.MODE | WIFI_MODE_STA, WIFI_MODE_AP, WIFI_MODE_APSTA, WIFI_MODE_NULL | Selects the generated API option. |
| esp8266_wifi_set_auto_reconnect.AUTO_RECONNECT | TRUE, FALSE | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_wifi_begin(SSID, PASSWORD)
```
