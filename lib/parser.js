var multiComment = false;
var multiLine = false;

var validOperators = {
    'is': ' === ',
    'not': ' !== ',
    'and':  ' && ',
    'or':  ' || ',
    'next':  '; ',
    'as':  ' = ',
    'more':  ' += ',
    'less':  ' -= ',
    'lots': ' *= ',
    'few': ' /= ',
    'very': ' var ',
    'smaller': ' < ',
    'bigger': ' > ',
    'smallerish': ' <= ',
    'biggerish': ' >= ',
    'notrly': ' ! ',
    'bigify': '++',
    'smallify': '--'
};

var assignOps = {
  'more': ' += ',
  'less': ' -= ',
  'lots': ' *= ',
  'few' : ' /= ',
  'is' : ' = '
}

var unaryOps = {
  'bigify': '++',
  'smallify': '--'
}

var incrementDecrementOps = ['bigify', 'smallify']

var controlFlowKeys = [
  'many',
  'much',
  'rly',
  'but',
  'notrly'
]

var valid = [
    'such',
    'wow',
    'wow&',
    'plz',
    '.plz',
    'dose',
    'very',
    'shh',
    'quiet',
    'loud',
    'rly',
    'notrly',
    'but',
    'many',
    'much',
    'so',
    'trained',
    'maybe',
    'pawse',
    'woof'
];

/**
 * Raises an error if the given tokens do not start with the desired state
 */
function expectToken(expectedStart, tokens)
{
  if ( tokens[0] !== expectedStart)
  {
    throw new Error(`Invalid parse state! Expected: '${expectedStart}' but got: '${tokens[0]}' from chain: [${tokens}]`);
  }
}

/**
 * Raises an error if the start token does not match any of the expected tokens.
 */
function expectAnyToken(expectedTokens, tokens)
{
  var foundToken = false;
  var firstToken = tokens[0];
  for(i = 0; i < expectedTokens.length; i ++)
  {
    if(firstToken === expectedTokens[i])
    {
      foundToken = true;
      break;
    }
  }

  if(!foundToken)
  {
    throw new Error(`Invalid parse state! Expected any of: '${expectedTokens}' but got: '${tokens[0]}' from chain: [${tokens}]`);
  }
}

/**
 * Joins the set of keys into a string such that joinTokens([a, b]) returns "a b".
 * Consumes all keys from the given array such that the array will be empty if it is referenced after calling this function.
 */
function joinTokens(keys)
{
  var tokenString = '';

  while(token = keys.shift())
  {
    tokenString += token;
    if(keys.length > 0)
    {
      tokenString += ' ';
    }
  }

  return tokenString;
}

function containsUnary(keys)
{
  return unaryOps.hasOwnProperty(keys[0]) || unaryOps.hasOwnProperty(keys[1]);
}

/**
 * Determines whether the first or second token is one of [bigify, smallify]
 */
function containsIncrementDecrement(keys)
{
  return incrementDecrementOps.indexOf(keys[0]) !== -1 || incrementDecrementOps.indexOf(keys[1]) !== -1;
}

/**
 * Determines if the parsed keys should be treated as dogescript source or not.
 */
function isDogescriptSource(keys)
{

  // starts the statement with a valid key
  if (valid.indexOf(keys[0]) !== -1)
  {
    return true;
  }

  // statement applying an assignment operator
  if ( assignOps.hasOwnProperty(keys[1]) )
  {
    return true;
  }

  // applying a unary operator
  if ( containsUnary(keys) )
  {
    return true;
  }

  // calling function on Object
  if ( keys[1] === 'dose' )
  {
    return true;
  }

  // ending a multi comment block
  if (multiComment && keys[0] === 'loud' )
  {
    return true;
  }

  // closing a multi-line object creation
  if ( multiLine && keys[0] === 'wow' )
  {
    return true;
  }

  // not valid dogescript
  return false;
}

/**
 * Handles the woof construct:
 *  woof <alias> be <export>
 *  woof <export>
 *
 * Produces:
 *  module.exports.alias = export
 *  module.exports = export
 */
function handleWoof(keys)
{
  expectToken('woof', keys);

  // consume: woof
  keys.shift();

  var exportName = '';

  // look ahead and check if it is in `woof x be y` form
  if ( keys[1] === 'be' )
  {
    // woof foo be X -> module.exports.foo = X
    exportName = '.' + keys.shift();

    // consume: be
    keys.shift();
  }

  // module.exports = SOMETHING
  var statement = 'module.exports' + exportName + ' = ';

  var assignmentValue = keys[0];
  // woof something -> module.exports = something
  if( keys.length === 1)
  {
    statement += keys.shift();
    statement += '\n';
    return statement;
  }

  // module.exports = function x(a,b) {}
  if ( assignmentValue === 'such' )
  {
    var functionStatement = handleSuch(keys);
    statement += functionStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // module.exports = function (a,b) {}
  if ( assignmentValue === 'much')
  {
    var anonStatement = handleLambda(keys);
    statement += anonStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // TODO support other expressions
  throw new Error(`Invalid parse state! Expected a value but got: '${keys[0]}' from chain: [${keys}]. Allowed construct 'woof [<name> be] <value | <SUCH> | <MUCH> >'`);
}

/**
 * Handles the such construct:
 *  such <function_name> [much]
 *
 * Produces:
 *  function <function_name> ([args]) {
 */
function handleSuch(keys)
{
  expectToken('such', keys);
  // consume: such
  keys.shift();

  var functionName = keys.shift();
  var statement = 'function ' + functionName;

  // no args
  if (!keys[0])
  {
    return statement + ' () { \n';
  }

  // args have to be declared with much
  if (keys[0] !== 'much')
  {
    throw new Error(`Invalid parse state! Expected: 'much' but got: '${keys[0]}' from chain: [${keys}]. Allowed construct 'such <function_name> [much <args>]'`);
  }

  statement += handleMuchArgs(keys);
  return statement;
}

/**
 * Handles arguments to functions:
 *  much [args]
 *
 * Produces the argument part to a preceding function:
 *  ([args]) {
 *
 * Assuming that the function_name was encountered before this should ultimately produce:
 *  function([args]) {
 */
function handleMuchArgs(keys)
{
  expectToken('much', keys);

  // consume: much
  keys.shift();

  var statement = ' (';
  while(arg = keys.shift())
  {
    statement += arg;
    if(keys.length > 0)
    {
      statement += ', ';
    }
  }
  statement += ') { \n';

  return statement;
}

/**
 * Handles lambda functions ( thanks @00Davo!):
 *  much [args]
 *
 * Produces:
 *  function (args) {
 */
function handleLambda(keys)
{
  return 'function' + handleMuchArgs(keys);
}

/**
 * Handles the so construct (thanks @maxogden!):
 *  so <module> [as <name>]
 *
 * Produces:
 *  var name = require('module');
 */
function handleSo(keys)
{
  expectToken('so', keys);

  // consume: so
  keys.shift();

  var statement = '';
  var lib = keys.shift();

  var modName = '';

  // check if it's a named import or not
  if(keys.length > 0) {
    expectToken('as', keys);
    // consume: as
    keys.shift();
    modName = keys.shift();
  } else {
    // so x

    // try to make a simple name
    var mod = lib;
    // test for relative module, optional chop extension
    var m = /^..?\/.*?([\w-]+)(\.\w+)?$/.exec(mod);
    if (m) {
        mod = m[1];
    }
    modName = mod.replace(/-/g, '_');
  }

  return `var ${modName} = require('${lib}');\n`;
}

/**
 * Handles the single line comment:
 * shh [text]
 *
 * Produces:
 * // text
 */
function handleShh(keys)
{
  expectToken('shh', keys);

  // consume: shh
  keys.shift();

  var statement = '// ';
  statement += joinTokens(keys);
  statement += '\n';

  return statement;
}

/**
 * Handles the beginning of a multi-line comment:
 * quiet [comments]
 *
 * Produces the start of a multi-line comment "/*"
 */
 function handleQuiet(keys)
 {
   expectToken('quiet', keys);

   // consume: quiet
   keys.shift();

   multiComment = true;

   var statement = '/*';
   statement += joinTokens(keys);
   statement += '\n';

   return statement;
 }

/**
 * Handles the end of the multi-line comment:
 * loud
 *
 * Produces the end of a multiline comment "*\/"
 */
function handleLoud(keys)
{
  expectToken('loud', keys);

  if(!multiComment)
  {
    throw new Error("Unparseable syntax! Encountered: 'loud' without first seeing 'quiet'");
  }

  // consume: loud
  keys.shift();

  multiComment = false;

  var statement = '*/';
  statement += joinTokens(keys);
  statement += '\n';

  return statement;
}

/**
 *
 * Handles instantiation via new:
 * new x [with args]
 *
 */
function handleNew(keys)
{
  expectToken('new', keys);

  // consume: new
  keys.shift();

  var statement = 'new ';

  var object = keys.shift();

  // handle arguments
  if(keys[0] === 'with' )
  {
    // add constructor name
    statement += object;
    statement += handleWith(keys);
    return statement;
  }

  // call doesn't have args
  if (object.slice(-1) === '&') {
    object = object.slice(0, -1);
    statement += object + '()\n';
  } else {
    statement += object + '();\n';
  }

  return statement;
}

/**
 * Handles if statements:
 * rly [condition]
 */
function handleRly(keys)
{
  expectToken('rly', keys);

  // consume: rly
  keys.shift();

  var statement = 'if ('
  statement += controlFlowParser(keys);
  // close condition and open branch
  statement += ') {\n';
  return statement;
}

/**
 * Handles negated if statements:
 * notrly [condition]
 */
function handleNotrly(keys)
{
  expectToken('notrly', keys);

  // consume: notrly
  keys.shift();

  var statement = 'if (!';
  statement += controlFlowParser(keys);
  // close condition and open branch
  statement += ') {\n';
  return statement;
}

/**
 * Handles else statements:
 * but [condition]
 * but [rly|notrly] [condition]
 */
function handleBut(keys)
{
  expectToken('but', keys);

  // consume: but
  keys.shift();

  var statement = '} else ';
  if (keys[0] === 'rly' || keys[0] === 'notrly' )
  {
    if(keys[0] === 'rly' )
    {
      statement += handleRly(keys);
    }
    else {
      statement += handleNotrly(keys);
    }
  }
  else
  {
    // open branch
    statement += '{\n';
  }
  return statement;
}

/**
 * Handles arguments to function call:
 * with <args>
 *
 * Produces:
 * (<args>)
 */
function handleWith(keys)
{
  expectToken('with', keys);
  // consume: with
  keys.shift();

  var statement = '(';

  // if the last key ends with & we are chaining calls
  var chained = keys[keys.length - 1].slice(-1) === '&';

  while(keys.length > 0) {

      // look ahead before consuming the key
      if (keys[0] === 'much') { // lambda functions - thanks @00Davo!
        var anonStatement = handleLambda(keys);
        statement += anonStatement;
        return statement;
      }

      var currKey = keys.shift();
      if (currKey === ',' || currKey === '&') {
        continue;
      }

      // clean up name if foo& or foo, to foo
      if (currKey.substr(-1) === '&' || currKey.substr(-1) === ',') {
        currKey = currKey.slice(0, -1);
      }

      statement += currKey;

      // format a:b into a: b
      if (currKey.substr(-1) === ':') {
        statement += ' ';
      }

      // append , if not last arg or an object literal
      if (keys.length > 0 && currKey.substr(-1) !== ':') {
        statement += ', ';
      }
  }

  // cleanup dangling pieces
  if (statement.substr(-2) === ', ') {
    statement = statement.slice(0, -2);
  }

  // the token regex will split {a: b} into {a:, b, } which will cause us to append ', }'
  if (statement.includes(', ]'))
  {
    statement += statement.replace(/, ]/g, ']');
  }
  if (statement.includes(', }'))
  {
    statement = statement.replace(/, }/g, '}');
  }

  if (chained) {
    statement += ')\n';
  }
  else {
    statement += ');\n';
  }

  return statement;
}

/**
 * Handles inner parsing from control flow statements:
 * rly notrly but much many
 */
function controlFlowParser(keys)
{
  var statement = '';

  while(token = keys.shift())
  {
    // convert to supported operators (eventually this will just call parse again)
    if(validOperators.hasOwnProperty(token))
    {
      statement += validOperators[token];
    }
    else
    {
      statement += token + ' ';
    }
  }

  return statement;
}

/**
 * Handles the ending of statements:
 * wow [return vals]
 * wow& [return vals]
 */
function handleWow(keys)
{
  expectAnyToken(['wow', 'wow&'], keys);
  multiLine = false;

  var chained = keys[0] === 'wow&';

  // consume: wow/wow&
  keys.shift();

  var statement = '';

  // add keys if there's a return value
  if(keys.length > 0)
  {
    statement += 'return';
    // ideally this will call parseKeys in the future to support return foo();
    while(arg = keys.shift())
    {
      statement += ' ' + arg;
    }
    statement += ';\n';
  }

  if(chained)
  {
    // close chained call
    statement += '}) \n';
  } else {
    // close block
    statement += '} \n';
  }

  return statement;
}

/**
 * Handles the for loop construct:
 * much [startState] next [condition] next [nextState]
 *
 * Produces:
 * for(startState; condition; nextState) {
 */
function handleMuchLoop(keys)
{
  expectToken('much', keys);

  // consume: much
  keys.shift();

  var statement = 'for ('
  statement += controlFlowParser(keys);
  statement += ') {\n';
  return statement;
}

/**
 * Handles the while loop construct:
 * many [condition]
 *
 * Produces:
 * while(condition) {
 */
function handleMany(keys)
{
  expectToken('many', keys);

  // consume: many
  keys.shift();

  var statement = 'while (';
  statement += controlFlowParser(keys);
  statement += ') {\n';

  return statement;
}

/**
 * Determines appropriate way to invoke a function whether it has args or not
 * @param functionName the name of the function
 * @param keys the set of tokens remaining, if the given keys does not begin with a `with` token a syntax error will be thrown
 * @param allowedSyntax a description of the allowed syntax to invoke the function (in case the syntax is incorrect)
 */
function functionInvocation(functionName, keys, allowedSyntax)
{
  // no more args
  if(keys.length < 1)
  {
    // if ends with & we are chaining a call
    if(functionName.endsWith('&'))
    {
      // remove & from functionName
      return functionName.slice(0,-1) + '()\n';
    }

    return functionName + '();\n';
  }

  // args have to be declared with a `with`
  if (keys[0] !== 'with')
  {
    throw new Error(`Invalid parse state! Expected: 'with' but got: '${keys[0]}' from chain: [${keys}]. Allowed construct: ${allowedSyntax}`);
  }

  return functionName + handleWith(keys);
}

/**
 * Handles invoking a function:
 * plz <function_name> [with <args>]
 *
 * Produces:
 *  plz function_name([args])
 */
function handlePlz(keys)
{
  expectAnyToken(['plz', '.plz'], keys);

  // consume: plz/.plz
  var invocation = keys.shift();

  var statement = '';
  // if it's a .plz we're chaning a call so append the .
  if(invocation.charAt(0) === '.')
  {
    statement += '.';
  }

  var functionName = keys.shift();

  // check if function invocation is special name
  if(functionName === 'console.loge')
  {
    functionName = functionName.slice(0, -1);
  }

  statement += functionInvocation(functionName, keys, 'plz|.plz <function_name> [with <args>]');
  return statement;
}

/**
 * Handles invoking a function on an object:
 *  <object> dose <function_name> [with <args>]
 *  dose <function_name> [with <args>]
 *
 * Produces:
 *  object.function_name([args])
 *  .function_name([args])
 */
function handleDose(keys)
{
  if(keys[0] !== 'dose' && keys[1] !== 'dose')
  {
    throw new Error(`Invalid parse state! Expected 'dose' in either 'x dose y' or 'dose y' but got chain: [${keys}]`);
  }

  var objectName = '';

  // if dose is the first token, we're chaining a previous call
  if(keys[1] === 'dose')
  {
    // object dose func
    objectName = keys.shift();
  }

  // consume: dose
  keys.shift();

  var statement = objectName + '.';
  var functionName = keys.shift();

  // check if function invocation is special name
  if(functionName === 'loge' )
  {
    // only replace if objectName is console
    if(objectName === 'console')
    {
      functionName = functionName.slice(0, -1);
    }
  }

  statement += functionInvocation(functionName, keys, '[<object>] dose <function_name> [with <args>]');
  return statement;
}

 /**
  * Handles the increment and decrement unary operators in either pre or postfix form:
  *  <identifier> bigify|smallify
  *  bigify|smallify <identifier>
  *
  * Produces:
  *  identifier++ | identifier--
  *  ++identifier | --identifier
  */
function handleIncrementDecrement(keys)
{
  if(!containsIncrementDecrement(keys))
  {
    throw new Error(`Invalid parse state! Expected an operator from: ${incrementDecrementOps} in either '<identifier> operator' or 'operator <identifer>' but got chain: [${keys}]`);
  }

  // prefix
  if(unaryOps.hasOwnProperty(keys[0]))
  {
    return unaryOps[keys.shift()] + keys.shift()
  }

  // postfix
  return keys.shift() + unaryOps[keys.shift()]
}

var replacements = {};
replacements['dogeument']='document'
replacements['windoge']='window'

module.exports = function parse (line) {

    // replace custom keywords
    Object.keys(replacements).forEach(function(key) {

        // preprocess tokens and replace special names
        line = line.replace(/'[^']+'|\S+/g, function (match, part, str) {

          if(match === key)
          {
            return replacements[key];
          }

          if(match.startsWith(key+'.'))
          {
            return match.replace(key+'.', replacements[key]+'.');
          }

          return match;
        });
    });

    var keys = line.match(/'[^']+'|\S+/g);
    var statement = '';

    if (keys === null) return line + '\n';

    // if processing multi-comment
    if(multiComment)
    {
      // consume tokens until we encounter loud
      if(keys[0] !== 'loud')
      {
        return line + '\n';
      }
      // else must be loud
      return handleLoud(keys);
    }

    // not dogescript, such javascript
    if ( !isDogescriptSource(keys) )
    {
      return line + '\n';
    }

    // trained use strict
    if (keys[0] === 'trained') {
      // consume: trained
      keys.shift();
      return '"use strict";\n';
    }

   // such function
    if (keys[0] === 'such') {
        return handleSuch(keys);
    }

    if ( keys[0] === 'wow' || keys[0] === 'wow&' )
    {
      return handleWow(keys);
    }

    // plz execute function
    if(keys[0] === 'plz' || keys[0] === '.plz')
    {
      return handlePlz(keys);
    }
    // obj dose function
    if(keys[0] === 'dose' || keys[1] === 'dose')
    {
      return handleDose(keys);
    }

    // very new variable
    if (keys[0] === 'very') {
      // consume: very
      keys.shift();

      statement += 'var ' + keys.shift() + ' = ';

      // consume:is/as
      keys.shift();

      if (keys[0] === 'new') {
        statement += handleNew(keys);
        return statement;
      }

      if (keys[0] === 'much') {
        var anonStatement = handleLambda(keys);
        statement += anonStatement;
        return statement;
      }

      if (keys[0] === 'obj') {
        statement += '{\n';
        multiLine = true;
        return statement;
      }

      if (keys.length > 1) {
        if (isDogescriptSource(keys)) {
          statement += parse(joinTokens(keys));
          return statement;
        }

        statement += joinTokens(keys);
      }
      else
      {
        statement += keys.shift();
      }

      statement += ';\n';
      return statement;
    }

    // support any kind of assignment operator
    if(assignOps.hasOwnProperty(keys[1]))
    {
      statement += keys.shift() + assignOps[keys.shift()];

      if (keys[0] === 'new') {
        statement += handleNew(keys);
        return statement;
      }

      if(keys.length > 1) {
        // this will eventually call parseKeys
        statement += parse(joinTokens(keys));
      }
      else {
        statement += keys.shift() + ';\n';
      }

      return statement;
    }

    // shh comment
    if (keys[0] === 'shh') {
      return handleShh(keys);
    }

    // quiet start multi-line comment
    if (keys[0] === 'quiet') {
      return handleQuiet(keys);
    }

    // rly if
    if (keys[0] === 'rly') {
      return handleRly(keys);
    }

    // ntrly if
    if (keys[0] === 'notrly')
    {
      return handleNotrly(keys);
    }

    // but else
    if (keys[0] === 'but') {
      return handleBut(keys);
    }

    // many while
    if (keys[0] === 'many') {
      return  handleMany(keys);
    }

    // much for
    if (keys[0] === 'much') {
      return handleMuchLoop(keys);
    }

    // so require
    if (keys[0] === 'so') {
      return handleSo(keys);
    }

    // maybe boolean operator
    if (keys[0] === 'maybe') {
        // consume: maybe
        keys.shift();
        return '(!!+Math.round(Math.random()))';
    }

    // standalone increment/decrement
    if(containsIncrementDecrement(keys))
    {
      // ignore operators that should have been snagged by control flow elements (removed once control flow consumes tokens)
      if(controlFlowKeys.indexOf(keys[0]) === -1)
      {
        return handleIncrementDecrement(keys);
      }
    }

    if(keys[0] === 'woof')
    {
      return handleWoof(keys);
    }

    if(keys[0] === 'pawse')
    {
      // consume: pawse
      keys.shift();
      return 'debugger;'
    }

    return statement;
}
