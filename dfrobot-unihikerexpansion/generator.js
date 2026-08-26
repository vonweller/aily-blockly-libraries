/**
 * 行空板K10 DFR1231 IO扩展板积木库
 * 上游库：DFRobot_UnihikerExpansion (MIT, DFRobot / ZhixinLiu)
 * 全局对象模式：生成全局 DFRobot_UnihikerExpansion_I2C dfr1231Exp(&Wire);
 * begin() 阻塞初始化自动插入 setup 开头，保证任何 C 口操作前设备已就绪。
 */

const DFR1231_OBJ = 'dfr1231Exp'

function ensureDfr1231 (generator) {
  generator.addLibrary('DFRobot_UnihikerExpansion', '#include "DFRobot_UnihikerExpansion.h"')
  generator.addObject(
    'DFRobot_UnihikerExpansion_obj',
    'DFRobot_UnihikerExpansion_I2C ' + DFR1231_OBJ + '(&Wire);'
  )
  generator.addSetupBegin(
    'DFRobot_UnihikerExpansion_begin',
    'while(!' + DFR1231_OBJ + '.begin()){delay(1000);}\n'
  )
}

Arduino.forBlock['dfr1231_init'] = function (block, generator) {
  ensureDfr1231(generator)
  return ''
}

Arduino.forBlock['dfr1231_set_io_mode'] = function (block, generator) {
  ensureDfr1231(generator)
  const c = block.getFieldValue('C') || 'eC0'
  const mode = block.getFieldValue('MODE') || 'eWriteGpio'
  return DFR1231_OBJ + '.setMode(' + c + ', ' + mode + ');\n'
}

Arduino.forBlock['dfr1231_gpio_write'] = function (block, generator) {
  ensureDfr1231(generator)
  const c = block.getFieldValue('C') || 'eC0'
  const state = block.getFieldValue('STATE') || 'eLOW'
  return DFR1231_OBJ + '.setGpioState(' + c + ', ' + state + ');\n'
}

Arduino.forBlock['dfr1231_gpio_read'] = function (block, generator) {
  ensureDfr1231(generator)
  const c = block.getFieldValue('C') || 'eC0'
  return [DFR1231_OBJ + '.getGpioState(' + c + ')', generator.ORDER_ATOMIC]
}
