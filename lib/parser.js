var remove = require('lodash.remove');

var indentLevel = 0;
module.exports = function parse (line) {
    var keys = line.match(/'[^']+'|\S+/g);
    var valid = ['such', 'wow', 'plz', '.plz', 'very', 'shh', 'rly', 'many', 'much', 'so'];
    var statement = '';

    if (keys === null) return line + '\n'

    // indent level
    if (indentLevel > 0) {
        keys = remove(keys, function (key) { return key !== ''; });
        for (var i = 0; i < indentLevel; i++) {
            statement += ' ';
        }
    }

    // combine arrays and objects with spaces in them
    for (var i = 0; i < keys.length; i++) {
        keys[i] = keys[i].replace('	', '    ');
        if (( keys[i].charAt(0) === '[' || keys[i].charAt(0) === '{') && keys[i + 1] ) {
            var dupe = keys.slice(0); // .slice(0) duplicates an array
            for (var j = i + 1; j < dupe.length; j++) {
                keys[i] += ' ' + dupe[j];
                keys.splice(j, 1);
                if (keys[keys.length - 1] === ']' || keys[keys.length - 1] === '}') keys.splice(keys.length - 1, 1);
            }
        } else {
            continue;
        }
    }

    // not dogescript, such javascript
    if (valid.indexOf(keys[0]) === -1 && keys[1] !== 'is') return line + '\n';

    // such function
    if (keys[0] === 'such') {
        indentLevel += 4;
        statement += 'function ' + keys[1];

        if (keys[2] === 'much') {
            statement += ' ('
            for (var i = 3; i < keys.length; i++) {
                statement += keys[i];
                if (i !== keys.length - 1) statement += ', '
            }
            statement += ') { \n';
        } else {
            statement += ' () { \n';
        }
    }

    // wow end function and return 
    if (keys[0] === 'wow') {
        if (keys[1]) {
            statement += 'return'
            for (var i = 1; i < keys.length; i++) {
                statement += ' ' + keys[i];
            }
            statement += ';\n'
            indentLevel -= 4;
            statement += '} \n';
        } else {
            indentLevel -= 4;
            statement = statement.substr(0, 4);
            statement = statement.replace('	', '');
            statement += '} \n';
        }
    }

    // plz execute function
    if (keys[0] === 'plz' || keys[0] === '.plz') {
        if (keys[0].charAt(0) === '.') statement += '.';
        if (keys[1] === 'console.loge') keys[1] = 'console.log';
        if (keys[2] === 'with') {
            statement += keys[1] + '(';
            dupe = keys.slice(0);
            for (var i = 3; i < keys.length; i++) {
                if (keys[i] === ',' || keys[i] === '&') continue;
                if (keys[i].substr(-1) === '&' || keys[i].substr(-1) === ',') keys[i] = keys[i].slice(0, -1);
                statement += keys[i];
                if (i !== keys.length - 1) statement += ', '
            }
            if (statement.substr(-2) === ', ') statement = statement.slice(0, -2);
            if (dupe[keys.length - 1].slice(-1) === '&') statement += ')\n'
            else statement += ');\n';
        } else {
            statement += keys[1] + '();\n';
        }
    }

    // very new variable
    if (keys[0] === 'very') {
        statement += 'var ' + keys[1] + ' = ';
        if (keys[3] === 'new') {
            statement += 'new ' + keys[4] + '(';
            if (keys[5] === 'with') {
                for (var i = 6; i < keys.length; i++) {
                    if (keys[i] === ',') continue;
                    if (keys[i].substr(-1) === ',') keys[i] = keys[i].slice(0, -1);
                    statement += keys[i];
                    if (i !== keys.length - 1) statement += ', '
                }
            }
            statement += ');\n'
            return statement;
        }
        if (keys.length > 3) {
            var recurse = ''
            for (var i = 3; i < keys.length; i++) {
                if (keys[i].substr(-1) === ',') keys[i] = keys[i].slice(0, -1);
                recurse += keys[i] + ' ';
            }
            statement += parse(recurse);
        } else {
            statement += keys[3] + ';\n';
        }
    }

    // is existing variable
    if (keys[1] === 'is') {
        statement += keys[0] + ' = ';
        if (keys[2] === 'new') {
            statement += 'new ' + keys[3] + '(';
            if (keys[4] === 'with') {
                for (var i = 5; i < keys.length; i++) {
                    if (keys[i] === ',') continue;
                    statement += keys[i];
                    if (i !== keys.length - 1) statement += ', '
                }
            }
            statement += ');\n'
            return statement;
        }
        if (keys.length > 2) {
            var recurse = ''
            for (var i = 2; i < keys.length; i++) {
                recurse += keys[i] + ' ';
            }
            statement += parse(recurse);
        } else {
            statement += keys[2] + ';\n';
        }
    } 

    // shh comment
    if (keys[0] === 'shh') {
        statement += '// '
        for (var i = 1; i < keys.length; i++) {
            statement += keys[i] + ' ';
        }
        statement += '\n';
    }

    // rly if
    if (keys[0] === 'rly') {
        indentLevel += 4;
        statement += 'if (';
        for (var i = 1; i < keys.length; i++) {
            if (keys[i] === 'is') {
                statement += ' === ';
                continue;
            } else if (keys[i] === 'not') {
                statement += ' !== ';
                continue;
            } else if (keys[i] === 'and') {
                statement += ' && ';
                continue;
            } else if (keys[i] === 'or') {
                statement += ' || ';
                continue;
            }
            statement += keys[i];
        }
        statement += ') {\n'
    }

    // many while
    if (keys[0] === 'many') {
        indentLevel += 4;
        statement += 'while (';
        for (var i = 1; i < keys.length; i++) {
            if (keys[i] === 'is') {
                statement += ' === ';
                continue;
            } else if (keys[i] === 'not') {
                statement += ' !== ';
                continue;
            } else if (keys[i] === 'and') {
                statement += ' && ';
                continue;
            } else if (keys[i] === 'or') {
                statement += ' || ';
                continue;
            }
            statement += keys[i];
        }
        statement += ') {\n'
    }

    // much for
    if (keys[0] === 'much') {
        indentLevel += 4;
        statement += 'for (';
        for (var i = 1; i < keys.length; i++) {
            if (keys[i] === 'is') {
                statement += ' === ';
                continue;
            } else if (keys[i] === 'not') {
                statement += ' !== ';
                continue;
            } else if (keys[i] === 'and') {
                statement += ' && ';
                continue;
            } else if (keys[i] === 'or') {
                statement += ' || ';
                continue;
            } else if (keys[i] === "next") {
                statement += '; '
                continue;
            } else if (keys[i] === 'as') {
                statement += ' = '
                continue;
            } else if (keys[i] === 'more') {
                statement += ' += '
                continue;
            } else if (keys[i] === 'less') {
                statement += ' -= '
                continue;
            } else if (keys[i] === 'lots') {
                statement += ' *= '
                continue;
            } else if (keys[i] === 'few') {
                statement += ' /= '
                continue;
            }
            statement += keys[i];
        }
        statement += ') {\n'
    }

    // so require (thanks @maxogden!)
    if (keys[0] === 'so') {
        if (keys[2] === 'as') {
            statement += 'var ' + keys[3] + ' = require(\'' + keys[1] + '\');\n';
        } else {
            statement += 'var ' + keys[1] + ' = require(\'' + keys[1] + '\');\n';
        }
    }

    return statement;
}