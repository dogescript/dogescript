var tokenUtils = require("../util/tokenUtils");

var parserState = require("../parserState");
const StateEnum = parserState.StateEnum;

/**
 * Handles if statements:
 * rly [condition]
 *
 * Produces:
 * if (condition) {
 *
 * @param handleStatements function capable of handling the remaining statements
 */
function handleRly(parseContext, handleStatements) {
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
 *
 * Produces:
 * if (!condition) {
 *
 * @param handleStatements function capable of handling the remaining statements
 */
function handleNotrly(parseContext, handleStatements) {
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
 *
 * Produces:
 * } else {
 *
 * @param handleStatements function capable of handling the remaining statements
 */
function handleBut(parseContext, handleStatements) {
  tokenUtils.expectToken("but", parseContext);

  var tokens = parseContext.tokens;

  // consume: but
  tokens.shift();

  var statement = "} else ";
  if (tokens[0] === "rly" || tokens[0] === "notrly") {
    if (tokens[0] === "rly") {
      statement += handleRly(parseContext, handleStatements);
    } else {
      statement += handleNotrly(parseContext, handleStatements);
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
 * @param handleStatements function capable of handling the remaining statements
 */
function handleMuchLoop(parseContext, handleStatements) {
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
 * @param handleStatements function capable of handling the remaining statements
 */
function handleMany(parseContext, handleStatements) {
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
 * Handles explicit return:
 *  amaze <expression>
 *
 * Produces:
 *  return <expression>;
 * @param returnStatements a function capable of collecting all the statements into a single string
 */
function handleAmaze(parseContext, returnStatements) {
  tokenUtils.expectToken("amaze", parseContext);

  // consume: amaze
  parseContext.tokens.shift();

  return "return " + returnStatements(parseContext);
}

module.exports = {
  handleRly,
  handleNotrly,
  handleBut,
  handleMany,
  handleMuchLoop,
  handleAmaze
};
