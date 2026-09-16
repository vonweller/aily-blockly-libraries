# ESPLink WiFi

WiFi, TCP, UDP and TLS for a host board without radio, provided by an ESP32-C3 coprocessor over ESPLink.

## Library Info
- **Name**: @aily-project/lib-esplink-wifi
- **Version**: 1.0.0

Every WiFi, TCP, TLS, HTTP and UDP block adds the library reference `#include <WiFi.h>`; the C3 link blocks (`esplink_begin` and the rest of the `esplink_*` group) add `#include <ESPLink.h>` instead. The Generated Code column lists the code each block emits at its own position, plus any extra fragment it writes elsewhere, marked as `library:`, `object:`, `function:`, `setup:` or `loop:`.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esplink_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `esplink_wifi_begin(text("yourNetwork"), text("yourPassword"))` | loop: `WiFi.poll();` ↵ `WiFi.begin("yourNetwork", "yourPassword");` |
| `esplink_wifi_begin_advanced` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(input_value) | `esplink_wifi_begin_advanced(text("yourNetwork"), text("yourPassword"), math_number(6))` | loop: `WiFi.poll();` ↵ `WiFi.begin(String("yourNetwork").c_str(), String("yourPassword").c_str(), 6);` |
| `esplink_wifi_connect_quick` | Value (Boolean) | SSID(input_value), PASSWORD(input_value), TIMEOUT(field_number) | `esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)` | function: `bool esplinkWiFiConnect(const String &ssid, const String &password, unsigned long timeoutMs)` which calls `WiFi.begin`, returns true on `WL_CONNECTED`, and otherwise prints `WiFi连接失败，状态=` with `WiFi.status()` before returning false ↵ setup begin: `Serial.begin(9600);` ↵ loop: `WiFi.poll();` ↵ `esplinkWiFiConnect("yourNetwork", "yourPassword", 20000)` |
| `esplink_wifi_wait_connected` | Value (Number) | TIMEOUT(field_number) | `esplink_wifi_wait_connected(20000)` | `WiFi.waitForConnectResult(20000)` |
| `esplink_wifi_is_connected` | Value (Boolean) | (none) | `esplink_wifi_is_connected()` | `WiFi.isConnected()` |
| `esplink_wifi_status` | Value (Number) | (none) | `esplink_wifi_status()` | `WiFi.status()` |
| `esplink_wifi_status_type` | Value (Number) | STATUS(dropdown) | `esplink_wifi_status_type(WL_CONNECTED)` | `WL_CONNECTED` |
| `esplink_wifi_disconnect` | Statement | RADIO_OFF(field_checkbox), ERASE(field_checkbox) | `esplink_wifi_disconnect(FALSE, FALSE)` | `WiFi.disconnect(false, false);` |
| `esplink_wifi_reconnect` | Statement | (none) | `esplink_wifi_reconnect()` | `WiFi.reconnect();` |
| `esplink_wifi_set_auto_reconnect` | Statement | ENABLED(field_checkbox) | `esplink_wifi_set_auto_reconnect(TRUE)` | `WiFi.setAutoReconnect(true);` |
| `esplink_wifi_set_mode` | Statement | MODE(dropdown) | `esplink_wifi_set_mode(WIFI_STA)` | `WiFi.mode(WIFI_STA);` |
| `esplink_wifi_get_mode` | Value (Number) | (none) | `esplink_wifi_get_mode()` | `WiFi.getMode()` |
| `esplink_wifi_poll` | Statement | (none) | `esplink_wifi_poll()` | `WiFi.poll();` |
| `esplink_wifi_end` | Statement | (none) | `esplink_wifi_end()` | `WiFi.end();` |
| `esplink_wifi_ip_info` | Value (String) | WHICH(dropdown) | `esplink_wifi_ip_info(localIP)` | library: `#include <WiFiPlatform.h>` ↵ `espwifi::addressString(WiFi.localIP())` |
| `esplink_wifi_ssid` | Value (String) | (none) | `esplink_wifi_ssid()` | `WiFi.SSID()` |
| `esplink_wifi_rssi` | Value (Number) | (none) | `esplink_wifi_rssi()` | `WiFi.RSSI()` |
| `esplink_wifi_channel` | Value (Number) | (none) | `esplink_wifi_channel()` | `WiFi.channel()` |
| `esplink_wifi_mac` | Value (String) | (none) | `esplink_wifi_mac()` | `WiFi.macAddress()` |
| `esplink_wifi_set_hostname` | Statement | NAME(input_value) | `esplink_wifi_set_hostname(text("esplink-device"))` | `WiFi.setHostname(String("esplink-device").c_str());` |
| `esplink_wifi_get_hostname` | Value (String) | (none) | `esplink_wifi_get_hostname()` | `String(WiFi.getHostname())` |
| `esplink_wifi_config_static` | Statement | IP(input_value), GATEWAY(input_value), SUBNET(input_value), DNS(input_value) | `esplink_wifi_config_static(text("192.168.1.50"), text("192.168.1.1"), text("255.255.255.0"), text("192.168.1.1"))` | function: `IPAddress esplinkWiFiIP(const String &text) { IPAddress address; if (!address.fromString(text.c_str())) address = IPAddress(); return address; }` ↵ `WiFi.config(esplinkWiFiIP("192.168.1.50"), esplinkWiFiIP("192.168.1.1"), esplinkWiFiIP("255.255.255.0"), esplinkWiFiIP("192.168.1.1"));` |
| `esplink_wifi_set_dns` | Statement | DNS1(input_value), DNS2(input_value) | `esplink_wifi_set_dns(text("223.5.5.5"), text("8.8.8.8"))` | function: `esplinkWiFiIP` (same as above) ↵ `WiFi.setDNS(esplinkWiFiIP("223.5.5.5"), esplinkWiFiIP("8.8.8.8"));` |
| `esplink_wifi_host_by_name` | Value (String) | HOST(input_value) | `esplink_wifi_host_by_name(text("example.com"))` | library: `#include <WiFiPlatform.h>` ↵ function: `String esplinkWiFiResolve(const String &host) { IPAddress address; if (WiFi.hostByName(host.c_str(), address) != 1) return String(""); return espwifi::addressString(address); }` ↵ `esplinkWiFiResolve("example.com")` |
| `esplink_wifi_firmware_version` | Value (String) | (none) | `esplink_wifi_firmware_version()` | `String(WiFi.firmwareVersion())` |
| `esplink_wifi_last_error` | Value (Number) | (none) | `esplink_wifi_last_error()` | `WiFi.lastError()` |
| `esplink_wifi_config_time` | Statement | GMT_HOURS(field_number), DST_HOURS(field_number), SERVER(input_value) | `esplink_wifi_config_time(8, 0, text("pool.ntp.org"))` | `WiFi.configTime(28800, 0, String("pool.ntp.org").c_str());` |
| `esplink_wifi_get_time` | Value (Number) | (none) | `esplink_wifi_get_time()` | `(unsigned long)WiFi.getTime()` |
| `esplink_wifi_scan_networks` | Value (Number) | SHOW_HIDDEN(field_checkbox) | `esplink_wifi_scan_networks(FALSE)` | `WiFi.scanNetworks(false, false)` |
| `esplink_wifi_scan_start_async` | Statement | SHOW_HIDDEN(field_checkbox) | `esplink_wifi_scan_start_async(FALSE)` | `WiFi.scanNetworks(true, false);` |
| `esplink_wifi_scan_complete` | Value (Number) | (none) | `esplink_wifi_scan_complete()` | `WiFi.scanComplete()` |
| `esplink_wifi_scan_ssid` | Value (String) | INDEX(input_value) | `esplink_wifi_scan_ssid(math_number(0))` | `WiFi.SSID((uint8_t)(0))` |
| `esplink_wifi_scan_rssi` | Value (Number) | INDEX(input_value) | `esplink_wifi_scan_rssi(math_number(0))` | `WiFi.RSSI((uint8_t)(0))` |
| `esplink_wifi_scan_channel` | Value (Number) | INDEX(input_value) | `esplink_wifi_scan_channel(math_number(0))` | `WiFi.channel((uint8_t)(0))` |
| `esplink_wifi_scan_encryption` | Value (Number) | INDEX(input_value) | `esplink_wifi_scan_encryption(math_number(0))` | `(int)WiFi.encryptionType((uint8_t)(0))` |
| `esplink_wifi_scan_delete` | Statement | (none) | `esplink_wifi_scan_delete()` | `WiFi.scanDelete();` |
| `esplink_wifi_softap` | Statement | SSID(input_value), PASSWORD(input_value), CHANNEL(field_number) | `esplink_wifi_softap(text("esplink-ap"), text("12345678"), 1)` | loop: `WiFi.poll();` ↵ `WiFi.softAP(String("esplink-ap").c_str(), String("12345678").c_str(), 1);` |
| `esplink_wifi_softap_config` | Statement | IP(input_value), GATEWAY(input_value), SUBNET(input_value) | `esplink_wifi_softap_config(text("192.168.4.1"), text("192.168.4.1"), text("255.255.255.0"))` | function: `esplinkWiFiIP` (same as above) ↵ `WiFi.softAPConfig(esplinkWiFiIP("192.168.4.1"), esplinkWiFiIP("192.168.4.1"), esplinkWiFiIP("255.255.255.0"));` |
| `esplink_wifi_softap_disconnect` | Statement | RADIO_OFF(field_checkbox) | `esplink_wifi_softap_disconnect(FALSE)` | `WiFi.softAPdisconnect(false);` |
| `esplink_wifi_softap_ip` | Value (String) | (none) | `esplink_wifi_softap_ip()` | library: `#include <WiFiPlatform.h>` ↵ `espwifi::addressString(WiFi.softAPIP())` |
| `esplink_wifi_softap_station_num` | Value (Number) | (none) | `esplink_wifi_softap_station_num()` | `WiFi.softAPgetStationNum()` |
| `esplink_wifi_softap_mac` | Value (String) | (none) | `esplink_wifi_softap_mac()` | `WiFi.softAPmacAddress()` |
| `esplink_wifi_on_event` | Hat | EVENT(dropdown), HANDLER(input_statement) | `esplink_wifi_on_event(ARDUINO_EVENT_WIFI_STA_GOT_IP)` | function: `void esplink_wifi_on_wifi_sta_got_ip(WiFiEvent_t event) { <HANDLER> }` ↵ setup: `WiFi.onEvent(esplink_wifi_on_wifi_sta_got_ip, ARDUINO_EVENT_WIFI_STA_GOT_IP);` ↵ loop: `WiFi.poll();` ↵ the block itself emits no inline code |
| `esplink_tcp_client_create` | Statement | VAR(field_input) | `esplink_tcp_client_create("client")` | object: `WiFiClient client;` ↵ loop: `WiFi.poll();` ↵ the block itself emits no inline code |
| `esplink_tcp_client_connect` | Value (Boolean) | VAR(field_variable), HOST(input_value), PORT(input_value) | `esplink_tcp_client_connect($client, text("example.com"), math_number(80))` | `client.connect(String("example.com").c_str(), (uint16_t)(80))` |
| `esplink_tcp_client_connected` | Value (Boolean) | VAR(field_variable) | `esplink_tcp_client_connected($client)` | `(client.connected() != 0)` |
| `esplink_tcp_client_print` | Statement | VAR(field_variable), DATA(input_value), NEWLINE(field_checkbox) | `esplink_tcp_client_print($client, text("hello"), FALSE)` | `client.print("hello");` |
| `esplink_tcp_client_available` | Value (Number) | VAR(field_variable) | `esplink_tcp_client_available($client)` | `client.available()` |
| `esplink_tcp_client_read_string` | Value (String) | VAR(field_variable) | `esplink_tcp_client_read_string($client)` | function: `String esplinkWiFiReadAvailable(Stream &stream) { String data; while (stream.available() > 0) data += (char)stream.read(); return data; }` ↵ `esplinkWiFiReadAvailable(client)` |
| `esplink_tcp_client_remote_ip` | Value (String) | VAR(field_variable) | `esplink_tcp_client_remote_ip($client)` | library: `#include <WiFiPlatform.h>` ↵ `espwifi::addressString(client.remoteIP())` |
| `esplink_tcp_client_stop` | Statement | VAR(field_variable) | `esplink_tcp_client_stop($client)` | `client.stop();` |
| `esplink_tls_client_create` | Statement | VAR(field_input) | `esplink_tls_client_create("secureClient")` | object: `WiFiClientSecure secureClient;` ↵ loop: `WiFi.poll();` ↵ the block itself emits no inline code |
| `esplink_tls_set_pem` | Statement | VAR(field_variable), KIND(dropdown), PEM(input_value) | `esplink_tls_set_pem($secureClient, CA, text("-----BEGIN CERTIFICATE-----"))` | object: `String secureClient_ca;` ↵ `secureClient_ca = "-----BEGIN CERTIFICATE-----";` ↵ `secureClient.setCACert(secureClient_ca.c_str());` |
| `esplink_tls_use_builtin_ca` | Statement | VAR(field_variable) | `esplink_tls_use_builtin_ca($secureClient)` | `secureClient.useBuiltinCACertBundle();` |
| `esplink_tls_set_insecure` | Statement | VAR(field_variable) | `esplink_tls_set_insecure($secureClient)` | `secureClient.setInsecure();` |
| `esplink_http_get` | Value (String) | URL(input_value) | `esplink_http_get(text("http://example.com/"))` | function: `String esplinkWiFiHttpRequest(const String &url, const String &method, const String &body, const String &contentType)` parsing the URL, connecting with `WiFiClient` or `WiFiClientSecure`, printing `HTTP连接失败: ` with the host and returning an empty string when the connection fails, otherwise sending the request line and headers, collecting at most 4096 bytes within 15 seconds and returning the body after the header separator ↵ setup begin: `Serial.begin(9600);` ↵ loop: `WiFi.poll();` ↵ `esplinkWiFiHttpRequest("http://example.com/", "GET", "", "")` |
| `esplink_http_post` | Value (String) | URL(input_value), BODY(input_value), CONTENT_TYPE(field_input) | `esplink_http_post(text("http://example.com/api"), text("{}"), "application/json")` | function: `esplinkWiFiHttpRequest` (same as above) ↵ loop: `WiFi.poll();` ↵ `esplinkWiFiHttpRequest("http://example.com/api", "POST", "{}", "application/json")` |
| `esplink_tcp_server_create` | Statement | VAR(field_input), PORT(field_number) | `esplink_tcp_server_create("server", 80)` | object: `WiFiServer server(80);` ↵ loop: `WiFi.poll();` ↵ `server.begin();` |
| `esplink_tcp_server_accept` | Statement | SERVER(field_variable), CLIENT(field_variable) | `esplink_tcp_server_accept($server, $client)` | object: `WiFiClient client;` ↵ `client = server.available();` |
| `esplink_tcp_server_write` | Statement | VAR(field_variable), DATA(input_value) | `esplink_tcp_server_write($server, text("hello"))` | `server.print("hello");` |
| `esplink_tcp_server_end` | Statement | VAR(field_variable) | `esplink_tcp_server_end($server)` | `server.end();` |
| `esplink_udp_create` | Statement | VAR(field_input), PORT(input_value) | `esplink_udp_create("udp", math_number(8888))` | object: `WiFiUDP udp;` ↵ loop: `WiFi.poll();` ↵ `udp.begin((uint16_t)(8888));` |
| `esplink_udp_create_multicast` | Statement | VAR(field_input), IP(input_value), PORT(input_value) | `esplink_udp_create_multicast("udp", text("239.255.0.1"), math_number(8888))` | object: `WiFiUDP udp;` ↵ function: `esplinkWiFiIP` (same as above) ↵ loop: `WiFi.poll();` ↵ `udp.beginMulticast(esplinkWiFiIP("239.255.0.1"), (uint16_t)(8888));` |
| `esplink_udp_send_to` | Value (Boolean) | VAR(field_variable), DATA(input_value), HOST(input_value), PORT(input_value) | `esplink_udp_send_to($udp, text("hello"), text("192.168.1.255"), math_number(8888))` | function: `bool esplinkWiFiUdpSend(WiFiUDP &udp, const String &host, uint16_t port, const String &data) { if (udp.beginPacket(host.c_str(), port) != 1) return false; udp.print(data); return udp.endPacket() == 1; }` ↵ `esplinkWiFiUdpSend(udp, "192.168.1.255", (uint16_t)(8888), "hello")` |
| `esplink_udp_begin_packet` | Value (Boolean) | VAR(field_variable), HOST(input_value), PORT(input_value) | `esplink_udp_begin_packet($udp, text("192.168.1.255"), math_number(8888))` | `(udp.beginPacket(String("192.168.1.255").c_str(), (uint16_t)(8888)) == 1)` |
| `esplink_udp_write` | Statement | VAR(field_variable), DATA(input_value) | `esplink_udp_write($udp, text("hello"))` | `udp.print("hello");` |
| `esplink_udp_end_packet` | Value (Boolean) | VAR(field_variable) | `esplink_udp_end_packet($udp)` | `(udp.endPacket() == 1)` |
| `esplink_udp_parse_packet` | Value (Number) | VAR(field_variable) | `esplink_udp_parse_packet($udp)` | `udp.parsePacket()` |
| `esplink_udp_read_string` | Value (String) | VAR(field_variable) | `esplink_udp_read_string($udp)` | function: `esplinkWiFiReadAvailable` (same as above) ↵ `esplinkWiFiReadAvailable(udp)` |
| `esplink_udp_remote_ip` | Value (String) | VAR(field_variable) | `esplink_udp_remote_ip($udp)` | library: `#include <WiFiPlatform.h>` ↵ `espwifi::addressString(udp.remoteIP())` |
| `esplink_udp_stop` | Statement | VAR(field_variable) | `esplink_udp_stop($udp)` | `udp.stop();` |
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
| STATUS | WL_CONNECTED, WL_IDLE_STATUS, WL_NO_SSID_AVAIL, WL_SCAN_COMPLETED, WL_CONNECT_FAILED, WL_CONNECTION_LOST, WL_DISCONNECTED, WL_NO_SHIELD | Status constants for comparison with `esplink_wifi_status()` |
| MODE | WIFI_STA, WIFI_AP, WIFI_AP_STA, WIFI_OFF | Radio mode for `esplink_wifi_set_mode` |
| WHICH | localIP, gatewayIP, subnetMask, dns0, dns1 | Address selector for `esplink_wifi_ip_info` |
| EVENT | ARDUINO_EVENT_WIFI_STA_CONNECTED, ARDUINO_EVENT_WIFI_STA_DISCONNECTED, ARDUINO_EVENT_WIFI_STA_GOT_IP, ARDUINO_EVENT_WIFI_STA_LOST_IP, ARDUINO_EVENT_WIFI_SCAN_DONE, ARDUINO_EVENT_WIFI_AP_STACONNECTED, ARDUINO_EVENT_WIFI_AP_STADISCONNECTED, ARDUINO_EVENT_MAX | Event filter for `esplink_wifi_on_event`; `ARDUINO_EVENT_MAX` means every event |
| KIND | CA, CERT, KEY | Credential kind for `esplink_tls_set_pem` |
| SERIAL | (board.serialPort) | Link UART, filled from the board configuration |
| BAUD | 921600, 115200, 460800, 230400, 1000000 | Link baud; must match the C3 firmware |
| CODE | c3::Ok, c3::InvalidArgument, c3::Unsupported, c3::NoMemory, c3::Busy, c3::Timeout, c3::NotConnected, c3::IoError, c3::ProtocolError, c3::OutcomeUnknown, c3::StaleHandle, c3::BufferTooSmall, c3::ResultExpired, c3::SecurityError, c3::WouldBlock, c3::LinkLost, c3::NotFound | Error constants for `esplink_error_code` |
| FEATURE | c3::WiFi, c3::TCP, c3::UDP, c3::TLS, c3::HCI, c3::IPv6, c3::StationAP, c3::OTA, c3::MDNS | Firmware feature bits for `esplink_has_feature` |
| ITEM (`esplink_capability`) | maxPayload, maxHciPacket, maxSockets, maxBLEConnections, features, bootID | Handshake capability fields |
| ITEM (`esplink_stat`) | transmitted, received, retries, timeouts, crcErrors, malformed, oversized, ignored, sessionChanges, rxBytes, rxBatches, workerWakeups | Link statistics counters |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 115200)
    controls_if()
        @IF0: esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)
        @DO0:
            serial_println(Serial, esplink_wifi_ip_info(localIP))

arduino_loop()
    serial_println(Serial, esplink_wifi_rssi())
    time_delay(math_number(2000))
```

### TCP client request
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_tcp_client_create("client")
    esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)
    controls_if()
        @IF0: esplink_tcp_client_connect($client, text("example.com"), math_number(80))
        @DO0:
            esplink_tcp_client_print($client, text("GET / HTTP/1.1"), TRUE)
            esplink_tcp_client_print($client, text("Host: example.com"), TRUE)
            esplink_tcp_client_print($client, text("Connection: close"), TRUE)
            esplink_tcp_client_print($client, text(""), TRUE)

arduino_loop()
    controls_if()
        @IF0: logic_compare(esplink_tcp_client_available($client), GT, math_number(0))
        @DO0:
            serial_print(Serial, esplink_tcp_client_read_string($client))
    time_delay(math_number(1))
```

### One-block HTTP request
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)
    serial_println(Serial, esplink_http_get(text("http://example.com/")))

arduino_loop()
    time_delay(math_number(5000))
```

### HTTPS with time sync
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)
    esplink_wifi_config_time(8, 0, text("pool.ntp.org"))
    esplink_tls_client_create("secureClient")
    esplink_tls_use_builtin_ca($secureClient)

arduino_loop()
    controls_if()
        @IF0: esplink_tcp_client_connect($secureClient, text("example.com"), math_number(443))
        @DO0:
            esplink_tcp_client_print($secureClient, text("GET / HTTP/1.1"), TRUE)
            esplink_tcp_client_stop($secureClient)
    time_delay(math_number(10000))
```

### UDP echo
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_wifi_connect_quick(text("yourNetwork"), text("yourPassword"), 20000)
    esplink_udp_create("udp", math_number(8888))

arduino_loop()
    controls_if()
        @IF0: logic_compare(esplink_udp_parse_packet($udp), GT, math_number(0))
        @DO0:
            serial_println(Serial, esplink_udp_read_string($udp))
            esplink_udp_send_to($udp, text("ack"), esplink_udp_remote_ip($udp), math_number(8888))
    time_delay(math_number(1))
```

### WiFi event and AP mode
```
arduino_setup()
    serial_begin(Serial, 115200)
    esplink_wifi_softap(text("esplink-ap"), text("12345678"), 1)
    serial_println(Serial, esplink_wifi_softap_ip())

esplink_wifi_on_event(ARDUINO_EVENT_WIFI_AP_STACONNECTED)
    @HANDLER:
        serial_println(Serial, esplink_wifi_softap_station_num())

arduino_loop()
    time_delay(math_number(1))
```

## Notes

1. **Variables**: `esplink_tcp_client_create("client")` creates `$client` of type `WiFiClient`; `esplink_tls_client_create` creates `WiFiClientSecure`; `esplink_tcp_server_create` creates `WiFiServer`; `esplink_udp_create` / `esplink_udp_create_multicast` create `WiFiUDP`. Pass them to this library's field_variable slots as bare `$name`. Client blocks accept both `WiFiClient` and `WiFiClientSecure` variables.
2. **Polling is automatic**: every startup block inserts `WiFi.poll();` at the start of `loop()`. It advances the ESPLink transport and dispatches WiFi events, so do not block the loop with long delays. When the BLE library is also used, both `WiFi.poll();` and `BLE.poll();` are inserted.
3. **ESPLink starts itself**: no `esplink_*` link block is required — the WiFi blocks bring the link up. Place `esplink_begin_serial` before any WiFi block only to change the UART or baud.
4. **Connect and wait**: `esplink_wifi_begin` returns immediately. Either follow it with `esplink_wifi_wait_connected` and compare against `esplink_wifi_status_type(WL_CONNECTED)`, or use `esplink_wifi_connect_quick`, which does both and returns a boolean.
5. **Reading is non-blocking**: `esplink_tcp_client_read_string` and `esplink_udp_read_string` return only the bytes already buffered, so guard them with `esplink_tcp_client_available` or `esplink_udp_parse_packet`.
6. **Session invalidation**: if the C3 restarts, every client, server and UDP object becomes invalid. Recreate or reconnect them; the library never retransmits an unconfirmed write in a new session.
7. **UDP limits**: one datagram is at most 1472 bytes and a longer packet fails as a whole. `esplink_udp_parse_packet` discards whatever is left of the previous datagram.
8. **Server semantics**: `esplink_tcp_server_accept` hands the next incoming connection to the chosen client variable; check it with `esplink_tcp_client_connected` before use. `esplink_tcp_server_write` broadcasts to the clients the server retained, which does not include one taken by accept.
9. **TLS needs a valid clock**: call `esplink_wifi_config_time` before the first HTTPS connection, or certificate validation fails. `esplink_tls_set_insecure` disables validation and should only be used deliberately.
10. **Certificate lifetime**: `esplink_tls_set_pem` copies the PEM into a global `String` named after the variable, because the library keeps the pointer until the connection attempt completes. Each credential is limited to 8192 bytes.
11. **HTTP blocks are convenience wrappers**: they open a connection per call, keep at most 4096 bytes of the body, stop after 15 seconds and return an empty string on failure. For streaming or custom headers, use the TCP client blocks.
12. **Scanning**: the cache holds 32 networks; indexes are 0-based and stay valid until `esplink_wifi_scan_delete`. Async scanning reports progress through `esplink_wifi_scan_complete` (-1 running, -2 failed).
13. **Events are polled**: WiFi events come from periodic state differences, not push notifications, so a very short transient state can be missed. Disconnect reason codes and per-station AP MAC addresses are not available in this protocol revision.
14. **Shared link**: WiFi and BLE share one UART and one RPC channel. A long DNS, TCP or TLS request delays BLE processing; keep event and callback bodies short.
15. **IPv4 only for configuration**: static configuration, AP configuration and server listening are IPv4 only. Address blocks return a string, so compare them as text.
16. **C3 link blocks**: the `esplink_*` group is the shared UART transport. No block from it is required — WiFi blocks start the link themselves. Use `esplink_begin_serial` before any WiFi block only to change UART or baud, and the diagnostic blocks (`esplink_ready`, `esplink_ping`, `esplink_stat`, ...) to check wiring before a network is available. The same group is also shipped by `@aily-project/lib-esplink-ble` with identical definitions, so both libraries can be installed together.
