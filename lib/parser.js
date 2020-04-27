var tokenizer = require("./tokenizer");
var statementHandlers = require("./handlers/statementHandlers");

var replacements = {};
replacements["dogeument"] = "document";
replacements["windoge"] = "window";
replacements["dis"] = "this";
replacements["sooper"] = "super";
replacements["bork"] = "break;";
replacements["breed"] = "Symbol.species";

module.exports = function parse(line) {
  var tokens = tokenizer.tokenize(line);

  if (tokens.length == 0) {
    return line + "\n";
  }

  var parseContext = {
    input: line,
    // leave original tokens to throw better syntax errors
    inputTokens: tokens.slice(),
    tokens: tokens
  };

  // pre-process tokens and swap replacements
  for (let i = 0; i < tokens.length; i++) {
    var testToken = tokens[i];

    // if we see a shh, skip since everything should be preserved
    if (testToken === "shh") {
      break;
    }

    Object.keys(replacements).forEach(function(key) {
      if (testToken === key) {
        tokens[i] = replacements[key];
      }

      if (testToken.startsWith(key + ".")) {
        tokens[i] = testToken.replace(key + ".", replacements[key] + ".");
      }
    });
  }

  return statementHandlers.handleStatements(parseContext);
};
