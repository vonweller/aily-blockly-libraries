# ESP8266 WiFi Mesh

Create an ESP-NOW flooding mesh with the ESP8266 WiFiMesh library.

## Library Info
- **Name**: @aily-project/lib-esp8266-wifi-mesh
- **Version**: 0.0.1
- **Author**: ESP8266 Arduino Core Team
- **Source**: ESP8266 Arduino Core 3.1.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `esp8266_wifi_mesh_begin` | Hat | VAR(field_input), PASSWORD(input_value), PREFIX(input_value), NODE_ID(input_value), VERBOSE(dropdown), HANDLER(input_statement) | `esp8266_wifi_mesh_begin("mesh", text("value"), text("value"), text("value"), false)` | `bool esp8266MeshMessage_mesh(String &message, FloodingMesh &meshInstance); ↵ bool esp8266MeshMessage_mesh(String &message, FloodingMesh &meshInstance) { ↵ return true; ↵ } ↵ FloodingMesh mesh(esp8266MeshMessage_mesh, String("value"), String("aily-esp8266-mesh-encryption"), String("aily-esp8266-mesh-hash"), String("value"), String("value"), false); ↵ mesh.begin(); ↵ mesh.activateAP();` |
| `esp8266_wifi_mesh_broadcast` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp8266_wifi_mesh_broadcast($mesh, MESSAGE)` | `mesh.broadcast(String("value"));` |
| `esp8266_wifi_mesh_encrypted_broadcast` | Statement | VAR(field_variable), MESSAGE(input_value) | `esp8266_wifi_mesh_encrypted_broadcast($mesh, MESSAGE)` | `mesh.encryptedBroadcast(String("value"));` |
| `esp8266_wifi_mesh_maintenance` | Statement | (none) | `esp8266_wifi_mesh_maintenance()` | `FloodingMesh::performMeshMaintenance();` |
| `esp8266_wifi_mesh_deactivate_ap` | Statement | (none) | `esp8266_wifi_mesh_deactivate_ap()` | `FloodingMesh::deactivateAP();` |
| `esp8266_wifi_mesh_message` | Value | (none) | `esp8266_wifi_mesh_message()` | `message` |
| `esp8266_wifi_mesh_origin_mac` | Value | VAR(field_variable) | `esp8266_wifi_mesh_origin_mac($mesh)` | `mesh.getOriginMac()` |
| `esp8266_wifi_mesh_max_plain` | Value | VAR(field_variable) | `esp8266_wifi_mesh_max_plain($mesh)` | `mesh.maxUnencryptedMessageLength()` |
| `esp8266_wifi_mesh_max_encrypted` | Value | VAR(field_variable) | `esp8266_wifi_mesh_max_encrypted($mesh)` | `mesh.maxEncryptedMessageLength()` |

## Parameter Options

| Parameter | Values | Description |
|---|---|---|
| esp8266_wifi_mesh_begin.VERBOSE | false, true | Selects the generated API option. |

## ABS Examples

Use the initialization block first when one is provided.

## Notes

All types use the `esp8266_` prefix. SDK sources are used directly; no `src.7z` is bundled.
## ABS Examples

### Minimal Executable Usage

```abs
arduino_loop()
    esp8266_wifi_mesh_broadcast($mesh, MESSAGE)
```
