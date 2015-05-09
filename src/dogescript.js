import {readFile} from "./reader"
import Token from "./tokens"
import Promise from "bluebird"

export function main(dir, args) {
    let lineNo = 1

    readFile(dir, args).on('line', line => {

      // Blank line
      if (line.length === 0) return

      let tokens = line.split(" ").map(t => {
        let pos = line.indexOf(t)
        let type = Token[t]

        type = type ? new type(lineNo, pos, t) : new Token.Identifier(lineNo, pos, t)
        process.stdout.write(`<${type.name} text="${type.text}" position=${type.position} line=${type.line}> `)
      })
        process.stdout.write("\n\n")
        lineNo += 1
    })
}
