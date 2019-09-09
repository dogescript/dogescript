var tokenUtils = require('../util/tokenUtils');

/**
 * Handles the so construct (thanks @maxogden!):
 *  so <module> [as <name>]
 *
 * Produces:
 *  var name = require('module');
 */
function handleSo(parseContext)
{
  tokenUtils.expectToken('so', parseContext);

  var tokens = parseContext.tokens;

  // consume: so
  tokens.shift();

  var statement = '';
  var lib = tokens.shift();

  var modName = '';

  // check if it's a named import or not
  if(tokens.length > 0) {
    tokenUtils.expectToken('as', parseContext);
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
    modName = mod.replace(/-/g, '_');
  }

  return `var ${modName} = require('${lib}');\n`;
}

module.exports = {
    handleSo
}