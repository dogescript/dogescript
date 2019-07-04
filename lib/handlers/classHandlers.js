var tokenUtils = require('../util/tokenUtils');

/**
 * Handles getter method declarations:
 * git <name>
 * 
 * Produces:
 *  get <name> () {
 */
function handleGit(parseContext) {
    tokenUtils.expectToken('git', parseContext);
    
    var tokens = parseContext.tokens;

    // consume: git
    tokens.shift();

    if (tokens.length < 1) {
        throw new SyntaxError(`Expected getter name but got nothing. Allowed construct: git [name]. ${tokenUtils.parseInfo(parseContext)}`);
    }

    var getterName = tokens.shift();
    return 'get ' + getterName + " () {";
}

/**
 * Handles setter method declarations:
 * sit <name> with <arg>
 * 
 * Produces:
 *  set <name> (arg) {
 */
function handleSit(parseContext) {
    tokenUtils.expectToken('sit', parseContext);

    var tokens = parseContext.tokens;

    // consume: sit
    tokens.shift();

    if (tokens.length < 1) {
        throw new SyntaxError(`Expected setter name but got nothing. Allowed construct: sit [name] with [arg]. ${tokenUtils.parseInfo(parseContext)}`);
    }

    var setterName = tokens.shift();

    if (tokens[0] != 'with') 
    {
        throw new SyntaxError(`Expected: 'with' but got: '${tokens[0]} from chain: [${tokens}]. Allowed construct: sit [name] with [arg]. ${tokenUtils.parseInfo(parseContext)}`);
    }

    // consume: with
    tokens.shift();

    if (tokens.length < 1)
    {
        throw new SyntaxError(`Expected setter argument but got nothing. Allowed construct: sit [name] with [arg]. ${tokenUtils.parseInfo(parseContext)}`);
    }

    var argumentName = tokens.shift();

    // TODO potentially call 'handleWith'
    return `set ${setterName} (${argumentName}) {`;
}

module.exports = {
    handleGit, handleSit
}