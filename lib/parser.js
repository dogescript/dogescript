var tokenizer = require("./tokenizer");

var tokenUtils = require("./util/tokenUtils");

var classHandlers = require("./handlers/classHandlers");
var functionHandlers = require("./handlers/functionHandlers");
var invocationHandlers = require("./handlers/invocationHandlers");
var moduleHandlers = require("./handlers/moduleHandlers");

var parserState = require("./parserState");
const StateEnum = parserState.StateEnum;

var validOperators = {
  is: " === ",
  not: " !== ",
  and: " && ",
  or: " || ",
  as: " = ",
  more: " += ",
  less: " -= ",
  lots: " *= ",
  few: " /= ",
  very: " var ",
  smaller: " < ",
  bigger: " > ",
  smallerish: " <= ",
  biggerish: " >= ",
  notrly: " ! ",
  bigify: "++",
  smallify: "--"
};

var assignOps = {
  more: "+=",
  less: "-=",
  lots: "*=",
  few: "/=",
  is: "=",
  as: "="
};

var unaryOps = {
  bigify: "++",
  smallify: "--"
};

var binaryOperators = {
  bigger: ">",
  biggerish: ">=",
  smaller: "<",
  smallerish: "<=",
  and: "&&",
  or: "||",
  not: "!=="
};

// giv can probably be applied as a binary operator since it's a simple transform
var propertyOperators = ["giv", "levl"];

var incrementDecrementOps = ["bigify", "smallify"];

var controlFlowTokens = ["many", "much", "rly", "but", "notrly"];

var valid = [
  "such",
  "wow",
  "wow&",
  "plz",
  ".plz",
  "dose",
  "very",
  "shh",
  "quiet",
  "loud",
  "rly",
  "notrly",
  "but",
  "many",
  "much",
  "so",
  "trained",
  "maybe",
  "debooger",
  "pawse",
  "woof",
  "obj", // can be handled as top-level token
  "giv",
  "levl",
  "next",
  "amaze",
  "classy",
  "maker",
  "grows",
  "git",
  "sit",
  "stay"
];

function containsUnary(parseContext) {
  var tokens = parseContext.tokens;
  return (
    unaryOps.hasOwnProperty(tokens[0]) || unaryOps.hasOwnProperty(tokens[1])
  );
}

/**
 * Determines whether the first or second token is one of [bigify, smallify]
 */
function containsIncrementDecrement(parseContext) {
  var tokens = parseContext.tokens;
  return (
    incrementDecrementOps.indexOf(tokens[0]) !== -1 ||
    incrementDecrementOps.indexOf(tokens[1]) !== -1
  );
}

/**
 * Determines if the parsed tokens should be treated as dogescript source or not.
 */
function isDogescriptSource(parseContext) {
  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // starts the statement with a valid token
  if (valid.indexOf(tokens[0]) !== -1) {
    return true;
  }

  // statement applying an assignment operator
  if (tokens.some(isAssignmentOperator)) {
    return true;
  }

  // applying a unary operator
  if (containsUnary(parseContext)) {
    return true;
  }

  // calling function on Object
  if (tokens[1] === "dose") {
    return true;
  }

  // ending a multi comment block
  if (state.hasState(StateEnum.MULTILINE_COMMENT) && tokens[0] === "loud") {
    return true;
  }

  // closing a multi-line object creation
  if (state.hasState(StateEnum.OBJECT) && tokens[0] === "wow") {
    return true;
  }

  // binary operation anywhere
  if (tokens.some(isBinaryOperator)) {
    return true;
  }

  // something uses a property accessor
  if (tokens.some(isPropertyOperator)) {
    return true;
  }

  // check if next is anywhere in the stack
  if (
    tokens.some(function(token) {
      return token === "next";
    })
  ) {
    return true;
  }

  // not valid dogescript
  return false;
}

/**
 * Creates a formatted message that displays the token set that was parsed and the input.
 */
function parseInfo(parseContext) {
  return `Parsed tokens [${parseContext.inputTokens}] from input "${parseContext.input}"`;
}

/**
 * Determines whether it's appropriate or not to close a statement with a ';'.
 */
function shouldCloseStatement(parseContext, statement) {
  var state = parseContext.state;

  // there's more to parse
  if (parseContext.tokens.length > 0) {
    return false;
  }

  // don't append an extra ';' if the statement can be considered already closed
  if (statement.trim().endsWith(";")) {
    return false;
  }

  // when we multi chain call on the next line we can't append a ';'
  if (statement.trim().endsWith(")")) {
    return false;
  }

  // if we're opening a json block we have more statement
  if (statement.trim().endsWith("{")) {
    return false;
  }

  // if we're in multiline mode, the property:value assignments should not have a ';'
  return !state.hasState(StateEnum.OBJECT);
}

/**
 * Determines whether the token is any of the supported binary operators
 */
function isBinaryOperator(token) {
  return binaryOperators.hasOwnProperty(token);
}

/**
 * Determins whether the token is a property accessor token
 */
function isPropertyOperator(token) {
  return propertyOperators.includes(token);
}

/**
 * Determines whether the token is an assignment token
 */
function isAssignmentOperator(token) {
  return assignOps.hasOwnProperty(token);
}

/**
 * Handles the single line comment:
 * shh [text]
 *
 * Produces:
 * // text
 */
function handleShh(parseContext) {
  tokenUtils.expectToken("shh", parseContext);

  var tokens = parseContext.tokens;

  // consume: shh
  tokens.shift();

  var statement = "// ";

  // preserve any spacing after 'shh '
  var input = parseContext.input;
  var shhLocation = input.indexOf("shh ");
  var commentText = input.substring(shhLocation + 4);
  statement += commentText;
  statement += "\n";

  // consume tokens so we don't reparse
  parseContext.tokens = [];

  return statement;
}

/**
 * Handles the beginning of a multi-line comment:
 * quiet [comments]
 *
 * Produces the start of a multi-line comment "/*"
 */
function handleQuiet(parseContext) {
  tokenUtils.expectToken("quiet", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: quiet
  tokens.shift();

  state.pushState(StateEnum.MULTILINE_COMMENT);

  var statement = "/*";
  statement += tokenUtils.joinTokens(parseContext.tokens);
  statement += "\n";

  return statement;
}

/**
 * Handles the end of the multi-line comment:
 * loud
 *
 * Produces the end of a multiline comment "*\/"
 */
function handleLoud(parseContext) {
  tokenUtils.expectToken("loud", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  if (!state.hasState(StateEnum.MULTILINE_COMMENT)) {
    throw new Error(
      "Unparseable syntax! Encountered: 'loud' without first seeing 'quiet'"
    );
  }

  // consume: loud
  tokens.shift();

  // Remove multicomment state
  state.popState();

  var statement = "*/";
  statement += tokenUtils.joinTokens(parseContext.tokens);
  statement += "\n";

  return statement;
}

/**
 * Handles if statements:
 * rly [condition]
 */
function handleRly(parseContext) {
  tokenUtils.expectToken("rly", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: rly
  tokens.shift();

  var statement = "if (";
  state.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  state.popState();
  // close condition and open branch
  statement += ") {\n";
  return statement;
}

/**
 * Handles negated if statements:
 * notrly [condition]
 */
function handleNotrly(parseContext) {
  tokenUtils.expectToken("notrly", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: notrly
  tokens.shift();

  var statement = "if (!";
  state.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  state.popState();
  // close condition and open branch
  statement += ") {\n";
  return statement;
}

/**
 * Handles else statements:
 * but [condition]
 * but [rly|notrly] [condition]
 */
function handleBut(parseContext) {
  tokenUtils.expectToken("but", parseContext);

  var tokens = parseContext.tokens;

  // consume: but
  tokens.shift();

  var statement = "} else ";
  if (tokens[0] === "rly" || tokens[0] === "notrly") {
    if (tokens[0] === "rly") {
      statement += handleRly(parseContext);
    } else {
      statement += handleNotrly(parseContext);
    }
  } else {
    // open branch
    statement += "{\n";
  }
  return statement;
}

/**
 * Handles the ending of statements:
 * wow [return vals]
 * wow& [return vals]
 */
function handleWow(parseContext) {
  tokenUtils.expectAnyToken(["wow", "wow&"], parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // turn off multiline declaration
  if (state.hasState(StateEnum.OBJECT)) {
    state.popState();
  }

  var chained = tokens[0] === "wow&";

  // consume: wow/wow&
  tokens.shift();

  var statement = "";

  // add tokens if there's a return value
  if (tokens.length > 0) {
    statement += "return";
    let arg;
    // ideally this will call parsetokens in the future to support return foo();
    while ((arg = tokens.shift())) {
      statement += " " + arg;
    }
    statement += ";\n";
  }

  if (chained) {
    // close chained call
    statement += "}) \n";
  } else {
    // close block
    statement += "} \n";
  }

  return statement;
}

/**
 * Handles the for loop construct:
 * much [startState] next [condition] next [nextState]
 *
 * Produces:
 * for(startState; condition; nextState) {
 */
function handleMuchLoop(parseContext) {
  tokenUtils.expectToken("much", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: much
  tokens.shift();

  var statement = "for (";
  state.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  state.popState();
  statement += ") {\n";
  return statement;
}

/**
 * Handles the while loop construct:
 * many [condition]
 *
 * Produces:
 * while(condition) {
 */
function handleMany(parseContext) {
  tokenUtils.expectToken("many", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: many
  tokens.shift();

  var statement = "while (";
  state.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  state.popState();
  statement += ") {\n";

  return statement;
}

/**
 * Handles the increment and decrement unary operators in either pre or postfix form:
 *  <identifier> bigify|smallify
 *  bigify|smallify <identifier>
 *
 * Produces:
 *  identifier++ | identifier--
 *  ++identifier | --identifier
 */
function handleIncrementDecrement(parseContext) {
  if (!containsIncrementDecrement(parseContext)) {
    throw new Error(
      `Invalid parse state! Expected an operator from: ${incrementDecrementOps} in either '<identifier> operator' or 'operator <identifer>' but got chain: [${tokens}]`
    );
  }

  var tokens = parseContext.tokens;

  // prefix
  if (unaryOps.hasOwnProperty(tokens[0])) {
    return unaryOps[tokens.shift()] + tokens.shift();
  }

  // postfix
  return tokens.shift() + unaryOps[tokens.shift()];
}

/**
 * Handles variable declaration:
 *  very <variable> is <value>
 *
 * Produces:
 *  var <variable> = <value>;
 */
function handleVery(parseContext) {
  tokenUtils.expectToken("very", parseContext);

  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // consume: very
  tokens.shift();

  var statement = "var " + tokens.shift() + " = ";

  // consume:is/as
  tokens.shift();

  if (tokens[0] === "new") {
    statement += invocationHandlers.handleNew(parseContext);
    return statement;
  }

  if (tokens[0] === "much") {
    var anonStatement = functionHandlers.handleLambda(parseContext);
    statement += anonStatement;
    return statement;
  }

  if (tokens[0] === "obj") {
    // consume obj
    tokens.shift();
    statement += "{\n";
    state.pushState(StateEnum.OBJECT);
    return statement;
  }

  // the condition check below needs fixing so we can resolve this with just parseStatement
  if (tokens[0] === "classy") {
    statement += classHandlers.handleClass(parseContext);
    return statement;
  }

  if (tokens.length > 1) {
    statement += parseStatement(parseContext);

    if (!shouldCloseStatement(parseContext, statement)) {
      return statement;
    }
  } else {
    statement += tokens.shift();
  }

  statement += ";\n";
  return statement;
}

/**
 * Handles property accession with an index:
 *  <object> levl <key>
 *
 * Produces:
 *  object[key];
 */
function handleLevl(parseContext) {
  tokenUtils.expectToken("levl", parseContext);

  var tokens = parseContext.tokens;

  // consume levl
  tokens.shift();

  // there should be a next token
  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected argument but got nothing. Allowed construct: obj levl [arg]. ${parseInfo(
        parseContext
      )}`
    );
  }

  return `[${tokens.shift()}]`;
}

/**
 * Handles explicit return:
 *  amaze <expression>
 *
 * Produces:
 *  return <expression>;
 */
function handleAmaze(parseContext) {
  tokenUtils.expectToken("amaze", parseContext);

  // consume: amaze
  parseContext.tokens.shift();

  return "return " + returnStatements(parseContext);
}

/**
 * Creates the statement needed when declaring arguments.
 *
 * Given: [a, b, c]
 *
 * Produces:
 * ' (a, b, c) { \n'
 */
function declareArguments(parseContext) {
  var tokens = parseContext.tokens;

  var statement = " (";
  let arg;
  while ((arg = tokens.shift())) {
    statement += arg;
    if (tokens.length > 0) {
      statement += ", ";
    }
  }
  statement += ") { \n";
  return statement;
}

/**
 * Appends statements from the parse context into a single line
 */
function returnStatements(parseContext) {
  var statement = parseStatements(parseContext);
  if (shouldCloseStatement(parseContext, statement)) {
    statement += ";\n";
  }

  return statement;
}

function parseStatement(parseContext) {
  var tokens = parseContext.tokens;
  var state = parseContext.state;

  // if processing multi-comment
  if (state.hasState(StateEnum.MULTILINE_COMMENT)) {
    // consume tokens until we encounter loud
    if (tokens[0] !== "loud") {
      // clear out tokens
      parseContext.tokens = [];
      return parseContext.input + "\n";
    }
    // else must be loud
    return handleLoud(parseContext);
  }

  // not dogescript, such javascript
  if (!isDogescriptSource(parseContext)) {
    return tokenUtils.joinTokens(tokens) + "\n";
  }

  // trained use strict
  if (tokens[0] === "trained") {
    // consume: trained
    tokens.shift();
    return '"use strict";\n';
  }

  // such function
  if (tokens[0] === "such") {
    return functionHandlers.handleSuch(parseContext);
  }

  if (tokens[0] === "wow" || tokens[0] === "wow&") {
    return handleWow(parseContext);
  }

  // plz execute function
  if (tokens[0] === "plz" || tokens[0] === ".plz") {
    return invocationHandlers.handlePlz(parseContext);
  }
  // obj dose function
  if (tokens[0] === "dose" || tokens[1] === "dose") {
    return invocationHandlers.handleDose(parseContext);
  }

  // very new variable
  if (tokens[0] === "very") {
    return handleVery(parseContext);
  }

  // only applicable to disambiguate during control flow parsing
  if (state.hasState(StateEnum.CONTROL_FLOW)) {
    // convert to supported operator / otherwise fall thorugh
    // TODO remove operators as they become supported
    if (validOperators.hasOwnProperty(tokens[0])) {
      return validOperators[tokens.shift()];
    }
  }

  // support any kind of assignment operator
  if (assignOps.hasOwnProperty(tokens[0])) {
    var statement = assignOps[tokens.shift()];

    if (tokens[0] === "new") {
      statement += invocationHandlers.handleNew(parseContext);
      return statement;
    }

    statement += parseStatement(parseContext);

    if (shouldCloseStatement(parseContext, statement)) {
      statement += ";\n";
    }

    return statement;
  }

  // shh comment
  if (tokens[0] === "shh") {
    return handleShh(parseContext);
  }

  // quiet start multi-line comment
  if (tokens[0] === "quiet") {
    return handleQuiet(parseContext);
  }

  // rly if
  if (tokens[0] === "rly") {
    return handleRly(parseContext);
  }

  // ntrly if
  if (tokens[0] === "notrly") {
    return handleNotrly(parseContext);
  }

  // but else
  if (tokens[0] === "but") {
    return handleBut(parseContext);
  }

  // many while
  if (tokens[0] === "many") {
    return handleMany(parseContext);
  }

  // much for
  if (tokens[0] === "much") {
    return handleMuchLoop(parseContext);
  }

  // so require
  if (tokens[0] === "so") {
    return moduleHandlers.handleSo(parseContext);
  }

  // maybe boolean operator
  if (tokens[0] === "maybe") {
    // consume: maybe
    tokens.shift();
    return "(!!+Math.round(Math.random()))";
  }

  if (tokens[0] === "next") {
    // consume next
    tokens.shift();
    return ";";
  }

  // standalone increment/decrement
  if (containsIncrementDecrement(parseContext)) {
    return handleIncrementDecrement(parseContext);
  }

  if (tokens[0] === "woof") {
    return moduleHandlers.handleWoof(parseContext);
  }

  if (tokens[0] === "debooger" || tokens[0] === "pawse") {
    // consume: debooger/pawse
    tokens.shift();
    return "debugger;";
  }

  if (tokens[0] === "obj") {
    // consume obj
    tokens.shift();
    state.pushState(StateEnum.OBJECT);
    return "{\n";
  }

  if (isBinaryOperator(tokens[0])) {
    var statement = binaryOperators[tokens.shift()];
    if (tokens.length > 0) {
      statement += " ";
    }
    return statement;
  }

  if (tokens[0] === "giv") {
    // consume giv
    tokens.shift();
    return ".";
  }

  if (tokens[0] === "levl") {
    return handleLevl(parseContext);
  }

  if (tokens[0] === "amaze") {
    return handleAmaze(parseContext);
  }

  if (tokens[0] === "classy") {
    return classHandlers.handleClass(parseContext);
  }

  if (tokens[0] === "maker") {
    return classHandlers.handleMaker(parseContext);
  }

  if (tokens[0] === "git") {
    return classHandlers.handleGit(parseContext);
  }

  if (tokens[0] === "sit") {
    return classHandlers.handleSit(parseContext);
  }

  if (tokens[0] === "stay") {
    return classHandlers.handleStay(parseContext);
  }

  var statement = tokens.shift();
  // if there's more tokens, split them by a ' ' similar to how tokenUtils.joinTokens would work
  if (tokens.length > 0) {
    statement += " ";
  }
  return statement;
}

/**
 * Consumes every token in the parseContext, appending each found statement and returning all statements found.
 */
function parseStatements(parseContext) {
  var statements = "";

  while (parseContext.tokens.length > 0) {
    statements += parseStatement(parseContext);
  }

  return statements;
}

var replacements = {};
replacements["dogeument"] = "document";
replacements["windoge"] = "window";
replacements["dis"] = "this";
replacements["sooper"] = "super";

module.exports = function parse(line) {
  var tokens = tokenizer.tokenize(line);

  if (tokens.length == 0) {
    return line + "\n";
  }

  var parseContext = {
    input: line,
    // leave original tokens to throw better syntax errors
    inputTokens: tokens.slice(),
    tokens: tokens,
    // pass state so handlers can be extracted out
    state: parserState
  };

  // pre-process tokens and swap replacements
  for (let i = 0; i < tokens.length; i++) {
    var testToken = tokens[i];

    // if we see a shh, skip since everything should be preserved
    if (testToken === "shh") {
      break;
    }

    Object.keys(replacements).forEach(function(key) {
      if (testToken === key) {
        tokens[i] = replacements[key];
      }

      if (testToken.startsWith(key + ".")) {
        tokens[i] = testToken.replace(key + ".", replacements[key] + ".");
      }
    });
  }

  return parseStatements(parseContext);
};
