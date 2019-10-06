/**
 * Determines if the character is white space or not
 */
function isWhiteSpace(ch) {
  return ch == " " || ch == "\t" || ch == "\n";
}

/**
 * Tokenizes a given line
 */
function tokenize(line) {
  var tokens = [];

  var currToken = "";
  var inString = false;

  for (var c of line) {
    if (c === "'") {
      // check if the previous token is an intentional escape like in '\'\''
      var lastChar = currToken.charAt(currToken.length - 1);
      if (lastChar === "\\") {
        currToken += c;
        continue;
      }

      // otherwise we're closing the string or opening it so append the '
      currToken += c;

      // flip value
      inString = !inString;
      continue;
    }

    if (!inString && isWhiteSpace(c)) {
      if (currToken.trim().length > 0) {
        tokens.push(currToken);
        currToken = "";
      }
      continue;
    }

    // append the tokens
    currToken += c;
  }

  if (currToken.trim().length > 0) {
    tokens.push(currToken);
  }

  return tokens;
}

module.exports.tokenize = tokenize;
