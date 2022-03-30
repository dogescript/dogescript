# dogescript reference (3.0.0-pre)

**dogescript** is a programming language that enhances JavaScript and takes it to the moon. It was created in a moment of insanity by the visionary and founder, remixz. Now, in a more mature state of insanity, dogescript's rocket is driven by the crazy community.

# Files
* dogescript files end in `.djs`

Should dogescript be ported to other languages, the `js` portion may be changed to reflect the new language, eg (dogeby => `drb`)

# Syntax Notes
* dogescript uses single quotes for strings. Double quotes are not supported.
* dogescript uses space characters for indentation. Tabs are not supported.

# Language

## Keywords

The following tokens are dogescript keywords and may not be used as *Identifiers* in dogescript programs:

`amaze` `and` `as` `asink` `be` `bigger` `biggerish` `bigify` `bigified` `bork` `box` `breed` `but` `catch` `classy` `debooger` `dis` `dogeument` `dose` `few` `git` `giv` `go` `grows` `is` `isa` `kindof` `lazy` `levl` `less` `like` `lots` `loud` `maker` `many` `maybe` `more` `much` `next` `new` `not` `notrly` `obj` `or` `pawse` `plz` `proto` `quiet` `rly` `same` `shh` `sit` `smaller` `smallerish` `smallify` `smallified` `so` `sooper` `stay` `such` `throw` `thx` `trained` `typeof` `very` `waite` `with` `woof` `wow` `yelde` `windoge`

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
Variables can be reassigned with the following operators:
* `is` or `as`: Assigns the specified value (e.g. `shibe as 'wow'`)
* `more`: Adds the specified value to the variable
* `less`: Subtracts the specified value from the variable
* `lots`: Multiplies the variable by the specified value
* `few`: Divides the variable by the specified value

## Functions
### Declaration
Functions can be declared on their own, or as arguments to other expressions.

A top level function is declared with the `such` keyword, followed by the name and arguments (if desired) denoted with the `much` keyword: `such [name] much [args]`.

A named function (`funky`) without arguments would be declared like this:
```dogescript
such funky
    console dose loge with 'no args, so sad'
wow
```

Named functions can return values by placing the return value after the closing "wow":
```dogescript
such foo
wow 4
```

An anonymous function passed in as an argument to a call, is simply declared with `much` and its arguments. The following sample is a dogescript version of a [Tape](https://ci.testling.com/guide/tape) test declared in `dogescript`.

```dogescript
plz test with 'such example' much t
    t dose plan with 2

    t dose equal with 2+3 5
    t dose equal with 7*8+9 65
wow
```

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
    waite plz bar with 'wow'
wow
```

Translates to:
```javascript
async function foo() {
    await bar("wow");
}
```

#### Generator

The `lazy` keyword can be used to define a generator function inside an expression.

```dogescript
such lazy foo
    yelde 0
wow
```

Translates to:
```javascript
function* foo() {
    yield 0;
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

#### Plz
Function calls start with the `plz` syntax, followed by the function's name and optional arguments (separated by either a space or a comma). To call a `sum(a,b)` function with `1` and `2`, one would do the following:

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
plz (Math giv sum) with 1 2
```

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

Methods can be added to a class with the same syntax as a function

```
classy Rectangle

  such calcArea
  wow

  such resize much width height
  wow
wow
```

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

### Instantiation
Classes can be instantiated with the `new` keyword.

```dogescript
very foo is new Array with 5
```

## Expressions

* `maybe` randomly returns true or false at runtime
* `windoge` -> `window`
* `dogeument` -> `document`
* `breed` -> `Symbol.species`

### dis

Use the `dis` keyword to refer to the current object. In general, `dis` refers to the object a method was called on. Use `dis` either with the `giv` or the `levl` operator.

* `dis giv foo` => `this.foo`
* `dis levl 'foo'` => `this['foo]`

### Object Literals

Plain objects can be created with the `obj` keyword. Keys can be either strings or identifiers.

```dogescript
very foo is obj
    doge: 'arrived'
    'such': 'wow'
wow
```

### Array Literals

Arrays can be created with the `box` keyword.

```dogescript
very list is box 'cat' 'yarn' wow
```

## Branching

### Conditional Statements

If statements start with either `rly` or `notrly` followed by a boolean expression to test. If statements may be followed by an Else statement, with `but` as the keyword. An `else-if` statement can be composed by using `but rly`. If statements must end with a `wow` keyword.

* `rly [expr]` => `if ( [expr] )`
* `notrly [expr]` => `if (! [expr] )`

A sample of an `if, else-if, else` statement can be seen below:
```dogescript
rly doge
    console dose loge with 'is doge!'
but rly cat
    console dose loge with 'is kitty!'
but
    console dose loge with 'dunno what is!!?!'
wow
```

## Loops

### While Loops

While loops start with `many` followed by a boolean expression to test. `many [expr]` => `while (expr)`. Like all blocks, while statements end with the `wow` construct:
```dogescript
very i is 100
many i smaller 0
    console dose loge with i
    i is i-1
wow
```

### For loops

Iterating for loops begin with the `much` keyword. The syntax for a for loop is `much [lex] next [condition] next [step]` where:
* `[lex]` is a list of inline expressions, usually assignment, e.g. `i as 0, j as 0`
* `[condition]` is a boolean expression for terminating the loop, could be ` i smaller 100 and j smaller 50`
* `[step]` an inline expression to execute on each step of the loop, could be `i more 1, j more 2`

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
    very board is new Array
    much i as 0 next i smaller r next i more 1
        board levl i is new Array
        much j as 0 next j smaller c next j more 1
          board levl i levl j is i+','+j
        wow
    wow
wow board

very grid is plz makeBoard with 10 10

console dose loge with grid

much row as 0, col as 0 next row smaller 10 and col smaller 10 next row more 1, col more 2
  console dose loge with 'row:'+row+' col:'+col+' val:'+(grid levl row levl col)
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

## Error Handling
Errors can be thrown using the `throw` keyword:

```dogescript
such neverWorks
    throw new Error with 'What did you expect?'
wow
```

### go
To catch errors, use the `go` statement:

```dogescript
go
    plz neverWorks
catch ex
    console dose error with ex
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
* `is` - `===`
* `and` - `&&`
* `or` - `||` 
* `bigger` - `>` 
* `smaller` - `<` 
* `biggerish` - `>=` 
* `smallerish` - `<=` 
* `isa` - `instanceof`
* `like` - `==`
* `same` - `===`

The following arithmetic operators are available: `*` `/` `%` `+` `-`

#### Property

* `giv` - `.` - Used to access properties of an object: `document giv window` -> `document.window`
* `levl` - Equivalent to the bracket notation: `array levl 0` -> `array[0]`
* `proto` - Used to add properties to an object's prototype: `Object proto foo` -> `Object.prototype.foo`

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
