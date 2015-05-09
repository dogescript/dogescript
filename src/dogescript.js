
import Promise from "bluebird"
import {tokenizeFile} from "./tokenizer"

export function main(dir, args) {
  if (!args) {
    console.log("Please select a file to parse")
    return
  }

  // Create a filepath relative to the directory
  // dogescript was executed in
  let path = dir + "/" + args

  // Tokenize the file
  Promise.resolve(tokenizeFile(path))
  .then(lines => {
      // Lines is a list of tokenized lines
      console.log(lines)
  })
}
