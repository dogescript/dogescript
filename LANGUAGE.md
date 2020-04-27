# dogescript spec (2.3.0)

DogeScript, more officially and prefered `dogescript` is a programming language that enhances javascript and takes it to the moon. It was created in a moment of insanity by the visionary and founder, remixz. Now, in a more mature state of insanity, dogescript's rocket is driven by the crazy community.

# Files
* dogescript files end in `.djs`

Should dogescript be ported to other languages, the `js` portion may be changed to reflect the new language, eg (dogeby => `drb`)

# Whitespace Caveats

* dogescript uses single quotes for strings. Double quotes are not supported.
* dogescript uses 4 space characters for indentation. Tabs are not supported.
* dogescript separates statements by newlines by default. In true-doge mode, they are separated by 3 spaces.


# Language

* [Keywords](#keywords)
* [Comments](#comments)
* [Declaration and Assignment](#declaration-and-assignment)
  * [Variables](#variables)
  * [Assignment Operators](#assignment-operators)
* [Blocks](#blocks)
* [Functions](#functions)
  * [Declaration](#declaration)
  * [Calling Functions](#calling-functions)
* [Classes](#classes)
* [Expressions](#expressions)
* [Branching](#branching)
  * [Conditional Statements](#conditional-statements)
* [Loops](#loops)
  * [While](#while-loops)
  * [For](#for-loops)
* [Operators](#operators)
  * [Unary](#unary-operators)
  * [Binary](#binary-operators)
    * [Conditional](#conditionals)
    * [Assignment](#assignment)
    * [Property](#property)
    * [Miscellaneous](#misc)
* [Trained](#trained)
* [Modules](#modules)
  * [Requiring](#require)
  * [Exporting](#exports)
* [Debugger](#debugger-support)
* [Built in Objects](#built-in-objects)

## Keywords

The following tokens are dogescript keywords and may not be used as *Identifiers* in dogescript programs:

&nbsp;**_&nbsp; amaze &nbsp; and &nbsp; as &nbsp; asink &nbsp; bigger &nbsp; biggerish &nbsp; bigify &nbsp; bork &nbsp; &nbsp; breed &nbsp; but &nbsp; classy &nbsp; debooger &nbsp; dis &nbsp; dose &nbsp; few &nbsp; giv &nbsp; is &nbsp; isa &nbsp; kindof &nbsp; lazy &nbsp; levl &nbsp; less &nbsp; like &nbsp; lots &nbsp; loud &nbsp; maker &nbsp; many &nbsp; maybe &nbsp; more &nbsp; much &nbsp; next &nbsp; &nbsp; not &nbsp; notrly &nbsp; or &nbsp; pawse &nbsp; plz &nbsp; proto &nbsp; quiet &nbsp; rly &nbsp; same &nbsp; shh &nbsp; smaller &nbsp; smallerish &nbsp; smallify &nbsp; so &nbsp; sooper &nbsp; such &nbsp; trained &nbsp; very &nbsp; waite &nbsp; woof &nbsp; wow &nbsp; yelde &nbsp;_**

Additionally, the following symbols should not be used as *Identifiers*:

&nbsp;**_&nbsp; .plz &nbsp; wow& &nbsp; console.loge &nbsp; dogument &nbsp; windoge &nbsp;_**

## Comments

Single line comments are started with `shh` and ended on a new line:
```dogescript
shh This is a single line comment
shh more single line
shh everything is ignored such clever much smart
```

Multiline comments are started with `quiet` and ended with `loud`
```dogescript
quiet
  This is multi-line comment
  Everything within this, also ignored
  wow huh
loud
```

## Declaration and Assignment

### Variables

Variables are declared with the `very` prefix, followed by the identifier, assignment operator and an expression for intialization:
`very [name] is [val]`

```dogescript
very doge is 'wow'     shh doge is a string
very shibe             shh shibe is uninitialized
```

### Assignment Operators
Expressions can be initialized with the following syntax: `[name] [assignment_operator] [value]`

The following are the supported assignment operators:
* `is` : `shibe is 'wow'`
* `=` : `shibe = 100` this is also currently supported

## Blocks

Blocks in dogescript behave the same as with javascript, however all blocks end with `wow`.

Functions that return values can use `wow [val]` or `amaze [val]` to return the value.

### wow

A block without a return would have the following syntax:
```dogescript
such block
  a is a + 1
wow
```

And a block with a return, (returns `a+b`):
```
such sum much a b
wow a + b
```


The `&` operator can be used to chain calls together, effectively taking the place of a `)`:
```dogescript
shh chaining
very canvas is plz d3.select with 'body'&
dose append with 'canvas'&
dose attr with 'width', width&
dose attr with 'height', height
```

Becomes:
```javascript
var canvas = d3.select('body')
  .append('canvas')
  .attr('width', width)
  .attr('height', height);
```

The `wow&` operator is used to terminate a block that is passed in as an argument to a call, effectively taking the place of `})`:
```dogescript
so http
http dose createServer with much req res
   res dose writeHead with 200 {'Content-Type': 'text/plain'}
   res dose end with 'so hello\nmuch world'
wow&
.plz listen with 8080
```

Becomes:
```javascript
var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('so hello\nmuch world');
})
    .listen(8080);
```

## Functions

### Declaration

Functions can be declared on their own, or as arguments to other expressions (very limitedly supported at the moment).

A top level function is declared with the `such` keyword, followed by the name and arguments (if desired) denoted with the `much` keyword: `such [name] much [args]`.

A function with arguments, declares its arguments with the `much` keyword: `such funky much a b c` would create a function with arguments a,b,c.

A named function (`funky`) without arguments would be declared like this:
```dogescript
such funky
  plz console.log with 'no args, so sad'
wow
```

An anonymous function passed in as an argument to a call, is simply declared with `much` and its arguments. The following sample is a dogescript version of a [Tape](https://ci.testling.com/guide/tape) test declared in `dogescript`.

```dogescript
plz test with 'such example' much t
  t dose plan with 2

  t dose equal with 2+3 5
  t dose equal with 7*8+9 65
wow&
```
**Note:** the `wow&` syntax is explained above, however here it terminates the declaration of the anonymous function and the call to `test`.

Which translates to:
```javascript
test(function (t) {
    t.plan(2);

    t.equal(2 + 3, 5);
    t.equal(7 * 8 + 9, 65);
});
```

#### Asynchronous

A function can be made asynchronous by prefixing it with a `asink` token.

```dogescript
asink such foo
wow
```

Translates to:
```javascript
async function foo() {
}
```

#### Generator

The `lazy` keyword can be used to define a generator function inside an expression.

```dogescript
such lazy foo
wow
```

Translates to:
```javascript
function* foo() {
}
```

#### amaze

The `amaze` keyword can be used to return a value, without closing the block.

```dogescript
such foo
amaze 'bar'
wow
```

Becomes:
```javascript
function foo() {
  return 'bar';
}
```

### Calling functions

Calling a function can be done with either the `plz` keyword, or `dose`. Their caveats are explained below:

#### Plz
Function calls start with the `plz` syntax, followed by the function's name and optional arguments (separated by a space). To call a `sum(a,b)` function with `1` and `2`, one would do the following:

```dogescript
plz sum with 1 2
```

#### Dose

Functions can be called on an object using the `dose` syntax: `[var] dose [function]` => `var.function()`. To call a `sum(a,b)` function on a `Math` library with `1` and `2`, one would do the following:

```dogescript
Math dose sum with 1 2
```

Alternatively, one could use the `plz` syntax as well:
```dogescript
plz Math.sum with 1 2
```

#### Function Properties

* `breed` -> `Symbol.species`

## Classes

A class declaration begins with the `classy` keyword.

A class can be declared as a declaration or as an expression. Just like other blocks, class declarations are closed with `wow`.

*Declaration*
```dogescript
classy Rectangle
wow
```

*Expression*
```dogescript
very Rectangle is classy
wow
```

### Constructor

The `maker` keyword declares a `constructor`.

```dogescript
classy Rectangle
  maker foo
  wow
wow
```

### Sub classing

The `grows` keyword declares an extension within a class declaration or class expression to create a class as a child of another class.

```dogescript
classy Shape
wow

classy Rectangle grows Shape
wow
```

### Parent Access

The `sooper` keyword is used to access and call functions on an object's parent

```dogescript
classy Rectangle grows Shape
  maker
    plz sooper with 4
  wow
wow
```

### Methods

#### Prototype Methods

##### Getter

The `git` keyword binds an object property to a function that will be called when that property is looked up.

```dogescript
classy Rectangle
  shh Getter
  git area
    amaze dis dose calcArea
  wow
wow
```

##### Setter

The `sit` keyword binds an object property to a function to be called when there is an attempt to set that property.

```dogescript
classy Rectangle
  shh Setter
  sit length much length
    dis giv length is length
  wow
wow
```

#### Static Methods

##### Stay

The `stay` keyword defines a static method for a class.

```dogescript
classy Rectangle
  shh static
  stay sides
  wow 4

  stay calculateArea much width height
    amaze width * height
  wow
wow
```

## Expressions

Use the `dis` keyword to refer to the current object. In general, `dis` refers to the calling object in a method. Use `dis` either with the `giv` or the `levl` operator.

* `dis giv foo` => `this.foo`
* `dis levl 'foo'` => `this['foo]`

## Branching

### Conditional Statements

If statements start with either `rly` or `notrly` followed by a boolean expression to test. If statements may be followed by an Else statement, with `but` as the keyword. An `else-if` statement can be composed by using `but rly`. If statements must end with a `wow` keyword.

* `rly [expr]` => `if ( [expr] )`
* `notrly [expr]` => `if (! [expr] )`

A sample of an `if, else-if, else` statement can be seen below:
```dogescript
rly doge
  plz console.loge with 'is doge!'
but rly cat
  plz console.loge with 'is kitty!'
but
  plz console.loge with 'dunno what is!!?!'
wow
```

## Loops

### While Loops

While loops start with `many` followed by a boolean expression to test. `many [expr]` => `while (expr)`. Like all blocks, while statements end with the `wow` construct:
```dogescript
very i is 100
many i smaller 0
  plz console.loge with i
  i is i-1
wow
```

### For loops

Iterating for loops begin with the `much` keyword. The syntax for a for loop is `much [lex] next [condition] next [step]` where:
* `[lex]` is a lexical expression, could be assignment `i as 0, j as 0`
* `[condition]` is a boolean expression for terminating the loop, could be ` i smaller 100 and j smaller 50`
* `[step]` an expression to execute on each step of the loop, could be `i more 1, j more 2`

The following sample will showcase both a nested loop, and a loop that iterates over every other diagonal value in a grid (`[][]`). For the purposes of this snippet, the grid will end up being defined something like this:
```
[ [ '0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9' ],
  [ '1,0', '1,1', '1,2', '1,3', '1,4', '1,5', '1,6', '1,7', '1,8', '1,9' ],
  [ '2,0', '2,1', '2,2', '2,3', '2,4', '2,5', '2,6', '2,7', '2,8', '2,9' ],
  [ '3,0', '3,1', '3,2', '3,3', '3,4', '3,5', '3,6', '3,7', '3,8', '3,9' ],
  [ '4,0', '4,1', '4,2', '4,3', '4,4', '4,5', '4,6', '4,7', '4,8', '4,9' ],
  [ '5,0', '5,1', '5,2', '5,3', '5,4', '5,5', '5,6', '5,7', '5,8', '5,9' ],
  [ '6,0', '6,1', '6,2', '6,3', '6,4', '6,5', '6,6', '6,7', '6,8', '6,9' ],
  [ '7,0', '7,1', '7,2', '7,3', '7,4', '7,5', '7,6', '7,7', '7,8', '7,9' ],
  [ '8,0', '8,1', '8,2', '8,3', '8,4', '8,5', '8,6', '8,7', '8,8', '8,9' ],
  [ '9,0', '9,1', '9,2', '9,3', '9,4', '9,5', '9,6', '9,7', '9,8', '9,9' ] ]
```

```dogescript
such makeBoard much r c
 very board is []
  much i as 0 next i smaller r next i more 1
    board[i] is []
    much j as 0 next j smaller c next j more 1
      board[i][j] is i+','+j
    wow
  wow
wow board

very grid is plz makeBoard with 10 10

plz console.log with grid

much row as 0, col as 0 next row smaller 10 and col smaller 10 next row more 1, col more 2
  plz console.log with 'row:'+row+' col:'+col+' val:'+grid[row][col]
wow
```

Producing:
```
row: 0 col:0 val:0,0
row: 1 col:2 val:1,2
row: 2 col:4 val:2,4
row: 3 col:6 val:3,6
row: 4 col:8 val:4,8
```

### Breaking

The `bork` keyword breaks out of a loop.

```dogescript
very i is 0
many 1
  plz console.loge with i
  rly i bigger 50
    bork
  wow
  bigify i
wow
```

## Operators

### Unary Operators

* `bigify` - `++` -> pre increment: `bigify foo`
* `bigified` - `++` -> post increment: `foo bigified`
* `smallify` - `--` -> pre decrement: `smallify foo`
* `smallified` - `--` -> post decrement: `foo smallified`
* `kindof` - `typeof`
* `waite` - `await`
* `yelde` - `yield`

### Binary Operators

#### Conditionals

* `not` - `!==` 
* `is` - `===` - Only currently usable within a `many`, `much`, `rly` and `notrly` clause.
* `and` - `&&`
* `or` - `||` 
* `bigger` - `>` 
* `smaller` - `<` 
* `biggerish` - `>=` 
* `smallerish` - `<=` 
* `isa` - `instanceof`
* `like` - `==`
* `same` - `===`

#### Assignment

* `as` - `=` - Only currently usable within a `many`, `much`, `rly` and `notrly` clause.
* `more` - `+=`
* `less` - `-=`
* `lots` - `*=`
* `few` - `/=`

#### Property

* `giv` - `.` - Used to access properties of an object: `document giv window` -> `document.window`
* `levl` - Equivalent to the bracket notation: `array levl 0` -> `array[0]`
* `proto` - Used to add properties to an object's prototype: `Object proto foo` -> `Object.prototype.foo`

#### Misc

* `next` - `; `

## Trained

The `trained` statement translates to `"use strict"`.

## Modules

### Require

The `so` statement imports a module using nodejs' `require` function, having the syntax: `so [module] [as] [alias]`.

To import a module without assigning it, simply use `so [module]`:
```dogescript
so tape shh require("tape")
so "tape" shh require("tape")
```

To assign the module an alias, use `so [module] as [alias]`:
```dogescript
so tape as test shh var test = require("tape")
so "tape" as "test" shh var test = require("tape")
```

### Exports

The `woof` keyword declares an exported module (effectively replacing `module.exports`), having the syntax: `woof [export]`.

To export only a single value, use `woof [value]`. The following types of values are supported:

* function declarations:
```dogescript
woof such foo
wow

woof much a b
wow
```

Effectively becomes:
```js
module.exports = function foo() {}

module.exports = function(a,b) {}
```
* any reference
```dogescript
such foo much bar
wow
woof foo
```

Effectively becomes:
```js
function foo(bar){}
module.exports = foo
```

To add a property to the `exports` object use an assignment: `woof [name] be [export]`. The following types are supported:

* function declarations:
```dogescript
woof baz be such foo
wow

woof car be much a b
wow
```

Effectively becomes:
```js
module.exports.baz = function foo() {}

module.exports.car = function(a,b) {}
```
* any reference
```dogescript
such foo much bar
wow
woof baz be foo
```

Effectively becomes:
```js
function foo(bar){}
module.exports.baz = foo
```


## Debugger support

The `debooger` and `pawse` keywords translate to `debugger`

## Built-in objects

:warning: Identifiers may not use these as names:

* `console.loge` - `console.log`
* `dogeument` - `document`
* `windoge` - `window`
* `maybe` - `!!+Math.round(Math.random())`
