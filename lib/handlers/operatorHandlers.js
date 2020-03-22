var tokenUtils = require("../util/tokenUtils");
var statementHandlers = require("./statementHandlers");

var unaryOperators = {
  bigify: "++",
  bigified: "++",
  smallify: "--",
  smallified: "--"
};

var binaryOperators = {
  bigger: ">",
  biggerish: ">=",
  smaller: "<",
  smallerish: "<=",
  and: "&&",
  or: "||",
  not: "!==",
  isa: "instanceof",
  like: "==",
  same: "==="
};

var assignmentOperators = {
  more: "+=",
  less: "-=",
  lots: "*=",
  few: "/=",
  is: "=",
  as: "="
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

/**
 * Determines whether the parsed context has a binary operator anywhere
 */
function isBinaryOperator(token) {
  return binaryOperators.hasOwnProperty(token);
}

/**
 * Determines whether the parsed context contains any of the supported binary operators
 */
function hasBinaryOperator(parseContext) {
  return parseContext.tokens.some(isBinaryOperator);
}

/**
 * Determines whether the token is an assignment token
 */
function isAssignmentOperator(token) {
  return assignmentOperators.hasOwnProperty(token);
}

/**
 * Determines whether the parsed context contains any of the supported assignment operators
 */
function hasAssignmentOperator(parseContext) {
  return parseContext.tokens.some(isAssignmentOperator);
}

/**
 * Handles the binary operator:
 *  <binaryOperator> (one of binaryOperators)
 *
 * Produces:
 *  operator
 */
function handleBinaryOperator(parseContext) {
  var tokens = parseContext.tokens;
  if (!isBinaryOperator(tokens[0])) {
    throw new Error(
      `Expected one of [${Object.getOwnPropertyNames(
        binaryOperators
      )}] but got ${parseContext.tokens[0]}. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var operatorToken = tokens.shift();
  var statement = binaryOperators[operatorToken];
  if (tokens.length > 0) {
    statement += " ";
  }
  return statement;
}

/**
 * Handles the a assignment operators:
 *  <assignmentOperator> (one of assignmentOperator)
 *
 * Produces:
 *  operator
 */
function handleAssignmentOperator(parseContext) {
  var tokens = parseContext.tokens;
  if (!isAssignmentOperator(tokens[0])) {
    throw new Error(
      `Expected one of [${Object.getOwnPropertyNames(
        assignmentOperators
      )}] but got ${parseContext.tokens[0]}. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var operatorToken = tokens.shift();
  return assignmentOperators[operatorToken];
}

/**
 * Handles the maybe token
 *
 * Consumes:
 *   maybe
 *
 * Produces:
 *   (!!+Math.round(Math.random()))
 */
function handleMaybe(parseContext) {
  tokenUtils.expectToken("maybe", parseContext);
  var tokens = parseContext.tokens;

  // consume: maybe
  tokens.shift();
  return "(!!+Math.round(Math.random()))";
}

/**
 * Handles the kindof token
 *
 * Consumes:
 *   kindof <arg>
 *
 * Produces:
 *   typeof <arg>
 */
function handleKindOf(parseContext) {
  tokenUtils.expectToken("kindof", parseContext);
  var tokens = parseContext.tokens;

  // consume: kindof
  tokens.shift();

  // ensure there's an argument
  if (tokens.length < 1) {
    throw new SyntaxError(
      `Invalid parse state! Expected argument but got nothing. Allowed construct: kindof <arg>. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  // ensure there's a token afterwards
  return "typeof " + tokens.shift();
}

/**
 * Handles the yelde token
 *
 * Consumes:
 *   yelde <arg>
 *
 * Produces:
 *   yield <arg>
 */
function handleYelde(parseContext) {
  tokenUtils.expectToken("yelde", parseContext);

  var tokens = parseContext.tokens;

  // consume: yelde
  tokens.shift();

  // ensure there's an argument
  if (tokens.length < 1) {
    throw new SyntaxError(
      `Invalid parse state! Expected argument but got nothing. Allowed construct: yelde <arg>. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  return "yield " + tokens.shift();
}

module.exports = {
  containsIncrementDecrement,
  handleIncrementDecrementOperators,
  isBinaryOperator,
  hasBinaryOperator,
  handleBinaryOperator,
  isAssignmentOperator,
  hasAssignmentOperator,
  handleAssignmentOperator,
  handleMaybe,
  handleKindOf,
  handleYelde
};
