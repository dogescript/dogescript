var tokenUtils = require("../util/tokenUtils");

var parserState = require("../parserState");
const StateEnum = parserState.StateEnum;

/**
 * Handles the single line comment:
 * shh [text]
 *
 * Produces:
 * // text
 */
function handleShh(parseContext) {
  tokenUtils.expectToken("shh", parseContext);

  var tokens = parseContext.tokens;

  // consume: shh
  tokens.shift();

  var statement = "// ";

  // preserve any spacing after 'shh '
  var input = parseContext.input;
  var shhLocation = input.indexOf("shh ");
  var commentText = input.substring(shhLocation + 4);
  statement += commentText;
  statement += "\n";

  // consume tokens so we don't reparse
  parseContext.tokens = [];

  return statement;
}

/**
 * Handles the beginning of a multi-line comment:
 * quiet [comments]
 *
 * Produces the start of a multi-line comment "/*"
 */
function handleQuiet(parseContext) {
  tokenUtils.expectToken("quiet", parseContext);

  var tokens = parseContext.tokens;

  // consume: quiet
  tokens.shift();

  parserState.pushState(StateEnum.MULTILINE_COMMENT);

  var statement = "/*";
  statement += tokenUtils.joinTokens(parseContext.tokens);
  statement += "\n";

  return statement;
}

/**
 * Handles the end of the multi-line comment:
 * loud
 *
 * Produces the end of a multiline comment "*\/"
 */
function handleLoud(parseContext) {
  tokenUtils.expectToken("loud", parseContext);

  var tokens = parseContext.tokens;

  if (!parserState.hasState(StateEnum.MULTILINE_COMMENT)) {
    throw new Error(
      "Unparseable syntax! Encountered: 'loud' without first seeing 'quiet'"
    );
  }

  // consume: loud
  tokens.shift();

  // Remove multicomment state
  parserState.popState();

  var statement = "*/";
  statement += tokenUtils.joinTokens(parseContext.tokens);
  statement += "\n";

  return statement;
}

module.exports = {
  handleShh,
  handleQuiet,
  handleLoud
};
