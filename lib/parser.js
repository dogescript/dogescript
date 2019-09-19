var tokenizer = require('./tokenizer');

var tokenUtils = require('./util/tokenUtils');

var classHandlers = require('./handlers/classHandlers');
var functionHandlers = require('./handlers/functionHandlers');
var moduleHandlers = require('./handlers/moduleHandlers');

var parserState = require('./parserState');
const StateEnum = parserState.StateEnum

var validOperators = {
    'is': ' === ',
    'not': ' !== ',
    'and':  ' && ',
    'or':  ' || ',
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
  'more': '+=',
  'less': '-=',
  'lots': '*=',
  'few' : '/=',
  'is' : '=',
  'as' : '='
}

var unaryOps = {
  'bigify': '++',
  'smallify': '--'
}

var binaryOperators = {
  'bigger': '>',
  'biggerish': '>=',
  'smaller': '<',
  'smallerish': '<=',
  'and': '&&',
  'or': '||',
  'not': '!=='
}


// giv can probably be applied as a binary operator since it's a simple transform
var propertyOperators = [ 'giv', 'levl' ]

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
    'woof',
    'obj', // can be handled as top-level token
    'giv',
    'levl',
    'next',
    'amaze',
    'classy',
    'maker',
    'grows',
    'git',
    'sit',
    'stay'
];

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
  if ( tokens.some(isAssignmentOperator) )
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
  if (parserState.hasState(StateEnum.MULTILINE_COMMENT) && tokens[0] === 'loud' )
  {
    return true;
  }

  // closing a multi-line object creation
  if ( parserState.hasState(StateEnum.OBJECT) && tokens[0] === 'wow' )
  {
    return true;
  }

  // binary operation anywhere
  if(tokens.some(isBinaryOperator))
  {
    return true;
  }

  // something uses a property accessor
  if(tokens.some(isPropertyOperator))
  {
    return true;
  }

  // check if next is anywhere in the stack
  if(tokens.some(function(token) { return token === 'next' }))
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
 * Determines whether it's appropriate or not to close a statement with a ';'.
 */
function shouldCloseStatement(parseContext, statement)
{
  // there's more to parse
  if(parseContext.tokens.length > 0)
  {
    return false;
  }

  // don't append an extra ';' if the statement can be considered already closed
  if(statement.trim().endsWith(";"))
  {
    return false;
  }

  // when we multi chain call on the next line we can't append a ';'
  if(statement.trim().endsWith(")"))
  {
    return false;
  }

  // if we're opening a json block we have more statement
  if(statement.trim().endsWith("{"))
  {
    return false;
  }

  // if we're in multiline mode, the property:value assignments should not have a ';'
  return !parserState.hasState(StateEnum.OBJECT);
}

/**
 * Determines whether the token is any of the supported binary operators
 */
function isBinaryOperator(token)
{
  return binaryOperators.hasOwnProperty(token);
}

/**
 * Determins whether the token is a property accessor token
 */
function isPropertyOperator(token)
{
  return propertyOperators.includes(token);
}

/**
 * Determines whether the token is an assignment token
 */
function isAssignmentOperator(token)
{
  return assignOps.hasOwnProperty(token);
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
  tokenUtils.expectToken('shh', parseContext);

  var tokens = parseContext.tokens;

  // consume: shh
  tokens.shift();

  var statement = '// ';

  // preserve any spacing after 'shh '
  var input = parseContext.input;
  var shhLocation = input.indexOf("shh ");
  var commentText = input.substring(shhLocation+4);
  statement += commentText;
  statement += '\n';

  // consume tokens so we don't reparse
  parseContext.tokens = [];

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
  tokenUtils.expectToken('quiet', parseContext);

  var tokens = parseContext.tokens;

   // consume: quiet
   tokens.shift();

   parserState.pushState(StateEnum.MULTILINE_COMMENT);

   var statement = '/*';
   statement += tokenUtils.joinTokens(parseContext.tokens);
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
  tokenUtils.expectToken('loud', parseContext);

  var tokens = parseContext.tokens;

  if(!parserState.hasState(StateEnum.MULTILINE_COMMENT))
  {
    throw new Error("Unparseable syntax! Encountered: 'loud' without first seeing 'quiet'");
  }

  // consume: loud
  tokens.shift();

  // Remove multicomment state
  parserState.popState();

  var statement = '*/';
  statement += tokenUtils.joinTokens(parseContext.tokens);
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
  tokenUtils.expectToken('new', parseContext);

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
  tokenUtils.expectToken('rly', parseContext);

  var tokens = parseContext.tokens;

  // consume: rly
  tokens.shift();

  var statement = 'if ('
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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
  tokenUtils.expectToken('notrly', parseContext);

  var tokens = parseContext.tokens;

  // consume: notrly
  tokens.shift();

  var statement = 'if (!';
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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
  tokenUtils.expectToken('but', parseContext);

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
  tokenUtils.expectToken('with', parseContext);

  var tokens = parseContext.tokens;

  // consume: with
  tokens.shift();

  if (tokens.length < 1) {
    throw new SyntaxError(`Expected arguments but got nothing. Allowed construct: with [args]. ${parseInfo(parseContext)}`);
  }

  var statement = '(';

  // if the last token ends with & we are chaining calls
  var chained = tokens[tokens.length - 1].slice(-1) === '&';
  var chainedSameLine = false;

  while(tokens.length > 0) {

      // look ahead before consuming the tokens
      if (tokens[0] === 'much') { // lambda functions - thanks @00Davo!
        var anonStatement = functionHandlers.handleLambda(parseContext);
        statement += anonStatement;
        return statement;
      }

      var currentToken = tokens.shift();
      if (currentToken === ',' || currentToken === '&') {
        continue;
      }

      // we are chaining the call
      if( currentToken === 'thx')
      {
        chainedSameLine = true;
        // exit and return
        break;
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

  if(chainedSameLine)
  {
    statement += ')';
  }
  else if (chained)
  {
    statement += ')\n';
  }
  else
  {
    statement += ');\n';
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
  tokenUtils.expectAnyToken(['wow', 'wow&'], parseContext);

  var tokens = parseContext.tokens;
  // turn off multiline declaration
  if(parserState.hasState(StateEnum.OBJECT))
  {
    parserState.popState();
  }

  var chained = tokens[0] === 'wow&';

  // consume: wow/wow&
  tokens.shift();

  var statement = '';

  // add tokens if there's a return value
  if(tokens.length > 0)
  {
    statement += 'return';
    let arg;
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
  tokenUtils.expectToken('much', parseContext);

  var tokens = parseContext.tokens;

  // consume: much
  tokens.shift();

  var statement = 'for ('
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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
  tokenUtils.expectToken('many', parseContext);

  var tokens = parseContext.tokens;

  // consume: many
  tokens.shift();

  var statement = 'while (';
  parserState.pushState(StateEnum.CONTROL_FLOW);
  statement += parseStatements(parseContext);
  parserState.popState();
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

  // chaining a call with the use of thx
  if( tokens[0] === 'thx')
  {
    // consume: thx
    tokens.shift();
    return functionName +'()';
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
  tokenUtils.expectAnyToken(['plz', '.plz'], parseContext);

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

/**
 * Handles variable declaration:
 *  very <variable> is <value>
 *
 * Produces:
 *  var <variable> = <value>;
 */
function handleVery(parseContext) {
  tokenUtils.expectToken('very', parseContext);

  var tokens = parseContext.tokens;

  // consume: very
  tokens.shift();

  var statement = 'var ' + tokens.shift() + ' = ';

  // consume:is/as
  tokens.shift();

  if (tokens[0] === 'new') {
    statement += handleNew(parseContext);
    return statement;
  }

  if (tokens[0] === 'much') {
    var anonStatement = functionHandlers.handleLambda(parseContext);
    statement += anonStatement;
    return statement;
  }

  if (tokens[0] === 'obj') {
    // consume obj
    tokens.shift();
    statement += '{\n';
    parserState.pushState(StateEnum.OBJECT);
    return statement;
  }

  // the condition check below needs fixing so we can resolve this with just parseStatement
  if (tokens[0] === 'classy') {
    statement += classHandlers.handleClass(parseContext);
    return statement;
  }

  if (tokens.length > 1) {
    statement += parseStatement(parseContext);

    if(!shouldCloseStatement(parseContext, statement))
    {
      return statement;
    }
  }
  else
  {
    statement += tokens.shift();
  }

  statement += ';\n';
  return statement;
}

/**
 * Handles property accession with an index:
 *  <object> levl <key>
 *
 * Produces:
 *  object[key];
 */
function handleLevl(parseContext)
{
  tokenUtils.expectToken('levl', parseContext);

  var tokens = parseContext.tokens;

  // consume levl
  tokens.shift();

  // there should be a next token
  if (tokens.length < 1) {
    throw new SyntaxError(`Expected argument but got nothing. Allowed construct: obj levl [arg]. ${parseInfo(parseContext)}`);
  }

  return `[${tokens.shift()}]`;
}

/**
 * Handles explicit return:
 *  amaze <expression>
 *
 * Produces:
 *  return <expression>;
 */
function handleAmaze(parseContext) {
  tokenUtils.expectToken('amaze', parseContext);

  // consume: amaze
  parseContext.tokens.shift();

  return "return " + returnStatements(parseContext);
}

/**
 * Creates the statement needed when declaring arguments.
 *
 * Given: [a, b, c]
 *
 * Produces:
 * ' (a, b, c) { \n'
 */
function declareArguments(parseContext) {
  var tokens = parseContext.tokens;

  var statement = ' (';
  let arg;
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
 * Appends statements from the parse context into a single line
 */
function returnStatements(parseContext)
{
  var statement = parseStatements(parseContext);
  if(shouldCloseStatement(parseContext, statement))
  {
    statement += ';\n';
  }

  return statement;
}

function parseStatement(parseContext) {

  var tokens = parseContext.tokens;

  // if processing multi-comment
  if(parserState.hasState(StateEnum.MULTILINE_COMMENT))
  {
    // consume tokens until we encounter loud
    if(tokens[0] !== 'loud')
    {
      // clear out tokens
      parseContext.tokens = [];
      return parseContext.input + '\n';
    }
    // else must be loud
    return handleLoud(parseContext);
  }

  // not dogescript, such javascript
  if ( !isDogescriptSource(parseContext) )
  {
    return tokenUtils.joinTokens(tokens) + '\n';
  }

  // trained use strict
  if (tokens[0] === 'trained') {
    // consume: trained
    tokens.shift();
    return '"use strict";\n';
  }

  // such function
  if (tokens[0] === 'such') {
      return functionHandlers.handleSuch(parseContext);
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
    return handleVery(parseContext);
  }

  // only applicable to disambiguate during control flow parsing
  if ( parserState.hasState(StateEnum.CONTROL_FLOW) )
  {
    // convert to supported operator / otherwise fall thorugh
    // TODO remove operators as they become supported
    if(validOperators.hasOwnProperty(tokens[0]))
    {
      return validOperators[tokens.shift()];
    }
  }

  // support any kind of assignment operator
  if(assignOps.hasOwnProperty(tokens[0]))
  {
    var statement = assignOps[tokens.shift()];

    if (tokens[0] === 'new') {
      statement += handleNew(parseContext);
      return statement;
    }

    statement += parseStatement(parseContext);

    if(shouldCloseStatement(parseContext, statement))
    {
      statement += ';\n';
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
    return moduleHandlers.handleSo(parseContext);
  }

  // maybe boolean operator
  if (tokens[0] === 'maybe') {
      // consume: maybe
      tokens.shift();
      return '(!!+Math.round(Math.random()))';
  }

  if (tokens[0] === 'next') {
    // consume next
    tokens.shift();
    return ';';
  }

  // standalone increment/decrement
  if(containsIncrementDecrement(parseContext))
  {
    return handleIncrementDecrement(parseContext);
  }

  if(tokens[0] === 'woof')
  {
    return moduleHandlers.handleWoof(parseContext);
  }

  if(tokens[0] === 'debooger' || tokens[0] === 'pawse')
  {
    // consume: debooger/pawse
    tokens.shift();
    return 'debugger;'
  }

  if (tokens[0] === 'obj') {
    // consume obj
    tokens.shift();
    parserState.pushState(StateEnum.OBJECT);
    return '{\n';
  }

  if (isBinaryOperator(tokens[0]))
  {
    var statement = binaryOperators[tokens.shift()];
    if(tokens.length > 0)
    {
      statement += ' ';
    }
    return statement;
  }

  if (tokens[0] === 'giv') {
    // consume giv
    tokens.shift();
    return '.';
  }

  if (tokens[0] === 'levl') {
    return handleLevl(parseContext);
  }

  if (tokens[0] === 'amaze') {
    return handleAmaze(parseContext);
  }

  if (tokens[0] === 'classy') {
    return classHandlers.handleClass(parseContext);
  }

  if (tokens[0] === 'maker') {
    return classHandlers.handleMaker(parseContext);
  }

  if (tokens[0] === 'git') {
    return classHandlers.handleGit(parseContext);
  }

  if (tokens[0] === 'sit') {
    return classHandlers.handleSit(parseContext);
  }

  if (tokens[0] === 'stay') {
    return classHandlers.handleStay(parseContext);
  }

  var statement = tokens.shift();
  // if there's more tokens, split them by a ' ' similar to how tokenUtils.joinTokens would work
  if(tokens.length > 0)
  {
    statement += ' ';
  }
  return statement;
}

/**
 * Consumes every token in the parseContext, appending each found statement and returning all statements found.
 */
function parseStatements(parseContext)
{
  var statements = '';

  while(parseContext.tokens.length > 0)
  {
    statements += parseStatement(parseContext);
  }

  return statements;
}

var replacements = {};
replacements['dogeument']='document'
replacements['windoge']='window'
replacements['dis']='this'

module.exports = function parse (line) {

    var tokens = tokenizer.tokenize(line);

    if (tokens.length == 0)
    {
      return line + '\n';
    }

    var parseContext = {
      input: line,
      // leave original tokens to throw better syntax errors
      inputTokens: tokens.slice(),
      tokens: tokens
    };

    // pre-process tokens and swap replacements
    for(let i = 0; i < tokens.length; i ++)
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

   return parseStatements(parseContext);
}
