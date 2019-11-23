var tokenUtils = require("../util/tokenUtils");

var unaryOperators = {
  bigify: "++",
  bigified: "++",
  smallify: "--",
  smallified: "--"
};

var preOrderIncrementDecrementTokens = ["bigify", "smallify"];
var postOrderIncrementDecrementTokens = ["bigified", "smallified"];

/**
 * Determines whether the parseContext contains an post order increment or decrement operator
 */
function hasPostOrderIncrementDecrement(parseContext) {
  var tokens = parseContext.tokens;
  return postOrderIncrementDecrementTokens.indexOf(tokens[1]) !== -1;
}

/**
 * Determines whether the parseContext contains an pre order increment or decrement operator
 */
function hasPreOrderIncrementDecrement(parseContext) {
  var tokens = parseContext.tokens;
  return preOrderIncrementDecrementTokens.indexOf(tokens[0]) !== -1;
}

/**
 * Determines whether the first or second token is one of [bigify, smallify]
 */
function containsIncrementDecrement(parseContext) {
  return (
    hasPostOrderIncrementDecrement(parseContext) ||
    hasPreOrderIncrementDecrement(parseContext)
  );
}

/**
 * Handles the increment and decrement unary operators in either pre or postfix form:
 *  <identifier> bigified|smallified
 *  bigify|smallify <identifier>
 *
 * Produces:
 *  identifier++ | identifier--
 *  ++identifier | --identifier
 */
function handleIncrementDecrementOperators(parseContext) {
  if (!containsIncrementDecrement(parseContext)) {
    throw new Error(
      `Invalid parse state! Expected an operator from: ${preOrderIncrementDecrementTokens} in '<identifier> operator' or ${postOrderIncrementDecrementTokens} in 'operator <identifer>' but got chain: [${tokens}]`
    );
  }

  var tokens = parseContext.tokens;

  if (hasPreOrderIncrementDecrement(parseContext)) {
    var operator = tokens.shift();
    if (tokens.length < 1) {
      throw new SyntaxError(
        `Expected argument name but got nothing. Allowed construct: ${operator} [arg]. ${tokenUtils.parseInfo(
          parseContext
        )}`
      );
    }

    return unaryOperators[operator] + tokens.shift();
  }

  // post order
  return tokens.shift() + unaryOperators[tokens.shift()];
}

module.exports = {
  containsIncrementDecrement,
  handleIncrementDecrementOperators
};
