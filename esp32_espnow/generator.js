// ESP-NOW Blockly Generator for Arduino
// 避免重复加载扩展
if (typeof Arduino !== 'undefined') {

// ESP-NOW Serial Mode - 串口模式
Arduino.forBlock['espnow_serial_init'] = function(block, generator) {
    const peerMac = generator.valueToCode(block, 'PEER_MAC', Arduino.ORDER_ATOMIC) || '"F4:12:FA:40:64:4C"';
    const channel = block.getFieldValue('CHANNEL') || '1';
    const mode = block.getFieldValue('MODE') || 'STATION';
    
    generator.addLibrary('#include <ESP32_NOW_Serial.h>', '#include "ESP32_NOW_Serial.h"');
    generator.addLibrary('#include <MacAddress.h>', '#include "MacAddress.h"');
    generator.addLibrary('#include <WiFi.h>', '#include "WiFi.h"');
    generator.addLibrary('#include <esp_wifi.h>', '#include "esp_wifi.h"');
    
    if (mode === 'STATION') {
        generator.addMacro('#define ESPNOW_WIFI_MODE_STATION 1', '#define ESPNOW_WIFI_MODE_STATION 1');
        generator.addMacro('#define ESPNOW_WIFI_MODE WIFI_STA', '#define ESPNOW_WIFI_MODE WIFI_STA');
        generator.addMacro('#define ESPNOW_WIFI_IF WIFI_IF_STA', '#define ESPNOW_WIFI_IF WIFI_IF_STA');
    } else {
        generator.addMacro('#define ESPNOW_WIFI_MODE_STATION 0', '#define ESPNOW_WIFI_MODE_STATION 0');
        generator.addMacro('#define ESPNOW_WIFI_MODE WIFI_AP', '#define ESPNOW_WIFI_MODE WIFI_AP');
        generator.addMacro('#define ESPNOW_WIFI_IF WIFI_IF_AP', '#define ESPNOW_WIFI_IF WIFI_IF_AP');
    }
    
    generator.addMacro('#define ESPNOW_WIFI_CHANNEL ' + channel, '#define ESPNOW_WIFI_CHANNEL ' + channel);
    
    // 解析MAC地址字符串
    const macParseCode = `
// 解析MAC地址字符串
MacAddress parseMacAddress(String macStr) {
    uint8_t mac[6];
    int values[6];
    if (sscanf(macStr.c_str(), "%x:%x:%x:%x:%x:%x", &values[0], &values[1], &values[2], &values[3], &values[4], &values[5]) == 6) {
        for (int i = 0; i < 6; i++) {
            mac[i] = (uint8_t) values[i];
        }
    }
    return MacAddress(mac);
}`;
    generator.addFunction('parseMacAddress', macParseCode);
    
    generator.addVariable('MacAddress peer_mac', 'MacAddress peer_mac;');
    generator.addVariable('ESP_NOW_Serial_Class* NowSerial', 'ESP_NOW_Serial_Class* NowSerial = nullptr;');
    
    const setupCode = `
    peer_mac = parseMacAddress(${peerMac});
    WiFi.mode(ESPNOW_WIFI_MODE);
    WiFi.setChannel(ESPNOW_WIFI_CHANNEL, WIFI_SECOND_CHAN_NONE);
    while (!(WiFi.STA.started() || WiFi.AP.started())) {
        delay(100);
    }
    NowSerial = new ESP_NOW_Serial_Class(peer_mac, ESPNOW_WIFI_CHANNEL, ESPNOW_WIFI_IF);
    NowSerial->begin(115200);`;
    
    generator.addSetup('espnow_serial_init', setupCode);
    
    return '';
};

Arduino.forBlock['espnow_serial_available'] = function(block, generator) {
    return ['(NowSerial != nullptr && NowSerial->available())', Arduino.ORDER_LOGICAL_AND];
};

Arduino.forBlock['espnow_serial_read'] = function(block, generator) {
    const code = `(NowSerial != nullptr ? String((char)NowSerial->read()) : String(""))`;
    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['espnow_serial_write'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    const code = `if (NowSerial != nullptr && NowSerial->availableForWrite()) {
    String dataStr = ${data};
    for (int i = 0; i < dataStr.length(); i++) {
        if (NowSerial->write(dataStr[i]) <= 0) {
            Serial.println("Failed to send data");
            break;
        }
    }
}`;
    
    return code;
};

// ESP-NOW Broadcast Master Mode - 广播主机模式
Arduino.forBlock['espnow_broadcast_master_init'] = function(block, generator) {
    const channel = block.getFieldValue('CHANNEL') || '6';
    
    generator.addLibrary('#include <ESP32_NOW.h>', '#include "ESP32_NOW.h"');
    generator.addLibrary('#include <WiFi.h>', '#include "WiFi.h"');
    generator.addLibrary('#include <esp_mac.h>', '#include <esp_mac.h>');
    
    generator.addMacro('#define ESPNOW_WIFI_CHANNEL ' + channel, '#define ESPNOW_WIFI_CHANNEL ' + channel);
    
    const broadcastPeerClass = `
class ESP_NOW_Broadcast_Peer : public ESP_NOW_Peer {
public:
    ESP_NOW_Broadcast_Peer(uint8_t channel, wifi_interface_t iface, const uint8_t *lmk) 
        : ESP_NOW_Peer(ESP_NOW.BROADCAST_ADDR, channel, iface, lmk) {}
    
    ~ESP_NOW_Broadcast_Peer() {
        remove();
    }
    
    bool begin() {
        if (!ESP_NOW.begin() || !add()) {
            return false;
        }
        return true;
    }
    
    bool send_message(const uint8_t *data, size_t len) {
        return send(data, len);
    }
};`;
    
    generator.addFunction('ESP_NOW_Broadcast_Peer_Class', broadcastPeerClass);
    generator.addVariable('ESP_NOW_Broadcast_Peer* broadcast_peer', 'ESP_NOW_Broadcast_Peer* broadcast_peer = nullptr');
    generator.addVariable('uint32_t msg_count', 'uint32_t msg_count = 0');
    
    const setupCode = `
    WiFi.mode(WIFI_STA);
    WiFi.setChannel(ESPNOW_WIFI_CHANNEL);
    while (!WiFi.STA.started()) {
        delay(100);
    }
    broadcast_peer = new ESP_NOW_Broadcast_Peer(ESPNOW_WIFI_CHANNEL, WIFI_IF_STA, NULL);
    if (!broadcast_peer->begin()) {
        Serial.println("Failed to initialize broadcast peer");
        ESP.restart();
    }`;
    
    generator.addSetup('espnow_broadcast_master_init', setupCode);
    
    return '';
};

Arduino.forBlock['espnow_broadcast_send'] = function(block, generator) {
    const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
    
    const code = `if (broadcast_peer != nullptr) {
    String msgStr = ${message};
    if (!broadcast_peer->send_message((uint8_t *)msgStr.c_str(), msgStr.length() + 1)) {
        Serial.println("Failed to broadcast message");
    }
    msg_count++;
}`;
    
    return code;
};

// ESP-NOW Broadcast Slave Mode - 广播从机模式
Arduino.forBlock['espnow_broadcast_slave_init'] = function(block, generator) {
    const channel = block.getFieldValue('CHANNEL') || '6';
    
    generator.addLibrary('#include <ESP32_NOW.h>', '#include "ESP32_NOW.h"');
    generator.addLibrary('#include <WiFi.h>', '#include "WiFi.h"');
    generator.addLibrary('#include <esp_mac.h>', '#include <esp_mac.h>');
    generator.addLibrary('#include <vector>', '#include <vector>');
    
    generator.addMacro('#define ESPNOW_WIFI_CHANNEL ' + channel, '#define ESPNOW_WIFI_CHANNEL ' + channel);
    
    const slavePeerClass = `
class ESP_NOW_Peer_Class : public ESP_NOW_Peer {
public:
    ESP_NOW_Peer_Class(const uint8_t *mac_addr, uint8_t channel, wifi_interface_t iface, const uint8_t *lmk) 
        : ESP_NOW_Peer(mac_addr, channel, iface, lmk) {}
    
    ~ESP_NOW_Peer_Class() {}
    
    bool add_peer() {
        return add();
    }
    
    void onReceive(const uint8_t *data, size_t len, bool broadcast) {
        if (espnow_receive_callback_set) {
            espnow_received_data = String((char*)data);
            memcpy(espnow_sender_mac, addr(), 6);
            espnow_receive_callback_set = false;
        }
    }
};`;
    
    generator.addFunction('ESP_NOW_Peer_Class_Slave', slavePeerClass);
    generator.addVariable('std::vector<ESP_NOW_Peer_Class> masters', 'std::vector<ESP_NOW_Peer_Class> masters');
    generator.addVariable('String espnow_received_data', 'String espnow_received_data = ""');
    generator.addVariable('uint8_t espnow_sender_mac[6]', 'uint8_t espnow_sender_mac[6]');
    generator.addVariable('bool espnow_receive_callback_set', 'bool espnow_receive_callback_set = false');
    
    const registerCallback = `
void register_new_master(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg) {
    if (memcmp(info->des_addr, ESP_NOW.BROADCAST_ADDR, 6) == 0) {
        ESP_NOW_Peer_Class new_master(info->src_addr, ESPNOW_WIFI_CHANNEL, WIFI_IF_STA, NULL);
        masters.push_back(new_master);
        if (!masters.back().add_peer()) {
            masters.pop_back();
        }
    }
}`;
    
    generator.addFunction('register_new_master', registerCallback);
    
    const setupCode = `
    WiFi.mode(WIFI_STA);
    WiFi.setChannel(ESPNOW_WIFI_CHANNEL);
    while (!WiFi.STA.started()) {
        delay(100);
    }
    if (!ESP_NOW.begin()) {
        Serial.println("Failed to initialize ESP-NOW");
        ESP.restart();
    }
    ESP_NOW.onNewPeer(register_new_master, NULL);`;
    
    generator.addSetup('espnow_broadcast_slave_init', setupCode);
    
    return '';
};

// ESP-NOW Callback and Data Access
Arduino.forBlock['espnow_on_receive'] = function(block, generator) {
    const callback = generator.statementToCode(block, 'CALLBACK');
    
    generator.addVariable('bool espnow_data_received', 'bool espnow_data_received = false');
    
    const loopCode = `if (espnow_data_received) {
    espnow_data_received = false;
    espnow_receive_callback_set = true;
${callback}
}`;
    
    generator.addLoop('espnow_receive_check', loopCode);
    
    return '';
};

Arduino.forBlock['espnow_get_received_data'] = function(block, generator) {
    return ['espnow_received_data', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['espnow_get_sender_mac'] = function(block, generator) {
    const code = `String(espnow_sender_mac[0], HEX) + ":" + String(espnow_sender_mac[1], HEX) + ":" + 
String(espnow_sender_mac[2], HEX) + ":" + String(espnow_sender_mac[3], HEX) + ":" + 
String(espnow_sender_mac[4], HEX) + ":" + String(espnow_sender_mac[5], HEX)`;
    return [code, Arduino.ORDER_ADDITIVE];
};

// ESP-NOW Network Mode - 网络模式
Arduino.forBlock['espnow_network_init'] = function(block, generator) {
    const channel = block.getFieldValue('CHANNEL') || '4';
    const peerCount = block.getFieldValue('PEER_COUNT') || '2';
    
    generator.addLibrary('#include <ESP32_NOW.h>', '#include "ESP32_NOW.h"');
    generator.addLibrary('#include <WiFi.h>', '#include "WiFi.h"');
    generator.addLibrary('#include <esp_mac.h>', '#include <esp_mac.h>');
    generator.addLibrary('#include <vector>', '#include <vector>');
    
    generator.addMacro('#define ESPNOW_WIFI_CHANNEL ' + channel, '#define ESPNOW_WIFI_CHANNEL ' + channel);
    generator.addMacro('#define ESPNOW_PEER_COUNT ' + peerCount, '#define ESPNOW_PEER_COUNT ' + peerCount);
    generator.addMacro('#define ESPNOW_EXAMPLE_PMK "pmk1234567890123"', '#define ESPNOW_EXAMPLE_PMK "pmk1234567890123"');
    generator.addMacro('#define ESPNOW_EXAMPLE_LMK "lmk1234567890123"', '#define ESPNOW_EXAMPLE_LMK "lmk1234567890123"');
    
    const dataStruct = `
typedef struct {
    uint32_t count;
    uint32_t priority;
    uint32_t data;
    bool ready;
    char str[7];
} __attribute__((packed)) esp_now_data_t;`;
    
    generator.addFunction('esp_now_data_struct', dataStruct);
    
    const networkPeerClass = `
class ESP_NOW_Network_Peer : public ESP_NOW_Peer {
public:
    uint32_t priority;
    bool peer_is_master = false;
    bool peer_ready = false;
    
    ESP_NOW_Network_Peer(const uint8_t *mac_addr, uint32_t priority = 0, const uint8_t *lmk = (const uint8_t *)ESPNOW_EXAMPLE_LMK)
        : ESP_NOW_Peer(mac_addr, ESPNOW_WIFI_CHANNEL, WIFI_IF_STA, lmk), priority(priority) {}
    
    bool begin() {
        return add();
    }
    
    bool send_message(const uint8_t *data, size_t len) {
        return send(data, len);
    }
    
    void onReceive(const uint8_t *data, size_t len, bool broadcast) {
        esp_now_data_t *msg = (esp_now_data_t *)data;
        if (peer_ready == false && msg->ready == true) {
            peer_ready = true;
        }
    }
};`;
    
    generator.addFunction('ESP_NOW_Network_Peer_Class', networkPeerClass);
    
    generator.addVariable('uint32_t self_priority', 'uint32_t self_priority = 0');
    generator.addVariable('uint8_t current_peer_count', 'uint8_t current_peer_count = 0');
    generator.addVariable('bool device_is_master', 'bool device_is_master = false');
    generator.addVariable('bool master_decided', 'bool master_decided = false');
    generator.addVariable('std::vector<ESP_NOW_Network_Peer*> peers', 'std::vector<ESP_NOW_Network_Peer*> peers');
    generator.addVariable('esp_now_data_t new_msg', 'esp_now_data_t new_msg');
    
    const networkCallback = `
void register_network_peer(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg) {
    esp_now_data_t *msg = (esp_now_data_t *)data;
    uint32_t priority = msg->priority;
    
    if (priority != self_priority && current_peer_count < ESPNOW_PEER_COUNT) {
        ESP_NOW_Network_Peer *new_peer = new ESP_NOW_Network_Peer(info->src_addr, priority);
        if (new_peer != nullptr && new_peer->begin()) {
            peers.push_back(new_peer);
            current_peer_count++;
            if (current_peer_count == ESPNOW_PEER_COUNT) {
                uint32_t highest_priority = self_priority;
                for (auto &peer : peers) {
                    if (peer->priority > highest_priority) {
                        highest_priority = peer->priority;
                    }
                }
                device_is_master = (self_priority == highest_priority);
                master_decided = true;
            }
        }
    }
}`;
    
    generator.addFunction('register_network_peer', networkCallback);
    
    const setupCode = `
    uint8_t self_mac[6];
    WiFi.mode(WIFI_STA);
    WiFi.setChannel(ESPNOW_WIFI_CHANNEL);
    while (!WiFi.STA.started()) {
        delay(100);
    }
    
    WiFi.macAddress(self_mac);
    self_priority = self_mac[3] << 16 | self_mac[4] << 8 | self_mac[5];
    
    if (!ESP_NOW.begin((const uint8_t *)ESPNOW_EXAMPLE_PMK)) {
        Serial.println("Failed to initialize ESP-NOW");
        ESP.restart();
    }
    
    ESP_NOW.onNewPeer(register_network_peer, NULL);
    
    memset(&new_msg, 0, sizeof(new_msg));
    strncpy(new_msg.str, "Hello!", sizeof(new_msg.str));
    new_msg.priority = self_priority;`;
    
    generator.addSetup('espnow_network_init', setupCode);
    
    return '';
};

Arduino.forBlock['espnow_network_send_data'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
    
    const code = `if (master_decided && device_is_master) {
    new_msg.data = ${data};
    new_msg.ready = true;
    for (auto &peer : peers) {
        peer->send_message((const uint8_t *)&new_msg, sizeof(new_msg));
    }
}`;
    
    return code;
};

Arduino.forBlock['espnow_is_master'] = function(block, generator) {
    return ['(master_decided && device_is_master)', Arduino.ORDER_LOGICAL_AND];
};

// Utility function
Arduino.forBlock['espnow_get_mac_address'] = function(block, generator) {
    return ['WiFi.macAddress()', Arduino.ORDER_ATOMIC];
};

} // end if Arduino !== undefined
