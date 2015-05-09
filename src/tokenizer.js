import Promise from "bluebird"
import R from "ramda"
import {mapOverLines} from "./reader"
import Token from "./tokens"

async function tokenizeLine(err, line) {
  console.log(line + "\n")
  // Blank empty newline -- do nothing
  if (line.length === 0) return

  // Split the line up into individual tokens
  let tokens = line.split(" ").map(t => {

    // Grab the position of the token on the line
    let pos = line.indexOf(t)

    // Grab the token or default to an Identifier
    let type = Token[t] || Token.Identifier

    // Create a new type with the position,
    // and content of the token, and return it.
    return new type(pos, t)
  })

  return tokens
}

export async function tokenizeFile(fileName) {
  let tokenList = []

  // Iterate over each line of the file
  let x = await mapOverLines(fileName, tokenizeLine, item => {
    console.log(item )
    return "Passing through"
  })
  


  return tokenizedLines
}
