such toJS much ast
	very result
	rly ast.type is 'ident'
		result is ast.value
	but rly ast.type is 'maybe'
		result is '(!Math.round(Math.random()))'
	but rly ast.type is 'property'
		very object is plz toJS with ast.object
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
	but rly ast.type is 'declaration'
		result is 'let ' + ast.ident
		rly ast.value
			very value is plz toJS with ast.value
			result += ' = ' + value
		wow
	but rly ast.type is 'trained'
		result is '"use strict"'
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
		result is ''
		ast.statements dose forEach with much statement idx
			rly idx bigger 0
				result += '\n';
			wow
			very statementJS is plz toJS with statement
			result += statementJS
			result += ';'
		wow&
	but
		very err is new Error with 'Unrecognized node type'
		throw err
	wow
wow result

module.exports is toJS
