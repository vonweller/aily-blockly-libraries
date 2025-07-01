// FreeRTOS Arduino Block Library Generator
// 根据库规范.md生成的Arduino FreeRTOS Blockly代码生成器

// 任务创建块
Arduino.forBlock['freertos_task_create'] = function(block, generator) {
  const taskName = block.getFieldValue('TASK_NAME');
  const stackSize = block.getFieldValue('STACK_SIZE');
  const priority = block.getFieldValue('PRIORITY');
  
  // 添加必要的库引用
  generator.addLibrary('#include <Arduino_FreeRTOS.h>', '#include <Arduino_FreeRTOS.h>');
  
  // 添加任务句柄声明
  generator.addVariable(`TaskHandle_t ${taskName}_Handler;`, `TaskHandle_t ${taskName}_Handler;`);
  
  // 添加任务函数声明
  generator.addFunction(`void ${taskName}(void *pvParameters);`, `void ${taskName}(void *pvParameters);`);
  
  // 生成任务创建代码
  const code = `xTaskCreate(
    ${taskName},
    "${taskName}",
    ${stackSize},
    NULL,
    ${priority},
    &${taskName}_Handler
  );\n`;
  
  return code;
};

// 任务函数块
Arduino.forBlock['freertos_task_function'] = function(block, generator) {
  const taskName = block.getFieldValue('TASK_NAME');
  const taskCode = generator.statementToCode(block, 'TASK_CODE');
  
  const code = `void ${taskName}(void *pvParameters) {
  (void) pvParameters;
  
  for (;;) {
${taskCode}  }
}`;
  
  generator.addFunction(`${taskName}_function`, code);
  return '';
};

// 任务延时块
Arduino.forBlock['freertos_task_delay'] = function(block, generator) {
  const delayMs = block.getFieldValue('DELAY_MS');
  const code = `vTaskDelay(${delayMs} / portTICK_PERIOD_MS);\n`;
  return code;
};

// 任务挂起块
Arduino.forBlock['freertos_task_suspend'] = function(block, generator) {
  const taskHandle = block.getFieldValue('TASK_HANDLE');
  const code = `vTaskSuspend(${taskHandle});\n`;
  return code;
};

// 任务恢复块
Arduino.forBlock['freertos_task_resume'] = function(block, generator) {
  const taskHandle = block.getFieldValue('TASK_HANDLE');
  const code = `vTaskResume(${taskHandle});\n`;
  return code;
};

// 任务删除块
Arduino.forBlock['freertos_task_delete'] = function(block, generator) {
  const taskHandle = block.getFieldValue('TASK_HANDLE');
  const code = `vTaskDelete(${taskHandle});\n`;
  return code;
};

// 队列创建块
Arduino.forBlock['freertos_queue_create'] = function(block, generator) {
  const queueName = block.getFieldValue('QUEUE_NAME');
  const queueLength = block.getFieldValue('QUEUE_LENGTH');
  const dataType = block.getFieldValue('DATA_TYPE');
  
  generator.addLibrary('#include <queue.h>', '#include <queue.h>');
  generator.addVariable(`QueueHandle_t ${queueName};`, `QueueHandle_t ${queueName};`);
  
  let sizeOfType;
  switch(dataType) {
    case 'int':
      sizeOfType = 'sizeof(int)';
      break;
    case 'String':
      sizeOfType = 'sizeof(String)';
      break;
    case 'struct':
      sizeOfType = 'sizeof(struct)';
      break;
    case 'array':
      sizeOfType = 'sizeof(array)';
      break;
    default:
      sizeOfType = 'sizeof(int)';
  }
  
  const code = `${queueName} = xQueueCreate(${queueLength}, ${sizeOfType});\n`;
  return code;
};

// 队列发送块
Arduino.forBlock['freertos_queue_send'] = function(block, generator) {
  const queueName = block.getFieldValue('QUEUE_NAME');
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
  
  const code = `xQueueSend(${queueName}, &${data}, portMAX_DELAY);\n`;
  return code;
};

// 队列接收块
Arduino.forBlock['freertos_queue_receive'] = function(block, generator) {
  const queueName = block.getFieldValue('QUEUE_NAME');
  const variable = block.getFieldValue('VARIABLE');
  
  const code = `if (xQueueReceive(${queueName}, &${variable}, portMAX_DELAY) == pdPASS) {\n`;
  return code;
};

// 信号量创建块
Arduino.forBlock['freertos_semaphore_create'] = function(block, generator) {
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE');
  const semaphoreName = block.getFieldValue('SEMAPHORE_NAME');
  
  generator.addLibrary('#include <semphr.h>', '#include <semphr.h>');
  generator.addVariable(`SemaphoreHandle_t ${semaphoreName};`, `SemaphoreHandle_t ${semaphoreName};`);
  
  let createFunction;
  switch(semaphoreType) {
    case 'Binary':
      createFunction = 'xSemaphoreCreateBinary()';
      break;
    case 'Mutex':
      createFunction = 'xSemaphoreCreateMutex()';
      break;
    case 'Counting':
      createFunction = 'xSemaphoreCreateCounting(10, 0)';
      break;
    default:
      createFunction = 'xSemaphoreCreateBinary()';
  }
  
  const code = `${semaphoreName} = ${createFunction};\n`;
  return code;
};

// 信号量获取块
Arduino.forBlock['freertos_semaphore_take'] = function(block, generator) {
  const semaphoreName = block.getFieldValue('SEMAPHORE_NAME');
  const waitTime = block.getFieldValue('WAIT_TIME');
  
  const code = `xSemaphoreTake(${semaphoreName}, ${waitTime} / portTICK_PERIOD_MS)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 信号量释放块
Arduino.forBlock['freertos_semaphore_give'] = function(block, generator) {
  const semaphoreName = block.getFieldValue('SEMAPHORE_NAME');
  const code = `xSemaphoreGive(${semaphoreName});\n`;
  return code;
};

// 中断处理块
Arduino.forBlock['freertos_interrupt_handler'] = function(block, generator) {
  const pin = block.getFieldValue('PIN');
  const mode = block.getFieldValue('MODE');
  const interruptCode = generator.statementToCode(block, 'INTERRUPT_CODE');
  
  // 创建中断处理函数
  const interruptFunctionName = `interruptHandler_Pin${pin}`;
  const interruptFunction = `void ${interruptFunctionName}() {
${interruptCode}}`;
  
  generator.addFunction(`${interruptFunctionName}_def`, interruptFunction);
  
  // 设置引脚模式和中断
  generator.addSetup(`pinMode_${pin}`, `pinMode(${pin}, INPUT_PULLUP);`);
  generator.addSetup(`attach_interrupt_${pin}`, `attachInterrupt(digitalPinToInterrupt(${pin}), ${interruptFunctionName}, ${mode});`);
  
  return '';
};

// 任务通知发送块
Arduino.forBlock['freertos_task_notification_send'] = function(block, generator) {
  const taskHandle = block.getFieldValue('TASK_HANDLE');
  const code = `xTaskNotifyGive(${taskHandle});\n`;
  return code;
};

// 任务通知等待块
Arduino.forBlock['freertos_task_notification_wait'] = function(block, generator) {
  const code = `ulTaskNotifyTake(pdTRUE, portMAX_DELAY)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取系统滴答计数块
Arduino.forBlock['freertos_get_tick_count'] = function(block, generator) {
  const code = `xTaskGetTickCount()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取任务名称块
Arduino.forBlock['freertos_get_task_name'] = function(block, generator) {
  const taskHandle = block.getFieldValue('TASK_HANDLE');
  const code = `pcTaskGetName(${taskHandle})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取空闲堆内存大小块
Arduino.forBlock['freertos_get_free_heap_size'] = function(block, generator) {
  const code = `xPortGetFreeHeapSize()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};
