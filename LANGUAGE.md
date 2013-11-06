## dogescript spec (1.3.0)

### notes

* dogescript uses single quotes for strings. Double quotes are not supported.
* dogescript uses 4 space characters for indentation. Tabs are not supported.

### files

dogescript files are `.djs`. Should dogescript be ported to other languages, the `js` portion may be changed to reflect the new language. (dogeby => `.drb`)

### language

* `shh [comment]` - `// [comment]`
* `very [var] is [value]` - `var [var] = [value]`
* `[var] is [value]` - `[var] = [value]`
* `such [name] much [variables]` - `function [name] ([variables])`
* `wow` - `}`
* `wow&` - `})`
* `plz [function] with [variables]` - `[function]([variables])`
* `plz [function] with [variables..] much [arguments]` - `[function]([variables..], function ([arguments]) {})`
* `rly [params]` - `if ([params])`
* `otherrly [params]` - `else if ([params])`
* `notrly` - `else`
* `many [params]` - `while ([params])`
* `much [params]` - `for ([params])`
* `so [module]` - `var [module] = require([module])`
* `so [module] as [name]` - `var [name] = require([module])`
* `quiet` - `/*`
* `loud` - `*/`



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
