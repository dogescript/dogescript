import R from "ramda";

// Defines a collection of tokens, and saves any processed tokens to the buffer
// Storing only the maximum amount of tokens needed for parsing (MAX_LOOKBEHIND)
class Tokens {

  MAX_LOOKBEHIND = 3

  constructor(lineNo, line) {
    this.line = line
    this.lineNo = lineNo
    this.lookBehindBuf = []
    this.lineBuff = []
  }

  peek() {
   return this.line[0]
  }

  pop() {
   this.buffer.push(this.peek())
   return this.line.pop()
  }

  lookAhead(n) {
   return this.line[n]
  }

  lookBehind(n) {
    return this.buffer[n]
  }

  setLine(line, lineNo) {
    this.line = line
    this.lineNo = lineNo
  }

}
