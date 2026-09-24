Arduino.forBlock["arduino_setup"] = function (block, generator) {
  const code = Arduino.statementToCode(block, "ARDUINO_SETUP");
  generator.addSetup("setup", code);
  return `setup() {\n${code}}\n`;
};

Arduino.forBlock["arduino_loop"] = function (block, generator) {
  const code = Arduino.statementToCode(block, "ARDUINO_LOOP");
  generator.addLoop("loop", code);
  return `loop() {\n${code}}\n`;
};

Arduino.forBlock["arduino_global"] = function (block, generator) {
  const code = Arduino.statementToCode(block, "ARDUINO_GLOBAL");
  // generator.addVariable("global_variables", code);
  // return "";
  return code;
};

Arduino.forBlock["controls_repeat_ext"] = function (block, generator) {
  // Repeat n times.
  let repeats;
  if (block.getField("TIMES")) {
    // Internal number.
    repeats = String(Number(block.getFieldValue("TIMES")));
  } else {
    // External number.
    repeats =
      Arduino.valueToCode(block, "TIMES", Arduino.ORDER_ASSIGNMENT) || "0";
  }
  let branch = Arduino.statementToCode(block, "DO");
  let code = "";
  const loopVar = Arduino.nameDB_.getDistinctName("count", "VARIABLE");
  let endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.utils.string.isNumber(repeats)) {
    endVar = Arduino.nameDB_.getDistinctName("repeat_end", "VARIABLE");
    code += "int " + endVar + " = " + repeats + ";\n";
  }
  code +=
    "for (int " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    endVar +
    "; " +
    loopVar +
    "++) {\n" +
    branch +
    "}\n";
  return code;
};

Arduino.forBlock["controls_repeat"] = Arduino.forBlock["controls_repeat_ext"];

Arduino.forBlock["controls_whileUntil"] = function (block, generator) {
  // Do while/until loop.
  const until = block.getFieldValue("MODE") === "UNTIL";
  let argument0 =
    Arduino.valueToCode(
      block,
      "BOOL",
      until ? Arduino.ORDER_LOGICAL_NOT : Arduino.ORDER_NONE,
    ) || "false";
  let branch = Arduino.statementToCode(block, "DO");
  if (until) {
    argument0 = "!" + argument0;
  }
  return "while (" + argument0 + ") {\n" + branch + "}\n";
};

Arduino.forBlock["controls_for"] = function (block, generator) {
  // For loop.
  const variable0 = Arduino.nameDB_.getName(
    block.getFieldValue("VAR"),
    "VARIABLE",
  );

  addVariableToToolbox(block, variable0);

  const argument0 =
    Arduino.valueToCode(block, "FROM", Arduino.ORDER_ASSIGNMENT) || "0";
  const argument1 =
    Arduino.valueToCode(block, "TO", Arduino.ORDER_ASSIGNMENT) || "0";
  const increment =
    Arduino.valueToCode(block, "BY", Arduino.ORDER_ASSIGNMENT) || "1";
  let branch = Arduino.statementToCode(block, "DO");

  // This block uses an integer counter. Never evaluate C++ expressions in JS.
  const values = [argument0, argument1, increment].map(value => Number(value));
  for (let index = 0; index < values.length; index++) {
    if (!Number.isNaN(values[index]) && !Number.isSafeInteger(values[index])) {
      throw new Error(`controls_for: ${['FROM', 'TO', 'BY'][index]} must be an integer.`);
    }
  }
  if (values[2] === 0) throw new Error('controls_for: BY must be non-zero (for example math_number(1)).');

  if (values.every(Number.isSafeInteger)) {
    const up = values[0] <= values[1];
    const step = Math.abs(values[2]);
    const update = step === 1 ? (up ? '++' : '--') : `${up ? ' += ' : ' -= '}${step}`;
    return `for (int ${variable0} = ${argument0}; ${variable0} ${up ? '<' : '>'} ${argument1}; ${variable0}${update}) {\n${branch}}\n`;
  }

  // Evaluate inputs once, in ABS/block order. Names belong to this generation,
  // so nested loops cannot collide. Runtime zero steps execute no iterations.
  const start = generator.nameDB_.getDistinctName(variable0 + '_start', 'VARIABLE');
  const end = generator.nameDB_.getDistinctName(variable0 + '_end', 'VARIABLE');
  const step = generator.nameDB_.getDistinctName(variable0 + '_step', 'VARIABLE');
  const up = generator.nameDB_.getDistinctName(variable0 + '_up', 'VARIABLE');
  return `const int ${start} = ${argument0};\n` +
    `const int ${end} = ${argument1};\n` +
    `const int ${step} = ${increment};\n` +
    `const bool ${up} = ${start} <= ${end};\n` +
    `for (int ${variable0} = ${start}; ${step} != 0 && (${up} ? ${variable0} < ${end} : ${variable0} > ${end}); ` +
    `${variable0} += (${up} == (${step} > 0) ? ${step} : -${step})) {\n${branch}}\n`;
};

Arduino.forBlock["controls_flow_statements"] = function (block, generator) {
  // Flow statements: continue, break.
  let xfix = "";
  if (Arduino.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  if (Arduino.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Arduino.injectId(Arduino.STATEMENT_SUFFIX, block);
  }
  if (Arduino.STATEMENT_PREFIX) {
    const loop = block.getSurroundLoop();
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Arduino.injectId(Arduino.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return xfix + "break;\n";
    case "CONTINUE":
      return xfix + "continue;\n";
  }
  throw Error("Unknown flow statement.");
};

Arduino.forBlock["controls_whileForever"] = function (block, generator) {
  const branch = Arduino.statementToCode(block, "DO");
  return "while (1) {\n" + branch + "}\n";
};
