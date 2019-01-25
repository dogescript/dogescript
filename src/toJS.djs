such statementsToJS much statements
	very result is ''
	statements dose forEach with much statement idx
		rly idx bigger 0
			result += '\n';
		wow
		very statementJS is plz toJS with statement
		result += statementJS
		rly statement.type not 'functionDeclaration' and statement.type not 'if'
			result += ';'
		wow
	wow&
wow result

such indent much content
	very result is content dose replace with /\n/g '\n    '
wow result

such toJS much ast wrapFlag
	very result
	rly ast.type is 'ident'
		result is ast.value
	but rly ast.type is 'maybe'
		result is '!Math.round(Math.random())'
		rly wrapFlag
			result is '(' + result + ')'
		wow
	but rly ast.type is 'string'
		result is JSON dose stringify with ast.value
	but rly ast.type is 'property'
		very object is plz toJS with ast.object true
		result is object + '.' + ast.property
	but rly ast.type is 'call'
		very fn is plz toJS with ast.function
		result is fn + '('
		ast.args dose forEach with much arg idx
			rly idx bigger 0
				result += ', '
			wow
			very argJS is plz toJS with arg
			result += argJS
		wow&
		result += ')'
	but rly ast.type is 'constructorCall'
		very constructor is plz toJS with ast.constructor
		result is 'new ' + constructor + '('
		ast.args dose forEach with much arg idx
			rly idx bigger 0
				result += ', '
			wow
			very argJS is plz toJS with arg
			result += argJS
		wow&
		result += ')'
	but rly ast.type is 'not'
		very value is plz toJS with ast.value true
		result is '!' + value
	but rly ast.type is '==='
		very a is plz toJS with ast.a true
		very b is plz toJS with ast.b true
		result is a + ' === ' + b
	but rly ast.type is 'declaration'
		result is 'let ' + ast.ident
		rly ast.value
			very value is plz toJS with ast.value
			result += ' = ' + value
		wow
	but rly ast.type is 'functionDeclaration'
		result is 'function ' + ast.identifier + '('
		ast.args dose forEach with much arg idx
			rly idx bigger 0
				result += ', '
			wow
			result += arg
		wow&
		result += ') {';
		very body is plz statementsToJS with ast.statements
		body is '\n' + body
		body is plz indent with body
		result += body + '\n}'
	but rly ast.type is 'functionDeclarationInline'
		result is 'function('
		ast.args dose forEach with much arg idx
			rly idx bigger 0
				result += ', '
			wow
			result += arg
		wow&
		result += ') {'

		very body is plz statementsToJS with ast.statements
		body is '\n' + body
		body is plz indent with body
		result += body + '\n}'
	but rly ast.type is 'if'
		result is 'if ('
		very condition is plz toJS with ast.condition
		result += condition + ') {'

		very body is plz statementsToJS with ast.statements
		body is '\n' + body
		body is plz indent with body
		result += body + '\n}'
		ast.elses dose forEach with much statement
			very elseJS is plz toJS with statement
			result += ' ' + elseJS
		wow&
	but rly ast.type is 'else'
		result is 'else {'

		very body is plz statementsToJS with ast.statements
		body is '\n' + body
		body is plz indent with body
		result += body + '\n}'
	but rly ast.type is 'elseif'
		result is 'else if ('
		very condition is plz toJS with ast.condition
		result += condition + ') {'

		very body is plz statementsToJS with ast.statements
		body is '\n' + body
		body is plz indent with body
		result += body + '\n}'
	but rly ast.type is 'trained'
		result is '"use strict"'
	but rly ast.type is 'debugger'
		result is 'debugger'
	but rly ast.type is 'import'
		result is 'const '
		rly ast.identifier
			result += ast.identifier
		but
			result += ast.path
		wow
		result += ' = require(\''
		result += ast.path
		result += '\')'
	but rly ast.type is 'file'
		result is plz statementsToJS with ast.statements
	but
		very err is new Error with 'Unrecognized node type'
		throw err
	wow
wow result

module.exports is toJS
