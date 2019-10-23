var tokenUtils = require("../util/tokenUtils");
var functionHandlers = require("./functionHandlers");

/**
 * Handles invoking a function:
 * plz <function_name> [with <args>]
 *
 * Produces:
 *  plz function_name([args])
 */
function handlePlz(parseContext) {
  tokenUtils.expectAnyToken(["plz", ".plz"], parseContext);

  var tokens = parseContext.tokens;

  // consume: plz/.plz
  var invocation = tokens.shift();

  var statement = "";
  // if it's a .plz we're chaning a call so append the .
  if (invocation.charAt(0) === ".") {
    statement += ".";
  }

  var functionName = tokens.shift();

  // check if function invocation is special name
  if (functionName === "console.loge") {
    functionName = functionName.slice(0, -1);
  }

  statement += functionInvocation(
    functionName,
    parseContext,
    "plz|.plz <function_name> [with <args>]"
  );
  return statement;
}

/**
 * Handles invoking a function on an object:
 *  <object> dose <function_name> [with <args>]
 *  dose <function_name> [with <args>]
 *
 * Produces:
 *  object.function_name([args])
 *  .function_name([args])
 */
function handleDose(parseContext) {
  var tokens = parseContext.tokens;

  if (tokens[0] !== "dose" && tokens[1] !== "dose") {
    throw new Error(
      `Invalid parse state! Expected 'dose' in either 'x dose y' or 'dose y' but got chain: [${tokens}]`
    );
  }

  var objectName = "";

  // if dose is the first token, we're chaining a previous call
  if (tokens[1] === "dose") {
    // object dose func
    objectName = tokens.shift();
  }

  // consume: dose
  tokens.shift();

  var statement = objectName + ".";
  var functionName = tokens.shift();

  // check if function invocation is special name
  if (functionName === "loge") {
    // only replace if objectName is console
    if (objectName === "console") {
      functionName = functionName.slice(0, -1);
    }
  }

  statement += functionInvocation(
    functionName,
    parseContext,
    "[<object>] dose <function_name> [with <args>]"
  );
  return statement;
}

/**
 * Handles arguments to function call:
 * with <args>
 *
 * Produces:
 * (<args>)
 */
function handleWith(parseContext) {
  tokenUtils.expectToken("with", parseContext);

  var tokens = parseContext.tokens;

  // consume: with
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(
      `Expected arguments but got nothing. Allowed construct: with [args]. ${tokenUtils.parseInfo(
        parseContext
      )}`
    );
  }

  var statement = "(";

  // if the last token ends with & we are chaining calls
  var chained = tokens[tokens.length - 1].slice(-1) === "&";
  var chainedSameLine = false;

  while (tokens.length > 0) {
    // look ahead before consuming the tokens
    if (tokens[0] === "much") {
      // lambda functions - thanks @00Davo!
      var anonStatement = functionHandlers.handleLambda(parseContext);
      statement += anonStatement;
      return statement;
    }

    var currentToken = tokens.shift();
    if (currentToken === "," || currentToken === "&") {
      continue;
    }

    // we are chaining the call
    if (currentToken === "thx") {
      chainedSameLine = true;
      // exit and return
      break;
    }

    // clean up name if foo& or foo, to foo
    if (currentToken.substr(-1) === "&" || currentToken.substr(-1) === ",") {
      currentToken = currentToken.slice(0, -1);
    }

    statement += currentToken;

    // format a:b into a: b
    if (currentToken.substr(-1) === ":") {
      statement += " ";
    }

    // append , if not last arg or an object literal
    if (tokens.length > 0 && currentToken.substr(-1) !== ":") {
      statement += ", ";
    }
  }

  // cleanup dangling pieces
  if (statement.substr(-2) === ", ") {
    statement = statement.slice(0, -2);
  }

  // the token regex will split {a: b} into {a:, b, } which will cause us to append ', }'
  if (statement.includes(", ]")) {
    statement += statement.replace(/, ]/g, "]");
  }
  if (statement.includes(", }")) {
    statement = statement.replace(/, }/g, "}");
  }

  if (chainedSameLine) {
    statement += ")";
  } else if (chained) {
    statement += ")\n";
  } else {
    statement += ");\n";
  }

  return statement;
}

/**
 * Determines appropriate way to invoke a function whether it has args or not
 * @param functionName the name of the function
 * @param tokens the set of tokens remaining, if the given tokens does not begin with a `with` token a syntax error will be thrown
 * @param allowedSyntax a description of the allowed syntax to invoke the function (in case the syntax is incorrect)
 */
function functionInvocation(functionName, parseContext, allowedSyntax) {
  var tokens = parseContext.tokens;

  // no more args
  if (tokens.length < 1) {
    // if ends with & we are chaining a call
    if (functionName.endsWith("&")) {
      // remove & from functionName
      return functionName.slice(0, -1) + "()\n";
    }

    return functionName + "();\n";
  }

  // chaining a call with the use of thx
  if (tokens[0] === "thx") {
    // consume: thx
    tokens.shift();
    return functionName + "()";
  }

  // args have to be declared with a `with`
  if (tokens[0] !== "with") {
    throw new Error(
      `Invalid parse state! Expected: 'with' but got: '${
        tokens[0]
      }' from chain: [${tokens}]. Allowed construct: ${allowedSyntax}`
    );
  }

  return functionName + handleWith(parseContext);
}

/**
 *
 * Handles instantiation via new:
 * new x [with args]
 *
 */
function handleNew(parseContext) {
  tokenUtils.expectToken("new", parseContext);

  var tokens = parseContext.tokens;

  // consume: new
  tokens.shift();

  var statement = "new ";

  var object = tokens.shift();

  // handle arguments
  if (tokens[0] === "with") {
    // add constructor name
    statement += object;
    statement += handleWith(parseContext);
    return statement;
  }

  // call doesn't have args
  if (object.slice(-1) === "&") {
    object = object.slice(0, -1);
    statement += object + "()\n";
  } else {
    statement += object + "();\n";
  }

  return statement;
}

module.exports = {
  handlePlz,
  handleDose,
  handleWith,
  handleNew
};
