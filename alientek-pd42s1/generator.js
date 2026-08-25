/**
 * 正点原子 PD42S1 闭环步进电机驱动器 积木库代码生成器
 * 上游来源：正点原子 DNESP32S3 Arduino 例程（smd / uart / process_frame）
 * 库包名：@aily-project/lib-alientek-pd42s1
 */
;(function () {
  'use strict'

  function pd42s1EnsureLib(generator) {
    generator.addLibrary('pd42s1_uart', '#include "uart.h"')
    generator.addLibrary('pd42s1_smd', '#include "smd.h"')
    generator.addLibrary('pd42s1_pf', '#include "process_frame.h"')
  }

  var PD42S1_ACK_DEF = "uint8_t pd42s1HandleAck(uint32_t over_time) {\n  uint16_t rec_ct = 0;\n  SERIAL_FRAME pd42s1_frame;\n  unsigned long last_time = millis();\n  while (1) {\n    if (Serial1.available() > 0) {\n      if (rec_ct < sizeof(pd42s1_rx_buf)) {\n        pd42s1_rx_buf[rec_ct] = (uint8_t)Serial1.read();\n        rec_ct++;\n      } else {\n        Serial.printf(\"接收缓冲区溢出！\\n\");\n        return 1;\n      }\n      last_time = millis();\n    } else {\n      if ((millis() - last_time) > over_time) {\n        if (rec_ct == 0) {\n          Serial.printf(\"接收超时，无数据！\\n\\n\");\n          return 2;\n        }\n        serial_frame_process((uint8_t *)pd42s1_rx_buf, (uint8_t)rec_ct, &pd42s1_frame);\n        return 0;\n      }\n    }\n  }\n}\n"

  function pd42s1EnsureAck(generator) {
    generator.addObject('pd42s1_rx_buf', 'uint8_t pd42s1_rx_buf[128];')
    generator.addFunction('pd42s1HandleAck', PD42S1_ACK_DEF)
  }

  var pd42s1Map = {
    "DIR": {
      "CW": "0",
      "CCW": "1"
    },
    "ENABLE": {
      "ENABLE": "0",
      "DISABLE": "1"
    },
    "MODE": {
      "COMM_POS": "0",
      "COMM_SPEED": "1",
      "COMM_TORQUE": "2",
      "PULSE": "3",
      "PW_POS": "4",
      "PW_SPEED": "5",
      "PW_TORQUE": "6",
      "HOME": "7",
      "OL_SPEED": "8",
      "OL_POS": "9",
      "OL_PULSE": "10"
    },
    "MODBUS": {
      "CUSTOM": "0",
      "MODBUS": "1"
    },
    "OFFON": {
      "OFF": "0",
      "ON": "1"
    },
    "DIRLV": {
      "HIGH": "0",
      "LOW": "1"
    },
    "ENLV": {
      "LOW": "0",
      "HIGH": "1",
      "ALWAYS": "2"
    },
    "ECHO": {
      "ECHO": "0",
      "NO_ECHO": "1"
    },
    "LOCK": {
      "UNLOCK": "0",
      "LOCK": "1"
    },
    "LIMIT": {
      "NO_LIMIT": "0",
      "WITH_LIMIT": "1"
    },
    "TRIG": {
      "SINGLE": "0",
      "NEAREST": "1",
      "MULTI": "2"
    },
    "IOLV": {
      "LOW": "0",
      "HIGH": "1"
    },
    "HILON": {
      "HIGH": "1",
      "LOW": "0"
    }
  }
  var pd42s1ReadFn = {
    "VER": "smd_read_soft_hard_ver",
    "PSI": "smd_read_psi",
    "RES_IND": "smd_read_phase_res_ind",
    "PHASE_MA": "smd_read_phase_ma",
    "VOL": "smd_read_vol",
    "MA_PID": "smd_read_ma_pid",
    "SPEED_PID": "smd_read_speed_pid",
    "POS_PID": "smd_read_pos_pid",
    "TOTAL_PULSE": "smd_read_tatal_pulse",
    "RPM": "smd_read_rotate_speed",
    "POS": "smd_read_pos",
    "POS_ERR": "smd_read_pos_error",
    "MOTOR_STA": "smd_read_motor_sta",
    "CLOG_FLAG": "smd_read_clog_flag",
    "CLOG_MA": "smd_read_clog_current",
    "EN_STA": "smd_read_enable_sta",
    "ARRIVED": "smd_read_arrived_sta",
    "SYS_PARAMS": "smd_read_sys_params",
    "DRIVE_PARAMS": "smd_read_drive_params",
    "HOME_PARAMS": "smd_origin_read_params",
    "HOME_STA": "smd_origin_read_sta"
  }

  Arduino.forBlock['pd42s1_init'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'uart_init_pins(1, ' + block.getFieldValue('BAUD') + ', ' + block.getFieldValue('TX') + ', ' + block.getFieldValue('RX') + ');\n'
  }

  Arduino.forBlock['pd42s1_read'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    pd42s1EnsureAck(generator)
    var pd42s1fn = pd42s1ReadFn[block.getFieldValue('TYPE')] || 'smd_read_pos'
    return pd42s1fn + '(' + block.getFieldValue('ADDR') + ');\n' + 'pd42s1HandleAck(' + block.getFieldValue('TIMEOUT') + ');\n'
  }

  Arduino.forBlock['pd42s1_handle_ack'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    pd42s1EnsureAck(generator)
    return 'pd42s1HandleAck(' + block.getFieldValue('TIMEOUT') + ');\n'
  }

  Arduino.forBlock['pd42s1_torque_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_torque_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + (generator.valueToCode(block, 'MA', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_speed_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_speed_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_pos_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pos_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'PULSES', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_pos_rel_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pos_rel_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'PULSES', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_pulse_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pulse_mode(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_pw_pos_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pulse_width_pos_mode(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('TOPW_MAX') + ', ' + block.getFieldValue('TOPW_MIN') + ', ' + (generator.valueToCode(block, 'TOP_POS', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'DOWN_POS', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_pw_ma_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pulse_width_ma_mode(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('TOPW_MAX') + ', ' + block.getFieldValue('TOPW_MIN') + ', ' + (generator.valueToCode(block, 'TOP_MA', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'DOWN_MA', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_pw_speed_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_pulse_width_speed_mode(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('TOPW_MAX') + ', ' + block.getFieldValue('TOPW_MIN') + ', ' + (generator.valueToCode(block, 'TOP_SPEED', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'DOWN_SPEED', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_ol_speed_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_ol_speed_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_ol_pos_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_ol_pos_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'PULSES', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_ol_pos_rel_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_ol_pos_rel_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'PULSES', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_ol_pulse_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_ol_pulse_mode(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_io_run_ctrl'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_io_run_ctrl(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('ACC') + ', ' + (generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_stop_now'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_stop_now(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_clear_sta'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_clear_sta(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_motor_enable'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_motor_enable(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.ENABLE[block.getFieldValue('ENABLE')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_angle_zero'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_angle_to_zero(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_remove_clog'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_remove_clog_protect(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_cal_encoder'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_cal_encoder(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_restart'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_restart(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_reset_factory'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_reset_factory(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_param_save'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_param_save(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_slave_add'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_slave_add(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('NEW_ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_group_add'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_group_add(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('NEW_ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_mode'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_mode(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.MODE[block.getFieldValue('MODE')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_pos_pid'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_pos_pid(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'KP', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'KI', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'KD', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_speed_pid'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_speed_pid(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'KP', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'KI', generator.ORDER_ATOMIC) || '0') + ', ' + (generator.valueToCode(block, 'KD', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_pos_torque'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_pos_torque(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'TORQUE', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_step'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_step(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('STEP') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_ma'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_ma(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'MA', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_uart_baud'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_uart_baud(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('BAUD') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_can_baud'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_can_baud(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('BAUD') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_modbus'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_modbus(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.MODBUS[block.getFieldValue('MODBUS')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_clog_pro'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_clog_pro(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.OFFON[block.getFieldValue('OFFON')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_clog_current'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_clog_current(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'MA', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_can_id'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_can_id(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('CAN_ID') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_dir_level'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_dir_level(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.DIRLV[block.getFieldValue('DIRLV')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_en_level'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_en_level(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.ENLV[block.getFieldValue('ENLV')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_cmd_echo'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_cmd_echo(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.ECHO[block.getFieldValue('ECHO')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_key_lock'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_key_lock(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.LOCK[block.getFieldValue('LOCK')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_auto_display'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_auto_not_display(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.OFFON[block.getFieldValue('OFFON')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_set_io_start_level'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_set_io_start_level(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.IOLV[block.getFieldValue('IOLV')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_left_pos'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_set_left_pos(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'POS', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_right_pos'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_set_right_pos(' + block.getFieldValue('ADDR') + ', ' + (generator.valueToCode(block, 'POS', generator.ORDER_ATOMIC) || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_homing'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_homing_by_limit(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.LIMIT[block.getFieldValue('LIMIT')] || '0') + ', ' + (pd42s1Map.DIR[block.getFieldValue('DIR')] || '0') + ', ' + block.getFieldValue('SPEED_RPM') + ', ' + block.getFieldValue('CURR_MA') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_trig'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_trig(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.TRIG[block.getFieldValue('TRIG')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_break'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_break(' + block.getFieldValue('ADDR') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_timeout'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_set_params(' + block.getFieldValue('ADDR') + ', ' + block.getFieldValue('TIMEOUT_MS') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_auto'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_aoto_zero(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.OFFON[block.getFieldValue('OFFON')] || '0') + ');\n'
  }

  Arduino.forBlock['pd42s1_origin_switch'] = function (block, generator) {
    pd42s1EnsureLib(generator)
    return 'smd_origin_l_r_switch(' + block.getFieldValue('ADDR') + ', ' + (pd42s1Map.OFFON[block.getFieldValue('OFFON')] || '0') + ');\n'
  }
  function pd42s1EnsurePulse(generator) {
    pd42s1EnsureLib(generator)
    generator.addLibrary('pd42s1_pulse', '#include "pulse.h"')
  }

  function pd42s1EnsureIoPin(generator) {
    pd42s1EnsureLib(generator)
    generator.addLibrary('pd42s1_iopin', '#include "io_start_stop.h"')
  }

  Arduino.forBlock['pd42s1_pulse_pin_init'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    return 'pulse_init_pins(' + block.getFieldValue('EN_PIN') + ', ' + block.getFieldValue('STEP_PIN') + ', ' + block.getFieldValue('DIR_PIN') + ');\n'
  }

  Arduino.forBlock['pd42s1_pulse_en'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    return 'pulse_en(' + (pd42s1Map.HILON[block.getFieldValue('LEVEL')] || '1') + ');\n'
  }

  Arduino.forBlock['pd42s1_pulse_en_toggle'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    return 'pulse_en_toggle();\n'
  }

  Arduino.forBlock['pd42s1_pulse_dir'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    return 'pulse_dir(' + (pd42s1Map.HILON[block.getFieldValue('LEVEL')] || '1') + ');\n'
  }

  Arduino.forBlock['pd42s1_pulse_dir_toggle'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    return 'pulse_dir_toggle();\n'
  }

  Arduino.forBlock['pd42s1_pulse_output'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    var count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '0'
    return 'pulse_output(' + count + ', ' + block.getFieldValue('HALF_US') + ');\n'
  }

  Arduino.forBlock['pd42s1_pulse_freq_from_rpm'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    var step = generator.valueToCode(block, 'STEP', generator.ORDER_ATOMIC) || '16'
    var rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '0'
    return ['pd42s1_freq_from_rpm(' + step + ', ' + rpm + ')', Arduino.ORDER_ATOMIC]
  }

  Arduino.forBlock['pd42s1_pulse_rpm_from_freq'] = function (block, generator) {
    pd42s1EnsurePulse(generator)
    var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '0'
    var step = generator.valueToCode(block, 'STEP', generator.ORDER_ATOMIC) || '16'
    return ['pd42s1_rpm_from_freq(' + freq + ', ' + step + ')', Arduino.ORDER_ATOMIC]
  }

  Arduino.forBlock['pd42s1_io_pin_init'] = function (block, generator) {
    pd42s1EnsureIoPin(generator)
    return 'io_start_stop_init_pins(' + block.getFieldValue('PIN') + ');\n'
  }

  Arduino.forBlock['pd42s1_io_pin_set'] = function (block, generator) {
    pd42s1EnsureIoPin(generator)
    return 'io_start_stop_set(' + (pd42s1Map.HILON[block.getFieldValue('LEVEL')] || '1') + ');\n'
  }

  Arduino.forBlock['pd42s1_io_pin_toggle'] = function (block, generator) {
    pd42s1EnsureIoPin(generator)
    return 'io_start_stop_toggle();\n'
  }
})()
