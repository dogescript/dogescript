export class Identifier {
  name = "Identifier"
  constructor(line, position, text="") {
    this.position = position
    this.line = line
    this.text = text
  }
}

class Comment extends Identifier {
  name = "Comment"
}


class FunDec extends Identifier {
  name = "FunDec"
}


class FunParam extends Identifier {
  name = "FunParam"
}


class Closing extends Identifier {
  name = "Closing"
}

class Eq extends Identifier {
  name = "Eq"
}

class Declaration extends Identifier {
  name = "Declaration"
}


export default {
  "shh": Comment,
  "very": Declaration,
  "is": Eq,
  "such": FunDec,
  "much": FunParam,
  "wow": Closing,
  Identifier,
}
