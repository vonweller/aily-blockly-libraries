# ESP8266 Web Server

HTTP routing, request and response blocks for ESP8266.

## Library Info
- **Name**: @aily-project/lib-esp8266-webserver
- **Version**: 1.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_webserver_create` | Statement | VAR(field_input), PORT(field_number) | `esp8266_webserver_create("server", 80)` | `ESP8266WebServer server(80);` |
| `esp8266_webserver_begin` | Statement | VAR(field_variable) | `esp8266_webserver_begin($server)` | `server.begin();` |
| `esp8266_webserver_stop` | Statement | VAR(field_variable) | `esp8266_webserver_stop($server)` | `server.stop();` |
| `esp8266_webserver_handle_client` | Statement | VAR(field_variable) | `esp8266_webserver_handle_client($server)` | `server.handleClient();` |
| `esp8266_webserver_on` | Statement | VAR(field_variable), METHOD(dropdown), PATH(input_value), HANDLER(input_statement) | `esp8266_webserver_on($server, HTTP_ANY, text("value"))` | `void handle_server_value_http_any() { ↵ } ↵ server.on("value", handle_server_value_http_any);` |
| `esp8266_webserver_on_not_found` | Statement | VAR(field_variable), HANDLER(input_statement) | `esp8266_webserver_on_not_found($server)` | `void handle_server_notfound() { ↵ } ↵ server.onNotFound(handle_server_notfound);` |
| `esp8266_webserver_send` | Statement | VAR(field_variable), CODE(input_value), TYPE(input_value), CONTENT(input_value) | `esp8266_webserver_send($server, CODE, TYPE, CONTENT)` | `server.send(1, "value", "value");` |
| `esp8266_webserver_send_simple` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_simple($server, CONTENT)` | `server.send(200, "text/plain", "value");` |
| `esp8266_webserver_send_html` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_html($server, CONTENT)` | `server.send(200, "text/html", "value");` |
| `esp8266_webserver_send_json` | Statement | VAR(field_variable), CONTENT(input_value) | `esp8266_webserver_send_json($server, CONTENT)` | `server.send(200, "application/json", "value");` |
| `esp8266_webserver_send_error` | Statement | VAR(field_variable), CODE(dropdown), MESSAGE(input_value) | `esp8266_webserver_send_error($server, 400, text("value"))` | `server.send(400, "text/plain", "value");` |
| `esp8266_webserver_send_header` | Statement | VAR(field_variable), NAME(input_value), VALUE(input_value) | `esp8266_webserver_send_header($server, NAME, VALUE)` | `server.sendHeader("value", "value");` |
| `esp8266_webserver_uri` | Value | VAR(field_variable) | `esp8266_webserver_uri($server)` | `server.uri()` |
| `esp8266_webserver_method` | Value | VAR(field_variable) | `esp8266_webserver_method($server)` | `httpMethodToString(server.method())` |
| `esp8266_webserver_arg` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_arg($server, NAME)` | `server.arg("value")` |
| `esp8266_webserver_has_arg` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_has_arg($server, NAME)` | `server.hasArg("value")` |
| `esp8266_webserver_args_count` | Value | VAR(field_variable) | `esp8266_webserver_args_count($server)` | `server.args()` |
| `esp8266_webserver_arg_by_index` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_arg_by_index($server, INDEX)` | `server.arg(1)` |
| `esp8266_webserver_arg_name` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_arg_name($server, INDEX)` | `server.argName(1)` |
| `esp8266_webserver_header` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_header($server, NAME)` | `server.header("value")` |
| `esp8266_webserver_has_header` | Value | VAR(field_variable), NAME(input_value) | `esp8266_webserver_has_header($server, NAME)` | `server.hasHeader("value")` |
| `esp8266_webserver_host_header` | Value | VAR(field_variable) | `esp8266_webserver_host_header($server)` | `server.hostHeader()` |
| `esp8266_webserver_path_arg` | Value | VAR(field_variable), INDEX(input_value) | `esp8266_webserver_path_arg($server, INDEX)` | `server.pathArg(1)` |
| `esp8266_webserver_authenticate` | Value | VAR(field_variable), USERNAME(input_value), PASSWORD(input_value) | `esp8266_webserver_authenticate($server, USERNAME, PASSWORD)` | `server.authenticate("value", "value")` |
| `esp8266_webserver_request_authentication` | Statement | VAR(field_variable), METHOD(dropdown) | `esp8266_webserver_request_authentication($server, BASIC_AUTH)` | `server.requestAuthentication(BASIC_AUTH);` |
| `esp8266_webserver_enable_cors` | Statement | VAR(field_variable), ENABLE(field_checkbox) | `esp8266_webserver_enable_cors($server, TRUE)` | `server.enableCORS(true);` |
| `esp8266_webserver_client_ip` | Value | VAR(field_variable) | `esp8266_webserver_client_ip($server)` | `server.client().remoteIP().toString()` |
| `esp8266_webserver_serve_static` | Statement | VAR(field_variable), URI(input_value), FS(dropdown), PATH(input_value) | `esp8266_webserver_serve_static($server, text("value"), SPIFFS, text("value"))` | `server.serveStatic("value", SPIFFS, "value");` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_webserver_on.METHOD | HTTP_ANY, HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_PATCH, HTTP_OPTIONS | Selects the generated API option. |
| esp8266_webserver_send_error.CODE | 400, 401, 403, 404, 500, 503 | Selects the generated API option. |
| esp8266_webserver_request_authentication.METHOD | BASIC_AUTH, DIGEST_AUTH | Selects the generated API option. |
| esp8266_webserver_serve_static.FS | SPIFFS, LittleFS, SD | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    esp8266_webserver_create("server", 80)
```
