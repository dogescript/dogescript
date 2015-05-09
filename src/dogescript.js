
import Promise from "bluebird"
import {tokenizeFile} from "./tokenizer"

export function main(dir, args) {
  let path = dir + "/" + args
  tokenizeFile(path).then(tokens => {
    console.log(tokens.map(x => {return x.name}))
  })
}
