import Promise from "bluebird"
import R from "ramda"
import {mapOverLines} from "./reader"
import Token from "./tokens"

function tokenizeLine(line) {
  // Blank empty newline -- do nothing
  if (line.length === 0) return

  return R.map(t => {
    // The position of the token on the line
    let pos = line.indexOf(t)

    // Grab the token or default to an Identifier
    let tok = new (Token[t] || Token.Identifier)

    // Create and return the new token
    return tok.create(pos,t)
  }, line.split(" "))

}

export async function tokenizeFile(fileName) {

  // Iterate over each line of the file
  return await mapOverLines(fileName, tokenizeLine)

}
