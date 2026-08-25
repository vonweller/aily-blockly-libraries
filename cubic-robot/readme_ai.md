# Cubic Contest Robot

Uses bundled `em::EncoderMotor` (lib-encoder-motor) + ESP32Servo for Cubic CoreV2/Motor.

## Library Info
- **Name**: @aily-project/lib-cubic-robot
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters | Generated Code |
|------------|------------|------------|----------------|
| `cubic_robot_init` | Statement | VAR | `CubicRobot robot; robot.begin();` |
| `cubic_robot_set_motor_pins` | Statement | VAR,MOTOR,IN1,IN2,ENC_A,ENC_B | set pin fields before begin |
| `cubic_robot_set_pid` | Statement | VAR,MOTOR,P,I,D | `setPid(...)` |
| `cubic_robot_run_pwm` | Statement | VAR,MOTOR,PWM | `runPwm(...)` |
| `cubic_robot_run_speed` | Statement | VAR,MOTOR,SPEED | `runSpeed(...)` |
| `cubic_robot_drive` | Statement | VAR,FORWARD,TURN | `drive(...)` |
| `cubic_robot_move` | Statement | VAR,DIR,SPEED | forward/back/left/right/stop |
| `cubic_robot_stop` | Statement | VAR | `stopAll()` |
| `cubic_robot_get_speed` | Value | VAR,MOTOR | `speedRpm(...)` |
| `cubic_robot_get_pulse` | Value | VAR,MOTOR | `pulse(...)` |
| `cubic_robot_get_revolutions` | Value | VAR,MOTOR | `revolutions(...)` |
| `cubic_robot_reset_pulse` | Statement | VAR,MOTOR | `resetPulse(...)` |
| `cubic_robot_servo` | Statement | VAR,SERVO,ANGLE | `setServoAngle(...)` |
| `cubic_robot_button` | Value | VAR,BTN | `buttonPressed(...)` |
| `cubic_robot_rgb` | Statement | VAR,STATE | `setRgb(...)` |
| `cubic_robot_pin_info` | Statement | none | comment |


### Canonical ABS Signatures

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------|------------|----------------|
| `cubic_robot_init` | Statement | VAR(field_input) | `cubic_robot_init("robot")` | `robot.begin();` |
| `cubic_robot_set_motor_pins` | Statement | VAR(field_variable), MOTOR(dropdown), IN1(input_value), IN2(input_value), ENC_A(input_value), ENC_B(input_value) | `cubic_robot_set_motor_pins($robot, MOTOR_A, math_number(0), math_number(0), math_number(0), math_number(0))` | `robot.pinMA_IN1 = 1; ↵ robot.pinMA_IN2 = 1; ↵ robot.pinEncA1 = 1; ↵ robot.pinEncA2 = 1;` |
| `cubic_robot_set_pid` | Statement | VAR(field_variable), MOTOR(dropdown), P(input_value), I(input_value), D(input_value) | `cubic_robot_set_pid($robot, MOTOR_A, math_number(0), math_number(0), math_number(0))` | `robot.setPid(CubicRobot::MOTOR_A, 1, 1, 1);` |
| `cubic_robot_run_pwm` | Statement | VAR(field_variable), MOTOR(dropdown), PWM(input_value) | `cubic_robot_run_pwm($robot, MOTOR_A, math_number(0))` | `robot.runPwm(CubicRobot::MOTOR_A, 1);` |
| `cubic_robot_run_speed` | Statement | VAR(field_variable), MOTOR(dropdown), SPEED(input_value) | `cubic_robot_run_speed($robot, MOTOR_A, math_number(9600))` | `robot.runSpeed(CubicRobot::MOTOR_A, 1);` |
| `cubic_robot_drive` | Statement | VAR(field_variable), FORWARD(input_value), TURN(input_value) | `cubic_robot_drive($robot, math_number(0), math_number(0))` | `robot.drive(1, 1);` |
| `cubic_robot_move` | Statement | VAR(field_variable), DIR(dropdown), SPEED(input_value) | `cubic_robot_move($robot, FORWARD, math_number(9600))` | `robot.forward(1);` |
| `cubic_robot_stop` | Statement | VAR(field_variable) | `cubic_robot_stop($robot)` | `robot.stopAll();` |
| `cubic_robot_get_speed` | Value | VAR(field_variable), MOTOR(dropdown) | `cubic_robot_get_speed($robot, MOTOR_A)` | `robot.speedRpm(CubicRobot::MOTOR_A)` |
| `cubic_robot_get_pulse` | Value | VAR(field_variable), MOTOR(dropdown) | `cubic_robot_get_pulse($robot, MOTOR_A)` | `robot.pulse(CubicRobot::MOTOR_A)` |
| `cubic_robot_get_revolutions` | Value | VAR(field_variable), MOTOR(dropdown) | `cubic_robot_get_revolutions($robot, MOTOR_A)` | `robot.revolutions(CubicRobot::MOTOR_A)` |
| `cubic_robot_reset_pulse` | Statement | VAR(field_variable), MOTOR(dropdown) | `cubic_robot_reset_pulse($robot, MOTOR_A)` | `robot.resetPulse(CubicRobot::MOTOR_A);` |
| `cubic_robot_servo` | Statement | VAR(field_variable), SERVO(dropdown), ANGLE(input_value) | `cubic_robot_servo($robot, SERVO_1, math_number(90))` | `robot.setServoAngle(CubicRobot::SERVO_1, 1);` |
| `cubic_robot_button` | Value | VAR(field_variable), BTN(dropdown) | `cubic_robot_button($robot, 0)` | `robot.buttonPressed(0)` |
| `cubic_robot_rgb` | Statement | VAR(field_variable), STATE(dropdown) | `cubic_robot_rgb($robot, true)` | `robot.setRgb(true);` |
| `cubic_robot_pin_info` | Statement | (none) | `cubic_robot_pin_info()` | `// Cubic: MA=14/15 ENC34/35; MB=12/17 ENC36/39; SERVO=2/25; uses lib-encoder-motor` |
## ABS Example
```
arduino_setup()
    cubic_robot_init("robot")

arduino_loop()
    cubic_robot_run_speed($robot, MOTOR_A, math_number(100))
    cubic_robot_run_speed($robot, MOTOR_B, math_number(100))
```

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR | MOTOR_A, MOTOR_B | cubic_robot_set_motor_pins |
| DIR | FORWARD, BACKWARD, LEFT, RIGHT, STOP | cubic_robot_move |
| SERVO | SERVO_1, SERVO_2, SERVO_3, SERVO_4 | cubic_robot_servo |
| BTN | 0, 1 | cubic_robot_button |
| STATE | true, false | cubic_robot_rgb |

## Notes
1. PWM range -1023~1023; speed RPM -300~300 (from EncoderMotor).
2. Call pin overrides before `begin` (i.e. before init block effect if split carefully; preferred: set fields then init in same setup order — pin set blocks should be placed before init in setup, because begin() reads fields).
3. ESP32 only.
