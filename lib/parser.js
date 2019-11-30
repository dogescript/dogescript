var tokenizer = require("./tokenizer");

var tokenUtils = require("./util/tokenUtils");

var classHandlers = require("./handlers/classHandlers");
var functionHandlers = require("./handlers/functionHandlers");
var invocationHandlers = require("./handlers/invocationHandlers");
var moduleHandlers = require("./handlers/moduleHandlers");
var commentHandlers = require("./handlers/commentHandlers");
var propertyAccessorHandlers = require("./handlers/propertyAccessors");
var operatorHandlers = require("./handlers/operatorHandlers");

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
  bigified: "++",
  smallify: "--",
  smallified: "--"
};

// giv can probably be applied as a binary operator since it's a simple transform
var propertyOperators = ["giv", "levl"];

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

/**
 * Determines if the parsed tokens should be treated as dogescript source or not.
 */
function isDogescriptSource(parseContext) {
  var tokens = parseContext.tokens;

  // starts the statement with a valid token
  if (valid.indexOf(tokens[0]) !== -1) {
    return true;
  }

  // statement applying an assignment operator
  if (operatorHandlers.hasAssignmentOperator(parseContext)) {
    return true;
  }

  // applying a unary operator
  if (operatorHandlers.containsIncrementDecrement(parseContext)) {
    return true;
  }

  // calling function on Object
  if (tokens[1] === "dose") {
    return true;
  }

  // ending a multi comment block
  if (
    parserState.hasState(StateEnum.MULTILINE_COMMENT) &&
    tokens[0] === "loud"
  ) {
    return true;
  }

  // closing a multi-line object creation
  if (parserState.hasState(StateEnum.OBJECT) && tokens[0] === "wow") {
    return true;
  }

  // binary operation anywhere
  if (operatorHandlers.hasBinaryOperator(parseContext)) {
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
  return !parserState.hasState(StateEnum.OBJECT);
}

/**
 * Determins whether the token is a property accessor token
 */
function isPropertyOperator(token) {
  return propertyOperators.includes(token);
}

/**
 * Handles if statements:
 * rly [condition]
 */
function handleRly(parseContext) {
  tokenUtils.expectToken("rly", parseContext);

  var tokens = parseContext.tokens;

  // consume: rly
  tokens.shift();

  var statement = "if (";
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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

  // consume: notrly
  tokens.shift();

  var statement = "if (!";
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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
  // turn off multiline declaration
  if (parserState.hasState(StateEnum.OBJECT)) {
    parserState.popState();
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

  // consume: much
  tokens.shift();

  var statement = "for (";
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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

  // consume: many
  tokens.shift();

  var statement = "while (";
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
  statement += ") {\n";

  return statement;
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
    parserState.pushState(StateEnum.OBJECT);
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

  // if processing multi-comment
  if (parserState.hasState(StateEnum.MULTILINE_COMMENT)) {
    // consume tokens until we encounter loud
    if (tokens[0] !== "loud") {
      // clear out tokens
      parseContext.tokens = [];
      return parseContext.input + "\n";
    }
    // else must be loud
    return commentHandlers.handleLoud(parseContext);
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
  if (parserState.hasState(StateEnum.CONTROL_FLOW)) {
    // convert to supported operator / otherwise fall thorugh
    // TODO remove operators as they become supported
    if (validOperators.hasOwnProperty(tokens[0])) {
      return validOperators[tokens.shift()];
    }
  }

  // support any kind of assignment operator
  if (operatorHandlers.isAssignmentOperator(tokens[0])) {
    var statement = operatorHandlers.handleAssignmentOperator(parseContext);

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
    return commentHandlers.handleShh(parseContext);
  }

  // quiet start multi-line comment
  if (tokens[0] === "quiet") {
    return commentHandlers.handleQuiet(parseContext);
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
  if (operatorHandlers.containsIncrementDecrement(parseContext)) {
    return operatorHandlers.handleIncrementDecrementOperators(parseContext);
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
    parserState.pushState(StateEnum.OBJECT);
    return "{\n";
  }

  if (operatorHandlers.isBinaryOperator(tokens[0])) {
    return operatorHandlers.handleBinaryOperator(parseContext);
  }

  if (tokens[0] === "giv") {
    return propertyAccessorHandlers.handleGiv(parseContext);
  }

  if (tokens[0] === "levl") {
    return propertyAccessorHandlers.handleLevl(parseContext);
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
    tokens: tokens
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
