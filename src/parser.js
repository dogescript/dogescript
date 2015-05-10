class Parser {

  constructor(lineNo, line) {
    this.line = line
    this.lineNo = lineNo
    this.buffer = []
    this.token = { peek() {
                    return this.line[0]
                   }
                 , pop() {
                      return this.line.pop()
                    }
                 , lookAhead(n) {
                    return this.line[n]
                   }
                 , lookBehind(n) {
                   return this.buffer[n]
                   }
                 }
  }

}
