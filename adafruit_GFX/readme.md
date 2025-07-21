# Adafruit GFX 积木库

支持 ST7735、ST7789、ST7796S 等 TFT 显示屏的 Blockly 积木库。

## 功能特性

### 基础显示控制
- TFT 屏幕初始化
- 屏幕旋转设置 (0°, 90°, 180°, 270°)
- **反色显示设置** (新增功能)
- 屏幕填充和清空

### 图形绘制
- 像素、线条、矩形、圆形、三角形绘制
- 支持填充和边框绘制
- 文字显示和颜色设置

### 图像处理
- 支持图片文件上传和显示
- 自动转换为 RGB565 格式
- 支持多种尺寸缩放

## 最新更新

### v1.1.0 - 反色显示功能
- 新增 `tft_invert_display` 积木
- 支持开启/关闭屏幕反色显示
- 生成代码: `tft.invertDisplay(true/false);`

### 修复内容
- 修复了图像上传积木中的 `BlocklyEvents.Change` 构造函数错误
- 优化了事件触发机制，提高兼容性
- 改进了错误处理和用户提示

## 参考资料
- https://github.com/adafruit/Adafruit-ST7735-Library
- https://github.com/adafruit/Adafruit-GFX-Library