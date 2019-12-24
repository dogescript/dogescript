var tokenUtils = require("../util/tokenUtils");

var parserState = require("../parserState");
const StateEnum = parserState.StateEnum;

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

module.exports = {
  shouldCloseStatement,
  handleDebugger,
  handleWow,
  handleNext,
  handleObj
};
