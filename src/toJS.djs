so ./binaryOperators as binaryOperators

very SIMPLE_BINARY_OPS is new Array with '<' '>' '<=' '>=' 'instanceof'

such statementsToJS much statements
	very result is ''
	statements dose forEach with much statement idx
		rly idx bigger 0
			result += '\n';
		wow
		very statementJS is plz toJS with statement
		result += statementJS
		rly statement.type not 'functionDeclaration' and statement.type not 'if' and statement.type not 'while' and statement.type not 'classDeclaration'
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
	but rly ast.type is 'number'
		result is ast.value dose toString
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
	but rly ast.type is 'declaration'
		result is 'let ' + ast.ident
		rly ast.value
			very value is plz toJS with ast.value
			result += ' = ' + value
		wow
	but rly ast.type is 'assignment'
		very target is plz toJS with ast.target
		very value is plz toJS with ast.value
		result is target + ' = ' + value
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
		result is 'function'
		rly ast.identifier
			result more ' ' + ast.identifier
		wow

		result more '('
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
	but rly ast.type is 'while'
		result is 'while ('
		very condition is plz toJS with ast.condition
		result += condition += ') {'

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
	but rly ast.type is 'return'
		result is 'return'
		rly ast.value
			very value is plz toJS with ast.value
			result more ' '
			result more value
		wow
	but rly ast.type is 'break'
		result is 'break'
	but rly ast.type is 'typeof'
		result is '(typeof '
		very value is plz toJS with ast.value
		result more value
		result more ')'
	but rly ast.type is 'await'
		result is '(await '
		very value is plz toJS with ast.value
		result more value
		result more ')'
	but rly ast.type is 'prefixIncrement'
		result is '(++'
		very value is plz toJS with ast.value
		result more value
		result more ')'
	but rly ast.type is 'prefixDecrement'
		result is '(--'
		very value is plz toJS with ast.value
		result more value
		result more ')'
	but rly ast.type is 'methodDeclaration'
		result is ast.identifier + '('
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
	but rly ast.type is 'classExpression'
		result is 'class {'
		very innerResult is ''
		much very i as 0 next i smaller ast.elements.length next i more 1
			innerResult more '\n'
			very value is plz toJS with ast.elements[i]
			innerResult more value
		wow
		innerResult is plz indent with innerResult
		result more innerResult
		result more '\n}'
	but rly ast.type is 'classDeclaration'
		result is 'class ' + ast.identifier + ' {'
		very innerResult is ''
		much very i as 0 next i smaller ast.elements.length next i more 1
			innerResult more '\n'
			very value is plz toJS with ast.elements[i]
			innerResult more value
		wow
		innerResult is plz indent with innerResult
		result more innerResult
		result more '\n}'
	but rly ast.type is 'export'
		result is 'module.exports'
		rly ast.identifier
			result more '.'
			result more ast.identifier
		wow
		result more ' = '
		very value is plz toJS with ast.value
		result more value
	but
		very success is false

		much very i as 0 next i smaller SIMPLE_BINARY_OPS.length next i more 1
			very id = SIMPLE_BINARY_OPS[i]

			rly id is ast.type
				very a is plz toJS with ast.a true
				very b is plz toJS with ast.b true
				result is a + ' ' + id + ' ' + b

				success is true
				bork
			wow
		wow

		very binaryOperatorValues is Object dose values with binaryOperators
		much very i as 0 next i smaller binaryOperatorValues.length next i more 1
			very info is binaryOperatorValues[i]

			rly info.id is ast.type
				very a is plz toJS with ast.a true
				very b is plz toJS with ast.b true
				result is a + ' ' + info.output + ' ' + b

				success is true
				break
			wow
		wow

		rly !success
			very msg is 'Unrecognized node type: ' + ast.type
			very err is new Error with msg
			throw err
		wow
	wow
wow result

module.exports is toJS
