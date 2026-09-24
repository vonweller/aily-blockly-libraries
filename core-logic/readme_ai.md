# logic control

Core library for logic control

## Library Info
- **Name**: @aily-project/lib-core-logic
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `controls_if` | Statement | IF0(input_value), DO0(input_statement); runtime variants: simple-if: (none); one-else-if: IF1(input_value), DO1(input_statement); else-only: ELSE(input_statement); one-else-if-and-else: IF1(input_value), DO1(input_statement), ELSE(input_statement); variadic: IF{1...}(input_value) | `controls_if(math_number(0))` | `if (0) { ↵ }` |
| `controls_ifelse` | Statement | IF0(input_value), DO0(input_statement), ELSE(input_statement); runtime variants: if-else: (none); one-else-if-and-else: IF1(input_value), DO1(input_statement); variadic: IF{1...}(input_value) | `controls_ifelse(math_number(0))` | `if (0) { ↵ } else { ↵ }` |
| `controls_switch` | Statement | SWITCH(input_value), CASE0(input_value), DO0(input_statement), DEFAULT(input_statement); runtime variants: one-case: (none); two-cases: CASE1(input_value), DO1(input_statement); variadic: CASE{1...}(input_value) | `controls_switch(math_number(0), math_number(0))` | `switch (0) { ↵ case 0: ↵ break; ↵ default: ↵ break; ↵ }` |
| `logic_compare` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_compare(math_number(0), EQ, math_number(0))` | `0 == 0` |
| `logic_operation` | Value | A(input_value), OP(dropdown), B(input_value) | `logic_operation(math_number(0), AND, math_number(0))` | `0 && 0` |
| `logic_negate` | Value | BOOL(input_value) | `logic_negate(logic_boolean(true))` | `!true` |
| `logic_boolean` | Value | BOOL(dropdown) | `logic_boolean(true)` | `true` |
| `logic_ternary` | Value | IF(input_value), THEN(input_value), ELSE(input_value) | `logic_ternary(logic_boolean(true), math_number(0), math_number(0))` | `true ? 0 : 0` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OP | EQ, NEQ, LT, GT, GTE, LTE | logic_compare |
| OP | AND, OR | logic_operation |
| BOOL | true, false | logic_boolean |

## ABS Examples

### Basic Usage
```
arduino_loop()
    controls_if(logic_compare(math_number(1), EQ, math_number(1)))
        @DO0:
            serial_println(Serial, text("condition matched"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks. Dropdown values are case-sensitive; checkbox `TRUE/FALSE` is a different field contract.
3. **Branches**: for multi-branch logic, prefer paired `@IFn:` / `@DOn:` sections, and `@CASEn:` / `@DOn:` for switch. Number branches contiguously from zero. The examples below are not a branch-count limit. Do not supply the same condition both in parentheses and in a named section. No IDs or coordinates belong in ABS.
4. **Variables**: a declaration such as `variable_define("score", int, math_number(85))` creates `$score`. Use `$score` in variable dropdown slots and `variables_get($score)` in value inputs; a bare `$score` in a value input remains supported shorthand.

## Runtime Variant Examples

### Runtime Variant: controls_if/one-else-if
```abs
arduino_loop()
    controls_if()
        @IF0: logic_boolean(true)
        @DO0:
            serial_println(Serial, text("if"))
        @IF1: logic_boolean(false)
        @DO1:
            serial_println(Serial, text("else-if"))
```

### Runtime Variant: controls_if/else-only
```abs
arduino_loop()
    controls_if()
        @IF0: logic_boolean(false)
        @DO0:
            serial_println(Serial, text("if"))
        @ELSE:
            serial_println(Serial, text("else"))
```

### Runtime Variant: controls_if/one-else-if-and-else
```abs
arduino_loop()
    controls_if()
        @IF0: logic_boolean(false)
        @DO0:
            serial_println(Serial, text("if"))
        @IF1: logic_boolean(true)
        @DO1:
            serial_println(Serial, text("else-if"))
        @ELSE:
            serial_println(Serial, text("else"))
```

### Runtime Variant: controls_ifelse/one-else-if-and-else
```abs
arduino_loop()
    controls_ifelse()
        @IF0: logic_boolean(false)
        @DO0:
            serial_println(Serial, text("if"))
        @IF1: logic_boolean(true)
        @DO1:
            serial_println(Serial, text("else-if"))
        @ELSE:
            serial_println(Serial, text("else"))
```

### Runtime Variant: controls_switch/two-cases
```abs
arduino_loop()
    controls_switch()
        @SWITCH: math_number(2)
        @CASE0: math_number(1)
        @DO0:
            serial_println(Serial, text("case 1"))
        @CASE1: math_number(2)
        @DO1:
            serial_println(Serial, text("case 2"))
        @DEFAULT:
            serial_println(Serial, text("other"))
```

### Dependent variable and ternary expression
```abs
arduino_setup()
    variable_define("score", int, math_number(85))
    variable_define("grade", String, logic_ternary(
        logic_compare(variables_get($score), GTE, math_number(90)),
        text("A"), text("B")))
    serial_println(Serial, variables_get($grade))
```
Required libraries for these examples: core-loop, core-variables, core-math, core-text, core-serial, core-time.
