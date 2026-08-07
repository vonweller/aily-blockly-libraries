# FirebaseClient

Current asynchronous Firebase client with Realtime Database blocks.

## Library Info
- **Name**: @aily-project/lib-firebase-client
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `firebase_client_init` | Statement | VAR(field_input), API_KEY(input_value), EMAIL(input_value), PASSWORD(input_value), URL(input_value) | `firebase_client_init("firebaseApp", text("value"), text("value"), text("value"), text("value"))` | Dynamic code |
| `firebase_client_ready` | Value | VAR(field_variable) | `firebase_client_ready(variables_get($firebaseApp))` | Dynamic code |
| `firebase_client_set` | Statement | VAR(field_variable), TYPE(dropdown), PATH(input_value), VALUE(input_value) | `firebase_client_set(variables_get($firebaseApp), String, text("value"), math_number(0))` | Dynamic code |
| `firebase_client_get` | Value | VAR(field_variable), TYPE(dropdown), PATH(input_value) | `firebase_client_get(variables_get($firebaseApp), String, text("value"))` | Dynamic code |
| `firebase_client_push` | Statement | VAR(field_variable), TYPE(dropdown), PATH(input_value), VALUE(input_value) | `firebase_client_push(variables_get($firebaseApp), String, text("value"), math_number(0))` | Dynamic code |
| `firebase_client_path_action` | Value | VAR(field_variable), ACTION(dropdown), PATH(input_value) | `firebase_client_path_action(variables_get($firebaseApp), remove, text("value"))` | Dynamic code |
| `firebase_client_last_error` | Value | VAR(field_variable), DATA(dropdown) | `firebase_client_last_error(variables_get($firebaseApp), code)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | String, int, double, bool | firebase_client_set, firebase_client_get, firebase_client_push |
| ACTION | remove, exists | firebase_client_path_action |
| DATA | code, message | firebase_client_last_error |

## ABS Examples

### Basic Usage
```
arduino_setup()
    firebase_client_init("firebaseApp", text("value"), text("value"), text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, firebase_client_ready(variables_get($firebaseApp)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `firebase_client_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
