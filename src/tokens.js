export class Identifier {
  name = "Identifier"

  create(position, text="") {
    this.position = position
    this.text = text
    return this
  }
}

export class Comment extends Identifier {
  name = "Comment"
}

export class FunDec extends Identifier {
  name = "FunDec"
}


export class FunParam extends Identifier {
  name = "FunParam"
}


export class Closing extends Identifier {
  name = "Closing"
}

export class Eq extends Identifier {
  name = "Eq"
}

export class VarDeclaration extends Identifier {
  name = "VarDeclaration"
}

export class FunInv extends Identifier {
  name = "FunInv"
}

export class If extends Identifier {
  name = "If"
}

export class Else extends Identifier {
  name = "Else"
}

export class NotIf extends Identifier {
  name = "NotIf"
}

export class While extends Identifier {
  name = "While"
}

export class For extends Identifier {
  name = "For"
}

export class Alias extends Identifier {
  name = "Alias"
}

export class Require extends Identifier {
  name = "Require"
}

export class UseStrict extends Identifier {
  name = "UseStrict"
}

export class NotDeepEq extends Identifier {
  name = "NotDeepEq"
}

export class And extends Identifier {
  name = "And"
}

export class Or extends Identifier {
  name = "Or"
}

export class Semi extends Identifier {
  name = "Semi"
}

export class PlusEq extends Identifier {
  name = "PlusEq"
}

export class MinEq extends Identifier {
  name = "MinEq"
}

export class MultEq extends Identifier {
  name = "MultEq"
}

export class DivEq extends Identifier {
  name = "DivEq"
}

export class GT extends Identifier {
  name = "GT"
}

export class LT extends Identifier {
  name = "LT"
}

export class GTEq extends Identifier {
  name = "GTEq"
}

export class LTEq extends Identifier {
  name = "LTEq"
}

export class LParen extends Identifier {
  name = "LTEq"
}

export class RParen extends Identifier {
  name = "LTEq"
}

export class Quantifier extends Identifier {
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
  "very": VarDeclaration,
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
  "(": LParen,
  ")": RParen,



  Identifier,
}
