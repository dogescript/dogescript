const validTokens = [
  "such",
  "wow",
  "wow&",
  "plz",
  ".plz",
  "dose",
  "very",
  "shh",
  "quiet",
  "loud",
  "rly",
  "notrly",
  "but",
  "many",
  "much",
  "so",
  "trained",
  "maybe",
  "debooger",
  "pawse",
  "woof",
  "obj",
  "giv",
  "levl",
  "next",
  "amaze",
  "classy",
  "maker",
  "grows",
  "git",
  "sit",
  "stay",
  "kindof",
  "asink",
  "waite",
  "yelde"
];

/**
 * Creates a formatted message that displays the token set that was parsed and the input.
 */
function parseInfo(parseContext) {
  return `Parsed tokens [${parseContext.inputTokens}] from input "${parseContext.input}"`;
}

/**
 * Raises an error if the given tokens do not start with the desired state
 */
function expectToken(expectedStart, parseContext) {
  var tokens = parseContext.tokens;
  if (tokens[0] !== expectedStart) {
    throw new Error(
      `Invalid parse state! Expected: '${expectedStart}' but got: '${
        tokens[0]
      }' from chain: [${tokens}]. ${parseInfo(parseContext)}`
    );
  }
}

/**
 * Raises an error if the start token does not match any of the expected tokens.
 */
function expectAnyToken(expectedTokens, parseContext) {
  var tokens = parseContext.tokens;

  var foundToken = false;
  var firstToken = tokens[0];
  for (let i = 0; i < expectedTokens.length; i++) {
    if (firstToken === expectedTokens[i]) {
      foundToken = true;
      break;
    }
  }

  if (!foundToken) {
    throw new Error(
      `Invalid parse state! Expected any of: '${expectedTokens}' but got: '${
        tokens[0]
      }' from chain: [${tokens}]. ${parseInfo(parseContext)}`
    );
  }
}

/**
 * Joins the set of tokens into a string such that joinTokens([a, b]) returns "a b".
 * Consumes all tokens from the given array such that the array will be empty if it is referenced after calling this function.
 */
function joinTokens(tokens) {
  var tokenString = "";

  let token;
  while ((token = tokens.shift())) {
    tokenString += token;
    if (tokens.length > 0) {
      tokenString += " ";
    }
  }

  return tokenString;
}

/**
 * Determines whether the given token is a valid dogescript grammar token
 * @param {String} token a token
 */
function isValidToken(token) {
  return validTokens.indexOf(token) !== -1;
}

module.exports = {
  expectToken,
  parseInfo,
  expectAnyToken,
  joinTokens,
  isValidToken
};
