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
		result is fn + '()'
	but
		very err is new Error with 'Unrecognized node type'
		throw err
	wow
wow result

module.exports is toJS
