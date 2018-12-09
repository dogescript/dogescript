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
			}
		}
	wow
wow result

module.exports.parseExpression is parseExpression
