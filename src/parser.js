import Tok from "./tokens"
import R from "ramda";

class Parser {

  constructor() {
    this.line = []
    this.lineNo = 0
    this.future = {}
    this.ignore = false
  }

  peek() {
    return this.line.shift()
  }

  expect(schema, line) {
     let o = R.zip(schema, line)

     let errors;

     R.map(pair => {
       let [type, token] = pair

       // If we get a schema mismatch, record the expected
       // type, and the position of the token on the line
       if (typeof type !== typeof token)
        if (!errors) errors = { type
                              , tokenIdx: line.indexOf(token)
                              }
     })

     return errors

  }

  parseVarDeclaration(line=[]) {

    const schema = [ Tok.VarDeclaration
                   , Tok.Identifier
                   ]

    let errors = this.expect(schema, line)

    if (errors) {
      // TODO(pholey): Process error messages
      throw errors
    }

    let [_, identifier, __, value] = line

    // Is it an assignment?
    if (line.length === 4) {
      // genAssignCode(identifier, value)
    }

    // genDecCode(identifier)

  }

  parseLine(line) {
    this.line = line
    // Single line comment, do nothing

    switch(line) {
      case Tok.Comment:
        return
        break
      case Tok.VarDeclaration:
        return this.parseVarDeclaration(line)
    }

  }
}
