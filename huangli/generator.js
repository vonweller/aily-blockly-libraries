// Pure-function almanac blocks: solar date -> Chinese almanac strings.

function huangliMakeHandler(fnName) {
  return function (block, generator) {
    const year = generator.valueToCode(block, 'YEAR', Arduino.ORDER_ATOMIC) || '2026'
    const month = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1'
    const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '1'
    generator.addLibrary('Huangli', '#include "Huangli.h"')
    return [fnName + '(' + year + ', ' + month + ', ' + day + ')', Arduino.ORDER_ATOMIC]
  }
}

Arduino.forBlock['huangli_lunar'] = huangliMakeHandler('huangliLunar')
Arduino.forBlock['huangli_ganzhi'] = huangliMakeHandler('huangliGanzhiYear')
Arduino.forBlock['huangli_day_ganzhi'] = huangliMakeHandler('huangliDayGanzhi')
Arduino.forBlock['huangli_zhishen'] = huangliMakeHandler('huangliZhishen')
Arduino.forBlock['huangli_yi'] = huangliMakeHandler('huangliYi')
Arduino.forBlock['huangli_ji'] = huangliMakeHandler('huangliJi')

function huangliMakeLineHandler(fnName) {
  return function (block, generator) {
    const year = generator.valueToCode(block, 'YEAR', Arduino.ORDER_ATOMIC) || '2026'
    const month = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1'
    const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '1'
    const line = block.getFieldValue('LINE') === 'L2' ? '2' : '1'
    generator.addLibrary('Huangli', '#include "Huangli.h"')
    return [fnName + '(' + year + ', ' + month + ', ' + day + ', ' + line + ')', Arduino.ORDER_ATOMIC]
  }
}

Arduino.forBlock['huangli_yi_line'] = huangliMakeLineHandler('huangliYiLine')
Arduino.forBlock['huangli_ji_line'] = huangliMakeLineHandler('huangliJiLine')
Arduino.forBlock['huangli_jieqi'] = huangliMakeHandler('huangliJieqi')

Arduino.forBlock['huangli_font'] = function (block, generator) {
  const big = block.getFieldValue('SIZE') === 'S16' ? 'true' : 'false'
  generator.addLibrary('Huangli', '#include "Huangli.h"')
  return 'huangliSetFontFull(' + big + ');\n'
}
Arduino.forBlock['huangli_month_ganzhi'] = huangliMakeHandler('huangliMonthGanzhi')
Arduino.forBlock['huangli_huangdao'] = huangliMakeHandler('huangliHuangdao')
Arduino.forBlock['huangli_nayin'] = huangliMakeHandler('huangliNayin')
Arduino.forBlock['huangli_chongsha'] = huangliMakeHandler('huangliChongsha')
Arduino.forBlock['huangli_center_x'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""'
  generator.addLibrary('Huangli', '#include "Huangli.h"')
  return ['huangliCenterX(' + text + ')', Arduino.ORDER_FUNCTION_CALL]
}
