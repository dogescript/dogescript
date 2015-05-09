export class Identifier {
  name = "Identifier"
  constructor(position, text="") {
    this.position = position
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

class FunInv extends Identifier {
  name = "FunInv"
}

class If extends Identifier {
  name = "If"
}

class Else extends Identifier {
  name = "Else"
}

class NotIf extends Identifier {
  name = "NotIf"
}

class While extends Identifier {
  name = "While"
}

class For extends Identifier {
  name = "For"
}

class Alias extends Identifier {
  name = "Alias"
}

class Require extends Identifier {
  name = "Require"
}

class UseStrict extends Identifier {
  name = "UseStrict"
}

class NotDeepEq extends Identifier {
  name = "NotDeepEq"
}

class And extends Identifier {
  name = "And"
}

class Or extends Identifier {
  name = "Or"
}

class Semi extends Identifier {
  name = "Semi"
}

class PlusEq extends Identifier {
  name = "PlusEq"
}

class MinEq extends Identifier {
  name = "MinEq"
}

class MultEq extends Identifier {
  name = "MultEq"
}

class DivEq extends Identifier {
  name = "DivEq"
}

class GT extends Identifier {
  name = "GT"
}

class LT extends Identifier {
  name = "LT"
}

class GTEq extends Identifier {
  name = "GTEq"
}

class LTEq extends Identifier {
  name = "LTEq"
}

class Quantifier extends Identifier {
  name = "Quantifier"
}

export default {
  // Language
  "but": Else,
  "dose": Quantifier,
  "is": Eq,
  "many": While,
  "much": FunParam,
  "notrly": NotIf,
  "plz": FunInv,
  "rly": If,
  "shh": Comment,
  "so": Require,
  "such": FunDec,
  "trained": UseStrict,
  "very": Declaration,
  "wow": Closing,

  // Operators
  "as": Alias,
  "not": NotDeepEq,
  "and": And,
  "or": Or,
  "next": Semi,
  "more": PlusEq,
  "less": MinEq,
  "lots": MultEq,
  "few": DivEq,
  "bigger": GT,
  "smaller": LT,
  "biggerish": GTEq,
  "smallerish": LTEq,


  Identifier,
}
