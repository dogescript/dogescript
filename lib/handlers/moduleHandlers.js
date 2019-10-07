var tokenUtils = require("../util/tokenUtils");
var functionHandlers = require("./functionHandlers");

/**
 * Handles the so construct (thanks @maxogden!):
 *  so <module> [as <name>]
 *
 * Produces:
 *  var name = require('module');
 */
function handleSo(parseContext) {
  tokenUtils.expectToken("so", parseContext);

  var tokens = parseContext.tokens;

  // consume: so
  tokens.shift();

  var statement = "";
  var lib = tokens.shift();

  var modName = "";

  // check if it's a named import or not
  if (tokens.length > 0) {
    tokenUtils.expectToken("as", parseContext);
    // consume: as
    tokens.shift();
    modName = tokens.shift();
  } else {
    // so x

    // try to make a simple name
    var mod = lib;
    // test for relative module, optional chop extension
    var m = /^..?\/.*?([\w-]+)(\.\w+)?$/.exec(mod);
    if (m) {
      mod = m[1];
    }
    modName = mod.replace(/-/g, "_");
  }

  return `var ${modName} = require('${lib}');\n`;
}

/**
 * Handles the woof construct:
 *  woof <alias> be <export>
 *  woof <export>
 *
 * Produces:
 *  module.exports.alias = export
 *  module.exports = export
 */
function handleWoof(parseContext) {
  tokenUtils.expectToken("woof", parseContext);

  var tokens = parseContext.tokens;

  // consume: woof
  tokens.shift();

  var exportName = "";

  // look ahead and check if it is in `woof x be y` form
  if (tokens[1] === "be") {
    // woof foo be X -> module.exports.foo = X
    exportName = "." + tokens.shift();

    // consume: be
    tokens.shift();
  }

  // module.exports = SOMETHING
  var statement = "module.exports" + exportName + " = ";

  var assignmentValue = tokens[0];
  // woof something -> module.exports = something
  if (tokens.length === 1) {
    statement += tokens.shift();
    statement += "\n";
    return statement;
  }

  // module.exports = function x(a,b) {}
  if (assignmentValue === "such") {
    var functionStatement = functionHandlers.handleSuch(parseContext);
    statement += functionStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // module.exports = function (a,b) {}
  if (assignmentValue === "much") {
    var anonStatement = functionHandlers.handleLambda(parseContext);
    statement += anonStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // TODO support other expressions
  throw new SyntaxError(
    `Invalid parse state! Expected a value but got: '${
      tokens[0]
    }' from chain: [${tokens}]. Allowed construct 'woof [<name> be] <value | <SUCH> | <MUCH> >'. ${tokenUtils.parseInfo(
      parseContext
    )}`
  );
}

module.exports = {
  handleSo,
  handleWoof
};
