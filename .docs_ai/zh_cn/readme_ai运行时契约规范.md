# README 动态签名契约规范

> Schema 版本：1  
> 适用范围：静态 `block.json` 无法表达的 extension / mutator 运行时 ABS 签名、由 JavaScript 创建的公开块、兼容输入和 Agent 可见性  
> 存储位置：`.scripts/contracts/readme-library-contracts/<库名>.json`  
> 边界：契约只服务于仓库维护、README 生成和 CI 校验，不属于可下载库内容，也不改变 Blockly 运行时解析策略

## 1. 为什么需要该文件

`block.json` 是静态块定义，但部分库会在 extension 或 mutator 中根据已有字段追加参数。例如 `adafruit_DHT/dht_init` 的静态参数只有 `VAR`、`TYPE`，运行时却要求：

- DHT11、DHT21、DHT22：第三参数为 `PIN`；
- DHT20：第三参数为 `WIRE`。

校验器不能把所有 extension 一律视为“允许任意额外参数”，也不能把真实动态参数误报为多余参数。因此每个动态分支必须显式、可版本化地声明。

## 2. v1 结构

```json
{
  "schemaVersion": 1,
  "blocks": {
    "dht_init": {
      "variants": [
        {
          "id": "single-wire-pin",
          "when": { "TYPE": ["DHT11", "DHT21", "DHT22"] },
          "appendArgs": [
            {
              "name": "PIN",
              "type": "field_dropdown",
              "example": "2",
              "required": true
            }
          ]
        },
        {
          "id": "dht20-i2c",
          "when": { "TYPE": ["DHT20"] },
          "appendArgs": [
            {
              "name": "WIRE",
              "type": "field_dropdown",
              "example": "Wire",
              "required": true
            }
          ]
        }
      ]
    }
  },
  "runtimeBlocks": {
    "custom_function_call_advance": {
      "reason": "The block is created programmatically from the function registry.",
      "definition": {
        "type": "custom_function_call_advance",
        "args0": [
          {
            "type": "field_variable",
            "name": "FUNC_NAME",
            "variableTypes": ["FUNC"],
            "defaultType": "FUNC",
            "named": true
          }
        ],
        "previousStatement": null,
        "nextStatement": null
      },
      "variadic": {
        "prefix": "INPUT",
        "startIndex": 0,
        "type": "input_value",
        "sampleCount": 1,
        "example": "math_number(1)",
        "reason": "The selected function creates indexed value inputs."
      }
    }
  }
}
```

字段规则：

- `schemaVersion`：当前固定为 `1`；未知版本必须拒绝，不能静默降级。
- `blocks`：键必须是同目录 `block.json` 中存在的块类型。
- `runtimeBlocks`：可选；只用于本库 JavaScript 确实通过 `Blockly.Blocks[type]` 创建、具有 generator 且应公开给 Agent 的块。每项必须包含非空 `reason` 和完整 `definition`，键、`definition.type`、真实运行时定义及 generator 注册必须一致；不得与 `block.json` 或 `blocks` 重名。
- `runtimeBlocks.*.definition`：使用与 `block.json` 相同的参数和连接字段描述可序列化静态基形；动态增量仍由同一项中的 `variants` / `variadic` 表达。需要强制命名映射的静态字段可在参数上设置 `named: true`。
- `variants[].id`：同一块内稳定且唯一，用于覆盖率和差异报告。
- `when`：键必须引用静态槽位；值为该 variant 接受的精确 ABS 标量集合。
- `appendArgs`：按位置追加到静态参数之后；`name` 不得与静态或同分支已有槽位重复。
- `example`：必须是可直接写入 ABS 的单个实参，不得使用 `...` 或伪块。
- `required`：动态运行时必需参数应设为 `true`，使 fenced example 也不能省略。

除有限 `variants` 外，v1 还支持以下声明：

- `variadic`：描述命名索引输入，包含 `prefix`、`startIndex`、`type`、`sampleCount`、`example` 和原因。README 示例必须使用 `ADD2=...`、`INPUT1=...` 等真实输入名，避免增删输入后发生位置歧义；
- `staticShape: true`：证明 extension/mutator 只改变 UI、默认值或元数据，不改变可序列化 ABS 形态，必须给出非空 `reason`；
- `excludedRuntimeArgs`：声明运行时为旧工程兼容而保留、但 Agent 新 ABI 不应生成的隐藏输入。每项包含 `name`、`type` 和 `reason`；它不同于运行时宽松恢复，也不能用于忽略普通缺参；
- `agentVisible: false`：声明一个真实 `block.json` 条目是内部 helper、旧版块或隐藏实现，不应作为 Agent 可调用 API。必须给出块级非空 `reason`，不能只因它暂时未出现在 toolbox 就自动推断；该块不得再声明 `variants`、`variadic`、`staticShape` 或 `excludedRuntimeArgs`；
- `document: false`：某个真实 variant 暂不进入 Agent 文档时使用，必须写明原因；它不能替代 `excludedRuntimeArgs`；
- `named: true`：单个动态槽位要求命名参数映射；索引型输入应优先由 `variadic` 统一声明。

`appendArgs.type=input_statement` 不进入父调用括号，而以缩进的 `@NAME:` 子块渲染。`when` 可以引用静态槽位，也可以引用同一 variant 已声明的附加运行时槽位。

示例：

```json
{
  "text_join": {
    "variadic": {
      "prefix": "ADD",
      "startIndex": 0,
      "type": "input_value",
      "sampleCount": 3,
      "example": "text(\"item\")",
      "reason": "Mutator-managed inputs must keep their indexed names."
    }
  },
  "legacy_speak": {
    "excludedRuntimeArgs": [
      {
        "name": "INTERVAL",
        "type": "input_value",
        "reason": "Hidden socket retained only when loading old projects."
      }
    ]
  },
  "legacy_internal_helper": {
    "agentVisible": false,
    "reason": "This mutator helper is serialized internally and has no callable generator."
  }
}
```

## 3. 匹配与验证

一个调用只有在至少一个 variant 下全部成立时才有效：

1. 静态参数与 `appendArgs` 共同按真实位置顺序映射；
2. `when` 中的判别字段精确匹配；
3. 所有 `required` 动态槽位均存在；
4. 槽位语义检查通过，例如 `field_variable` 必须使用裸 `$name`；
5. 没有未声明的额外实参。

每个声明的 variant 必须至少被 Block Definitions 表格或 fenced ABS example 中的一个完整调用覆盖。只有存在 contract 不算覆盖。

`agentVisible: false` 的静态块采用相反约束：候选 README 不生成该块，源 README 的 Block Definitions 和 fenced ABS examples 也不得把它暴露为可调用 API。若后续补齐 generator 并重新公开，必须删除该声明并恢复正常表格与示例覆盖。`runtimeBlocks` 天然表示公开 API，不能使用 `agentVisible: false`；内部运行时 helper 不应进入该节点。

## 4. 生成和门禁

- `readme:candidate` 读取 contract，用第一 variant 生成表格与 Basic Usage，并为后续 variant 生成独立示例。
- `readme:contract` / `--strict-abs` 校验 contract 自身、调用签名和 variant 覆盖率。
- `readme:generator-coverage` 隔离执行全部 generator 注册，验证每个 `runtimeBlocks` 条目确有同名 `Blockly.Blocks` 定义与 generator，并阻断公开块缺 generator、未分类缺失、非预期重复覆盖、槽位访问器错误、未声明槽位读取和 handler 探针错误。
- `validate:changed` 从 Git merge-base 与 head 分别读取 contract，新增或恶化的问题独立阻断。
- GitHub Actions 通过 `.scripts/**` 监听集中契约变更，并把 `<库名>.json` 映射回对应库执行变更回归检查。
- runtime verified 仍要求真实 ABS→Workspace→ABI→ABS/codegen 契约通过；静态 contract 通过不是运行时通过的替代品。

generator 已注册但同库 `block.json` 没有定义时，先区分其是否为公开块：本库 JavaScript 创建且供 Agent 调用的类型必须写入 `runtimeBlocks`，从此参与候选生成、单库/跨库 ABI 校验和动态输入审计；跨库实现、Blockly 内建覆盖、历史兼容注册或不公开的运行时 helper 才进入仓库级 `.scripts/contracts/readme-generator-registrations.v1.json`。每项必须有原因，未分类新增项和已经失效的允许项都由 `readme:generator-coverage` 阻断。

## 5. 不应采用的做法

- 不因块存在 `extensions` 或 `mutator` 就放行所有额外参数。
- 不从 `generator.js` 正则猜测出的分支直接写回源 README。
- 不在 `blocks` 中重复声明普通静态槽位；静态槽位仍以 `block.json` 为准。只有缺少 `block.json` 的公开 JavaScript 块才在 `runtimeBlocks.definition` 中完整声明基形。
- 不用 contract 掩盖运行时变量绑定、动态 shape 或 codegen 缺陷。
- 不把“当前未出现在 toolbox”自动等同于 `agentVisible: false`；每个不可见块都必须有可审计原因。
- 不用 `agentVisible: false` 隐藏本应公开但 generator 缺失或损坏的块。
- 不把 generator-only 注册直接删除或默认视为可调用块；先确认其动态定义、跨库 owner、内建来源或兼容历史并进入版本化分类。
- 不把 runtime strict 规则写入 Blockly 交互式导入器，运行时现有宽松恢复能力继续保留。

## 6. 仓库级运行时黄金夹具

仓库级 `.scripts/contracts/readme-library-contracts/<库名>.json` 描述单库动态 ABS 签名；跨库端到端行为由
`.scripts/contracts/readme-runtime-contracts.v1.json` 描述。两者职责不同，不能互相替代。

v1 黄金夹具包含：

- `libraries`：本轮需要加载真实 `block.json` 与 `generator.js` 的库；
- `boardConfig`：动态 PIN、串口、I2C 等运行时替换使用的确定板卡数据；
- `runtimeInitializers`：创建任何块之前必须执行的桌面初始化模块；
- `runtimeSourcePaths`：参与契约的 `aily-blockly` 源码和依赖清单文件，逐文件记录工作区 SHA-256、HEAD blob 与脏状态；
- `cases[].abs`：最小但完整的输入 ABS；
- `cases[].projectDataSeeds`：在系统临时项目中通过真实 `projectDataRuntime` 写入的外部资源；ABS 用 `{{projectData.<name>}}` 引用生成后的资源 ID；
- `cases[].expect`：块数量、ABI 对象路径、变量身份/类型、Project Data 引用和生成代码片段断言；
- `cases[].expectedFailure`：仅用于已经确认且有 owner 的已知缺陷，必须匹配精确失败片段与原因。已知缺陷不计入通过；行为变化也会失败并要求重新审核，不能永久豁免。

`runtimeInitializers` 是防止假阳性/假阴性的必要部分。例如桌面入口
`blockly.component.ts` 会先加载仓库内置 `block-plus-minus` 插件，它替换
`controls_if`、`controls_ifelse`、`controls_switch`、`text_join` 等块的 mutator。
若 headless runner 只加载 `blockly/blocks`，会错误地把缺少 `plus()` /
`addElseIf_()` 归因到同步导入器。runner 必须复刻实际初始化生命周期，而不是只复刻 parser 调用。

## 7. Project Data 契约

带外部大数据字段的库不能只校验 ABS 字符串或内联 ABI。runner 对每个 `projectDataSeeds` 执行以下真实链路：

1. 用声明的 codec 与 storage 写入临时项目的 `.aily-data`；
2. 将 `{{projectData.<name>}}` 替换为真实资源引用；
3. 调用 Project Data 引用预检，确认文件存在、哈希和 codec 均有效；
4. 使用桌面端同一 `decorateLibraryBlockDefinitionForProjectData` 装饰块定义；
5. 先直接调用 `createBlockFromConfig` 探测自定义字段能否保存引用，再清空 workspace；
6. 完整执行 ABS→Workspace→ABI，断言 `projectDataBindings` 指向原资源；
7. 运行 generator，确认旧式二维位图消费方能从外部资源恢复数据并生成代码。

U8G2 用例还加载真实 `field-u8g2-bitmap.ts` 与 `BitmapUploadService`。headless Canvas 只提供该字段生命周期所需的最小 API；缺少 Canvas 或服务导致的字段销毁/告警属于 runner 装配问题，不能登记为 Blockly 转换缺陷。

## 8. 可复现性与结果表述

`npm run readme:runtime-contract` 当前报告：

- `aily-blockly` Git revision；
- 契约源码指纹，以及每个相关文件是否偏离 HEAD；
- Node、`aily-project-blockly` 版本、关键依赖入口文件哈希和依赖指纹；
- 所有已加载库 `package.json`、`block.json`、`generator.js` 的逐文件哈希与聚合库源码指纹；
- passed、known failure、failed 三种独立计数。

`--require-clean-runtime` 在任一相关源文件存在未提交修改时以 setup error 拒绝执行。
普通模式允许验证当前工作源码，但报告只能解释为“该精确源码指纹通过”，不能外推成
“HEAD/main 已通过”。合并门禁或发布证据必须在目标提交的干净运行时上执行。

截至 2026-08-11，当前工作源码指纹
`bb7087962fc983780df87d63db9b84f42367b6608bdb728b600b8eb8a1d21caa`、
依赖指纹
`7e213ccea507d7bfbbbecb45730c98c048e51bbbd2b8a90dcc6a335e9ffe4190`、
下 21/21 通过。除原有 DHT、循环、Blynk、`core-functions` 与 U8G2 案例外，新增验证了命名 `ADD0/ADD1/ADD2` 文本拼接、`DIVISIBLE_BY` 的 `DIVISOR`、`text_charAt` 的动态 `AT`、substring 单侧动态端点以及 `aily_iic` slave `ADDRESS`。实际 Blockly 依赖为 `aily-project-blockly@1.0.2`。

该 `aily-blockly` 工作区有 6 个相关脏文件，所以这是工作源码证据，不是干净提交证据。本轮没有修改 `aily-blockly`；运行结果既不能证明这些脏改动适合合并，也不能被表述为 main 已通过。

## 9. 代码生成与编译边界

`codeIncludes` 证明真实 generator 已生成预期 C++ 结构，但不等于编译通过。代表板 compile contract 还必须固定 Arduino CLI 版本、board FQBN、board core 和依赖库版本，并保存完整命令与结果。

后续确认仓库旁存在可用的 `D:\codes\aily-builder`，包版本为 `@aily-project/aily-builder@1.3.0`。`npm run readme:runtime-compile` 会先记录 builder 入口和源码指纹，再把契约生成的 C++ 交给真实 builder；只有进程成功且 ELF/HEX 产物均存在才计为通过。

截至 2026-08-10，`core-logic-statement-body` 的 Arduino UNO 最小夹具为 1/1 编译通过。DHT 编译探针若失败于缺少外部 `DHT.h`，结论应是“当前 builder 环境未安装库依赖”，不能误归因于 ABS/ABI 转换，也不能计入绿色编译契约。新增 compile case 时必须固定板卡、依赖和期望产物；CI 环境没有 aily-builder 时运行时契约仍可执行，但不得伪装成已完成编译。
