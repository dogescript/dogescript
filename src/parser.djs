so ./binaryOperators as binaryOperators

quiet
	JavaScript's strings are immutable, so they can't be changed.
	As a workaround, I wrap the string in an object, which can be changed.
loud
such wrapContent much content
	rly typeof content is 'string'
		content is obj
			'content': content,
			'originalContent': content
		wow
	wow
wow content

such unwrapContent much content
	rly typeof content is 'object'
		content is content.content
	wow
wow content

such genContextInfo much content
	very overallOffset is content.originalContent.length - content.content.length 
	very previousContent is content.originalContent dose substring with 0 overallOffset
	very previousLines is previousContent dose split with '\n'
	very lineNumber is previousLines.length
	very columnNumber is previousLines[previousLines.length - 1].length + 1

	very result is '[' + lineNumber + ':' + columnNumber + '] '
	shh console dose loge with result content.content.substring(0, 5)
wow result

such isWhitespace much chr
	very result is false
	rly chr is ' ' or chr is '\n'
		result is true
	wow
wow result

such isInlineWhitespace much chr
	very result is false
	rly chr is ' '
		result is true
	wow
wow result

such takeArgumentEnd much content
	very startAnd is content.content dose startsWith with '&'
	very startThx is content.content dose startsWith with 'thx'
	very startNewline is content.content dose startsWith with '\n'

	very result is true

	rly startAnd
		content.content is content.content dose substring with 1
	but rly startThx
		content.content is content.content dose substring with 3
	but rly startNewline
		shh don't consume newlines here
	but
		result is false
	wow
wow result

such ifSkippedComment much content
	content is plz unwrapContent with content

	very shhStart is content dose startsWith with 'shh'
	very quietStart is content dose startsWith with 'quiet'
	rly shhStart
		very done is false
		many content.length > 0 and !done
			rly content[0] is '\n'
				done is true
			but
				content is content dose substring with 1
			wow
		wow
	but rly quietStart
		very done is false
		many content.length > 0 and !done
			very foundEnd is content dose startsWith with 'loud'
			rly foundEnd
				content is content dose substring with 4
				done is true
			but
				content is content dose substring with 1
			wow
		wow
	wow
wow content

such ifSkippedInline much content 
	content is plz unwrapContent with content
	
	very done is false

	many content.length > 0 and !done
		very result is plz isInlineWhitespace with content[0]
		rly result
			content is content dose substring with 1
		but
			very nextContent is plz ifSkippedComment with content
			rly nextContent not content
				content is nextContent
			but
				done is true
			wow
		wow
	wow
wow content

such ifSkipped much content 
	content is plz unwrapContent with content
	
	very done is false

	many content.length > 0 and !done
		very result is plz isWhitespace with content[0]
		rly result
			content is content dose substring with 1
		but
			very nextContent is plz ifSkippedComment with content
			rly nextContent not content
				content is nextContent
			but
				done is true
			wow
		wow
	wow
wow content

such parseIdentifier much content
	very result is ''
	very done is false
	many !done
		very chr is content.content[0]
		rly chr is ' ' or chr is '\n' or chr is '&'
			done is true
		but
			result += chr
			content.content is content.content dose substring with 1
		wow
		rly content.content.length is 0
			done is true
		wow
	wow
	rly result is 'doge' + 'ument'
		result is 'document'
	but rly result is 'win' + 'doge'
		result is 'window'
	but rly result is ''
		very ctxInfo is plz genContextInfo with content
		very msg is ctxInfo + 'Expected identifier, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow
wow result

such parseString much content
	very ctxInfo is plz genContextInfo with content

	rly content.content[0] not "'"
		very msg is ctxInfo + 'Expected string, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow

	content.content is content.content dose substring with 1

	very result is ''
	very done is false
	many !done
		very chr is content.content[0]
		rly chr is '\\'
			shh TODO add more escape sequences
			result += content.content[1]
			content.content is content.content dose substring with 2
		but rly chr is "'"
			done is true
			content.content is content.content dose substring with 1
		but
			result += chr
			content.content is content.content dose substring with 1
		wow
		rly content.content.length is 0
			very msg is ctxInfo + 'Unterminated string'
			very err is new Error with msg
			throw err
		wow
	wow
wow result

such parseOctalNumber much content
	very ctxInfo is plz genContextInfo with content

	rly content.content[0] not '0'
		very msg is ctxInfo + 'Expected octal number, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow

	content.content is content.content dose substring with 1

	very text is ''
	very done is false
	many !done
		very chr is content.content[0]
		very idx is '01234567' dose indexOf with chr
		rly idx not -1
			text += chr
			content.content is content.content dose substring with 1
		but
			done is true
		wow
	wow

	very result

	rly text is ''
		result is 0
	but
		result is plz parseInt with text 8
	wow
wow result

such parsePossibleArgumentValues much content
	very args is []

	very nextContent is plz ifSkippedInline with content

	very withStart is nextContent dose startsWith with 'with'
	rly withStart
		content.content is nextContent dose substring with 4
		content.content is plz ifSkipped with content
		
		very done is false
		many !done
			very expr is plz parseExpression with content
			args dose push with expr
			nextContent is plz ifSkippedInline with content
			nextContent is plz wrapContent with nextContent

			very foundArgumentEnd is plz takeArgumentEnd with nextContent

			rly foundArgumentEnd
				done is true
			but rly nextContent.content.length is 0
				done is true
			wow
			content.content is nextContent.content
		wow
	wow
wow args

such parseBlockBody much content endOnBut
	very ctxInfo is plz genContextInfo with content

	very statements is []

	very done is false
	many !done
		rly content.content.length is 0
			very msg is ctxInfo + 'Unterminated block'
			very err is new Error with msg
			throw err
		wow

		very wowStart is content.content dose startsWith with 'wow'
		very butStart is content.content dose startsWith with 'but'
		rly wowStart
			content.content is content.content dose substring with 3
			done is true
		but rly butStart and endOnBut
			shh 'but' is not consumed at this point since it's part of the next statement
			done is true
		but
			very statement is plz parseStatement with content
			statements dose push with statement

			content.content is plz ifSkipped with content
		wow
	wow
wow statements

such parseExpression much content
	very content is plz wrapContent with content

	very result

	very plzStart is content.content dose startsWith with 'plz'
	very newStart is content.content dose startsWith with 'new'
	very muchStart is content.content dose startsWith with 'much'
	very stringStart is content.content dose startsWith with '\''
	very octalStart is content.content dose startsWith with '0'
	rly plzStart
		content.content is content.content dose substring with 3
		content.content is plz ifSkipped with content

		very callee is plz parseExpression with content
	
		content.content is plz ifSkippedInline with content
		very args is plz parsePossibleArgumentValues with content

		result is obj
			'type': 'call',
			'function': callee,
			'args': args
		wow
	but rly newStart
		content.content is content.content dose substring with 3
		content.content is plz ifSkipped with content

		very constructor is plz parseExpression with content

		content.content is plz ifSkippedInline with content

		very args is plz parsePossibleArgumentValues with content

		result is obj
			'type': 'constructorCall',
			'constructor': constructor,
			'args': args
		wow
	but rly muchStart
		very ctxInfo is plz genContextInfo with content

		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very args is []

		very done is false
		many !done
			content.content is plz ifSkippedInline with content

			rly content.content.length is 0
				very msg is ctxInfo + 'Unterminated function declaration'
				very err is new Error with msg
				throw err
			wow

			rly content.content[0] is '\n'
				done is true
			but
				very arg is plz parseIdentifier with content
				args dose push with arg
			wow
		wow

		content.content is plz ifSkipped with content

		very statements is plz parseBlockBody with content

		result is obj
			'type': 'functionDeclarationInline',
			'args': args,
			'statements': statements
		wow
	but rly stringStart
		very string is plz parseString with content
		result is obj
			'type': 'string',
			'value': string
		wow
	but rly octalStart
		very value is plz parseOctalNumber with content
		result is obj
			'type': 'number',
			'value': value
		wow
	but
		very ident is plz parseIdentifier with content
		rly ident is 'maybe'
			result is obj
				'type': 'maybe'
			wow
		but
			result is obj
				'type': 'ident',
				'value': ident
			wow
		wow
	wow
	very nextContent is plz ifSkipped with content
	very doseStart is nextContent dose startsWith with 'dose'
	rly doseStart
		content.content is nextContent dose substring with 4
		content.content is plz ifSkipped with content
		very call is plz parseIdentifier with content

		rly ident is 'console' and call is 'loge'
			call is 'log'
		wow

		very args is plz parsePossibleArgumentValues with content

		result is obj
			'type': 'call',
			'function': {
				'type': 'property',
				'object': result,
				'property': call
			},
			'args': args
		wow
		nextContent is plz ifSkipped with content
	wow

	very binaryOperatorKeys is Object dose keys with binaryOperators

	much very i as 0 next i smaller binaryOperatorKeys.length next i more 1
		very key is binaryOperatorKeys[i]
		very info is binaryOperators[key]

		very opStart is nextContent dose startsWith with key
		rly opStart
			content.content is nextContent dose substring with key.length
			content.content is plz ifSkipped with content
			very rhs is plz parseExpression with content

			result is obj
				'type': info.id,
				'a': result,
				'b': rhs
			wow

			nextContent is plz ifSkipped with content
		wow
	wow
wow result

such parseElses much content
	very elses is []

	very done is false

	many !done
		very butStart is content.content dose startsWith with 'but'
		rly butStart
			content.content is content.content dose substring with 3
			content.content is plz ifSkippedInline with content

			very type is 'else'
			very condition

			very butRlyStart is content.content dose startsWith with 'rly'
			very butNotrlyStart is content.content dose startsWith with 'notrly'
			rly butRlyStart
				content.content is content.content dose substring with 3
				type is 'elseif'

				content.content is plz ifSkippedInline with content

				condition is plz parseExpression with content
			but rly butNotrlyStart
				content.content is content.content dose substring with 6
				type is 'elseif'

				content.content is plz ifSkippedInline with content

				condition is plz parseExpression with content
				condition is obj
					'type': 'not',
					'value': condition
				wow
			wow

			content.content is plz ifSkipped with content
			very statements is plz parseBlockBody with content true

			very result is obj
				'type': type,
				'condition': condition,
				'statements': statements
			wow

			elses dose push with result
		but
			
			done is true
		wow
	wow
wow elses

such parseStatement much content
	content is plz wrapContent with content

	very result

	very veryStart is content.content dose startsWith with 'very'
	very trainedStart is content.content dose startsWith with 'trained'
	very soStart is content.content dose startsWith with 'so'
	very suchStart is content.content dose startsWith with 'such'
	very rlyStart is content.content dose startsWith with 'rly'
	very notrlyStart is content.content dose startsWith with 'notrly'
	very butStart is content.content dose startsWith with 'but'
	very pawseStart is content.content dose startsWith with 'pawse'
	very manyStart is content.content dose startsWith with 'many'
	rly veryStart
		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very ident is plz parseIdentifier with content

		result is obj
			'type': 'declaration',
			'ident': ident
		wow
		
		very nextContent is plz ifSkippedInline with content
		very isStart is nextContent dose startsWith with 'is'
		rly isStart
			content.content is nextContent dose substring with 2
			content.content is plz ifSkipped with content

			very expr is plz parseExpression with content

			result.value is expr
		wow
	but rly trainedStart
		content.content is content.content dose substring with 7

		result is obj
			'type': 'trained'
		wow
	but rly pawseStart
		content.content is content.content dose substring with 5

		result is obj
			'type': 'debugger'
		wow
	but rly soStart
		content.content is content.content dose substring with 2
		content.content is plz ifSkipped with content

		very importPath is plz parseIdentifier with content

		result is obj
			'type': 'import',
			'path': importPath
		wow

		very nextContent is plz ifSkippedInline with content

		very asStart is nextContent dose startsWith with 'as'
		rly asStart
			content.content is nextContent dose substring with 2
			content.content is plz ifSkipped with content

			very ident is plz parseIdentifier with content

			result.identifier is ident
		wow
	but rly suchStart
		very ctxInfo is plz genContextInfo with content

		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very ident is plz parseIdentifier with content
		very args is []

		very nextContent is plz ifSkippedInline with content
		very muchStart is nextContent dose startsWith with 'much'
		rly muchStart
			content.content is nextContent dose substring with 4

			very done is false
			many !done
				content.content is plz ifSkippedInline with content

				rly content.content.length is 0
					very msg is ctxInfo + 'Unterminated function declaration'
					very err is new Error with msg
					throw err
				wow

				rly content.content[0] is '\n'
					done is true
				but
					very arg is plz parseIdentifier with content
					args dose push with arg
				wow
			wow
		wow
		content.content is plz ifSkipped with content

		very statements is plz parseBlockBody with content

		result is obj
			'type': 'functionDeclaration',
			'identifier': ident,
			'args': args,
			'statements': statements
		wow
	but rly rlyStart or notrlyStart
		rly notrlyStart
			content.content is content.content dose substring with 6
		but
			content.content is content.content dose substring with 3
		wow

		content.content is plz ifSkipped with content

		very condition is plz parseExpression with content

		rly notrlyStart
			condition is obj
				'type': 'not',
				'value': condition
			wow
		wow

		content.content is plz ifSkipped with content
		very statements is plz parseBlockBody with content true

		very elses is plz parseElses with content

		result is obj
			'type': 'if',
			'condition': condition,
			'statements': statements,
			'elses': elses
		wow
	but rly manyStart
		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very condition is plz parseExpression with content

		content.content is plz ifSkipped with content
		very statements is plz parseBlockBody with content
		
		result is obj
			'type': 'while',
			'condition': condition,
			'statements': statements
		wow
	but
		result is plz parseExpression with content
		rly result.type is '==='
			shh We have an ambiguity between equality checks and variable assignment, so we assume the latter if it's a statement
			result is obj
				'type': 'assignment',
				'target': result.a,
				'value': result.b
			wow
		wow
	wow
wow result

such parseFile much content
	content is plz wrapContent with content
	
	very result is obj
		'type': 'file',
		'statements': []
	wow

	content.content is plz ifSkipped with content

	many content.content.length > 0
		very statement is plz parseStatement with content
		result.statements dose push with statement

		content.content is plz ifSkipped with content
	wow
wow result

module.exports.parseExpression is parseExpression
module.exports.parseStatement is parseStatement
module.exports.parseFile is parseFile
