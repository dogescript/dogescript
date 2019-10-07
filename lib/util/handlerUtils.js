/**
 * Creates the statement needed when declaring arguments.
 *
 * Given: [a, b, c]
 *
 * Produces:
 * ' (a, b, c) { \n'
 */
function declareArguments(parseContext) {
  var tokens = parseContext.tokens;

  var statement = " (";
  let arg;
  while ((arg = tokens.shift())) {
    statement += arg;
    if (tokens.length > 0) {
      statement += ", ";
    }
  }
  statement += ") { \n";
  return statement;
}

module.exports = { declareArguments };
