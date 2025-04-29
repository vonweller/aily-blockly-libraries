Arduino.forBlock['aivox_init_std'] = function(block, generator) {
    const micBclk = block.getFieldValue('MIC_BCLK');
    const micWs = block.getFieldValue('MIC_WS');
    const micDin = block.getFieldValue('MIC_DIN');
    const spkBclk = block.getFieldValue('SPK_BCLK');
    const spkWs = block.getFieldValue('SPK_WS');
    const spkDout = block.getFieldValue('SPK_DOUT');
    const triggerPin = block.getFieldValue('TRIGGER_PIN');

    // Add Libraries
    generator.addLibrary('include_wifi', '#include <WiFi.h>');
    generator.addLibrary('include_aivox_engine', '#include "ai_vox_engine.h"');
    generator.addLibrary('include_aivox_observer', '#include "ai_vox_observer.h"');
    generator.addLibrary('include_i2s_std_input', '#include "i2s_std_audio_input_device.h"');
    generator.addLibrary('include_i2s_std_output', '#include "i2s_std_audio_output_device.h"');

    // Add Objects
    generator.addObject('aivox_observer', 'auto g_observer = std::make_shared<ai_vox::Observer>();', true);
    generator.addObject('aivox_input_device', `auto audio_input_device = std::make_shared<ai_vox::I2sStdAudioInputDevice>(GPIO_NUM_${micBclk}, GPIO_NUM_${micWs}, GPIO_NUM_${micDin});`, true);
    generator.addObject('aivox_output_device', `auto audio_output_device = std::make_shared<ai_vox::I2sStdAudioOutputDevice>(GPIO_NUM_${spkBclk}, GPIO_NUM_${spkWs}, GPIO_NUM_${spkDout});`, true);

    // Add Setup code
    const setupCode = `
  auto& ai_vox_engine = ai_vox::Engine::GetInstance();
  ai_vox_engine.SetObserver(g_observer);
  ai_vox_engine.SetTrigger(GPIO_NUM_${triggerPin});
  ai_vox_engine.Start(audio_input_device, audio_output_device);
`;
    generator.addSetup('aivox_start', setupCode, false);

    return ''; // This block generates setup code, not loop code.
};

// --- Event Loop ---
Arduino.forBlock['aivox_loop'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');

    // Add necessary loop code
    const loopCode = `
  const auto events = g_observer->PopEvents();
  for (auto& event : events) {
${statements_do}
  }
  taskYIELD();
`;
    // Use addLoop to ensure it's added correctly, tag prevents duplicates if block used multiple times (though unlikely for this type)
    generator.addLoop('aivox_event_loop', loopCode, true);
    return ''; // The main loop logic is added via addLoop
};

// --- Event Checks and Data Getters ---
// Helper function to get the variable name for the current event type
function getEventVarName(block) {
    let parent = block.getParent();
    while (parent) {
        if (parent.type === 'aivox_event_is_activation') return 'activation_event';
        if (parent.type === 'aivox_event_is_state_change') return 'state_changed_event';
        if (parent.type === 'aivox_event_is_emotion') return 'emotion_event';
        if (parent.type === 'aivox_event_is_chat_message') return 'chat_message_event';
        parent = parent.getParent();
    }
    return null; // Should not happen if blocks are used correctly
}


Arduino.forBlock['aivox_event_is_activation'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto activation_event = std::get_if<ai_vox::Observer::ActivationEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_activation_message'] = function(block, generator) {
    const eventVar = getEventVarName(block);
    if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->message.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_activation_code'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'activation_event') {
        return ['/* ERROR: Block must be inside "If event is Activation" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->code.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_state_change'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto state_changed_event = std::get_if<ai_vox::Observer::StateChangedEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_new_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->new_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_get_old_state'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'state_changed_event') {
        return ['/* ERROR: Block must be inside "If event is State Change" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->old_state`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_state_enum'] = function(block, generator) {
    const state = block.getFieldValue('STATE');
    return [state, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_event_is_emotion'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto emotion_event = std::get_if<ai_vox::Observer::EmotionEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_emotion'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'emotion_event') {
        return ['/* ERROR: Block must be inside "If event is Emotion" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->emotion.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_event_is_chat_message'] = function(block, generator) {
    const statements_do = generator.statementToCode(block, 'DO');
    const code = `if (auto chat_message_event = std::get_if<ai_vox::Observer::ChatMessageEvent>(&event)) {\n${statements_do}}\n`;
    return code;
};

Arduino.forBlock['aivox_get_chat_role'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->role`;
    return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['aivox_role_enum'] = function(block, generator) {
    const role = block.getFieldValue('ROLE');
    return [role, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['aivox_get_chat_content'] = function(block, generator) {
    const eventVar = getEventVarName(block);
     if (!eventVar || eventVar !== 'chat_message_event') {
        return ['/* ERROR: Block must be inside "If event is Chat Message" */', Arduino.ORDER_ATOMIC];
    }
    const code = `${eventVar}->content.c_str()`;
    return [code, Arduino.ORDER_MEMBER];
};