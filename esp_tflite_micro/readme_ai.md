# ESP TFLite Micro

ESP TensorFlow Lite Micro model setup, tensors, quantization, and inference.

## Library Info
- **Name**: @aily-project/lib-esp-tflite-micro
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp_tflite_init` | Statement | VAR(field_input), HEADER(field_input), MODEL(field_input), ARENA(field_number) | `esp_tflite_init("tflm", "model.h", "g_model", 65536)` | Dynamic code |
| `esp_tflite_input_set` | Statement | VAR(field_variable), INDEX(input_value), TYPE(dropdown), VALUE(input_value) | `esp_tflite_input_set(variables_get($tflm), math_number(0), float, math_number(0))` | if ( |
| `esp_tflite_invoke` | Value | VAR(field_variable) | `esp_tflite_invoke(variables_get($tflm))` | Dynamic code |
| `esp_tflite_output_get` | Value | VAR(field_variable), INDEX(input_value), TYPE(dropdown) | `esp_tflite_output_get(variables_get($tflm), math_number(0), float)` | Dynamic code |
| `esp_tflite_tensor_info` | Value | VAR(field_variable), TENSOR(dropdown), INFO(dropdown) | `esp_tflite_tensor_info(variables_get($tflm), input, bytes)` | Dynamic code |
| `esp_tflite_ready` | Value | VAR(field_variable) | `esp_tflite_ready(variables_get($tflm))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | float, int8, uint8, quantized | esp_tflite_input_set |
| TYPE | float, int8, uint8, dequantized | esp_tflite_output_get |
| TENSOR | input, output | esp_tflite_tensor_info |
| INFO | bytes, count, type, scale, zero_point | esp_tflite_tensor_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp_tflite_init("tflm", "model.h", "g_model", 65536)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp_tflite_invoke(variables_get($tflm)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp_tflite_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
