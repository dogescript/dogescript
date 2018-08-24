var multiComment = false;
var multiLine = false;

var validOperators = {
    'is': ' === ',
    'not': ' !== ',
    'and':  ' && ',
    'or':  ' || ',
    'next':  '; ',
    'as':  ' = ',
    'more':  ' += ',
    'less':  ' -= ',
    'lots': ' *= ',
    'few': ' /= ',
    'very': ' var ',
    'smaller': ' < ',
    'bigger': ' > ',
    'smallerish': ' <= ',
    'biggerish': ' >= ',
    'notrly': ' ! ',
    'bigify': '++',
    'smallify': '--'
};

var assignOps = {
  'more': ' += ',
  'less': ' -= ',
  'lots': ' *= ',
  'few' : ' /= ',
  'is' : ' = '
}

var unaryOps = {
  'bigify': '++',
  'smallify': '--'
}

var controlFlowKeys = [
  'many',
  'much',
  'rly',
  'but',
  'notrly'
]

var valid = [
    'such',
    'wow',
    'wow&',
    'plz',
    '.plz',
    'dose',
    'very',
    'shh',
    'quiet',
    'loud',
    'rly',
    'notrly',
    'but',
    'many',
    'much',
    'so',
    'trained',
    'maybe',
    'pawse'
];

function containsUnary(keys)
{
  return unaryOps.hasOwnProperty(keys[0]) || unaryOps.hasOwnProperty(keys[1]);
}

var replacements = {};
replacements['dogeument']='document'
replacements['windoge']='window'
replacements['pawse']='debugger;'


module.exports = function parse (line) {

    // replace custom keywords
    Object.keys(replacements).forEach(function(key) {
        line = line.replace(new RegExp(key,'g'), replacements[key])
    });

    var keys = line.match(/'[^']+'|\S+/g);
    var statement = '';

    if (keys === null) return line + '\n';

    // not dogescript, such javascript
    if (valid.indexOf(keys[0]) === -1 && !assignOps.hasOwnProperty(keys[1]) && !containsUnary(keys) && keys[1] !== 'dose' || multiComment && keys[0] !== 'loud' || multiLine && keys[0] !== 'wow')
    {
      return line + '\n';
    }

    // trained use strict
    if (keys[0] === 'trained') {
        statement += '"use strict";\n';
    }

   // such function
    if (keys[0] === 'such') {
        statement += 'function ';
        statement += keys[1]; // set function name

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
        multiLine = false;
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
            if (keys[3] === 'obj') {
                statement += '{\n';
                multiLine = true;
            } else {
                statement += keys[3] + ';\n';
            }
        }
    }

    // support any kind of assignment operator
    var assignment = keys[1]
    if(assignOps.hasOwnProperty(assignment))
    {
      statement += keys[0] + assignOps[assignment];

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
        statement += '//';
        for (var i = 1; i < keys.length; i++) {
            statement += ' ' + keys[i];
        }
        statement += '\n';
    }

    // quiet start multi-line comment
    if (keys[0] === 'quiet') {
        statement += '/*';
        multiComment = true;
        for (var i = 1; i < keys.length; i++) {
            statement += ' ' + keys[i];
        }
        statement += '\n';
    }

    // loud end multi-line comment
    if (keys[0] === 'loud') {
        statement += '*/';
        multiComment = false;
        for (var i = 1; i < keys.length; i++) {
            statement += ' ' + keys[i];
        }
        statement += '\n';
    }

    var operatorParser = function (key) {
        if (validOperators.hasOwnProperty(key)) {
            statement += validOperators[key];
            return true;
        }
        else {
            return false;
        }
    }

    // parses inner operators for rly/notrly/but/
    var controlFlowParser = function(keyStart, keys)

    {
      for (var i = keyStart; i < keys.length; i++) {
          var parsed = operatorParser(keys[i]);
          if (parsed) continue;
          statement += keys[i] + ' ';
      }
    }

    // rly if
    if (keys[0] === 'rly') {
        statement += 'if (';
        controlFlowParser(1, keys);
        statement += ') {\n';
    }

    // ntrly if
    if (keys[0] === 'notrly')
    {
      statement += 'if (!';
      controlFlowParser(1, keys);
      statement += ') {\n';
    }

    // but else
    if (keys[0] === 'but') {
        if (keys[1] === 'rly') {
          statement += '} else if (';
          controlFlowParser(2, keys);
          statement += ') {\n';
        } else if (keys[1] === 'notrly') {
            statement += '} else if (!';
            controlFlowParser(2, keys);
            statement+= ') {\n';
        } else {
          statement += '} else {\n';
        }
    }

    // many while
    if (keys[0] === 'many') {
        statement += 'while (';
        controlFlowParser(1, keys);
        statement += ') {\n';
    }

    // much for
    if (keys[0] === 'much') {
        statement += 'for (';
        controlFlowParser(1, keys);
        statement += ') {\n';
    }

    // so require (thanks @maxogden!)
    if (keys[0] === 'so') {
        if (keys[2] === 'as') {
            statement += 'var ' + keys[3] + ' = require(\'' + keys[1] + '\');\n';
        } else {
            // try to make a simple name
            var mod = keys[1];
            // test for relative module, optional chop extension
            var m = /^..?\/.*?([\w-]+)(\.\w+)?$/.exec(mod);
            if (m) {
                mod = m[1];
            }
            mod = mod.replace(/-/g, '_');
            statement += 'var ' + mod + ' = require(\'' + keys[1] + '\');\n';
        }
    }

    // maybe boolean operator
    if (keys[0] === 'maybe') {
        statement += '(!!+Math.round(Math.random()))';
    }

    // standalone increment/decrement
    if(unaryOps.hasOwnProperty(keys[0]) || unaryOps.hasOwnProperty(keys[1]))
    {
      // ignore operators that should have been snagged by control flow elements
      if(controlFlowKeys.indexOf(keys[0]) === -1)
      {
        // pre
        if(unaryOps.hasOwnProperty(keys[0]))
        {
          statement += unaryOps[keys[0]] + keys[1]
        }
        else {
          statement += keys[0] + unaryOps[keys[1]]
        }
      }
    }

    return statement;
}
