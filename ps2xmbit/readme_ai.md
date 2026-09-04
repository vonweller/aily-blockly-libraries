# PS2 手柄

通用 PS2（DualShock 2）手柄积木库：ATT/CMD/DAT/CLK 四线引脚全部可选（下拉数据来自当前主控的数字引脚表），读取按键、摇杆并控制震动电机；参考接线预置为创乐博 MakeBit 板载 PS2 插座（micro:bit V2 主控）。

## Library Info

- **Name**: @aily-project/lib-ps2x
- **Version**: 1.3.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `ps2x_init` | Statement | VAR(field_variable), ATT(dropdown), CMD(dropdown), DAT(dropdown), CLK(dropdown) | `ps2x_init($ps2, 12, 15, 14, 13)` | `#include "PS2X_microbit.h" ↵ PS2X ps2(12, 15, 14, 13); ↵ (setup 开头) ps2.begin(); ↵ (loop 开头) ps2.readGamepad();`（无内联代码，全部为声明/侧效果） |
| `ps2x_connected` | Value (Boolean) | VAR(field_variable) | `ps2x_connected($ps2)` | `ps2x.connected()` |
| `ps2x_button_pressed` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_pressed($ps2, CROSS)` | `ps2x.buttonPressed(PS2X_CROSS)` |
| `ps2x_button_newpress` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_newpress($ps2, TRIANGLE)` | `ps2x.buttonNewPressed(PS2X_TRIANGLE)` |
| `ps2x_button_released` | Value (Boolean) | VAR(field_variable), BUTTON(dropdown) | `ps2x_button_released($ps2, START)` | `ps2x.buttonReleased(PS2X_START)` |
| `ps2x_stick` | Value (Number) | VAR(field_variable), STICK(dropdown) | `ps2x_stick($ps2, LX)` | `ps2x.stick(PS2X_LX)` |
| `ps2x_set_vibration` | Statement | VAR(field_variable), SMALL(input_value Boolean), LARGE(input_value Number) | `ps2x_set_vibration($ps2, logic_boolean(TRUE), math_number(128))` | `ps2x.setVibration(true, (uint8_t)constrain(128, 0, 255));` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| ATT / CMD / DAT / CLK | 当前主控数字引脚表的全部引脚号（如 micro:bit V2：`0`–`32`；ESP32：GPIO 编号），为不带引号的枚举值 | PS2 接收器四线对应的引脚；生成器解析为数字传给 `PS2X(att, cmd, dat, clk)`，非法值回退 MakeBit 参考接线 12/15/14/13 |
| BUTTON | `TRIANGLE`, `CIRCLE`, `CROSS`, `SQUARE`, `UP`, `DOWN`, `LEFT`, `RIGHT`, `L1`, `R1`, `L2`, `R2`, `SELECT`, `START`, `L3`, `R3` | PS2 手柄按键 |
| STICK | `LX`, `LY`, `RX`, `RY` | 左/右摇杆的 X/Y 轴 |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    ps2x_init($ps2, 12, 15, 14, 13)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, ps2x_stick($ps2, LX))
    serial_println(Serial, ps2x_stick($ps2, RY))
    controls_if(ps2x_connected($ps2))
        @DO0:
            controls_if(ps2x_button_pressed($ps2, CROSS))
                @DO0:
                    ps2x_set_vibration($ps2, logic_boolean(TRUE), math_number(128))
    controls_if(ps2x_button_newpress($ps2, TRIANGLE))
        @DO0:
            ps2x_set_vibration($ps2, logic_boolean(FALSE), math_number(0))
    controls_if(ps2x_button_released($ps2, START))
        @DO0:
            serial_println(Serial, text("released"))
```

## Notes

1. **Variable**: `ps2x_init($ps2, ...)` creates `$ps2`（类型 PS2X）；本库所有积木的 VAR 槽直接传 `$ps2`，不要用 `variables_get($ps2)` 或字符串。
2. **Wiring**: 通用库——四个引脚下拉引用当前主控的数字引脚表。ESP32 等支持 SPI 重映射的核心四线任选 GPIO（驱动按 `SPI.begin(clk, dat, cmd)` 重映射）；micro:bit V2 等 SPI 焊盘固定的核心 CMD/DAT/CLK 必须接 P15(MOSI)/P14(MISO)/P13(SCK)（自定义不生效），ATT 可任选。创乐博 MakeBit 板载 PS2 插座参考接线：ATT=P12、CMD=P15、DAT=P14、CLK=P13（即 ABS 示例中的 12/15/14/13）。3.3V 逻辑主控可直连；5V 板卡需电平匹配。
3. **Auto polling**: `ps2x_init` 自动在 loop 开头注入 `ps2x.readGamepad();`，每轮循环自动刷新按键/摇杆/连接状态（单次约 1ms），无需手动读取积木。
4. **Vibration**: `ps2x_set_vibration` 只设置参数，效果在下一次自动轮询时生效；小电机仅开/关（Boolean），大电机 0~255（自动 constrain）。震动需要 DualShock 2 兼容手柄。
5. **Lifecycle**: `ps2x_init` 只能放在 `arduino_setup()`；其余值积木放在循环或初始化的逻辑判断里；`ps2x_set_vibration` 为语句积木，建议放在循环内。
6. **Disconnect**: 手柄断开时 `ps2x_connected` 为假、摇杆返回 0、全部按键视为松开；驱动每约 1 秒自动重新配置，支持热插拔。`begin()` 在手柄不存在时最多重试 5 次（约 1.5 秒）后完成 setup。
7. **Digital pads**: 纯数字模式（0x41）的老手柄按键可用，摇杆恒为 0；建议使用模拟模式 DualShock 2 兼容手柄。
8. **Pins**: 构造函数 `PS2X(att, cmd, dat, clk)`，参数为板卡数字引脚号（下拉值为数字，生成器 `parseInt` 解析，非法值回退 12/15/14/13）；micro:bit V2 的 nRF5 变体未定义 `Pn` 宏，焊盘 Pn 即 Arduino 引脚号 n。
9. **Transport**: 通信采用硬件 SPI（`100kHz` 最佳实测值；实测 50kHz 会使 2.4G 接收器回出更多垃圾（违反其内部时序预期），250kHz 位错误较多，均不用；MSBFIRST、SPI_MODE3，收发两侧逐字节镜像位序），轮询命令为 9 字节 `01 42 00 ...`。连接判定：有效帧需 `reply[0]=0xFF`、`reply[2]=0x5A`、`reply[1]` 非 0x00/0xFF，且不得全部按键同时按下，连续 4 帧且按键字节一致才置为已连接。**控制权门禁（v1.3.6）**：任何被拒帧后进入禁控；恢复需「距上次拒帧 ≥2 秒 + 当帧全部按键松开 + 摇杆居中（±64 原始值）+ 8 连帧模拟量平稳」。**模拟量稳定性监测（v1.3.7）**：连续 4 帧原始摇杆值跳变 >±64（物理上不可能，真摇杆每帧最多约 13）判定为无手柄接收器噪声，强制禁控并打印 `unstable analog data`——无手柄时接收器即便回出合法帧+按键全松，其噪声摇杆也无法越出死区驱动小车。真手柄重新接管约需 2 秒空档。**毛刺过滤**：按键状态需连续两帧一致才采纳；摇杆单帧跳变 ≥38 原始值视为坏样本丢弃。诊断行向 Serial（9600）打印（限 1 秒/条）。应答布局：`[3]=按键字节1 [4]=按键字节2 [5..8]=RX/RY/LX/LY`。
