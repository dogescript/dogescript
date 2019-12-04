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

module.exports = {
  shouldCloseStatement,
  handleDebugger
};
