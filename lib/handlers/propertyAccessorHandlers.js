var tokenUtils = require("../util/tokenUtils");

var propertyAccessors = ["giv", "levl", "proto"];

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
      `Expected argument but got nothing. Allowed construct: obj levl [arg]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  return `[${tokens.shift()}]`;
}

/**
 * Handles property accession by field
 * <object> giv <key>
 *
 * Produces:
 *   object.key
 */
function handleGiv(parseContext) {
  tokenUtils.expectToken("giv", parseContext);

  var tokens = parseContext.tokens;

  // consume giv
  tokens.shift();

  // there should be a next token
  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected argument but got nothing. Allowed construct: obj giv [arg]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  return ".";
}

/**
 * Handles prototype property accession
 * <object> proto <key>
 *
 * Produces:
 *   object.prototype.key
 */
function handleProto(parseContext) {
  tokenUtils.expectToken("proto", parseContext);

  var tokens = parseContext.tokens;

  // consume proto
  tokens.shift();

  // there should be a next token
  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected argument but got nothing. Allowed construct: obj proto [arg]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  return ".prototype.";
}

/**
 * Determines whether the token is a property accessor token
 */
function isPropertyAccessor(token) {
  return propertyAccessors.includes(token);
}

module.exports = {
  handleLevl,
  handleGiv,
  handleProto,
  isPropertyAccessor
};
