# Arduino R4 LED矩阵库

这是一个用于Arduino R4 WiFi板载LED矩阵的Blockly扩展库，支持动态动画序列编辑。

## 🎯 核心功能

### 1. LED矩阵基础功能
- 初始化LED矩阵
- 清除LED矩阵显示
- 显示滚动文本
- 显示预设图案（笑脸、心形、芯片、危险标志）

### 2. 自定义图案编辑
- 使用`field_led_matrix`组件
- 12×8 LED矩阵可视化编辑
- 支持点击和拖拽绘制
- 生成稳定的数组名（基于内容哈希）

### 3. 预设图案选择 ⭐
- 使用`field_led_pattern_selector`组件
- 网格布局：3列网格显示预设图案
- 可视化预览：48×48像素预览尺寸
- 颜色主题：黄色填充，黑色背景，红色选中
- 智能延迟：在动画中自动添加延迟

### 4. 动画序列编辑 ⭐
- **动态变异器**：类似`list_create_with`的功能
- **延迟控制**：可设置每帧的显示时间（毫秒）
- 点击齿轮图标⚙️添加/删除动画帧
- 支持多个LED图案组合
- 生成`matrix.loadSequence()`代码

## 📁 核心文件

### 必需文件
- `block.json` - 块定义（包含变异器配置）
- `generator.js` - Arduino代码生成器（包含变异器实现）
- `toolbox.json` - 工具箱配置

### 测试文件
- `test_array_hash.html` - **推荐**：数组哈希功能测试页面
- `test_connection_types.html` - 连接类型和延迟处理测试页面
- `test_preset_patterns.html` - 预设图案选择器测试页面
- `test_hash_names.html` - 哈希名称稳定性测试页面

## 🔧 技术实现

### 动画变异器
完全参考Blockly core-lists的`list_create_with`实现：

```javascript
// 块定义中的变异器和扩展配置
{
  "type": "led_matrix_display_animation",
  "message0": "LED矩阵显示动画序列 %1",
  "args0": [{"type": "input_value", "name": "ADD0", "check": "Array"}],
  "message1": "%1",
  "args1": [{"type": "input_value", "name": "ADD1", "check": "Array"}],
  "mutator": "led_matrix_animation_mutator",
  "extensions": ["led_matrix_animation_extension"]
}

// 动态扩展注册（核心功能）
Blockly.Extensions.register('led_matrix_animation_extension', function () {
  this.minInputs = 2;
  this.itemCount = this.minInputs;
  this.onPendingConnection = function(connection) { ... };
  this.finalizeConnections = function() { ... };
  // ... 其他方法
});

// 变异器注册（序列化支持）
Blockly.Extensions.registerMutator('led_matrix_animation_mutator', {
  mutationToDom: function() { ... },
  domToMutation: function(xmlElement) { ... },
  saveExtraState: function() { ... },
  loadExtraState: function(state) { ... }
});
```

### 稳定数组名机制
基于内容生成哈希值，确保相同内容产生相同名称：

```javascript
// 图案哈希生成
function generateMatrixHash(matrixArray) {
  // 基于LED矩阵内容生成哈希
  // 相同图案 → 相同数组名（led_matrix_a1b2c3）
}

// 动画哈希生成
function generateAnimationHash(frameNames) {
  // 基于动画帧序列生成哈希
  // 相同序列 → 相同数组名（animation_x1y2z3）
}

// 数组哈希生成
function generateArrayHash(arrayString) {
  // 基于数组字符串内容生成哈希
  // 清理格式：{0x1e1e, 0x1212, 0x1e1e} → 0x1e1e,0x1212,0x1e1e
  // 相同内容 → 相同数组名（led_matrix_a1b2c3）
}
```

### 智能延迟处理
根据连接类型自动决定是否添加延迟：

```javascript
// 检查是否作为input_value连接到动画块中
var parentConnection = block.outputConnection && block.outputConnection.targetConnection;
if (parentConnection && parentConnection.getSourceBlock) {
  var parentBlock = parentConnection.getSourceBlock();
  if (parentBlock && parentBlock.type === 'led_matrix_display_animation') {
    // 在动画中：生成4个元素（包含延迟）
    code = '{' + matrixData.join(',') + ',' + animationDelay + '}';
  }
}
```

**连接类型区别**：
- **Input Value 连接**：作为动画帧输入 → 添加延迟（4个元素）
- **Statement 连接**：单独显示 → 不添加延迟（3个元素）

**优势**：
- 避免重复定义相同的数组
- 相同内容总是生成相同代码
- 智能延迟处理，避免不必要的延迟
- 便于代码调试和维护

## 🎮 使用方法

### 创建动画序列
1. 从工具箱拖拽"LED矩阵显示动画序列"块
2. 从工具箱拖拽"LED矩阵图案"块
3. **直接连接**图案块到动画块的输入端
4. **自动扩展**：连接时会自动添加新的输入端
5. 设计每帧的LED图案
6. 生成Arduino代码

**注意**：不需要点击齿轮图标，直接拖拽连接即可自动扩展！

### 设计LED图案
1. 从工具箱拖拽"LED矩阵图案"块
2. 点击LED矩阵编辑器
3. 使用鼠标点击或拖拽设计图案
4. 白色表示点亮，黑色表示熄灭

## 🔍 动态扩展特性

- **自动扩展**：拖拽连接时自动添加新输入端
- **智能清理**：删除连接后自动移除多余输入
- **状态保存**：支持XML序列化和反序列化
- **连接管理**：自动处理输入连接的添加和删除
- **标准实现**：完全按照core-lists的list_create_with模式

## 🚀 快速开始

1. 打开`test_mutator.html`测试页面
2. 从工具箱拖拽动画块到工作区
3. 从工具箱拖拽LED图案块
4. **直接连接**图案块到动画块（会自动扩展）
5. 设计LED图案并生成Arduino代码

## 💡 技术亮点

1. **标准变异器**：完全按照Blockly官方模式实现
2. **动态扩展**：支持无限制添加动画帧
3. **稳定输出**：相同图案生成相同代码
4. **可视化编辑**：直观的LED矩阵编辑器
5. **Arduino兼容**：生成标准的Arduino R4代码

这个实现提供了完整的LED矩阵动画编辑功能，让用户可以轻松创建复杂的LED动画序列！🎉