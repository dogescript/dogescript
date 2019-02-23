
/**
 * Tokenizes a given line
 */
function tokenize(line)
{
  return line.match(/'[^']+'|\S+/g)
}

module.exports.tokenize = tokenize;
