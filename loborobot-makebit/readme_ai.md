# 创乐博 MakeBit 扩展板库

micro:bit V2 创乐博 MakeBit 小车扩展板积木库：小车电机（前进/后退/转向/左右电机/速度/前进跑偏校正）、车载舵机、车载风扇、蜂鸣器、RGB 探照灯（预设色 + 自定义色 + 特效 + 开关 + 全局亮度）。

## Library Info

- **Name**: @aily-project/lib-loborobot-makebit
- **Version**: 1.8.2
- **Author**: liusen（创乐博 MakeCode cbit 扩展移植）
- **License**: UNLICENSED

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `makebit_car_init` | Statement | （无） | `makebit_car_init()` | `#include <MakeBit.h> ↵ MakeBitCar makebit; ↵ [setup注入] makebit.begin();` |
| `makebit_car_ctrl` | Statement | ACTION(dropdown) | `makebit_car_ctrl(FORWARD)` | `makebit.run(255);` |
| `makebit_car_ctrl_speed` | Statement | ACTION(dropdown), SPEED(input_value Number) | `makebit_car_ctrl_speed(LEFT, math_number(150))` | `makebit.turnLeft(150);` |
| `makebit_motor` | Statement | MOTOR(dropdown), DIR(dropdown), SPEED(input_value Number) | `makebit_motor(RIGHT, REV, math_number(200))` | `makebit.rightBackward(200);` |
| `makebit_car_trim` | Statement | LEFT(input_value Number), RIGHT(input_value Number) | `makebit_car_trim(math_number(90), math_number(100))` | `makebit.setForwardTrim(90, 100);` |
| `makebit_car_servo` | Statement | ANGLE(input_value Number) | `makebit_car_servo(math_number(90))` | `makebit.servoAngle(90);` |
| `makebit_car_fan` | Statement | FANDIR(dropdown), SPEED(input_value Number) | `makebit_car_fan(FWD, math_number(255))` | `makebit.fanForward(255);` |
| `makebit_buzzer` | Statement | PIN(dropdown ${board.digitalPins}), STATE(dropdown) | `makebit_buzzer(0, ON)` | `makebit.buzzerWrite(0, true);` |
| `makebit_car_led` | Statement | STATE(dropdown) | `makebit_car_led(ON)` | `makebit.setRgbColor(MAKEBIT_COLOR_WHITE);`（ON；OFF 生成 `makebit.setRgb(0, 0, 0);`） |
| `makebit_car_rgb` | Statement | COLOR(dropdown) | `makebit_car_rgb(RED)` | `makebit.setRgbColor(MAKEBIT_COLOR_RED);` |
| `makebit_car_rgb_val` | Statement | R(input_value Number), G(input_value Number), B(input_value Number) | `makebit_car_rgb_val(math_number(0), math_number(255), math_number(0))` | `makebit.setRgb(0, 255, 0);` |
| `makebit_rgb_effect` | Statement | EFFECT(dropdown) | `makebit_rgb_effect(RAINBOW)` | `makebit.rgbEffect(MAKEBIT_EFFECT_RAINBOW);` |
| `makebit_rgb_brightness` | Statement | BRIGHTNESS(input_value Number) | `makebit_rgb_brightness(math_number(100))` | `makebit.setRgbBrightness(100);` |
| `makebit_ultrasonic` | Value (Number) | TRIG(dropdown ${board.digitalPins}), ECHO(dropdown ${board.digitalPins}) | `makebit_ultrasonic(1, 2)` | `makebit.ultrasonic(1, 2)` |

所有积木共享同一份副作用：首次使用任一积木即注入 `#include <MakeBit.h>` 与全局对象 `MakeBitCar makebit;`（自动去重）；`makebit_car_init` 额外在 setup() 开头注入 `makebit.begin();`，积木本体不产生内联代码。

## Parameter Options

- **ACTION**（`makebit_car_ctrl` / `makebit_car_ctrl_speed`）：`FORWARD`（前进）、`BACKWARD`（后退）、`LEFT`（左转）、`RIGHT`（右转）、`STOP`（停止）、`SPIN_LEFT`（原地左旋）、`SPIN_RIGHT`（原地右旋）。生成方法映射：FORWARD→`run`、BACKWARD→`backward`、LEFT→`turnLeft`、RIGHT→`turnRight`、STOP→`stop`（无参数，速度被忽略）、SPIN_LEFT→`spinLeft`、SPIN_RIGHT→`spinRight`。
- **MOTOR**（`makebit_motor`）：`LEFT`（左电机）、`RIGHT`（右电机）；**DIR**：`FWD`（正转）、`REV`（反转）。
- **FANDIR**（`makebit_car_fan`）：`FWD`（正转）、`REV`（反转）、`STOP`（停止，忽略 SPEED，生成 `makebit.fanStop();`）。
- **PIN**（`makebit_buzzer`）：`${board.digitalPins}` 动态板卡引脚表，micro:bit V2 上值为 Arduino 引脚号（如 `0`、`1`、`2`、`8`）。
- **TRIG / ECHO**（`makebit_ultrasonic`）：`${board.digitalPins}` 动态板卡引脚表，micro:bit V2 上值为 Arduino 引脚号（如 `0`、`1`、`2`、`8`）；TRIG 为 SR04 发射脚，ECHO 为接收脚。
- **STATE**（`makebit_buzzer`）：`ON`（响）、`OFF`（不响）；**STATE**（`makebit_car_led`）：`ON`（亮=白色预设色，按全局亮度点亮）、`OFF`（灭=熄灭）。v1.8.1 起移除独立 BRIGHTNESS 输入，亮度由 `makebit_rgb_brightness` 全局亮度决定；v1.4.0 起无左/右选项（两个探照灯并联在同一 RGB 通道，无法分开控制）。
- **COLOR**（`makebit_car_rgb`）：`OFF`（灭）、`RED`（红）、`GREEN`（绿）、`BLUE`（蓝）、`WHITE`（白）、`CYAN`（青）、`MAGENTA`（品红）、`YELLOW`（黄）。生成 `MAKEBIT_COLOR_*` 枚举。
- **EFFECT**（`makebit_rgb_effect`）：`FLOW`（流水，六色轮换约1.8s）、`RAINBOW`（彩虹，色相渐变约1s）、`BREATH`（呼吸，约0.8s）、`BLINK`（闪烁，约0.9s）、`OFF`（熄灭）。生成 `MAKEBIT_EFFECT_*` 枚举，直接驱动探照灯 CH0/1/2，受 `makebit_rgb_brightness` 全局亮度缩放。
- **LEFT / RIGHT**（`makebit_car_trim`，v1.8.0 新增）：左右电机正转输出百分比 0-100（数值块），默认 100=不校正；前进向右偏减小左值，向左偏减小右值。
- **BRIGHTNESS**（`makebit_rgb_brightness`，v1.8.0 新增）：预设颜色与特效全局亮度 0-255（数值块），默认 255 全亮。

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    makebit_car_init()
    makebit_car_trim(math_number(90), math_number(100))
    makebit_rgb_brightness(math_number(100))
    makebit_car_rgb(RED)
    makebit_buzzer(0, ON)

arduino_loop()
    makebit_rgb_effect(FLOW)
    makebit_car_ctrl_speed(FORWARD, math_number(255))
    makebit_car_led(ON)
    time_delay(math_number(1000))
    makebit_car_led(OFF)
    makebit_car_rgb_val(math_number(0), math_number(255), math_number(0))
    makebit_car_servo(math_number(90))
    makebit_car_fan(FWD, math_number(200))
    makebit_rgb_effect(RAINBOW)
    makebit_car_ctrl(SPIN_LEFT)
    makebit_motor(RIGHT, REV, math_number(200))
    makebit_car_ctrl(STOP)
    makebit_rgb_effect(OFF)
    makebit_buzzer(0, OFF)
    serial_println(Serial, makebit_ultrasonic(1, 2))
```

## Notes

1. **全局单例模式**：本库无 `field_variable` 对象变量；所有积木直接引用全局对象 `makebit`（`MakeBitCar`），ABS 无 `$` 变量引用。
2. **初始化**：`makebit_car_init()` 将 `makebit.begin();` 注入 setup() 开头（Wire.begin + PCA9685 复位 + 50Hz 预分频）。即使不放置该积木，首次使用任何 PCA9685 通道积木时 C++ 侧 `ensureInit()` 也会自动完成初始化（与原 MakeCode cbit 扩展行为一致）。超声波积木不依赖 PCA9685。
3. **速度语义**：SPEED 为 0–255，内部乘 16 映射到 0–4080 后限幅至 [350, 4095]；速度 0 视为停转（与原扩展单独电机积木 0 速仍钳到 350 的行为不同，避免 0 速仍缓转）。`makebit_car_ctrl`（无速度参数）固定以 255 全速执行；ACTION=STOP 时两个积木都生成无参数的 `makebit.stop();`，忽略速度。
4. **通道映射（v1.7.0 实测修正）**：右电机 CH12（正转）/CH13（反转），左电机 CH15（正转）/CH14（反转）。旧版本（≤1.6.1）把左右通道标反，导致左转/右转及原地左旋/右旋方向全部相反（左转时左轮转实际向右拐）。修正后：前进 = 左正+右正，后退 = 左反+右反，左转 = 仅右轮正转，右转 = 仅左轮正转，原地左旋 = 左反+右正（逆时针），原地右旋 = 左正+右反（顺时针）。
5. **舵机**：`makebit_car_servo` 使用 PCA9685 CH3，角度 0–180 映射脉宽 600–2400µs，超过 180 自动钳制。
6. **探照灯开关（v1.8.1 起用全局亮度）**：`makebit_car_led(STATE)` 控制探照灯：亮 = `makebit.setRgbColor(MAKEBIT_COLOR_WHITE)`（白色预设色，受 `makebit_rgb_brightness` 全局亮度缩放；v1.7.0–1.8.0 曾用独立亮度参数 `setRgb(b, b, b)`，v1.8.1 移除），灭 = `makebit.setRgb(0, 0, 0)`。两个探照灯并联在同一 RGB 通道（CH0/1/2）同步动作，实测无法分开控制，故 v1.4.0 起不再提供左/右选项。
7. **RGB 探照灯**：`makebit_car_rgb` / `makebit_car_rgb_val` 使用 PCA9685 CH0（红）/CH1（绿）/CH2（蓝），0–255 分量先按全局亮度等比缩放（v1.8.2 起）再乘 16 限幅 4095 写入（原 cbit 扩展 `RGB_Car_Big`/`RGB_Car_Big2` 为直写）。
8. **探照灯特效**：`makebit_rgb_effect(EFFECT)` 直接驱动探照灯 CH0/1/2：流水（六色轮换约 1.8s）、彩虹（色相渐变约 1s）、呼吸（约 0.8s）、闪烁（约 0.9s）、熄灭。特效为阻塞执行。v1.3.0 起不再驱动 P16 WS2812 灯带（部分车型无此硬件），P16 已释放可另作他用。
9. **蜂鸣器**：有源蜂鸣器模块为低电平触发，响 = `digitalWrite(pin, LOW)`；每次调用都会设置 `pinMode(pin, OUTPUT)`。
10. **I2C 约束**：PCA9685 地址 0x41，走 micro:bit P19/P20（Wire）；不要将 P19/P20 另作他用。P0 与 micro:bit V2 板载扬声器复用，接蜂鸣器时请确认接线。
13. **每通道硬件关断（v1.6.1）**：`stop()` 与 `fanStop()` 用 PCA9685 每通道 OFF 寄存器的 FULL_OFF 位硬件关断电机/风扇：干扰改写占空比寄存器也无法驱动输出，任何正常驱动写入自动解除；舵机通道不受影响，始终保持保持脉冲（v1.6.0 曾用全局全关锁存，会切断舵机脉冲导致舵机掉力矩/抽动，已改为每通道方案）。`setPwm` 无条件写入，每秒上百次重断言“停止”仍是纠正 EMI 损坏事务的安全网。曾尝试 v1.5.0 的“未变化跳过写入”，因损坏永不纠正已回退。
11. **引脚选择**：外设积木请避开 LED 点阵复用引脚（P3/P4/P6/P7/P9/P10）、板载按键（P5/P11）、I2C（P19/P20）；可用空闲引脚如 P0、P1、P2、P8、P16（P16 已在 v1.3.0 释放）。
12. **超声波**：`makebit_ultrasonic(TRIG, ECHO)` 为外接 SR04 模块测距，返回厘米；不依赖 PCA9685。实现不使用 `pulseIn()`（nRF5 核心 pulseIn 链接存在 hard-float ABI 不兼容），改用 `micros()` 轮询测回波脉宽。单次调用最长阻塞约 30ms（约 5 米无回波超时返回 0）。
14. **前进跑偏校正（v1.8.0）**：`makebit_car_trim(LEFT, RIGHT)` → `makebit.setForwardTrim(l, r)`，左右正转输出百分比 0-100（默认 100/100 不校正，>100 自动钳到 100）。只缩放正转 PWM：影响 `run`/`turnLeft`/`turnRight`/`spinLeft`/`spinRight`/`leftForward`/`rightForward` 中的正转轮；`backward`/`leftBackward`/`rightBackward` 不变。用于补偿左右电机硬件差异（如后退走直线但前进向一侧跑偏时，减小偏移反侧的值，例如前进向右偏则减小左值）。
15. **探照灯全局亮度（v1.8.0）**：`makebit_rgb_brightness(BRIGHTNESS)` → `makebit.setRgbBrightness(b)`（0-255，默认 255）。`setRgbColor` 预设颜色、`rgbEffect` 特效（含呼吸/闪烁峰值）、`makebit_car_led` 亮灭白光（v1.8.1 起，白色预设色）与 `makebit_car_rgb_val` 自定义 R/G/B（v1.8.2 起，`setRgb` 改经 `setRgbScaled_` 缩放）均按 b/255 等比缩放。建议放在 setup 中、首次颜色/亮灯/特效调用之前。
