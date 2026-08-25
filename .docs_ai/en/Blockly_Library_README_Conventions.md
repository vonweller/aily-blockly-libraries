# Blockly Library README Writing Specification

## 1. Objective

For one provided Blockly library directory, create or revise these files:

| File | Audience | Content |
|---|---|---|
| `readme.md` | Humans | Introduction, source, supported environments, and quick start |
| `readme_ai.md` | Agents | Importable ABS contracts, complete representative generated code, workflows, and usage constraints |

Writing principles: self-contained, ABS-first, table-driven, fact-verifiable, and practical.

Use the exact lowercase filenames. Do not change block definitions or generators merely to make the documentation easier to write.

Read the available facts in the current library before writing:

1. `package.json`: package name, version, description, author, license, and dependencies;
2. `block.json`: block types, parameters, connections, and defaults;
3. `generator.js`: actual generated code and generator side effects;
4. `toolbox.json`: recommended entry points and common composition, but toolbox absence alone does not make a block private;
5. local extensions, mutators, examples, and existing README files: preserve only knowledge that the sources above can verify.

Do not assume access to Blockly application source code, another repository, or repository scripts. Never invent behavior that cannot be established from the current library.

### Recommended Writing Order

1. extract library metadata from `package.json`;
2. inventory every Agent-visible block and its complete parameter order;
3. derive complete representative Generated Code from `generator.js`;
4. collect real enum values and dynamic shapes;
5. write at least one complete ABS example and the necessary Notes;
6. apply the final checklist instead of treating an old README as code truth.

## 2. `readme.md`

Keep the human-facing document concise, preferably no more than 1KB. Include at least:

```markdown
# [Library Name]

[One-sentence purpose]

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-xxx |
| Version | x.x.x |
| Author | ... |
| Source | ... |
| License | ... |

## Supported Boards

[Supported boards or environments]

## Description

[Two to four sentences covering purpose, supported hardware, and main capabilities]

## Quick Start

[Minimal wiring, initialization, or usage instructions]
```

Do not guess an author, license, board, or wiring rule when no reliable local source provides it.

## 3. Required `readme_ai.md` Structure

Target no more than 5KB, with a hard limit of 64KB. Never meet the size target by dropping parameters, truncating code, or inserting `...`.

### 3.1 Title and Library Info

```markdown
# [Library Name]

[One-sentence capability description]

## Library Info
- **Name**: @aily-project/lib-xxx
- **Version**: x.x.x
```

### 3.2 Block Definitions

Every Agent-visible block must have exactly one row inside `## Block Definitions`. Do not invent `xxxN_*` summary types or any block absent from the current library's factual sources.

Use this header:

```markdown
| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
```

Derive Connection from the real block shape:

- an `output` property means `Value`, optionally with its return type, such as `Value (Number)`;
- `previousStatement` or `nextStatement` means `Statement`;
- a top-level event or entry block without ordinary connections is `Hat`;
- for special dynamic connections, state the real shape rather than guessing from the block name.

### 3.3 Parameter Options

When static dropdowns exist, add `## Parameter Options`. List the actual values from `block.json`, not display labels. An empty string is a real value and is written as `""`.

### 3.4 ABS Examples

Include at least one complete program that calls a block from the current library. Complex libraries should also show initialization order, reading or writing, callbacks, runtime variants, or required resource configuration.

```abs
arduino_setup()
    dht_init("dht", DHT22, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    time_delay(math_number(2000))
```

Every block, parameter, and enum in an example must be real. Never use `action()`, `child_block()`, `value`, or `...` as executable content.

### 3.5 Notes

Record verified facts that a table alone cannot express, including:

- required initialization blocks;
- auto-created variables and their types;
- object lifetime and valid call locations;
- callback context;
- minimum sampling intervals;
- board, pin, bus, or external dependency restrictions;
- mutually exclusive initialization routes;
- which field selects a dynamic parameter shape.

Do not document parser compatibility syntax. Agent documentation exposes only the canonical forms in this specification.

Use this pattern when an initialization block creates a variable:

```markdown
1. **Variable**: `xxx_init("device", ...)` creates `$device`; pass `$device` to this library's field_variable slots. If a different block expects an input_value, use `variables_get($device)`.
```

A dynamic-shape note must name the discriminator and parameters, for example, “TYPE_A appends PIN(field_number), while TYPE_B appends WIRE(dropdown).” Do not merely say that dynamic parameters may appear.

## 4. ABS Parameters

Merge all parameter groups in order: `args0`, `args1`, `args2`, and so on. Fields and inputs may interleave; never move all fields before all inputs.

These elements do not become parenthesized parameters:

- `input_dummy`
- `input_statement`
- `field_image`
- `field_label`
- `field_label_serializable`

Use these canonical forms for every other parameter:

| Slot type | ABS form | Example |
|---|---|---|
| `field_input` | String | `"sensor"` |
| `field_number` / angle / slider | Bare number | `13`, `90` |
| `field_dropdown` | Actual value | `HIGH`, `Serial`, `read()`, `""` |
| `field_checkbox` | `TRUE` / `FALSE` | `TRUE` |
| `field_variable` | Bare variable-field reference | `$sensor` |
| Numeric `input_value` | Number value block | `math_number(10)` |
| Text `input_value` | Text value block | `text("hello")` |
| Boolean `input_value` | Boolean value block | `logic_boolean(TRUE)` |
| Variable `input_value` | Explicit variable-read block | `variables_get($value)` |
| Other `input_value` | The real matching value block | `sensor_read($sensor)` |
| Structured custom field | Compact JSON | Follow the field definition and verified existing data |

A variable field and a variable value input are not interchangeable:

```abs
# VAR is field_variable.
dht_read_temperature($dht)

# VALUE is input_value.
serial_println(Serial, variables_get($temperature))
```

Do not put `variables_get(...)` in a `field_variable`, and do not put bare `$temperature` in an `input_value`.

## 5. Statement Inputs

List an `input_statement` in Parameters, but omit it from the single-line ABS Format cell.

In complete examples, put statement children below their parent. Multi-branch blocks use their real input names:

```abs
controls_if()
    @IF0: logic_compare(variables_get($temperature), GT, math_number(30))
    @DO0:
        serial_println(Serial, text("hot"))
    @ELSE:
        serial_println(Serial, text("normal"))
```

- named lines such as `@IF0:` may represent a dynamic `input_value`, whose value stays on that line;
- `input_statement` entries such as `@DO0:` and `@ELSE:` contain indented child blocks;
- ordinary value blocks always keep their arguments in parentheses and never use `@NAME:`;
- indent ordinary single-body loops directly according to their actual form.

```abs
controls_repeat_ext(math_number(10))
    serial_println(Serial, text("loop"))
```

Never append `@DO0:` or a statement child to the parent call's line.

## 6. Dynamic Blocks

When a local extension or mutator changes the parameter shape:

1. write static parameters first and append dynamic parameters in their real order;
2. provide a complete ABS call for every selectable real shape;
3. use real names for indexed inputs, such as `ADD0`, `INPUT1`, and `@DO1:`;
4. do not claim new ABS parameters when an extension only changes a tooltip, validator, dropdown contents, or default value;
5. omit hidden inputs retained only to load old projects from new ABS;
6. include real Agent-facing blocks created in JavaScript in Block Definitions.

If the library references an external extension whose implementation is unavailable and no local contract defines its shape, do not guess dynamic arguments. State the exact missing fact in Notes and request a local definition or contract from the maintainer.

## 7. Generated Code

Generated Code is not a summary. It is the complete output for the representative inputs shown in ABS Format.

For every block:

1. use default fields from `block.json` and representative value inputs from ABS Format;
2. find the matching real handler in `generator.js`;
3. expand the handler's returned code;
4. also collect library includes, globals, objects, functions, macros, setup code, and loop code written as side effects;
5. represent multiple lines with `↵` inside one Markdown cell without dropping content;
6. escape `|` inside a cell as `&#124;`.

Example:

```markdown
| `emakefun_md_init` | Statement | VAR(field_input), ADDR(dropdown), FREQ(dropdown) | `emakefun_md_init("mMotor", "0x60", "50")` | `Emakefun_MotorDriver mMotor = Emakefun_MotorDriver(0x60); ↵ mMotor.begin(50);` |
```

Never use:

- `Dynamic code`
- `See generator`
- a bare `generator` placeholder
- truncated code such as `esp_sleep_enable_ext0_wakeup(GPIO_NUM_`
- `undefined` or `[object Object]`
- `...` to replace omitted content
- only the handler return while omitting setup, object, or function side effects

When the default state genuinely emits no direct code, describe the exact reason, for example “the custom animation field emits no code when it has no frame data” or “an empty statement body does not register a callback.” Do not use a generic “No inline code.”

If complete output cannot be determined from the current `generator.js`, do not invent it. Identify the exact missing fact and ask the maintainer for the local implementation or contract.

## 8. Final Checklist

Before delivery, verify that:

- filenames are lowercase `readme.md` and `readme_ai.md`;
- package name and version match `package.json`;
- every Agent-visible block has exactly one Block Definitions row;
- there are no unknown blocks, duplicates, or block rows outside that section;
- parameters include `args0..argsN` in the original order;
- `field_variable` uses `$var`;
- a variable `input_value` uses `variables_get($var)`;
- statement children are not on the parent call's line;
- enums use actual values;
- Generated Code is complete and contains no placeholders or truncation;
- at least one complete example calls the current library;
- Notes contain only verified library knowledge;
- no required contract was deleted merely to reduce file size.

## 9. Updating Existing Documentation

- Treat an existing README as a draft to verify, not as code truth.
- When a block is added, removed, or changed, update Block Definitions, Parameter Options, ABS Examples, and Notes together.
- Preserve wiring, initialization order, lifecycle, and hardware constraints that the current library verifies.
- Remove stale block names, old parameter orders, pseudocode, and unverifiable claims.
- Prioritize correct, complete calls before reducing document length.
