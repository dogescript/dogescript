very RESERVED_IDENTS is new Array with 'amaze' 'and' 'as' 'asink' 'be' 'bigger' 'biggerish' 'bigify' 'bigified' 'bork' 'box' 'breed' 'but' 'catch' 'classy' 'debooger' 'dis' 'dogeument' 'dose' 'few' 'git' 'giv' 'go' 'grows' 'is' 'isa' 'kindof' 'lazy' 'levl' 'less' 'like' 'lots' 'loud' 'maker' 'many' 'maybe' 'more' 'much' 'next' 'new' 'not' 'notrly' 'obj' 'or' 'pawse' 'plz' 'proto' 'quiet' 'rly' 'same' 'shh' 'sit' 'smaller' 'smallerish' 'smallify' 'smallified' 'so' 'sooper' 'stay' 'such' 'throw' 'thx' 'trained' 'typeof' 'very' 'waite' 'with' 'woof' 'wow' 'yelde' 'windoge'

very OCTAL_REGEX is new RegExp with '^[0-7]*$'

such idx much src index
    amaze src levl index
wow

quiet
    JavaScript's strings are immutable, so they can't be changed.
    As a workaround, I wrap the string in an object, which can be changed.
loud
such wrapContent much content
    rly kindof content is 'string'
        content is obj
            'content': content,
            'originalContent': content
        wow
    wow
wow content

such unwrapContent much content
    rly kindof content is 'object'
        content is content giv content
    wow
wow content

such cloneContent much content
    very cloned is obj
        'content': content giv content,
        'originalContent': content giv originalContent
    wow
wow cloned

such shiftContent much content count
    content giv content is content giv content dose substring with count
wow

such idxContent much content index
    content is content giv content
    amaze content levl index
wow

such genContextInfo much content
    very overallOffset is content giv originalContent giv length - content giv content giv length 
    very previousContent is content giv originalContent dose substring with 0 overallOffset
    very previousLines is previousContent dose split with '\n'
    very lineNumber is previousLines giv length

    very lastLineIdx is previousLines giv length - 1
    very columnNumber is previousLines levl lastLineIdx giv length + 1

    very result is '[' + lineNumber + ':' + columnNumber + '] '
    shh console dose loge with result content.content.substring(0, 5)
wow result

such isWhitespace much chr
    very result is false
    shh handle CR and LF
    rly chr is ' ' or chr is '\n' or chr is '\r'
        result is true
    wow
wow result

such isInlineWhitespace much chr
    very result is false
    rly chr is ' ' or chr is '\r'
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
            very nextChar is plz idx with content 0
            very isIC is plz isIdentChar with nextChar
            notrly isIC
                amaze true
            wow
        but
            amaze true
        wow
    wow
wow false

classy IncompleteError grows Error
    maker message
        plz sooper with message

        dis giv name is 'IncompleteError'
    wow
wow

such makeExpectedError much ctxInfo expected found
    very msg is ctxInfo + 'Expected ' + expected
    rly kindof found is 'undefined'
        very err is new IncompleteError with msg
        throw err
    but
        msg more ', found ' + found
        very err is new Error with msg
        throw err
    wow
wow

such takeArgumentEnd much content
    very startAnd is content giv content dose startsWith with '&'
    very startThx is plz startsWithWord with content 'thx'
    very startNewline is content giv content dose startsWith with '\n'

    very result is true

    rly startAnd
        plz shiftContent with content 1
    but rly startThx
        plz shiftContent with content 3
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
        many content giv length bigger 0 and done not true
            rly content levl 0 is '\n'
                done is true
            but
                content is content dose substring with 1
            wow
        wow
    but rly quietStart
        very done is false
        many content giv length bigger 0 and done not true
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

    many content giv length bigger 0 and done not true
        very firstChar is plz idx with content 0
        very result is plz isInlineWhitespace with firstChar
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

    many content giv length bigger 0 and done not true
        very firstChar is plz idx with content 0
        very result is plz isWhitespace with firstChar
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

such mustSkip much content
    very newValue is plz ifSkipped with content

    rly content giv content same newValue and newValue giv length bigger 0
        very ctxInfo is plz genContextInfo with content
        very found is plz idxContent with content 0
        very msg is ctxInfo + 'Expected whitespace, found ' + found
        very err is new Error with msg
        throw err
    wow
wow newValue

such isIdentChar much chr
    very isAlphabeticUppercase is chr biggerish 'A' and chr smallerish 'Z'
    very isAlphabeticLowercase is chr biggerish 'a' and chr smallerish 'z'
    very isNumeric is chr biggerish '0' and chr smallerish '9'
    very isOtherAllowed is chr same '_' or chr same '$'

    very result is isAlphabeticUppercase or isAlphabeticLowercase or isNumeric or isOtherAllowed
wow result

such tryParseIdentifier much content
    very tmpContent is content giv content

    very result is ''
    very done is false
    many done not true
        very chr is plz idx with tmpContent 0

        very isAllowed is plz isIdentChar with chr

        rly isAllowed
            result more chr
            tmpContent is tmpContent dose substring with 1
        but
            done is true
        wow
        rly tmpContent giv length is 0
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
        very found is plz idxContent with content 0

        result is obj
            'found': found,
            'ok': false
        wow
    but
        content giv content is tmpContent

        result is obj
            'found': result,
            'ok': true
        wow
    wow
wow result

such parseIdentifier much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseIdentifier with content

    rly result giv ok
        result is result giv found
    but
        very found is result giv found

        plz makeExpectedError with startCtxInfo 'identifier' found
    wow
wow result

such parseString much content
    very startCtxInfo is plz genContextInfo with content

    very quoteStart is content giv content dose startsWith with '\''
    notrly quoteStart
        very found is plz idxContent with content 0

        plz makeExpectedError with startCtxInfo 'string' found
    wow

    plz shiftContent with content 1

    very result is ''
    very done is false
    many done not true
        rly content giv content giv length is 0
            very msg is startCtxInfo + 'Unterminated string'
            very err is new IncompleteError with msg
            throw err
        wow
        very chr is plz idxContent with content 0
        rly chr is '\\'
            very nextChr is plz idxContent with content 1

            rly nextChr is 'u'
                very numStr is content giv content dose substr with 2 6
                very match is OCTAL_REGEX dose exec with numStr
                rly match
                    very num is plz parseInt with numStr 8
                    result more String dose fromCodePoint with num
                    plz shiftContent with content 8
                but
                    very ctxInfo is plz genContextInfo with content
                    very msg is ctxInfo + 'Invalid string escape sequence'
                    very err is new Error with msg
                    throw err
                wow
            but
                very literal is nextChr same '"' or nextChr same '/' or nextChr same '\'' or nextChr same '\\'
                rly literal
                    result more nextChr
                but rly nextChr is 'b'
                    result more '\b'
                but rly nextChr is 'f'
                    result more '\f'
                but rly nextChr is 'n'
                    result more '\n'
                but rly nextChr is 'r'
                    result more '\r'
                but rly nextChr is 't'
                    result more '\t'
                but
                    very ctxInfo is plz genContextInfo with content
                    very msg is ctxInfo + 'Invalid string escape sequence'
                    very err is new Error with msg
                    throw err
                wow
                plz shiftContent with content 2
            wow
        but rly chr is '\''
            done is true
            plz shiftContent with content 1
        but
            result more chr
            plz shiftContent with content 1
        wow
    wow
wow result

such parseOctalNumber much content
    very ctxInfo is plz genContextInfo with content

    very firstChar is plz idxContent with content 0
    rly firstChar not '0'
        plz makeExpectedError with ctxInfo 'octal number' firstChar
    wow

    plz shiftContent with content 1

    very text is ''
    very done is false
    many done not true
        very chr is plz idxContent with content 0
        very idx is '01234567' dose indexOf with chr
        rly idx not -1
            text more chr
            plz shiftContent with content 1
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
    very args is new Array

    very nextContent is plz ifSkippedInline with content

    very withStart is plz startsWithWord with nextContent 'with'
    rly withStart
        content giv content is nextContent dose substring with 4
        content giv content is plz ifSkipped with content
        
        very done is false
        many done not true
            very expr is plz parseExpression with content
            args dose push with expr
            nextContent is plz ifSkippedInline with content

            very commaStart is nextContent dose startsWith with ','
            rly commaStart
                nextContent is nextContent dose substring with 1
                nextContent is plz ifSkipped with nextContent
            wow

            nextContent is plz wrapContent with nextContent

            very foundArgumentEnd is plz takeArgumentEnd with nextContent

            rly foundArgumentEnd
                done is true
            but rly nextContent giv content giv length is 0
                done is true
            wow
            content giv content is nextContent giv content
        wow
    but
        nextContent is plz wrapContent with nextContent
        very foundArgumentEnd is plz takeArgumentEnd with nextContent
        rly foundArgumentEnd
            content giv content is nextContent giv content
        wow
    wow
wow args

such parseBlockBody much content endOnBut endOnCatch
    very ctxInfo is plz genContextInfo with content

    very statements is new Array

    very done is false
    many done not true
        rly content giv content giv length is 0
            very msg is ctxInfo + 'Unterminated block'
            very err is new IncompleteError with msg
            throw err
        wow

        very wowStart is plz startsWithWord with content 'wow'
        very butStart is plz startsWithWord with content 'but'
        very catchStart is plz startsWithWord with content 'catch'
        rly wowStart
            plz shiftContent with content 3
            done is true
        but rly butStart and endOnBut
            shh 'but' is not consumed at this point since it's part of the next statement
            done is true
        but rly catchStart and endOnCatch
            done is true
        but
            very statement is plz parseStatement with content
            statements dose push with statement

            content giv content is plz mustSkip with content
        wow
    wow
wow statements

such parseClassElement much content
    very ctxInfo is plz genContextInfo with content

    very result

    very suchStart is plz startsWithWord with content 'such'
    very asinkStart is plz startsWithWord with content 'asink'
    very makerStart is plz startsWithWord with content 'maker'
    very gitStart is plz startsWithWord with content 'git'
    very sitStart is plz startsWithWord with content 'sit'
    very stayStart is plz startsWithWord with content 'stay'

    rly suchStart
        result is plz parseFunctionDeclaration with content
        result giv type is 'methodDeclaration'
    but rly asinkStart
        very nextContent is content giv content dose substring with 5
        nextContent is plz ifSkippedInline with nextContent
        
        stayStart is plz startsWithWord with nextContent 'stay'
        suchStart is plz startsWithWord with nextContent 'such'

        rly stayStart
            result is plz parseFunctionDeclaration with content true
        but rly suchStart
            result is plz parseFunctionDeclaration with content
            result giv type is 'methodDeclaration'
        but
            very found is plz idx with nextContent 0
            very msg is ctxInfo + 'Expected function declaration, found "asink ' + found + '"'
            very err is new Error with msg
            throw err
        wow
    but rly stayStart
        result is plz parseFunctionDeclaration with content true
    but rly makerStart
        content giv content is content giv content dose substring with 5
        content giv content is plz ifSkippedInline with content

        very args is new Array

        very done is false
        many done not true
            content giv content is plz ifSkippedInline with content

            rly content giv content giv length is 0
                very msg is ctxInfo + 'Unterminated function declaration'
                very err is new IncompleteError with msg
                throw err
            wow

            very newlineStart is content giv content dose startsWith with '\n'
            rly newlineStart
                done is true
            but
                very arg is plz parseIdentifier with content
                args dose push with arg
            wow
        wow

        content giv content is plz ifSkipped with content

        very statements is plz parseBlockBody with content

        result is obj
            'type': 'constructor',
            'args': args,
            'statements': statements
        wow
    but rly gitStart
        content giv content is content giv content dose substring with '3'
        content giv content is plz ifSkipped with content

        very ident is plz parseIdentifier with content

        content giv content is plz ifSkipped with content
        very statements is plz parseBlockBody with content

        result is obj
            'type': 'getter',
            'identifier': ident,
            'statements': statements
        wow
    but rly sitStart
        content giv content is content giv content dose substring with '3'
        content giv content is plz ifSkipped with content

        very ident is plz parseIdentifier with content

        content giv content is plz ifSkipped with content

        very muchStart is plz startsWithWord with content 'much'
        notrly muchStart
            very found is plz idxContent with content 0
            plz makeExpectedError with '"much"' found
        wow

        plz shiftContent with content 4
        content giv content is plz ifSkipped with content

        very newValueIdent is plz parseIdentifier with content

        content giv content is plz ifSkipped with content
        very statements is plz parseBlockBody with content

        result is obj
            'type': 'setter',
            'identifier': ident,
            'newValueIdentifier': newValueIdent,
            'statements': statements
        wow
    but
        very found is plz idxContent with content 0
        plz makeExpectedError with ctxInfo 'class element' found
    wow
wow result

such parseClassBody much content
    very elements is new Array
    
    very done is false
    many done not true
        very wowStart is plz startsWithWord with content 'wow'
        rly wowStart
            plz shiftContent with content 3
            done is true
        but
            very element is plz parseClassElement with content
            elements dose push with element

            content giv content is plz ifSkipped with content
        wow
    wow
wow elements

such tryParseExpression0 much content
    very result

    very parenStart is content giv content dose startsWith with '('
    very plzStart is plz startsWithWord with content 'plz'
    very newStart is plz startsWithWord with content 'new'
    very suchStart is plz startsWithWord with content 'such'
    very asinkStart is plz startsWithWord with content 'asink'
    very muchStart is plz startsWithWord with content 'much'
    very stringStart is content giv content dose startsWith with '\''
    very octalStart is content giv content dose startsWith with '0'
    very classyStart is plz startsWithWord with content 'classy'
    very disStart is plz startsWithWord with content 'dis'
    very sooperStart is plz startsWithWord with content 'sooper'
    very breedStart is plz startsWithWord with content 'breed'
    very maybeStart is plz startsWithWord with content 'maybe'
    very objStart is plz startsWithWord with content 'obj'
    very boxStart is plz startsWithWord with content 'box'
    very dogeumentStart is plz startsWithWord with content 'dogeument'
    very windogeStart is plz startsWithWord with content 'windoge'

    rly parenStart
        very nextContent is plz cloneContent with content
        nextContent giv content is nextContent giv content dose substring with 1
        nextContent giv content is plz ifSkipped with nextContent

        result is plz tryParseExpression with nextContent
        rly result giv ok
            content giv content is nextContent giv content
            content giv content is plz ifSkipped with content

            very endParenStart is content giv content dose startsWith with ')'
            rly endParenStart
                plz shiftContent with content 1
            but
                very ctxInfo is plz genContextInfo with content
                very found is plz idxContent with content 0
                plz makeExpectedError with ctxInfo '")"' found
            wow
        wow
    but rly plzStart
        plz shiftContent with content 3
        content giv content is plz ifSkipped with content

        very callee is plz parseExpression0 with content
    
        content giv content is plz ifSkippedInline with content
        very args is plz parsePossibleArgumentValues with content

        result is obj
            'type': 'call',
            'function': callee,
            'args': args
        wow
    but rly newStart
        plz shiftContent with content 3
        content giv content is plz ifSkipped with content

        very constructor is plz parseExpression0 with content

        content giv content is plz ifSkippedInline with content

        very args is plz parsePossibleArgumentValues with content

        result is obj
            'type': 'constructorCall',
            'constructor': constructor,
            'args': args
        wow
    but rly suchStart or asinkStart
        result is plz parseFunctionDeclaration with content
        result giv type is 'functionDeclarationInline'
    but rly muchStart
        very ctxInfo is plz genContextInfo with content

        plz shiftContent with content 4
        content giv content is plz ifSkipped with content

        very args is new Array

        very done is false
        many done not true
            content giv content is plz ifSkippedInline with content

            rly content giv content giv length is 0
                very msg is ctxInfo + 'Unterminated function declaration'
                very err is new IncompleteError with msg
                throw err
            wow

            very newlineStart is content giv content dose startsWith with '\n'
            rly newlineStart
                done is true
            but
                very arg is plz parseIdentifier with content
                args dose push with arg
            wow
        wow

        content giv content is plz ifSkipped with content

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
        plz shiftContent with content 6
        content giv content is plz ifSkippedInline with content

        very identifier

        very identRes is plz tryParseIdentifier with content
        rly identRes giv ok
            identifier is identRes giv found

            content giv content is plz ifSkippedInline with content
        wow

        very growsStart is plz startsWithWord with content 'grows'
        very superclass

        rly growsStart
            plz shiftContent with content 5
            content giv content is plz ifSkipped with content

            superclass is plz parseIdentifier with content
        wow

        content giv content is plz ifSkipped with content

        very elements is plz parseClassBody with content

        result is obj
            'type': 'classExpression',
            'elements': elements,
            'superclass': superclass,
            'identifier': identifier
        wow
    but rly disStart
        plz shiftContent with content 3
        result is obj
            'type': 'ident',
            'value': 'this'
        wow
    but rly sooperStart
        plz shiftContent with content 6
        result is obj
            'type': 'ident',
            'value': 'super'
        wow
    but rly dogeumentStart
        plz shiftContent with content 9
        result is obj
            'type': 'ident',
            'value': 'document'
        wow
    but rly windogeStart
        plz shiftContent with content 7
        result is obj
            'type': 'ident',
            'value': 'window'
        wow
    but rly maybeStart
        plz shiftContent with content 5
        result is obj
            'type': 'maybe'
        wow
    but rly breedStart
        plz shiftContent with content 5
        result is obj
            'type': 'ident',
            'value': 'Symbol'
        wow
        result is obj
            'type': 'property',
            'object': result,
            'property': 'species'
        wow
    but rly boxStart
        plz shiftContent with content 3
        content giv content is plz ifSkipped with content

        very elements is new Array

        many true
            rly content giv content giv length is 0
                very msg is startCtxInfo + 'Unterminated object'
                very err is new IncompleteError with msg
                throw err
            wow

            very wowStart is plz startsWithWord with content 'wow'
            rly wowStart
                plz shiftContent with content 3
                bork
            wow

            very expr is plz parseExpression with content
            elements dose push with expr

            content giv content is plz ifSkipped with content

            very commaStart is content giv content dose startsWith with ','
            rly commaStart
                shh optional comma, skip

                plz shiftContent with content 1
                content giv content is plz ifSkipped with content
            wow
        wow
        result is obj
            'type': 'array',
            'elements': elements
        wow
    but rly objStart
        very startCtxInfo is plz genContextInfo with content

        plz shiftContent with content 3
        content giv content is plz ifSkipped with content

        very objContent is new Array

        very done is false
        many done not true
            rly content giv content giv length is 0
                very msg is startCtxInfo + 'Unterminated object'
                very err is new IncompleteError with msg
                throw err
            wow

            very wowStart is plz startsWithWord with content 'wow'
            rly wowStart
                plz shiftContent with content 3
                done is true
            but
                very key

                very stringStart is content giv content dose startsWith with '\''
                rly stringStart
                    key is plz parseString with content
                but
                    very identRes is plz tryParseIdentifier with content
                    rly identRes giv ok
                        key is identRes giv found
                    but
                        very ctxInfo is plz genContextInfo with content
                        very found is identRes giv found
                        plz makeExpectedError with ctxInfo 'string, identifier, or "wow"' found
                    wow
                wow

                content giv content is plz ifSkipped with content

                very colonStart is content giv content dose startsWith with ':'
                notrly colonStart
                    very ctxInfo is plz genContextInfo with content
                    very found is plz idxContent with content 0
                    plz makeExpectedError with ctxInfo '":"' found
                wow

                plz shiftContent with content 1
                content giv content is plz ifSkipped with content

                very value is plz parseExpression with content

                content giv content is plz ifSkipped with content

                very commaStart is content giv content dose startsWith with ','
                rly commaStart
                    shh optional comma, skip

                    plz shiftContent with content 1
                    content giv content is plz ifSkipped with content
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
        notrly identRes giv ok
            result is identRes
        but
            very ident is identRes giv found
            result is obj
                'type': 'ident',
                'value': ident
            wow
        wow
    wow

    rly result giv ok same undefined
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
        result is innerResult giv expression

        many true
            very nextContent is plz ifSkipped with content

            very doseStart is plz startsWithWord with nextContent 'dose'
            very givStart is plz startsWithWord with nextContent 'giv'
            very protoStart is plz startsWithWord with nextContent 'proto'
            very levlStart is plz startsWithWord with nextContent 'levl'
            very bigifiedStart is plz startsWithWord with nextContent 'bigified'
            very smallifiedStart is plz startsWithWord with nextContent 'smallified'

            rly doseStart
                content giv content is nextContent dose substring with 4
                content giv content is plz ifSkipped with content
                very call is plz parseIdentifier with content

                rly result giv type is 'ident' and result giv value is 'console' and call is 'loge'
                    call is 'log'
                wow

                very args is plz parsePossibleArgumentValues with content

                result is obj
                    'type': 'property',
                    'object': result,
                    'property': call
                wow
                result is obj
                    'type': 'call',
                    'function': result,
                    'args': args
                wow
                nextContent is plz ifSkipped with content
            but rly givStart
                content giv content is nextContent dose substring with 3
                content giv content is plz ifSkipped with content
                very child is plz parseIdentifier with content

                rly result giv type is 'ident' and result giv value is 'console' and child is 'loge'
                    child is 'log'
                wow

                result is obj
                    'type': 'property',
                    'object': result,
                    'property': child
                wow
            but rly protoStart
                content giv content is nextContent dose substring with 5
                content giv content is plz ifSkipped with content
                very child is plz parseIdentifier with content

                result is obj
                    'type': 'property',
                    'object': result,
                    'property': 'prototype'
                wow
                result is obj
                    'type': 'property',
                    'object': result,
                    'property': child
                wow
            but rly levlStart
                content giv content is nextContent dose substring with 4
                content giv content is plz ifSkipped with content

                very index is plz parseExpression0 with content

                result is obj
                    'type': 'index',
                    'object': result,
                    'index': index
                wow
            but rly bigifiedStart
                content giv content is nextContent dose substring with 8

                result is obj
                    'type': 'postfixIncrement',
                    'value': result
                wow
            but rly smallifiedStart
                content giv content is nextContent dose substring with 10

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

    very kindofStart is plz startsWithWord with content 'kindof'
    very waiteStart is plz startsWithWord with content 'waite'
    very bigifyStart is plz startsWithWord with content 'bigify'
    very smallifyStart is plz startsWithWord with content 'smallify'
    very minusStart is content giv content dose startsWith with '-'

    rly kindofStart
        plz shiftContent with content 6
        content giv content is plz ifSkipped with content

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
        plz shiftContent with content 5
        content giv content is plz ifSkipped with content
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
        plz shiftContent with content 6
        content giv content is plz ifSkipped with content
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
        plz shiftContent with content 8
        content giv content is plz ifSkipped with content
        very inner is plz parseExpression2 with content

        result is obj
            'type': 'prefixDecrement',
            'value': inner
        wow
        result is obj
            'ok': true,
            'expression': result
        wow
    but rly minusStart
        plz shiftContent with content 1
        content giv content is plz ifSkipped with content

        very inner is plz parseExpression2 with content

        result is obj
            'type': 'negate',
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

such binaryOpHelper much words ops parseInner content result
    very nextContent is plz ifSkippedInline with content

    very keys is Object dose keys with ops

    very didSomething is true
    many didSomething
        didSomething is false
        much very i as 0 next i smaller keys giv length next i more 1
            very key is plz idx with keys i
            very id is plz idx with ops key

            very opStart
            rly words
                opStart is plz startsWithWord with nextContent key
            but
                opStart is nextContent dose startsWith with key
            wow

            rly opStart
                very keyLen is key giv length
                content giv content is nextContent dose substring with keyLen
                content giv content is plz ifSkipped with content
                very rhs is plz parseInner with content

                result is obj
                    'type': id,
                    'a': result,
                    'b': rhs
                wow

                nextContent is plz ifSkipped with content
                didSomething is true
            wow
        wow
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
        result is innerResult giv expression
        result is plz binaryOpHelper with false OPS parseExpression2 content result

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
        result is innerResult giv expression
        result is plz binaryOpHelper with false OPS parseExpression3 content result

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
        result is innerResult giv expression
        result is plz binaryOpHelper with true OPS parseExpression4 content result

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
        result is innerResult giv expression
        result is plz binaryOpHelper with true OPS parseExpression5 content result

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
        result is innerResult giv expression
        result is plz binaryOpHelper with true OPS parseExpression6 content result

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

    very yeldeStart is plz startsWithWord with content 'yelde'
    rly yeldeStart
        plz shiftContent with content 5
        content giv content is plz ifSkipped with content
    wow

    very result
    very innerResult is plz tryParseExpression7 with content
    rly innerResult giv ok
        result is innerResult giv expression
        result is plz binaryOpHelper with true OPS parseExpression7 content result

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
    content is plz wrapContent with content

    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression' found
    wow
wow result

such parseExpression0 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression0 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression0' found
    wow
wow result

such parseExpression2 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression2 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression2' found
    wow
wow result

such parseExpression3 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression3 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression3' found
    wow
wow result

such parseExpression4 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression4 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression4' found
    wow
wow result

such parseExpression5 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression5 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression5' found
    wow
wow result

such parseExpression6 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression6 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression6' found
    wow
wow result

such parseExpression7 much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseExpression7 with content

    rly result giv ok
        result is result giv expression
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'expression7' found
    wow
wow result

such parseElses much content
    very elses is new Array

    very done is false

    many done not true
        very butStart is plz startsWithWord with content 'but'
        rly butStart
            plz shiftContent with content 3
            content giv content is plz ifSkippedInline with content

            very type is 'else'
            very condition

            very butRlyStart is plz startsWithWord with content 'rly'
            very butNotrlyStart is plz startsWithWord with content 'notrly'
            rly butRlyStart
                plz shiftContent with content 3
                type is 'elseif'

                content giv content is plz ifSkippedInline with content

                condition is plz parseExpression with content
            but rly butNotrlyStart
                plz shiftContent with content 6
                type is 'elseif'

                content giv content is plz ifSkippedInline with content

                condition is plz parseExpression with content
                condition is obj
                    'type': 'not',
                    'value': condition
                wow
            wow

            content giv content is plz ifSkipped with content
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
    very ident

    very asinkStart is plz startsWithWord with content 'asink'
    rly asinkStart
        isAsync is true

        plz shiftContent with content 5
        content giv content is plz ifSkipped with content
    wow

    very suchStart is plz startsWithWord with content 'such'
    very muchStart is plz startsWithWord with content 'much'
    very stayStart is plz startsWithWord with content 'stay'

    rly suchStart or stayStart
        rly suchStart and isClassStatic
            very msg is ctxInfo + 'Expected "stay", found "such"'
            very err is new Error with msg
            throw err
        wow

        rly stayStart and isClassStatic not true
            very msg is ctxInfo + 'Expected "such", found "stay"'
            very err is new Error with msg
            throw err
        wow

        plz shiftContent with content 4
        content giv content is plz ifSkipped with content

        very lazyStart is plz startsWithWord with content 'lazy'

        rly lazyStart
            isGenerator is true

            plz shiftContent with content 4
            content giv content is plz ifSkipped with content
        wow

        ident is plz parseIdentifier with content
    but rly muchStart
        rly isClassStatic
            very msg is ctxInfo + 'Expected "stay", found "much"'
            very err is new Error with msg
            throw err
        wow
    but
        very found is plz idxContent with content 0
        plz makeExpectedError with startCtxInfo 'function declaration' found
    wow

    very ctxInfo is plz genContextInfo with content

    very args is new Array

    very nextContent is plz ifSkippedInline with content
    muchStart is plz startsWithWord with nextContent 'much'
    rly muchStart
        content giv content is nextContent dose substring with 4

        very done is false
        many done not true
            content giv content is plz ifSkippedInline with content

            rly content giv content giv length is 0
                very msg is ctxInfo + 'Unterminated function declaration'
                very err is new IncompleteError with msg
                throw err
            wow

            very newlineStart is content giv content dose startsWith with '\n'
            rly newlineStart
                done is true
            but
                very arg is plz parseIdentifier with content
                args dose push with arg
            wow
        wow
    wow
    content giv content is plz ifSkipped with content

    very statements is plz parseBlockBody with content

    very result is obj
        'type': 'functionDeclaration',
        'identifier': ident,
        'args': args,
        'statements': statements,
        'async': isAsync,
        'generator': isGenerator
    wow

    nextContent is plz cloneContent with content
    nextContent giv content is plz ifSkippedInline with nextContent
    very exprResult is plz tryParseExpression with nextContent
    rly exprResult giv ok
        result giv returns is exprResult giv expression
        content giv content is nextContent giv content
    wow

    rly isClassStatic
        result giv type is 'staticMethodDeclaration'
    wow

    notrly result giv identifier
        result giv type is 'functionDeclarationInline'
    wow
wow result

such tryParseInlineStatement much content
    very result

    very veryStart is plz startsWithWord with content 'very'
    very constStart is plz startsWithWord with content '5evar'
    rly veryStart or constStart
        rly constStart
            plz shiftContent with content 5
        but
            plz shiftContent with content 4
        wow
        content giv content is plz ifSkipped with content

        very ident is plz parseIdentifier with content

        result is obj
            'type': 'declaration',
            'ident': ident,
            'const': constStart
        wow

        very nextContent is plz ifSkippedInline with content
        very isStart is plz startsWithWord with nextContent 'is'
        very asStart is plz startsWithWord with nextContent 'as'
        rly isStart or asStart
            content giv content is nextContent dose substring with 2
            content giv content is plz ifSkipped with content

            very expr is plz parseExpression with content

            result giv value is expr
        wow
    but
        shh first, look for reassignment
        very nextContent is plz cloneContent with content
        very lhsRes is plz tryParseExpression1 with nextContent
        rly lhsRes giv ok
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

            much very i as 0 next i smaller keys giv length next i more 1
                very key is plz idx with keys i
                very id is plz idx with OPS key

                very opStart is plz startsWithWord with nextContent key
                rly opStart
                    very keyLen is key giv length
                    content giv content is nextContent giv content dose substring with keyLen
                    content giv content is plz ifSkipped with content
                    very rhs is plz parseExpression with content

                    very lhs is lhsRes giv expression

                    result is obj
                        'type': id,
                        'a': lhs,
                        'b': rhs
                    wow
                    bork
                wow
            wow
        wow

        notrly result
            result is plz tryParseExpression with content
            rly result giv ok
                very expression is result giv expression

                result is obj
                    'ok': true,
                    'statement': expression
                wow
            wow
        wow
    wow

    rly result giv ok same undefined
        result is obj
            'ok': true,
            'statement': result
        wow
    wow
wow result

such parseInlineStatement much content
    very startCtxInfo is plz genContextInfo with content

    very result is plz tryParseInlineStatement with content

    rly result giv ok
        result is result giv statement
    but
        very found is result giv found
        plz makeExpectedError with startCtxInfo 'inline statement' found
    wow
wow result

such parseStatement much content
    content is plz wrapContent with content

    very result

    very trainedStart is plz startsWithWord with content 'trained'
    very soStart is plz startsWithWord with content 'so'
    very suchStart is plz startsWithWord with content 'such'
    very asinkStart is plz startsWithWord with content 'asink'
    very rlyStart is plz startsWithWord with content 'rly'
    very notrlyStart is plz startsWithWord with content 'notrly'
    very butStart is plz startsWithWord with content 'but'
    very pawseStart is plz startsWithWord with content 'pawse'
    very manyStart is plz startsWithWord with content 'many'
    very amazeStart is plz startsWithWord with content 'amaze'
    very throwStart is plz startsWithWord with content 'throw'
    very borkStart is plz startsWithWord with content 'bork'
    very classyStart is plz startsWithWord with content 'classy'
    very woofStart is plz startsWithWord with content 'woof'
    very muchStart is plz startsWithWord with content 'much'
    very deboogerStart is plz startsWithWord with content 'debooger'
    very goStart is plz startsWithWord with content 'go'

    rly trainedStart
        plz shiftContent with content 7

        result is obj
            'type': 'trained'
        wow
    but rly borkStart
        plz shiftContent with content 4

        result is obj
            'type': 'break'
        wow
    but rly pawseStart
        plz shiftContent with content 5

        result is obj
            'type': 'debugger'
        wow
    but rly deboogerStart
        plz shiftContent with content 8
        result is obj
            'type': 'debugger'
        wow
    but rly soStart
        plz shiftContent with content 2
        content giv content is plz ifSkipped with content

        very importPath is ''

        many true
            rly content giv content giv length smaller 1
                bork
            wow

            very chr is plz idxContent with content 0

            very isVChar is chr biggerish '!' and chr smallerish '~'

            rly isVChar
                plz shiftContent with content 1
                importPath more chr
            but
                very isWS is plz isWhitespace with chr

                rly isWS
                    bork
                but
                    very ctxInfo is plz genContextInfo with content
                    very msg is ctxInfo + 'Expected whitespace, found ' + chr
                    very err is new Error with msg
                    throw err
                wow
            wow
        wow

        result is obj
            'type': 'import',
            'path': importPath
        wow

        very nextContent is plz ifSkippedInline with content

        very asStart is plz startsWithWord with nextContent 'as'
        rly asStart
            content giv content is nextContent dose substring with 2
            content giv content is plz ifSkipped with content

            very ident is plz parseIdentifier with content

            result giv identifier is ident
        wow
    but rly suchStart or asinkStart
        result is plz parseFunctionDeclaration with content
    but rly rlyStart or notrlyStart
        rly notrlyStart
            plz shiftContent with content 6
        but
            plz shiftContent with content 3
        wow

        content giv content is plz ifSkipped with content

        very condition is plz parseExpression with content

        rly notrlyStart
            condition is obj
                'type': 'not',
                'value': condition
            wow
        wow

        content giv content is plz ifSkipped with content
        very statements is plz parseBlockBody with content true

        very elses is plz parseElses with content

        result is obj
            'type': 'if',
            'condition': condition,
            'statements': statements,
            'elses': elses
        wow
    but rly manyStart
        plz shiftContent with content 4
        content giv content is plz ifSkipped with content

        very condition is plz parseExpression with content

        content giv content is plz ifSkipped with content
        very statements is plz parseBlockBody with content
        
        result is obj
            'type': 'while',
            'condition': condition,
            'statements': statements
        wow
    but rly amazeStart
        plz shiftContent with content 5
        content giv content is plz ifSkippedInline with content
        very exprRes is plz tryParseExpression with content
        rly exprRes giv ok
            very value is exprRes giv expression
            result is obj
                'type': 'return',
                'value': value
            wow
        but
            result is obj
                'type': 'return'
            wow
        wow
    but rly throwStart
        plz shiftContent with content 5
        content giv content is plz ifSkipped with content
        very expr is plz parseExpression with content
        result is obj
            'type': 'throw',
            'value': expr
        wow
    but rly classyStart
        plz shiftContent with content 6
        content giv content is plz ifSkipped with content

        very ident is plz parseIdentifier with content

        content giv content is plz ifSkippedInline with content

        very growsStart is plz startsWithWord with content 'grows'
        very superclass

        rly growsStart
            plz shiftContent with content 5
            content giv content is plz ifSkipped with content

            superclass is plz parseIdentifier with content
        wow

        content giv content is plz ifSkipped with content

        very elements is plz parseClassBody with content

        result is obj
            'type': 'classDeclaration',
            'elements': elements,
            'identifier': ident,
            'superclass': superclass
        wow
    but rly woofStart
        plz shiftContent with content 4
        content giv content is plz ifSkipped with content

        very identifier

        shh first check for "be" form

        very subContent is plz cloneContent with content
        very identResult is plz tryParseIdentifier with subContent

        rly identResult giv ok
            subContent giv content is plz ifSkippedInline with subContent
            very beStart is plz startsWithWord with subContent 'be'
            rly beStart
                subContent giv content is subContent giv content dose substring with 2
                subContent giv content is plz ifSkipped with subContent

                identifier is identResult giv found

                content giv content is subContent giv content
            wow
        wow

        very value is plz parseExpression with content
        
        result is obj
            'type': 'export',
            'identifier': identifier,
            'value': value
        wow
    but rly goStart
        plz shiftContent with content 2
        content giv content is plz ifSkipped with content

        very statements is plz parseBlockBody with content false true
        very catches is new Array

        very nextContent is plz cloneContent with content
        nextContent giv content is plz ifSkipped with nextContent

        very catchStart is plz startsWithWord with nextContent 'catch'
        many catchStart
            content giv content is nextContent giv content
            plz shiftContent with content 5
            content giv content is plz ifSkipped with content

            very ident is plz parseIdentifier with content
            content giv content is plz ifSkipped with content

            very body is plz parseBlockBody with content false true
            very catchResult is obj
                'type': 'catch',
                'identifier': ident,
                'statements': body
            wow

            catches dose push with catchResult

            nextContent is plz cloneContent with content
            nextContent giv content is plz ifSkipped with nextContent

            catchStart is plz startsWithWord with nextContent 'catch'
        wow

        result is obj
            'type': 'try',
            'statements': statements,
            'catches': catches
        wow
    but rly muchStart
        shh Could be either a loop or a function expression

        very nextContent is plz cloneContent with content
        nextContent giv content is nextContent giv content dose substring with 4
        nextContent giv content is plz ifSkippedInline with nextContent

        very nextStart is plz startsWithWord with nextContent 'next'
        very initRes1 is plz tryParseInlineStatement with nextContent

        rly initRes1 giv ok or nextStart
            very initStatements is new Array

            rly initRes1 giv ok
                very initStatement1 is initRes1 giv statement
                initStatements dose push with initStatement1
            wow

            nextContent giv content is plz ifSkippedInline with nextContent
            very commaStart is nextContent giv content dose startsWith with ','
            many commaStart
                nextContent giv content is nextContent giv content dose substring with 1
                nextContent giv content is plz ifSkipped with nextContent

                shh at this point it's definitely a loop, so we can fail
                very nextValue is plz parseInlineStatement with nextContent
                initStatements dose push with nextValue

                nextContent giv content is plz ifSkipped with nextContent
                commaStart is nextContent giv content dose startsWith with ','
            wow

            very nextStart is plz startsWithWord with nextContent 'next'
            rly nextStart
                shh commit to consumption
                content giv content is nextContent giv content

                plz shiftContent with content 4
                content giv content is plz ifSkipped with content

                very conditionRes is plz tryParseExpression with content

                content giv content is plz ifSkipped with content
                nextStart is plz startsWithWord with content 'next'

                notrly nextStart
                    very ctxInfo is plz genContextInfo with content
                    very found is plz idxContent with content 0
                    plz makeExpectedError with startCtxInfo '"next"' found
                wow

                plz shiftContent with content 4
                content giv content is plz ifSkippedInline with content

                very afterStatements is new Array

                very afterStatementRes is plz tryParseInlineStatement with content
                rly afterStatementRes giv ok
                    very current is afterStatementRes giv statement
                    afterStatements dose push with current

                    content giv content is plz ifSkippedInline with content

                    many true
                        commaStart is content giv content dose startsWith with ','

                        rly commaStart
                            content giv content is plz ifSkipped with content
                            current is plz parseInlineStatement with content
                            afterStatements dose push with current
                        but
                            bork
                        wow
                    wow
                wow

                content giv content is plz ifSkipped with content

                very bodyStatements is plz parseBlockBody with content

                very condition
                rly conditionRes giv ok
                    condition is conditionRes giv expression
                wow

                result is obj
                    'type': 'for',
                    'initStatements': initStatements,
                    'condition': condition,
                    'afterStatements': afterStatements,
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
    
    content giv content is plz ifSkipped with content

    very statements is new Array

    many content giv content giv length bigger 0
        very statement is plz parseStatement with content
        statements dose push with statement

        content giv content is plz mustSkip with content
    wow

    very result is obj
        'type': 'file',
        'statements': statements
    wow
wow result

woof parseExpression be parseExpression
woof parseStatement be parseStatement
woof parseFile be parseFile
woof IncompleteError be IncompleteError
