# 行空板扩展板DFR1231

行空板K10 + DFR1231 IO扩展板 C0–C3 多功能口数字输出/输入积木，封装上游 DFRobot_UnihikerExpansion 库。

## Library Info

- **Name**: @aily-project/lib-dfrobot-unihikerexpansion
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `dfr1231_init` | Statement | (none) | `dfr1231_init()` | 无直接代码；副作用（首次出现本库任意积木时注入）：`#include "DFRobot_UnihikerExpansion.h" ↵ DFRobot_UnihikerExpansion_I2C dfr1231Exp(&Wire); ↵ [setup 开头] while(!dfr1231Exp.begin()){delay(1000);}` |
| `dfr1231_set_io_mode` | Statement | C(dropdown), MODE(dropdown) | `dfr1231_set_io_mode(eC0, eWriteGpio)` | `dfr1231Exp.setMode(eC0, eWriteGpio);` ↵ （并注入上述头文件/全局对象/setup开头副作用） |
| `dfr1231_gpio_write` | Statement | C(dropdown), STATE(dropdown) | `dfr1231_gpio_write(eC0, eHIGH)` | `dfr1231Exp.setGpioState(eC0, eHIGH);` ↵ （并注入上述头文件/全局对象/setup开头副作用） |
| `dfr1231_gpio_read` | Value (Number) | C(dropdown) | `dfr1231_gpio_read(eC0)` | `dfr1231Exp.getGpioState(eC0)` （并注入上述头文件/全局对象/setup开头副作用） |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| C | eC0, eC1, eC2, eC3 | dfr1231_set_io_mode / dfr1231_gpio_write / dfr1231_gpio_read |
| MODE | eWriteGpio, eReadGpio | dfr1231_set_io_mode：数字输出 / 数字输入 |
| STATE | eHIGH, eLOW | dfr1231_gpio_write：高电平 / 低电平 |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    serial_begin(Serial, 115200)
    dfr1231_init()
    dfr1231_set_io_mode(eC0, eWriteGpio)
    dfr1231_set_io_mode(eC1, eReadGpio)
    dfr1231_gpio_write(eC0, eHIGH)

arduino_loop()
    controls_if(logic_compare(dfr1231_gpio_read(eC1), EQ, math_number(1)))
        @DO0:
            dfr1231_gpio_write(eC0, eLOW)
    time_delay(math_number(100))
```

对应关键生成代码：全局 `DFRobot_UnihikerExpansion_I2C dfr1231Exp(&Wire);`，setup 开头 `while(!dfr1231Exp.begin()){delay(1000);}`，随后 `dfr1231Exp.setMode(eC0, eWriteGpio);`、`dfr1231Exp.setGpioState(eC0, eHIGH);`，表达式中 `dfr1231Exp.getGpioState(eC1)`。

## Notes

1. **全局对象**：本库使用全局对象模式，无用户变量；对象名固定为 `dfr1231Exp`，不需要任何 field_variable。
2. **自动初始化**：任意本库积木首次出现时，自动注入头文件、全局对象，并把阻塞式 `begin()` 等待循环插入 setup 开头；`dfr1231_init()` 积木本身不产生额外代码，仅用于表达初始化意图。
3. **硬件依赖**：需要行空板K10 插在 DFR1231 扩展板上；扩展板芯片占用 I2C 总线（地址 0x33，即 K10 边缘 SDA/SCL = GPIO47/48）。`begin()` 阻塞等待意味着未插扩展板时程序会停在 setup。
4. **模式前置**：C 口在写入/读取前必须先用 `dfr1231_set_io_mode` 设置为对应模式，否则上游库返回模式错误。
5. **读取失败值**：`dfr1231_gpio_read` 在 I2C 连续失败时返回 255（0xFF），正常值只有 0/1。
6. **时序**：上游库每次 I2C 写成功后固定 `delay(10)`，失败重试间隔 `delay(20)`；不适合高于约 50Hz 的电平翻转场景，驱动继电器等慢速负载无影响。
7. **C4/C5**：上游枚举含 eC4/eC5，但 DFR1231 扩展板仅引出 C0–C3，本库下拉仅提供 C0–C3。
