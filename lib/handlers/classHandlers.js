var tokenUtils = require("../util/tokenUtils");
var handlerUtils = require("../util/handlerUtils");
var functionHandlers = require("./functionHandlers");

/**
 * Handles class declarations:
 *   classy <ClassName>
 *
 * Produces:
 *   class <ClassName> {
 */
function handleClass(parseContext) {
  tokenUtils.expectToken("classy", parseContext);

  // consume: classy
  parseContext.tokens.shift();

  var tokens = parseContext.tokens;

  /**
   * We're in a class expression without extension
   */
  if (tokens.length < 1) {
    return "class {\n";
  }

  var className = parseContext.tokens.shift();
  var statement = "class " + className;

  /**
   * Check if there's a grows ParentClassName
   */
  if (tokens.length > 0) {
    var nextToken = tokens[0];
    if (nextToken == "grows") {
      statement += " " + handleGrows(parseContext);
    }
  }

  statement += "{\n";
  return statement;
}

/**
 * Handles constructor declarations:
 * maker <args>
 *
 * Produces:
 *  constructor <args> {
 */
function handleMaker(parseContext) {
  tokenUtils.expectToken("maker", parseContext);

  var tokens = parseContext.tokens;

  // consume: maker
  tokens.shift();

  return "constructor" + handlerUtils.declareArguments(parseContext);
}

/**
 * Handles class extension declarations:
 * grows <ClassName>
 *
 * Produces:
 *  extends <ClassName>
 */
function handleGrows(parseContext) {
  tokenUtils.expectToken("grows", parseContext);

  var tokens = parseContext.tokens;

  // consume: grows
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected ClassName but got nothing. Allowed construct: grows [ClassName]. ${parseInfo(
        parseContext
      )}`
    );
  }

  return "extends " + tokens.shift();
}

/**
 * Handles getter method declarations:
 * git <name>
 *
 * Produces:
 *  get <name> () {
 */
function handleGit(parseContext) {
  tokenUtils.expectToken("git", parseContext);

  var tokens = parseContext.tokens;

  // consume: git
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected getter name but got nothing. Allowed construct: git [name]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var getterName = tokens.shift();
  return "get " + getterName + " () {";
}

/**
 * Handles setter method declarations:
 * sit <name> much <arg>
 *
 * Produces:
 *  set <name> (arg) {
 */
function handleSit(parseContext) {
  tokenUtils.expectToken("sit", parseContext);

  var tokens = parseContext.tokens;

  // consume: sit
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected setter name but got nothing. Allowed construct: sit [name] much [arg]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var setterName = tokens.shift();

  var statement = "set " + setterName;
  statement += functionHandlers.handleMuchArgs(parseContext);
  return statement;
}

/**
 * Handles static method declarations:
 * stay <name> with <arg>
 *
 * Produces:
 *  static <name> (<arg>) {
 */
function handleStay(parseContext) {
  tokenUtils.expectToken("stay", parseContext);

  var tokens = parseContext.tokens;

  // consume: stay
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected function name but got nothing. Allowed construct: stay [name] <much [arg]>. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var functionName = tokens.shift();

  if (tokens.length < 1) {
    return `static ${functionName}() {`;
  }

  var statement = "static " + functionName;
  statement += functionHandlers.handleMuchArgs(parseContext);
  return statement;
}

module.exports = {
  handleGit,
  handleSit,
  handleClass,
  handleGrows,
  handleMaker,
  handleStay
};
