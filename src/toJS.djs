very SIMPLE_BINARY_OPS is new Array with '<' '>' '<=' '>=' 'instanceof' '===' '==' '!=='
very SIMPLE_REASSIGNMENT_OPS is new Array with '+=' '-=' '*=' '/='
very OTHER_BINARY_OPS is obj
    'multiplication': '*',
    'division': '/',
    'modulo': '%',
    'addition': '+',
    'subtraction': '-',
    'logicalAnd': '&&',
    'logicalOr': '||'
wow

very MODULE_NAME_SEGMENT_REGEX is new RegExp with '^..?/.*?([\\w-]+)(\\.\\w+)?$'
very IDENT_INVALID_REGEX is new RegExp with '[^a-zA-Z0-9_$]' 'g'
very NEWLINE_REGEX is new RegExp with '\n' 'g'

such idx much src index
    amaze src levl index
wow

such statementsToJS much statements
    very result is ''
    statements dose forEach with much statement idx
        rly idx bigger 0
            result more '\n'
        wow
        very statementJS is plz toJS with statement
        result more statementJS
        rly statement giv type not 'functionDeclaration' and statement giv type not 'if' and statement giv type not 'while' and statement giv type not 'for' and statement giv type not 'classDeclaration'
            result more ';'
        wow
    wow&
wow result

such indent much content
    very result is content dose replace with NEWLINE_REGEX '\n    '
wow result

such toJS much ast wrapFlag
    very result
    rly ast giv type is 'ident'
        result is ast giv value
    but rly ast giv type is 'maybe'
        result is '!Math.round(Math.random())'
        rly wrapFlag
            result is '(' + result + ')'
        wow
    but rly ast giv type is 'string'
        very value is ast giv value
        result is JSON dose stringify with value
    but rly ast giv type is 'number'
        result is ast giv value dose toString
    but rly ast giv type is 'property'
        very object is ast giv object
        object is plz toJS with object true

        very property is ast giv property
    
        result is object + '.' + property
    but rly ast giv type is 'index'
        very object is ast giv object
        object is plz toJS with object true

        very index is ast giv index
        index is plz toJS with index

        result is object + '[' + index + ']'
    but rly ast giv type is 'call'
        very fn is ast giv function
        fn is plz toJS with fn
        result is fn + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            very argJS is plz toJS with arg
            result more argJS
        wow&
        result more ')'
    but rly ast giv type is 'constructorCall'
        very constructor is ast giv constructor
        constructor is plz toJS with constructor
        result is 'new ' + constructor + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            very argJS is plz toJS with arg
            result more argJS
        wow&
        result more ')'
    but rly ast giv type is 'not'
        very value is ast giv value
        value is plz toJS with value true
        result is '!' + value
    but rly ast giv type is 'declaration'
        result is 'let '
        result more ast giv ident
        rly ast giv value
            very value is ast giv value
            value is plz toJS with value
            result more ' = ' + value
        wow
    but rly ast giv type is 'assignment'
        very a is ast giv a
        very b is ast giv b

        very target is plz toJS with a
        very value is plz toJS with b
        result is target + ' = ' + value
    but rly ast giv type is 'functionDeclaration'
        result is ''

        rly ast giv async
            result more 'async '
        wow

        result more 'function'

        rly ast giv generator
            result more '*'
        wow

        result more ' '
        result more ast giv identifier + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            result more arg
        wow&
        result more ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        rly ast giv returns
            very returns is ast giv returns

            body more '\nreturn '
            very returnValue is plz toJS with returns
            body more returnValue
            body more ';'
        wow

        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'functionDeclarationInline'
        result is ''

        rly ast giv async
            result more 'async '
        wow

        result more 'function'
        rly ast giv identifier
            result more ' '
            result more ast giv identifier
        wow

        result more '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            result more arg
        wow&
        result more ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'if'
        result is 'if ('
        very condition is ast giv condition
        condition is plz toJS with condition
        result more condition + ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
        ast giv elses dose forEach with much statement
            very elseJS is plz toJS with statement
            result more ' ' + elseJS
        wow&
    but rly ast giv type is 'else'
        result is 'else {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'elseif'
        result is 'else if ('
        very condition is ast giv condition
        condition is plz toJS with condition
        result more condition + ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'while'
        result is 'while ('
        very condition is ast giv condition
        condition is plz toJS with condition
        result more condition + ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'for'
        very inBlock is ast giv initStatements giv length bigger 1

        result is 'for ('
        notrly inBlock
            very initStatements is ast giv initStatements
            very statement is plz idx with initStatements 0
            statement is plz toJS with statement
            result more statement
        wow
        result more '; '

        rly ast giv condition
            very condition is ast giv condition
            condition is plz toJS with condition
            result more condition
        wow
        result more '; '

        rly ast giv afterStatement
            very afterStatement is ast giv afterStatement
            afterStatement is plz toJS with afterStatement
            result more afterStatement
        wow
        result more ') {'

        very bodyStatements is ast giv bodyStatements
        very innerResult is plz statementsToJS with bodyStatements
        innerResult is '\n' + innerResult
        innerResult is plz indent with innerResult
        result more innerResult

        result more '\n}'

        rly inBlock
            very initStatements is ast giv initStatements
            very init is plz statementsToJS with initStatements
            init is '\n' + init
            result is init + result
            result is plz indent with result

            result is '{\n' + result + '}'
        wow
    but rly ast giv type is 'trained'
        result is '"use strict"'
    but rly ast giv type is 'debugger'
        result is 'debugger'
    but rly ast giv type is 'import'
        result is 'const '
        rly ast giv identifier
            result more ast giv identifier
        but
            very ident is ast giv path

            very m is MODULE_NAME_SEGMENT_REGEX dose exec with ident
            rly m
                ident is m levl 1
            wow
            ident is ident dose replace with IDENT_INVALID_REGEX '_'

            result more ident
        wow
        result more ' = require(\''
        result more ast giv path
        result more '\')'
    but rly ast giv type is 'file'
        very statements is ast giv statements
        result is plz statementsToJS with statements
    but rly ast giv type is 'return'
        result is 'return'
        rly ast giv value
            very value is ast giv value
            value is plz toJS with value
            result more ' '
            result more value
        wow
    but rly ast giv type is 'yield'
        result is 'yield'
        rly ast giv value
            very value is ast giv value
            value is plz toJS with value
            result more ' '
            result more value
        wow
    but rly ast giv type is 'break'
        result is 'break'
    but rly ast giv type is 'typeof'
        result is '(typeof '
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more ')'
    but rly ast giv type is 'await'
        result is '(await '
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more ')'
    but rly ast giv type is 'negate'
        very value is ast giv value
        value is plz toJS with value

        result is '-'
        result more value
    but rly ast giv type is 'prefixIncrement'
        result is '(++'
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more ')'
    but rly ast giv type is 'prefixDecrement'
        result is '(--'
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more ')'
    but rly ast giv type is 'postfixIncrement'
        result is '('
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more '++)'
    but rly ast giv type is 'postfixDecrement'
        result is '('
        very value is ast giv value
        value is plz toJS with value
        result more value
        result more '--)'
    but rly ast giv type is 'methodDeclaration'
        result is ''

        rly ast giv async
            result more 'async '
        wow

        rly ast giv generator
            result more '*'
        wow

        result more ast giv identifier + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            result more arg
        wow&
        result more ') {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        rly ast giv returns
            body more '\nreturn '
            very returns is ast giv returns
            returns is plz toJS with returns
            body more returns
            body more ';'
        wow
        body is plz indent with body

        result more body + '\n}'
    but rly ast giv type is 'staticMethodDeclaration'
        result is 'static '

        rly ast giv async
            result more 'async '
        wow

        rly ast giv generator
            result more '*'
        wow

        result more ast giv identifier + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            result more arg
        wow&
        result more ') {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        rly ast giv returns
            body more '\nreturn '
            very returns is ast giv returns
            returns is plz toJS with returns
            body more returns
            body more ';'
        wow
        body is plz indent with body

        result more body + '\n}'
    but rly ast giv type is 'classExpression'
        result is 'class'

        rly ast giv identifier
            result more ' '
            result more ast giv identifier
        wow

        rly ast giv superclass
            result more ' extends '
            result more ast giv superclass
        wow

        result more ' {'
        very innerResult is ''
        very elements is ast giv elements
        much very i as 0 next i smaller elements giv length next i more 1
            innerResult more '\n'
            very value is plz idx with elements i
            value is plz toJS with value
            innerResult more value
        wow
        innerResult is plz indent with innerResult
        result more innerResult
        result more '\n}'
    but rly ast giv type is 'classDeclaration'
        result is 'class '
        result more ast giv identifier

        rly ast giv superclass
            result more ' extends '
            result more ast giv superclass
        wow

        result more ' {'
        very innerResult is ''
        very elements is ast giv elements
        much very i as 0 next i smaller elements giv length next i more 1
            innerResult more '\n'
            very value is plz idx with elements i
            value is plz toJS with value
            innerResult more value
        wow
        innerResult is plz indent with innerResult
        result more innerResult
        result more '\n}'
    but rly ast giv type is 'constructor'
        result is 'constructor('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            result more arg
        wow&
        result more ') {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'getter'
        result is 'get '
        result more ast giv identifier + '() {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'setter'
        result is 'set '
        result more ast giv identifier + '('
        result more ast giv newValueIdentifier + ') {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'export'
        result is 'module.exports'
        rly ast giv identifier
            result more '.'
            result more ast giv identifier
        wow
        result more ' = '
        very value is ast giv value
        value is plz toJS with value
        result more value
    but rly ast giv type is 'array'
        result is '['
        very elements is ast giv elements
        much very i as 0 next i smaller elements giv length next i more 1
            rly i bigger 0
                result more ', '
            wow

            very entry is plz idx with elements i
            very value is plz toJS with entry

            result more value
        wow
        result more ']'
    but rly ast giv type is 'object'
        result is '{'
        very innerContent is ''
        very content is ast giv content
        much very i as 0 next i smaller content giv length next i more 1
            very entry is plz idx with content i

            very value is entry giv value
            value is plz toJS with value

            very key is entry giv key
            key is JSON dose stringify with key

            innerContent more '\n'
            innerContent more key
            innerContent more ': '
            innerContent more value
            innerContent more ','
        wow

        innerContent is plz indent with innerContent
        result more innerContent
        result more '\n}'
    but
        very success is false

        much very i as 0 next i smaller SIMPLE_BINARY_OPS giv length next i more 1
            very id is plz idx with SIMPLE_BINARY_OPS i

            rly id is ast giv type
                very a is ast giv a
                a is plz toJS with a true

                very b is ast giv b
                b is plz toJS with b true

                result is a + ' ' + id + ' ' + b

                success is true
                bork
            wow
        wow

        much very i as 0 next i smaller SIMPLE_REASSIGNMENT_OPS giv length next i more 1
            very id is plz idx with SIMPLE_REASSIGNMENT_OPS i

            rly id is ast giv type
                very a is ast giv a
                a is plz toJS with a true

                very b is ast giv b
                b is plz toJS with b true

                result is a + ' ' + id + ' ' + b

                success is true
                bork
            wow
        wow

        very otherBinaryOpKeys is Object dose keys with OTHER_BINARY_OPS

        much very i as 0 next i smaller otherBinaryOpKeys giv length next i more 1
            very id is plz idx with otherBinaryOpKeys i
            very op is plz idx with OTHER_BINARY_OPS id

            rly id is ast giv type
                very a is ast giv a
                a is plz toJS with a true

                very b is ast giv b
                b is plz toJS with b true

                result is a + ' ' + op + ' ' + b

                success is true
                bork
            wow
        wow

        notrly success
            very type is ast giv type
            very msg is 'Unrecognized node type: ' + type
            very err is new Error with msg
            throw err
        wow
    wow
wow result

woof toJS
