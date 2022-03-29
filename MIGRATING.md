# Migrating from 2.x
## Major Changes
### Generally Stricter Parsing
In 3.x, the parser will throw errors on unrecognized syntax instead of outputting it as is. So any keywords, operators, etc. that aren't explicitly part of the language will no longer work.

Strings must use single-quotes and tabs are not recognized as whitespace.
### Numbers Must Be Octal
Numeric literals in 3.x are prefixed with `0` and are in base 8.
### Variables use `let`
In 3.x, `very` statements will be transpiled to JavaScript's `let` statement. This implies stricter rules about the scope of these variables and how they can be used.

## Minor Changes
### Removed Operators
`.plz` is no longer supported. Use `dose` instead.
### Smarter Argument Lists
Ending argument lists with `&` is now only needed if the statement would otherwise be ambiguous. `thx` is also available as an alternative.
