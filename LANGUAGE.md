## dogescript spec (1.2.0)

### notes

* dogescript uses single quotes for strings. Double quotes are not supported.
* dogescript uses 4 space characters for indentation. Tabs are not supported.

### language

* `shh [comment]` - `// [comment]`
* `very [var] is [value]` - `var [var] = [value]`
* `[var] is [value]` - `[var] is [value]`
* `such [name] much [variables]` - `function [name] ([variables])`
* `wow` - `}`
* `plz [function] with [variables]` - `[function]([variables])`
* `plz [function] with [variables..] much [arguments]` - `[function]([variables..], function ([arguments]) {})`
* `rly [params]` - `if ([params])`
* `many [params]` - `while ([params])`
* `much [params]` - `for ([params])`

### operators

Used in `many`, `much` and `rly`.

* `not` - `!==`
* `is` - `===`
* `and` - `&&`
* `or` - `||`
* `next` - `; `
* `as` - `=`
* `more` - `+=`
* `less` - `-=`
* `lots` - `*=`
* `few` - `/=`
* `lesser` - `>`
* `greater` - `<`