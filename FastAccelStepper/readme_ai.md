# FastAccelStepper

High-speed stepper motion with acceleration and queued moves.

## Library Info
- **Name**: @aily-project/lib-fastaccelstepper
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `fast_stepper_init` | Statement | VAR(field_input), STEP(dropdown), DIR(dropdown), ENABLE(dropdown) | `fast_stepper_init("stepper", STEP, DIR, ENABLE)` | Dynamic code |
| `fast_stepper_set_profile` | Statement | VAR(field_variable), SPEED(input_value), ACCEL(input_value) | `fast_stepper_set_profile(variables_get($stepper), math_number(9600), math_number(0))` | if ( |
| `fast_stepper_move` | Statement | VAR(field_variable), MODE(dropdown), STEPS(input_value) | `fast_stepper_move(variables_get($stepper), move, math_number(0))` | if ( |
| `fast_stepper_run` | Statement | VAR(field_variable), ACTION(dropdown) | `fast_stepper_run(variables_get($stepper), runForward)` | if ( |
| `fast_stepper_position` | Statement | VAR(field_variable), POSITION(input_value) | `fast_stepper_position(variables_get($stepper), math_number(0))` | if ( |
| `fast_stepper_state` | Value | VAR(field_variable), STATE(dropdown) | `fast_stepper_state(variables_get($stepper), getCurrentPosition)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | move, moveTo | fast_stepper_move |
| ACTION | runForward, runBackward, stopMove, forceStop | fast_stepper_run |
| STATE | getCurrentPosition, targetPos, isRunning, isRunningContinuously | fast_stepper_state |

## ABS Examples

### Basic Usage
```
arduino_setup()
    fast_stepper_init("stepper", STEP, DIR, ENABLE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, fast_stepper_state(variables_get($stepper), getCurrentPosition))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `fast_stepper_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
