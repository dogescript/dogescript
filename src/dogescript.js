import R from "ramda"
import Promise from "bluebird"
import {tokenizeFile} from "./tokenizer"

export async function main(dir, args) {
  if (!args) {
    console.log("Please select a file to parse")
    return
  }

  // Create a filepath relative to the directory
  // dogescript was executed in
  let path = dir + "/" + args
  let tokenizedLines = await tokenizeFile(path)

  printTokens(tokenizedLines)

}

function printTokens(lines) {
  R.map(line => {
    let lineNo = lines.indexOf(line) + 1

    console.log("<line=" + lineNo)
    process.stdout.write(`  `)
    R.map(token => {
      process.stdout.write(`<${token.name}>`)
    }, line)
    console.log("\n/>\n")

  }, lines)
}



export function run(dir, args) {
  Promise.resolve(main(dir, args))
}
