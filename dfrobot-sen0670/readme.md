# SEN0670 AI Pose and Gesture

SEN0670 Gravity AI vision gesture and pose sensor with learned hand/pose classes and 13 built-in gestures.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0670 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://gitee.com/DFRobot/DFRobot_HumanPose |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C or UART. I2C address is 0x3A. Custom gestures/poses must be trained with the PC tool.

## Description

SEN0670 Gravity AI vision gesture and pose sensor with learned hand/pose classes and 13 built-in gestures.

## Quick Start

Init in setup, set model, then in loop: get_result -> while available -> pop -> read fields. Built-in gestures: zero/one/two/three/four/five/dislike/like/ok/stop/rock/three2/two_up/no_gesture.
