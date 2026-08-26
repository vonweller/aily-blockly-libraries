# Alientek PD42S1 Closed-loop Stepper Driver

Blockly library for Alientek PD42S1 UART, pulse/direction, homing, IO, and status control.

## Library Info
- **Name**: @aily-project/lib-alientek-pd42s1
- **Version**: 1.1.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pd42s1_init` | Statement | TX(field_number), RX(field_number), BAUD(field_number) | `pd42s1_init(19, 20, 115200)` | uart_init_pins(1, |
| `pd42s1_read` | Statement | TYPE(dropdown), ADDR(field_number), TIMEOUT(field_number) | `pd42s1_read(VER, 1, 50)` | Dynamic code |
| `pd42s1_handle_ack` | Statement | TIMEOUT(field_number) | `pd42s1_handle_ack(50)` | pd42s1HandleAck( |
| `pd42s1_torque_mode` | Statement | ADDR(field_number), DIR(dropdown), MA(input_value) | `pd42s1_torque_mode(1, CW, math_number(0))` | smd_torque_mode( |
| `pd42s1_speed_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_speed_mode(1, CW, 100, math_number(9600))` | smd_speed_mode( |
| `pd42s1_pos_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_pos_mode(1, CW, 100, math_number(9600), math_number(0))` | smd_pos_mode( |
| `pd42s1_pos_rel_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_pos_rel_mode(1, CW, 100, math_number(9600), math_number(0))` | smd_pos_rel_mode( |
| `pd42s1_pulse_mode` | Statement | ADDR(field_number) | `pd42s1_pulse_mode(1)` | smd_pulse_mode( |
| `pd42s1_pw_pos_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_POS(input_value), DOWN_POS(input_value) | `pd42s1_pw_pos_mode(1, 2500, 500, math_number(0), math_number(0))` | smd_pulse_width_pos_mode( |
| `pd42s1_pw_ma_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_MA(input_value), DOWN_MA(input_value) | `pd42s1_pw_ma_mode(1, 3500, 500, math_number(0), math_number(0))` | smd_pulse_width_ma_mode( |
| `pd42s1_pw_speed_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_SPEED(input_value), DOWN_SPEED(input_value) | `pd42s1_pw_speed_mode(1, 3300, 300, math_number(9600), math_number(9600))` | smd_pulse_width_speed_mode( |
| `pd42s1_ol_speed_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_ol_speed_mode(1, CW, 100, math_number(9600))` | smd_ol_speed_mode( |
| `pd42s1_ol_pos_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_ol_pos_mode(1, CW, 100, math_number(9600), math_number(0))` | smd_ol_pos_mode( |
| `pd42s1_ol_pos_rel_mode` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_ol_pos_rel_mode(1, CW, 100, math_number(9600), math_number(0))` | smd_ol_pos_rel_mode( |
| `pd42s1_ol_pulse_mode` | Statement | ADDR(field_number) | `pd42s1_ol_pulse_mode(1)` | smd_ol_pulse_mode( |
| `pd42s1_io_run_ctrl` | Statement | ADDR(field_number), DIR(dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_io_run_ctrl(1, CW, 100, math_number(9600))` | smd_io_run_ctrl( |
| `pd42s1_stop_now` | Statement | ADDR(field_number) | `pd42s1_stop_now(1)` | smd_stop_now( |
| `pd42s1_clear_sta` | Statement | ADDR(field_number) | `pd42s1_clear_sta(1)` | smd_clear_sta( |
| `pd42s1_motor_enable` | Statement | ADDR(field_number), ENABLE(dropdown) | `pd42s1_motor_enable(1, ENABLE)` | smd_motor_enable( |
| `pd42s1_angle_zero` | Statement | ADDR(field_number) | `pd42s1_angle_zero(1)` | smd_angle_to_zero( |
| `pd42s1_remove_clog` | Statement | ADDR(field_number) | `pd42s1_remove_clog(1)` | smd_remove_clog_protect( |
| `pd42s1_cal_encoder` | Statement | ADDR(field_number) | `pd42s1_cal_encoder(1)` | smd_cal_encoder( |
| `pd42s1_restart` | Statement | ADDR(field_number) | `pd42s1_restart(1)` | smd_restart( |
| `pd42s1_reset_factory` | Statement | ADDR(field_number) | `pd42s1_reset_factory(1)` | smd_reset_factory( |
| `pd42s1_param_save` | Statement | ADDR(field_number) | `pd42s1_param_save(1)` | smd_param_save( |
| `pd42s1_set_slave_add` | Statement | ADDR(field_number), NEW_ADDR(field_number) | `pd42s1_set_slave_add(1, 2)` | smd_set_slave_add( |
| `pd42s1_set_group_add` | Statement | ADDR(field_number), NEW_ADDR(field_number) | `pd42s1_set_group_add(1, 0)` | smd_set_group_add( |
| `pd42s1_set_mode` | Statement | ADDR(field_number), MODE(dropdown) | `pd42s1_set_mode(1, COMM_POS)` | smd_set_mode( |
| `pd42s1_set_pos_pid` | Statement | ADDR(field_number), KP(input_value), KI(input_value), KD(input_value) | `pd42s1_set_pos_pid(1, math_number(0), math_number(0), math_number(0))` | smd_set_pos_pid( |
| `pd42s1_set_speed_pid` | Statement | ADDR(field_number), KP(input_value), KI(input_value), KD(input_value) | `pd42s1_set_speed_pid(1, math_number(0), math_number(0), math_number(0))` | smd_set_speed_pid( |
| `pd42s1_set_pos_torque` | Statement | ADDR(field_number), TORQUE(input_value) | `pd42s1_set_pos_torque(1, math_number(0))` | smd_set_pos_torque( |
| `pd42s1_set_step` | Statement | ADDR(field_number), STEP(field_number) | `pd42s1_set_step(1, 16)` | smd_set_step( |
| `pd42s1_set_ma` | Statement | ADDR(field_number), MA(input_value) | `pd42s1_set_ma(1, math_number(0))` | smd_set_ma( |
| `pd42s1_set_uart_baud` | Statement | ADDR(field_number), BAUD(field_number) | `pd42s1_set_uart_baud(1, 115200)` | smd_set_uart_baud( |
| `pd42s1_set_can_baud` | Statement | ADDR(field_number), BAUD(field_number) | `pd42s1_set_can_baud(1, 500)` | smd_set_can_baud( |
| `pd42s1_set_modbus` | Statement | ADDR(field_number), MODBUS(dropdown) | `pd42s1_set_modbus(1, CUSTOM)` | smd_set_modbus( |
| `pd42s1_set_clog_pro` | Statement | ADDR(field_number), OFFON(dropdown) | `pd42s1_set_clog_pro(1, OFF)` | smd_set_clog_pro( |
| `pd42s1_set_clog_current` | Statement | ADDR(field_number), MA(input_value) | `pd42s1_set_clog_current(1, math_number(0))` | smd_set_clog_current( |
| `pd42s1_set_can_id` | Statement | ADDR(field_number), CAN_ID(field_number) | `pd42s1_set_can_id(1, 1)` | smd_set_can_id( |
| `pd42s1_set_dir_level` | Statement | ADDR(field_number), DIRLV(dropdown) | `pd42s1_set_dir_level(1, HIGH)` | smd_set_dir_level( |
| `pd42s1_set_en_level` | Statement | ADDR(field_number), ENLV(dropdown) | `pd42s1_set_en_level(1, LOW)` | smd_set_en_level( |
| `pd42s1_set_cmd_echo` | Statement | ADDR(field_number), ECHO(dropdown) | `pd42s1_set_cmd_echo(1, ECHO)` | smd_set_cmd_echo( |
| `pd42s1_set_key_lock` | Statement | ADDR(field_number), LOCK(dropdown) | `pd42s1_set_key_lock(1, UNLOCK)` | smd_set_key_lock( |
| `pd42s1_set_auto_display` | Statement | ADDR(field_number), OFFON(dropdown) | `pd42s1_set_auto_display(1, OFF)` | smd_set_auto_not_display( |
| `pd42s1_set_io_start_level` | Statement | ADDR(field_number), IOLV(dropdown) | `pd42s1_set_io_start_level(1, LOW)` | smd_set_io_start_level( |
| `pd42s1_origin_left_pos` | Statement | ADDR(field_number), POS(input_value) | `pd42s1_origin_left_pos(1, math_number(0))` | smd_origin_set_left_pos( |
| `pd42s1_origin_right_pos` | Statement | ADDR(field_number), POS(input_value) | `pd42s1_origin_right_pos(1, math_number(0))` | smd_origin_set_right_pos( |
| `pd42s1_origin_homing` | Statement | ADDR(field_number), LIMIT(dropdown), DIR(dropdown), SPEED_RPM(field_number), CURR_MA(field_number) | `pd42s1_origin_homing(1, NO_LIMIT, CW, 100, 500)` | smd_origin_homing_by_limit( |
| `pd42s1_origin_trig` | Statement | ADDR(field_number), TRIG(dropdown) | `pd42s1_origin_trig(1, SINGLE)` | smd_origin_trig( |
| `pd42s1_origin_break` | Statement | ADDR(field_number) | `pd42s1_origin_break(1)` | smd_origin_break( |
| `pd42s1_origin_timeout` | Statement | ADDR(field_number), TIMEOUT_MS(field_number) | `pd42s1_origin_timeout(1, 10000)` | smd_origin_set_params( |
| `pd42s1_origin_auto` | Statement | ADDR(field_number), OFFON(dropdown) | `pd42s1_origin_auto(1, OFF)` | smd_origin_aoto_zero( |
| `pd42s1_origin_switch` | Statement | ADDR(field_number), OFFON(dropdown) | `pd42s1_origin_switch(1, OFF)` | smd_origin_l_r_switch( |
| `pd42s1_pulse_pin_init` | Statement | EN_PIN(field_number), STEP_PIN(field_number), DIR_PIN(field_number) | `pd42s1_pulse_pin_init(35, 36, 37)` | pulse_init_pins( |
| `pd42s1_pulse_en` | Statement | LEVEL(dropdown) | `pd42s1_pulse_en(HIGH)` | pulse_en( |
| `pd42s1_pulse_en_toggle` | Statement | (none) | `pd42s1_pulse_en_toggle()` | pulse_en_toggle();\n |
| `pd42s1_pulse_dir` | Statement | LEVEL(dropdown) | `pd42s1_pulse_dir(HIGH)` | pulse_dir( |
| `pd42s1_pulse_dir_toggle` | Statement | (none) | `pd42s1_pulse_dir_toggle()` | pulse_dir_toggle();\n |
| `pd42s1_pulse_output` | Statement | COUNT(input_value), HALF_US(field_number) | `pd42s1_pulse_output(math_number(0), 100)` | pulse_output( |
| `pd42s1_pulse_freq_from_rpm` | Value | STEP(input_value), RPM(input_value) | `pd42s1_pulse_freq_from_rpm(math_number(0), math_number(0))` | pd42s1_freq_from_rpm( |
| `pd42s1_pulse_rpm_from_freq` | Value | FREQ(input_value), STEP(input_value) | `pd42s1_pulse_rpm_from_freq(math_number(0), math_number(0))` | pd42s1_rpm_from_freq( |
| `pd42s1_io_pin_init` | Statement | PIN(field_number) | `pd42s1_io_pin_init(39)` | io_start_stop_init_pins( |
| `pd42s1_io_pin_set` | Statement | LEVEL(dropdown) | `pd42s1_io_pin_set(HIGH)` | io_start_stop_set( |
| `pd42s1_io_pin_toggle` | Statement | (none) | `pd42s1_io_pin_toggle()` | io_start_stop_toggle();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | VER, PSI, RES_IND, PHASE_MA, VOL, MA_PID, SPEED_PID, POS_PID, TOTAL_PULSE, RPM, POS, POS_ERR, MOTOR_STA, CLOG_FLAG, CLOG_MA, EN_STA, ARRIVED, SYS_PARAMS, DRIVE_PARAMS, HOME_PARAMS, ... | pd42s1_read |
| DIR | CW, CCW | pd42s1_torque_mode, pd42s1_speed_mode, pd42s1_pos_mode |
| ENABLE | ENABLE, DISABLE | pd42s1_motor_enable |
| MODE | COMM_POS, COMM_SPEED, COMM_TORQUE, PULSE, PW_POS, PW_SPEED, PW_TORQUE, HOME, OL_SPEED, OL_POS, OL_PULSE | pd42s1_set_mode |
| MODBUS | CUSTOM, MODBUS | pd42s1_set_modbus |
| OFFON | OFF, ON | pd42s1_set_clog_pro, pd42s1_set_auto_display, pd42s1_origin_auto |
| DIRLV | HIGH, LOW | pd42s1_set_dir_level |
| ENLV | LOW, HIGH, ALWAYS | pd42s1_set_en_level |
| ECHO | ECHO, NO_ECHO | pd42s1_set_cmd_echo |
| LOCK | UNLOCK, LOCK | pd42s1_set_key_lock |
| IOLV | LOW, HIGH | pd42s1_set_io_start_level |
| LIMIT | NO_LIMIT, WITH_LIMIT | pd42s1_origin_homing |
| TRIG | SINGLE, NEAREST, MULTI | pd42s1_origin_trig |
| LEVEL | HIGH, LOW | pd42s1_pulse_en, pd42s1_pulse_dir, pd42s1_io_pin_set |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pd42s1_init(19, 20, 115200)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pd42s1_pulse_freq_from_rpm(math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
