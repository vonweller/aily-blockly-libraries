const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

function loadGenerator() {
  const codeDict = { imports: {}, variables: {}, functions: {}, setups: {}, loops: {} };
  const Python = {
    forBlock: {}, ORDER_ATOMIC: 0, ORDER_MEMBER: 2.1, ORDER_FUNCTION_CALL: 2.2, ORDER_NONE: 99,
    codeDict,
    addImport(tag, code) { codeDict.imports[tag] ??= code; },
    addVariable(tag, code) { codeDict.variables[tag] ??= code; },
    addFunction(tag, code) { codeDict.functions[tag] ??= code; },
    addSetup(tag, code) { codeDict.setups[tag] ??= code; },
    addLoop(tag, code) { codeDict.loops[tag] ??= code; },
    valueToCode(block, name) { return block.values?.[name] || ''; },
    statementToCode(block, name) { return block.statements?.[name] || ''; },
    quote_(value) { return JSON.stringify(String(value)); },
  };
  const context = vm.createContext({ Python, MPY: Python, MicropPython: Python, console });
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, '..', 'generator.js'), 'utf8'), context);
  return Python;
}

function block(fields = {}, values = {}, statements = {}) {
  return { getFieldValue: (name) => fields[name], fields, values, statements };
}

test('startup, GPIO and camera generators use the official CyberCAM APIs', () => {
  const py = loadGenerator();
  py.forBlock.cybercam_start(block({}, {}, { DO: 'print("ready")\n' }), py);
  py.forBlock.cybercam_gpio_init(block({ NAME: 'led', PIN: '52', DIRECTION: 'OUTPUT', PULL: 'NONE' }), py);
  py.forBlock.cybercam_camera_init(block({ NAME: 'cam', SENSOR_ID: '2' }, { WIDTH: '640', HEIGHT: '480' }), py);

  assert.equal(py.codeDict.setups.cybercam_start, 'print("ready")');
  assert.equal(py.codeDict.imports.digitalio, 'from digitalio import DigitalInOut, Direction, Pull');
  assert.equal(py.codeDict.variables.gpio_led, 'led = DigitalInOut(board.LED)');
  assert.match(py.codeDict.setups.gpio_led, /led\.direction = Direction\.OUTPUT/);
  assert.equal(py.codeDict.imports.walnutpi_sensor, 'from walnutpi import Sensor');
  assert.equal(py.codeDict.variables.camera_cam, 'cam = Sensor.Sensor(640, 480, id=2)');
});

test('self-contained Python primitives replace Arduino-only core dependencies', () => {
  const py = loadGenerator();
  assert.deepEqual(Array.from(py.forBlock.cybercam_number(block({ VALUE: '42' }), py)), ['42', py.ORDER_ATOMIC]);
  assert.deepEqual(Array.from(py.forBlock.cybercam_text(block({ VALUE: "Cyber'CAM" }), py)), ["\"Cyber'CAM\"", py.ORDER_ATOMIC]);
  assert.deepEqual(Array.from(py.forBlock.cybercam_tuple(block({}, { ITEMS: 'frame' }), py)), ['(frame,)', py.ORDER_ATOMIC]);
  assert.equal(py.forBlock.cybercam_set_variable(block({ NAME: 'frame' }, { VALUE: 'cam.read()[1]' }), py), 'frame = cam.read()[1]\n');
  assert.equal(py.forBlock.cybercam_if(block({}, { CONDITION: 'ready' }, { DO: 'print(frame)\n' }), py), 'if ready:\n    print(frame)\n');
  assert.equal(py.forBlock.cybercam_for_each(block({ NAME: 'result' }, { ITEMS: 'results' }, { DO: 'print(result)\n' }), py), 'for result in results:\n    print(result)\n');
});

test('Python identifiers are sanitized away from reserved words', () => {
  const py = loadGenerator();
  assert.equal(py.forBlock.cybercam_set_variable(block({ NAME: 'class' }, { VALUE: '1' }), py), 'class_ = 1\n');
  assert.deepEqual(Array.from(py.forBlock.cybercam_get_variable(block({ NAME: 'for' }), py)), ['for_', py.ORDER_ATOMIC]);
});

test('vision and every KPU constructor emit documented imports and calls', () => {
  const py = loadGenerator();
  const simple = py.forBlock.cybercam_ai_init_simple(block(
    { NAME: 'det', MODEL: 'YOLO11_DET' },
    { MODEL_PATH: "'/data/model.kmodel'", MODEL_SIZE: '640' },
  ), py);
  const qr = py.forBlock.cybercam_qr_decode(block({}, { IMAGE: 'img' }), py);
  const april = py.forBlock.cybercam_apriltag_init(block({ NAME: 'tags', FAMILY: 'tag36h11' }), py);

  assert.equal(simple, '');
  assert.equal(py.codeDict.variables.ai_det, "det = kpu.YOLO11_DET('/data/model.kmodel', 640)");
  assert.equal(py.codeDict.imports.walnutpi_kpu, 'from walnutpi import kpu');
  assert.deepEqual(Array.from(qr), ['decode(img, symbols=[ZBarSymbol.QRCODE])', py.ORDER_FUNCTION_CALL]);
  assert.equal(py.codeDict.imports.pyzbar, 'from pyzbar.pyzbar import decode, ZBarSymbol');
  assert.equal(april, '');
  assert.match(py.codeDict.variables.apriltag_tags, /Detector\(families="tag36h11"/);
  assert.deepEqual(Array.from(py.forBlock.cybercam_result_property(block({ PROPERTY: 'reliability' }, { RESULT: 'results[0]' }), py)), ['results[0].reliability', py.ORDER_MEMBER]);
});

test('network, audio, IMU and device utility generators remain parameterized', () => {
  const py = loadGenerator();
  py.forBlock.cybercam_mqtt_init(block({ NAME: 'client' }), py);
  const request = py.forBlock.cybercam_http_request(block({ METHOD: 'POST' }, { URL: "'https://example.test'", DATA: "{'ok': True}" }), py);
  const command = py.forBlock.cybercam_command(block({}, { COMMAND: "'uname -a'" }), py);
  py.forBlock.cybercam_imu_init(block({ NAME: 'imu' }, { BUS: '1', ADDRESS: '0x6a' }), py);
  const temp = py.forBlock.cybercam_cpu_temperature(block(), py);

  assert.equal(py.codeDict.imports.mqtt, 'import paho.mqtt.client as mqtt');
  assert.equal(py.codeDict.variables.mqtt_client, 'client = mqtt.Client()');
  assert.deepEqual(Array.from(request), ["requests.post('https://example.test', json={'ok': True})", py.ORDER_FUNCTION_CALL]);
  assert.deepEqual(Array.from(command), ["os.popen(str('uname -a')).read()", py.ORDER_FUNCTION_CALL]);
  assert.match(py.codeDict.functions.cybercam_qmi8658, /class _CyberCamQMI8658/);
  assert.equal(py.codeDict.variables.imu_imu, 'imu = _cybercam_open_imu(1, 0x6a)');
  assert.deepEqual(Array.from(temp), ["int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", py.ORDER_NONE]);
});

test('image, AI result, socket, MQTT and HTTP lifecycle generators emit executable Python', () => {
  const py = loadGenerator();
  const loaded = py.forBlock.cybercam_image_load(block({}, { PATH: "'/data/input.jpg'" }), py);
  const saved = py.forBlock.cybercam_image_save(block({}, { IMAGE: 'frame', PATH: "'/data/output.jpg'" }), py);
  const item = py.forBlock.cybercam_result_item(block({}, { RESULTS: 'detections', INDEX: '2' }), py);
  const property = py.forBlock.cybercam_result_property(block({ PROPERTY: 'json()' }, { RESULT: 'response' }), py);
  py.forBlock.cybercam_socket_init(block({ NAME: 'server', FAMILY: 'AF_INET', TYPE: 'SOCK_STREAM' }), py);
  const bind = py.forBlock.cybercam_socket_bind(block({ NAME: 'server' }, { ADDRESS: "('0.0.0.0', 8080)" }), py);
  const listen = py.forBlock.cybercam_socket_listen(block({ NAME: 'server' }, { BACKLOG: '5' }), py);
  const accept = py.forBlock.cybercam_socket_accept(block({ NAME: 'server' }), py);
  const close = py.forBlock.cybercam_socket_close(block({ NAME: 'server' }), py);
  const disconnect = py.forBlock.cybercam_mqtt_disconnect(block({ NAME: 'client' }), py);
  const http = py.forBlock.cybercam_http_server(block({}, { HOST: "'0.0.0.0'", PORT: '8000' }), py);

  assert.deepEqual(Array.from(loaded), ["cv2.imread('/data/input.jpg')", py.ORDER_FUNCTION_CALL]);
  assert.equal(saved, "cv2.imwrite('/data/output.jpg', frame)\n");
  assert.deepEqual(Array.from(item), ['detections[2]', py.ORDER_MEMBER]);
  assert.deepEqual(Array.from(property), ['response.json()', py.ORDER_MEMBER]);
  assert.equal(py.codeDict.variables.socket_server, 'server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)');
  assert.equal(bind, "server.bind(('0.0.0.0', 8080))\n");
  assert.equal(listen, 'server.listen(5)\n');
  assert.deepEqual(Array.from(accept), ['server.accept()', py.ORDER_FUNCTION_CALL]);
  assert.equal(close, 'server.close()\n');
  assert.equal(disconnect, 'client.disconnect()\n');
  assert.equal(http, "HTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler).serve_forever()\n");
});

test('every declared block has a generator and the combined Python is syntactically valid', () => {
  const py = loadGenerator();
  const definitions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'block.json'), 'utf8'));
  const body = [];
  for (const definition of definitions) {
    assert.equal(typeof py.forBlock[definition.type], 'function', `missing generator ${definition.type}`);
    const generated = py.forBlock[definition.type](block(), py);
    if (Array.isArray(generated)) body.push(generated[0]);
    else if (typeof generated === 'string' && generated.trim()) body.push(generated.trimEnd());
  }
  const sections = [
    Object.values(py.codeDict.imports).join('\n'),
    Object.values(py.codeDict.variables).join('\n'),
    Object.values(py.codeDict.functions).join('\n\n'),
    Object.values(py.codeDict.setups).join('\n'),
    'while True:\n' + (body.length ? body.join('\n').split('\n').map((line) => `    ${line}`).join('\n') : '    pass'),
  ];
  const source = sections.filter(Boolean).join('\n\n') + '\n';
  const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
  assert.equal(parsed.status, 0, parsed.stderr || source);
});
