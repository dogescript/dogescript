
import Promise from "bluebird"
import {tokenizeFile} from "./tokenizer"

export function main(dir, args) {
  if (!args) {
    console.log("Please select a file to parse")
    return
  }

  let path = dir + "/" + args
  tokenizeFile(path).then(tokens => {
    console.log(tokens.map(x => {return x.name}))
  })
}
