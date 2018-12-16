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
 * Joins the set of keys into a string beginning with a " " such that joinTokens([a, b]) returns " a b"
 */
function joinTokens(keys)
{
  var tokenString = '';

  while(token = keys.shift())
  {
    tokenString += ' ' + token;
  }

  return tokenString;
}

function containsUnary(keys)
{
  return unaryOps.hasOwnProperty(keys[0]) || unaryOps.hasOwnProperty(keys[1]);
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

  // look ahead and check if it is in `woof x be y` form
  if ( keys[2] === 'be' )
  {
    // woof foo be X -> module.exports.foo = X
    return handleNamedWoof(keys);
  }

  // consume: woof
  keys.shift();

  // module.exports = SOMETHING
  var statement = '';
  statement += 'module.exports = ';

  var assignmentValue = keys[0];
  // woof something -> module.exports = something
  if( keys.length === 1)
  {
    statement += assignmentValue;
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
  throw new Error(`Invalid parse state! Expected a value but got: '${keys[0]}' from chain: [${keys}]. Allowed construct 'woof <name> be [value | <SUCH> | <MUCH> ]'`);
}

/**
 * Handles the woof construct with a name:
 *  woof <alias> be <export>
 *
 * Produces:
 *  module.exports.alias = export
 */
function handleNamedWoof(keys)
{
  expectToken('woof', keys);

  // consume: woof
  keys.shift();

  var exportName = keys.shift();
  var statement = 'module.exports.' + exportName + ' = '

  // consume: be
  keys.shift();

  var assignmentValue = keys[0];

  // module.exports.foo = function x(a,b) {}
  if ( assignmentValue === 'such' )
  {
    var functionStatement = handleSuch(keys);
    statement += functionStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // module.exports.foo = function (a,b) {}
  if ( assignmentValue === 'much')
  {
    var anonStatement = handleLambda(keys);
    statement += anonStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // TODO support module.exports.foo = something dose something / plz do something / bar is baz
  if(keys.length > 1)
  {
    throw new Error("Unparseable syntax: " + keys);
  }

  // module.exports.foo = bar
  statement += assignmentValue;
  statement += '\n';
  return statement;
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

  var statement = '//';
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

  var statement = 'new ';

  var object = keys[1];

  // handle arguments
  if(keys[2] === 'with' )
  {
    // add constructor name
    statement += object;
    // shift keys
    var withKeys = keys.slice(2);
    statement += handleWith(withKeys);
    return statement;
  }

  // call doesn't have args
  if (keys[1].slice(-1) === '&') {
      keys[1] = keys[1].slice(0, -1);
      statement += keys[1] + '()\n';
  } else {
      statement += keys[1] + '();\n';
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

  var statement = 'if ('
  statement += controlFlowParser(1,keys);
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

  var statement = 'if (!';
  statement += controlFlowParser(1, keys);
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

  var statement = '} else ';
  if (keys[1] === 'rly' || keys[1] === 'notrly' )
  {
    // shift tokens
    var innerKeys = keys.slice(1);

    if(innerKeys[0] === 'rly' )
    {
      statement += handleRly(innerKeys);
    }
    else {
      statement += handleNotrly(innerKeys);
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

  for (var i = 0; i < keys.length; i++) {

      if (keys[i] === ',' || keys[i] === '&') {
        continue;
      }

      if (keys[i] === 'much') { // lambda functions - thanks @00Davo!
        // shift tokens
        var anonKeys = keys.slice(i);
        var anonStatement = handleLambda(anonKeys);
        statement += anonStatement;
        return statement;
      }

      // clean up name if foo& or foo, to foo
      if (keys[i].substr(-1) === '&' || keys[i].substr(-1) === ',') {
        keys[i] = keys[i].slice(0, -1);
      }

      statement += keys[i];

      // format a:b into a: b
      if (keys[i].substr(-1) === ':') {
        statement += ' ';
      }

      // append , if not last arg or an object literal
      if (i !== keys.length - 1 && keys[i].substr(-1) !== ':') {
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
function controlFlowParser(keyStart, keys)
{
  var statement = '';

  for (var i = keyStart; i < keys.length; i++) {
    // convert to supported operators (eventually this will just call parse again)
    if (validOperators.hasOwnProperty(keys[i])) {
      statement += validOperators[keys[i]];
    }
    else {
      statement += keys[i] + ' ';
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

var replacements = {};
replacements['dogeument']='document'
replacements['windoge']='window'
replacements['pawse']='debugger;'


module.exports = function parse (line) {

    // replace custom keywords
    Object.keys(replacements).forEach(function(key) {
        line = line.replace(new RegExp(key,'g'), replacements[key])
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
    if (keys[0] === 'plz' || keys[0] === '.plz' || keys[0] === 'dose' || keys[1] === 'dose') {
        if (keys[1] === 'dose') statement += keys.shift();
        if (keys[0].charAt(0) === '.' || keys[0] === 'dose') statement += '.';
        if (keys[1] === 'console.loge' || keys[1] === 'loge') keys[1] = keys[1].slice(0, -1);
        if (keys[2] === 'with') {
            // append function call
            statement += keys[1];
            // shift tokens
            var withKeys = keys.slice(2);
            statement += handleWith(withKeys);
            return statement;
        } else {
          if (keys[1].slice(-1) === '&') {
              keys[1] = keys[1].slice(0, -1);
              statement += keys[1] + '()\n';
          } else {
              statement += keys[1] + '();\n';
          }
        }
    }

    // very new variable
    if (keys[0] === 'very') {
        statement += 'var ' + keys[1] + ' = ';
        if (keys[3] === 'new') {
          // shift tokens
          var newCallKeys = keys.slice(3);
          statement += handleNew(newCallKeys);
          return statement;
        }
        if (keys[3] === 'much') {
            // shift tokens
            var anonKeys = keys.slice(3);
            var anonStatement = handleLambda(anonKeys);
            statement += anonStatement;
            return statement;
        }
        if (keys.length > 4) {
            var recurse = '';
            for (var i = 3; i < keys.length; i++) {
                if (keys[i].substr(-1) === ',' && keys[i].charAt(keys[i].length - 2) !== '}') keys[i] = keys[i].slice(0, -1);
                recurse += keys[i] + ' ';
            }
            var recurseKeys = keys.slice(3);
            if (isDogescriptSource(recurseKeys))
            {
              statement += parse(recurse);
            }
            else {
              statement += recurse + ';\n';
            }
        } else {
            if (keys[3] === 'obj') {
                statement += '{\n';
                multiLine = true;
            } else {
                statement += keys[3] + ';\n';
            }
        }
    }

    // support any kind of assignment operator
    var assignment = keys[1]
    if(assignOps.hasOwnProperty(assignment))
    {
      statement += keys[0] + assignOps[assignment];

      if (keys[2] === 'new') {
        // shift tokens
        var newCallKeys = keys.slice(2);
        statement += handleNew(newCallKeys);
        return statement;
      }

      if (keys.length > 2) {
          var recurse = '';
          for (var i = 2; i < keys.length; i++) {
              recurse += keys[i] + ' ';
          }
          statement += parse(recurse);
      } else {
          statement += keys[2] + ';\n';
      }
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
        statement += handleRly(keys);
    }

    // ntrly if
    if (keys[0] === 'notrly')
    {
        statement += handleNotrly(keys);
    }

    // but else
    if (keys[0] === 'but') {
        statement += handleBut(keys);
    }

    // many while
    if (keys[0] === 'many') {
        statement += 'while (';
        statement += controlFlowParser(1, keys);
        statement += ') {\n';
    }

    // much for
    if (keys[0] === 'much') {
        statement += 'for (';
        statement += controlFlowParser(1, keys);
        statement += ') {\n';
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
    if(unaryOps.hasOwnProperty(keys[0]) || unaryOps.hasOwnProperty(keys[1]))
    {
      // ignore operators that should have been snagged by control flow elements
      if(controlFlowKeys.indexOf(keys[0]) === -1)
      {
        // pre
        if(unaryOps.hasOwnProperty(keys[0]))
        {
          statement += unaryOps[keys[0]] + keys[1]
        }
        else {
          statement += keys[0] + unaryOps[keys[1]]
        }
      }
    }

    if(keys[0] === 'woof')
    {
      return handleWoof(keys);
    }

    return statement;
}
