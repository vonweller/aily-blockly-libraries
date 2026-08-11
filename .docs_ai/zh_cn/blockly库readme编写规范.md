# Blockly 库 README 编写规范

## 1. 文档职责

每个库提供两份文档：

| 文件 | 读者 | 大小 | 用途 |
|---|---|---:|---|
| `readme.md` | 人类 | 目标不超过 1KB | 简介、来源、兼容性和快速入门 |
| `readme_ai.md` | Agent | 目标不超过 5KB，硬上限 64KB | 可执行 ABS 契约、典型工作流、完整代表性生成代码和库约束 |

5KB 是提示词成本目标，不得为了压缩而截断参数、生成代码、插入 `...` 或删除必要契约。复杂库可在 64KB 硬上限内保留完整信息；超过目标的体积仍作为信息提示审核。

## 2. ABS 参数规则

参数必须依次合并 `block.json` 的 `args0`、`args1`……全部参数组，保持原始顺序。以下元素不进入括号参数：`input_dummy`、`field_image`、`field_label`、`field_label_serializable` 和 `input_statement`。

| 槽位类型 | ABS 写法 | 示例 |
|---|---|---|
| `field_input` | 字符串 | `"sensor"` |
| `field_number` / angle / slider | 裸数值 | `13`、`90` |
| `field_dropdown` | `block.json` 中的真实 value | `HIGH`、`Serial`、`read()`、`""` |
| `field_checkbox` | `TRUE` / `FALSE` | `TRUE` |
| `field_variable` | 裸变量引用 | `$sensor` |
| `input_value` 数字 | 值块 | `math_number(10)` |
| `input_value` 文本 | 值块 | `text("hello")` |
| `input_value` 布尔 | 值块 | `logic_boolean(TRUE)` |
| `input_value` 变量 | 显式变量读取值块 | `variables_get($value)` |
| `input_statement` | 下一行命名输入或缩进块 | `@DO0:` 后跟子块 |
| 结构化自定义字段 | 紧凑 JSON | 以该字段运行时定义为准 |

`field_variable` 和 `input_value` 不可混淆：

```abs
# 正确：VAR 是 field_variable
dht_read_temperature($dht)

# 正确：VALUE 是 input_value，必须显式使用变量读取值块
serial_println(Serial, variables_get($temperature))
```

README 只描述并生成上述唯一规范形式。运行时 parser 为旧内容提供的恢复语法不属于 Agent 文档契约，不能出现在 Block Definitions、ABS Examples 或生成提示中。

## 3. 语句输入和命名值输入

语句子块不能写在父调用同一行，也不能使用 `child_block()` 或 `action()` 占位。

```abs
controls_if()
    @IF0: logic_compare($temperature, GT, math_number(30))
    @DO0:
        serial_println(Serial, text("hot"))
    @ELSE:
        serial_println(Serial, text("normal"))
```

当前 ABS 主线对 `controls_if`、`controls_switch` 等动态块使用 `@IF0:`、`@DO0:`、`@ELSE:` 等真实输入名。命名行中的值可以满足 `input_value`；这不是缺参。普通值块仍把参数写在括号内。

## 4. `readme_ai.md` 必需结构

### 4.1 Library Info

至少包含包名和版本。可补充作者、来源、许可证与支持板卡。

### 4.2 Block Definitions

每个 Agent 可见的 `block.json` 块必须在 `## Block Definitions` 章节内恰好有一行，不能把看似合法的表格行放到后续说明章节来绕过完整性检查。推荐表头：

```markdown
| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | `dht.readTemperature()` |
| `xxx_write` | Statement | VAR(field_variable), VALUE(input_value) | `xxx_write($device, math_number(100))` | `device.write(100);` |
| `xxx_if_ready` | Statement | VAR(field_variable), DO(input_statement) | `xxx_if_ready($device)` | `if (device.ready()) { runReadyHandler(); }` |
```

表格中的 ABS 调用必须完整、可导入。`input_statement` 只列在 Parameters 中，不追加到单行 ABS Format。

Generated Code 必须是使用代表性默认输入执行真实 generator handler 得到的完整结果，包括返回代码和 `addObject`、`addFunction`、setup/loop/macro 等副作用；多行可用 `↵` 放入单元格，但不得静默截断。禁止使用 `Dynamic code`、`See generator`、裸 `generator`、合成环境产生的 `undefined`，也不得用不存在的 `xxxN_*` 汇总伪块代替真实块。

一个公开块在代表性默认状态下确实没有直接输出时，必须先进入版本化的 `.scripts/contracts/readme-generated-code-no-direct.v1.json`，逐项声明分类、面向 Agent 的精确说明和原因。未分类空输出和已经失效的声明都会阻断门禁；通用的“No inline code”不能作为逃生占位词。

内部 helper 或确定废弃的旧块只有在 `readme_ai.contract.json` 中以 `agentVisible: false` 给出非空原因后，才可不进入表格；它们也不得出现在 ABS examples。不能仅依据“当前 toolbox 没引用”推断不可见，更不能用该声明掩盖公开块缺 generator。

### 4.3 Parameter Options

存在静态枚举时列出真实 value；不要只抄显示标签。空字符串是合法枚举值，应写成 `""`。

### 4.4 ABS Examples

至少包含一个调用本库块的完整可执行示例。复杂库应覆盖初始化、读取/写入、回调或多种运行时签名。示例可以调用核心库或其他库，但这些跨库调用同样必须符合对方当前契约。

```abs
arduino_setup()
    dht_init("dht", DHT22, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    time_delay(math_number(2000))
```

### 4.5 Notes

记录无法从静态定义推出的知识：初始化顺序、对象生命周期、回调上下文、最小采样间隔、互斥路线、板卡或外部依赖等。

## 5. 动态块契约

当 extension、mutator 或运行时初始化改变真实参数形状，或者公开块只由 JavaScript 创建而不在 `block.json` 中时，必须增加同目录 `readme_ai.contract.json`。它描述静态 `block.json` 无法表达的事实：

- `variants`：按判别字段列出附加参数及顺序；
- `variadic`：声明 `ADD0...`、`INPUT1...` 等命名索引输入，示例使用真实名称而不是依赖易漂移的位置；
- `staticShape: true`：显式证明扩展不改变参数形状，并给出原因；
- `excludedRuntimeArgs`：声明只为加载旧工程保留、Agent 新 ABS 不应输出的隐藏输入；
- `agentVisible: false`：声明内部 helper、旧版块或隐藏实现不属于 Agent API；必须给出原因，且不能与动态 shape 元数据混用；
- `document: false`：真实 runtime variant 暂不面向 Agent 文档时使用，必须说明原因，不能替代 `excludedRuntimeArgs`；
- `named: true`：运行时参数使用命名映射而非位置映射。
- `runtimeBlocks`：声明本库通过 `Blockly.Blocks[type]` 创建且应供 Agent 使用的块；每项必须包含原因、完整静态 `definition` 和所需动态形态声明，且真实运行时必须同时存在同名块定义与 generator。

动态 `input_statement` 必须写成真实命名子块，例如 `@DO1:`、`@ELSE:`、`@CODE_BLOCK:`。extension 只改变 tooltip、校验、下拉内容、默认值或板卡元数据时，应使用 `staticShape: true`，不得在 README 中写成“可能增加动态字段”。

契约通过不等于运行时通过。高风险动态块还要进入版本化 headless fixture，验证 ABS → workspace → ABI → ABS/codegen；可独立编译的最小案例再通过 aily-builder 编译。

## 6. 生成与迁移原则

- 自动生成只产出候选文件，不直接覆盖人工维护的 README；
- 批量迁移必须是槽位感知的、可预览的，并只改已验证的调用区域；
- 不从 `generator.js` 正则猜测动态签名后直接写回；
- 不因 extension/mutator 存在就允许任意额外参数；
- 不从 toolbox 缺席自动推断块不可见，也不用 `agentVisible: false` 规避公开 generator 缺陷；
- generator-only 类型必须先分类：公开的本库 JavaScript 块进入 `runtimeBlocks` 并像普通块一样写入 Block Definitions 和示例；跨库实现、内建覆盖、历史注册或内部 runtime helper 才进入仓库级版本化清单，不得冒充 Agent API；
- 不用压缩目标截断真实签名；
- 不截断或正则猜测 Generated Code；用隔离执行的 handler 返回值和代码区副作用生成，并拒绝未知块、重复行、合成产物和未分类空输出；
- Agent 文件名统一使用精确小写 `readme_ai.md`，大小写不敏感平台也必须以 Git 索引中的真实路径为准；
- 不改 `aily-blockly` 的宽松导入行为来迁就 README 校验。

## 7. 提交前校验

```bash
npm run readme:test
npm run readme:dynamic-shapes
npm run readme:generator-coverage
npm run readme:candidate-check
npm run readme:runtime-contract
npm run readme:cross-check
npm run readme:contract
```

需要批量刷新 Generated Code 时先预览，再显式应用：

```bash
npm run readme:migrate-generated-code
npm run readme:migrate-generated-code -- --apply
```

具备 `D:\codes\aily-builder` 时，再执行：

```bash
npm run readme:runtime-compile
```

`readme:dynamic-shapes` 检查所有 extension/mutator、`runtimeBlocks` 和 generator 动态槽位是否都有 `variants`、`variadic`、`staticShape` 或 `excludedRuntimeArgs` 声明；`readme:generator-coverage` 隔离执行全部 generator 注册，检查公开缺失、未分类不可见块、runtime block 的真实定义、generator-only 来源、重复覆盖、槽位读取、handler 探针、Generated Code 精确一致性及无直接输出分类；`readme:candidate-check` 重新生成全部 559 个候选文件并对候选做跨库校验，但不覆盖源 README；`readme:contract` 检查本库表格和示例，并拒绝未知/重复块行；`readme:cross-check` 检查示例中引用的所有外部块候选，并拒绝同时匹配多个不兼容 owner 的歧义调用；`readme:runtime-contract` 检查真实 Blockly 初始化与转换链；`readme:runtime-compile` 检查生成代码的可编译最小案例。各层证据不能互相替代。
