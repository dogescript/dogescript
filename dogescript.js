#!/usr/bin/env node

var fs   = require('fs');
var argv = require('optimist').usage('Usage: dogescript <file>').demand(1).argv;
var es   = require('event-stream');
var _    = require('lodash');


var indentLevel = 0;
var parser = function (line) {
    var keys = line.split(/[ \t]/);
    var valid = ['such', 'wow', 'plz', 'very', 'shh'];
    var statement = '';

    if (indentLevel > 0) {
        keys = _.remove(keys, function (key) { return key !== ''; });
        for (var i = 0; i < indentLevel; i++) {
            statement += ' ';
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if ((keys[i].charAt(0) === '\'' || keys[i].charAt(0) === '[' || keys[i].charAt(0) === '{') && keys[i + 1]) {
            var dupe = keys.slice(0); // .slice(0) duplicates an array
            for (var j = i + 1; j < dupe.length; j++) {
                keys[i] += ' ' + dupe[j];
                keys.splice(j, 1);
            }
        } else {
            continue;
        }
    }

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
            statement += ' () { \n'
        }
    }

    // wow end function
    if (keys[0] === 'wow') {
        indentLevel -= 4;
        statement = statement.replace('    ', '');
        statement += '} \n'
    }

    // plz execute function
    if (keys[0] === 'plz') {
        if (keys[1] === 'console.loge') keys[1] = 'console.log';
        if (keys[2] === 'with') {
            statement += keys[1] + '(';
            for (var i = 3; i < keys.length; i++) {
                statement += keys[i];
                if (i !== keys.length - 1) statement += ', '
            }
            statement += ');\n'
        } else {
            statement += keys[1] + '();\n';
        }
    }

    // very variable
    if (keys[0] === 'very') {
        statement += 'var ' + keys[1] + ' = ' + keys[3] + ';\n'
    }

    // shh comment
    if (keys[0] === 'shh') {
        statement += '// '
        for (var i = 1; i < keys.length; i++) {
            statement += keys[i] + ' ';
        }
        statement += '\n'
    }

    // not dogescript, such javascript
    if (valid.indexOf(keys[0]) === -1) return line.replace('	', '    ') + '\n';

    return statement;
}

fs.createReadStream(__dirname + '/' + argv._[0])
    .pipe(es.split())
    .pipe(es.mapSync(parser))
    .pipe(process.stdout);
