# Blockly Library README Writing Specification

## 1. Document Responsibilities

Every library provides two documents:

| File | Audience | Size | Purpose |
|---|---|---:|---|
| `readme.md` | Humans | Target: no more than 1KB | Introduction, source, compatibility, and quick start |
| `readme_ai.md` | Agents | Target: no more than 5KB; hard limit: 64KB | Executable ABS contracts, representative workflows, complete representative generated code, and library constraints |

The 5KB target controls prompt cost. Never meet it by truncating parameters or generated code, inserting `...`, or deleting required contracts. Complex libraries may retain complete information up to the 64KB hard limit; files above the target still produce an informational review note.

## 2. ABS Parameter Rules

Merge every parameter group from `block.json` in order: `args0`, `args1`, and so on. Preserve the original order. The following elements do not become parenthesized arguments: `input_dummy`, `field_image`, `field_label`, `field_label_serializable`, and `input_statement`.

| Slot type | ABS form | Example |
|---|---|---|
| `field_input` | String | `"sensor"` |
| `field_number` / angle / slider | Bare number | `13`, `90` |
| `field_dropdown` | The actual value from `block.json` | `HIGH`, `Serial`, `read()`, `""` |
| `field_checkbox` | `TRUE` / `FALSE` | `TRUE` |
| `field_variable` | Bare variable reference | `$sensor` |
| Numeric `input_value` | Value block | `math_number(10)` |
| Text `input_value` | Value block | `text("hello")` |
| Boolean `input_value` | Value block | `logic_boolean(TRUE)` |
| Variable `input_value` | Explicit variable-read value block | `variables_get($value)` |
| `input_statement` | Named input on the following line or an indented body | `@DO0:` followed by child blocks |
| Structured custom field | Compact JSON | Follow the field's runtime definition |

Do not confuse `field_variable` with `input_value`:

```abs
# Correct: VAR is field_variable.
dht_read_temperature($dht)

# Correct: VALUE is input_value and must use an explicit variable-read block.
serial_println(Serial, variables_get($temperature))
```

README files describe and generate only the canonical forms above. Recovery syntax accepted by the runtime parser for legacy content is outside the Agent documentation contract and must not appear in Block Definitions, ABS Examples, or generation prompts.

## 3. Statement Inputs and Named Value Inputs

Never put statement children on the same line as the parent call. Do not use placeholders such as `child_block()` or `action()`.

```abs
controls_if()
    @IF0: logic_compare($temperature, GT, math_number(30))
    @DO0:
        serial_println(Serial, text("hot"))
    @ELSE:
        serial_println(Serial, text("normal"))
```

The current ABS implementation uses real input names such as `@IF0:`, `@DO0:`, and `@ELSE:` for dynamic blocks including `controls_if` and `controls_switch`. A value on a named line can satisfy an `input_value`; it is not a missing positional argument. Ordinary value blocks still place their parameters inside parentheses.

## 4. Required `readme_ai.md` Structure

### 4.1 Library Info

Include at least the package name and version. Author, source, license, and supported boards may also be documented.

### 4.2 Block Definitions

Every Agent-visible `block.json` block must have exactly one row inside the `## Block Definitions` section. A table-like row placed in a later notes section does not satisfy this requirement. Use this header:

```markdown
| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `dht_read_temperature` | Value | VAR(field_variable) | `dht_read_temperature($dht)` | `dht.readTemperature()` |
| `xxx_write` | Statement | VAR(field_variable), VALUE(input_value) | `xxx_write($device, math_number(100))` | `device.write(100);` |
| `xxx_if_ready` | Statement | VAR(field_variable), DO(input_statement) | `xxx_if_ready($device)` | `if (device.ready()) { runReadyHandler(); }` |
```

Every ABS call in the table must be complete and importable. List `input_statement` slots in Parameters, but do not append their children to the single-line ABS Format cell.

Generated Code must be the complete result of executing the real generator handler with representative default inputs. Capture both the return value and side effects such as `addObject`, `addFunction`, setup, loop, and macro entries. Use `↵` for multiple lines inside one Markdown cell, but never truncate the result. The following are forbidden: `Dynamic code`, `See generator`, a bare `generator` placeholder, synthetic `undefined` output, and invented summary types such as `xxxN_*` that are not real blocks.

If an Agent-visible block legitimately has no direct output in its representative default state, first classify it in the versioned `.scripts/contracts/readme-generated-code-no-direct.v1.json`. Each entry must provide a category, a precise Agent-facing preview, and a reason. An unclassified empty result, a stale classification, or a generic escape phrase such as “No inline code” fails validation.

An internal helper or confirmed legacy block may be omitted only when its `readme_ai.contract.json` entry sets `agentVisible: false` with a non-empty reason. Such blocks must not appear in ABS examples. Absence from the current toolbox does not prove invisibility, and `agentVisible: false` must never hide a missing generator for a public block.

### 4.3 Parameter Options

For static enums, list the actual values rather than display labels. An empty string is a valid enum value and must be written as `""`.

### 4.4 ABS Examples

Include at least one complete executable example that calls a block from the current library. Complex libraries should cover initialization, reading or writing, callbacks, or multiple runtime signatures. Core or external-library calls are allowed, but must satisfy the current contracts of their owning libraries.

```abs
arduino_setup()
    dht_init("dht", DHT22, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dht_read_temperature($dht))
    time_delay(math_number(2000))
```

### 4.5 Notes

Document knowledge that cannot be inferred from static definitions: initialization order, object lifetime, callback context, minimum sampling intervals, mutually exclusive routes, board restrictions, and external dependencies.

## 5. Dynamic Block Contracts

Add a sibling `readme_ai.contract.json` whenever an extension, mutator, or runtime initializer changes the real parameter shape, or when an Agent-visible block is created only in JavaScript and is absent from `block.json`. The contract records facts that static `block.json` cannot express:

- `variants`: additional parameters and their order for each discriminator value;
- `variadic`: indexed named inputs such as `ADD0...` or `INPUT1...`; examples use stable real names rather than fragile positions;
- `staticShape: true`: an explicit, reasoned assertion that the extension does not change parameter shape;
- `excludedRuntimeArgs`: hidden inputs retained only to load old projects and omitted from new Agent ABS;
- `agentVisible: false`: an internal helper, legacy block, or hidden implementation outside the Agent API; it requires a reason and cannot be mixed with dynamic-shape metadata;
- `document: false`: a real runtime variant intentionally excluded from Agent documentation, with a reason; it does not replace `excludedRuntimeArgs`;
- `named: true`: runtime parameters map by name rather than position;
- `runtimeBlocks`: blocks created by this library through `Blockly.Blocks[type]` and exposed to Agents; each item requires a reason, a complete static `definition`, any dynamic-shape declaration, and matching runtime block and generator registrations.

Dynamic `input_statement` children use their real names, such as `@DO1:`, `@ELSE:`, or `@CODE_BLOCK:`. If an extension only changes a tooltip, validator, dropdown contents, default value, or board metadata, use `staticShape: true`; do not describe it as “possibly adding dynamic fields.”

A passing metadata contract does not prove runtime behavior. High-risk dynamic blocks also need versioned headless fixtures covering ABS → workspace → ABI → ABS/codegen. Independently compilable minimal cases must additionally pass aily-builder compilation.

## 6. Generation and Migration Principles

- Automatic generation writes candidate files only; it does not overwrite manually maintained README files.
- Bulk migrations must be slot-aware, previewable, and limited to validated call regions.
- Never infer a dynamic signature with a regular expression over `generator.js` and write it back directly.
- The presence of an extension or mutator does not allow arbitrary extra arguments.
- Do not infer invisibility from toolbox absence or use `agentVisible: false` to avoid fixing a public generator defect.
- Classify generator-only types first. Public JavaScript-defined blocks from the same library belong in `runtimeBlocks` and receive normal Block Definitions and examples. Cross-library implementations, built-in overrides, legacy registrations, and internal runtime helpers belong in the versioned repository contract and must not impersonate Agent APIs.
- Never truncate a real signature to meet a size target.
- Do not truncate or regex-guess Generated Code. Execute isolated handlers, capture returns and code-area side effects, and reject unknown blocks, duplicate rows, synthetic artifacts, and unclassified empty output.
- Use the exact lowercase filename `readme_ai.md`. The Git-index path is authoritative even on case-insensitive filesystems.
- Do not change the relaxed `aily-blockly` import behavior merely to satisfy README validation.

## 7. Pre-commit Validation

```bash
npm run readme:test
npm run readme:dynamic-shapes
npm run readme:generator-coverage
npm run readme:candidate-check
npm run readme:runtime-contract
npm run readme:cross-check
npm run readme:contract
```

Preview a bulk Generated Code refresh before explicitly applying it:

```bash
npm run readme:migrate-generated-code
npm run readme:migrate-generated-code -- --apply
```

When `D:\codes\aily-builder` is available, also run:

```bash
npm run readme:runtime-compile
```

`readme:dynamic-shapes` checks whether every extension, mutator, `runtimeBlocks` entry, and dynamic generator slot has a `variants`, `variadic`, `staticShape`, or `excludedRuntimeArgs` declaration. `readme:generator-coverage` executes every generator registration in isolation and checks public generator coverage, classified invisible blocks, real runtime block definitions, generator-only provenance, duplicate assignments, slot reads, handler probes, exact Generated Code parity, and no-direct-output classifications. `readme:candidate-check` regenerates candidates for all 559 tracked libraries and cross-validates them without overwriting source README files. `readme:contract` validates local tables and examples, including unknown, duplicate, missing, or misplaced block rows. `readme:cross-check` validates every external call and rejects calls that ambiguously match multiple incompatible owners. `readme:runtime-contract` validates the real Blockly initialization and conversion chain. `readme:runtime-compile` verifies compilation of generated minimal cases. These evidence layers do not replace one another.
