/**
 * Creates a formatted message that displays the token set that was parsed and the input.
 */
function parseInfo(parseContext)
{
  return `Parsed tokens [${parseContext.inputTokens}] from input "${parseContext.input}"`;
}

/**
 * Raises an error if the given tokens do not start with the desired state
 */
function expectToken(expectedStart, parseContext)
{
  var tokens = parseContext.tokens;
  if ( tokens[0] !== expectedStart)
  {
    throw new Error(`Invalid parse state! Expected: '${expectedStart}' but got: '${tokens[0]}' from chain: [${tokens}]. ${parseInfo(parseContext)}`);
  }
}

module.exports = {
    expectToken, parseInfo
}