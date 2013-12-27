var multiComment = false;

module.exports = function parse (line) {
    //replace dogeument and windoge always
    line = line.replace(/dogeument/g, 'document').replace(/windoge/g, 'window');

    var keys = line.match(/'[^']+'|\S+/g);
    var valid = ['such', 'wow', 'wow&', 'plz', '.plz', 'dose', 'very', 'shh', 'quiet', 'loud', 'rly', 'but', 'many', 'much', 'so', 'trained'];
    var validKeys = {'is': ' === ', 'not': ' !== ', 'and':  ' && ', 'or':  ' || ', 'next':  '; ', 'as':  ' = ', 'more':  ' += ', 'less':  ' -= ', 'lots': ' *= ', 'few': ' /= ', 'very': ' var ', 'smaller': ' < ', 'bigger': ' > ', 'smallerish': ' <= ', 'biggerish': ' >= ', 'notrly': ' ! '};
    var statement = '';

    if (keys === null) return line + '\n';

    // not dogescript, such javascript
    if (valid.indexOf(keys[0]) === -1 && keys[1] !== 'is' && keys[1] !== 'dose' || multiComment && keys[0] !== 'loud') return line + '\n';

    // trained use strict
    if (keys[0] === 'trained') {
        statement += '"use strict";\n';
    }

    // such function
    if (keys[0] === 'such') {
        statement += 'function ' + keys[1];
        if (keys[2] === 'much') {
            statement += ' (';
            for (var i = 3; i < keys.length; i++) {
                statement += keys[i];
                if (i !== keys.length - 1) statement += ', ';
            }
            statement += ') { \n';
        } else {
            statement += ' () { \n';
        }
    }

    // wow end function and return
    if (keys[0] === 'wow' || keys[0] === 'wow&') {
       if (typeof keys[1] !== 'undefined') {
            statement += 'return';
            for (var i = 1; i < keys.length; i++) {
                statement += ' ' + keys[i];
            }
            statement += ';\n';
            if (keys[0] === 'wow&') statement += '}) \n';
            else statement += '} \n';
        } else if (keys[0] === 'wow&') {
            statement += '}) \n';
        } else {
            statement += '} \n';
        }
    }

    // plz execute function
    if (keys[0] === 'plz' || keys[0] === '.plz' || keys[0] === 'dose' || keys[1] === 'dose') {
        if (keys[1] === 'dose') statement += keys.shift();
        if (keys[0].charAt(0) === '.' || keys[0] === 'dose') statement += '.';
        if (keys[1] === 'console.loge' || keys[1] === 'loge') keys[1] = keys[1].slice(0, -1);
        if (keys[2] === 'with') {
            statement += keys[1] + '(';
            dupe = keys.slice(0);
            for (var i = 3; i < keys.length; i++) {
                if (keys[i] === ',' || keys[i] === '&') continue;
                if (keys[i] === 'much') { // lambda functions - thanks @00Davo!

                    statement += 'function (';
                    if (keys[i + 1]) {
                        for (var j = i + 1; j < keys.length; j++) {
                            statement += keys[j];
                            if (j !== keys.length - 1) statement += ', ';
                        }
                        statement += ') {\n';
                        return statement;
                    } else {
                        statement += ') {\n';
                        return statement;
                    }
                }
                if (keys[i].substr(-1) === '&' || keys[i].substr(-1) === ',') keys[i] = keys[i].slice(0, -1);
                statement += keys[i];
                if (keys[i].substr(-1) === ':') statement += ' ';
                if (i !== keys.length - 1 && keys[i].substr(-1) !== ':') statement += ', ';
            }
            if (statement.substr(-2) === ', ') statement = statement.slice(0, -2);
            if (statement.substr(-3) === ', ]' || statement.substr(-3) === ', }' ) statement = statement.replace(statement.substr(-3), statement.substr(-1));
            if (dupe[keys.length - 1].slice(-1) === '&') statement += ')\n';
            else statement += ');\n';
        } else {
            if (keys[1].slice(-1) === '&') {
                keys[1] = keys[1].slice(0, -1);
                statement += keys[1] + '()\n';
            } else {
                statement += keys[1] + '();\n';
            }
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
                    if (keys[i].substr(-1) === ',' && keys[i].charAt(keys[i].length - 2) !== '}') keys[i] = keys[i].slice(0, -1);
                    statement += keys[i];
                    if (i !== keys.length - 1) statement += ', ';
                }
            }
            statement += ');\n';
            return statement;
        }
        if (keys[3] === 'much') {
            statement += 'function ';
            if (keys[4]) {
                statement += '(';
                for (var i = 4; i < keys.length; i++) {
                    statement += keys[i];
                    if (i !== keys.length - 1) statement += ', ';
                }
                statement += ') { \n';
            } else {
                statement += ' () { \n';
            }
            return statement;
        }
        if (keys.length > 4) {
            var recurse = '';
            for (var i = 3; i < keys.length; i++) {
                if (keys[i].substr(-1) === ',' && keys[i].charAt(keys[i].length - 2) !== '}') keys[i] = keys[i].slice(0, -1);
                recurse += keys[i] + ' ';
            }
            if (valid.indexOf(keys[3]) !== -1 || (keys[4] === 'is' || keys[4] === 'dose')) statement += parse(recurse);
            else statement += recurse + ';\n';
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
                    if (i !== keys.length - 1) statement += ', ';
                }
            }
            statement += ');\n';
            return statement;
        }
        if (keys.length > 2) {
            var recurse = '';
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
        statement += '// ';
        for (var i = 1; i < keys.length; i++) {
            statement += keys[i] + ' ';
        }
        statement += '\n';
    }

    // quiet start multi-line comment
    if (keys[0] === 'quiet') {
        statement += '/* ';
        multiComment = true;
        for (var i = 1; i < keys.length; i++) {
            statement += keys[i] + ' ';
        }
        statement += '\n';
    }

    // loud end multi-line comment
    if (keys[0] === 'loud') {
        statement += '*/ ';
        multiComment = false;
        for (var i = 1; i < keys.length; i++) {
            statement += keys[i] + ' ';
        }
        statement += '\n';
    }

    var keyParser = function (key) {
        if (validKeys[key]) {
            statement += validKeys[key];
            return true;
        } else {
            return false;
        }
    }

    // rly if
    if (keys[0] === 'rly') {
        statement += 'if (';
        for (var i = 1; i < keys.length; i++) {
            var parsed = keyParser(keys[i]);
            if (parsed) continue;
            statement += keys[i] + ' ';
        }
        statement += ') {\n';
    }

    // but else
    if (keys[0] === 'but') {
        if (keys[1] === 'rly') {
          statement += '} else if (';
          for (var i = 2; i < keys.length; i++) {
              var parsed = keyParser(keys[i]);
              if (parsed) continue;
              statement += keys[i] + ' ';
          }
          statement += ') {\n';
        } else {
          statement += '} else {\n';
        }
    }

    // many while
    if (keys[0] === 'many') {
        statement += 'while (';
        for (var i = 1; i < keys.length; i++) {
            var parsed = keyParser(keys[i]);
            if (parsed) continue;
            statement += keys[i] + ' ';
        }
        statement += ') {\n';
    }

    // much for
    if (keys[0] === 'much') {
        statement += 'for (';
        for (var i = 1; i < keys.length; i++) {
            var parsed = keyParser(keys[i]);
            if (parsed) continue;
            statement += keys[i] + ' ';
        }
        statement += ') {\n';
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
