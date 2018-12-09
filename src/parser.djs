quiet
	JavaScript's strings are immutable, so they can't be changed.
	As a workaround, I wrap the string in an object, which can be changed.
loud
such wrapContent much content
	rly typeof content is 'string'
		content is {'content': content}
	wow
wow content

such unwrapContent much content
	rly typeof content is 'object'
		content is content.content
	wow
wow content

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

such ifSkippedInline much content 
	content is plz unwrapContent with content
	
	very done is false

	many content.length > 0 and !done
		very result is plz isInlineWhitespace with content[0]
		rly result
			content is content dose substring with 1
		but
			done is true
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
			done is true
		wow
	wow
wow content

such parseIdentifier much content
	very content is plz wrapContent with content

	very result is ''
	very done is false
	many !done
		very chr is content.content[0]
		rly chr is ' ' or chr is '\n'
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
	wow
wow result

such parseExpression much content
	very content is plz wrapContent with content

	very result
	very ident is plz parseIdentifier with content
	rly ident is 'maybe'
		result is {'type': 'maybe'}
	but
		result is {
			'type': 'ident',
			'value': ident
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

		result is {
			'type': 'call',
			'function': {
				'type': 'property',
				'object': result,
				'property': call
			},
			'args': []
		}
		
		nextContent is plz ifSkipped with content
		very withStart is nextContent dose startsWith with 'with'
		rly withStart
			content.content is nextContent dose substring with 4
			content.content is plz ifSkipped with content
			
			very done is false
			many !done
				very expr is plz parseExpression with content
				result.args dose push with expr
				nextContent is plz ifSkippedInline with content
				rly nextContent[0] is '&'
					content.content is nextContent dose substring with 1
					done is true
				but rly nextContent[0] is '\n'
					done is true
				but rly nextContent.length is 0
					done is true
				but
					content.content is nextContent
				wow
			wow
		wow
	wow
wow result

such parseStatement much content
	content is plz wrapContent with content

	very result

	very veryStart is content.content dose startsWith with 'very'
	rly veryStart
		content.content is content.content dose substring with 4
		content.content is plz ifSkipped with content

		very ident is plz parseIdentifier with content

		result is {'type': 'declaration','ident': ident}
		
		very nextContent is plz ifSkippedInline with content
		very isStart is nextContent dose startsWith with 'is'
		rly isStart
			content.content is nextContent dose substring with 2
			content.content is plz ifSkipped with content

			very expr is plz parseExpression with content

			result.value is expr
		wow
	but
		result is plz parseExpression with content
	wow
wow result

such parseFile much content
	content is plz wrapContent with content
	
	very result is {'type': 'file','statements': []}

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
