/**
 * Determines if the character is white space or not
 */
function isWhiteSpace(ch) {
  return ch == " " || ch == "\t" || ch == "\n";
}

export default class Scanner {
  constructor(source) {
    this.source = source;
    // pointers
    this.start = 0;
    this.current = 0;
    // state
    this.tokens = [];
  }

  /**
   * Returns the set of scanned tokens
   */
  scan() {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.start = this.current;
      this.scanToken();
    }

    return this.tokens;
  }

  scanToken() {
    var c = this.advance();
    switch (c) {
      // whitespace ignore
      case " ":
      case "\r":
      case "\t":
        break;

      case '"':
        this.doubleString();
        break;
      case "'":
        this.singleString();
        break;

      // potentially more logic could go here
      default:
        this.consumeToken();
        break;
    }
  }

  consumeToken() {
    while (!isWhiteSpace(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }

    var token = this.source.substring(this.start, this.current);
    this.tokens.push(token);
  }

  singleString() {
    var keepGoing = true;

    while (keepGoing && !this.isAtEnd()) {
      var next = this.peek();
      // check if the previous was an escape seq and continue
      if (next == "'") {
        // closes the string
        if (this.previous() != "\\") {
          keepGoing = false;
        }
      }
      this.advance();
    }

    var token = this.source.substring(this.start, this.current);
    this.tokens.push(token);
  }

  doubleString() {
    var keepGoing = true;

    while (keepGoing && !this.isAtEnd()) {
      var next = this.peek();
      // check if the previous was an escape seq and continue
      if (next == '"') {
        // closes the string
        if (this.previous() != "\\") {
          keepGoing = false;
        }
      }
      this.advance();
    }

    var token = this.source.substring(this.start, this.current);
    this.tokens.push(token);
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  peek() {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  previous() {
    return this.source.charAt(this.current - 1);
  }
}
