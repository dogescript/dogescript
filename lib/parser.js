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

var controlFlowTokens = [
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
    'debooger',
    'pawse',
    'woof'
];

/**
 * Raises an error if the given tokens do not start with the desired state
 */
function expectToken(expectedStart, parseContext)
{
  var tokens = parseContext.tokens;
  if ( tokens[0] !== expectedStart)
  {
    throw new Error(`Invalid parse state! Expected: '${expectedStart}' but got: '${tokens[0]}' from chain: [${tokens}]. ${parseInfo(parseContext)}`);
  }
}

/**
 * Raises an error if the start token does not match any of the expected tokens.
 */
function expectAnyToken(expectedTokens, parseContext)
{
  var tokens = parseContext.tokens;

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
    throw new Error(`Invalid parse state! Expected any of: '${expectedTokens}' but got: '${tokens[0]}' from chain: [${tokens}]. ${parseInfo(parseContext)}`);
  }
}

/**
 * Joins the set of tokens into a string such that joinTokens([a, b]) returns "a b".
 * Consumes all tokens from the given array such that the array will be empty if it is referenced after calling this function.
 */
function joinTokens(tokens)
{
  var tokenString = '';

  while(token = tokens.shift())
  {
    tokenString += token;
    if(tokens.length > 0)
    {
      tokenString += ' ';
    }
  }

  return tokenString;
}

function containsUnary(parseContext)
{
  var tokens = parseContext.tokens;
  return unaryOps.hasOwnProperty(tokens[0]) || unaryOps.hasOwnProperty(tokens[1]);
}

/**
 * Determines whether the first or second token is one of [bigify, smallify]
 */
function containsIncrementDecrement(parseContext)
{
  var tokens = parseContext.tokens;
  return incrementDecrementOps.indexOf(tokens[0]) !== -1 || incrementDecrementOps.indexOf(tokens[1]) !== -1;
}

/**
 * Determines if the parsed tokens should be treated as dogescript source or not.
 */
function isDogescriptSource(parseContext)
{
  var tokens = parseContext.tokens;

  // starts the statement with a valid token
  if (valid.indexOf(tokens[0]) !== -1)
  {
    return true;
  }

  // statement applying an assignment operator
  if ( assignOps.hasOwnProperty(tokens[1]) )
  {
    return true;
  }

  // applying a unary operator
  if ( containsUnary(parseContext) )
  {
    return true;
  }

  // calling function on Object
  if ( tokens[1] === 'dose' )
  {
    return true;
  }

  // ending a multi comment block
  if (multiComment && tokens[0] === 'loud' )
  {
    return true;
  }

  // closing a multi-line object creation
  if ( multiLine && tokens[0] === 'wow' )
  {
    return true;
  }

  // not valid dogescript
  return false;
}

/**
 * Creates a formatted message that displays the token set that was parsed and the input.
 */
function parseInfo(parseContext)
{
  return `Parsed tokens [${parseContext.inputTokens}] from input "${parseContext.input}"`;
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
function handleWoof(parseContext)
{
  expectToken('woof', parseContext);

  var tokens = parseContext.tokens;

  // consume: woof
  tokens.shift();

  var exportName = '';

  // look ahead and check if it is in `woof x be y` form
  if ( tokens[1] === 'be' )
  {
    // woof foo be X -> module.exports.foo = X
    exportName = '.' + tokens.shift();

    // consume: be
    tokens.shift();
  }

  // module.exports = SOMETHING
  var statement = 'module.exports' + exportName + ' = ';

  var assignmentValue = tokens[0];
  // woof something -> module.exports = something
  if( tokens.length === 1)
  {
    statement += tokens.shift();
    statement += '\n';
    return statement;
  }

  // module.exports = function x(a,b) {}
  if ( assignmentValue === 'such' )
  {
    var functionStatement = handleSuch(parseContext);
    statement += functionStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // module.exports = function (a,b) {}
  if ( assignmentValue === 'much')
  {
    var anonStatement = handleLambda(parseContext);
    statement += anonStatement;
    // the closing wow will be in a new line
    return statement;
  }

  // TODO support other expressions
  throw new Error(`Invalid parse state! Expected a value but got: '${tokens[0]}' from chain: [${tokens}]. Allowed construct 'woof [<name> be] <value | <SUCH> | <MUCH> >'. ${parseInfo(parseContext)}`);
}

/**
 * Handles the such construct:
 *  such <function_name> [much]
 *
 * Produces:
 *  function <function_name> ([args]) {
 */
function handleSuch(parseContext)
{
  expectToken('such', parseContext);

  var tokens = parseContext.tokens;

  // consume: such
  tokens.shift();

  var functionName = tokens.shift();
  var statement = 'function ' + functionName;

  // no args
  if (!tokens[0])
  {
    return statement + ' () { \n';
  }

  // args have to be declared with much
  if (tokens[0] !== 'much')
  {
    throw new Error(`Invalid parse state! Expected: 'much' but got: '${tokens[0]}' from chain: [${tokens}]. Allowed construct 'such <function_name> [much <args>]'. ${parseInfo(parseContext)}`);
  }

  statement += handleMuchArgs(parseContext);
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
function handleMuchArgs(parseContext)
{
  expectToken('much', parseContext);

  var tokens = parseContext.tokens;

  // consume: much
  tokens.shift();

  var statement = ' (';
  while(arg = tokens.shift())
  {
    statement += arg;
    if(tokens.length > 0)
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
function handleLambda(parseContext)
{
  return 'function' + handleMuchArgs(parseContext);
}

/**
 * Handles the so construct (thanks @maxogden!):
 *  so <module> [as <name>]
 *
 * Produces:
 *  var name = require('module');
 */
function handleSo(parseContext)
{
  expectToken('so', parseContext);

  var tokens = parseContext.tokens;

  // consume: so
  tokens.shift();

  var statement = '';
  var lib = tokens.shift();

  var modName = '';

  // check if it's a named import or not
  if(tokens.length > 0) {
    expectToken('as', parseContext);
    // consume: as
    tokens.shift();
    modName = tokens.shift();
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
function handleShh(parseContext)
{
  expectToken('shh', parseContext);

  var tokens = parseContext.tokens;

  // consume: shh
  tokens.shift();

  var statement = '// ';
  statement += joinTokens(parseContext.tokens);
  statement += '\n';

  return statement;
}

/**
 * Handles the beginning of a multi-line comment:
 * quiet [comments]
 *
 * Produces the start of a multi-line comment "/*"
 */
 function handleQuiet(parseContext)
 {
  expectToken('quiet', parseContext);

  var tokens = parseContext.tokens;

   // consume: quiet
   tokens.shift();

   multiComment = true;

   var statement = '/*';
   statement += joinTokens(parseContext.tokens);
   statement += '\n';

   return statement;
 }

/**
 * Handles the end of the multi-line comment:
 * loud
 *
 * Produces the end of a multiline comment "*\/"
 */
function handleLoud(parseContext)
{
  expectToken('loud', parseContext);

  var tokens = parseContext.tokens;

  if(!multiComment)
  {
    throw new Error("Unparseable syntax! Encountered: 'loud' without first seeing 'quiet'");
  }

  // consume: loud
  tokens.shift();

  multiComment = false;

  var statement = '*/';
  statement += joinTokens(parseContext.tokens);
  statement += '\n';

  return statement;
}

/**
 *
 * Handles instantiation via new:
 * new x [with args]
 *
 */
function handleNew(parseContext)
{
  expectToken('new', parseContext);

  var tokens = parseContext.tokens;

  // consume: new
  tokens.shift();

  var statement = 'new ';

  var object = tokens.shift();

  // handle arguments
  if(tokens[0] === 'with' )
  {
    // add constructor name
    statement += object;
    statement += handleWith(parseContext);
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
function handleRly(parseContext)
{
  expectToken('rly', parseContext);

  var tokens = parseContext.tokens;

  // consume: rly
  tokens.shift();

  var statement = 'if ('
  statement += controlFlowParser(parseContext);
  // close condition and open branch
  statement += ') {\n';
  return statement;
}

/**
 * Handles negated if statements:
 * notrly [condition]
 */
function handleNotrly(parseContext)
{
  expectToken('notrly', parseContext);

  var tokens = parseContext.tokens;

  // consume: notrly
  tokens.shift();

  var statement = 'if (!';
  statement += controlFlowParser(parseContext);
  // close condition and open branch
  statement += ') {\n';
  return statement;
}

/**
 * Handles else statements:
 * but [condition]
 * but [rly|notrly] [condition]
 */
function handleBut(parseContext)
{
  expectToken('but', parseContext);

  var tokens = parseContext.tokens;

  // consume: but
  tokens.shift();

  var statement = '} else ';
  if (tokens[0] === 'rly' || tokens[0] === 'notrly' )
  {
    if(tokens[0] === 'rly' )
    {
      statement += handleRly(parseContext);
    }
    else {
      statement += handleNotrly(parseContext);
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
function handleWith(parseContext)
{
  expectToken('with', parseContext);

  var tokens = parseContext.tokens;

  // consume: with
  tokens.shift();

  var statement = '(';

  // if the last token ends with & we are chaining calls
  var chained = tokens[tokens.length - 1].slice(-1) === '&';

  while(tokens.length > 0) {

      // look ahead before consuming the tokenst
      if (tokens[0] === 'much') { // lambda functions - thanks @00Davo!
        var anonStatement = handleLambda(parseContext);
        statement += anonStatement;
        return statement;
      }

      var currentToken = tokens.shift();
      if (currentToken === ',' || currentToken === '&') {
        continue;
      }

      // clean up name if foo& or foo, to foo
      if (currentToken.substr(-1) === '&' || currentToken.substr(-1) === ',') {
        currentToken = currentToken.slice(0, -1);
      }

      statement += currentToken;

      // format a:b into a: b
      if (currentToken.substr(-1) === ':') {
        statement += ' ';
      }

      // append , if not last arg or an object literal
      if (tokens.length > 0 && currentToken.substr(-1) !== ':') {
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
function controlFlowParser(parseContext)
{
  var tokens = parseContext.tokens;

  var statement = '';

  while(token = tokens.shift())
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
function handleWow(parseContext)
{
  expectAnyToken(['wow', 'wow&'], parseContext);

  var tokens = parseContext.tokens;
  multiLine = false;

  var chained = tokens[0] === 'wow&';

  // consume: wow/wow&
  tokens.shift();

  var statement = '';

  // add tokens if there's a return value
  if(tokens.length > 0)
  {
    statement += 'return';
    // ideally this will call parsetokens in the future to support return foo();
    while(arg = tokens.shift())
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
function handleMuchLoop(parseContext)
{
  expectToken('much', parseContext);

  var tokens = parseContext.tokens;

  // consume: much
  tokens.shift();

  var statement = 'for ('
  statement += controlFlowParser(parseContext);
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
function handleMany(parseContext)
{
  expectToken('many', parseContext);

  var tokens = parseContext.tokens;

  // consume: many
  tokens.shift();

  var statement = 'while (';
  statement += controlFlowParser(parseContext);
  statement += ') {\n';

  return statement;
}

/**
 * Determines appropriate way to invoke a function whether it has args or not
 * @param functionName the name of the function
 * @param tokens the set of tokens remaining, if the given tokens does not begin with a `with` token a syntax error will be thrown
 * @param allowedSyntax a description of the allowed syntax to invoke the function (in case the syntax is incorrect)
 */
function functionInvocation(functionName, parseContext, allowedSyntax)
{
  var tokens = parseContext.tokens;

  // no more args
  if(tokens.length < 1)
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
  if (tokens[0] !== 'with')
  {
    throw new Error(`Invalid parse state! Expected: 'with' but got: '${tokens[0]}' from chain: [${tokens}]. Allowed construct: ${allowedSyntax}`);
  }

  return functionName + handleWith(parseContext);
}

/**
 * Handles invoking a function:
 * plz <function_name> [with <args>]
 *
 * Produces:
 *  plz function_name([args])
 */
function handlePlz(parseContext)
{
  expectAnyToken(['plz', '.plz'], parseContext);

  var tokens = parseContext.tokens;

  // consume: plz/.plz
  var invocation = tokens.shift();

  var statement = '';
  // if it's a .plz we're chaning a call so append the .
  if(invocation.charAt(0) === '.')
  {
    statement += '.';
  }

  var functionName = tokens.shift();

  // check if function invocation is special name
  if(functionName === 'console.loge')
  {
    functionName = functionName.slice(0, -1);
  }

  statement += functionInvocation(functionName, parseContext, 'plz|.plz <function_name> [with <args>]');
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
function handleDose(parseContext)
{
  var tokens = parseContext.tokens;

  if(tokens[0] !== 'dose' && tokens[1] !== 'dose')
  {
    throw new Error(`Invalid parse state! Expected 'dose' in either 'x dose y' or 'dose y' but got chain: [${tokens}]`);
  }

  var objectName = '';

  // if dose is the first token, we're chaining a previous call
  if(tokens[1] === 'dose')
  {
    // object dose func
    objectName = tokens.shift();
  }

  // consume: dose
  tokens.shift();

  var statement = objectName + '.';
  var functionName = tokens.shift();

  // check if function invocation is special name
  if(functionName === 'loge' )
  {
    // only replace if objectName is console
    if(objectName === 'console')
    {
      functionName = functionName.slice(0, -1);
    }
  }

  statement += functionInvocation(functionName, parseContext, '[<object>] dose <function_name> [with <args>]');
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
function handleIncrementDecrement(parseContext)
{
  if(!containsIncrementDecrement(parseContext))
  {
    throw new Error(`Invalid parse state! Expected an operator from: ${incrementDecrementOps} in either '<identifier> operator' or 'operator <identifer>' but got chain: [${tokens}]`);
  }

  var tokens = parseContext.tokens;

  // prefix
  if(unaryOps.hasOwnProperty(tokens[0]))
  {
    return unaryOps[tokens.shift()] + tokens.shift()
  }

  // postfix
  return tokens.shift() + unaryOps[tokens.shift()]
}

var replacements = {};
replacements['dogeument']='document'
replacements['windoge']='window'

module.exports = function parse (line) {

    var tokens = line.match(/'[^']+'|\S+/g);

    if (tokens === null) return line + '\n';

    var parseContext = {
      input: line,
      // leave original tokens to throw better syntax errors
      inputTokens: tokens.slice(),
      tokens: tokens
    };

    var statement = '';

    // if processing multi-comment
    if(multiComment)
    {
      // consume tokens until we encounter loud
      if(tokens[0] !== 'loud')
      {
        return line + '\n';
      }
      // else must be loud
      return handleLoud(parseContext);
    }

    // pre-process tokens and swap replacements
    for(i = 0; i < tokens.length; i ++)
    {
      var testToken = tokens[i];

      // if we see a shh, skip since everything should be preserved
      if(testToken === 'shh')
      {
        break;
      }

      Object.keys(replacements).forEach(function(key) {

        if(testToken === key)
        {
          tokens[i] = replacements[key];
        }

        if(testToken.startsWith(key+'.'))
        {
          tokens[i] = testToken.replace(key+'.', replacements[key]+'.');
        }
      });
    }

    // not dogescript, such javascript
    if ( !isDogescriptSource(parseContext) )
    {
      return joinTokens(parseContext.tokens) + '\n';
    }

    // trained use strict
    if (tokens[0] === 'trained') {
      // consume: trained
      tokens.shift();
      return '"use strict";\n';
    }

    // such function
    if (tokens[0] === 'such') {
        return handleSuch(parseContext);
    }

    if ( tokens[0] === 'wow' || tokens[0] === 'wow&' )
    {
      return handleWow(parseContext);
    }

    // plz execute function
    if(tokens[0] === 'plz' || tokens[0] === '.plz')
    {
      return handlePlz(parseContext);
    }
    // obj dose function
    if(tokens[0] === 'dose' || tokens[1] === 'dose')
    {
      return handleDose(parseContext);
    }

    // very new variable
    if (tokens[0] === 'very') {
      // consume: very
      tokens.shift();

      statement += 'var ' + tokens.shift() + ' = ';

      // consume:is/as
      tokens.shift();

      if (tokens[0] === 'new') {
        statement += handleNew(parseContext);
        return statement;
      }

      if (tokens[0] === 'much') {
        var anonStatement = handleLambda(parseContext);
        statement += anonStatement;
        return statement;
      }

      if (tokens[0] === 'obj') {
        statement += '{\n';
        multiLine = true;
        return statement;
      }

      if (tokens.length > 1) {
        if (isDogescriptSource(parseContext)) {
          statement += parse(joinTokens(parseContext.tokens));
          return statement;
        }

        statement += joinTokens(parseContext.tokens);
      }
      else
      {
        statement += tokens.shift();
      }

      statement += ';\n';
      return statement;
    }

    // support any kind of assignment operator
    if(assignOps.hasOwnProperty(tokens[1]))
    {
      statement += tokens.shift() + assignOps[tokens.shift()];

      if (tokens[0] === 'new') {
        statement += handleNew(parseContext);
        return statement;
      }

      if(tokens.length > 1) {
        // this will eventually call parsetokens
        statement += parse(joinTokens(parseContext.tokens));
      }
      else {
        statement += tokens.shift() + ';\n';
      }

      return statement;
    }

    // shh comment
    if (tokens[0] === 'shh') {
      return handleShh(parseContext);
    }

    // quiet start multi-line comment
    if (tokens[0] === 'quiet') {
      return handleQuiet(parseContext);
    }

    // rly if
    if (tokens[0] === 'rly') {
      return handleRly(parseContext);
    }

    // ntrly if
    if (tokens[0] === 'notrly')
    {
      return handleNotrly(parseContext);
    }

    // but else
    if (tokens[0] === 'but') {
      return handleBut(parseContext);
    }

    // many while
    if (tokens[0] === 'many') {
      return  handleMany(parseContext);
    }

    // much for
    if (tokens[0] === 'much') {
      return handleMuchLoop(parseContext);
    }

    // so require
    if (tokens[0] === 'so') {
      return handleSo(parseContext);
    }

    // maybe boolean operator
    if (tokens[0] === 'maybe') {
        // consume: maybe
        tokens.shift();
        return '(!!+Math.round(Math.random()))';
    }

    // standalone increment/decrement
    if(containsIncrementDecrement(parseContext))
    {
      // ignore operators that should have been snagged by control flow elements (removed once control flow consumes tokens)
      if(controlFlowTokens.indexOf(tokens[0]) === -1)
      {
        return handleIncrementDecrement(parseContext);
      }
    }

    if(tokens[0] === 'woof')
    {
      return handleWoof(parseContext);
    }

    if(tokens[0] === 'debooger' || tokens[0] === 'pawse')
    {
      // consume: debooger/pawse
      tokens.shift();
      return 'debugger;'
    }

    return statement;
}
