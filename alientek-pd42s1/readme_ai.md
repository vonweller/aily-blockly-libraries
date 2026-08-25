# 正点原子 PD42S1 闭环步进驱动器积木库

通过 UART 串口（串口1）控制正点原子 PD42S1 闭环步进电机驱动器，覆盖上游 smd/uart/process_frame 全部 71 个协议函数。

## Library Info

- **Name**: @aily-project/lib-alientek-pd42s1
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `pd42s1_init` | Statement | TX(field_number), RX(field_number), BAUD(field_number) | `pd42s1_init(19, 20, 115200)` | `uart_init_pins(1, 115200, 19, 20);` |
| `pd42s1_read` | Statement | TYPE(field_dropdown), ADDR(field_number), TIMEOUT(field_number) | `pd42s1_read(POS, 1, 50)` | `smd_read_pos(1); ↵ pd42s1HandleAck(50);` |
| `pd42s1_handle_ack` | Statement | TIMEOUT(field_number) | `pd42s1_handle_ack(50)` | `pd42s1HandleAck(50);` |
| `pd42s1_torque_mode` | Statement | ADDR(field_number), DIR(field_dropdown), MA(input_value) | `pd42s1_torque_mode(1, CW, math_number(500))` | `smd_torque_mode(1, 0, 500);` |
| `pd42s1_speed_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_speed_mode(1, CW, 100, math_number(600))` | `smd_speed_mode(1, 0, 100, 600);` |
| `pd42s1_pos_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_pos_mode(1, CW, 100, math_number(600), math_number(51200))` | `smd_pos_mode(1, 0, 100, 600, 51200);` |
| `pd42s1_pos_rel_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_pos_rel_mode(1, CW, 100, math_number(600), math_number(51200))` | `smd_pos_rel_mode(1, 0, 100, 600, 51200);` |
| `pd42s1_pulse_mode` | Statement | ADDR(field_number) | `pd42s1_pulse_mode(1)` | `smd_pulse_mode(1);` |
| `pd42s1_pw_pos_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_POS(input_value), DOWN_POS(input_value) | `pd42s1_pw_pos_mode(1, 2500, 500, math_number(25600), math_number(0))` | `smd_pulse_width_pos_mode(1, 2500, 500, 25600, 0);` |
| `pd42s1_pw_ma_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_MA(input_value), DOWN_MA(input_value) | `pd42s1_pw_ma_mode(1, 3500, 500, math_number(3000), math_number(0))` | `smd_pulse_width_ma_mode(1, 3500, 500, 3000, 0);` |
| `pd42s1_pw_speed_mode` | Statement | ADDR(field_number), TOPW_MAX(field_number), TOPW_MIN(field_number), TOP_SPEED(input_value), DOWN_SPEED(input_value) | `pd42s1_pw_speed_mode(1, 3300, 300, math_number(6000), math_number(0))` | `smd_pulse_width_speed_mode(1, 3300, 300, 6000, 0);` |
| `pd42s1_ol_speed_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_ol_speed_mode(1, CW, 100, math_number(600))` | `smd_ol_speed_mode(1, 0, 100, 600);` |
| `pd42s1_ol_pos_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_ol_pos_mode(1, CW, 100, math_number(600), math_number(51200))` | `smd_ol_pos_mode(1, 0, 100, 600, 51200);` |
| `pd42s1_ol_pos_rel_mode` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value), PULSES(input_value) | `pd42s1_ol_pos_rel_mode(1, CW, 100, math_number(600), math_number(51200))` | `smd_ol_pos_rel_mode(1, 0, 100, 600, 51200);` |
| `pd42s1_ol_pulse_mode` | Statement | ADDR(field_number) | `pd42s1_ol_pulse_mode(1)` | `smd_ol_pulse_mode(1);` |
| `pd42s1_io_run_ctrl` | Statement | ADDR(field_number), DIR(field_dropdown), ACC(field_number), SPEED(input_value) | `pd42s1_io_run_ctrl(1, CW, 100, math_number(600))` | `smd_io_run_ctrl(1, 0, 100, 600);` |
| `pd42s1_stop_now` | Statement | ADDR(field_number) | `pd42s1_stop_now(1)` | `smd_stop_now(1);` |
| `pd42s1_clear_sta` | Statement | ADDR(field_number) | `pd42s1_clear_sta(1)` | `smd_clear_sta(1);` |
| `pd42s1_motor_enable` | Statement | ADDR(field_number), ENABLE(field_dropdown) | `pd42s1_motor_enable(1, ENABLE)` | `smd_motor_enable(1, 0);` |
| `pd42s1_angle_zero` | Statement | ADDR(field_number) | `pd42s1_angle_zero(1)` | `smd_angle_to_zero(1);` |
| `pd42s1_remove_clog` | Statement | ADDR(field_number) | `pd42s1_remove_clog(1)` | `smd_remove_clog_protect(1);` |
| `pd42s1_set_slave_add` | Statement | ADDR(field_number), NEW_ADDR(field_number) | `pd42s1_set_slave_add(1, 2)` | `smd_set_slave_add(1, 2);` |
| `pd42s1_set_group_add` | Statement | ADDR(field_number), NEW_ADDR(field_number) | `pd42s1_set_group_add(1, 0)` | `smd_set_group_add(1, 0);` |
| `pd42s1_set_mode` | Statement | ADDR(field_number), MODE(field_dropdown) | `pd42s1_set_mode(1, COMM_POS)` | `smd_set_mode(1, 0);` |
| `pd42s1_set_pos_pid` | Statement | ADDR(field_number), KP(input_value), KI(input_value), KD(input_value) | `pd42s1_set_pos_pid(1, math_number(0), math_number(0), math_number(0))` | `smd_set_pos_pid(1, 0, 0, 0);` |
| `pd42s1_set_speed_pid` | Statement | ADDR(field_number), KP(input_value), KI(input_value), KD(input_value) | `pd42s1_set_speed_pid(1, math_number(0), math_number(0), math_number(0))` | `smd_set_speed_pid(1, 0, 0, 0);` |
| `pd42s1_set_pos_torque` | Statement | ADDR(field_number), TORQUE(input_value) | `pd42s1_set_pos_torque(1, math_number(1500))` | `smd_set_pos_torque(1, 1500);` |
| `pd42s1_set_step` | Statement | ADDR(field_number), STEP(field_number) | `pd42s1_set_step(1, 16)` | `smd_set_step(1, 16);` |
| `pd42s1_set_ma` | Statement | ADDR(field_number), MA(input_value) | `pd42s1_set_ma(1, math_number(1000))` | `smd_set_ma(1, 1000);` |
| `pd42s1_set_uart_baud` | Statement | ADDR(field_number), BAUD(field_number) | `pd42s1_set_uart_baud(1, 115200)` | `smd_set_uart_baud(1, 115200);` |
| `pd42s1_set_can_baud` | Statement | ADDR(field_number), BAUD(field_number) | `pd42s1_set_can_baud(1, 500)` | `smd_set_can_baud(1, 500);` |
| `pd42s1_set_modbus` | Statement | ADDR(field_number), MODBUS(field_dropdown) | `pd42s1_set_modbus(1, CUSTOM)` | `smd_set_modbus(1, 0);` |
| `pd42s1_set_clog_pro` | Statement | ADDR(field_number), OFFON(field_dropdown) | `pd42s1_set_clog_pro(1, OFF)` | `smd_set_clog_pro(1, 0);` |
| `pd42s1_set_clog_current` | Statement | ADDR(field_number), MA(input_value) | `pd42s1_set_clog_current(1, math_number(1500))` | `smd_set_clog_current(1, 1500);` |
| `pd42s1_set_can_id` | Statement | ADDR(field_number), CAN_ID(field_number) | `pd42s1_set_can_id(1, 1)` | `smd_set_can_id(1, 1);` |
| `pd42s1_set_dir_level` | Statement | ADDR(field_number), DIRLV(field_dropdown) | `pd42s1_set_dir_level(1, HIGH)` | `smd_set_dir_level(1, 0);` |
| `pd42s1_set_en_level` | Statement | ADDR(field_number), ENLV(field_dropdown) | `pd42s1_set_en_level(1, LOW)` | `smd_set_en_level(1, 0);` |
| `pd42s1_set_cmd_echo` | Statement | ADDR(field_number), ECHO(field_dropdown) | `pd42s1_set_cmd_echo(1, ECHO)` | `smd_set_cmd_echo(1, 0);` |
| `pd42s1_set_key_lock` | Statement | ADDR(field_number), LOCK(field_dropdown) | `pd42s1_set_key_lock(1, UNLOCK)` | `smd_set_key_lock(1, 0);` |
| `pd42s1_set_auto_display` | Statement | ADDR(field_number), OFFON(field_dropdown) | `pd42s1_set_auto_display(1, OFF)` | `smd_set_auto_not_display(1, 0);` |
| `pd42s1_set_io_start_level` | Statement | ADDR(field_number), IOLV(field_dropdown) | `pd42s1_set_io_start_level(1, LOW)` | `smd_set_io_start_level(1, 0);` |
| `pd42s1_origin_left_pos` | Statement | ADDR(field_number), POS(input_value) | `pd42s1_origin_left_pos(1, math_number(0))` | `smd_origin_set_left_pos(1, 0);` |
| `pd42s1_origin_right_pos` | Statement | ADDR(field_number), POS(input_value) | `pd42s1_origin_right_pos(1, math_number(0))` | `smd_origin_set_right_pos(1, 0);` |
| `pd42s1_origin_homing` | Statement | ADDR(field_number), LIMIT(field_dropdown), DIR(field_dropdown), SPEED_RPM(field_number), CURR_MA(field_number) | `pd42s1_origin_homing(1, NO_LIMIT, CW, 100, 500)` | `smd_origin_homing_by_limit(1, 0, 0, 100, 500);` |
| `pd42s1_origin_trig` | Statement | ADDR(field_number), TRIG(field_dropdown) | `pd42s1_origin_trig(1, SINGLE)` | `smd_origin_trig(1, 0);` |
| `pd42s1_origin_break` | Statement | ADDR(field_number) | `pd42s1_origin_break(1)` | `smd_origin_break(1);` |
| `pd42s1_origin_timeout` | Statement | ADDR(field_number), TIMEOUT_MS(field_number) | `pd42s1_origin_timeout(1, 10000)` | `smd_origin_set_params(1, 10000);` |
| `pd42s1_origin_auto` | Statement | ADDR(field_number), OFFON(field_dropdown) | `pd42s1_origin_auto(1, OFF)` | `smd_origin_aoto_zero(1, 0);` |
| `pd42s1_origin_switch` | Statement | ADDR(field_number), OFFON(field_dropdown) | `pd42s1_origin_switch(1, OFF)` | `smd_origin_l_r_switch(1, 0);` |
| `pd42s1_cal_encoder` | Statement | ADDR(field_number) | `pd42s1_cal_encoder(1)` | `smd_cal_encoder(1);` |
| `pd42s1_restart` | Statement | ADDR(field_number) | `pd42s1_restart(1)` | `smd_restart(1);` |
| `pd42s1_reset_factory` | Statement | ADDR(field_number) | `pd42s1_reset_factory(1)` | `smd_reset_factory(1);` |
| `pd42s1_param_save` | Statement | ADDR(field_number) | `pd42s1_param_save(1)` | `smd_param_save(1);` |
| `pd42s1_pulse_pin_init` | Statement | EN_PIN(field_number), STEP_PIN(field_number), DIR_PIN(field_number) | `pd42s1_pulse_pin_init(35, 36, 37)` | `pulse_init_pins(35, 36, 37);` |
| `pd42s1_pulse_en` | Statement | LEVEL(field_dropdown) | `pd42s1_pulse_en(HIGH)` | `pulse_en(1);` |
| `pd42s1_pulse_en_toggle` | Statement | — | `pd42s1_pulse_en_toggle()` | `pulse_en_toggle();` |
| `pd42s1_pulse_dir` | Statement | LEVEL(field_dropdown) | `pd42s1_pulse_dir(HIGH)` | `pulse_dir(1);` |
| `pd42s1_pulse_dir_toggle` | Statement | — | `pd42s1_pulse_dir_toggle()` | `pulse_dir_toggle();` |
| `pd42s1_pulse_output` | Statement | COUNT(input_value), HALF_US(field_number) | `pd42s1_pulse_output(math_number(3200), 100)` | `pulse_output(3200, 100);` |
| `pd42s1_pulse_freq_from_rpm` | Value (Number) | STEP(input_value), RPM(input_value) | `pd42s1_pulse_freq_from_rpm(math_number(16), math_number(300))` | `pd42s1_freq_from_rpm(16, 300)` |
| `pd42s1_pulse_rpm_from_freq` | Value (Number) | FREQ(input_value), STEP(input_value) | `pd42s1_pulse_rpm_from_freq(math_number(3200), math_number(16))` | `pd42s1_rpm_from_freq(3200, 16)` |
| `pd42s1_io_pin_init` | Statement | PIN(field_number) | `pd42s1_io_pin_init(39)` | `io_start_stop_init_pins(39);` |
| `pd42s1_io_pin_set` | Statement | LEVEL(field_dropdown) | `pd42s1_io_pin_set(HIGH)` | `io_start_stop_set(1);` |
| `pd42s1_io_pin_toggle` | Statement | — | `pd42s1_io_pin_toggle()` | `io_start_stop_toggle();` |

## Parameter Options

- **DIR**: CW, CCW
- **ENABLE**: ENABLE, DISABLE
- **MODE**: COMM_POS, COMM_SPEED, COMM_TORQUE, PULSE, PW_POS, PW_SPEED, PW_TORQUE, HOME, OL_SPEED, OL_POS, OL_PULSE
- **MODBUS**: CUSTOM, MODBUS
- **OFFON**: OFF, ON
- **DIRLV**: HIGH, LOW
- **ENLV**: LOW, HIGH, ALWAYS
- **ECHO**: ECHO, NO_ECHO
- **LOCK**: UNLOCK, LOCK
- **LIMIT**: NO_LIMIT, WITH_LIMIT
- **TRIG**: SINGLE, NEAREST, MULTI
- **IOLV**: LOW, HIGH
- **HILON**: HIGH, LOW
- **TYPE**: VER, PSI, RES_IND, PHASE_MA, VOL, MA_PID, SPEED_PID, POS_PID, TOTAL_PULSE, RPM, POS, POS_ERR, MOTOR_STA, CLOG_FLAG, CLOG_MA, EN_STA, ARRIVED, SYS_PARAMS, DRIVE_PARAMS, HOME_PARAMS, HOME_STA

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    serial_begin(Serial, 115200)
    pd42s1_init(19, 20, 115200)

arduino_loop()
    pd42s1_speed_mode(1, CW, 100, math_number(600))
    pd42s1_handle_ack(50)
    pd42s1_read(POS, 1, 50)
    pd42s1_stop_now(1)
    pd42s1_clear_sta(1)
```

## Generated Code

上述 ABS 示例对应的完整生成代码（含全部注入的副作用）：

```cpp
#include "uart.h"
#include "smd.h"
#include "process_frame.h"

uint8_t pd42s1_rx_buf[128];

uint8_t pd42s1HandleAck(uint32_t over_time) {
  uint16_t rec_ct = 0;
  SERIAL_FRAME pd42s1_frame;
  unsigned long last_time = millis();
  while (1) {
    if (Serial1.available() > 0) {
      if (rec_ct < sizeof(pd42s1_rx_buf)) {
        pd42s1_rx_buf[rec_ct] = (uint8_t)Serial1.read();
        rec_ct++;
      } else {
        Serial.printf("接收缓冲区溢出！\n");
        return 1;
      }
      last_time = millis();
    } else {
      if ((millis() - last_time) > over_time) {
        if (rec_ct == 0) {
          Serial.printf("接收超时，无数据！\n\n");
          return 2;
        }
        serial_frame_process((uint8_t *)pd42s1_rx_buf, (uint8_t)rec_ct, &pd42s1_frame);
        return 0;
      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  uart_init_pins(1, 115200, 19, 20);
  smd_speed_mode(1, 0, 100, 600);
  pd42s1HandleAck(50);
}

void loop() {
  smd_read_pos(1);
  pd42s1HandleAck(50);
  smd_stop_now(1);
  smd_clear_sta(1);
}
```


### 脉冲模式完整示例

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    pd42s1_init(19, 20, 115200)
    pd42s1_pulse_pin_init(35, 36, 37)
    pd42s1_pulse_mode(1)
    pd42s1_handle_ack(50)
    pd42s1_set_step(1, 16)
    pd42s1_handle_ack(50)
    pd42s1_pulse_en(HIGH)
    pd42s1_pulse_dir(HIGH)

arduino_loop()
    pd42s1_pulse_output(math_number(3200), 100)
```

对应生成代码（含注入的副作用）：

```cpp
#include "uart.h"
#include "smd.h"
#include "process_frame.h"
#include "pulse.h"

uint8_t pd42s1_rx_buf[128];

uint8_t pd42s1HandleAck(uint32_t over_time) {
  uint16_t rec_ct = 0;
  SERIAL_FRAME pd42s1_frame;
  unsigned long last_time = millis();
  while (1) {
    if (Serial1.available() > 0) {
      if (rec_ct < sizeof(pd42s1_rx_buf)) {
        pd42s1_rx_buf[rec_ct] = (uint8_t)Serial1.read();
        rec_ct++;
      } else {
        Serial.printf("接收缓冲区溢出！
");
        return 1;
      }
      last_time = millis();
    } else {
      if ((millis() - last_time) > over_time) {
        if (rec_ct == 0) {
          Serial.printf("接收超时，无数据！

");
          return 2;
        }
        serial_frame_process((uint8_t *)pd42s1_rx_buf, (uint8_t)rec_ct, &pd42s1_frame);
        return 0;
      }
    }
  }
}

void setup() {
  uart_init_pins(1, 115200, 19, 20);
  pulse_init_pins(35, 36, 37);
  smd_pulse_mode(1);
  pd42s1HandleAck(50);
  smd_set_step(1, 16);
  pd42s1HandleAck(50);
  pulse_en(1);
  pulse_dir(1);
}

void loop() {
  pulse_output(3200, 100);
}
```

## Notes

1. 所有积木首次执行时自动注入 `#include "uart.h"`、`#include "smd.h"`、`#include "process_frame.h"`（去重）。
2. `pd42s1_read` 与 `pd42s1_handle_ack` 首次使用时自动注入全局 `uint8_t pd42s1_rx_buf[128];` 与辅助函数 `pd42s1HandleAck()`（实现见 Generated Code，功能等同例程 handle_ack：按帧间隔收帧并调用 serial_frame_process 解析打印）。
3. 使用任何控制积木前必须先执行 `pd42s1_init` 初始化串口1；驱动器出厂默认电机地址为 1，ADDR 参数用于多机区分（从机地址 1~255）。
4. 应答机制：驱动器默认回响应答帧；`pd42s1_read` 已内置等待应答，其余发送类积木后建议紧跟 `pd42s1_handle_ack`；若通过 `pd42s1_set_cmd_echo(addr, NO_ECHO)` 关闭应答，等待应答仅打印超时提示（无害）。
5. 位置类数值单位：51200 为一圈；速度单位 RPM；加速度单位 RPM/s（0 表示直接启动）。
6. 方向与开关类枚举（CW/CCW、ON/OFF 等）由生成器映射为协议数值（0/1/2…），见 Parameter Options。
7. `pd42s1_init` 引脚默认 19/20 为 DNESP32S3 与 PD42S1 的 TTL 接线；其他板卡（如 Unihiker K10）请按实际接线修改，引脚传 -1 时使用核心默认引脚。
8. 应答解析结果与调试信息打印到串口0（Serial），需另行执行 `Serial.begin`（可用核心串口积木 `serial_begin`）。
9. 刹停（`pd42s1_stop_now`）后请及时 `pd42s1_clear_sta` 清除电机状态，否则电机可能严重发烫。
10. 本库全部积木为全局函数调用（无对象变量、无回调），可在 setup / loop / 任意语句链中使用；`pd42s1_read`/`pd42s1_handle_ack` 会阻塞等待应答至超时。
11. 脉冲模式（例程05）典型流程：`pd42s1_pulse_mode`（切换模式）→ `pd42s1_set_step`（细分）→ `pd42s1_set_en_level` / `pd42s1_set_dir_level`（引脚有效电平）→ `pd42s1_pulse_pin_init` + `pd42s1_pulse_en(HIGH)` / `pd42s1_pulse_dir` → `pd42s1_pulse_output` 输出脉冲；引脚默认 EN=35 / STEP=36 / DIR=37（DNESP32S3 接线），可用 `pd42s1_pulse_pin_init` 按板卡修改。
12. IO 启停（例程09）典型流程：`pd42s1_set_io_start_level`（启动电平）→ `pd42s1_io_run_ctrl`（方向/加速度/速度）→ `pd42s1_io_pin_init` + `pd42s1_io_pin_set` / `pd42s1_io_pin_toggle` 控制启停；引脚默认 39（DNESP32S3 接线）。
13. `pd42s1_pulse_freq_from_rpm` / `pd42s1_pulse_rpm_from_freq` 为换算值积木（输出 Number，无效输入返回 -1）：频率 = 转速×200×细分÷60；转速 = 频率×60÷(200×细分)。`pd42s1_pulse_output` 为软件延时发脉冲，速度不精准，16 细分下 3200 脉冲 = 1 圈。
14. v1.1.0 新增板卡侧输出积木 11 个（上表 `pd42s1_pulse_*` / `pd42s1_io_pin_*`），对应上游例程 pulse.cpp 与 io_start_stop.cpp（含 `pulse_init_pins` / `io_start_stop_init_pins` 引脚可配置适配）。
