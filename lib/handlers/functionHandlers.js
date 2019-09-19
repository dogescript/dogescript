var tokenUtils = require('../util/tokenUtils');
var handlerUtils = require('../util/handlerUtils');

/**
 * Handles the such construct:
 *  such <function_name> [much]
 *
 * Produces:
 *  function <function_name> ([args]) {
 */
function handleSuch(parseContext)
{
  tokenUtils.expectToken('such', parseContext);

  var tokens = parseContext.tokens;

  // consume: such
  tokens.shift();

  var functionName = tokens.shift();
  var statement = 'function ' + functionName;

  // no args
  if (!tokens[0])
  {
    return statement + ' () { \n';
  }

  // args have to be declared with much
  if (tokens[0] !== 'much')
  {
    throw new Error(`Invalid parse state! Expected: 'much' but got: '${tokens[0]}' from chain: [${tokens}]. Allowed construct 'such <function_name> [much <args>]'. ${tokenUtils.parseInfo(parseContext)}`);
  }

  statement += handleMuchArgs(parseContext);
  return statement;
}

/**
 * Handles arguments to functions:
 *  much [args]
 *
 * Produces the argument part to a preceding function:
 *  ([args]) {
 *
 * Assuming that the function_name was encountered before this should ultimately produce:
 *  function([args]) {
 */
function handleMuchArgs(parseContext)
{
  tokenUtils.expectToken('much', parseContext);

  // consume: much
  parseContext.tokens.shift();

  // TODO throw syntax error when no args? 

  return handlerUtils.declareArguments(parseContext);
}

/**
 * Handles lambda functions ( thanks @00Davo!):
 *  much [args]
 *
 * Produces:
 *  function (args) {
 */
function handleLambda(parseContext)
{
  return 'function' + handleMuchArgs(parseContext);
}

module.exports= {
    handleSuch,
    handleLambda,
    handleMuchArgs
}