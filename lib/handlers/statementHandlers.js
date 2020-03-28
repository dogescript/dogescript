var tokenUtils = require("../util/tokenUtils");

var classHandlers = require("./classHandlers");
var functionHandlers = require("./functionHandlers");
var invocationHandlers = require("./invocationHandlers");
var moduleHandlers = require("./moduleHandlers");
var commentHandlers = require("./commentHandlers");
var propertyAccessorHandlers = require("./propertyAccessorHandlers");
var operatorHandlers = require("./operatorHandlers");

var parserState = require("../parserState");
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
 * Handles the debugger statement in either:
 * debooger | pawse
 *
 * Produces:
 *   debugger;
 */
function handleDebugger(parseContext) {
  tokenUtils.expectAnyToken(["debooger", "pawse"], parseContext);
  var tokens = parseContext.tokens;

  // consume: debooger/pawse
  tokens.shift();
  return "debugger;";
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
 * Handles the next token
 *
 * Consumes:
 *   next
 *
 * Produces:
 *   ;
 */
function handleNext(parseContext) {
  tokenUtils.expectToken("next", parseContext);
  var tokens = parseContext.tokens;

  // consume next
  tokens.shift();
  return ";";
}

/**
 * Handles the object declaration
 *
 * Consumes:
 *   obj
 *
 * Produces:
 *   {
 *
 */
function handleObj(parseContext) {
  tokenUtils.expectToken("obj", parseContext);
  var tokens = parseContext.tokens;

  // consume obj
  tokens.shift();
  parserState.pushState(StateEnum.OBJECT);
  return "{\n";
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
  statement += handleStatements(parseContext);
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
  statement += handleStatements(parseContext);
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
  statement += handleStatements(parseContext);
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
  statement += handleStatements(parseContext);
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

  // the condition check below needs fixing so we can resolve this with just handleStatement
  if (tokens[0] === "classy") {
    statement += classHandlers.handleClass(parseContext);
    return statement;
  }

  if (tokens.length > 1) {
    statement += handleStatement(parseContext);

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
 * Handles the await operator:
 *  waite <expression>
 *
 * Produces:
 *  await <expression>;
 */
function handleWaite(parseContext) {
  tokenUtils.expectToken("waite", parseContext);

  // consume : waite
  parseContext.tokens.shift();

  return "await " + handleStatements(parseContext);
}

/**
 * Determines if the parsed tokens should be treated as dogescript source or not.
 */
function isDogescriptSource(parseContext) {
  var tokens = parseContext.tokens;

  // starts the statement with a valid token
  if (tokenUtils.isValidToken(tokens[0])) {
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
  if (tokens.some(propertyAccessorHandlers.isPropertyAccessor)) {
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
 * Consumes every token in the parseContext, appending each found statement and returning all statements found.
 */
function handleStatements(parseContext) {
  var statements = "";

  while (parseContext.tokens.length > 0) {
    statements += handleStatement(parseContext);
  }

  return statements;
}

/**
 * Appends statements from the parse context into a single line
 */
function returnStatements(parseContext) {
  var statement = handleStatements(parseContext);
  if (shouldCloseStatement(parseContext, statement)) {
    statement += ";\n";
  }

  return statement;
}

function handleStatement(parseContext) {
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

  // async function
  if (tokens[0] === "asink") {
    return functionHandlers.handleAsink(parseContext);
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

    statement += handleStatement(parseContext);

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
    return operatorHandlers.handleMaybe(parseContext);
  }

  if (tokens[0] === "next") {
    return handleNext(parseContext);
  }

  // standalone increment/decrement
  if (operatorHandlers.containsIncrementDecrement(parseContext)) {
    return operatorHandlers.handleIncrementDecrementOperators(parseContext);
  }

  if (tokens[0] === "woof") {
    return moduleHandlers.handleWoof(parseContext);
  }

  if (tokens[0] === "debooger" || tokens[0] === "pawse") {
    return handleDebugger(parseContext);
  }

  if (tokens[0] === "obj") {
    return handleObj(parseContext);
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

  if (tokens[0] === "proto") {
    return propertyAccessorHandlers.handleProto(parseContext);
  }

  if (tokens[0] === "kindof") {
    return operatorHandlers.handleKindOf(parseContext);
  }

  if (tokens[0] === "yelde") {
    return operatorHandlers.handleYelde(parseContext);
  }

  if (tokens[0] === "amaze") {
    return handleAmaze(parseContext);
  }

  if (tokens[0] === "waite") {
    return handleWaite(parseContext);
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

module.exports = {
  shouldCloseStatement,
  handleDebugger,
  handleWow,
  handleNext,
  handleObj,
  handleWaite,
  handleStatements
};
