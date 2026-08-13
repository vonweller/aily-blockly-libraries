# Blockly 库 README 编写规范

## 1. 任务目标

针对当前给定的一个 Blockly 库目录，编写或修订以下两个文件：

| 文件 | 读者 | 内容 |
|---|---|---|
| `readme.md` | 人类 | 简介、来源、支持环境和快速入门 |
| `readme_ai.md` | Agent | 可直接用于生成程序的 ABS 调用契约、完整代表性生成代码和使用约束 |

编写原则：自包含、ABS 优先、表格驱动、事实可验证、实用导向。

文件名必须精确使用小写。不要修改库的块定义或 generator 来迁就文档。

编写前读取当前库中能够获得的事实来源：

1. `package.json`：包名、版本、说明、作者、许可证和依赖；
2. `block.json`：块类型、参数、连接形态和默认值；
3. `generator.js`：每个块实际生成的代码及其副作用；
4. `toolbox.json`：推荐入口和常用组合，但不能仅凭 toolbox 缺席认定块不可见；
5. 当前库内的 extension、mutator、示例和已有 README：只保留能够由上述事实验证的知识。

不要假设能够读取 Blockly 主程序源码、其他仓库或运行仓库脚本。无法从当前库确认的行为不得编造。

### 建议编写顺序

1. 从 `package.json` 提取库信息；
2. 逐个整理所有 Agent 可见块及其完整参数顺序；
3. 根据 `generator.js` 填写完整代表性 Generated Code；
4. 汇总真实枚举和动态形态；
5. 编写至少一个完整 ABS 示例和必要 Notes；
6. 使用文末清单逐项复核，不以旧 README 代替代码事实。

## 2. `readme.md`

面向人的文档应简洁，建议不超过 1KB，并至少包含：

```markdown
# [Library Name]

[一句话说明库的用途]

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-xxx |
| Version | x.x.x |
| Author | ... |
| Source | ... |
| License | ... |

## Supported Boards

[支持的板卡或运行环境]

## Description

[2–4 句话说明功能、支持的硬件和主要能力]

## Quick Start

[最短的接线、初始化或使用说明]
```

没有可靠来源时不要猜测作者、许可证、板卡或接线。

## 3. `readme_ai.md` 必需结构

`readme_ai.md` 的目标体积不超过 5KB，硬上限为 64KB。不得为了缩短文件而省略参数、截断代码或插入 `...`。

### 3.1 标题和 Library Info

```markdown
# [Library Name]

[一句话说明该库提供什么能力]

## Library Info
- **Name**: @aily-project/lib-xxx
- **Version**: x.x.x
```

### 3.2 Block Definitions

每个 Agent 可见块必须在 `## Block Definitions` 章节中恰好出现一行。不要创建 `xxxN_*`、汇总块或其他不存在于当前库事实来源中的伪块。

使用以下表头：

```markdown
| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
```

Connection 根据真实连接形态填写：

- 存在 `output`：`Value`，可附返回类型，例如 `Value (Number)`；
- 存在 `previousStatement` 或 `nextStatement`：`Statement`；
- 作为顶层事件或入口且没有普通上下连接：`Hat`；
- 动态形态同时具有特殊连接时，写清真实类型，不要按块名猜测。

### 3.3 Parameter Options

存在下拉枚举时增加 `## Parameter Options`，列出 `block.json` 中的真实 value，而不是界面显示文本。空字符串是合法值，写成 `""`。

### 3.4 ABS Examples

至少提供一个调用当前库块的完整程序。复杂库还应展示初始化顺序、读取或写入、回调、多种运行时形态或必要的资源配置。

```abs
arduino_setup()
    dht_init("dht", DHT22, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    time_delay(math_number(2000))
```

示例中的每个块、参数和枚举都必须真实存在。不要使用 `action()`、`child_block()`、`value` 或 `...` 充当可执行内容。

### 3.5 Notes

记录无法仅从表格表达但会影响正确使用的事实，例如：

- 必须先调用的初始化块；
- 自动创建的变量及其类型；
- 对象生命周期和调用位置；
- 回调上下文；
- 最小采样间隔；
- 板卡、引脚、总线或外部依赖限制；
- 互斥的初始化路线；
- 动态参数由哪个字段决定。

不要在 Notes 中介绍 parser 的兼容写法。Agent 文档只提供本规范定义的唯一写法。

自动创建变量时，可使用以下形式说明：

```markdown
1. **Variable**: `xxx_init("device", ...)` creates `$device`; pass `$device` to this library's field_variable slots. If a different block expects an input_value, use `variables_get($device)`.
```

动态形态说明必须具体指出判别条件和参数，例如“选择 TYPE_A 时追加 PIN(field_number)，选择 TYPE_B 时追加 WIRE(dropdown)”，不要只写“可能出现动态参数”。

## 4. ABS 参数写法

按顺序合并 `block.json` 的 `args0`、`args1`、`args2`……全部参数组。字段和输入可以交错，不能先列完字段再列输入。

以下元素不进入括号参数：

- `input_dummy`
- `input_statement`
- `field_image`
- `field_label`
- `field_label_serializable`

其他参数使用以下唯一规范形式：

| 槽位类型 | ABS 写法 | 示例 |
|---|---|---|
| `field_input` | 字符串 | `"sensor"` |
| `field_number` / angle / slider | 裸数值 | `13`、`90` |
| `field_dropdown` | 真实 value | `HIGH`、`Serial`、`read()`、`""` |
| `field_checkbox` | `TRUE` / `FALSE` | `TRUE` |
| `field_variable` | 裸变量字段引用 | `$sensor` |
| 数字 `input_value` | 数字值块 | `math_number(10)` |
| 文本 `input_value` | 文本值块 | `text("hello")` |
| 布尔 `input_value` | 布尔值块 | `logic_boolean(TRUE)` |
| 变量 `input_value` | 显式变量读取块 | `variables_get($value)` |
| 其他 `input_value` | 对应的真实值块 | `sensor_read($sensor)` |
| 结构化自定义字段 | 紧凑 JSON | 以字段定义和已有有效数据为准 |

变量字段与变量值输入不可互换：

```abs
# VAR 是 field_variable
dht_read_temperature($dht)

# VALUE 是 input_value
serial_println(Serial, variables_get($temperature))
```

不要在 `field_variable` 中写 `variables_get(...)`，也不要在 `input_value` 中直接写 `$temperature`。

## 5. Statement 输入

`input_statement` 只在 Parameters 列中列出，不进入表格的单行 ABS Format。

在完整示例中，statement 子块写在父调用的下一行。多分支块使用真实输入名：

```abs
controls_if()
    @IF0: logic_compare(variables_get($temperature), GT, math_number(30))
    @DO0:
        serial_println(Serial, text("hot"))
    @ELSE:
        serial_println(Serial, text("normal"))
```

- `@IF0:` 等命名行可以对应动态块的 `input_value`，值写在同一行；
- `@DO0:`、`@ELSE:` 等 `input_statement` 后跟缩进的子块；
- 普通值块的参数始终放在括号内，不使用 `@NAME:`；
- 普通循环等单一 body 块按照该块的实际形式直接缩进。

```abs
controls_repeat_ext(math_number(10))
    serial_println(Serial, text("loop"))
```

不要把 `@DO0:` 或 statement 子块追加在父调用同一行。

## 6. 动态块

如果当前库的 extension 或 mutator 会改变参数形态：

1. 先写静态参数，再按实际顺序追加动态参数；
2. 为每个可选择的真实形态给出完整 ABS 调用；
3. 索引型参数使用真实名称，例如 `ADD0`、`INPUT1`、`@DO1:`；
4. 仅改变 tooltip、校验、下拉内容或默认值时，不得声称增加了 ABS 参数；
5. 只为加载旧工程保留的隐藏输入不得出现在新 ABS 中；
6. JavaScript 创建且面向 Agent 的真实块同样必须进入 Block Definitions。

如果当前库只引用了一个无法查看实现的外部 extension，且没有本地 contract 说明其形态，不要猜测动态参数。在 Notes 中明确写出需要维护者补充的具体事实。

## 7. Generated Code

Generated Code 不是概括说明，而是该块在 ABS Format 所示代表性输入下的完整生成结果。

对每个块执行以下推导：

1. 使用 `block.json` 默认字段和 ABS Format 中的代表性值输入；
2. 找到 `generator.js` 中对应的真实 handler；
3. 展开 handler 返回的代码；
4. 同时收集它写入的库引用、全局变量、对象、函数、宏、setup 和 loop 代码；
5. 多行代码在 Markdown 单元格中用 `↵` 表示，并保留完整内容；
6. 单元格中的 `|` 转义为 `&#124;`。

示例：

```markdown
| `emakefun_md_init` | Statement | VAR(field_input), ADDR(dropdown), FREQ(dropdown) | `emakefun_md_init("mMotor", "0x60", "50")` | `Emakefun_MotorDriver mMotor = Emakefun_MotorDriver(0x60); ↵ mMotor.begin(50);` |
```

禁止使用：

- `Dynamic code`
- `See generator`
- 裸 `generator`
- 截断代码，如 `esp_sleep_enable_ext0_wakeup(GPIO_NUM_`
- `undefined`、`[object Object]`
- 用 `...` 代替省略部分
- 只写 handler 的返回值而漏掉 setup、对象或函数等副作用

如果默认状态确实不直接输出代码，写出具体原因，例如“自定义动画字段没有帧数据时不输出代码”或“空 statement body 时不注册回调”。不要使用通用的“No inline code”。

无法从当前 `generator.js` 确定完整输出时，不要编造。应标记具体待确认项并请求维护者提供缺失的本地实现或 contract。

## 8. 最终自检

交付前逐项检查：

- 文件名是小写 `readme.md` 和 `readme_ai.md`；
- 包名和版本与 `package.json` 一致；
- 每个 Agent 可见块在 Block Definitions 中恰好一行；
- 没有未知块、重复块或放在其他章节的块行；
- 参数包含 `args0..argsN`，顺序与定义一致；
- `field_variable` 使用 `$var`；
- 变量 `input_value` 使用 `variables_get($var)`；
- statement 子块没有写在父调用同一行；
- 枚举使用真实 value；
- Generated Code 完整且没有占位符或截断；
- 至少一个完整示例真实调用当前库；
- Notes 只包含可验证的库知识；
- 文档没有为了控制体积而删除必要契约。

## 9. 更新已有文档

- 把已有 README 当作待核对的草稿，不把其中的示例当作代码事实；
- 新增、删除或修改块时，同步更新 Block Definitions、Parameter Options、ABS Examples 和 Notes；
- 保留已有文档中经当前库验证的接线、初始化顺序、生命周期和硬件限制；
- 删除过期块名、旧参数顺序、伪代码和无法验证的结论；
- 优先保证调用正确和信息完整，再考虑压缩篇幅。
