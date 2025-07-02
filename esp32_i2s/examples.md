# ESP32 I2S库使用示例

## 简单使用示例

### 示例1: 基本声音检测
```blockly
使用I2S麦克风检测声音 BCLK引脚41 WS引脚42 DIN引脚2

重复执行:
  如果 引脚41,42,2的I2S麦克风检测到声音(阈值1000)
    串口打印 "检测到声音!"
  否则
    串口打印 "环境安静"
  延时 100毫秒
```

### 示例2: 音量监测
```blockly
使用I2S麦克风检测声音 BCLK引脚41 WS引脚42 DIN引脚2

重复执行:
  设置变量 volume 为 引脚41,42,2的I2S麦克风音量百分比
  串口打印 "当前音量: " + volume + "%"
  延时 500毫秒
```

## 高级使用示例

### 示例3: 完整的音频分析
```blockly
初始化I2S麦克风 BCLK引脚41 WS引脚42 DIN引脚2
I2S麦克风microphone开始采样 采样率16000Hz 缓冲区大小1024

重复执行:
  I2S麦克风microphone读取音频样本
  
  设置变量 avgLevel 为 获取I2S麦克风microphone的平均电平
  设置变量 peakLevel 为 获取I2S麦克风microphone的峰值电平
  设置变量 decibels 为 获取I2S麦克风microphone的分贝值
  设置变量 quality 为 获取I2S麦克风microphone音质等级
  
  串口打印 "平均: " + avgLevel + " 峰值: " + peakLevel + " dB: " + decibels + " 音质: " + quality
  
  延时 100毫秒
```

## 预期生成的Arduino代码

### 简单检测示例生成的代码:
```cpp
#include "Esp_I2S.h"

EspI2S mic_41_42_2(41, 42, 2);

bool mic_41_42_2_soundDetected(int threshold) {
    mic_41_42_2.readSamples();
    return mic_41_42_2.isSoundDetected(threshold);
}

void setup() {
    Serial.begin(115200);
    mic_41_42_2.begin(16000, 1024);
}

void loop() {
    if (mic_41_42_2_soundDetected(1000)) {
        Serial.println("检测到声音!");
    } else {
        Serial.println("环境安静");
    }
    delay(100);
}
```

### 音量监测示例生成的代码:
```cpp
#include "Esp_I2S.h"

EspI2S mic_41_42_2(41, 42, 2);

float mic_41_42_2_getPercentage() {
    mic_41_42_2.readSamples();
    return mic_41_42_2.getPercentage();
}

void setup() {
    Serial.begin(115200);
    mic_41_42_2.begin(16000, 1024);
}

void loop() {
    float volume = mic_41_42_2_getPercentage();
    Serial.print("当前音量: ");
    Serial.print(volume);
    Serial.println("%");
    delay(500);
}
```

## 硬件测试建议

1. **连接I2S麦克风模块**:
   - BCLK → GPIO 41
   - WS → GPIO 42
   - DIN → GPIO 2
   - VCC → 3.3V
   - GND → GND

2. **测试步骤**:
   - 上传代码到ESP32
   - 打开串口监视器(115200波特率)
   - 对着麦克风说话或制造声音
   - 观察串口输出

3. **预期结果**:
   - 安静时输出低音量值或"环境安静"
   - 有声音时输出较高音量值或"检测到声音!"
   - 音量值应该随声音强度变化

## 故障排除

1. **编译错误**: 检查Esp_I2S.h文件是否正确包含
2. **无声音检测**: 检查引脚连接和麦克风供电
3. **数值异常**: 尝试校准噪声基准
4. **性能问题**: 调整采样率和缓冲区大小
