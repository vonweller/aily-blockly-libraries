# CyberCAM Complete

Complete Python blocks for the 01Studio CyberCAM K230 camera, display, AI, GPIO, PWM, UART, networking, files, audio, IMU, and system features.

## Library Info
- **Name**: @aily-project/lib-cybercam
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cybercam_start` | Hat | DO(input_statement) | `cybercam_start() @DO: child_block()` | generator |
| `cybercam_forever` | Hat | DO(input_statement) | `cybercam_forever() @DO: child_block()` | generator |
| `cybercam_sleep` | Statement | SECONDS(input_value) | `cybercam_sleep(math_number(0))` | generator |
| `cybercam_print` | Statement | VALUE(input_value) | `cybercam_print(math_number(0))` | generator |
| `cybercam_number` | Value | VALUE(field_number) | `cybercam_number(0)` | generator |
| `cybercam_text` | Value | VALUE(field_input) | `cybercam_text("VALUE")` | generator |
| `cybercam_boolean` | Value | VALUE(dropdown) | `cybercam_boolean(TRUE)` | generator |
| `cybercam_tuple` | Value | ITEMS(input_value) | `cybercam_tuple(math_number(1000))` | generator |
| `cybercam_list` | Value | ITEMS(input_value) | `cybercam_list(math_number(1000))` | generator |
| `cybercam_set_variable` | Statement | NAME(field_input), VALUE(input_value) | `cybercam_set_variable("value", math_number(0))` | generator |
| `cybercam_get_variable` | Value | NAME(field_input) | `cybercam_get_variable("value")` | generator |
| `cybercam_if` | Statement | CONDITION(input_value), DO(input_statement) | `cybercam_if(logic_boolean(TRUE)) @DO: child_block()` | generator |
| `cybercam_for_each` | Statement | NAME(field_input), ITEMS(input_value), DO(input_statement) | `cybercam_for_each("item", math_number(1000)) @DO: child_block()` | generator |
| `cybercam_gpio_init` | Statement | NAME(field_input), PIN(dropdown), DIRECTION(dropdown), PULL(dropdown) | `cybercam_gpio_init("pin", PIN, INPUT, NONE)` | generator |
| `cybercam_gpio_write` | Statement | NAME(field_input), VALUE(input_value) | `cybercam_gpio_write("pin", logic_boolean(TRUE))` | generator |
| `cybercam_gpio_read` | Value | NAME(field_input) | `cybercam_gpio_read("pin")` | generator |
| `cybercam_led_write` | Statement | VALUE(input_value) | `cybercam_led_write(logic_boolean(TRUE))` | generator |
| `cybercam_key_pressed` | Value | (none) | `cybercam_key_pressed()` | generator |
| `cybercam_pwm_init` | Statement | NAME(field_input), TARGET(dropdown) | `cybercam_pwm_init("pwm", "0,0")` | generator |
| `cybercam_pwm_frequency` | Statement | NAME(field_input), FREQUENCY(input_value) | `cybercam_pwm_frequency("pwm", math_number(0))` | generator |
| `cybercam_pwm_duty` | Statement | NAME(field_input), DUTY(input_value) | `cybercam_pwm_duty("pwm", math_number(0))` | generator |
| `cybercam_pwm_enable` | Statement | NAME(field_input) | `cybercam_pwm_enable("pwm")` | generator |
| `cybercam_pwm_disable` | Statement | NAME(field_input) | `cybercam_pwm_disable("pwm")` | generator |
| `cybercam_pwm_close` | Statement | NAME(field_input) | `cybercam_pwm_close("pwm")` | generator |
| `cybercam_uart_init` | Statement | NAME(field_input), BAUD(dropdown) | `cybercam_uart_init("uart", "9600")` | generator |
| `cybercam_uart_available` | Value | NAME(field_input) | `cybercam_uart_available("uart")` | generator |
| `cybercam_uart_read` | Value | NAME(field_input), SIZE(input_value) | `cybercam_uart_read("uart", math_number(0))` | generator |
| `cybercam_uart_write` | Statement | NAME(field_input), DATA(input_value) | `cybercam_uart_write("uart", math_number(0))` | generator |
| `cybercam_uart_flush` | Statement | NAME(field_input) | `cybercam_uart_flush("uart")` | generator |
| `cybercam_camera_init` | Statement | NAME(field_input), WIDTH(input_value), HEIGHT(input_value), SENSOR_ID(dropdown) | `cybercam_camera_init("camera", math_number(0), math_number(0), "2")` | generator |
| `cybercam_camera_opened` | Value | NAME(field_input) | `cybercam_camera_opened("camera")` | generator |
| `cybercam_camera_read` | Value | NAME(field_input) | `cybercam_camera_read("camera")` | generator |
| `cybercam_camera_hmirror` | Statement | NAME(field_input), ENABLED(input_value) | `cybercam_camera_hmirror("camera", logic_boolean(TRUE))` | generator |
| `cybercam_camera_vflip` | Statement | NAME(field_input), ENABLED(input_value) | `cybercam_camera_vflip("camera", logic_boolean(TRUE))` | generator |
| `cybercam_camera_release` | Statement | NAME(field_input) | `cybercam_camera_release("camera")` | generator |
| `cybercam_display_init` | Statement | (none) | `cybercam_display_init()` | generator |
| `cybercam_display_rotation` | Statement | ROTATION(dropdown) | `cybercam_display_rotation("0")` | generator |
| `cybercam_display_show` | Statement | IMAGE(input_value) | `cybercam_display_show(math_number(0))` | generator |
| `cybercam_ide_show` | Statement | IMAGE(input_value) | `cybercam_ide_show(math_number(0))` | generator |
| `cybercam_lcd_direction` | Value | (none) | `cybercam_lcd_direction()` | generator |
| `cybercam_image_resize` | Value | IMAGE(input_value), WIDTH(input_value), HEIGHT(input_value) | `cybercam_image_resize(math_number(0), math_number(0), math_number(0))` | generator |
| `cybercam_image_convert` | Value | IMAGE(input_value), CONVERSION(dropdown) | `cybercam_image_convert(math_number(0), COLOR_BGR2GRAY)` | generator |
| `cybercam_image_in_range` | Value | IMAGE(input_value), LOWER(input_value), UPPER(input_value) | `cybercam_image_in_range(math_number(0), math_number(0), math_number(0))` | generator |
| `cybercam_image_components` | Value | IMAGE(input_value), CONNECTIVITY(dropdown) | `cybercam_image_components(math_number(0), "4")` | generator |
| `cybercam_image_load` | Value | PATH(input_value) | `cybercam_image_load(text("value"))` | generator |
| `cybercam_image_save` | Statement | IMAGE(input_value), PATH(input_value) | `cybercam_image_save(math_number(0), text("value"))` | generator |
| `cybercam_draw_rectangle` | Statement | IMAGE(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value),... | `cybercam_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), ...)` | generator |
| `cybercam_draw_circle` | Statement | IMAGE(input_value), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_va... | `cybercam_draw_circle(math_number(0), math_number(0), math_number(0), math_number(0), ...)` | generator |
| `cybercam_draw_line` | Statement | IMAGE(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value),... | `cybercam_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), ...)` | generator |
| `cybercam_draw_text` | Statement | TEXT(input_value), IMAGE(input_value), X(input_value), Y(input_value), SCALE(input_valu... | `cybercam_draw_text(text("value"), math_number(0), math_number(0), math_number(0), ...)` | generator |
| `cybercam_qr_decode` | Value | IMAGE(input_value) | `cybercam_qr_decode(math_number(0))` | generator |
| `cybercam_barcode_decode` | Value | IMAGE(input_value) | `cybercam_barcode_decode(math_number(0))` | generator |
| `cybercam_apriltag_init` | Statement | NAME(field_input), FAMILY(dropdown) | `cybercam_apriltag_init("tags", tag16h5)` | generator |
| `cybercam_apriltag_detect` | Value | NAME(field_input), IMAGE(input_value) | `cybercam_apriltag_detect("tags", math_number(0))` | generator |
| `cybercam_ai_init_simple` | Statement | NAME(field_input), MODEL(dropdown), MODEL_PATH(input_value), MODEL_SIZE(input_value) | `cybercam_ai_init_simple("detector", FALL_DETECT, text("value"), math_number(0))` | generator |
| `cybercam_ai_init_face` | Statement | NAME(field_input), MODEL_PATH(input_value), ANCHORS_PATH(input_value), MODEL_SIZE(input... | `cybercam_ai_init_face("detector", text("value"), text("value"), math_number(0))` | generator |
| `cybercam_ai_init_mask` | Statement | NAME(field_input), DETECT_MODEL(input_value), ANCHORS_PATH(input_value), MODEL_SIZE(inp... | `cybercam_ai_init_mask("detector", text("value"), text("value"), math_number(0), ...)` | generator |
| `cybercam_ai_init_hand_keypoint` | Statement | NAME(field_input), MODEL(dropdown), DETECT_MODEL(input_value), KEYPOINT_MODEL(input_value) | `cybercam_ai_init_hand_keypoint("detector", HAND_KEYPOINT, text("value"), text("value"))` | generator |
| `cybercam_ai_init_ocr` | Statement | NAME(field_input), DETECT_MODEL(input_value), RECOGNITION_MODEL(input_value), DICTIONAR... | `cybercam_ai_init_ocr("ocr", text("value"), text("value"), text("value"), ...)` | generator |
| `cybercam_ai_init_licence` | Statement | NAME(field_input), DETECT_MODEL(input_value), RECOGNITION_MODEL(input_value), ANCHORS_P... | `cybercam_ai_init_licence("licence", text("value"), text("value"), text("value"), ...)` | generator |
| `cybercam_ai_run` | Value | NAME(field_input), IMAGE(input_value) | `cybercam_ai_run("detector", math_number(0))` | generator |
| `cybercam_ai_run_confidence` | Value | NAME(field_input), IMAGE(input_value), CONFIDENCE(input_value) | `cybercam_ai_run_confidence("detector", math_number(0), math_number(0))` | generator |
| `cybercam_ai_run_thresholds` | Value | NAME(field_input), IMAGE(input_value), CONFIDENCE(input_value), NMS(input_value) | `cybercam_ai_run_thresholds("detector", math_number(0), math_number(0), math_number(1000))` | generator |
| `cybercam_result_length` | Value | RESULTS(input_value) | `cybercam_result_length(math_number(0))` | generator |
| `cybercam_result_item` | Value | RESULTS(input_value), INDEX(input_value) | `cybercam_result_item(math_number(0), math_number(0))` | generator |
| `cybercam_result_property` | Value | RESULT(input_value), PROPERTY(dropdown) | `cybercam_result_property(math_number(0), reliability)` | generator |
| `cybercam_socket_init` | Statement | NAME(field_input), FAMILY(dropdown), TYPE(dropdown) | `cybercam_socket_init("sock", AF_INET, SOCK_STREAM)` | generator |
| `cybercam_socket_address` | Value | HOST(input_value), PORT(input_value) | `cybercam_socket_address(text("value"), math_number(0))` | generator |
| `cybercam_socket_connect` | Statement | NAME(field_input), ADDRESS(input_value) | `cybercam_socket_connect("sock", math_number(0))` | generator |
| `cybercam_socket_bind` | Statement | NAME(field_input), ADDRESS(input_value) | `cybercam_socket_bind("sock", math_number(0))` | generator |
| `cybercam_socket_listen` | Statement | NAME(field_input), BACKLOG(input_value) | `cybercam_socket_listen("sock", math_number(0))` | generator |
| `cybercam_socket_accept` | Value | NAME(field_input) | `cybercam_socket_accept("sock")` | generator |
| `cybercam_socket_send` | Statement | NAME(field_input), DATA(input_value) | `cybercam_socket_send("sock", math_number(0))` | generator |
| `cybercam_socket_receive` | Value | NAME(field_input), SIZE(input_value) | `cybercam_socket_receive("sock", math_number(0))` | generator |
| `cybercam_socket_close` | Statement | NAME(field_input) | `cybercam_socket_close("sock")` | generator |
| `cybercam_mqtt_init` | Statement | NAME(field_input) | `cybercam_mqtt_init("client")` | generator |
| `cybercam_mqtt_connect` | Statement | NAME(field_input), HOST(input_value), PORT(input_value), KEEPALIVE(input_value) | `cybercam_mqtt_connect("client", text("value"), math_number(0), math_number(0))` | generator |
| `cybercam_mqtt_publish` | Statement | NAME(field_input), TOPIC(input_value), MESSAGE(input_value) | `cybercam_mqtt_publish("client", text("value"), text("value"))` | generator |
| `cybercam_mqtt_subscribe` | Statement | NAME(field_input), TOPIC(input_value) | `cybercam_mqtt_subscribe("client", text("value"))` | generator |
| `cybercam_mqtt_loop` | Statement | NAME(field_input) | `cybercam_mqtt_loop("client")` | generator |
| `cybercam_mqtt_disconnect` | Statement | NAME(field_input) | `cybercam_mqtt_disconnect("client")` | generator |
| `cybercam_http_request` | Value | METHOD(dropdown), URL(input_value), DATA(input_value) | `cybercam_http_request(GET, text("value"), math_number(0))` | generator |
| `cybercam_http_response` | Value | RESPONSE(input_value), PROPERTY(dropdown) | `cybercam_http_response(math_number(0), status_code)` | generator |
| `cybercam_http_server` | Statement | HOST(input_value), PORT(input_value) | `cybercam_http_server(text("value"), math_number(0))` | generator |
| `cybercam_file_read` | Value | PATH(input_value) | `cybercam_file_read(text("value"))` | generator |
| `cybercam_file_write` | Statement | MODE(dropdown), PATH(input_value), CONTENT(input_value) | `cybercam_file_write(w, text("value"), math_number(0))` | generator |
| `cybercam_file_exists` | Value | PATH(input_value) | `cybercam_file_exists(text("value"))` | generator |
| `cybercam_file_list` | Value | PATH(input_value) | `cybercam_file_list(text("value"))` | generator |
| `cybercam_command` | Value | COMMAND(input_value) | `cybercam_command(text("value"))` | generator |
| `cybercam_audio_play` | Statement | PATH(input_value) | `cybercam_audio_play(text("value"))` | generator |
| `cybercam_audio_record` | Statement | PATH(input_value), SECONDS(input_value), RATE(input_value) | `cybercam_audio_record(text("value"), math_number(0), math_number(0))` | generator |
| `cybercam_imu_init` | Statement | NAME(field_input), BUS(input_value), ADDRESS(input_value) | `cybercam_imu_init("imu", math_number(0), math_number(0))` | generator |
| `cybercam_imu_read` | Value | NAME(field_input) | `cybercam_imu_read("imu")` | generator |
| `cybercam_imu_axis` | Value | NAME(field_input), AXIS(dropdown) | `cybercam_imu_axis("imu", "0")` | generator |
| `cybercam_imu_calibrate` | Statement | NAME(field_input), SAMPLES(input_value) | `cybercam_imu_calibrate("imu", math_number(0))` | generator |
| `cybercam_cpu_temperature` | Value | (none) | `cybercam_cpu_temperature()` | generator |
| `cybercam_chip_id` | Value | (none) | `cybercam_chip_id()` | generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VALUE | TRUE, FALSE | cybercam_boolean |
| DIRECTION | INPUT, OUTPUT | cybercam_gpio_init |
| PULL | NONE, UP, DOWN | cybercam_gpio_init |
| TARGET | 0,0, 0,1, 0,2, 1,0, 1,2 | cybercam_pwm_init |
| BAUD | 9600, 19200, 38400, 57600, 115200 | cybercam_uart_init |
| SENSOR_ID | 2, 0 | cybercam_camera_init |
| ROTATION | 0, 2 | cybercam_display_rotation |
| CONVERSION | COLOR_BGR2GRAY, COLOR_BGR2LAB, COLOR_BGR2RGB, COLOR_GRAY2BGR | cybercam_image_convert |
| CONNECTIVITY | 4, 8 | cybercam_image_components |
| FAMILY | tag16h5, tag25h7, tag25h9, tag36h10, tag36h11 | cybercam_apriltag_init |
| MODEL | FALL_DETECT, HAND_DETECT, PERSON_DETECT, PERSON_KEYPOINT, SMOKE_DETECT, TRAFF... | cybercam_ai_init_simple |
| MODEL | HAND_KEYPOINT, HAND_KEYPOINT_CLS | cybercam_ai_init_hand_keypoint |
| PROPERTY | reliability, x, y, w, h, label, text, keypoints, ... | cybercam_result_property |
| FAMILY | AF_INET, AF_INET6 | cybercam_socket_init |
| TYPE | SOCK_STREAM, SOCK_DGRAM | cybercam_socket_init |
| METHOD | GET, POST, PUT, DELETE | cybercam_http_request |
| PROPERTY | status_code, text, json() | cybercam_http_response |
| MODE | w, a | cybercam_file_write |
| AXIS | 0, 1, 2, 3, 4, 5 | cybercam_imu_axis |

## Notes

Parameters follow `block.json`; inputs accept value blocks.
