very SIMPLE_REASSIGNMENT_OPS is new Array with '+=' '-=' '*=' '/='
very BINARY_OPS is new Array

such addBinaryOp much id jsOp opLevel
    very value is new Array with id jsOp opLevel
    BINARY_OPS dose push with value
wow

plz addBinaryOp with 'multiplication' '*' 3
plz addBinaryOp with 'division' '/' 3
plz addBinaryOp with 'modulo' '%' 3
plz addBinaryOp with 'addition' '+' 4
plz addBinaryOp with 'subtraction' '-' 4
plz addBinaryOp with '<' '<' 5
plz addBinaryOp with '>' '>' 5
plz addBinaryOp with '<=' '<=' 5
plz addBinaryOp with '>=' '>=' 5
plz addBinaryOp with 'instanceof' 'instanceof' 5
plz addBinaryOp with '===' '===' 6
plz addBinaryOp with '!==' '!==' 6
plz addBinaryOp with '==' '==' 6
plz addBinaryOp with 'logicalAnd' '&&' 7
plz addBinaryOp with 'logicalOr' '||' 8

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
        very statementJS is plz toJS with statement 20
        result more statementJS
        rly statement giv type not 'functionDeclaration' and statement giv type not 'if' and statement giv type not 'while' and statement giv type not 'for' and statement giv type not 'classDeclaration' and statement giv type not 'try'
            result more ';'
        wow
    wow&
wow result

such indent much content
    very result is content dose replace with NEWLINE_REGEX '\n    '
wow result

such toJS much ast parentOpLevel
    very result
    very opLevel is 20

    rly ast giv type is 'ident'
        result is ast giv value
        opLevel is 0
    but rly ast giv type is 'maybe'
        result is '!Math.round(Math.random())'
        opLevel is 2
    but rly ast giv type is 'string'
        very value is ast giv value
        result is JSON dose stringify with value
        opLevel is 0
    but rly ast giv type is 'number'
        result is ast giv value dose toString
        opLevel is 0
    but rly ast giv type is 'property'
        very object is ast giv object
        object is plz toJS with object 0

        very property is ast giv property
    
        result is object + '.' + property
        opLevel is 0
    but rly ast giv type is 'index'
        very object is ast giv object
        object is plz toJS with object 0

        very index is ast giv index
        index is plz toJS with index 20

        result is object + '[' + index + ']'
        opLevel is 0
    but rly ast giv type is 'call'
        very fn is ast giv function
        fn is plz toJS with fn 0
        result is fn + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            very argJS is plz toJS with arg 20
            result more argJS
        wow&
        result more ')'
        opLevel is 0
    but rly ast giv type is 'constructorCall'
        very constructor is ast giv constructor
        constructor is plz toJS with constructor 0
        result is 'new ' + constructor + '('
        ast giv args dose forEach with much arg idx
            rly idx bigger 0
                result more ', '
            wow
            very argJS is plz toJS with arg 20
            result more argJS
        wow&
        result more ')'
        opLevel is 0
    but rly ast giv type is 'not'
        very value is ast giv value
        value is plz toJS with value 2
        result is '!' + value
        opLevel is 2
    but rly ast giv type is 'declaration'
        result is 'let '
        result more ast giv ident
        rly ast giv value
            very value is ast giv value
            value is plz toJS with value 20
            result more ' = ' + value
        wow
    but rly ast giv type is 'assignment'
        very a is ast giv a
        very b is ast giv b

        very target is plz toJS with a 20
        very value is plz toJS with b 20
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
            very returnValue is plz toJS with returns 20
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
        opLevel is 0
    but rly ast giv type is 'if'
        result is 'if ('
        very condition is ast giv condition
        condition is plz toJS with condition 20
        result more condition + ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
        ast giv elses dose forEach with much statement
            very elseJS is plz toJS with statement 20
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
        condition is plz toJS with condition 20
        result more condition + ') {'

        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body + '\n}'
    but rly ast giv type is 'try'
        result is 'try {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body
        result more '\n}'

        ast giv catches dose forEach with much entry
            very inner is plz toJS with entry
            result more '\n'
            result more inner
        wow&
    but rly ast giv type is 'catch'
        result is 'catch('
        result more ast giv identifier
        result more ') {'
        very statements is ast giv statements
        very body is plz statementsToJS with statements
        body is '\n' + body
        body is plz indent with body
        result more body
        result more '\n}'
    but rly ast giv type is 'while'
        result is 'while ('
        very condition is ast giv condition
        condition is plz toJS with condition 20
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
            statement is plz toJS with statement 20
            result more statement
        wow
        result more '; '

        rly ast giv condition
            very condition is ast giv condition
            condition is plz toJS with condition 20
            result more condition
        wow
        result more '; '

        ast giv afterStatements dose forEach with much afterStatement
            afterStatement is plz toJS with afterStatement 20
            result more afterStatement
        wow&
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
            value is plz toJS with value 20
            result more ' '
            result more value
        wow
    but rly ast giv type is 'throw'
        result is 'throw '
        very value is ast giv value
        result more plz toJS with value
    but rly ast giv type is 'yield'
        result is 'yield'
        rly ast giv value
            very value is ast giv value
            value is plz toJS with value 8
            result more ' '
            result more value
        wow
        opLevel is 8
    but rly ast giv type is 'break'
        result is 'break'
    but rly ast giv type is 'typeof'
        result is 'typeof '
        very value is ast giv value
        value is plz toJS with value 2
        result more value
        opLevel is 2
    but rly ast giv type is 'await'
        result is 'await '
        very value is ast giv value
        value is plz toJS with value 2
        result more value
        opLevel is 2
    but rly ast giv type is 'negate'
        very value is ast giv value
        value is plz toJS with value 2

        result is '-'
        result more value
        opLevel is 2
    but rly ast giv type is 'prefixIncrement'
        result is '++'
        very value is ast giv value
        value is plz toJS with value 2
        result more value
        opLevel is 2
    but rly ast giv type is 'prefixDecrement'
        result is '--'
        very value is ast giv value
        value is plz toJS with value 2
        result more value
        opLevel is 2
    but rly ast giv type is 'postfixIncrement'
        very value is ast giv value
        value is plz toJS with value 1
        result is value
        result more '++'
        opLevel is 1
    but rly ast giv type is 'postfixDecrement'
        very value is ast giv value
        value is plz toJS with value 1
        result is value
        result more '--'
        opLevel is 1
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
            returns is plz toJS with returns 20
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
            returns is plz toJS with returns 20
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
            value is plz toJS with value 20
            innerResult more value
        wow
        innerResult is plz indent with innerResult
        result more innerResult
        result more '\n}'
        opLevel is 0
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
            value is plz toJS with value 20
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
        value is plz toJS with value 20
        result more value
    but rly ast giv type is 'array'
        result is '['
        very elements is ast giv elements
        much very i as 0 next i smaller elements giv length next i more 1
            rly i bigger 0
                result more ', '
            wow

            very entry is plz idx with elements i
            very value is plz toJS with entry 20

            result more value
        wow
        result more ']'
        opLevel is 0
    but rly ast giv type is 'object'
        result is '{'
        very innerContent is ''
        very content is ast giv content
        much very i as 0 next i smaller content giv length next i more 1
            very entry is plz idx with content i

            very value is entry giv value
            value is plz toJS with value 20

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
        opLevel is 0
    but
        very success is false

        much very i as 0 next i smaller BINARY_OPS giv length next i more 1
            very info is plz idx with BINARY_OPS i
            very id is plz idx with info 0

            rly id is ast giv type
                opLevel is plz idx with info 2

                very a is ast giv a
                a is plz toJS with a opLevel

                very b is ast giv b
                b is plz toJS with b opLevel

                very jsOp is plz idx with info 1

                result is a + ' ' + jsOp + ' ' + b

                success is true
                bork
            wow
        wow

        much very i as 0 next i smaller SIMPLE_REASSIGNMENT_OPS giv length next i more 1
            very id is plz idx with SIMPLE_REASSIGNMENT_OPS i

            rly id is ast giv type
                very a is ast giv a
                a is plz toJS with a 20

                very b is ast giv b
                b is plz toJS with b 20

                result is a + ' ' + id + ' ' + b

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

    rly opLevel bigger parentOpLevel
        result is '(' + result + ')'
    wow
wow result

woof toJS
