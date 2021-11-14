very RESERVED_IDENTS is new Array with 'amaze' 'and' 'as' 'asink' 'bigger' 'biggerish' 'bigify' 'bigified' 'bork' 'breed' 'but' 'classy' 'debooger' 'dis' 'dose' 'few' 'giv' 'is' 'isa' 'kindof' 'lazy' 'levl' 'less' 'like' 'lots' 'loud' 'maker' 'many' 'maybe' 'more' 'much' 'next' 'not' 'notrly' 'or' 'pawse' 'plz' 'proto' 'quiet' 'rly' 'same' 'shh' 'smaller' 'smallerish' 'smallify' 'smallified' 'so' 'sooper' 'such' 'trained' 'very' 'waite' 'woof' 'wow' 'yelde'

very OCTAL_REGEX is new RegExp with '^[0-7]*$'

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

such cloneContent much content
	very cloned is obj
		'content': content.content,
		'originalContent': content.originalContent
	wow
wow cloned

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

such startsWithWord much content word
	content is plz unwrapContent with content

	very starts is content dose startsWith with word

	rly starts
		very len is word giv length
		content is content dose substring with len

		rly content giv length bigger 0
			very nextChar is content[0]
			very isIC is plz isIdentChar with nextChar
			notrly isIC
				amaze true
			wow
		but
			amaze true
		wow
	wow
wow false

such takeArgumentEnd much content
	very startAnd is content.content dose startsWith with '&'
	very startThx is plz startsWithWord with content.content 'thx'
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

	very shhStart is plz startsWithWord with content 'shh'
	very quietStart is plz startsWithWord with content 'quiet'
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
			very foundEnd is plz startsWithWord with content 'loud'
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

such isIdentChar much chr
	very isAlphabetic is (chr >= 'A' && chr <= 'Z') or (chr >= 'a' && chr <= 'z')
	very isNumeric is chr >= '0' and chr <= '9'
	very isOtherAllowed is chr == '_' or chr == '$'

	very result is isAlphabetic or isNumeric or isOtherAllowed
wow result

such tryParseIdentifier much content
	very tmpContent is content.content

	very result is ''
	very done is false
	many !done
		very chr is tmpContent[0]

		very isAllowed is plz isIdentChar with chr

		rly isAllowed
			result += chr
			tmpContent is tmpContent dose substring with 1
		but
			done is true
		wow
		rly tmpContent.length is 0
			done is true
		wow
	wow

	very reservedIdx is RESERVED_IDENTS dose indexOf with result

	rly reservedIdx biggerish 0
		result is obj
			'found': result,
			'ok': false
		wow
	but rly result is ''
		result is obj
			'found': content.content[0],
			'ok': false
		wow
	but
		rly result is 'doge' + 'ument'
			result is 'document'
		but rly result is 'win' + 'doge'
			result is 'window'
		wow

		content.content is tmpContent

		result is obj
			'found': result,
			'ok': true
		wow
	wow
wow result

such parseIdentifier much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseIdentifier with content

	rly result.ok
		result is result.found
	but
		very msg is startCtxInfo + 'Expected identifier, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseString much content
	very startCtxInfo is plz genContextInfo with content

	rly content.content[0] not "'"
		very msg is startCtxInfo + 'Expected string, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow

	content.content is content.content dose substring with 1

	very result is ''
	very done is false
	many !done
		rly content.content.length is 0
			very msg is startCtxInfo + 'Unterminated string'
			very err is new Error with msg
			throw err
		wow
		very chr is content.content[0]
		rly chr is '\\'
			very nextChr is content.content[1]

			rly nextChr is 'u'
				very numStr is content.content dose substr with 2 6
				very match is OCTAL_REGEX dose exec with numStr
				rly match
					result more String dose fromCodePoint with num
					content.content is content.content dose substring with 8
				but
					very ctxInfo is plz genContextInfo with content
					very msg is ctxInfo + 'Invalid string escape sequence'
					very err is new Error with msg
					throw err
				wow
			but
				rly nextChr === '\\' || nextChr === '/' || nextChr === '\'' || nextChr === '"'
					result += nextChr
				but rly nextChr is 'b'
					result += '\b'
				but rly nextChr is 'f'
					result += '\f'
				but rly nextChr is 'n'
					result += '\n'
				but rly nextChr is 'r'
					result += '\r'
				but rly nextChr is 't'
					result += '\t'
				but
					very ctxInfo is plz genContextInfo with content
					very msg is ctxInfo + 'Invalid string escape sequence'
					very err is new Error with msg
					throw err
				wow
				content.content is content.content dose substring with 2
			wow
		but rly chr is "'"
			done is true
			content.content is content.content dose substring with 1
		but
			result += chr
			content.content is content.content dose substring with 1
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

	very withStart is plz startsWithWord with nextContent 'with'
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
	but
		nextContent is plz wrapContent with nextContent
		very foundArgumentEnd is plz takeArgumentEnd with nextContent
		rly foundArgumentEnd
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

		very wowStart is plz startsWithWord with content.content 'wow'
		very butStart is plz startsWithWord with content.content 'but'
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

such parseClassElement much content
	very ctxInfo is plz genContextInfo with content

	very result

	very suchStart is plz startsWithWord with content.content 'such'
	very asinkStart is plz startsWithWord with content.content 'asink'
	very makerStart is plz startsWithWord with content.content 'maker'
	very gitStart is plz startsWithWord with content.content 'git'
	very sitStart is plz startsWithWord with content.content 'sit'
	very stayStart is plz startsWithWord with content.content 'stay'

	rly suchStart
		result is plz parseFunctionDeclaration with content
		result.type is 'methodDeclaration'
	but rly asinkStart
		very nextContent is content.content dose substring with 5
		nextContent is plz ifSkippedInline with nextContent
		
		stayStart is plz startsWithWord with nextContent 'stay'
		suchStart is plz startsWithWord with nextContent 'such'

		rly stayStart
			result is plz parseFunctionDeclaration with content true
		but rly suchStart
			result is plz parseFunctionDeclaration with content
			result.type is 'methodDeclaration'
		but
			very msg is ctxInfo + 'Expected function declaration, found "asink ' + nextContent[0] + '"'
			very err is new Error with msg
			throw err
		wow
	but rly stayStart
		result is plz parseFunctionDeclaration with content true
	but rly makerStart
		content giv content is content.content dose substring with 5
		content giv content is plz ifSkippedInline with content

		very args is new Array

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
			'type': 'constructor',
			'args': args,
			'statements': statements
		wow
	but rly gitStart
		content giv content is content.content dose substring with '3'
		content giv content is plz ifSkipped with content.content

		very ident is plz parseIdentifier with content

		content giv content is plz ifSkipped with content.content
		very statements is plz parseBlockBody with content

		result is obj
			'type': 'getter',
			'identifier': ident,
			'statements': statements
		wow
	but rly sitStart
		content giv content is content.content dose substring with '3'
		content giv content is plz ifSkipped with content.content

		very ident is plz parseIdentifier with content

		content giv content is plz ifSkipped with content.content

		very muchStart is plz startsWithWord with content.content 'much'
		notrly muchStart
			very msg is ctxInfo + 'Expected "much", found ' + content.content[0]
			very err is new Error with msg
			throw err
		wow

		content giv content is content.content dose substring with 4
		content giv content is plz ifSkipped with content.content

		very newValueIdent is plz parseIdentifier with content

		content giv content is plz ifSkipped with content.content
		very statements is plz parseBlockBody with content

		result is obj
			'type': 'setter',
			'identifier': ident,
			'newValueIdentifier': newValueIdent,
			'statements': statements
		wow
	but
		very msg is ctxInfo + 'Expected class element, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow
wow result

such parseClassBody much content
	very elements is new Array
	
	very done is false
	many !done
		very wowStart is plz startsWithWord with content.content 'wow'
		rly wowStart
			content.content is content.content dose substring with 3
			done is true
		but
			very element is plz parseClassElement with content
			elements dose push with element

			content.content is plz ifSkipped with content
		wow
	wow
wow elements

such tryParseExpression0 much content
	very result

	very parenStart is content.content dose startsWith with '('
	very plzStart is plz startsWithWord with content.content 'plz'
	very newStart is plz startsWithWord with content.content 'new'
	very suchStart is plz startsWithWord with content.content 'such'
	very asinkStart is plz startsWithWord with content.content 'asink'
	very muchStart is plz startsWithWord with content.content 'much'
	very stringStart is content.content dose startsWith with '\''
	very octalStart is content.content dose startsWith with '0'
	very classyStart is plz startsWithWord with content.content 'classy'
	very disStart is plz startsWithWord with content.content 'dis'
	very breedStart is plz startsWithWord with content.content 'breed'
	very objStart is plz startsWithWord with content.content 'obj'
	rly parenStart
		very nextContent is plz cloneContent with content
		nextContent giv content is nextContent.content dose substring with 1
		nextContent giv content is plz ifSkipped with nextContent

		result is plz tryParseExpression with nextContent
		rly result.ok
			content giv content is nextContent giv content
			content giv content is plz ifSkipped with content

			very endParenStart is content.content dose startsWith with ')'
			rly endParenStart
				content giv content is content.content dose substring with 1
			but
				very ctxInfo is plz genContextInfo with content
				very msg is ctxInfo + 'Expected ")", found ' + content.content[0]
				very err is new Error with msg
				throw err
			wow
		wow
	but rly plzStart
		content.content is content.content dose substring with 3
		content.content is plz ifSkipped with content

		very callee is plz parseExpression0 with content
	
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

		very constructor is plz parseExpression0 with content

		content.content is plz ifSkippedInline with content

		very args is plz parsePossibleArgumentValues with content

		result is obj
			'type': 'constructorCall',
			'constructor': constructor,
			'args': args
		wow
	but rly suchStart or asinkStart
		result is plz parseFunctionDeclaration with content
		result.type is 'functionDeclarationInline'
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
	but rly classyStart
		content.content is content.content dose substring with 6
		content.content is plz ifSkippedInline with content.content

		very identifier

		very identRes is plz tryParseIdentifier with content
		rly identRes giv ok
			identifier is identRes giv found

			content.content is plz ifSkippedInline with content.content
		wow

		very growsStart is plz startsWithWord with content.content 'grows'
		very superclass

		rly growsStart
			content.content is content.content dose substring with 5
			content.content is plz ifSkipped with content.content

			superclass is plz parseIdentifier with content
		wow

		content.content is plz ifSkipped with content.content

		very elements is plz parseClassBody with content

		result is obj
			'type': 'classExpression',
			'elements': elements,
			'superclass': superclass,
			'identifier': identifier
		wow
	but rly disStart
		content.content is content.content dose substring with 3
		result is obj
			'type': 'ident',
			'value': 'this'
		wow
	but rly breedStart
		content.content is content.content dose substring with 5
		result is obj
			'type': 'ident',
			'value': 'Symbol'
		wow
		result is obj
			'type': 'property',
			'object': result,
			'property': 'species'
		wow
	but rly objStart
		very startCtxInfo is plz genContextInfo with content

		content.content is content.content dose substring with 3
		content.content is plz ifSkipped with content.content

		very objContent is new Array

		very done is false
		many !done
			rly content.content.length is 0
				very msg is startCtxInfo + 'Unterminated object'
				very err is new Error with msg
				throw err
			wow

			very wowStart is plz startsWithWord with content.content 'wow'
			rly wowStart
				content.content is content.content dose substring with 3
				done is true
			but
				very key

				very stringStart is content.content dose startsWith with '\''
				rly stringStart
					key is plz parseString with content
				but
					very identRes is plz tryParseIdentifier with content
					rly identRes.ok
						key is identRes giv found
					but
						very ctxInfo is plz genContextInfo with content
						very msg is ctxInfo + 'Expected string, identifier, or "wow", found ' + identRes.found
						very err is new Error with msg
						throw err
					wow
				wow

				content.content is plz ifSkipped with content

				very colonStart is content.content dose startsWith with ':'
				notrly colonStart
					very ctxInfo is plz genContextInfo with content
					very msg is startCtxInfo + 'Expected ":", found ' + content.content[0]
					very err is new Error with msg
					throw err
				wow

				content.content is content.content dose substring with 1
				content.content is plz ifSkipped with content

				very value is plz parseExpression with content

				content.content is plz ifSkipped with content

				very commaStart is content.content dose startsWith with ','
				rly commaStart
					shh optional comma, skip

					content.content is content.content dose substring with 1
					content.content is plz ifSkipped with content
				wow

				very newEntry is obj
					'key': key,
					'value': value
				wow

				objContent dose push with newEntry
			wow
		wow

		result is obj
			'type': 'object',
			'content': objContent
		wow
	but
		very identRes is plz tryParseIdentifier with content
		notrly identRes.ok
			result is identRes
		but
			very ident is identRes.found
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
	wow

	rly result.ok same undefined
		result is obj
			'ok': true,
			'expression': result
		wow
	wow
wow result

such tryParseExpression1 much content
	very result
	very innerResult is plz tryParseExpression0 with content
	rly innerResult giv ok
		result is innerResult.expression

		many true
			very nextContent is plz ifSkipped with content

			very doseStart is plz startsWithWord with nextContent 'dose'
			very givStart is plz startsWithWord with nextContent 'giv'
			very levlStart is plz startsWithWord with nextContent 'levl'
			very bigifiedStart is plz startsWithWord with nextContent 'bigified'
			very smallifiedStart is plz startsWithWord with nextContent 'smallified'

			rly doseStart
				content.content is nextContent dose substring with 4
				content.content is plz ifSkipped with content
				very call is plz parseIdentifier with content

				rly result.type is 'ident' and result.value is 'console' and call is 'loge'
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
			but rly givStart
				content.content is nextContent dose substring with 3
				content.content is plz ifSkipped with content
				very child is plz parseIdentifier with content

				rly result.type is 'ident' and result.value is 'console' and child is 'loge'
					child is 'log'
				wow

				result is obj
					'type': 'property',
					'object': result,
					'property': child
				wow
			but rly levlStart
				content.content is nextContent dose substring with 4
				content.content is plz ifSkipped with content

				very index is plz parseExpression0 with content

				result is obj
					'type': 'index',
					'object': result,
					'index': index
				wow
			but rly bigifiedStart
				content.content is nextContent dose substring with 8

				result is obj
					'type': 'postfixIncrement',
					'value': result
				wow
			but rly smallifiedStart
				content.content is nextContent dose substring with 10

				result is obj
					'type': 'postfixDecrement',
					'value': result
				wow
			but
				bork
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression2 much content
	very result

	very kindofStart is plz startsWithWord with content.content 'kindof'
	very waiteStart is plz startsWithWord with content.content 'waite'
	very bigifyStart is plz startsWithWord with content.content 'bigify'
	very smallifyStart is plz startsWithWord with content.content 'smallify'

	rly kindofStart
		content.content is content.content dose substring with 6
		content.content is plz ifSkipped with content.content

		very inner is plz parseExpression2 with content

		result is obj
			'type': 'typeof',
			'value': inner
		wow
		result is obj
			'ok': true,
			'expression': result
		wow
	but rly waiteStart
		content.content is content.content dose substring with 5
		content.content is plz ifSkipped with content.content
		very inner is plz parseExpression2 with content

		result is obj
			'type': 'await',
			'value': inner
		wow
		result is obj
			'ok': true,
			'expression': result
		wow
	but rly bigifyStart
		content.content is content.content dose substring with 6
		content.content is plz ifSkipped with content.content
		very inner is plz parseExpression2 with content

		result is obj
			'type': 'prefixIncrement',
			'value': inner
		wow
		result is obj
			'ok': true,
			'expression': result
		wow
	but rly smallifyStart
		content.content is content.content dose substring with 8
		content.content is plz ifSkipped with content.content
		very inner is plz parseExpression2 with content

		result is obj
			'type': 'prefixDecrement',
			'value': inner
		wow
		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is plz tryParseExpression1 with content
	wow
wow result

such tryParseExpression3 much content
	very OPS is obj
		'*': 'multiplication',
		'/': 'division',
		'%': 'modulo'
	wow

	very result
	very innerResult is plz tryParseExpression2 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is nextContent dose startsWith with key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression2 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression4 much content
	very OPS is obj
		'+': 'addition',
		'-': 'subtraction'
	wow

	very result
	very innerResult is plz tryParseExpression3 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is nextContent dose startsWith with key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression3 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression5 much content
	very OPS is obj
		'bigger': '>',
		'smaller': '<',
		'biggerish': '>=',
		'smallerish': '<=',
		'isa': 'instanceof'
	wow

	very result
	very innerResult is plz tryParseExpression4 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is plz startsWithWord with nextContent key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression4 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression6 much content
	very OPS is obj
		'is': '===',
		'like': '==',
		'same': '===',
		'not': '!=='
	wow

	very result
	very innerResult is plz tryParseExpression5 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is plz startsWithWord with nextContent key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression5 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression7 much content
	very OPS is obj
		'and': 'logicalAnd'
	wow

	very result
	very innerResult is plz tryParseExpression6 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is plz startsWithWord with nextContent key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression7 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression8 much content
	very OPS is obj
		'or': 'logicalOr'
	wow

	very yeldeStart is plz startsWithWord with content.content 'yelde'
	rly yeldeStart
		content giv content is content.content dose substring with 5
		content giv content is plz ifSkipped with content
	wow

	very result
	very innerResult is plz tryParseExpression7 with content
	rly innerResult giv ok
		result is innerResult.expression

		very nextContent is plz ifSkippedInline with content

		very keys is Object dose keys with OPS

		much very i as 0 next i smaller keys.length next i more 1
			very key is keys[i]
			very id is OPS[key]

			very opStart is plz startsWithWord with nextContent key
			rly opStart
				content.content is nextContent dose substring with key.length
				content.content is plz ifSkipped with content
				very rhs is plz parseExpression6 with content

				result is obj
					'type': id,
					'a': result,
					'b': rhs
				wow

				nextContent is plz ifSkipped with content
			wow
		wow

		rly yeldeStart
			result is obj
				'type': 'yield',
				'value': result
			wow
		wow

		result is obj
			'ok': true,
			'expression': result
		wow
	but
		result is innerResult
	wow
wow result

such tryParseExpression much content
	very result is plz tryParseExpression8 with content
wow result

such parseExpression much content
	very content is plz wrapContent with content

	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression0 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression0 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression0, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression2 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression2 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression2, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression3 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression3 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression3, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression4 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression4 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression4, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression5 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression5 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression5, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression6 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression6 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression6, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseExpression7 much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseExpression7 with content

	rly result.ok
		result is result.expression
	but
		very msg is startCtxInfo + 'Expected expression7, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseElses much content
	very elses is []

	very done is false

	many !done
		very butStart is plz startsWithWord with content.content 'but'
		rly butStart
			content.content is content.content dose substring with 3
			content.content is plz ifSkippedInline with content

			very type is 'else'
			very condition

			very butRlyStart is plz startsWithWord with content.content 'rly'
			very butNotrlyStart is plz startsWithWord with content.content 'notrly'
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

such parseFunctionDeclaration much content isClassStatic
	very isAsync is false
	very isGenerator is false

	very asinkStart is plz startsWithWord with content.content 'asink'
	rly asinkStart
		isAsync is true

		content.content is content.content dose substring with 5
		content.content is plz ifSkipped with content
	wow

	very suchStart is plz startsWithWord with content.content 'such'
	very muchStart is plz startsWithWord with content.content 'much'
	very stayStart is plz startsWithWord with content.content 'stay'

	rly suchStart or stayStart
		rly suchStart and isClassStatic
			very msg is ctxInfo + 'Expected "stay", found "such"'
			very err is new Error with msg
			throw err
		wow

		rly stayStart and !isClassStatic
			very msg is ctxInfo + 'Expected "such", found "stay"'
			very err is new Error with msg
			throw err
		wow

		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very lazyStart is plz startsWithWord with content.content 'lazy'

		rly lazyStart
			isGenerator is true

			content.content is content.content dose substring with 4
			content.content is plz ifSkipped with content
		wow

		very ident is plz parseIdentifier with content
	but rly muchStart
		rly isClassStatic
			very msg is ctxInfo + 'Expected "stay", found "much"'
			very err is new Error with msg
			throw err
		wow
	but
		very msg is ctxInfo + 'Expected function declaration, found ' + content.content[0]
		very err is new Error with msg
		throw err
	wow

	very ctxInfo is plz genContextInfo with content

	very args is []

	very nextContent is plz ifSkippedInline with content
	very muchStart is plz startsWithWord with nextContent 'much'
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

	very result is obj
		'type': 'functionDeclaration',
		'identifier': ident,
		'args': args,
		'statements': statements,
		'async': isAsync,
		'generator': isGenerator
	wow

	very nextContent is plz cloneContent with content
	nextContent giv content is plz ifSkippedInline with nextContent
	very exprResult is plz tryParseExpression with nextContent
	rly exprResult.ok
		result giv returns is exprResult.expression
		content giv content is nextContent giv content
	wow

	rly isClassStatic
		result giv type is 'staticMethodDeclaration'
	wow

	notrly result.identifier
		result giv type is 'functionDeclarationInline'
	wow
wow result

such tryParseInlineStatement much content
	very result

	very veryStart is plz startsWithWord with content.content 'very'
	rly veryStart
		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very ident is plz parseIdentifier with content

		result is obj
			'type': 'declaration',
			'ident': ident
		wow

		very nextContent is plz ifSkippedInline with content
		very isStart is plz startsWithWord with nextContent 'is'
		very asStart is plz startsWithWord with nextContent 'as'
		rly isStart or asStart
			content.content is nextContent dose substring with 2
			content.content is plz ifSkipped with content

			very expr is plz parseExpression with content

			result.value is expr
		wow
	but
		shh first, look for reassignment
		very nextContent is plz cloneContent with content
		very lhsRes is plz tryParseExpression1 with nextContent
		rly lhsRes.ok
			very OPS is obj
				'is': 'assignment',
				'as': 'assignment',
				'more': '+=',
				'less': '-=',
				'lots': '*=',
				'few': '/='
			wow

			nextContent giv content is plz ifSkippedInline with nextContent
			very keys is Object dose keys with OPS

			much very i as 0 next i smaller keys.length next i more 1
				very key is keys[i]
				very id is OPS[key]

				very opStart is plz startsWithWord with nextContent.content key
				rly opStart
					content.content is nextContent.content dose substring with key.length
					content.content is plz ifSkipped with content
					very rhs is plz parseExpression with content

					result is obj
						'type': id,
						'a': lhsRes.expression,
						'b': rhs
					wow
					bork
				wow
			wow
		wow

		notrly result
			result is plz tryParseExpression with content
			rly result.ok
				result is obj
					'ok': true,
					'statement': result.expression
				wow
			wow
		wow
	wow

	rly result.ok same undefined
		result is obj
			'ok': true,
			'statement': result
		wow
	wow
wow result

such parseInlineStatement much content
	very startCtxInfo is plz genContextInfo with content

	very result is plz tryParseInlineStatement with content

	rly result.ok
		result is result.statement
	but
		very msg is startCtxInfo + 'Expected inline statement, found ' + result.found
		very err is new Error with msg
		throw err
	wow
wow result

such parseStatement much content
	content is plz wrapContent with content

	very result

	very trainedStart is plz startsWithWord with content.content 'trained'
	very soStart is plz startsWithWord with content.content 'so'
	very suchStart is plz startsWithWord with content.content 'such'
	very asinkStart is plz startsWithWord with content.content 'asink'
	very rlyStart is plz startsWithWord with content.content 'rly'
	very notrlyStart is plz startsWithWord with content.content 'notrly'
	very butStart is plz startsWithWord with content.content 'but'
	very pawseStart is plz startsWithWord with content.content 'pawse'
	very manyStart is plz startsWithWord with content.content 'many'
	very amazeStart is plz startsWithWord with content.content 'amaze'
	very borkStart is plz startsWithWord with content.content 'bork'
	very classyStart is plz startsWithWord with content.content 'classy'
	very woofStart is plz startsWithWord with content.content 'woof'
	very muchStart is plz startsWithWord with content.content 'much'

	rly trainedStart
		content.content is content.content dose substring with 7

		result is obj
			'type': 'trained'
		wow
	but rly borkStart
		content.content is content.content dose substring with 4

		result is obj
			'type': 'break'
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

		very asStart is plz startsWithWord with nextContent 'as'
		rly asStart
			content.content is nextContent dose substring with 2
			content.content is plz ifSkipped with content

			very ident is plz parseIdentifier with content

			result.identifier is ident
		wow
	but rly suchStart or asinkStart
		result is plz parseFunctionDeclaration with content
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
	but rly amazeStart
		content.content is content.content dose substring with 5
		content.content is plz ifSkippedInline with content
		very exprRes is plz tryParseExpression with content
		rly exprRes.ok
			result is obj
				'type': 'return',
				'value': exprRes.expression
			wow
		but
			result is obj
				'type': 'return'
			wow
		wow
	but rly classyStart
		content.content is content.content dose substring with 6
		content.content is plz ifSkipped with content.content

		very ident is plz parseIdentifier with content

		content.content is plz ifSkippedInline with content.content

		very growsStart is plz startsWithWord with content.content 'grows'
		very superclass

		rly growsStart
			content.content is content.content dose substring with 5
			content.content is plz ifSkipped with content.content

			superclass is plz parseIdentifier with content
		wow

		content.content is plz ifSkipped with content.content

		very elements is plz parseClassBody with content

		result is obj
			'type': 'classDeclaration',
			'elements': elements,
			'identifier': ident,
			'superclass': superclass
		wow
	but rly woofStart
		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very identifier

		shh first check for "be" form

		very subContent is plz cloneContent with content
		very identResult is plz tryParseIdentifier with subContent

		rly identResult giv ok
			subContent.content is plz ifSkippedInline with subContent
			very beStart is plz startsWithWord with subContent.content 'be'
			rly beStart
				subContent.content is subContent.content dose substring with 2
				subContent.content is plz ifSkipped with subContent

				identifier is identResult giv found

				content.content is subContent.content
			wow
		wow

		very value is plz parseExpression with content
		
		result is obj
			'type': 'export',
			'identifier': identifier,
			'value': value
		wow
	but rly muchStart
		shh Could be either a loop or a function expression

		very nextContent is plz cloneContent with content
		nextContent.content is nextContent.content dose substring with 4
		nextContent.content is plz ifSkippedInline with nextContent

		very nextStart is plz startsWithWord with nextContent 'next'
		very initRes1 is plz tryParseInlineStatement with nextContent

		rly initRes1.ok or nextStart
			very initStatements is new Array

			rly initRes1 giv ok
				initStatements dose push with initRes1.statement
			wow

			nextContent.content is plz ifSkippedInline with nextContent
			very commaStart is nextContent.content dose startsWith with ','
			many commaStart
				nextContent.content is nextContent.content dose substring with 1
				nextContent.content is plz ifSkipped with nextContent

				shh at this point it's definitely a loop, so we can fail
				very nextValue is plz parseInlineStatement with nextContent
				initStatements dose push with nextValue

				nextContent.content is plz ifSkipped with nextContent
				commaStart is nextContent.content dose startsWith with ','
			wow

			very nextStart is plz startsWithWord with nextContent.content 'next'
			rly nextStart
				shh commit to consumption
				content giv content is nextContent giv content

				content giv content is content.content dose substring with 4
				content giv content is plz ifSkipped with content.content

				very conditionRes is plz tryParseExpression with content

				content giv content is plz ifSkipped with content.content
				nextStart is plz startsWithWord with content.content 'next'

				notrly nextStart
					very ctxInfo is plz genContextInfo with content
					very msg is ctxInfo + 'Expected "next", found ' + content.content[0]
					very err is new Error with msg
					throw err
				wow

				content giv content is content.content dose substring with 4
				content giv content is plz ifSkippedInline with content.content

				very afterStatementRes is plz tryParseInlineStatement with content
				content giv content is plz ifSkipped with content.content

				very bodyStatements is plz parseBlockBody with content

				very condition
				rly conditionRes giv ok
					condition is conditionRes giv expression
				wow

				very afterStatement
				rly afterStatementRes giv ok
					afterStatement is afterStatementRes giv statement
				wow

				result is obj
					'type': 'for',
					'initStatements': initStatements,
					'condition': condition,
					'afterStatement': afterStatement,
					'bodyStatements': bodyStatements
				wow
			but
				result is plz parseExpression with content
			wow
		but
			result is plz parseExpression with content
		wow
	but
		result is plz parseInlineStatement with content
	wow

	shh console dose loge with 'parseStatement:' result
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
