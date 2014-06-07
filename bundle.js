(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dogescript = require('dogescript');
var loadText = require('./loader');

var input  = document.getElementById('dogescript');
var output = document.getElementById('javascript');

var editor = new Behave({
    textarea: input,
    replaceTab: true,
    softTabs: true,
    tabSize: 4,
    autoOpen: true,
    overwrite: true,
    autoStrip: true,
    autoIndent: true,
    fence: false
});

BehaveHooks.add('keyup', function(data){
    output.value = dogescript(input.value, true);
});

function fixSize() {
    var top = input.getBoundingClientRect().top + document.body.scrollTop;
    var height = (window.innerHeight - top - 10) + 'px';
    input.style.height = height;
    output.style.height = height; 
}

fixSize();

var debounce = 0;

window.addEventListener('resize', function(e) {
    if (debounce) {
        debounce = clearTimeout(debounce);
    }
    debounce = setTimeout(fixSize, 50);
});

loadText('demo.djs', function(err, content) {
    if (err) {
        console.log(err);
        input.value = 'ssh error loading demo';
    }
    else {
        input.value = content;
    }
    output.value = dogescript(input.value, true);
});

},{"./loader":2,"dogescript":3}],2:[function(require,module,exports){
function getXHR() {
    if (XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    try  {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
    } catch (e) {
    }
    try  {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
    } catch (e) {
    }
    try  {
        return new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
    }
    throw new Error('This browser does not support XMLHttpRequest.');
}

function loadText(url, callback) {
    try  {
        var xhr = getXHR();
    } catch (e) {
        callback(e, null);
        return;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(null, xhr.responseText);
        }
    };

    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(null);
}

module.exports = loadText;

},{}],3:[function(require,module,exports){
/**
 * dogescript - wow so syntax such language
 *
 * Copyright (c) 2013 Zach Bruggeman
 *
 * dogescript is licensed under the MIT License.
 *
 * @package dogescript
 * @author  Zach Bruggeman <talkto@zachbruggeman.me>
 */

var beautify = require('js-beautify').js_beautify;

var parser   = require('./lib/parser');

module.exports = function (file, beauty, dogeMode) {
    if (dogeMode) var lines = file.split(/ {3,}|\r?\n/);
    else var lines = file.split(/\r?\n/);
    var script = '';

    for (var i = 0; i < lines.length; i++) {
        script += parser(lines[i]);
    }

    if (beauty) return beautify(script)
    else return script;
}

},{"./lib/parser":4,"js-beautify":5}],4:[function(require,module,exports){
var multiComment = false;

module.exports = function parse (line) {
    //replace dogeument and windoge always
    line = line.replace(/dogeument/g, 'document').replace(/windoge/g, 'window');

    var keys = line.match(/'[^']+'|\S+/g);
    var valid = ['such', 'wow', 'wow&', 'plz', '.plz', 'dose', 'very', 'shh', 'quiet', 'loud', 'rly', 'but', 'many', 'much', 'so', 'trained', 'maybe'];
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

    // maybe boolean operator
    if (keys[0] === 'maybe') {
        statement += '(!!+Math.round(Math.random()))';
    }
    return statement;
}

},{}],5:[function(require,module,exports){
/**
The following batches are equivalent:

var beautify_js = require('js-beautify');
var beautify_js = require('js-beautify').js;
var beautify_js = require('js-beautify').js_beautify;

var beautify_css = require('js-beautify').css;
var beautify_css = require('js-beautify').css_beautify;

var beautify_html = require('js-beautify').html;
var beautify_html = require('js-beautify').html_beautify;

All methods returned accept two arguments, the source string and an options object.
**/
var js_beautify = require('./lib/beautify').js_beautify;
var css_beautify = require('./lib/beautify-css').css_beautify;
var html_beautify = require('./lib/beautify-html').html_beautify;

// the default is js
var beautify = function (src, config) {
    return js_beautify(src, config);
};

// short aliases
beautify.js   = js_beautify;
beautify.css  = css_beautify;
beautify.html = html_beautify;

// legacy aliases
beautify.js_beautify   = js_beautify;
beautify.css_beautify  = css_beautify;
beautify.html_beautify = html_beautify;

module.exports = beautify;

},{"./lib/beautify":8,"./lib/beautify-css":6,"./lib/beautify-html":7}],6:[function(require,module,exports){
(function (global){
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                   — indentation size,
        indent_char (space)               — character to indent with,
        selector_separator_newline (true) - separate selectors with newline or
                                            not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)          - end with a newline

    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
    });
*/

// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/

(function () {
    function css_beautify(source_text, options) {
        options = options || {};
        var indentSize = options.indent_size || 4;
        var indentCharacter = options.indent_char || ' ';
        var selectorSeparatorNewline = true;
        if (options.selector_separator_newline != undefined)
            selectorSeparatorNewline = options.selector_separator_newline;
        var endWithNewline = options.end_with_newline || false;

        // compatibility
        if (typeof indentSize === "string") {
            indentSize = parseInt(indentSize, 10);
        }


        // tokenizer
        var whiteRe = /^\s+$/;
        var wordRe = /[\w$\-_]/;

        var pos = -1,
            ch;

        function next() {
            ch = source_text.charAt(++pos);
            return ch;
        }

        function peek() {
            return source_text.charAt(pos + 1);
        }

        function eatString(endChar) {
            var start = pos;
            while (next()) {
                if (ch === "\\") {
                    next();
                    next();
                } else if (ch === endChar) {
                    break;
                } else if (ch === "\n") {
                    break;
                }
            }
            return source_text.substring(start, pos + 1);
        }

        function eatWhitespace() {
            var start = pos;
            while (whiteRe.test(peek())) {
                pos++;
            }
            return pos !== start;
        }

        function skipWhitespace() {
            var start = pos;
            do {} while (whiteRe.test(next()));
            return pos !== start + 1;
        }

        function eatComment() {
            var start = pos;
            next();
            while (next()) {
                if (ch === "*" && peek() === "/") {
                    pos++;
                    break;
                }
            }

            return source_text.substring(start, pos + 1);
        }


        function lookBack(str) {
            return source_text.substring(pos - str.length, pos).toLowerCase() ===
                str;
        }

        // printer
        var indentString = source_text.match(/^[\r\n]*[\t ]*/)[0];
        var singleIndent = Array(indentSize + 1).join(indentCharacter);
        var indentLevel = 0;

        function indent() {
            indentLevel++;
            indentString += singleIndent;
        }

        function outdent() {
            indentLevel--;
            indentString = indentString.slice(0, -indentSize);
        }

        var print = {};
        print["{"] = function (ch) {
            print.singleSpace();
            output.push(ch);
            print.newLine();
        };
        print["}"] = function (ch) {
            print.newLine();
            output.push(ch);
            print.newLine();
        };

        print._lastCharWhitespace = function () {
            return whiteRe.test(output[output.length - 1]);
        }

        print.newLine = function (keepWhitespace) {
            if (!keepWhitespace) {
                while (print._lastCharWhitespace()) {
                    output.pop();
                }
            }

            if (output.length) {
                output.push('\n');
            }
            if (indentString) {
                output.push(indentString);
            }
        };
        print.singleSpace = function () {
            if (output.length && !print._lastCharWhitespace()) {
                output.push(' ');
            }
        };
        var output = [];
        if (indentString) {
            output.push(indentString);
        }
        /*_____________________--------------------_____________________*/

        var insideRule = false;
        while (true) {
            var isAfterSpace = skipWhitespace();

            if (!ch) {
                break;
            } else if (ch === '/' && peek() === '*') { // comment
                print.newLine();
                output.push(eatComment(), "\n", indentString);
                var header = lookBack("")
                if (header) {
                    print.newLine();
                }
            } else if (ch === '{') {
                eatWhitespace();
                if (peek() == '}') {
                    next();
                    output.push(" {}");
                } else {
                    indent();
                    print["{"](ch);
                }
            } else if (ch === '}') {
                outdent();
                print["}"](ch);
                insideRule = false;
            } else if (ch === ":") {
                eatWhitespace();
                output.push(ch, " ");
                insideRule = true;
            } else if (ch === '"' || ch === '\'') {
                output.push(eatString(ch));
            } else if (ch === ';') {
                output.push(ch, '\n', indentString);
            } else if (ch === '(') { // may be a url
                if (lookBack("url")) {
                    output.push(ch);
                    eatWhitespace();
                    if (next()) {
                        if (ch !== ')' && ch !== '"' && ch !== '\'') {
                            output.push(eatString(')'));
                        } else {
                            pos--;
                        }
                    }
                } else {
                    if (isAfterSpace) {
                        print.singleSpace();
                    }
                    output.push(ch);
                    eatWhitespace();
                }
            } else if (ch === ')') {
                output.push(ch);
            } else if (ch === ',') {
                eatWhitespace();
                output.push(ch);
                if (!insideRule && selectorSeparatorNewline) {
                    print.newLine();
                } else {
                    print.singleSpace();
                }
            } else if (ch === ']') {
                output.push(ch);
            } else if (ch === '[' || ch === '=') { // no whitespace before or after
                eatWhitespace();
                output.push(ch);
            } else {
                if (isAfterSpace) {
                    print.singleSpace();
                }

                output.push(ch);
            }
        }


        var sweetCode = output.join('').replace(/[\n ]+$/, '');

        // establish end_with_newline
        var should = endWithNewline;
        var actually = /\n$/.test(sweetCode)
        if (should && !actually)
            sweetCode += "\n";
        else if (!should && actually)
            sweetCode = sweetCode.slice(0, -1);

        return sweetCode;
    }

    if (typeof define === "function") {
        // Add support for require.js
        define(function (require, exports, module) {
            exports.css_beautify = css_beautify;
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
        exports.css_beautify = css_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.css_beautify = css_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.css_beautify = css_beautify;
    }

}());
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u'],
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false
    });
*/

(function() {

    function trim(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }

    function ltrim(s) {
        return s.replace(/^\s+/g, '');
    }

    function style_html(html_source, options, js_beautify, css_beautify) {
        //Wrapper function to invoke all the necessary constructors and deal with the output.

        var multi_parser,
            indent_inner_html,
            indent_size,
            indent_character,
            wrap_line_length,
            brace_style,
            unformatted,
            preserve_newlines,
            max_preserve_newlines;

        options = options || {};

        // backwards compatibility to 1.3.4
        if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) &&
                (options.max_char === undefined || parseInt(options.max_char, 10) === 0)) {
            options.wrap_line_length = options.max_char;
        }

        indent_inner_html = options.indent_inner_html || false;
        indent_size = parseInt(options.indent_size || 4, 10);
        indent_character = options.indent_char || ' ';
        brace_style = options.brace_style || 'collapse';
        wrap_line_length =  parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
        unformatted = options.unformatted || ['a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        preserve_newlines = options.preserve_newlines || true;
        max_preserve_newlines = preserve_newlines ? parseInt(options.max_preserve_newlines || 32786, 10) : 0;
        indent_handlebars = options.indent_handlebars || false;

        function Parser() {

            this.pos = 0; //Parser position
            this.token = '';
            this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
            this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
                parent: 'parent1',
                parentcount: 1,
                parent1: ''
            };
            this.tag_type = '';
            this.token_text = this.last_token = this.last_text = this.token_type = '';
            this.newlines = 0;
            this.indent_content = indent_inner_html;

            this.Utils = { //Uilities made available to the various functions
                whitespace: "\n\r\t ".split(''),
                single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(','), //all the single tags for HTML
                extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
                in_array: function(what, arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (what === arr[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            };

            this.traverse_whitespace = function() {
                var input_char = '';

                input_char = this.input.charAt(this.pos);
                if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                    this.newlines = 0;
                    while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                        if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
                            this.newlines += 1;
                        }

                        this.pos++;
                        input_char = this.input.charAt(this.pos);
                    }
                    return true;
                }
                return false;
            };

            this.get_content = function() { //function to capture regular content between tags

                var input_char = '',
                    content = [],
                    space = false; //if a space is needed

                while (this.input.charAt(this.pos) !== '<') {
                    if (this.pos >= this.input.length) {
                        return content.length ? content.join('') : ['', 'TK_EOF'];
                    }

                    if (this.traverse_whitespace()) {
                        if (content.length) {
                            space = true;
                        }
                        continue; //don't want to insert unnecessary space
                    }

                    if (indent_handlebars) {
                        // Handlebars parsing is complicated.
                        // {{#foo}} and {{/foo}} are formatted tags.
                        // {{something}} should get treated as content, except:
                        // {{else}} specifically behaves like {{#if}} and {{/if}}
                        var peek3 = this.input.substr(this.pos, 3);
                        if (peek3 === '{{#' || peek3 === '{{/') {
                            // These are tags and not content.
                            break;
                        } else if (this.input.substr(this.pos, 2) === '{{') {
                            if (this.get_tag(true) === '{{else}}') {
                                break;
                            }
                        }
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (space) {
                        if (this.line_char_count >= this.wrap_line_length) { //insert a line when the wrap_line_length is reached
                            this.print_newline(false, content);
                            this.print_indentation(content);
                        } else {
                            this.line_char_count++;
                            content.push(' ');
                        }
                        space = false;
                    }
                    this.line_char_count++;
                    content.push(input_char); //letter at-a-time (or string) inserted to an array
                }
                return content.length ? content.join('') : '';
            };

            this.get_contents_to = function(name) { //get the full content of a script or style to pass to js_beautify
                if (this.pos === this.input.length) {
                    return ['', 'TK_EOF'];
                }
                var input_char = '';
                var content = '';
                var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
                reg_match.lastIndex = this.pos;
                var reg_array = reg_match.exec(this.input);
                var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
                if (this.pos < end_script) { //get everything in between the script tags
                    content = this.input.substring(this.pos, end_script);
                    this.pos = end_script;
                }
                return content;
            };

            this.record_tag = function(tag) { //function to record a tag and its parent in this.tags Object
                if (this.tags[tag + 'count']) { //check for the existence of this tag type
                    this.tags[tag + 'count']++;
                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
                } else { //otherwise initialize this tag type
                    this.tags[tag + 'count'] = 1;
                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
                }
                this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
                this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
            };

            this.retrieve_tag = function(tag) { //function to retrieve the opening tag to the corresponding closer
                if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
                    var temp_parent = this.tags.parent; //check to see if it's a closable tag.
                    while (temp_parent) { //till we reach '' (the initial value);
                        if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
                            break;
                        }
                        temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
                    }
                    if (temp_parent) { //if we caught something
                        this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
                        this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
                    }
                    delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
                    delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
                    if (this.tags[tag + 'count'] === 1) {
                        delete this.tags[tag + 'count'];
                    } else {
                        this.tags[tag + 'count']--;
                    }
                }
            };

            this.indent_to_tag = function(tag) {
                // Match the indentation level to the last use of this tag, but don't remove it.
                if (!this.tags[tag + 'count']) {
                    return;
                }
                var temp_parent = this.tags.parent;
                while (temp_parent) {
                    if (tag + this.tags[tag + 'count'] === temp_parent) {
                        break;
                    }
                    temp_parent = this.tags[temp_parent + 'parent'];
                }
                if (temp_parent) {
                    this.indent_level = this.tags[tag + this.tags[tag + 'count']];
                }
            };

            this.get_tag = function(peek) { //function to get a full tag and parse its type
                var input_char = '',
                    content = [],
                    comment = '',
                    space = false,
                    tag_start, tag_end,
                    tag_start_char,
                    orig_pos = this.pos,
                    orig_line_char_count = this.line_char_count;

                peek = peek !== undefined ? peek : false;

                do {
                    if (this.pos >= this.input.length) {
                        if (peek) {
                            this.pos = orig_pos;
                            this.line_char_count = orig_line_char_count;
                        }
                        return content.length ? content.join('') : ['', 'TK_EOF'];
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
                        space = true;
                        continue;
                    }

                    if (input_char === "'" || input_char === '"') {
                        input_char += this.get_unformatted(input_char);
                        space = true;

                    }

                    if (input_char === '=') { //no space before =
                        space = false;
                    }

                    if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
                        //no space after = or before >
                        if (this.line_char_count >= this.wrap_line_length) {
                            this.print_newline(false, content);
                            this.print_indentation(content);
                        } else {
                            content.push(' ');
                            this.line_char_count++;
                        }
                        space = false;
                    }

                    if (indent_handlebars && tag_start_char === '<') {
                        // When inside an angle-bracket tag, put spaces around
                        // handlebars not inside of strings.
                        if ((input_char + this.input.charAt(this.pos)) === '{{') {
                            input_char += this.get_unformatted('}}');
                            if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
                                input_char = ' ' + input_char;
                            }
                            space = true;
                        }
                    }

                    if (input_char === '<' && !tag_start_char) {
                        tag_start = this.pos - 1;
                        tag_start_char = '<';
                    }

                    if (indent_handlebars && !tag_start_char) {
                        if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] == '{') {
                            if (input_char === '#' || input_char === '/') {
                                tag_start = this.pos - 3;
                            } else {
                                tag_start = this.pos - 2;
                            }
                            tag_start_char = '{';
                        }
                    }

                    this.line_char_count++;
                    content.push(input_char); //inserts character at-a-time (or string)

                    if (content[1] && content[1] === '!') { //if we're in a comment, do something special
                        // We treat all comments as literals, even more than preformatted tags
                        // we just look for the appropriate close tag
                        content = [this.get_comment(tag_start)];
                        break;
                    }

                    if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
                        break;
                    }
                } while (input_char !== '>');

                var tag_complete = content.join('');
                var tag_index;
                var tag_offset;

                if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
                    tag_index = tag_complete.indexOf(' ');
                } else if (tag_complete[0] === '{') {
                    tag_index = tag_complete.indexOf('}');
                } else { //otherwise go with the tag ending
                    tag_index = tag_complete.indexOf('>');
                }
                if (tag_complete[0] === '<' || !indent_handlebars) {
                    tag_offset = 1;
                } else {
                    tag_offset = tag_complete[2] === '#' ? 3 : 2;
                }
                var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
                if (tag_complete.charAt(tag_complete.length - 2) === '/' ||
                    this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
                    if (!peek) {
                        this.tag_type = 'SINGLE';
                    }
                } else if (indent_handlebars && tag_complete[0] === '{' && tag_check === 'else') {
                    if (!peek) {
                        this.indent_to_tag('if');
                        this.tag_type = 'HANDLEBARS_ELSE';
                        this.indent_content = true;
                        this.traverse_whitespace();
                    }
                } else if (tag_check === 'script') { //for later script handling
                    if (!peek) {
                        this.record_tag(tag_check);
                        this.tag_type = 'SCRIPT';
                    }
                } else if (tag_check === 'style') { //for future style handling (for now it justs uses get_content)
                    if (!peek) {
                        this.record_tag(tag_check);
                        this.tag_type = 'STYLE';
                    }
                } else if (this.is_unformatted(tag_check, unformatted)) { // do not reformat the "unformatted" tags
                    comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function
                    content.push(comment);
                    // Preserve collapsed whitespace either before or after this tag.
                    if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)) {
                        content.splice(0, 0, this.input.charAt(tag_start - 1));
                    }
                    tag_end = this.pos - 1;
                    if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)) {
                        content.push(this.input.charAt(tag_end + 1));
                    }
                    this.tag_type = 'SINGLE';
                } else if (tag_check.charAt(0) === '!') { //peek for <! comment
                    // for comments content is already correct.
                    if (!peek) {
                        this.tag_type = 'SINGLE';
                        this.traverse_whitespace();
                    }
                } else if (!peek) {
                    if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
                        this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
                        this.tag_type = 'END';
                        this.traverse_whitespace();
                    } else { //otherwise it's a start-tag
                        this.record_tag(tag_check); //push it on the tag stack
                        if (tag_check.toLowerCase() !== 'html') {
                            this.indent_content = true;
                        }
                        this.tag_type = 'START';

                        // Allow preserving of newlines after a start tag
                        this.traverse_whitespace();
                    }
                    if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
                        this.print_newline(false, this.output);
                        if (this.output.length && this.output[this.output.length - 2] !== '\n') {
                            this.print_newline(true, this.output);
                        }
                    }
                }

                if (peek) {
                    this.pos = orig_pos;
                    this.line_char_count = orig_line_char_count;
                }

                return content.join(''); //returns fully formatted tag
            };

            this.get_comment = function(start_pos) { //function to return comment content in its entirety
                // this is will have very poor perf, but will work for now.
                var comment = '',
                    delimiter = '>',
                    matched = false;

                this.pos = start_pos;
                input_char = this.input.charAt(this.pos);
                this.pos++;

                while (this.pos <= this.input.length) {
                    comment += input_char;

                    // only need to check for the delimiter if the last chars match
                    if (comment[comment.length - 1] === delimiter[delimiter.length - 1] &&
                        comment.indexOf(delimiter) !== -1) {
                        break;
                    }

                    // only need to search for custom delimiter for the first few characters
                    if (!matched && comment.length < 10) {
                        if (comment.indexOf('<![if') === 0) { //peek for <![if conditional comment
                            delimiter = '<![endif]>';
                            matched = true;
                        } else if (comment.indexOf('<![cdata[') === 0) { //if it's a <[cdata[ comment...
                            delimiter = ']]>';
                            matched = true;
                        } else if (comment.indexOf('<![') === 0) { // some other ![ comment? ...
                            delimiter = ']>';
                            matched = true;
                        } else if (comment.indexOf('<!--') === 0) { // <!-- comment ...
                            delimiter = '-->';
                            matched = true;
                        }
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;
                }

                return comment;
            };

            this.get_unformatted = function(delimiter, orig_tag) { //function to return unformatted content in its entirety

                if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
                    return '';
                }
                var input_char = '';
                var content = '';
                var min_index = 0;
                var space = true;
                do {

                    if (this.pos >= this.input.length) {
                        return content;
                    }

                    input_char = this.input.charAt(this.pos);
                    this.pos++;

                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
                        if (!space) {
                            this.line_char_count--;
                            continue;
                        }
                        if (input_char === '\n' || input_char === '\r') {
                            content += '\n';
                            /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
                for (var i=0; i<this.indent_level; i++) {
                  content += this.indent_string;
                }
                space = false; //...and make sure other indentation is erased
                */
                            this.line_char_count = 0;
                            continue;
                        }
                    }
                    content += input_char;
                    this.line_char_count++;
                    space = true;

                    if (indent_handlebars && input_char === '{' && content.length && content[content.length - 2] === '{') {
                        // Handlebars expressions in strings should also be unformatted.
                        content += this.get_unformatted('}}');
                        // These expressions are opaque.  Ignore delimiters found in them.
                        min_index = content.length;
                    }
                } while (content.toLowerCase().indexOf(delimiter, min_index) === -1);
                return content;
            };

            this.get_token = function() { //initial handler for token-retrieval
                var token;

                if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
                    var type = this.last_token.substr(7);
                    token = this.get_contents_to(type);
                    if (typeof token !== 'string') {
                        return token;
                    }
                    return [token, 'TK_' + type];
                }
                if (this.current_mode === 'CONTENT') {
                    token = this.get_content();
                    if (typeof token !== 'string') {
                        return token;
                    } else {
                        return [token, 'TK_CONTENT'];
                    }
                }

                if (this.current_mode === 'TAG') {
                    token = this.get_tag();
                    if (typeof token !== 'string') {
                        return token;
                    } else {
                        var tag_name_type = 'TK_TAG_' + this.tag_type;
                        return [token, tag_name_type];
                    }
                }
            };

            this.get_full_indent = function(level) {
                level = this.indent_level + level || 0;
                if (level < 1) {
                    return '';
                }

                return Array(level + 1).join(this.indent_string);
            };

            this.is_unformatted = function(tag_check, unformatted) {
                //is this an HTML5 block-level link?
                if (!this.Utils.in_array(tag_check, unformatted)) {
                    return false;
                }

                if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
                    return true;
                }

                //at this point we have an  tag; is its first child something we want to remain
                //unformatted?
                var next_tag = this.get_tag(true /* peek. */ );

                // test next_tag to see if it is just html tag (no external content)
                var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);

                // if next_tag comes back but is not an isolated tag, then
                // let's treat the 'a' tag as having content
                // and respect the unformatted option
                if (!tag || this.Utils.in_array(tag, unformatted)) {
                    return true;
                } else {
                    return false;
                }
            };

            this.printer = function(js_source, indent_character, indent_size, wrap_line_length, brace_style) { //handles input/output and some other printing functions

                this.input = js_source || ''; //gets the input for the Parser
                this.output = [];
                this.indent_character = indent_character;
                this.indent_string = '';
                this.indent_size = indent_size;
                this.brace_style = brace_style;
                this.indent_level = 0;
                this.wrap_line_length = wrap_line_length;
                this.line_char_count = 0; //count to see if wrap_line_length was exceeded

                for (var i = 0; i < this.indent_size; i++) {
                    this.indent_string += this.indent_character;
                }

                this.print_newline = function(force, arr) {
                    this.line_char_count = 0;
                    if (!arr || !arr.length) {
                        return;
                    }
                    if (force || (arr[arr.length - 1] !== '\n')) { //we might want the extra line
                        arr.push('\n');
                    }
                };

                this.print_indentation = function(arr) {
                    for (var i = 0; i < this.indent_level; i++) {
                        arr.push(this.indent_string);
                        this.line_char_count += this.indent_string.length;
                    }
                };

                this.print_token = function(text) {
                    if (text || text !== '') {
                        if (this.output.length && this.output[this.output.length - 1] === '\n') {
                            this.print_indentation(this.output);
                            text = ltrim(text);
                        }
                    }
                    this.print_token_raw(text);
                };

                this.print_token_raw = function(text) {
                    if (text && text !== '') {
                        if (text.length > 1 && text[text.length - 1] === '\n') {
                            // unformatted tags can grab newlines as their last character
                            this.output.push(text.slice(0, -1));
                            this.print_newline(false, this.output);
                        } else {
                            this.output.push(text);
                        }
                    }

                    for (var n = 0; n < this.newlines; n++) {
                        this.print_newline(n > 0, this.output);
                    }
                    this.newlines = 0;
                };

                this.indent = function() {
                    this.indent_level++;
                };

                this.unindent = function() {
                    if (this.indent_level > 0) {
                        this.indent_level--;
                    }
                };
            };
            return this;
        }

        /*_____________________--------------------_____________________*/

        multi_parser = new Parser(); //wrapping functions Parser
        multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style); //initialize starting values

        while (true) {
            var t = multi_parser.get_token();
            multi_parser.token_text = t[0];
            multi_parser.token_type = t[1];

            if (multi_parser.token_type === 'TK_EOF') {
                break;
            }

            switch (multi_parser.token_type) {
                case 'TK_TAG_START':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        multi_parser.indent();
                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_STYLE':
                case 'TK_TAG_SCRIPT':
                    multi_parser.print_newline(false, multi_parser.output);
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_END':
                    //Print new line only if the tag has no content and has child
                    if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
                        var tag_name = multi_parser.token_text.match(/\w+/)[0];
                        var tag_extracted_from_last_output = null;
                        if (multi_parser.output.length) {
                            tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
                        }
                        if (tag_extracted_from_last_output === null ||
                            tag_extracted_from_last_output[1] !== tag_name) {
                            multi_parser.print_newline(false, multi_parser.output);
                        }
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_SINGLE':
                    // Don't add a newline before elements that should remain unformatted.
                    var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
                    if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
                        multi_parser.print_newline(false, multi_parser.output);
                    }
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_TAG_HANDLEBARS_ELSE':
                    multi_parser.print_token(multi_parser.token_text);
                    if (multi_parser.indent_content) {
                        multi_parser.indent();
                        multi_parser.indent_content = false;
                    }
                    multi_parser.current_mode = 'CONTENT';
                    break;
                case 'TK_CONTENT':
                    multi_parser.print_token(multi_parser.token_text);
                    multi_parser.current_mode = 'TAG';
                    break;
                case 'TK_STYLE':
                case 'TK_SCRIPT':
                    if (multi_parser.token_text !== '') {
                        multi_parser.print_newline(false, multi_parser.output);
                        var text = multi_parser.token_text,
                            _beautifier,
                            script_indent_level = 1;
                        if (multi_parser.token_type === 'TK_SCRIPT') {
                            _beautifier = typeof js_beautify === 'function' && js_beautify;
                        } else if (multi_parser.token_type === 'TK_STYLE') {
                            _beautifier = typeof css_beautify === 'function' && css_beautify;
                        }

                        if (options.indent_scripts === "keep") {
                            script_indent_level = 0;
                        } else if (options.indent_scripts === "separate") {
                            script_indent_level = -multi_parser.indent_level;
                        }

                        var indentation = multi_parser.get_full_indent(script_indent_level);
                        if (_beautifier) {
                            // call the Beautifier if avaliable
                            text = _beautifier(text.replace(/^\s*/, indentation), options);
                        } else {
                            // simply indent the string otherwise
                            var white = text.match(/^\s*/)[0];
                            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
                            var reindent = multi_parser.get_full_indent(script_indent_level - _level);
                            text = text.replace(/^\s*/, indentation)
                                .replace(/\r\n|\r|\n/g, '\n' + reindent)
                                .replace(/\s+$/, '');
                        }
                        if (text) {
                            multi_parser.print_token_raw(indentation + trim(text));
                            multi_parser.print_newline(false, multi_parser.output);
                        }
                    }
                    multi_parser.current_mode = 'TAG';
                    break;
            }
            multi_parser.last_token = multi_parser.token_type;
            multi_parser.last_text = multi_parser.token_text;
        }
        return multi_parser.output.join('');
    }

    if (typeof define === "function") {
        // Add support for require.js
        define(["./beautify.js", "./beautify-css.js"], function(js_beautify, css_beautify) {
            return {
              html_beautify: function(html_source, options) {
                return style_html(html_source, options, js_beautify, css_beautify);
              }
            };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
        var js_beautify = require('./beautify.js').js_beautify;
        var css_beautify = require('./beautify-css.js').css_beautify;

        exports.html_beautify = function(html_source, options) {
            return style_html(html_source, options, js_beautify, css_beautify);
        };
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.html_beautify = function(html_source, options) {
            return style_html(html_source, options, window.js_beautify, window.css_beautify);
        };
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.html_beautify = function(html_source, options) {
            return style_html(html_source, options, global.js_beautify, global.css_beautify);
        };
    }

}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./beautify-css.js":6,"./beautify.js":8}],8:[function(require,module,exports){
(function (global){
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy   !jslint_happy
            ---------------------------------
             function ()      function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/


(function() {
    function js_beautify(js_source_text, options) {
        "use strict";
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }

    function Beautifier(js_source_text, options) {
        "use strict";
        var input, output_lines;
        var token_text, token_type, last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var whitespace, wordchar, punct, parser_pos, line_starters, digits;
        var prefix;
        var input_wanted_newline;
        var output_wrapped, output_space_before_token;
        var input_length, n_newlines, whitespace_before_token;
        var handlers, MODE, opt;
        var preindent_string = '';

        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');

        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');

        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');

        MODE = {
            BlockStatement: 'BlockStatement', // 'BLOCK'
            Statement: 'Statement', // 'STATEMENT'
            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
            Conditional: 'Conditional', //'(COND-EXPRESSION)',
            Expression: 'Expression' //'(EXPRESSION)'
        };

        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TK_INLINE_COMMENT': handle_inline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown
        };

        function create_flags(flags_base, mode) {
            var next_indent_level = 0;
            if (flags_base) {
                next_indent_level = flags_base.indentation_level;
                next_indent_level += (flags_base.var_line && flags_base.var_line_reindented) ? 1 : 0;
                if (!just_added_newline() &&
                    flags_base.line_indent_level > next_indent_level) {
                    next_indent_level = flags_base.line_indent_level;
                }
            }

            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '', // last token text
                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
                var_line: false,
                var_line_tainted: false,
                var_line_reindented: false,
                in_html_comment: false,
                multiline_frame: false,
                if_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false, // switch(..){ INSIDE HERE }
                in_case: false, // we're on the exact line with "case 0:"
                case_body: false, // the indented case-action block
                indentation_level: next_indent_level,
                line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
                start_line_index: output_lines.length,
                had_comment: false,
                ternary_depth: 0
            }
            return next_flags;
        }

        // Using object instead of string to allow for later expansion of info about each line

        function create_output_line() {
            return {
                text: []
            };
        }

        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};

        // compatibility
        if (options.space_after_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.space_after_anon_function;
        }
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }


        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;

        if(options.indent_with_tabs){
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }

        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }

        while (js_source_text && (js_source_text.charAt(0) === ' ' || js_source_text.charAt(0) === '\t')) {
            preindent_string += js_source_text.charAt(0);
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;
        // cache the source's length.
        input_length = js_source_text.length;

        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output_lines = [create_output_line()];
        output_wrapped = false;
        output_space_before_token = false;
        whitespace_before_token = [];

        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);

        parser_pos = 0;

        this.beautify = function() {
            /*jshint onevar:true */
            var t, i, keep_whitespace, sweet_code;

            while (true) {
                t = get_next_token();
                token_text = t[0];
                token_type = t[1];

                if (token_type === 'TK_EOF') {
                    break;
                }

                keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);
                input_wanted_newline = n_newlines > 0;

                if (keep_whitespace) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i > 0);
                    }
                } else {
                    if (opt.max_preserve_newlines && n_newlines > opt.max_preserve_newlines) {
                        n_newlines = opt.max_preserve_newlines;
                    }

                    if (opt.preserve_newlines) {
                        if (n_newlines > 1) {
                            print_newline();
                            for (i = 1; i < n_newlines; i += 1) {
                                print_newline(true);
                            }
                        }
                    }
                }

                handlers[token_type]();

                // The cleanest handling of inline comments is to treat them as though they aren't there.
                // Just continue formatting and the behavior should be logical.
                // Also ignore unknown tokens.  Again, this should result in better behavior.
                if (token_type !== 'TK_INLINE_COMMENT' && token_type !== 'TK_COMMENT' &&
                    token_type !== 'TK_BLOCK_COMMENT' && token_type !== 'TK_UNKNOWN') {
                    last_last_text = flags.last_text;
                    last_type = token_type;
                    flags.last_text = token_text;
                }
                flags.had_comment = (token_type === 'TK_INLINE_COMMENT' || token_type === 'TK_COMMENT'
                    || token_type === 'TK_BLOCK_COMMENT');
            }


            sweet_code = output_lines[0].text.join('');
            for (var line_index = 1; line_index < output_lines.length; line_index++) {
                sweet_code += '\n' + output_lines[line_index].text.join('');
            }
            sweet_code = sweet_code.replace(/[\r\n ]+$/, '');
            return sweet_code;
        };

        function trim_output(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

            if (output_lines.length) {
                trim_output_line(output_lines[output_lines.length - 1], eat_newlines);

                while (eat_newlines && output_lines.length > 1 &&
                    output_lines[output_lines.length - 1].text.length === 0) {
                    output_lines.pop();
                    trim_output_line(output_lines[output_lines.length - 1], eat_newlines);
                }
            }
        }

        function trim_output_line(line) {
            while (line.text.length &&
                (line.text[line.text.length - 1] === ' ' ||
                    line.text[line.text.length - 1] === indent_string ||
                    line.text[line.text.length - 1] === preindent_string)) {
                line.text.pop();
            }
        }

        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }

        // we could use just string.split, but
        // IE doesn't like returning empty strings

        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);

            s = s.replace(/\x0d/g, '');
            var out = [],
                idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }

        function just_added_newline() {
            var line = output_lines[output_lines.length - 1];
            return line.text.length === 0;
        }

        function just_added_blankline() {
            if (just_added_newline()) {
                if (output_lines.length === 1) {
                    return true; // start of the file and newline = blank
                }

                var line = output_lines[output_lines.length - 2];
                return line.text.length === 0;
            }
            return false;
        }

        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;
            if (opt.wrap_line_length && !force_linewrap) {
                var line = output_lines[output_lines.length - 1];
                var proposed_line_length = 0;
                // never wrap the first token of a line.
                if (line.text.length > 0) {
                    proposed_line_length = line.text.join('').length + token_text.length +
                        (output_space_before_token ? 1 : 0);
                    if (proposed_line_length >= opt.wrap_line_length) {
                        force_linewrap = true;
                    }
                }
            }
            if (((opt.preserve_newlines && input_wanted_newline) || force_linewrap) && !just_added_newline()) {
                print_newline(false, true);

                // Expressions and array literals already indent their contents.
                if (!(is_array(flags.mode) || is_expression(flags.mode))) {
                    output_wrapped = true;
                }
            }
        }

        function print_newline(force_newline, preserve_statement_flags) {
            output_wrapped = false;
            output_space_before_token = false;

            if (!preserve_statement_flags) {
                if (flags.last_text !== ';') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }

            if (output_lines.length === 1 && just_added_newline()) {
                return; // no newline on start of file
            }

            if (force_newline || !just_added_newline()) {
                flags.multiline_frame = true;
                output_lines.push(create_output_line());
            }
        }

        function print_token_line_indentation() {
            if (just_added_newline()) {
                var line = output_lines[output_lines.length - 1];
                if (opt.keep_array_indentation && is_array(flags.mode) && input_wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    line.text.push('');
                    for (var i = 0; i < whitespace_before_token.length; i += 1) {
                        line.text.push(whitespace_before_token[i]);
                    }
                } else {
                    if (preindent_string) {
                        line.text.push(preindent_string);
                    }

                    print_indent_string(flags.indentation_level +
                        (flags.var_line && flags.var_line_reindented ? 1 : 0) +
                        (output_wrapped ? 1 : 0));
                }
            }
        }

        function print_indent_string(level) {
            // Never indent your first output indent at the start of the file
            if (output_lines.length > 1) {
                var line = output_lines[output_lines.length - 1];

                flags.line_indent_level = level;
                for (var i = 0; i < level; i += 1) {
                    line.text.push(indent_string);
                }
            }
        }

        function print_token_space_before() {
            var line = output_lines[output_lines.length - 1];
            if (output_space_before_token && line.text.length) {
                var last_output = line.text[line.text.length - 1];
                if (last_output !== ' ' && last_output !== indent_string) { // prevent occassional duplicate space
                    line.text.push(' ');
                }
            }
        }

        function print_token(printable_token) {
            printable_token = printable_token || token_text;
            print_token_line_indentation();
            output_wrapped = false;
            print_token_space_before();
            output_space_before_token = false;
            output_lines[output_lines.length - 1].text.push(printable_token);
        }

        function indent() {
            flags.indentation_level += 1;
        }

        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }

        function remove_redundant_indentation(frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.

            if (frame.multiline_frame) return;

            // remove one indent from each line inside this section
            var index = frame.start_line_index;
            var splice_index = 0;
            var line;

            while (index < output_lines.length) {
                line = output_lines[index];
                index++;

                // skip empty lines
                if (line.text.length === 0) {
                    continue;
                }

                // skip the preindent string if present
                if (preindent_string && line.text[0] === preindent_string) {
                    splice_index = 1;
                } else {
                    splice_index = 0;
                }

                // remove one indent, if present
                if (line.text[splice_index] === indent_string) {
                    line.text.splice(splice_index, 1);
                }
            }
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            } else {
                previous_flags = create_flags(null, mode);
            }

            flags = create_flags(previous_flags, mode);
        }

        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }

        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }

        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
            }
        }

        function start_of_object_property() {
            return flags.mode === MODE.ObjectLiteral && flags.last_text === ':' &&
                flags.ternary_depth === 0;
        }

        function start_of_statement() {
            if (
                (flags.last_text === 'do' ||
                    (flags.last_text === 'else' && token_text !== 'if') ||
                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)))) {
                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if(c) d(); else e(); else f();
                allow_wrap_or_preserved_newline(
                    in_array(token_text, ['do', 'for', 'if', 'while']));

                set_mode(MODE.Statement);
                // Issue #275:
                // If starting on a newline, all of a statement should be indented.
                // if not, use line wrapping logic for indent.
                if (just_added_newline()) {
                    indent();
                    output_wrapped = false;
                }
                return true;
            }
            return false;
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }

        function unescape_string(s) {
            var esc = false,
                out = '',
                pos = 0,
                s_hex = '',
                escaped = 0,
                c;

            while (esc || pos < s.length) {

                c = s.charAt(pos);
                pos++;

                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    } else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    } else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }

                    escaped = parseInt(s_hex, 16);

                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        } else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    } else {
                        out += String.fromCharCode(escaped);
                    }
                } else if (c === '\\') {
                    esc = true;
                } else {
                    out += c;
                }
            }
            return out;
        }

        function is_next(find) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c !== find) {
                local_pos++;
                if (local_pos >= input_length) {
                    return false;
                }
                c = input.charAt(local_pos);
            }
            return c === find;
        }

        function get_next_token() {
            var i, resulting_string;

            n_newlines = 0;

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            input_wanted_newline = false;
            whitespace_before_token = [];

            var c = input.charAt(parser_pos);
            parser_pos += 1;

            while (in_array(c, whitespace)) {

                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                } else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    } else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;
            }

            if (in_array(c, wordchar)) {
                if (parser_pos < input_length) {
                    while (in_array(input.charAt(parser_pos), wordchar)) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;

                    var t = get_next_token();
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }

                if (c === 'in') { // hack for 'in' operator
                    return [c, 'TK_OPERATOR'];
                }
                return [c, 'TK_WORD'];
            }

            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }

            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }

            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }

            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }

            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }

            }


            if (c === "'" || c === '"' || // string
                (
                    (c === '/') || // regexp
                    (opt.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ( // regex and xml can only appear in specific locations during parsing
                    (last_type === 'TK_WORD' && is_special_word(flags.last_text)) ||
                    (last_type === 'TK_END_EXPR' && in_array(previous_flags.mode, [MODE.Conditional, MODE.ForInitializer])) ||
                    (in_array(last_type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ]))
                )) {

                var sep = c,
                    esc = false,
                    has_char_escapes = false;

                resulting_string = c;

                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                } else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    } else if (opt.e4x && sep === '<') {
                        //
                        // handle e4x xml literals
                        //
                        var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                        var xmlStr = input.slice(parser_pos - 1);
                        var match = xmlRegExp.exec(xmlStr);
                        if (match && match.index === 0) {
                            var rootTag = match[2];
                            var depth = 0;
                            while (match) {
                                var isEndTag = !! match[1];
                                var tagName = match[2];
                                var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                                if (tagName === rootTag && !isSingletonTag) {
                                    if (isEndTag) {
                                        --depth;
                                    } else {
                                        ++depth;
                                    }
                                }
                                if (depth <= 0) {
                                    break;
                                }
                                match = xmlRegExp.exec(xmlStr);
                            }
                            var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                            parser_pos += xmlLength - 1;
                            return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                        }
                    } else {
                        //
                        // handle string
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (esc) {
                                if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                    has_char_escapes = true;
                                }
                                esc = false;
                            } else {
                                esc = input.charAt(parser_pos) === '\\';
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }

                    }
                }

                parser_pos += 1;
                resulting_string += sep;

                if (has_char_escapes && opt.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }

                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {


                if (output_lines.length === 1 && output_lines[0].text.length === 0 &&
                    input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }

            if (c === '.') {
                return [c, 'TK_DOT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === ',') {
                    return [c, 'TK_COMMA'];
                } else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }

        function handle_start_expr() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var next_mode = MODE.Expression;
            if (token_text === '[') {

                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (in_array(flags.last_text, line_starters)) {
                        output_space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.space_in_paren) {
                        output_space_before_token = true;
                    }
                    return;
                }

                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_array_indentation) {
                            print_newline();
                        }
                    }
                }

            } else {
                if (flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                } else if (in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                } else {
                    // next_mode = MODE.Expression;
                }
            }

            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(input_wanted_newline);
                output_wrapped = false;
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output_space_before_token = true;
            } else if (flags.last_word === 'function' || flags.last_word === 'typeof') {
                // function() vs function ()
                if (opt.jslint_happy) {
                    output_space_before_token = true;
                }
            } else if (in_array(flags.last_text, line_starters) || flags.last_text === 'catch') {
                if (opt.space_before_conditional) {
                    output_space_before_token = true;
                }
            }

            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (token_text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }

            set_mode(next_mode);
            print_token();
            if (opt.space_in_paren) {
                output_space_before_token = true;
            }

            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }

        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (token_text === ']' && is_array(flags.mode) && flags.multiline_frame && !opt.keep_array_indentation) {
                print_newline();
            }

            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline();
            }
            if (opt.space_in_paren) {
                if (last_type === 'TK_START_EXPR') {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    trim_output();
                    output_space_before_token = false;
                } else {
                    output_space_before_token = true;
                }
            }
            if (token_text === ']' && opt.keep_array_indentation) {
                print_token();
                restore_mode();
            } else {
                restore_mode();
                print_token();
            }
            remove_redundant_indentation(previous_flags);

            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;

            }
        }

        function handle_start_block() {
            set_mode(MODE.BlockStatement);

            var empty_braces = is_next('}');
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';

            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output_space_before_token = true;
                } else {
                    print_newline();
                }
            } else { // collapse
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        output_space_before_token = true;
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output_space_before_token = true;
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }

        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';

            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            } else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_array_indentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_array_indentation = false;
                        print_newline();
                        opt.keep_array_indentation = true;

                    } else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }

        function handle_word() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            } else if (input_wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || flags.last_text !== 'var')) {

                print_newline();
            }

            if (flags.do_block && !flags.do_while) {
                if (token_text === 'while') {
                    // do {} ## while ()
                    output_space_before_token = true;
                    print_token();
                    output_space_before_token = true;
                    flags.do_while = true;
                    return;
                } else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }

            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (token_text !== 'else') {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                }
            }

            if (token_text === 'case' || (token_text === 'default' && flags.in_case_statement)) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }

            if (token_text === 'function') {
                if (flags.var_line && last_type !== 'TK_EQUALS') {
                    flags.var_line_reindented = true;
                }
                if (in_array(flags.last_text, ['}', ';']) || (just_added_newline() && ! in_array(flags.last_text, ['{', ':', '=', ',']))) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    if ( ! just_added_blankline() && ! flags.had_comment) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_WORD') {
                    if (flags.last_text === 'get' || flags.last_text === 'set' || flags.last_text === 'new' || flags.last_text === 'return') {
                        output_space_before_token = true;
                    } else {
                        print_newline();
                    }
                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output_space_before_token = true;
                } else if (is_expression(flags.mode)) {
                    // (function
                } else {
                    print_newline();
                }
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }

            if (token_text === 'function') {
                print_token();
                flags.last_word = token_text;
                return;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {
                if (!in_array(token_text, ['else', 'catch', 'finally'])) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        output_space_before_token = true;
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_WORD') {
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                output_space_before_token = true;
                prefix = 'NEWLINE';
            }

            if (in_array(token_text, line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }

            }

            if (in_array(token_text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                } else {
                    trim_output(true);
                    var line = output_lines[output_lines.length - 1];
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.text[line.text.length - 1] !== '}') {
                        print_newline();
                    }
                    output_space_before_token = true;
                }
            } else if (prefix === 'NEWLINE') {
                if (is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output_space_before_token = true;
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_text === 'if' && flags.last_word === 'else' && flags.last_text !== '{') {
                            // no newline for } else if {
                            output_space_before_token = true;
                        } else {
                            flags.var_line = false;
                            flags.var_line_reindented = false;
                            print_newline();
                        }
                    }
                } else if (in_array(token_text, line_starters) && flags.last_text !== ')') {
                    flags.var_line = false;
                    flags.var_line_reindented = false;
                    print_newline();
                }
            } else if (is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                output_space_before_token = true;
            }
            print_token();
            flags.last_word = token_text;

            if (token_text === 'var') {
                flags.var_line = true;
                flags.var_line_reindented = false;
                flags.var_line_tainted = false;
            }

            if (token_text === 'do') {
                flags.do_block = true;
            }

            if (token_text === 'if') {
                flags.if_block = true;
            }
        }

        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output_space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
            flags.var_line = false;
            flags.var_line_reindented = false;
            if (flags.mode === MODE.ObjectLiteral) {
                // if we're in OBJECT mode and see a semicolon, its invalid syntax
                // recover back to treating this as a BLOCK
                flags.mode = MODE.BlockStatement;
            }
        }

        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output_space_before_token = true;
            } else if (last_type === 'TK_WORD') {
                output_space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
            print_token();
        }

        function handle_equals() {
            if (flags.var_line) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.var_line_tainted = true;
            }
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comma() {
            if (flags.var_line) {
                if (is_expression(flags.mode) || last_type === 'TK_END_BLOCK') {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.var_line_tainted = false;
                }

                if (flags.var_line) {
                    flags.var_line_reindented = true;
                }

                print_token();

                if (flags.var_line_tainted) {
                    flags.var_line_tainted = false;
                    print_newline();
                } else {
                    output_space_before_token = true;
                }
                return;
            }

            if (last_type === 'TK_END_BLOCK' && flags.mode !== MODE.Expression) {
                print_token();
                if (flags.mode === MODE.ObjectLiteral && flags.last_text === '}') {
                    print_newline();
                } else {
                    output_space_before_token = true;
                }
            } else {
                if (flags.mode === MODE.ObjectLiteral) {
                    print_token();
                    print_newline();
                } else {
                    // EXPR or DO_BLOCK
                    print_token();
                    output_space_before_token = true;
                }
            }
        }

        function handle_operator() {
            var space_before = true;
            var space_after = true;
            if (is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output_space_before_token = true;
                print_token();
                return;
            }

            // hack for actionscript's import .*;
            if (token_text === '*' && last_type === 'TK_DOT' && !last_last_text.match(/^\d+$/)) {
                print_token();
                return;
            }

            if (token_text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }

            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (input_wanted_newline && (token_text === '--' || token_text === '++')) {
                print_newline();
            }

            if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                space_after = false;

                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }

                if (last_type === 'TK_WORD' && in_array(flags.last_text, line_starters)) {
                    space_before = true;
                }

                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (token_text === ':') {
                if (flags.ternary_depth === 0) {
                    if (flags.mode === MODE.BlockStatement) {
                        flags.mode = MODE.ObjectLiteral;
                    }
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (token_text === '?') {
                flags.ternary_depth += 1;
            }
            output_space_before_token = output_space_before_token || space_before;
            print_token();
            output_space_before_token = space_after;
        }

        function handle_block_comment() {
            var lines = split_newlines(token_text);
            var j; // iterator for this case
            var javadoc = false;

            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
            }

            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                } else {
                    // normal comments output raw
                    output_lines[output_lines.length - 1].text.push(lines[j]);
                }
            }

            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }

        function handle_inline_comment() {
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comment() {
            if (input_wanted_newline) {
                print_newline(false, true);
            } else {
                trim_output(true);
            }

            output_space_before_token = true;
            print_token();
            print_newline(false, true);
        }

        function handle_dot() {
            if (is_special_word(flags.last_text)) {
                output_space_before_token = true;
            } else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }

            print_token();
        }

        function handle_unknown() {
            print_token();

            if (token_text[token_text.length - 1] === '\n') {
                print_newline();
            }
        }
    }


    if (typeof define === "function") {
        // Add support for require.js
        if (typeof define.amd === "undefined") {
            define(function(require, exports, module) {
                exports.js_beautify = js_beautify;
            });
        } else {
            // if is AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
            define([], function() {
                return js_beautify;
            });
        }

    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }

}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEJhcnRcXEFwcERhdGFcXFJvYW1pbmdcXG5wbVxcbm9kZV9tb2R1bGVzXFx3YXRjaGlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJEOi9fRWRpdGluZy9naXRodWIvZG9nZS9kb2dlc2NyaXB0LXBhZ2VzL2luZGV4LmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9sb2FkZXIuanMiLCJEOi9fRWRpdGluZy9naXRodWIvZG9nZS9kb2dlc2NyaXB0LXBhZ2VzL25vZGVfbW9kdWxlcy9kb2dlc2NyaXB0L2luZGV4LmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9saWIvcGFyc2VyLmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9ub2RlX21vZHVsZXMvanMtYmVhdXRpZnkvanMvaW5kZXguanMiLCJEOi9fRWRpdGluZy9naXRodWIvZG9nZS9kb2dlc2NyaXB0LXBhZ2VzL25vZGVfbW9kdWxlcy9kb2dlc2NyaXB0L25vZGVfbW9kdWxlcy9qcy1iZWF1dGlmeS9qcy9saWIvYmVhdXRpZnktY3NzLmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9ub2RlX21vZHVsZXMvanMtYmVhdXRpZnkvanMvbGliL2JlYXV0aWZ5LWh0bWwuanMiLCJEOi9fRWRpdGluZy9naXRodWIvZG9nZS9kb2dlc2NyaXB0LXBhZ2VzL25vZGVfbW9kdWxlcy9kb2dlc2NyaXB0L25vZGVfbW9kdWxlcy9qcy1iZWF1dGlmeS9qcy9saWIvYmVhdXRpZnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZG9nZXNjcmlwdCA9IHJlcXVpcmUoJ2RvZ2VzY3JpcHQnKTtcclxudmFyIGxvYWRUZXh0ID0gcmVxdWlyZSgnLi9sb2FkZXInKTtcclxuXHJcbnZhciBpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG9nZXNjcmlwdCcpO1xyXG52YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2phdmFzY3JpcHQnKTtcclxuXHJcbnZhciBlZGl0b3IgPSBuZXcgQmVoYXZlKHtcclxuICAgIHRleHRhcmVhOiBpbnB1dCxcclxuICAgIHJlcGxhY2VUYWI6IHRydWUsXHJcbiAgICBzb2Z0VGFiczogdHJ1ZSxcclxuICAgIHRhYlNpemU6IDQsXHJcbiAgICBhdXRvT3BlbjogdHJ1ZSxcclxuICAgIG92ZXJ3cml0ZTogdHJ1ZSxcclxuICAgIGF1dG9TdHJpcDogdHJ1ZSxcclxuICAgIGF1dG9JbmRlbnQ6IHRydWUsXHJcbiAgICBmZW5jZTogZmFsc2VcclxufSk7XHJcblxyXG5CZWhhdmVIb29rcy5hZGQoJ2tleXVwJywgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBvdXRwdXQudmFsdWUgPSBkb2dlc2NyaXB0KGlucHV0LnZhbHVlLCB0cnVlKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBmaXhTaXplKCkge1xyXG4gICAgdmFyIHRvcCA9IGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xyXG4gICAgdmFyIGhlaWdodCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3AgLSAxMCkgKyAncHgnO1xyXG4gICAgaW5wdXQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgb3V0cHV0LnN0eWxlLmhlaWdodCA9IGhlaWdodDsgXHJcbn1cclxuXHJcbmZpeFNpemUoKTtcclxuXHJcbnZhciBkZWJvdW5jZSA9IDA7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKGRlYm91bmNlKSB7XHJcbiAgICAgICAgZGVib3VuY2UgPSBjbGVhclRpbWVvdXQoZGVib3VuY2UpO1xyXG4gICAgfVxyXG4gICAgZGVib3VuY2UgPSBzZXRUaW1lb3V0KGZpeFNpemUsIDUwKTtcclxufSk7XHJcblxyXG5sb2FkVGV4dCgnZGVtby5kanMnLCBmdW5jdGlvbihlcnIsIGNvbnRlbnQpIHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gJ3NzaCBlcnJvciBsb2FkaW5nIGRlbW8nO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSBjb250ZW50O1xyXG4gICAgfVxyXG4gICAgb3V0cHV0LnZhbHVlID0gZG9nZXNjcmlwdChpbnB1dC52YWx1ZSwgdHJ1ZSk7XHJcbn0pO1xyXG4iLCJmdW5jdGlvbiBnZXRYSFIoKSB7XG4gICAgaWYgKFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9XG4gICAgdHJ5ICB7XG4gICAgICAgIHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgICB0cnkgIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICAgIHRyeSAge1xuICAgICAgICByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LicpO1xufVxuXG5mdW5jdGlvbiBsb2FkVGV4dCh1cmwsIGNhbGxiYWNrKSB7XG4gICAgdHJ5ICB7XG4gICAgICAgIHZhciB4aHIgPSBnZXRYSFIoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcbiAgICB4aHIuc2VuZChudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkVGV4dDtcbiIsIi8qKlxuICogZG9nZXNjcmlwdCAtIHdvdyBzbyBzeW50YXggc3VjaCBsYW5ndWFnZVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMyBaYWNoIEJydWdnZW1hblxuICpcbiAqIGRvZ2VzY3JpcHQgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICpcbiAqIEBwYWNrYWdlIGRvZ2VzY3JpcHRcbiAqIEBhdXRob3IgIFphY2ggQnJ1Z2dlbWFuIDx0YWxrdG9AemFjaGJydWdnZW1hbi5tZT5cbiAqL1xuXG52YXIgYmVhdXRpZnkgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmpzX2JlYXV0aWZ5O1xuXG52YXIgcGFyc2VyICAgPSByZXF1aXJlKCcuL2xpYi9wYXJzZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlsZSwgYmVhdXR5LCBkb2dlTW9kZSkge1xuICAgIGlmIChkb2dlTW9kZSkgdmFyIGxpbmVzID0gZmlsZS5zcGxpdCgvIHszLH18XFxyP1xcbi8pO1xuICAgIGVsc2UgdmFyIGxpbmVzID0gZmlsZS5zcGxpdCgvXFxyP1xcbi8pO1xuICAgIHZhciBzY3JpcHQgPSAnJztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2NyaXB0ICs9IHBhcnNlcihsaW5lc1tpXSk7XG4gICAgfVxuXG4gICAgaWYgKGJlYXV0eSkgcmV0dXJuIGJlYXV0aWZ5KHNjcmlwdClcbiAgICBlbHNlIHJldHVybiBzY3JpcHQ7XG59XG4iLCJ2YXIgbXVsdGlDb21tZW50ID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2UgKGxpbmUpIHtcbiAgICAvL3JlcGxhY2UgZG9nZXVtZW50IGFuZCB3aW5kb2dlIGFsd2F5c1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2RvZ2V1bWVudC9nLCAnZG9jdW1lbnQnKS5yZXBsYWNlKC93aW5kb2dlL2csICd3aW5kb3cnKTtcblxuICAgIHZhciBrZXlzID0gbGluZS5tYXRjaCgvJ1teJ10rJ3xcXFMrL2cpO1xuICAgIHZhciB2YWxpZCA9IFsnc3VjaCcsICd3b3cnLCAnd293JicsICdwbHonLCAnLnBseicsICdkb3NlJywgJ3ZlcnknLCAnc2hoJywgJ3F1aWV0JywgJ2xvdWQnLCAncmx5JywgJ2J1dCcsICdtYW55JywgJ211Y2gnLCAnc28nLCAndHJhaW5lZCcsICdtYXliZSddO1xuICAgIHZhciB2YWxpZEtleXMgPSB7J2lzJzogJyA9PT0gJywgJ25vdCc6ICcgIT09ICcsICdhbmQnOiAgJyAmJiAnLCAnb3InOiAgJyB8fCAnLCAnbmV4dCc6ICAnOyAnLCAnYXMnOiAgJyA9ICcsICdtb3JlJzogICcgKz0gJywgJ2xlc3MnOiAgJyAtPSAnLCAnbG90cyc6ICcgKj0gJywgJ2Zldyc6ICcgLz0gJywgJ3ZlcnknOiAnIHZhciAnLCAnc21hbGxlcic6ICcgPCAnLCAnYmlnZ2VyJzogJyA+ICcsICdzbWFsbGVyaXNoJzogJyA8PSAnLCAnYmlnZ2VyaXNoJzogJyA+PSAnLCAnbm90cmx5JzogJyAhICd9O1xuICAgIHZhciBzdGF0ZW1lbnQgPSAnJztcblxuICAgIGlmIChrZXlzID09PSBudWxsKSByZXR1cm4gbGluZSArICdcXG4nO1xuXG4gICAgLy8gbm90IGRvZ2VzY3JpcHQsIHN1Y2ggamF2YXNjcmlwdFxuICAgIGlmICh2YWxpZC5pbmRleE9mKGtleXNbMF0pID09PSAtMSAmJiBrZXlzWzFdICE9PSAnaXMnICYmIGtleXNbMV0gIT09ICdkb3NlJyB8fCBtdWx0aUNvbW1lbnQgJiYga2V5c1swXSAhPT0gJ2xvdWQnKSByZXR1cm4gbGluZSArICdcXG4nO1xuXG4gICAgLy8gdHJhaW5lZCB1c2Ugc3RyaWN0XG4gICAgaWYgKGtleXNbMF0gPT09ICd0cmFpbmVkJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ1widXNlIHN0cmljdFwiO1xcbic7XG4gICAgfVxuXG4gICAgLy8gc3VjaCBmdW5jdGlvblxuICAgIGlmIChrZXlzWzBdID09PSAnc3VjaCcpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9ICdmdW5jdGlvbiAnICsga2V5c1sxXTtcbiAgICAgICAgaWYgKGtleXNbMl0gPT09ICdtdWNoJykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcgKCc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0ga2V5cy5sZW5ndGggLSAxKSBzdGF0ZW1lbnQgKz0gJywgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnKSB7IFxcbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyAoKSB7IFxcbic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB3b3cgZW5kIGZ1bmN0aW9uIGFuZCByZXR1cm5cbiAgICBpZiAoa2V5c1swXSA9PT0gJ3dvdycgfHwga2V5c1swXSA9PT0gJ3dvdyYnKSB7XG4gICAgICAgaWYgKHR5cGVvZiBrZXlzWzFdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICdyZXR1cm4nO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcgJyArIGtleXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJztcXG4nO1xuICAgICAgICAgICAgaWYgKGtleXNbMF0gPT09ICd3b3cmJykgc3RhdGVtZW50ICs9ICd9KSBcXG4nO1xuICAgICAgICAgICAgZWxzZSBzdGF0ZW1lbnQgKz0gJ30gXFxuJztcbiAgICAgICAgfSBlbHNlIGlmIChrZXlzWzBdID09PSAnd293JicpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnfSkgXFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnfSBcXG4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGx6IGV4ZWN1dGUgZnVuY3Rpb25cbiAgICBpZiAoa2V5c1swXSA9PT0gJ3BseicgfHwga2V5c1swXSA9PT0gJy5wbHonIHx8IGtleXNbMF0gPT09ICdkb3NlJyB8fCBrZXlzWzFdID09PSAnZG9zZScpIHtcbiAgICAgICAgaWYgKGtleXNbMV0gPT09ICdkb3NlJykgc3RhdGVtZW50ICs9IGtleXMuc2hpZnQoKTtcbiAgICAgICAgaWYgKGtleXNbMF0uY2hhckF0KDApID09PSAnLicgfHwga2V5c1swXSA9PT0gJ2Rvc2UnKSBzdGF0ZW1lbnQgKz0gJy4nO1xuICAgICAgICBpZiAoa2V5c1sxXSA9PT0gJ2NvbnNvbGUubG9nZScgfHwga2V5c1sxXSA9PT0gJ2xvZ2UnKSBrZXlzWzFdID0ga2V5c1sxXS5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmIChrZXlzWzJdID09PSAnd2l0aCcpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzWzFdICsgJygnO1xuICAgICAgICAgICAgZHVwZSA9IGtleXMuc2xpY2UoMCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJywnIHx8IGtleXNbaV0gPT09ICcmJykgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKGtleXNbaV0gPT09ICdtdWNoJykgeyAvLyBsYW1iZGEgZnVuY3Rpb25zIC0gdGhhbmtzIEAwMERhdm8hXG5cbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9ICdmdW5jdGlvbiAoJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNbaSArIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBrZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGogIT09IGtleXMubGVuZ3RoIC0gMSkgc3RhdGVtZW50ICs9ICcsICc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJykge1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcpIHtcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXS5zdWJzdHIoLTEpID09PSAnJicgfHwga2V5c1tpXS5zdWJzdHIoLTEpID09PSAnLCcpIGtleXNbaV0gPSBrZXlzW2ldLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXS5zdWJzdHIoLTEpID09PSAnOicpIHN0YXRlbWVudCArPSAnICc7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IGtleXMubGVuZ3RoIC0gMSAmJiBrZXlzW2ldLnN1YnN0cigtMSkgIT09ICc6Jykgc3RhdGVtZW50ICs9ICcsICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RhdGVtZW50LnN1YnN0cigtMikgPT09ICcsICcpIHN0YXRlbWVudCA9IHN0YXRlbWVudC5zbGljZSgwLCAtMik7XG4gICAgICAgICAgICBpZiAoc3RhdGVtZW50LnN1YnN0cigtMykgPT09ICcsIF0nIHx8IHN0YXRlbWVudC5zdWJzdHIoLTMpID09PSAnLCB9JyApIHN0YXRlbWVudCA9IHN0YXRlbWVudC5yZXBsYWNlKHN0YXRlbWVudC5zdWJzdHIoLTMpLCBzdGF0ZW1lbnQuc3Vic3RyKC0xKSk7XG4gICAgICAgICAgICBpZiAoZHVwZVtrZXlzLmxlbmd0aCAtIDFdLnNsaWNlKC0xKSA9PT0gJyYnKSBzdGF0ZW1lbnQgKz0gJylcXG4nO1xuICAgICAgICAgICAgZWxzZSBzdGF0ZW1lbnQgKz0gJyk7XFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrZXlzWzFdLnNsaWNlKC0xKSA9PT0gJyYnKSB7XG4gICAgICAgICAgICAgICAga2V5c1sxXSA9IGtleXNbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzWzFdICsgJygpXFxuJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbMV0gKyAnKCk7XFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZlcnkgbmV3IHZhcmlhYmxlXG4gICAgaWYgKGtleXNbMF0gPT09ICd2ZXJ5Jykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ3ZhciAnICsga2V5c1sxXSArICcgPSAnO1xuICAgICAgICBpZiAoa2V5c1szXSA9PT0gJ25ldycpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnbmV3ICcgKyBrZXlzWzRdICsgJygnO1xuICAgICAgICAgICAgaWYgKGtleXNbNV0gPT09ICd3aXRoJykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSA2OyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJywnKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNbaV0uc3Vic3RyKC0xKSA9PT0gJywnICYmIGtleXNbaV0uY2hhckF0KGtleXNbaV0ubGVuZ3RoIC0gMikgIT09ICd9Jykga2V5c1tpXSA9IGtleXNbaV0uc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IGtleXMubGVuZ3RoIC0gMSkgc3RhdGVtZW50ICs9ICcsICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcpO1xcbic7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXlzWzNdID09PSAnbXVjaCcpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnZnVuY3Rpb24gJztcbiAgICAgICAgICAgIGlmIChrZXlzWzRdKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcoJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gNDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBrZXlzLmxlbmd0aCAtIDEpIHN0YXRlbWVudCArPSAnLCAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJykgeyBcXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyAoKSB7IFxcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIHZhciByZWN1cnNlID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXS5zdWJzdHIoLTEpID09PSAnLCcgJiYga2V5c1tpXS5jaGFyQXQoa2V5c1tpXS5sZW5ndGggLSAyKSAhPT0gJ30nKSBrZXlzW2ldID0ga2V5c1tpXS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgcmVjdXJzZSArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbGlkLmluZGV4T2Yoa2V5c1szXSkgIT09IC0xIHx8IChrZXlzWzRdID09PSAnaXMnIHx8IGtleXNbNF0gPT09ICdkb3NlJykpIHN0YXRlbWVudCArPSBwYXJzZShyZWN1cnNlKTtcbiAgICAgICAgICAgIGVsc2Ugc3RhdGVtZW50ICs9IHJlY3Vyc2UgKyAnO1xcbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1szXSArICc7XFxuJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlzIGV4aXN0aW5nIHZhcmlhYmxlXG4gICAgaWYgKGtleXNbMV0gPT09ICdpcycpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbMF0gKyAnID0gJztcbiAgICAgICAgaWYgKGtleXNbMl0gPT09ICduZXcnKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ25ldyAnICsga2V5c1szXSArICcoJztcbiAgICAgICAgICAgIGlmIChrZXlzWzRdID09PSAnd2l0aCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gNTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleXNbaV0gPT09ICcsJykgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0ga2V5cy5sZW5ndGggLSAxKSBzdGF0ZW1lbnQgKz0gJywgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyk7XFxuJztcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlY3Vyc2UgKz0ga2V5c1tpXSArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBwYXJzZShyZWN1cnNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzWzJdICsgJztcXG4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc2hoIGNvbW1lbnRcbiAgICBpZiAoa2V5c1swXSA9PT0gJ3NoaCcpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9ICcvLyAnO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlbWVudCArPSAnXFxuJztcbiAgICB9XG5cbiAgICAvLyBxdWlldCBzdGFydCBtdWx0aS1saW5lIGNvbW1lbnRcbiAgICBpZiAoa2V5c1swXSA9PT0gJ3F1aWV0Jykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJy8qICc7XG4gICAgICAgIG11bHRpQ29tbWVudCA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVtZW50ICs9ICdcXG4nO1xuICAgIH1cblxuICAgIC8vIGxvdWQgZW5kIG11bHRpLWxpbmUgY29tbWVudFxuICAgIGlmIChrZXlzWzBdID09PSAnbG91ZCcpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9ICcqLyAnO1xuICAgICAgICBtdWx0aUNvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZW1lbnQgKz0gJ1xcbic7XG4gICAgfVxuXG4gICAgdmFyIGtleVBhcnNlciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKHZhbGlkS2V5c1trZXldKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gdmFsaWRLZXlzW2tleV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJseSBpZlxuICAgIGlmIChrZXlzWzBdID09PSAncmx5Jykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ2lmICgnO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWQgPSBrZXlQYXJzZXIoa2V5c1tpXSk7XG4gICAgICAgICAgICBpZiAocGFyc2VkKSBjb250aW51ZTtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlbWVudCArPSAnKSB7XFxuJztcbiAgICB9XG5cbiAgICAvLyBidXQgZWxzZVxuICAgIGlmIChrZXlzWzBdID09PSAnYnV0Jykge1xuICAgICAgICBpZiAoa2V5c1sxXSA9PT0gJ3JseScpIHtcbiAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ30gZWxzZSBpZiAoJztcbiAgICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHBhcnNlZCA9IGtleVBhcnNlcihrZXlzW2ldKTtcbiAgICAgICAgICAgICAgaWYgKHBhcnNlZCkgY29udGludWU7XG4gICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZW1lbnQgKz0gJykge1xcbic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdGVtZW50ICs9ICd9IGVsc2Uge1xcbic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtYW55IHdoaWxlXG4gICAgaWYgKGtleXNbMF0gPT09ICdtYW55Jykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ3doaWxlICgnO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWQgPSBrZXlQYXJzZXIoa2V5c1tpXSk7XG4gICAgICAgICAgICBpZiAocGFyc2VkKSBjb250aW51ZTtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlbWVudCArPSAnKSB7XFxuJztcbiAgICB9XG5cbiAgICAvLyBtdWNoIGZvclxuICAgIGlmIChrZXlzWzBdID09PSAnbXVjaCcpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9ICdmb3IgKCc7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhcnNlZCA9IGtleVBhcnNlcihrZXlzW2ldKTtcbiAgICAgICAgICAgIGlmIChwYXJzZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVtZW50ICs9ICcpIHtcXG4nO1xuICAgIH1cblxuICAgIC8vIHNvIHJlcXVpcmUgKHRoYW5rcyBAbWF4b2dkZW4hKVxuICAgIGlmIChrZXlzWzBdID09PSAnc28nKSB7XG4gICAgICAgIGlmIChrZXlzWzJdID09PSAnYXMnKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ3ZhciAnICsga2V5c1szXSArICcgPSByZXF1aXJlKFxcJycgKyBrZXlzWzFdICsgJ1xcJyk7XFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAndmFyICcgKyBrZXlzWzFdICsgJyA9IHJlcXVpcmUoXFwnJyArIGtleXNbMV0gKyAnXFwnKTtcXG4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWF5YmUgYm9vbGVhbiBvcGVyYXRvclxuICAgIGlmIChrZXlzWzBdID09PSAnbWF5YmUnKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAnKCEhK01hdGgucm91bmQoTWF0aC5yYW5kb20oKSkpJztcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlbWVudDtcbn1cbiIsIi8qKlxuVGhlIGZvbGxvd2luZyBiYXRjaGVzIGFyZSBlcXVpdmFsZW50OlxuXG52YXIgYmVhdXRpZnlfanMgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpO1xudmFyIGJlYXV0aWZ5X2pzID0gcmVxdWlyZSgnanMtYmVhdXRpZnknKS5qcztcbnZhciBiZWF1dGlmeV9qcyA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuanNfYmVhdXRpZnk7XG5cbnZhciBiZWF1dGlmeV9jc3MgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmNzcztcbnZhciBiZWF1dGlmeV9jc3MgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmNzc19iZWF1dGlmeTtcblxudmFyIGJlYXV0aWZ5X2h0bWwgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmh0bWw7XG52YXIgYmVhdXRpZnlfaHRtbCA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuaHRtbF9iZWF1dGlmeTtcblxuQWxsIG1ldGhvZHMgcmV0dXJuZWQgYWNjZXB0IHR3byBhcmd1bWVudHMsIHRoZSBzb3VyY2Ugc3RyaW5nIGFuZCBhbiBvcHRpb25zIG9iamVjdC5cbioqL1xudmFyIGpzX2JlYXV0aWZ5ID0gcmVxdWlyZSgnLi9saWIvYmVhdXRpZnknKS5qc19iZWF1dGlmeTtcbnZhciBjc3NfYmVhdXRpZnkgPSByZXF1aXJlKCcuL2xpYi9iZWF1dGlmeS1jc3MnKS5jc3NfYmVhdXRpZnk7XG52YXIgaHRtbF9iZWF1dGlmeSA9IHJlcXVpcmUoJy4vbGliL2JlYXV0aWZ5LWh0bWwnKS5odG1sX2JlYXV0aWZ5O1xuXG4vLyB0aGUgZGVmYXVsdCBpcyBqc1xudmFyIGJlYXV0aWZ5ID0gZnVuY3Rpb24gKHNyYywgY29uZmlnKSB7XG4gICAgcmV0dXJuIGpzX2JlYXV0aWZ5KHNyYywgY29uZmlnKTtcbn07XG5cbi8vIHNob3J0IGFsaWFzZXNcbmJlYXV0aWZ5LmpzICAgPSBqc19iZWF1dGlmeTtcbmJlYXV0aWZ5LmNzcyAgPSBjc3NfYmVhdXRpZnk7XG5iZWF1dGlmeS5odG1sID0gaHRtbF9iZWF1dGlmeTtcblxuLy8gbGVnYWN5IGFsaWFzZXNcbmJlYXV0aWZ5LmpzX2JlYXV0aWZ5ICAgPSBqc19iZWF1dGlmeTtcbmJlYXV0aWZ5LmNzc19iZWF1dGlmeSAgPSBjc3NfYmVhdXRpZnk7XG5iZWF1dGlmeS5odG1sX2JlYXV0aWZ5ID0gaHRtbF9iZWF1dGlmeTtcblxubW9kdWxlLmV4cG9ydHMgPSBiZWF1dGlmeTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qanNoaW50IGN1cmx5OnRydWUsIGVxZXFlcTp0cnVlLCBsYXhicmVhazp0cnVlLCBub2VtcHR5OmZhbHNlICovXG4vKlxuXG4gIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gIENvcHlyaWdodCAoYykgMjAwNy0yMDEzIEVpbmFyIExpZWxtYW5pcyBhbmQgY29udHJpYnV0b3JzLlxuXG4gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAgU09GVFdBUkUuXG5cblxuIENTUyBCZWF1dGlmaWVyXG4tLS0tLS0tLS0tLS0tLS1cblxuICAgIFdyaXR0ZW4gYnkgSGFydXR5dW4gQW1pcmphbnlhbiwgKGFtaXJqYW55YW5AZ21haWwuY29tKVxuXG4gICAgQmFzZWQgb24gY29kZSBpbml0aWFsbHkgZGV2ZWxvcGVkIGJ5OiBFaW5hciBMaWVsbWFuaXMsIDxlbGZ6QGxhYWN6Lmx2PlxuICAgICAgICBodHRwOi8vanNiZWF1dGlmaWVyLm9yZy9cblxuICAgIFVzYWdlOlxuICAgICAgICBjc3NfYmVhdXRpZnkoc291cmNlX3RleHQpO1xuICAgICAgICBjc3NfYmVhdXRpZnkoc291cmNlX3RleHQsIG9wdGlvbnMpO1xuXG4gICAgVGhlIG9wdGlvbnMgYXJlIChkZWZhdWx0IGluIGJyYWNrZXRzKTpcbiAgICAgICAgaW5kZW50X3NpemUgKDQpICAgICAgICAgICAgICAgICAgIOKAlCBpbmRlbnRhdGlvbiBzaXplLFxuICAgICAgICBpbmRlbnRfY2hhciAoc3BhY2UpICAgICAgICAgICAgICAg4oCUIGNoYXJhY3RlciB0byBpbmRlbnQgd2l0aCxcbiAgICAgICAgc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmUgKHRydWUpIC0gc2VwYXJhdGUgc2VsZWN0b3JzIHdpdGggbmV3bGluZSBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3QgKGUuZy4gXCJhLFxcbmJyXCIgb3IgXCJhLCBiclwiKVxuICAgICAgICBlbmRfd2l0aF9uZXdsaW5lIChmYWxzZSkgICAgICAgICAgLSBlbmQgd2l0aCBhIG5ld2xpbmVcblxuICAgIGUuZ1xuXG4gICAgY3NzX2JlYXV0aWZ5KGNzc19zb3VyY2VfdGV4dCwge1xuICAgICAgJ2luZGVudF9zaXplJzogMSxcbiAgICAgICdpbmRlbnRfY2hhcic6ICdcXHQnLFxuICAgICAgJ3NlbGVjdG9yX3NlcGFyYXRvcic6ICcgJyxcbiAgICAgICdlbmRfd2l0aF9uZXdsaW5lJzogZmFsc2UsXG4gICAgfSk7XG4qL1xuXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9zeW5kYXRhLmh0bWwjdG9rZW5pemF0aW9uXG4vLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXN5bnRheC9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBjc3NfYmVhdXRpZnkoc291cmNlX3RleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBpbmRlbnRTaXplID0gb3B0aW9ucy5pbmRlbnRfc2l6ZSB8fCA0O1xuICAgICAgICB2YXIgaW5kZW50Q2hhcmFjdGVyID0gb3B0aW9ucy5pbmRlbnRfY2hhciB8fCAnICc7XG4gICAgICAgIHZhciBzZWxlY3RvclNlcGFyYXRvck5ld2xpbmUgPSB0cnVlO1xuICAgICAgICBpZiAob3B0aW9ucy5zZWxlY3Rvcl9zZXBhcmF0b3JfbmV3bGluZSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICBzZWxlY3RvclNlcGFyYXRvck5ld2xpbmUgPSBvcHRpb25zLnNlbGVjdG9yX3NlcGFyYXRvcl9uZXdsaW5lO1xuICAgICAgICB2YXIgZW5kV2l0aE5ld2xpbmUgPSBvcHRpb25zLmVuZF93aXRoX25ld2xpbmUgfHwgZmFsc2U7XG5cbiAgICAgICAgLy8gY29tcGF0aWJpbGl0eVxuICAgICAgICBpZiAodHlwZW9mIGluZGVudFNpemUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGluZGVudFNpemUgPSBwYXJzZUludChpbmRlbnRTaXplLCAxMCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIHRva2VuaXplclxuICAgICAgICB2YXIgd2hpdGVSZSA9IC9eXFxzKyQvO1xuICAgICAgICB2YXIgd29yZFJlID0gL1tcXHckXFwtX10vO1xuXG4gICAgICAgIHZhciBwb3MgPSAtMSxcbiAgICAgICAgICAgIGNoO1xuXG4gICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZV90ZXh0LmNoYXJBdCgrK3Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gY2g7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwZWVrKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZV90ZXh0LmNoYXJBdChwb3MgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVhdFN0cmluZyhlbmRDaGFyKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICB3aGlsZSAobmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBlbmRDaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZV90ZXh0LnN1YnN0cmluZyhzdGFydCwgcG9zICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlYXRXaGl0ZXNwYWNlKCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gcG9zO1xuICAgICAgICAgICAgd2hpbGUgKHdoaXRlUmUudGVzdChwZWVrKCkpKSB7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcG9zICE9PSBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNraXBXaGl0ZXNwYWNlKCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gcG9zO1xuICAgICAgICAgICAgZG8ge30gd2hpbGUgKHdoaXRlUmUudGVzdChuZXh0KCkpKTtcbiAgICAgICAgICAgIHJldHVybiBwb3MgIT09IHN0YXJ0ICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVhdENvbW1lbnQoKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAobmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSBcIipcIiAmJiBwZWVrKCkgPT09IFwiL1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIHBvcyArIDEpO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBsb29rQmFjayhzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VfdGV4dC5zdWJzdHJpbmcocG9zIC0gc3RyLmxlbmd0aCwgcG9zKS50b0xvd2VyQ2FzZSgpID09PVxuICAgICAgICAgICAgICAgIHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByaW50ZXJcbiAgICAgICAgdmFyIGluZGVudFN0cmluZyA9IHNvdXJjZV90ZXh0Lm1hdGNoKC9eW1xcclxcbl0qW1xcdCBdKi8pWzBdO1xuICAgICAgICB2YXIgc2luZ2xlSW5kZW50ID0gQXJyYXkoaW5kZW50U2l6ZSArIDEpLmpvaW4oaW5kZW50Q2hhcmFjdGVyKTtcbiAgICAgICAgdmFyIGluZGVudExldmVsID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBpbmRlbnQoKSB7XG4gICAgICAgICAgICBpbmRlbnRMZXZlbCsrO1xuICAgICAgICAgICAgaW5kZW50U3RyaW5nICs9IHNpbmdsZUluZGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG91dGRlbnQoKSB7XG4gICAgICAgICAgICBpbmRlbnRMZXZlbC0tO1xuICAgICAgICAgICAgaW5kZW50U3RyaW5nID0gaW5kZW50U3RyaW5nLnNsaWNlKDAsIC1pbmRlbnRTaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcmludCA9IHt9O1xuICAgICAgICBwcmludFtcIntcIl0gPSBmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgICAgIHByaW50LnNpbmdsZVNwYWNlKCk7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChjaCk7XG4gICAgICAgICAgICBwcmludC5uZXdMaW5lKCk7XG4gICAgICAgIH07XG4gICAgICAgIHByaW50W1wifVwiXSA9IGZ1bmN0aW9uIChjaCkge1xuICAgICAgICAgICAgcHJpbnQubmV3TGluZSgpO1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgcHJpbnQubmV3TGluZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHByaW50Ll9sYXN0Q2hhcldoaXRlc3BhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2hpdGVSZS50ZXN0KG91dHB1dFtvdXRwdXQubGVuZ3RoIC0gMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpbnQubmV3TGluZSA9IGZ1bmN0aW9uIChrZWVwV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgaWYgKCFrZWVwV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChwcmludC5fbGFzdENoYXJXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCgnXFxuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZW50U3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goaW5kZW50U3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcHJpbnQuc2luZ2xlU3BhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCAmJiAhcHJpbnQuX2xhc3RDaGFyV2hpdGVzcGFjZSgpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goJyAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICBpZiAoaW5kZW50U3RyaW5nKSB7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChpbmRlbnRTdHJpbmcpO1xuICAgICAgICB9XG4gICAgICAgIC8qX19fX19fX19fX19fX19fX19fX19fLS0tLS0tLS0tLS0tLS0tLS0tLS1fX19fX19fX19fX19fX19fX19fX18qL1xuXG4gICAgICAgIHZhciBpbnNpZGVSdWxlID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgaXNBZnRlclNwYWNlID0gc2tpcFdoaXRlc3BhY2UoKTtcblxuICAgICAgICAgICAgaWYgKCFjaCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJy8nICYmIHBlZWsoKSA9PT0gJyonKSB7IC8vIGNvbW1lbnRcbiAgICAgICAgICAgICAgICBwcmludC5uZXdMaW5lKCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goZWF0Q29tbWVudCgpLCBcIlxcblwiLCBpbmRlbnRTdHJpbmcpO1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXIgPSBsb29rQmFjayhcIlwiKVxuICAgICAgICAgICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQubmV3TGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICd7Jykge1xuICAgICAgICAgICAgICAgIGVhdFdoaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICBpZiAocGVlaygpID09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKFwiIHt9XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICBwcmludFtcIntcIl0oY2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICd9Jykge1xuICAgICAgICAgICAgICAgIG91dGRlbnQoKTtcbiAgICAgICAgICAgICAgICBwcmludFtcIn1cIl0oY2gpO1xuICAgICAgICAgICAgICAgIGluc2lkZVJ1bGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgZWF0V2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgaW5zaWRlUnVsZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnXCInIHx8IGNoID09PSAnXFwnJykge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGVhdFN0cmluZyhjaCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJzsnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gsICdcXG4nLCBpbmRlbnRTdHJpbmcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJygnKSB7IC8vIG1heSBiZSBhIHVybFxuICAgICAgICAgICAgICAgIGlmIChsb29rQmFjayhcInVybFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChjaCk7XG4gICAgICAgICAgICAgICAgICAgIGVhdFdoaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoICE9PSAnKScgJiYgY2ggIT09ICdcIicgJiYgY2ggIT09ICdcXCcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goZWF0U3RyaW5nKCcpJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FmdGVyU3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50LnNpbmdsZVNwYWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgICAgICAgICBlYXRXaGl0ZXNwYWNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJyknKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJywnKSB7XG4gICAgICAgICAgICAgICAgZWF0V2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWluc2lkZVJ1bGUgJiYgc2VsZWN0b3JTZXBhcmF0b3JOZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50Lm5ld0xpbmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5zaW5nbGVTcGFjZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdbJyB8fCBjaCA9PT0gJz0nKSB7IC8vIG5vIHdoaXRlc3BhY2UgYmVmb3JlIG9yIGFmdGVyXG4gICAgICAgICAgICAgICAgZWF0V2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQWZ0ZXJTcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5zaW5nbGVTcGFjZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIHN3ZWV0Q29kZSA9IG91dHB1dC5qb2luKCcnKS5yZXBsYWNlKC9bXFxuIF0rJC8sICcnKTtcblxuICAgICAgICAvLyBlc3RhYmxpc2ggZW5kX3dpdGhfbmV3bGluZVxuICAgICAgICB2YXIgc2hvdWxkID0gZW5kV2l0aE5ld2xpbmU7XG4gICAgICAgIHZhciBhY3R1YWxseSA9IC9cXG4kLy50ZXN0KHN3ZWV0Q29kZSlcbiAgICAgICAgaWYgKHNob3VsZCAmJiAhYWN0dWFsbHkpXG4gICAgICAgICAgICBzd2VldENvZGUgKz0gXCJcXG5cIjtcbiAgICAgICAgZWxzZSBpZiAoIXNob3VsZCAmJiBhY3R1YWxseSlcbiAgICAgICAgICAgIHN3ZWV0Q29kZSA9IHN3ZWV0Q29kZS5zbGljZSgwLCAtMSk7XG5cbiAgICAgICAgcmV0dXJuIHN3ZWV0Q29kZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIC8vIEFkZCBzdXBwb3J0IGZvciByZXF1aXJlLmpzXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgICAgICAgICBleHBvcnRzLmNzc19iZWF1dGlmeSA9IGNzc19iZWF1dGlmeTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBBZGQgc3VwcG9ydCBmb3IgQ29tbW9uSlMuIEp1c3QgcHV0IHRoaXMgZmlsZSBzb21ld2hlcmUgb24geW91ciByZXF1aXJlLnBhdGhzXG4gICAgICAgIC8vIGFuZCB5b3Ugd2lsbCBiZSBhYmxlIHRvIGB2YXIgaHRtbF9iZWF1dGlmeSA9IHJlcXVpcmUoXCJiZWF1dGlmeVwiKS5odG1sX2JlYXV0aWZ5YC5cbiAgICAgICAgZXhwb3J0cy5jc3NfYmVhdXRpZnkgPSBjc3NfYmVhdXRpZnk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIElmIHdlJ3JlIHJ1bm5pbmcgYSB3ZWIgcGFnZSBhbmQgZG9uJ3QgaGF2ZSBlaXRoZXIgb2YgdGhlIGFib3ZlLCBhZGQgb3VyIG9uZSBnbG9iYWxcbiAgICAgICAgd2luZG93LmNzc19iZWF1dGlmeSA9IGNzc19iZWF1dGlmeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgZXZlbiBoYXZlIHdpbmRvdywgdHJ5IGdsb2JhbC5cbiAgICAgICAgZ2xvYmFsLmNzc19iZWF1dGlmeSA9IGNzc19iZWF1dGlmeTtcbiAgICB9XG5cbn0oKSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qanNoaW50IGN1cmx5OnRydWUsIGVxZXFlcTp0cnVlLCBsYXhicmVhazp0cnVlLCBub2VtcHR5OmZhbHNlICovXG4vKlxuXG4gIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gIENvcHlyaWdodCAoYykgMjAwNy0yMDEzIEVpbmFyIExpZWxtYW5pcyBhbmQgY29udHJpYnV0b3JzLlxuXG4gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAgU09GVFdBUkUuXG5cblxuIFN0eWxlIEhUTUxcbi0tLS0tLS0tLS0tLS0tLVxuXG4gIFdyaXR0ZW4gYnkgTm9jaHVtIFNvc3NvbmtvLCAobnNvc3NvbmtvQGhvdG1haWwuY29tKVxuXG4gIEJhc2VkIG9uIGNvZGUgaW5pdGlhbGx5IGRldmVsb3BlZCBieTogRWluYXIgTGllbG1hbmlzLCA8ZWxmekBsYWFjei5sdj5cbiAgICBodHRwOi8vanNiZWF1dGlmaWVyLm9yZy9cblxuICBVc2FnZTpcbiAgICBzdHlsZV9odG1sKGh0bWxfc291cmNlKTtcblxuICAgIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UsIG9wdGlvbnMpO1xuXG4gIFRoZSBvcHRpb25zIGFyZTpcbiAgICBpbmRlbnRfaW5uZXJfaHRtbCAoZGVmYXVsdCBmYWxzZSkgIOKAlCBpbmRlbnQgPGhlYWQ+IGFuZCA8Ym9keT4gc2VjdGlvbnMsXG4gICAgaW5kZW50X3NpemUgKGRlZmF1bHQgNCkgICAgICAgICAg4oCUIGluZGVudGF0aW9uIHNpemUsXG4gICAgaW5kZW50X2NoYXIgKGRlZmF1bHQgc3BhY2UpICAgICAg4oCUIGNoYXJhY3RlciB0byBpbmRlbnQgd2l0aCxcbiAgICB3cmFwX2xpbmVfbGVuZ3RoIChkZWZhdWx0IDI1MCkgICAgICAgICAgICAtICBtYXhpbXVtIGFtb3VudCBvZiBjaGFyYWN0ZXJzIHBlciBsaW5lICgwID0gZGlzYWJsZSlcbiAgICBicmFjZV9zdHlsZSAoZGVmYXVsdCBcImNvbGxhcHNlXCIpIC0gXCJjb2xsYXBzZVwiIHwgXCJleHBhbmRcIiB8IFwiZW5kLWV4cGFuZFwiXG4gICAgICAgICAgICBwdXQgYnJhY2VzIG9uIHRoZSBzYW1lIGxpbmUgYXMgY29udHJvbCBzdGF0ZW1lbnRzIChkZWZhdWx0KSwgb3IgcHV0IGJyYWNlcyBvbiBvd24gbGluZSAoQWxsbWFuIC8gQU5TSSBzdHlsZSksIG9yIGp1c3QgcHV0IGVuZCBicmFjZXMgb24gb3duIGxpbmUuXG4gICAgdW5mb3JtYXR0ZWQgKGRlZmF1bHRzIHRvIGlubGluZSB0YWdzKSAtIGxpc3Qgb2YgdGFncywgdGhhdCBzaG91bGRuJ3QgYmUgcmVmb3JtYXR0ZWRcbiAgICBpbmRlbnRfc2NyaXB0cyAoZGVmYXVsdCBub3JtYWwpICAtIFwia2VlcFwifFwic2VwYXJhdGVcInxcIm5vcm1hbFwiXG4gICAgcHJlc2VydmVfbmV3bGluZXMgKGRlZmF1bHQgdHJ1ZSkgLSB3aGV0aGVyIGV4aXN0aW5nIGxpbmUgYnJlYWtzIGJlZm9yZSBlbGVtZW50cyBzaG91bGQgYmUgcHJlc2VydmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT25seSB3b3JrcyBiZWZvcmUgZWxlbWVudHMsIG5vdCBpbnNpZGUgdGFncyBvciBmb3IgdGV4dC5cbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXMgKGRlZmF1bHQgdW5saW1pdGVkKSAtIG1heGltdW0gbnVtYmVyIG9mIGxpbmUgYnJlYWtzIHRvIGJlIHByZXNlcnZlZCBpbiBvbmUgY2h1bmtcbiAgICBpbmRlbnRfaGFuZGxlYmFycyAoZGVmYXVsdCBmYWxzZSkgLSBmb3JtYXQgYW5kIGluZGVudCB7eyNmb299fSBhbmQge3svZm9vfX1cblxuICAgIGUuZy5cblxuICAgIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UsIHtcbiAgICAgICdpbmRlbnRfaW5uZXJfaHRtbCc6IGZhbHNlLFxuICAgICAgJ2luZGVudF9zaXplJzogMixcbiAgICAgICdpbmRlbnRfY2hhcic6ICcgJyxcbiAgICAgICd3cmFwX2xpbmVfbGVuZ3RoJzogNzgsXG4gICAgICAnYnJhY2Vfc3R5bGUnOiAnZXhwYW5kJyxcbiAgICAgICd1bmZvcm1hdHRlZCc6IFsnYScsICdzdWInLCAnc3VwJywgJ2InLCAnaScsICd1J10sXG4gICAgICAncHJlc2VydmVfbmV3bGluZXMnOiB0cnVlLFxuICAgICAgJ21heF9wcmVzZXJ2ZV9uZXdsaW5lcyc6IDUsXG4gICAgICAnaW5kZW50X2hhbmRsZWJhcnMnOiBmYWxzZVxuICAgIH0pO1xuKi9cblxuKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsdHJpbShzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMrL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHlsZV9odG1sKGh0bWxfc291cmNlLCBvcHRpb25zLCBqc19iZWF1dGlmeSwgY3NzX2JlYXV0aWZ5KSB7XG4gICAgICAgIC8vV3JhcHBlciBmdW5jdGlvbiB0byBpbnZva2UgYWxsIHRoZSBuZWNlc3NhcnkgY29uc3RydWN0b3JzIGFuZCBkZWFsIHdpdGggdGhlIG91dHB1dC5cblxuICAgICAgICB2YXIgbXVsdGlfcGFyc2VyLFxuICAgICAgICAgICAgaW5kZW50X2lubmVyX2h0bWwsXG4gICAgICAgICAgICBpbmRlbnRfc2l6ZSxcbiAgICAgICAgICAgIGluZGVudF9jaGFyYWN0ZXIsXG4gICAgICAgICAgICB3cmFwX2xpbmVfbGVuZ3RoLFxuICAgICAgICAgICAgYnJhY2Vfc3R5bGUsXG4gICAgICAgICAgICB1bmZvcm1hdHRlZCxcbiAgICAgICAgICAgIHByZXNlcnZlX25ld2xpbmVzLFxuICAgICAgICAgICAgbWF4X3ByZXNlcnZlX25ld2xpbmVzO1xuXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHRvIDEuMy40XG4gICAgICAgIGlmICgob3B0aW9ucy53cmFwX2xpbmVfbGVuZ3RoID09PSB1bmRlZmluZWQgfHwgcGFyc2VJbnQob3B0aW9ucy53cmFwX2xpbmVfbGVuZ3RoLCAxMCkgPT09IDApICYmXG4gICAgICAgICAgICAgICAgKG9wdGlvbnMubWF4X2NoYXIgPT09IHVuZGVmaW5lZCB8fCBwYXJzZUludChvcHRpb25zLm1heF9jaGFyLCAxMCkgPT09IDApKSB7XG4gICAgICAgICAgICBvcHRpb25zLndyYXBfbGluZV9sZW5ndGggPSBvcHRpb25zLm1heF9jaGFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5kZW50X2lubmVyX2h0bWwgPSBvcHRpb25zLmluZGVudF9pbm5lcl9odG1sIHx8IGZhbHNlO1xuICAgICAgICBpbmRlbnRfc2l6ZSA9IHBhcnNlSW50KG9wdGlvbnMuaW5kZW50X3NpemUgfHwgNCwgMTApO1xuICAgICAgICBpbmRlbnRfY2hhcmFjdGVyID0gb3B0aW9ucy5pbmRlbnRfY2hhciB8fCAnICc7XG4gICAgICAgIGJyYWNlX3N0eWxlID0gb3B0aW9ucy5icmFjZV9zdHlsZSB8fCAnY29sbGFwc2UnO1xuICAgICAgICB3cmFwX2xpbmVfbGVuZ3RoID0gIHBhcnNlSW50KG9wdGlvbnMud3JhcF9saW5lX2xlbmd0aCwgMTApID09PSAwID8gMzI3ODYgOiBwYXJzZUludChvcHRpb25zLndyYXBfbGluZV9sZW5ndGggfHwgMjUwLCAxMCk7XG4gICAgICAgIHVuZm9ybWF0dGVkID0gb3B0aW9ucy51bmZvcm1hdHRlZCB8fCBbJ2EnLCAnc3BhbicsICdiZG8nLCAnZW0nLCAnc3Ryb25nJywgJ2RmbicsICdjb2RlJywgJ3NhbXAnLCAna2JkJywgJ3ZhcicsICdjaXRlJywgJ2FiYnInLCAnYWNyb255bScsICdxJywgJ3N1YicsICdzdXAnLCAndHQnLCAnaScsICdiJywgJ2JpZycsICdzbWFsbCcsICd1JywgJ3MnLCAnc3RyaWtlJywgJ2ZvbnQnLCAnaW5zJywgJ2RlbCcsICdwcmUnLCAnYWRkcmVzcycsICdkdCcsICdoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddO1xuICAgICAgICBwcmVzZXJ2ZV9uZXdsaW5lcyA9IG9wdGlvbnMucHJlc2VydmVfbmV3bGluZXMgfHwgdHJ1ZTtcbiAgICAgICAgbWF4X3ByZXNlcnZlX25ld2xpbmVzID0gcHJlc2VydmVfbmV3bGluZXMgPyBwYXJzZUludChvcHRpb25zLm1heF9wcmVzZXJ2ZV9uZXdsaW5lcyB8fCAzMjc4NiwgMTApIDogMDtcbiAgICAgICAgaW5kZW50X2hhbmRsZWJhcnMgPSBvcHRpb25zLmluZGVudF9oYW5kbGViYXJzIHx8IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIFBhcnNlcigpIHtcblxuICAgICAgICAgICAgdGhpcy5wb3MgPSAwOyAvL1BhcnNlciBwb3NpdGlvblxuICAgICAgICAgICAgdGhpcy50b2tlbiA9ICcnO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50X21vZGUgPSAnQ09OVEVOVCc7IC8vcmVmbGVjdHMgdGhlIGN1cnJlbnQgUGFyc2VyIG1vZGU6IFRBRy9DT05URU5UXG4gICAgICAgICAgICB0aGlzLnRhZ3MgPSB7IC8vQW4gb2JqZWN0IHRvIGhvbGQgdGFncywgdGhlaXIgcG9zaXRpb24sIGFuZCB0aGVpciBwYXJlbnQtdGFncywgaW5pdGlhdGVkIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAgICAgICAgICAgICAgICBwYXJlbnQ6ICdwYXJlbnQxJyxcbiAgICAgICAgICAgICAgICBwYXJlbnRjb3VudDogMSxcbiAgICAgICAgICAgICAgICBwYXJlbnQxOiAnJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnJztcbiAgICAgICAgICAgIHRoaXMudG9rZW5fdGV4dCA9IHRoaXMubGFzdF90b2tlbiA9IHRoaXMubGFzdF90ZXh0ID0gdGhpcy50b2tlbl90eXBlID0gJyc7XG4gICAgICAgICAgICB0aGlzLm5ld2xpbmVzID0gMDtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50X2NvbnRlbnQgPSBpbmRlbnRfaW5uZXJfaHRtbDtcblxuICAgICAgICAgICAgdGhpcy5VdGlscyA9IHsgLy9VaWxpdGllcyBtYWRlIGF2YWlsYWJsZSB0byB0aGUgdmFyaW91cyBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICB3aGl0ZXNwYWNlOiBcIlxcblxcclxcdCBcIi5zcGxpdCgnJyksXG4gICAgICAgICAgICAgICAgc2luZ2xlX3Rva2VuOiAnYnIsaW5wdXQsbGluayxtZXRhLCFkb2N0eXBlLGJhc2Vmb250LGJhc2UsYXJlYSxocix3YnIscGFyYW0saW1nLGlzaW5kZXgsP3htbCxlbWJlZCw/cGhwLD8sPz0nLnNwbGl0KCcsJyksIC8vYWxsIHRoZSBzaW5nbGUgdGFncyBmb3IgSFRNTFxuICAgICAgICAgICAgICAgIGV4dHJhX2xpbmVyczogJ2hlYWQsYm9keSwvaHRtbCcuc3BsaXQoJywnKSwgLy9mb3IgdGFncyB0aGF0IG5lZWQgYSBsaW5lIG9mIHdoaXRlc3BhY2UgYmVmb3JlIHRoZW1cbiAgICAgICAgICAgICAgICBpbl9hcnJheTogZnVuY3Rpb24od2hhdCwgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2hhdCA9PT0gYXJyW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dF9jaGFyID0gJyc7XG5cbiAgICAgICAgICAgICAgICBpbnB1dF9jaGFyID0gdGhpcy5pbnB1dC5jaGFyQXQodGhpcy5wb3MpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLlV0aWxzLmluX2FycmF5KGlucHV0X2NoYXIsIHRoaXMuVXRpbHMud2hpdGVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdsaW5lcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLlV0aWxzLmluX2FycmF5KGlucHV0X2NoYXIsIHRoaXMuVXRpbHMud2hpdGVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVzZXJ2ZV9uZXdsaW5lcyAmJiBpbnB1dF9jaGFyID09PSAnXFxuJyAmJiB0aGlzLm5ld2xpbmVzIDw9IG1heF9wcmVzZXJ2ZV9uZXdsaW5lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3bGluZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0X2NvbnRlbnQgPSBmdW5jdGlvbigpIHsgLy9mdW5jdGlvbiB0byBjYXB0dXJlIHJlZ3VsYXIgY29udGVudCBiZXR3ZWVuIHRhZ3NcblxuICAgICAgICAgICAgICAgIHZhciBpbnB1dF9jaGFyID0gJycsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBmYWxzZTsgLy9pZiBhIHNwYWNlIGlzIG5lZWRlZFxuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKSAhPT0gJzwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcyA+PSB0aGlzLmlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQubGVuZ3RoID8gY29udGVudC5qb2luKCcnKSA6IFsnJywgJ1RLX0VPRiddO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy9kb24ndCB3YW50IHRvIGluc2VydCB1bm5lY2Vzc2FyeSBzcGFjZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudF9oYW5kbGViYXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGViYXJzIHBhcnNpbmcgaXMgY29tcGxpY2F0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB7eyNmb299fSBhbmQge3svZm9vfX0gYXJlIGZvcm1hdHRlZCB0YWdzLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8ge3tzb21ldGhpbmd9fSBzaG91bGQgZ2V0IHRyZWF0ZWQgYXMgY29udGVudCwgZXhjZXB0OlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8ge3tlbHNlfX0gc3BlY2lmaWNhbGx5IGJlaGF2ZXMgbGlrZSB7eyNpZn19IGFuZCB7ey9pZn19XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGVlazMgPSB0aGlzLmlucHV0LnN1YnN0cih0aGlzLnBvcywgMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVlazMgPT09ICd7eyMnIHx8IHBlZWszID09PSAne3svJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSB0YWdzIGFuZCBub3QgY29udGVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbnB1dC5zdWJzdHIodGhpcy5wb3MsIDIpID09PSAne3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0X3RhZyh0cnVlKSA9PT0gJ3t7ZWxzZX19Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpbnB1dF9jaGFyID0gdGhpcy5pbnB1dC5jaGFyQXQodGhpcy5wb3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcysrO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGluZV9jaGFyX2NvdW50ID49IHRoaXMud3JhcF9saW5lX2xlbmd0aCkgeyAvL2luc2VydCBhIGxpbmUgd2hlbiB0aGUgd3JhcF9saW5lX2xlbmd0aCBpcyByZWFjaGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lKGZhbHNlLCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X2luZGVudGF0aW9uKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50LnB1c2goaW5wdXRfY2hhcik7IC8vbGV0dGVyIGF0LWEtdGltZSAob3Igc3RyaW5nKSBpbnNlcnRlZCB0byBhbiBhcnJheVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudC5sZW5ndGggPyBjb250ZW50LmpvaW4oJycpIDogJyc7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF9jb250ZW50c190byA9IGZ1bmN0aW9uKG5hbWUpIHsgLy9nZXQgdGhlIGZ1bGwgY29udGVudCBvZiBhIHNjcmlwdCBvciBzdHlsZSB0byBwYXNzIHRvIGpzX2JlYXV0aWZ5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zID09PSB0aGlzLmlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWycnLCAnVEtfRU9GJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbnB1dF9jaGFyID0gJyc7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgcmVnX21hdGNoID0gbmV3IFJlZ0V4cCgnPC8nICsgbmFtZSArICdcXFxccyo+JywgJ2lnbScpO1xuICAgICAgICAgICAgICAgIHJlZ19tYXRjaC5sYXN0SW5kZXggPSB0aGlzLnBvcztcbiAgICAgICAgICAgICAgICB2YXIgcmVnX2FycmF5ID0gcmVnX21hdGNoLmV4ZWModGhpcy5pbnB1dCk7XG4gICAgICAgICAgICAgICAgdmFyIGVuZF9zY3JpcHQgPSByZWdfYXJyYXkgPyByZWdfYXJyYXkuaW5kZXggOiB0aGlzLmlucHV0Lmxlbmd0aDsgLy9hYnNvbHV0ZSBlbmQgb2Ygc2NyaXB0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zIDwgZW5kX3NjcmlwdCkgeyAvL2dldCBldmVyeXRoaW5nIGluIGJldHdlZW4gdGhlIHNjcmlwdCB0YWdzXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLmlucHV0LnN1YnN0cmluZyh0aGlzLnBvcywgZW5kX3NjcmlwdCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zID0gZW5kX3NjcmlwdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnJlY29yZF90YWcgPSBmdW5jdGlvbih0YWcpIHsgLy9mdW5jdGlvbiB0byByZWNvcmQgYSB0YWcgYW5kIGl0cyBwYXJlbnQgaW4gdGhpcy50YWdzIE9iamVjdFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J10pIHsgLy9jaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiB0aGlzIHRhZyB0eXBlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3NbdGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddXSA9IHRoaXMuaW5kZW50X2xldmVsOyAvL2FuZCByZWNvcmQgdGhlIHByZXNlbnQgaW5kZW50IGxldmVsXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy9vdGhlcndpc2UgaW5pdGlhbGl6ZSB0aGlzIHRhZyB0eXBlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFnc1t0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J11dID0gdGhpcy5pbmRlbnRfbGV2ZWw7IC8vYW5kIHJlY29yZCB0aGUgcHJlc2VudCBpbmRlbnQgbGV2ZWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzW3RhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSArICdwYXJlbnQnXSA9IHRoaXMudGFncy5wYXJlbnQ7IC8vc2V0IHRoZSBwYXJlbnQgKGkuZS4gaW4gdGhlIGNhc2Ugb2YgYSBkaXYgdGhpcy50YWdzLmRpdjFwYXJlbnQpXG4gICAgICAgICAgICAgICAgdGhpcy50YWdzLnBhcmVudCA9IHRhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXTsgLy9hbmQgbWFrZSB0aGlzIHRoZSBjdXJyZW50IHBhcmVudCAoaS5lLiBpbiB0aGUgY2FzZSBvZiBhIGRpdiAnZGl2MScpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnJldHJpZXZlX3RhZyA9IGZ1bmN0aW9uKHRhZykgeyAvL2Z1bmN0aW9uIHRvIHJldHJpZXZlIHRoZSBvcGVuaW5nIHRhZyB0byB0aGUgY29ycmVzcG9uZGluZyBjbG9zZXJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50YWdzW3RhZyArICdjb3VudCddKSB7IC8vaWYgdGhlIG9wZW5lbmVyIGlzIG5vdCBpbiB0aGUgT2JqZWN0IHdlIGlnbm9yZSBpdFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcF9wYXJlbnQgPSB0aGlzLnRhZ3MucGFyZW50OyAvL2NoZWNrIHRvIHNlZSBpZiBpdCdzIGEgY2xvc2FibGUgdGFnLlxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGVtcF9wYXJlbnQpIHsgLy90aWxsIHdlIHJlYWNoICcnICh0aGUgaW5pdGlhbCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddID09PSB0ZW1wX3BhcmVudCkgeyAvL2lmIHRoaXMgaXMgaXQgdXNlIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wX3BhcmVudCA9IHRoaXMudGFnc1t0ZW1wX3BhcmVudCArICdwYXJlbnQnXTsgLy9vdGhlcndpc2Uga2VlcCBvbiBjbGltYmluZyB1cCB0aGUgRE9NIFRyZWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcF9wYXJlbnQpIHsgLy9pZiB3ZSBjYXVnaHQgc29tZXRoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9sZXZlbCA9IHRoaXMudGFnc1t0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J11dOyAvL3NldCB0aGUgaW5kZW50X2xldmVsIGFjY29yZGluZ2x5XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3MucGFyZW50ID0gdGhpcy50YWdzW3RlbXBfcGFyZW50ICsgJ3BhcmVudCddOyAvL2FuZCBzZXQgdGhlIGN1cnJlbnQgcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFnc1t0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J10gKyAncGFyZW50J107IC8vZGVsZXRlIHRoZSBjbG9zZWQgdGFncyBwYXJlbnQgcmVmZXJlbmNlLi4uXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRhZ3NbdGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddXTsgLy8uLi5hbmQgdGhlIHRhZyBpdHNlbGZcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXS0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5pbmRlbnRfdG9fdGFnID0gZnVuY3Rpb24odGFnKSB7XG4gICAgICAgICAgICAgICAgLy8gTWF0Y2ggdGhlIGluZGVudGF0aW9uIGxldmVsIHRvIHRoZSBsYXN0IHVzZSBvZiB0aGlzIHRhZywgYnV0IGRvbid0IHJlbW92ZSBpdC5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGFnc1t0YWcgKyAnY291bnQnXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0ZW1wX3BhcmVudCA9IHRoaXMudGFncy5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRlbXBfcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J10gPT09IHRlbXBfcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0ZW1wX3BhcmVudCA9IHRoaXMudGFnc1t0ZW1wX3BhcmVudCArICdwYXJlbnQnXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBfcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X2xldmVsID0gdGhpcy50YWdzW3RhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXRfdGFnID0gZnVuY3Rpb24ocGVlaykgeyAvL2Z1bmN0aW9uIHRvIGdldCBhIGZ1bGwgdGFnIGFuZCBwYXJzZSBpdHMgdHlwZVxuICAgICAgICAgICAgICAgIHZhciBpbnB1dF9jaGFyID0gJycsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9ICcnLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnQsIHRhZ19lbmQsXG4gICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydF9jaGFyLFxuICAgICAgICAgICAgICAgICAgICBvcmlnX3BvcyA9IHRoaXMucG9zLFxuICAgICAgICAgICAgICAgICAgICBvcmlnX2xpbmVfY2hhcl9jb3VudCA9IHRoaXMubGluZV9jaGFyX2NvdW50O1xuXG4gICAgICAgICAgICAgICAgcGVlayA9IHBlZWsgIT09IHVuZGVmaW5lZCA/IHBlZWsgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zID49IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVlaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9zID0gb3JpZ19wb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQgPSBvcmlnX2xpbmVfY2hhcl9jb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50Lmxlbmd0aCA/IGNvbnRlbnQuam9pbignJykgOiBbJycsICdUS19FT0YnXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuVXRpbHMuaW5fYXJyYXkoaW5wdXRfY2hhciwgdGhpcy5VdGlscy53aGl0ZXNwYWNlKSkgeyAvL2Rvbid0IHdhbnQgdG8gaW5zZXJ0IHVubmVjZXNzYXJ5IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9jaGFyID09PSBcIidcIiB8fCBpbnB1dF9jaGFyID09PSAnXCInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dF9jaGFyICs9IHRoaXMuZ2V0X3VuZm9ybWF0dGVkKGlucHV0X2NoYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRfY2hhciA9PT0gJz0nKSB7IC8vbm8gc3BhY2UgYmVmb3JlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudC5sZW5ndGggJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdICE9PSAnPScgJiYgaW5wdXRfY2hhciAhPT0gJz4nICYmIHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL25vIHNwYWNlIGFmdGVyID0gb3IgYmVmb3JlID5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmVfY2hhcl9jb3VudCA+PSB0aGlzLndyYXBfbGluZV9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUoZmFsc2UsIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfaW5kZW50YXRpb24oY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudF9oYW5kbGViYXJzICYmIHRhZ19zdGFydF9jaGFyID09PSAnPCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gaW5zaWRlIGFuIGFuZ2xlLWJyYWNrZXQgdGFnLCBwdXQgc3BhY2VzIGFyb3VuZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlYmFycyBub3QgaW5zaWRlIG9mIHN0cmluZ3MuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGlucHV0X2NoYXIgKyB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcykpID09PSAne3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciArPSB0aGlzLmdldF91bmZvcm1hdHRlZCgnfX0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudC5sZW5ndGggJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdICE9PSAnICcgJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdICE9PSAnPCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9ICcgJyArIGlucHV0X2NoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9jaGFyID09PSAnPCcgJiYgIXRhZ19zdGFydF9jaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnQgPSB0aGlzLnBvcyAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnRfY2hhciA9ICc8JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRlbnRfaGFuZGxlYmFycyAmJiAhdGFnX3N0YXJ0X2NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCA+PSAyICYmIGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAxXSA9PT0gJ3snICYmIGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAyXSA9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRfY2hhciA9PT0gJyMnIHx8IGlucHV0X2NoYXIgPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnQgPSB0aGlzLnBvcyAtIDM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnX3N0YXJ0ID0gdGhpcy5wb3MgLSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnRfY2hhciA9ICd7JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaChpbnB1dF9jaGFyKTsgLy9pbnNlcnRzIGNoYXJhY3RlciBhdC1hLXRpbWUgKG9yIHN0cmluZylcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFsxXSAmJiBjb250ZW50WzFdID09PSAnIScpIHsgLy9pZiB3ZSdyZSBpbiBhIGNvbW1lbnQsIGRvIHNvbWV0aGluZyBzcGVjaWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSB0cmVhdCBhbGwgY29tbWVudHMgYXMgbGl0ZXJhbHMsIGV2ZW4gbW9yZSB0aGFuIHByZWZvcm1hdHRlZCB0YWdzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBqdXN0IGxvb2sgZm9yIHRoZSBhcHByb3ByaWF0ZSBjbG9zZSB0YWdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBbdGhpcy5nZXRfY29tbWVudCh0YWdfc3RhcnQpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudF9oYW5kbGViYXJzICYmIHRhZ19zdGFydF9jaGFyID09PSAneycgJiYgY29udGVudC5sZW5ndGggPiAyICYmIGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAyXSA9PT0gJ30nICYmIGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAxXSA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGlucHV0X2NoYXIgIT09ICc+Jyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGFnX2NvbXBsZXRlID0gY29udGVudC5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFnX2luZGV4O1xuICAgICAgICAgICAgICAgIHZhciB0YWdfb2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhZ19jb21wbGV0ZS5pbmRleE9mKCcgJykgIT09IC0xKSB7IC8vaWYgdGhlcmUncyB3aGl0ZXNwYWNlLCB0aGF0cyB3aGVyZSB0aGUgdGFnIG5hbWUgZW5kc1xuICAgICAgICAgICAgICAgICAgICB0YWdfaW5kZXggPSB0YWdfY29tcGxldGUuaW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFnX2NvbXBsZXRlWzBdID09PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnX2luZGV4ID0gdGFnX2NvbXBsZXRlLmluZGV4T2YoJ30nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBnbyB3aXRoIHRoZSB0YWcgZW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIHRhZ19pbmRleCA9IHRhZ19jb21wbGV0ZS5pbmRleE9mKCc+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0YWdfY29tcGxldGVbMF0gPT09ICc8JyB8fCAhaW5kZW50X2hhbmRsZWJhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnX29mZnNldCA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnX29mZnNldCA9IHRhZ19jb21wbGV0ZVsyXSA9PT0gJyMnID8gMyA6IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0YWdfY2hlY2sgPSB0YWdfY29tcGxldGUuc3Vic3RyaW5nKHRhZ19vZmZzZXQsIHRhZ19pbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAodGFnX2NvbXBsZXRlLmNoYXJBdCh0YWdfY29tcGxldGUubGVuZ3RoIC0gMikgPT09ICcvJyB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLlV0aWxzLmluX2FycmF5KHRhZ19jaGVjaywgdGhpcy5VdGlscy5zaW5nbGVfdG9rZW4pKSB7IC8vaWYgdGhpcyB0YWcgbmFtZSBpcyBhIHNpbmdsZSB0YWcgdHlwZSAoZWl0aGVyIGluIHRoZSBsaXN0IG9yIGhhcyBhIGNsb3NpbmcgLylcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ1NJTkdMRSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGVudF9oYW5kbGViYXJzICYmIHRhZ19jb21wbGV0ZVswXSA9PT0gJ3snICYmIHRhZ19jaGVjayA9PT0gJ2Vsc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVlaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfdG9fdGFnKCdpZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdfdHlwZSA9ICdIQU5ETEVCQVJTX0VMU0UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfY29udGVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYXZlcnNlX3doaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFnX2NoZWNrID09PSAnc2NyaXB0JykgeyAvL2ZvciBsYXRlciBzY3JpcHQgaGFuZGxpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZF90YWcodGFnX2NoZWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnU0NSSVBUJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFnX2NoZWNrID09PSAnc3R5bGUnKSB7IC8vZm9yIGZ1dHVyZSBzdHlsZSBoYW5kbGluZyAoZm9yIG5vdyBpdCBqdXN0cyB1c2VzIGdldF9jb250ZW50KVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkX3RhZyh0YWdfY2hlY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdfdHlwZSA9ICdTVFlMRSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNfdW5mb3JtYXR0ZWQodGFnX2NoZWNrLCB1bmZvcm1hdHRlZCkpIHsgLy8gZG8gbm90IHJlZm9ybWF0IHRoZSBcInVuZm9ybWF0dGVkXCIgdGFnc1xuICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gdGhpcy5nZXRfdW5mb3JtYXR0ZWQoJzwvJyArIHRhZ19jaGVjayArICc+JywgdGFnX2NvbXBsZXRlKTsgLy8uLi5kZWxlZ2F0ZSB0byBnZXRfdW5mb3JtYXR0ZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5wdXNoKGNvbW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmVzZXJ2ZSBjb2xsYXBzZWQgd2hpdGVzcGFjZSBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoaXMgdGFnLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGFnX3N0YXJ0ID4gMCAmJiB0aGlzLlV0aWxzLmluX2FycmF5KHRoaXMuaW5wdXQuY2hhckF0KHRhZ19zdGFydCAtIDEpLCB0aGlzLlV0aWxzLndoaXRlc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnNwbGljZSgwLCAwLCB0aGlzLmlucHV0LmNoYXJBdCh0YWdfc3RhcnQgLSAxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFnX2VuZCA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuVXRpbHMuaW5fYXJyYXkodGhpcy5pbnB1dC5jaGFyQXQodGFnX2VuZCArIDEpLCB0aGlzLlV0aWxzLndoaXRlc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnB1c2godGhpcy5pbnB1dC5jaGFyQXQodGFnX2VuZCArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ1NJTkdMRSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWdfY2hlY2suY2hhckF0KDApID09PSAnIScpIHsgLy9wZWVrIGZvciA8ISBjb21tZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBjb21tZW50cyBjb250ZW50IGlzIGFscmVhZHkgY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ1NJTkdMRSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYXZlcnNlX3doaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXBlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ19jaGVjay5jaGFyQXQoMCkgPT09ICcvJykgeyAvL3RoaXMgdGFnIGlzIGEgZG91YmxlIHRhZyBzbyBjaGVjayBmb3IgdGFnLWVuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXRyaWV2ZV90YWcodGFnX2NoZWNrLnN1YnN0cmluZygxKSk7IC8vcmVtb3ZlIGl0IGFuZCBhbGwgYW5jZXN0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ0VORCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYXZlcnNlX3doaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy9vdGhlcndpc2UgaXQncyBhIHN0YXJ0LXRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRfdGFnKHRhZ19jaGVjayk7IC8vcHVzaCBpdCBvbiB0aGUgdGFnIHN0YWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnX2NoZWNrLnRvTG93ZXJDYXNlKCkgIT09ICdodG1sJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X2NvbnRlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdfdHlwZSA9ICdTVEFSVCc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFsbG93IHByZXNlcnZpbmcgb2YgbmV3bGluZXMgYWZ0ZXIgYSBzdGFydCB0YWdcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlV0aWxzLmluX2FycmF5KHRhZ19jaGVjaywgdGhpcy5VdGlscy5leHRyYV9saW5lcnMpKSB7IC8vY2hlY2sgaWYgdGhpcyBkb3VibGUgbmVlZHMgYW4gZXh0cmEgbGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lKGZhbHNlLCB0aGlzLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vdXRwdXQubGVuZ3RoICYmIHRoaXMub3V0cHV0W3RoaXMub3V0cHV0Lmxlbmd0aCAtIDJdICE9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfbmV3bGluZSh0cnVlLCB0aGlzLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGVlaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcyA9IG9yaWdfcG9zO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCA9IG9yaWdfbGluZV9jaGFyX2NvdW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50LmpvaW4oJycpOyAvL3JldHVybnMgZnVsbHkgZm9ybWF0dGVkIHRhZ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXRfY29tbWVudCA9IGZ1bmN0aW9uKHN0YXJ0X3BvcykgeyAvL2Z1bmN0aW9uIHRvIHJldHVybiBjb21tZW50IGNvbnRlbnQgaW4gaXRzIGVudGlyZXR5XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB3aWxsIGhhdmUgdmVyeSBwb29yIHBlcmYsIGJ1dCB3aWxsIHdvcmsgZm9yIG5vdy5cbiAgICAgICAgICAgICAgICB2YXIgY29tbWVudCA9ICcnLFxuICAgICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSAnPicsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucG9zID0gc3RhcnRfcG9zO1xuICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcblxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8PSB0aGlzLmlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb21tZW50ICs9IGlucHV0X2NoYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gb25seSBuZWVkIHRvIGNoZWNrIGZvciB0aGUgZGVsaW1pdGVyIGlmIHRoZSBsYXN0IGNoYXJzIG1hdGNoXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tZW50W2NvbW1lbnQubGVuZ3RoIC0gMV0gPT09IGRlbGltaXRlcltkZWxpbWl0ZXIubGVuZ3RoIC0gMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQuaW5kZXhPZihkZWxpbWl0ZXIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IG5lZWQgdG8gc2VhcmNoIGZvciBjdXN0b20gZGVsaW1pdGVyIGZvciB0aGUgZmlyc3QgZmV3IGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXRjaGVkICYmIGNvbW1lbnQubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21tZW50LmluZGV4T2YoJzwhW2lmJykgPT09IDApIHsgLy9wZWVrIGZvciA8IVtpZiBjb25kaXRpb25hbCBjb21tZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsaW1pdGVyID0gJzwhW2VuZGlmXT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tZW50LmluZGV4T2YoJzwhW2NkYXRhWycpID09PSAwKSB7IC8vaWYgaXQncyBhIDxbY2RhdGFbIGNvbW1lbnQuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSAnXV0+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWVudC5pbmRleE9mKCc8IVsnKSA9PT0gMCkgeyAvLyBzb21lIG90aGVyICFbIGNvbW1lbnQ/IC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9ICddPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1lbnQuaW5kZXhPZignPCEtLScpID09PSAwKSB7IC8vIDwhLS0gY29tbWVudCAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSAnLS0+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF91bmZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRlbGltaXRlciwgb3JpZ190YWcpIHsgLy9mdW5jdGlvbiB0byByZXR1cm4gdW5mb3JtYXR0ZWQgY29udGVudCBpbiBpdHMgZW50aXJldHlcblxuICAgICAgICAgICAgICAgIGlmIChvcmlnX3RhZyAmJiBvcmlnX3RhZy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZGVsaW1pdGVyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRfY2hhciA9ICcnO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgdmFyIG1pbl9pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkbyB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zID49IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuVXRpbHMuaW5fYXJyYXkoaW5wdXRfY2hhciwgdGhpcy5VdGlscy53aGl0ZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50LS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRfY2hhciA9PT0gJ1xcbicgfHwgaW5wdXRfY2hhciA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBEb24ndCBjaGFuZ2UgdGFiIGluZGVudGlvbiBmb3IgdW5mb3JtYXR0ZWQgYmxvY2tzLiAgSWYgdXNpbmcgY29kZSBmb3IgaHRtbCBlZGl0aW5nLCB0aGlzIHdpbGwgZ3JlYXRseSBhZmZlY3QgPHByZT4gdGFncyBpZiB0aGV5IGFyZSBzcGVjaWZpZWQgaW4gdGhlICd1bmZvcm1hdHRlZCBhcnJheSdcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5pbmRlbnRfbGV2ZWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgY29udGVudCArPSB0aGlzLmluZGVudF9zdHJpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNwYWNlID0gZmFsc2U7IC8vLi4uYW5kIG1ha2Ugc3VyZSBvdGhlciBpbmRlbnRhdGlvbiBpcyBlcmFzZWRcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IGlucHV0X2NoYXI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZW50X2hhbmRsZWJhcnMgJiYgaW5wdXRfY2hhciA9PT0gJ3snICYmIGNvbnRlbnQubGVuZ3RoICYmIGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAyXSA9PT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGViYXJzIGV4cHJlc3Npb25zIGluIHN0cmluZ3Mgc2hvdWxkIGFsc28gYmUgdW5mb3JtYXR0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRoaXMuZ2V0X3VuZm9ybWF0dGVkKCd9fScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlc2UgZXhwcmVzc2lvbnMgYXJlIG9wYXF1ZS4gIElnbm9yZSBkZWxpbWl0ZXJzIGZvdW5kIGluIHRoZW0uXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5faW5kZXggPSBjb250ZW50Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGNvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGRlbGltaXRlciwgbWluX2luZGV4KSA9PT0gLTEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXRfdG9rZW4gPSBmdW5jdGlvbigpIHsgLy9pbml0aWFsIGhhbmRsZXIgZm9yIHRva2VuLXJldHJpZXZhbFxuICAgICAgICAgICAgICAgIHZhciB0b2tlbjtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RfdG9rZW4gPT09ICdUS19UQUdfU0NSSVBUJyB8fCB0aGlzLmxhc3RfdG9rZW4gPT09ICdUS19UQUdfU1RZTEUnKSB7IC8vY2hlY2sgaWYgd2UgbmVlZCB0byBmb3JtYXQgamF2YXNjcmlwdFxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHRoaXMubGFzdF90b2tlbi5zdWJzdHIoNyk7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5nZXRfY29udGVudHNfdG8odHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt0b2tlbiwgJ1RLXycgKyB0eXBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF9tb2RlID09PSAnQ09OVEVOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLmdldF9jb250ZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Rva2VuLCAnVEtfQ09OVEVOVCddO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF9tb2RlID09PSAnVEFHJykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMuZ2V0X3RhZygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhZ19uYW1lX3R5cGUgPSAnVEtfVEFHXycgKyB0aGlzLnRhZ190eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt0b2tlbiwgdGFnX25hbWVfdHlwZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF9mdWxsX2luZGVudCA9IGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgICAgICAgICAgICAgbGV2ZWwgPSB0aGlzLmluZGVudF9sZXZlbCArIGxldmVsIHx8IDA7XG4gICAgICAgICAgICAgICAgaWYgKGxldmVsIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5KGxldmVsICsgMSkuam9pbih0aGlzLmluZGVudF9zdHJpbmcpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5pc191bmZvcm1hdHRlZCA9IGZ1bmN0aW9uKHRhZ19jaGVjaywgdW5mb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAvL2lzIHRoaXMgYW4gSFRNTDUgYmxvY2stbGV2ZWwgbGluaz9cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuVXRpbHMuaW5fYXJyYXkodGFnX2NoZWNrLCB1bmZvcm1hdHRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YWdfY2hlY2sudG9Mb3dlckNhc2UoKSAhPT0gJ2EnIHx8ICF0aGlzLlV0aWxzLmluX2FycmF5KCdhJywgdW5mb3JtYXR0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vYXQgdGhpcyBwb2ludCB3ZSBoYXZlIGFuICB0YWc7IGlzIGl0cyBmaXJzdCBjaGlsZCBzb21ldGhpbmcgd2Ugd2FudCB0byByZW1haW5cbiAgICAgICAgICAgICAgICAvL3VuZm9ybWF0dGVkP1xuICAgICAgICAgICAgICAgIHZhciBuZXh0X3RhZyA9IHRoaXMuZ2V0X3RhZyh0cnVlIC8qIHBlZWsuICovICk7XG5cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IG5leHRfdGFnIHRvIHNlZSBpZiBpdCBpcyBqdXN0IGh0bWwgdGFnIChubyBleHRlcm5hbCBjb250ZW50KVxuICAgICAgICAgICAgICAgIHZhciB0YWcgPSAobmV4dF90YWcgfHwgXCJcIikubWF0Y2goL15cXHMqPFxccypcXC8/KFthLXpdKilcXHMqW14+XSo+XFxzKiQvKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIG5leHRfdGFnIGNvbWVzIGJhY2sgYnV0IGlzIG5vdCBhbiBpc29sYXRlZCB0YWcsIHRoZW5cbiAgICAgICAgICAgICAgICAvLyBsZXQncyB0cmVhdCB0aGUgJ2EnIHRhZyBhcyBoYXZpbmcgY29udGVudFxuICAgICAgICAgICAgICAgIC8vIGFuZCByZXNwZWN0IHRoZSB1bmZvcm1hdHRlZCBvcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoIXRhZyB8fCB0aGlzLlV0aWxzLmluX2FycmF5KHRhZywgdW5mb3JtYXR0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnByaW50ZXIgPSBmdW5jdGlvbihqc19zb3VyY2UsIGluZGVudF9jaGFyYWN0ZXIsIGluZGVudF9zaXplLCB3cmFwX2xpbmVfbGVuZ3RoLCBicmFjZV9zdHlsZSkgeyAvL2hhbmRsZXMgaW5wdXQvb3V0cHV0IGFuZCBzb21lIG90aGVyIHByaW50aW5nIGZ1bmN0aW9uc1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dCA9IGpzX3NvdXJjZSB8fCAnJzsgLy9nZXRzIHRoZSBpbnB1dCBmb3IgdGhlIFBhcnNlclxuICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0ID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfY2hhcmFjdGVyID0gaW5kZW50X2NoYXJhY3RlcjtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9zdHJpbmcgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9zaXplID0gaW5kZW50X3NpemU7XG4gICAgICAgICAgICAgICAgdGhpcy5icmFjZV9zdHlsZSA9IGJyYWNlX3N0eWxlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X2xldmVsID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBfbGluZV9sZW5ndGggPSB3cmFwX2xpbmVfbGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50ID0gMDsgLy9jb3VudCB0byBzZWUgaWYgd3JhcF9saW5lX2xlbmd0aCB3YXMgZXhjZWVkZWRcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbmRlbnRfc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X3N0cmluZyArPSB0aGlzLmluZGVudF9jaGFyYWN0ZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lID0gZnVuY3Rpb24oZm9yY2UsIGFycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXJyIHx8ICFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcmNlIHx8IChhcnJbYXJyLmxlbmd0aCAtIDFdICE9PSAnXFxuJykpIHsgLy93ZSBtaWdodCB3YW50IHRoZSBleHRyYSBsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmludF9pbmRlbnRhdGlvbiA9IGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaW5kZW50X2xldmVsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHRoaXMuaW5kZW50X3N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCArPSB0aGlzLmluZGVudF9zdHJpbmcubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfdG9rZW4gPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0IHx8IHRleHQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vdXRwdXQubGVuZ3RoICYmIHRoaXMub3V0cHV0W3RoaXMub3V0cHV0Lmxlbmd0aCAtIDFdID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfaW5kZW50YXRpb24odGhpcy5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBsdHJpbSh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X3Rva2VuX3Jhdyh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmludF90b2tlbl9yYXcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPiAxICYmIHRleHRbdGV4dC5sZW5ndGggLSAxXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmZvcm1hdHRlZCB0YWdzIGNhbiBncmFiIG5ld2xpbmVzIGFzIHRoZWlyIGxhc3QgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQucHVzaCh0ZXh0LnNsaWNlKDAsIC0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lKGZhbHNlLCB0aGlzLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0LnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHRoaXMubmV3bGluZXM7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lKG4gPiAwLCB0aGlzLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdsaW5lcyA9IDA7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X2xldmVsKys7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMudW5pbmRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZW50X2xldmVsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfbGV2ZWwtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKl9fX19fX19fX19fX19fX19fX19fXy0tLS0tLS0tLS0tLS0tLS0tLS0tX19fX19fX19fX19fX19fX19fX19fKi9cblxuICAgICAgICBtdWx0aV9wYXJzZXIgPSBuZXcgUGFyc2VyKCk7IC8vd3JhcHBpbmcgZnVuY3Rpb25zIFBhcnNlclxuICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRlcihodG1sX3NvdXJjZSwgaW5kZW50X2NoYXJhY3RlciwgaW5kZW50X3NpemUsIHdyYXBfbGluZV9sZW5ndGgsIGJyYWNlX3N0eWxlKTsgLy9pbml0aWFsaXplIHN0YXJ0aW5nIHZhbHVlc1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgdCA9IG11bHRpX3BhcnNlci5nZXRfdG9rZW4oKTtcbiAgICAgICAgICAgIG11bHRpX3BhcnNlci50b2tlbl90ZXh0ID0gdFswXTtcbiAgICAgICAgICAgIG11bHRpX3BhcnNlci50b2tlbl90eXBlID0gdFsxXTtcblxuICAgICAgICAgICAgaWYgKG11bHRpX3BhcnNlci50b2tlbl90eXBlID09PSAnVEtfRU9GJykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzd2l0Y2ggKG11bHRpX3BhcnNlci50b2tlbl90eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfVEFHX1NUQVJUJzpcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X25ld2xpbmUoZmFsc2UsIG11bHRpX3BhcnNlci5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfdG9rZW4obXVsdGlfcGFyc2VyLnRva2VuX3RleHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlfcGFyc2VyLmluZGVudF9jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuaW5kZW50X2NvbnRlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuY3VycmVudF9tb2RlID0gJ0NPTlRFTlQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdUS19UQUdfU1RZTEUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1RBR19TQ1JJUFQnOlxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfbmV3bGluZShmYWxzZSwgbXVsdGlfcGFyc2VyLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbihtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnQ09OVEVOVCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1RBR19FTkQnOlxuICAgICAgICAgICAgICAgICAgICAvL1ByaW50IG5ldyBsaW5lIG9ubHkgaWYgdGhlIHRhZyBoYXMgbm8gY29udGVudCBhbmQgaGFzIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aV9wYXJzZXIubGFzdF90b2tlbiA9PT0gJ1RLX0NPTlRFTlQnICYmIG11bHRpX3BhcnNlci5sYXN0X3RleHQgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFnX25hbWUgPSBtdWx0aV9wYXJzZXIudG9rZW5fdGV4dC5tYXRjaCgvXFx3Ky8pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhZ19leHRyYWN0ZWRfZnJvbV9sYXN0X291dHB1dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlfcGFyc2VyLm91dHB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdfZXh0cmFjdGVkX2Zyb21fbGFzdF9vdXRwdXQgPSBtdWx0aV9wYXJzZXIub3V0cHV0W211bHRpX3BhcnNlci5vdXRwdXQubGVuZ3RoIC0gMV0ubWF0Y2goLyg/Ojx8e3sjKVxccyooXFx3KykvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfZXh0cmFjdGVkX2Zyb21fbGFzdF9vdXRwdXQgPT09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdfZXh0cmFjdGVkX2Zyb21fbGFzdF9vdXRwdXRbMV0gIT09IHRhZ19uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X25ld2xpbmUoZmFsc2UsIG11bHRpX3BhcnNlci5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbihtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnQ09OVEVOVCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1RBR19TSU5HTEUnOlxuICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBhZGQgYSBuZXdsaW5lIGJlZm9yZSBlbGVtZW50cyB0aGF0IHNob3VsZCByZW1haW4gdW5mb3JtYXR0ZWQuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWdfY2hlY2sgPSBtdWx0aV9wYXJzZXIudG9rZW5fdGV4dC5tYXRjaCgvXlxccyo8KFthLXpdKykvaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFnX2NoZWNrIHx8ICFtdWx0aV9wYXJzZXIuVXRpbHMuaW5fYXJyYXkodGFnX2NoZWNrWzFdLCB1bmZvcm1hdHRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF9uZXdsaW5lKGZhbHNlLCBtdWx0aV9wYXJzZXIub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfdG9rZW4obXVsdGlfcGFyc2VyLnRva2VuX3RleHQpO1xuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuY3VycmVudF9tb2RlID0gJ0NPTlRFTlQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdUS19UQUdfSEFORExFQkFSU19FTFNFJzpcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X3Rva2VuKG11bHRpX3BhcnNlci50b2tlbl90ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpX3BhcnNlci5pbmRlbnRfY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmluZGVudF9jb250ZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmN1cnJlbnRfbW9kZSA9ICdDT05URU5UJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfQ09OVEVOVCc6XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbihtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnVEFHJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfU1RZTEUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1NDUklQVCc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF9uZXdsaW5lKGZhbHNlLCBtdWx0aV9wYXJzZXIub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gbXVsdGlfcGFyc2VyLnRva2VuX3RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2JlYXV0aWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0X2luZGVudF9sZXZlbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlfcGFyc2VyLnRva2VuX3R5cGUgPT09ICdUS19TQ1JJUFQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2JlYXV0aWZpZXIgPSB0eXBlb2YganNfYmVhdXRpZnkgPT09ICdmdW5jdGlvbicgJiYganNfYmVhdXRpZnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG11bHRpX3BhcnNlci50b2tlbl90eXBlID09PSAnVEtfU1RZTEUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2JlYXV0aWZpZXIgPSB0eXBlb2YgY3NzX2JlYXV0aWZ5ID09PSAnZnVuY3Rpb24nICYmIGNzc19iZWF1dGlmeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaW5kZW50X3NjcmlwdHMgPT09IFwia2VlcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0X2luZGVudF9sZXZlbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaW5kZW50X3NjcmlwdHMgPT09IFwic2VwYXJhdGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdF9pbmRlbnRfbGV2ZWwgPSAtbXVsdGlfcGFyc2VyLmluZGVudF9sZXZlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGVudGF0aW9uID0gbXVsdGlfcGFyc2VyLmdldF9mdWxsX2luZGVudChzY3JpcHRfaW5kZW50X2xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfYmVhdXRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIEJlYXV0aWZpZXIgaWYgYXZhbGlhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IF9iZWF1dGlmaWVyKHRleHQucmVwbGFjZSgvXlxccyovLCBpbmRlbnRhdGlvbiksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaW1wbHkgaW5kZW50IHRoZSBzdHJpbmcgb3RoZXJ3aXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdoaXRlID0gdGV4dC5tYXRjaCgvXlxccyovKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2xldmVsID0gd2hpdGUubWF0Y2goL1teXFxuXFxyXSokLylbMF0uc3BsaXQobXVsdGlfcGFyc2VyLmluZGVudF9zdHJpbmcpLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlaW5kZW50ID0gbXVsdGlfcGFyc2VyLmdldF9mdWxsX2luZGVudChzY3JpcHRfaW5kZW50X2xldmVsIC0gX2xldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxzKi8sIGluZGVudGF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyXFxufFxccnxcXG4vZywgJ1xcbicgKyByZWluZGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccyskLywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfdG9rZW5fcmF3KGluZGVudGF0aW9uICsgdHJpbSh0ZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X25ld2xpbmUoZmFsc2UsIG11bHRpX3BhcnNlci5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnVEFHJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtdWx0aV9wYXJzZXIubGFzdF90b2tlbiA9IG11bHRpX3BhcnNlci50b2tlbl90eXBlO1xuICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmxhc3RfdGV4dCA9IG11bHRpX3BhcnNlci50b2tlbl90ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtdWx0aV9wYXJzZXIub3V0cHV0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8gQWRkIHN1cHBvcnQgZm9yIHJlcXVpcmUuanNcbiAgICAgICAgZGVmaW5lKFtcIi4vYmVhdXRpZnkuanNcIiwgXCIuL2JlYXV0aWZ5LWNzcy5qc1wiXSwgZnVuY3Rpb24oanNfYmVhdXRpZnksIGNzc19iZWF1dGlmeSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaHRtbF9iZWF1dGlmeTogZnVuY3Rpb24oaHRtbF9zb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3R5bGVfaHRtbChodG1sX3NvdXJjZSwgb3B0aW9ucywganNfYmVhdXRpZnksIGNzc19iZWF1dGlmeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gQWRkIHN1cHBvcnQgZm9yIENvbW1vbkpTLiBKdXN0IHB1dCB0aGlzIGZpbGUgc29tZXdoZXJlIG9uIHlvdXIgcmVxdWlyZS5wYXRoc1xuICAgICAgICAvLyBhbmQgeW91IHdpbGwgYmUgYWJsZSB0byBgdmFyIGh0bWxfYmVhdXRpZnkgPSByZXF1aXJlKFwiYmVhdXRpZnlcIikuaHRtbF9iZWF1dGlmeWAuXG4gICAgICAgIHZhciBqc19iZWF1dGlmeSA9IHJlcXVpcmUoJy4vYmVhdXRpZnkuanMnKS5qc19iZWF1dGlmeTtcbiAgICAgICAgdmFyIGNzc19iZWF1dGlmeSA9IHJlcXVpcmUoJy4vYmVhdXRpZnktY3NzLmpzJykuY3NzX2JlYXV0aWZ5O1xuXG4gICAgICAgIGV4cG9ydHMuaHRtbF9iZWF1dGlmeSA9IGZ1bmN0aW9uKGh0bWxfc291cmNlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGVfaHRtbChodG1sX3NvdXJjZSwgb3B0aW9ucywganNfYmVhdXRpZnksIGNzc19iZWF1dGlmeSk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIElmIHdlJ3JlIHJ1bm5pbmcgYSB3ZWIgcGFnZSBhbmQgZG9uJ3QgaGF2ZSBlaXRoZXIgb2YgdGhlIGFib3ZlLCBhZGQgb3VyIG9uZSBnbG9iYWxcbiAgICAgICAgd2luZG93Lmh0bWxfYmVhdXRpZnkgPSBmdW5jdGlvbihodG1sX3NvdXJjZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UsIG9wdGlvbnMsIHdpbmRvdy5qc19iZWF1dGlmeSwgd2luZG93LmNzc19iZWF1dGlmeSk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGV2ZW4gaGF2ZSB3aW5kb3csIHRyeSBnbG9iYWwuXG4gICAgICAgIGdsb2JhbC5odG1sX2JlYXV0aWZ5ID0gZnVuY3Rpb24oaHRtbF9zb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZV9odG1sKGh0bWxfc291cmNlLCBvcHRpb25zLCBnbG9iYWwuanNfYmVhdXRpZnksIGdsb2JhbC5jc3NfYmVhdXRpZnkpO1xuICAgICAgICB9O1xuICAgIH1cblxufSgpKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKmpzaGludCBjdXJseTp0cnVlLCBlcWVxZXE6dHJ1ZSwgbGF4YnJlYWs6dHJ1ZSwgbm9lbXB0eTpmYWxzZSAqL1xuLypcblxuICBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuICBDb3B5cmlnaHQgKGMpIDIwMDctMjAxMyBFaW5hciBMaWVsbWFuaXMgYW5kIGNvbnRyaWJ1dG9ycy5cblxuICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuICAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuICBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTXG4gIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuICBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTlxuICBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gIFNPRlRXQVJFLlxuXG4gSlMgQmVhdXRpZmllclxuLS0tLS0tLS0tLS0tLS0tXG5cblxuICBXcml0dGVuIGJ5IEVpbmFyIExpZWxtYW5pcywgPGVpbmFyQGpzYmVhdXRpZmllci5vcmc+XG4gICAgICBodHRwOi8vanNiZWF1dGlmaWVyLm9yZy9cblxuICBPcmlnaW5hbGx5IGNvbnZlcnRlZCB0byBqYXZhc2NyaXB0IGJ5IFZpdGFsLCA8dml0YWw3NkBnbWFpbC5jb20+XG4gIFwiRW5kIGJyYWNlcyBvbiBvd24gbGluZVwiIGFkZGVkIGJ5IENocmlzIEouIFNodWxsLCA8Y2hyaXNqc2h1bGxAZ21haWwuY29tPlxuICBQYXJzaW5nIGltcHJvdmVtZW50cyBmb3IgYnJhY2UtbGVzcyBzdGF0ZW1lbnRzIGJ5IExpYW0gTmV3bWFuIDxiaXR3aXNlbWFuQGdtYWlsLmNvbT5cblxuXG4gIFVzYWdlOlxuICAgIGpzX2JlYXV0aWZ5KGpzX3NvdXJjZV90ZXh0KTtcbiAgICBqc19iZWF1dGlmeShqc19zb3VyY2VfdGV4dCwgb3B0aW9ucyk7XG5cbiAgVGhlIG9wdGlvbnMgYXJlOlxuICAgIGluZGVudF9zaXplIChkZWZhdWx0IDQpICAgICAgICAgIC0gaW5kZW50YXRpb24gc2l6ZSxcbiAgICBpbmRlbnRfY2hhciAoZGVmYXVsdCBzcGFjZSkgICAgICAtIGNoYXJhY3RlciB0byBpbmRlbnQgd2l0aCxcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lcyAoZGVmYXVsdCB0cnVlKSAtIHdoZXRoZXIgZXhpc3RpbmcgbGluZSBicmVha3Mgc2hvdWxkIGJlIHByZXNlcnZlZCxcbiAgICBtYXhfcHJlc2VydmVfbmV3bGluZXMgKGRlZmF1bHQgdW5saW1pdGVkKSAtIG1heGltdW0gbnVtYmVyIG9mIGxpbmUgYnJlYWtzIHRvIGJlIHByZXNlcnZlZCBpbiBvbmUgY2h1bmssXG5cbiAgICBqc2xpbnRfaGFwcHkgKGRlZmF1bHQgZmFsc2UpIC0gaWYgdHJ1ZSwgdGhlbiBqc2xpbnQtc3RyaWN0ZXIgbW9kZSBpcyBlbmZvcmNlZC5cblxuICAgICAgICAgICAganNsaW50X2hhcHB5ICAgIWpzbGludF9oYXBweVxuICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgZnVuY3Rpb24gKCkgICAgICBmdW5jdGlvbigpXG5cbiAgICBicmFjZV9zdHlsZSAoZGVmYXVsdCBcImNvbGxhcHNlXCIpIC0gXCJjb2xsYXBzZVwiIHwgXCJleHBhbmRcIiB8IFwiZW5kLWV4cGFuZFwiXG4gICAgICAgICAgICBwdXQgYnJhY2VzIG9uIHRoZSBzYW1lIGxpbmUgYXMgY29udHJvbCBzdGF0ZW1lbnRzIChkZWZhdWx0KSwgb3IgcHV0IGJyYWNlcyBvbiBvd24gbGluZSAoQWxsbWFuIC8gQU5TSSBzdHlsZSksIG9yIGp1c3QgcHV0IGVuZCBicmFjZXMgb24gb3duIGxpbmUuXG5cbiAgICBzcGFjZV9iZWZvcmVfY29uZGl0aW9uYWwgKGRlZmF1bHQgdHJ1ZSkgLSBzaG91bGQgdGhlIHNwYWNlIGJlZm9yZSBjb25kaXRpb25hbCBzdGF0ZW1lbnQgYmUgYWRkZWQsIFwiaWYodHJ1ZSlcIiB2cyBcImlmICh0cnVlKVwiLFxuXG4gICAgdW5lc2NhcGVfc3RyaW5ncyAoZGVmYXVsdCBmYWxzZSkgLSBzaG91bGQgcHJpbnRhYmxlIGNoYXJhY3RlcnMgaW4gc3RyaW5ncyBlbmNvZGVkIGluIFxceE5OIG5vdGF0aW9uIGJlIHVuZXNjYXBlZCwgXCJleGFtcGxlXCIgdnMgXCJcXHg2NVxceDc4XFx4NjFcXHg2ZFxceDcwXFx4NmNcXHg2NVwiXG5cbiAgICB3cmFwX2xpbmVfbGVuZ3RoIChkZWZhdWx0IHVubGltaXRlZCkgLSBsaW5lcyBzaG91bGQgd3JhcCBhdCBuZXh0IG9wcG9ydHVuaXR5IGFmdGVyIHRoaXMgbnVtYmVyIG9mIGNoYXJhY3RlcnMuXG4gICAgICAgICAgTk9URTogVGhpcyBpcyBub3QgYSBoYXJkIGxpbWl0LiBMaW5lcyB3aWxsIGNvbnRpbnVlIHVudGlsIGEgcG9pbnQgd2hlcmUgYSBuZXdsaW5lIHdvdWxkXG4gICAgICAgICAgICAgICAgYmUgcHJlc2VydmVkIGlmIGl0IHdlcmUgcHJlc2VudC5cblxuICAgIGUuZ1xuXG4gICAganNfYmVhdXRpZnkoanNfc291cmNlX3RleHQsIHtcbiAgICAgICdpbmRlbnRfc2l6ZSc6IDEsXG4gICAgICAnaW5kZW50X2NoYXInOiAnXFx0J1xuICAgIH0pO1xuXG4qL1xuXG5cbihmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBqc19iZWF1dGlmeShqc19zb3VyY2VfdGV4dCwgb3B0aW9ucykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdmFyIGJlYXV0aWZpZXIgPSBuZXcgQmVhdXRpZmllcihqc19zb3VyY2VfdGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBiZWF1dGlmaWVyLmJlYXV0aWZ5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQmVhdXRpZmllcihqc19zb3VyY2VfdGV4dCwgb3B0aW9ucykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdmFyIGlucHV0LCBvdXRwdXRfbGluZXM7XG4gICAgICAgIHZhciB0b2tlbl90ZXh0LCB0b2tlbl90eXBlLCBsYXN0X3R5cGUsIGxhc3RfbGFzdF90ZXh0LCBpbmRlbnRfc3RyaW5nO1xuICAgICAgICB2YXIgZmxhZ3MsIHByZXZpb3VzX2ZsYWdzLCBmbGFnX3N0b3JlO1xuICAgICAgICB2YXIgd2hpdGVzcGFjZSwgd29yZGNoYXIsIHB1bmN0LCBwYXJzZXJfcG9zLCBsaW5lX3N0YXJ0ZXJzLCBkaWdpdHM7XG4gICAgICAgIHZhciBwcmVmaXg7XG4gICAgICAgIHZhciBpbnB1dF93YW50ZWRfbmV3bGluZTtcbiAgICAgICAgdmFyIG91dHB1dF93cmFwcGVkLCBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuO1xuICAgICAgICB2YXIgaW5wdXRfbGVuZ3RoLCBuX25ld2xpbmVzLCB3aGl0ZXNwYWNlX2JlZm9yZV90b2tlbjtcbiAgICAgICAgdmFyIGhhbmRsZXJzLCBNT0RFLCBvcHQ7XG4gICAgICAgIHZhciBwcmVpbmRlbnRfc3RyaW5nID0gJyc7XG5cbiAgICAgICAgd2hpdGVzcGFjZSA9IFwiXFxuXFxyXFx0IFwiLnNwbGl0KCcnKTtcbiAgICAgICAgd29yZGNoYXIgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODlfJCcuc3BsaXQoJycpO1xuICAgICAgICBkaWdpdHMgPSAnMDEyMzQ1Njc4OScuc3BsaXQoJycpO1xuXG4gICAgICAgIHB1bmN0ID0gJysgLSAqIC8gJSAmICsrIC0tID0gKz0gLT0gKj0gLz0gJT0gPT0gPT09ICE9ICE9PSA+IDwgPj0gPD0gPj4gPDwgPj4+ID4+Pj0gPj49IDw8PSAmJiAmPSB8IHx8ICEgISEgLCA6ID8gXiBePSB8PSA6Oic7XG4gICAgICAgIHB1bmN0ICs9ICcgPCU9IDwlICU+IDw/PSA8PyA/Pic7IC8vIHRyeSB0byBiZSBhIGdvb2QgYm95IGFuZCB0cnkgbm90IHRvIGJyZWFrIHRoZSBtYXJrdXAgbGFuZ3VhZ2UgaWRlbnRpZmllcnNcbiAgICAgICAgcHVuY3QgPSBwdW5jdC5zcGxpdCgnICcpO1xuXG4gICAgICAgIC8vIHdvcmRzIHdoaWNoIHNob3VsZCBhbHdheXMgc3RhcnQgb24gbmV3IGxpbmUuXG4gICAgICAgIGxpbmVfc3RhcnRlcnMgPSAnY29udGludWUsdHJ5LHRocm93LHJldHVybix2YXIsaWYsc3dpdGNoLGNhc2UsZGVmYXVsdCxmb3Isd2hpbGUsYnJlYWssZnVuY3Rpb24nLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgTU9ERSA9IHtcbiAgICAgICAgICAgIEJsb2NrU3RhdGVtZW50OiAnQmxvY2tTdGF0ZW1lbnQnLCAvLyAnQkxPQ0snXG4gICAgICAgICAgICBTdGF0ZW1lbnQ6ICdTdGF0ZW1lbnQnLCAvLyAnU1RBVEVNRU5UJ1xuICAgICAgICAgICAgT2JqZWN0TGl0ZXJhbDogJ09iamVjdExpdGVyYWwnLCAvLyAnT0JKRUNUJyxcbiAgICAgICAgICAgIEFycmF5TGl0ZXJhbDogJ0FycmF5TGl0ZXJhbCcsIC8vJ1tFWFBSRVNTSU9OXScsXG4gICAgICAgICAgICBGb3JJbml0aWFsaXplcjogJ0ZvckluaXRpYWxpemVyJywgLy8nKEZPUi1FWFBSRVNTSU9OKScsXG4gICAgICAgICAgICBDb25kaXRpb25hbDogJ0NvbmRpdGlvbmFsJywgLy8nKENPTkQtRVhQUkVTU0lPTiknLFxuICAgICAgICAgICAgRXhwcmVzc2lvbjogJ0V4cHJlc3Npb24nIC8vJyhFWFBSRVNTSU9OKSdcbiAgICAgICAgfTtcblxuICAgICAgICBoYW5kbGVycyA9IHtcbiAgICAgICAgICAgICdUS19TVEFSVF9FWFBSJzogaGFuZGxlX3N0YXJ0X2V4cHIsXG4gICAgICAgICAgICAnVEtfRU5EX0VYUFInOiBoYW5kbGVfZW5kX2V4cHIsXG4gICAgICAgICAgICAnVEtfU1RBUlRfQkxPQ0snOiBoYW5kbGVfc3RhcnRfYmxvY2ssXG4gICAgICAgICAgICAnVEtfRU5EX0JMT0NLJzogaGFuZGxlX2VuZF9ibG9jayxcbiAgICAgICAgICAgICdUS19XT1JEJzogaGFuZGxlX3dvcmQsXG4gICAgICAgICAgICAnVEtfU0VNSUNPTE9OJzogaGFuZGxlX3NlbWljb2xvbixcbiAgICAgICAgICAgICdUS19TVFJJTkcnOiBoYW5kbGVfc3RyaW5nLFxuICAgICAgICAgICAgJ1RLX0VRVUFMUyc6IGhhbmRsZV9lcXVhbHMsXG4gICAgICAgICAgICAnVEtfT1BFUkFUT1InOiBoYW5kbGVfb3BlcmF0b3IsXG4gICAgICAgICAgICAnVEtfQ09NTUEnOiBoYW5kbGVfY29tbWEsXG4gICAgICAgICAgICAnVEtfQkxPQ0tfQ09NTUVOVCc6IGhhbmRsZV9ibG9ja19jb21tZW50LFxuICAgICAgICAgICAgJ1RLX0lOTElORV9DT01NRU5UJzogaGFuZGxlX2lubGluZV9jb21tZW50LFxuICAgICAgICAgICAgJ1RLX0NPTU1FTlQnOiBoYW5kbGVfY29tbWVudCxcbiAgICAgICAgICAgICdUS19ET1QnOiBoYW5kbGVfZG90LFxuICAgICAgICAgICAgJ1RLX1VOS05PV04nOiBoYW5kbGVfdW5rbm93blxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZV9mbGFncyhmbGFnc19iYXNlLCBtb2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dF9pbmRlbnRfbGV2ZWwgPSAwO1xuICAgICAgICAgICAgaWYgKGZsYWdzX2Jhc2UpIHtcbiAgICAgICAgICAgICAgICBuZXh0X2luZGVudF9sZXZlbCA9IGZsYWdzX2Jhc2UuaW5kZW50YXRpb25fbGV2ZWw7XG4gICAgICAgICAgICAgICAgbmV4dF9pbmRlbnRfbGV2ZWwgKz0gKGZsYWdzX2Jhc2UudmFyX2xpbmUgJiYgZmxhZ3NfYmFzZS52YXJfbGluZV9yZWluZGVudGVkKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIGlmICghanVzdF9hZGRlZF9uZXdsaW5lKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3NfYmFzZS5saW5lX2luZGVudF9sZXZlbCA+IG5leHRfaW5kZW50X2xldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRfaW5kZW50X2xldmVsID0gZmxhZ3NfYmFzZS5saW5lX2luZGVudF9sZXZlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuZXh0X2ZsYWdzID0ge1xuICAgICAgICAgICAgICAgIG1vZGU6IG1vZGUsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBmbGFnc19iYXNlLFxuICAgICAgICAgICAgICAgIGxhc3RfdGV4dDogZmxhZ3NfYmFzZSA/IGZsYWdzX2Jhc2UubGFzdF90ZXh0IDogJycsIC8vIGxhc3QgdG9rZW4gdGV4dFxuICAgICAgICAgICAgICAgIGxhc3Rfd29yZDogZmxhZ3NfYmFzZSA/IGZsYWdzX2Jhc2UubGFzdF93b3JkIDogJycsIC8vIGxhc3QgJ1RLX1dPUkQnIHBhc3NlZFxuICAgICAgICAgICAgICAgIHZhcl9saW5lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YXJfbGluZV90YWludGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YXJfbGluZV9yZWluZGVudGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbl9odG1sX2NvbW1lbnQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG11bHRpbGluZV9mcmFtZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaWZfYmxvY2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvX2Jsb2NrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb193aGlsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5fY2FzZV9zdGF0ZW1lbnQ6IGZhbHNlLCAvLyBzd2l0Y2goLi4peyBJTlNJREUgSEVSRSB9XG4gICAgICAgICAgICAgICAgaW5fY2FzZTogZmFsc2UsIC8vIHdlJ3JlIG9uIHRoZSBleGFjdCBsaW5lIHdpdGggXCJjYXNlIDA6XCJcbiAgICAgICAgICAgICAgICBjYXNlX2JvZHk6IGZhbHNlLCAvLyB0aGUgaW5kZW50ZWQgY2FzZS1hY3Rpb24gYmxvY2tcbiAgICAgICAgICAgICAgICBpbmRlbnRhdGlvbl9sZXZlbDogbmV4dF9pbmRlbnRfbGV2ZWwsXG4gICAgICAgICAgICAgICAgbGluZV9pbmRlbnRfbGV2ZWw6IGZsYWdzX2Jhc2UgPyBmbGFnc19iYXNlLmxpbmVfaW5kZW50X2xldmVsIDogbmV4dF9pbmRlbnRfbGV2ZWwsXG4gICAgICAgICAgICAgICAgc3RhcnRfbGluZV9pbmRleDogb3V0cHV0X2xpbmVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBoYWRfY29tbWVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGVybmFyeV9kZXB0aDogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRfZmxhZ3M7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2luZyBvYmplY3QgaW5zdGVhZCBvZiBzdHJpbmcgdG8gYWxsb3cgZm9yIGxhdGVyIGV4cGFuc2lvbiBvZiBpbmZvIGFib3V0IGVhY2ggbGluZVxuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZV9vdXRwdXRfbGluZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGV4dDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb21lIGludGVycHJldGVycyBoYXZlIHVuZXhwZWN0ZWQgcmVzdWx0cyB3aXRoIGZvbyA9IGJheiB8fCBiYXI7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gb3B0aW9ucyA6IHt9O1xuICAgICAgICBvcHQgPSB7fTtcblxuICAgICAgICAvLyBjb21wYXRpYmlsaXR5XG4gICAgICAgIGlmIChvcHRpb25zLnNwYWNlX2FmdGVyX2Fub25fZnVuY3Rpb24gIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmpzbGludF9oYXBweSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zLmpzbGludF9oYXBweSA9IG9wdGlvbnMuc3BhY2VfYWZ0ZXJfYW5vbl9mdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5icmFjZXNfb25fb3duX2xpbmUgIT09IHVuZGVmaW5lZCkgeyAvL2dyYWNlZnVsIGhhbmRsaW5nIG9mIGRlcHJlY2F0ZWQgb3B0aW9uXG4gICAgICAgICAgICBvcHQuYnJhY2Vfc3R5bGUgPSBvcHRpb25zLmJyYWNlc19vbl9vd25fbGluZSA/IFwiZXhwYW5kXCIgOiBcImNvbGxhcHNlXCI7XG4gICAgICAgIH1cbiAgICAgICAgb3B0LmJyYWNlX3N0eWxlID0gb3B0aW9ucy5icmFjZV9zdHlsZSA/IG9wdGlvbnMuYnJhY2Vfc3R5bGUgOiAob3B0LmJyYWNlX3N0eWxlID8gb3B0LmJyYWNlX3N0eWxlIDogXCJjb2xsYXBzZVwiKTtcblxuICAgICAgICAvLyBncmFjZWZ1bCBoYW5kbGluZyBvZiBkZXByZWNhdGVkIG9wdGlvblxuICAgICAgICBpZiAob3B0LmJyYWNlX3N0eWxlID09PSBcImV4cGFuZC1zdHJpY3RcIikge1xuICAgICAgICAgICAgb3B0LmJyYWNlX3N0eWxlID0gXCJleHBhbmRcIjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgb3B0LmluZGVudF9zaXplID0gb3B0aW9ucy5pbmRlbnRfc2l6ZSA/IHBhcnNlSW50KG9wdGlvbnMuaW5kZW50X3NpemUsIDEwKSA6IDQ7XG4gICAgICAgIG9wdC5pbmRlbnRfY2hhciA9IG9wdGlvbnMuaW5kZW50X2NoYXIgPyBvcHRpb25zLmluZGVudF9jaGFyIDogJyAnO1xuICAgICAgICBvcHQucHJlc2VydmVfbmV3bGluZXMgPSAob3B0aW9ucy5wcmVzZXJ2ZV9uZXdsaW5lcyA9PT0gdW5kZWZpbmVkKSA/IHRydWUgOiBvcHRpb25zLnByZXNlcnZlX25ld2xpbmVzO1xuICAgICAgICBvcHQuYnJlYWtfY2hhaW5lZF9tZXRob2RzID0gKG9wdGlvbnMuYnJlYWtfY2hhaW5lZF9tZXRob2RzID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBvcHRpb25zLmJyZWFrX2NoYWluZWRfbWV0aG9kcztcbiAgICAgICAgb3B0Lm1heF9wcmVzZXJ2ZV9uZXdsaW5lcyA9IChvcHRpb25zLm1heF9wcmVzZXJ2ZV9uZXdsaW5lcyA9PT0gdW5kZWZpbmVkKSA/IDAgOiBwYXJzZUludChvcHRpb25zLm1heF9wcmVzZXJ2ZV9uZXdsaW5lcywgMTApO1xuICAgICAgICBvcHQuc3BhY2VfaW5fcGFyZW4gPSAob3B0aW9ucy5zcGFjZV9pbl9wYXJlbiA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogb3B0aW9ucy5zcGFjZV9pbl9wYXJlbjtcbiAgICAgICAgb3B0LmpzbGludF9oYXBweSA9IChvcHRpb25zLmpzbGludF9oYXBweSA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogb3B0aW9ucy5qc2xpbnRfaGFwcHk7XG4gICAgICAgIG9wdC5rZWVwX2FycmF5X2luZGVudGF0aW9uID0gKG9wdGlvbnMua2VlcF9hcnJheV9pbmRlbnRhdGlvbiA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogb3B0aW9ucy5rZWVwX2FycmF5X2luZGVudGF0aW9uO1xuICAgICAgICBvcHQuc3BhY2VfYmVmb3JlX2NvbmRpdGlvbmFsID0gKG9wdGlvbnMuc3BhY2VfYmVmb3JlX2NvbmRpdGlvbmFsID09PSB1bmRlZmluZWQpID8gdHJ1ZSA6IG9wdGlvbnMuc3BhY2VfYmVmb3JlX2NvbmRpdGlvbmFsO1xuICAgICAgICBvcHQudW5lc2NhcGVfc3RyaW5ncyA9IChvcHRpb25zLnVuZXNjYXBlX3N0cmluZ3MgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG9wdGlvbnMudW5lc2NhcGVfc3RyaW5ncztcbiAgICAgICAgb3B0LndyYXBfbGluZV9sZW5ndGggPSAob3B0aW9ucy53cmFwX2xpbmVfbGVuZ3RoID09PSB1bmRlZmluZWQpID8gMCA6IHBhcnNlSW50KG9wdGlvbnMud3JhcF9saW5lX2xlbmd0aCwgMTApO1xuICAgICAgICBvcHQuZTR4ID0gKG9wdGlvbnMuZTR4ID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBvcHRpb25zLmU0eDtcblxuICAgICAgICBpZihvcHRpb25zLmluZGVudF93aXRoX3RhYnMpe1xuICAgICAgICAgICAgb3B0LmluZGVudF9jaGFyID0gJ1xcdCc7XG4gICAgICAgICAgICBvcHQuaW5kZW50X3NpemUgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGluZGVudF9zdHJpbmcgPSAnJztcbiAgICAgICAgd2hpbGUgKG9wdC5pbmRlbnRfc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGluZGVudF9zdHJpbmcgKz0gb3B0LmluZGVudF9jaGFyO1xuICAgICAgICAgICAgb3B0LmluZGVudF9zaXplIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoanNfc291cmNlX3RleHQgJiYgKGpzX3NvdXJjZV90ZXh0LmNoYXJBdCgwKSA9PT0gJyAnIHx8IGpzX3NvdXJjZV90ZXh0LmNoYXJBdCgwKSA9PT0gJ1xcdCcpKSB7XG4gICAgICAgICAgICBwcmVpbmRlbnRfc3RyaW5nICs9IGpzX3NvdXJjZV90ZXh0LmNoYXJBdCgwKTtcbiAgICAgICAgICAgIGpzX3NvdXJjZV90ZXh0ID0ganNfc291cmNlX3RleHQuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0ID0ganNfc291cmNlX3RleHQ7XG4gICAgICAgIC8vIGNhY2hlIHRoZSBzb3VyY2UncyBsZW5ndGguXG4gICAgICAgIGlucHV0X2xlbmd0aCA9IGpzX3NvdXJjZV90ZXh0Lmxlbmd0aDtcblxuICAgICAgICBsYXN0X3R5cGUgPSAnVEtfU1RBUlRfQkxPQ0snOyAvLyBsYXN0IHRva2VuIHR5cGVcbiAgICAgICAgbGFzdF9sYXN0X3RleHQgPSAnJzsgLy8gcHJlLWxhc3QgdG9rZW4gdGV4dFxuICAgICAgICBvdXRwdXRfbGluZXMgPSBbY3JlYXRlX291dHB1dF9saW5lKCldO1xuICAgICAgICBvdXRwdXRfd3JhcHBlZCA9IGZhbHNlO1xuICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gZmFsc2U7XG4gICAgICAgIHdoaXRlc3BhY2VfYmVmb3JlX3Rva2VuID0gW107XG5cbiAgICAgICAgLy8gU3RhY2sgb2YgcGFyc2luZy9mb3JtYXR0aW5nIHN0YXRlcywgaW5jbHVkaW5nIE1PREUuXG4gICAgICAgIC8vIFdlIHRva2VuaXplLCBwYXJzZSwgYW5kIG91dHB1dCBpbiBhbiBhbG1vc3QgcHVyZWx5IGEgZm9yd2FyZC1vbmx5IHN0cmVhbSBvZiB0b2tlbiBpbnB1dFxuICAgICAgICAvLyBhbmQgZm9ybWF0dGVkIG91dHB1dC4gIFRoaXMgbWFrZXMgdGhlIGJlYXV0aWZpZXIgbGVzcyBhY2N1cmF0ZSB0aGFuIGZ1bGwgcGFyc2Vyc1xuICAgICAgICAvLyBidXQgYWxzbyBmYXIgbW9yZSB0b2xlcmFudCBvZiBzeW50YXggZXJyb3JzLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGb3IgZXhhbXBsZSwgdGhlIGRlZmF1bHQgbW9kZSBpcyBNT0RFLkJsb2NrU3RhdGVtZW50LiBJZiB3ZSBzZWUgYSAneycgd2UgcHVzaCBhIG5ldyBmcmFtZSBvZiB0eXBlXG4gICAgICAgIC8vIE1PREUuQmxvY2tTdGF0ZW1lbnQgb24gdGhlIHRoZSBzdGFjaywgZXZlbiB0aG91Z2ggaXQgY291bGQgYmUgb2JqZWN0IGxpdGVyYWwuICBJZiB3ZSBsYXRlclxuICAgICAgICAvLyBlbmNvdW50ZXIgYSBcIjpcIiwgd2UnbGwgc3dpdGNoIHRvIHRvIE1PREUuT2JqZWN0TGl0ZXJhbC4gIElmIHdlIHRoZW4gc2VlIGEgXCI7XCIsXG4gICAgICAgIC8vIG1vc3QgZnVsbCBwYXJzZXJzIHdvdWxkIGRpZSwgYnV0IHRoZSBiZWF1dGlmaWVyIGdyYWNlZnVsbHkgZmFsbHMgYmFjayB0b1xuICAgICAgICAvLyBNT0RFLkJsb2NrU3RhdGVtZW50IGFuZCBjb250aW51ZXMgb24uXG4gICAgICAgIGZsYWdfc3RvcmUgPSBbXTtcbiAgICAgICAgc2V0X21vZGUoTU9ERS5CbG9ja1N0YXRlbWVudCk7XG5cbiAgICAgICAgcGFyc2VyX3BvcyA9IDA7XG5cbiAgICAgICAgdGhpcy5iZWF1dGlmeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLypqc2hpbnQgb25ldmFyOnRydWUgKi9cbiAgICAgICAgICAgIHZhciB0LCBpLCBrZWVwX3doaXRlc3BhY2UsIHN3ZWV0X2NvZGU7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdCA9IGdldF9uZXh0X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgdG9rZW5fdGV4dCA9IHRbMF07XG4gICAgICAgICAgICAgICAgdG9rZW5fdHlwZSA9IHRbMV07XG5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5fdHlwZSA9PT0gJ1RLX0VPRicpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAga2VlcF93aGl0ZXNwYWNlID0gb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24gJiYgaXNfYXJyYXkoZmxhZ3MubW9kZSk7XG4gICAgICAgICAgICAgICAgaW5wdXRfd2FudGVkX25ld2xpbmUgPSBuX25ld2xpbmVzID4gMDtcblxuICAgICAgICAgICAgICAgIGlmIChrZWVwX3doaXRlc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG5fbmV3bGluZXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZShpID4gMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0Lm1heF9wcmVzZXJ2ZV9uZXdsaW5lcyAmJiBuX25ld2xpbmVzID4gb3B0Lm1heF9wcmVzZXJ2ZV9uZXdsaW5lcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbl9uZXdsaW5lcyA9IG9wdC5tYXhfcHJlc2VydmVfbmV3bGluZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnByZXNlcnZlX25ld2xpbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobl9uZXdsaW5lcyA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IG5fbmV3bGluZXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhhbmRsZXJzW3Rva2VuX3R5cGVdKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY2xlYW5lc3QgaGFuZGxpbmcgb2YgaW5saW5lIGNvbW1lbnRzIGlzIHRvIHRyZWF0IHRoZW0gYXMgdGhvdWdoIHRoZXkgYXJlbid0IHRoZXJlLlxuICAgICAgICAgICAgICAgIC8vIEp1c3QgY29udGludWUgZm9ybWF0dGluZyBhbmQgdGhlIGJlaGF2aW9yIHNob3VsZCBiZSBsb2dpY2FsLlxuICAgICAgICAgICAgICAgIC8vIEFsc28gaWdub3JlIHVua25vd24gdG9rZW5zLiAgQWdhaW4sIHRoaXMgc2hvdWxkIHJlc3VsdCBpbiBiZXR0ZXIgYmVoYXZpb3IuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3R5cGUgIT09ICdUS19JTkxJTkVfQ09NTUVOVCcgJiYgdG9rZW5fdHlwZSAhPT0gJ1RLX0NPTU1FTlQnICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuX3R5cGUgIT09ICdUS19CTE9DS19DT01NRU5UJyAmJiB0b2tlbl90eXBlICE9PSAnVEtfVU5LTk9XTicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9sYXN0X3RleHQgPSBmbGFncy5sYXN0X3RleHQ7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RfdHlwZSA9IHRva2VuX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmxhc3RfdGV4dCA9IHRva2VuX3RleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsYWdzLmhhZF9jb21tZW50ID0gKHRva2VuX3R5cGUgPT09ICdUS19JTkxJTkVfQ09NTUVOVCcgfHwgdG9rZW5fdHlwZSA9PT0gJ1RLX0NPTU1FTlQnXG4gICAgICAgICAgICAgICAgICAgIHx8IHRva2VuX3R5cGUgPT09ICdUS19CTE9DS19DT01NRU5UJyk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgc3dlZXRfY29kZSA9IG91dHB1dF9saW5lc1swXS50ZXh0LmpvaW4oJycpO1xuICAgICAgICAgICAgZm9yICh2YXIgbGluZV9pbmRleCA9IDE7IGxpbmVfaW5kZXggPCBvdXRwdXRfbGluZXMubGVuZ3RoOyBsaW5lX2luZGV4KyspIHtcbiAgICAgICAgICAgICAgICBzd2VldF9jb2RlICs9ICdcXG4nICsgb3V0cHV0X2xpbmVzW2xpbmVfaW5kZXhdLnRleHQuam9pbignJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2VldF9jb2RlID0gc3dlZXRfY29kZS5yZXBsYWNlKC9bXFxyXFxuIF0rJC8sICcnKTtcbiAgICAgICAgICAgIHJldHVybiBzd2VldF9jb2RlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHRyaW1fb3V0cHV0KGVhdF9uZXdsaW5lcykge1xuICAgICAgICAgICAgZWF0X25ld2xpbmVzID0gKGVhdF9uZXdsaW5lcyA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogZWF0X25ld2xpbmVzO1xuXG4gICAgICAgICAgICBpZiAob3V0cHV0X2xpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRyaW1fb3V0cHV0X2xpbmUob3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXSwgZWF0X25ld2xpbmVzKTtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChlYXRfbmV3bGluZXMgJiYgb3V0cHV0X2xpbmVzLmxlbmd0aCA+IDEgJiZcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXS50ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfbGluZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRyaW1fb3V0cHV0X2xpbmUob3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXSwgZWF0X25ld2xpbmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0cmltX291dHB1dF9saW5lKGxpbmUpIHtcbiAgICAgICAgICAgIHdoaWxlIChsaW5lLnRleHQubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgKGxpbmUudGV4dFtsaW5lLnRleHQubGVuZ3RoIC0gMV0gPT09ICcgJyB8fFxuICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHRbbGluZS50ZXh0Lmxlbmd0aCAtIDFdID09PSBpbmRlbnRfc3RyaW5nIHx8XG4gICAgICAgICAgICAgICAgICAgIGxpbmUudGV4dFtsaW5lLnRleHQubGVuZ3RoIC0gMV0gPT09IHByZWluZGVudF9zdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgbGluZS50ZXh0LnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBjb3VsZCB1c2UganVzdCBzdHJpbmcuc3BsaXQsIGJ1dFxuICAgICAgICAvLyBJRSBkb2Vzbid0IGxpa2UgcmV0dXJuaW5nIGVtcHR5IHN0cmluZ3NcblxuICAgICAgICBmdW5jdGlvbiBzcGxpdF9uZXdsaW5lcyhzKSB7XG4gICAgICAgICAgICAvL3JldHVybiBzLnNwbGl0KC9cXHgwZFxceDBhfFxceDBhLyk7XG5cbiAgICAgICAgICAgIHMgPSBzLnJlcGxhY2UoL1xceDBkL2csICcnKTtcbiAgICAgICAgICAgIHZhciBvdXQgPSBbXSxcbiAgICAgICAgICAgICAgICBpZHggPSBzLmluZGV4T2YoXCJcXG5cIik7XG4gICAgICAgICAgICB3aGlsZSAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKHMuc3Vic3RyaW5nKDAsIGlkeCkpO1xuICAgICAgICAgICAgICAgIHMgPSBzLnN1YnN0cmluZyhpZHggKyAxKTtcbiAgICAgICAgICAgICAgICBpZHggPSBzLmluZGV4T2YoXCJcXG5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBvdXQucHVzaChzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBqdXN0X2FkZGVkX25ld2xpbmUoKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICByZXR1cm4gbGluZS50ZXh0Lmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGp1c3RfYWRkZWRfYmxhbmtsaW5lKCkge1xuICAgICAgICAgICAgaWYgKGp1c3RfYWRkZWRfbmV3bGluZSgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dF9saW5lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIHN0YXJ0IG9mIHRoZSBmaWxlIGFuZCBuZXdsaW5lID0gYmxhbmtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmUudGV4dC5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKGZvcmNlX2xpbmV3cmFwKSB7XG4gICAgICAgICAgICBmb3JjZV9saW5ld3JhcCA9IChmb3JjZV9saW5ld3JhcCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogZm9yY2VfbGluZXdyYXA7XG4gICAgICAgICAgICBpZiAob3B0LndyYXBfbGluZV9sZW5ndGggJiYgIWZvcmNlX2xpbmV3cmFwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wb3NlZF9saW5lX2xlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgLy8gbmV2ZXIgd3JhcCB0aGUgZmlyc3QgdG9rZW4gb2YgYSBsaW5lLlxuICAgICAgICAgICAgICAgIGlmIChsaW5lLnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wb3NlZF9saW5lX2xlbmd0aCA9IGxpbmUudGV4dC5qb2luKCcnKS5sZW5ndGggKyB0b2tlbl90ZXh0Lmxlbmd0aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAob3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA/IDEgOiAwKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3Bvc2VkX2xpbmVfbGVuZ3RoID49IG9wdC53cmFwX2xpbmVfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JjZV9saW5ld3JhcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKChvcHQucHJlc2VydmVfbmV3bGluZXMgJiYgaW5wdXRfd2FudGVkX25ld2xpbmUpIHx8IGZvcmNlX2xpbmV3cmFwKSAmJiAhanVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKGZhbHNlLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vIEV4cHJlc3Npb25zIGFuZCBhcnJheSBsaXRlcmFscyBhbHJlYWR5IGluZGVudCB0aGVpciBjb250ZW50cy5cbiAgICAgICAgICAgICAgICBpZiAoIShpc19hcnJheShmbGFncy5tb2RlKSB8fCBpc19leHByZXNzaW9uKGZsYWdzLm1vZGUpKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfd3JhcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJpbnRfbmV3bGluZShmb3JjZV9uZXdsaW5lLCBwcmVzZXJ2ZV9zdGF0ZW1lbnRfZmxhZ3MpIHtcbiAgICAgICAgICAgIG91dHB1dF93cmFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICghcHJlc2VydmVfc3RhdGVtZW50X2ZsYWdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLmxhc3RfdGV4dCAhPT0gJzsnKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChmbGFncy5tb2RlID09PSBNT0RFLlN0YXRlbWVudCAmJiAhZmxhZ3MuaWZfYmxvY2sgJiYgIWZsYWdzLmRvX2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0b3JlX21vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG91dHB1dF9saW5lcy5sZW5ndGggPT09IDEgJiYganVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIG5vIG5ld2xpbmUgb24gc3RhcnQgb2YgZmlsZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm9yY2VfbmV3bGluZSB8fCAhanVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICBmbGFncy5tdWx0aWxpbmVfZnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG91dHB1dF9saW5lcy5wdXNoKGNyZWF0ZV9vdXRwdXRfbGluZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByaW50X3Rva2VuX2xpbmVfaW5kZW50YXRpb24oKSB7XG4gICAgICAgICAgICBpZiAoanVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5rZWVwX2FycmF5X2luZGVudGF0aW9uICYmIGlzX2FycmF5KGZsYWdzLm1vZGUpICYmIGlucHV0X3dhbnRlZF9uZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgcmVtb3Zpbmcgb2YgdGhpcyB3aGl0ZXNwYWNlIGFzIHJlZHVuZGFudFxuICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHQucHVzaCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUudGV4dC5wdXNoKHdoaXRlc3BhY2VfYmVmb3JlX3Rva2VuW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVpbmRlbnRfc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHQucHVzaChwcmVpbmRlbnRfc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByaW50X2luZGVudF9zdHJpbmcoZmxhZ3MuaW5kZW50YXRpb25fbGV2ZWwgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGZsYWdzLnZhcl9saW5lICYmIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPyAxIDogMCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKG91dHB1dF93cmFwcGVkID8gMSA6IDApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludF9pbmRlbnRfc3RyaW5nKGxldmVsKSB7XG4gICAgICAgICAgICAvLyBOZXZlciBpbmRlbnQgeW91ciBmaXJzdCBvdXRwdXQgaW5kZW50IGF0IHRoZSBzdGFydCBvZiB0aGUgZmlsZVxuICAgICAgICAgICAgaWYgKG91dHB1dF9saW5lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgICAgICAgZmxhZ3MubGluZV9pbmRlbnRfbGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxldmVsOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZS50ZXh0LnB1c2goaW5kZW50X3N0cmluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJpbnRfdG9rZW5fc3BhY2VfYmVmb3JlKCkge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gJiYgbGluZS50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBsYXN0X291dHB1dCA9IGxpbmUudGV4dFtsaW5lLnRleHQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGxhc3Rfb3V0cHV0ICE9PSAnICcgJiYgbGFzdF9vdXRwdXQgIT09IGluZGVudF9zdHJpbmcpIHsgLy8gcHJldmVudCBvY2Nhc3Npb25hbCBkdXBsaWNhdGUgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgbGluZS50ZXh0LnB1c2goJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludF90b2tlbihwcmludGFibGVfdG9rZW4pIHtcbiAgICAgICAgICAgIHByaW50YWJsZV90b2tlbiA9IHByaW50YWJsZV90b2tlbiB8fCB0b2tlbl90ZXh0O1xuICAgICAgICAgICAgcHJpbnRfdG9rZW5fbGluZV9pbmRlbnRhdGlvbigpO1xuICAgICAgICAgICAgb3V0cHV0X3dyYXBwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHByaW50X3Rva2VuX3NwYWNlX2JlZm9yZSgpO1xuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IGZhbHNlO1xuICAgICAgICAgICAgb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXS50ZXh0LnB1c2gocHJpbnRhYmxlX3Rva2VuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluZGVudCgpIHtcbiAgICAgICAgICAgIGZsYWdzLmluZGVudGF0aW9uX2xldmVsICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWluZGVudCgpIHtcbiAgICAgICAgICAgIGlmIChmbGFncy5pbmRlbnRhdGlvbl9sZXZlbCA+IDAgJiZcbiAgICAgICAgICAgICAgICAoKCFmbGFncy5wYXJlbnQpIHx8IGZsYWdzLmluZGVudGF0aW9uX2xldmVsID4gZmxhZ3MucGFyZW50LmluZGVudGF0aW9uX2xldmVsKSlcbiAgICAgICAgICAgICAgICBmbGFncy5pbmRlbnRhdGlvbl9sZXZlbCAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlX3JlZHVuZGFudF9pbmRlbnRhdGlvbihmcmFtZSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBlZmZlY3RpdmUgYnV0IGhhcyBzb21lIGlzc3VlczpcbiAgICAgICAgICAgIC8vICAgICAtIGxlc3MgdGhhbiBncmVhdCBwZXJmb3JtYW5jZSBkdWUgdG8gYXJyYXkgc3BsaWNpbmdcbiAgICAgICAgICAgIC8vICAgICAtIGNhbiBjYXVzZSBsaW5lIHdyYXAgdG8gaGFwcGVuIHRvbyBzb29uIGR1ZSB0byBpbmRlbnQgcmVtb3ZhbFxuICAgICAgICAgICAgLy8gICAgICAgICAgIGFmdGVyIHdyYXAgcG9pbnRzIGFyZSBjYWxjdWxhdGVkXG4gICAgICAgICAgICAvLyBUaGVzZSBpc3N1ZXMgYXJlIG1pbm9yIGNvbXBhcmVkIHRvIHVnbHkgaW5kZW50YXRpb24uXG5cbiAgICAgICAgICAgIGlmIChmcmFtZS5tdWx0aWxpbmVfZnJhbWUpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIG9uZSBpbmRlbnQgZnJvbSBlYWNoIGxpbmUgaW5zaWRlIHRoaXMgc2VjdGlvblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gZnJhbWUuc3RhcnRfbGluZV9pbmRleDtcbiAgICAgICAgICAgIHZhciBzcGxpY2VfaW5kZXggPSAwO1xuICAgICAgICAgICAgdmFyIGxpbmU7XG5cbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IG91dHB1dF9saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaW5lID0gb3V0cHV0X2xpbmVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLnRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNraXAgdGhlIHByZWluZGVudCBzdHJpbmcgaWYgcHJlc2VudFxuICAgICAgICAgICAgICAgIGlmIChwcmVpbmRlbnRfc3RyaW5nICYmIGxpbmUudGV4dFswXSA9PT0gcHJlaW5kZW50X3N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBzcGxpY2VfaW5kZXggPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZV9pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIG9uZSBpbmRlbnQsIGlmIHByZXNlbnRcbiAgICAgICAgICAgICAgICBpZiAobGluZS50ZXh0W3NwbGljZV9pbmRleF0gPT09IGluZGVudF9zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZS50ZXh0LnNwbGljZShzcGxpY2VfaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldF9tb2RlKG1vZGUpIHtcbiAgICAgICAgICAgIGlmIChmbGFncykge1xuICAgICAgICAgICAgICAgIGZsYWdfc3RvcmUucHVzaChmbGFncyk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNfZmxhZ3MgPSBmbGFncztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNfZmxhZ3MgPSBjcmVhdGVfZmxhZ3MobnVsbCwgbW9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsYWdzID0gY3JlYXRlX2ZsYWdzKHByZXZpb3VzX2ZsYWdzLCBtb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzX2FycmF5KG1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlID09PSBNT0RFLkFycmF5TGl0ZXJhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzX2V4cHJlc3Npb24obW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGluX2FycmF5KG1vZGUsIFtNT0RFLkV4cHJlc3Npb24sIE1PREUuRm9ySW5pdGlhbGl6ZXIsIE1PREUuQ29uZGl0aW9uYWxdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3RvcmVfbW9kZSgpIHtcbiAgICAgICAgICAgIGlmIChmbGFnX3N0b3JlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c19mbGFncyA9IGZsYWdzO1xuICAgICAgICAgICAgICAgIGZsYWdzID0gZmxhZ19zdG9yZS5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0X29mX29iamVjdF9wcm9wZXJ0eSgpIHtcbiAgICAgICAgICAgIHJldHVybiBmbGFncy5tb2RlID09PSBNT0RFLk9iamVjdExpdGVyYWwgJiYgZmxhZ3MubGFzdF90ZXh0ID09PSAnOicgJiZcbiAgICAgICAgICAgICAgICBmbGFncy50ZXJuYXJ5X2RlcHRoID09PSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRfb2Zfc3RhdGVtZW50KCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChmbGFncy5sYXN0X3RleHQgPT09ICdkbycgfHxcbiAgICAgICAgICAgICAgICAgICAgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJ2Vsc2UnICYmIHRva2VuX3RleHQgIT09ICdpZicpIHx8XG4gICAgICAgICAgICAgICAgICAgIChsYXN0X3R5cGUgPT09ICdUS19FTkRfRVhQUicgJiYgKHByZXZpb3VzX2ZsYWdzLm1vZGUgPT09IE1PREUuRm9ySW5pdGlhbGl6ZXIgfHwgcHJldmlvdXNfZmxhZ3MubW9kZSA9PT0gTU9ERS5Db25kaXRpb25hbCkpKSkge1xuICAgICAgICAgICAgICAgIC8vIElzc3VlICMyNzY6XG4gICAgICAgICAgICAgICAgLy8gSWYgc3RhcnRpbmcgYSBuZXcgc3RhdGVtZW50IHdpdGggW2lmLCBmb3IsIHdoaWxlLCBkb10sIHB1c2ggdG8gYSBuZXcgbGluZS5cbiAgICAgICAgICAgICAgICAvLyBpZiAoYSkgaWYgKGIpIGlmKGMpIGQoKTsgZWxzZSBlKCk7IGVsc2UgZigpO1xuICAgICAgICAgICAgICAgIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoXG4gICAgICAgICAgICAgICAgICAgIGluX2FycmF5KHRva2VuX3RleHQsIFsnZG8nLCAnZm9yJywgJ2lmJywgJ3doaWxlJ10pKTtcblxuICAgICAgICAgICAgICAgIHNldF9tb2RlKE1PREUuU3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICAvLyBJc3N1ZSAjMjc1OlxuICAgICAgICAgICAgICAgIC8vIElmIHN0YXJ0aW5nIG9uIGEgbmV3bGluZSwgYWxsIG9mIGEgc3RhdGVtZW50IHNob3VsZCBiZSBpbmRlbnRlZC5cbiAgICAgICAgICAgICAgICAvLyBpZiBub3QsIHVzZSBsaW5lIHdyYXBwaW5nIGxvZ2ljIGZvciBpbmRlbnQuXG4gICAgICAgICAgICAgICAgaWYgKGp1c3RfYWRkZWRfbmV3bGluZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfd3JhcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFsbF9saW5lc19zdGFydF93aXRoKGxpbmVzLCBjKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpbmUgPSB0cmltKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5jaGFyQXQoMCkgIT09IGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNfc3BlY2lhbF93b3JkKHdvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbl9hcnJheSh3b3JkLCBbJ2Nhc2UnLCAncmV0dXJuJywgJ2RvJywgJ2lmJywgJ3Rocm93JywgJ2Vsc2UnXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbl9hcnJheSh3aGF0LCBhcnIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycltpXSA9PT0gd2hhdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1bmVzY2FwZV9zdHJpbmcocykge1xuICAgICAgICAgICAgdmFyIGVzYyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG91dCA9ICcnLFxuICAgICAgICAgICAgICAgIHBvcyA9IDAsXG4gICAgICAgICAgICAgICAgc19oZXggPSAnJyxcbiAgICAgICAgICAgICAgICBlc2NhcGVkID0gMCxcbiAgICAgICAgICAgICAgICBjO1xuXG4gICAgICAgICAgICB3aGlsZSAoZXNjIHx8IHBvcyA8IHMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgICAgICBjID0gcy5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgICAgICBwb3MrKztcblxuICAgICAgICAgICAgICAgIGlmIChlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgZXNjID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjID09PSAneCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbXBsZSBoZXgtZXNjYXBlIFxceDI0XG4gICAgICAgICAgICAgICAgICAgICAgICBzX2hleCA9IHMuc3Vic3RyKHBvcywgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAndScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVuaWNvZGUtZXNjYXBlLCBcXHUyMTM0XG4gICAgICAgICAgICAgICAgICAgICAgICBzX2hleCA9IHMuc3Vic3RyKHBvcywgNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgKz0gNDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWUgY29tbW9uIGVzY2FwZSwgZS5nIFxcblxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXFxcJyArIGM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNfaGV4Lm1hdGNoKC9eWzAxMjM0NTY3ODlhYmNkZWZBQkNERUZdKyQvKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZSB3ZWlyZCBlc2NhcGluZywgYmFpbCBvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWF2aW5nIHdob2xlIHN0cmluZyBpbnRhY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlZCA9IHBhcnNlSW50KHNfaGV4LCAxNik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVzY2FwZWQgPj0gMHgwMCAmJiBlc2NhcGVkIDwgMHgyMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhdmUgMHgwMC4uLjB4MWYgZXNjYXBlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnXFxcXHgnICsgc19oZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnXFxcXHUnICsgc19oZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlc2NhcGVkID09PSAweDIyIHx8IGVzY2FwZWQgPT09IDB4MjcgfHwgZXNjYXBlZCA9PT0gMHg1Yykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luZ2xlLXF1b3RlLCBhcG9zdHJvcGhlLCBiYWNrc2xhc2ggLSBlc2NhcGUgdGhlc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnXFxcXCcgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGVzY2FwZWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd4JyAmJiBlc2NhcGVkID4gMHg3ZSAmJiBlc2NhcGVkIDw9IDB4ZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGJhaWwgb3V0IG9uIFxceDdmLi5cXHhmZixcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYXZpbmcgd2hvbGUgc3RyaW5nIGVzY2FwZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcyBpdCdzIHByb2JhYmx5IGNvbXBsZXRlbHkgYmluYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGVzY2FwZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZXNjID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNfbmV4dChmaW5kKSB7XG4gICAgICAgICAgICB2YXIgbG9jYWxfcG9zID0gcGFyc2VyX3BvcztcbiAgICAgICAgICAgIHZhciBjID0gaW5wdXQuY2hhckF0KGxvY2FsX3Bvcyk7XG4gICAgICAgICAgICB3aGlsZSAoaW5fYXJyYXkoYywgd2hpdGVzcGFjZSkgJiYgYyAhPT0gZmluZCkge1xuICAgICAgICAgICAgICAgIGxvY2FsX3BvcysrO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbF9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYyA9IGlucHV0LmNoYXJBdChsb2NhbF9wb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGMgPT09IGZpbmQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRfbmV4dF90b2tlbigpIHtcbiAgICAgICAgICAgIHZhciBpLCByZXN1bHRpbmdfc3RyaW5nO1xuXG4gICAgICAgICAgICBuX25ld2xpbmVzID0gMDtcblxuICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnJywgJ1RLX0VPRiddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnB1dF93YW50ZWRfbmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4gPSBbXTtcblxuICAgICAgICAgICAgdmFyIGMgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG5cbiAgICAgICAgICAgIHdoaWxlIChpbl9hcnJheShjLCB3aGl0ZXNwYWNlKSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5fbmV3bGluZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5fbmV3bGluZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09IGluZGVudF9zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlc3BhY2VfYmVmb3JlX3Rva2VuLnB1c2goaW5kZW50X3N0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyAhPT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlc3BhY2VfYmVmb3JlX3Rva2VuLnB1c2goJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zID49IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWycnLCAnVEtfRU9GJ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYyA9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbl9hcnJheShjLCB3b3JkY2hhcikpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5fYXJyYXkoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpLCB3b3JkY2hhcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPT09IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc21hbGwgYW5kIHN1cnByaXNpbmdseSB1bnVnbHkgaGFjayBmb3IgMUUtMTAgcmVwcmVzZW50YXRpb25cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyAhPT0gaW5wdXRfbGVuZ3RoICYmIGMubWF0Y2goL15bMC05XStbRWVdJC8pICYmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICctJyB8fCBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICcrJykpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc2lnbiA9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gZ2V0X25leHRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgYyArPSBzaWduICsgdFswXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfV09SRCddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjID09PSAnaW4nKSB7IC8vIGhhY2sgZm9yICdpbicgb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfT1BFUkFUT1InXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfV09SRCddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJygnIHx8IGMgPT09ICdbJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX1NUQVJUX0VYUFInXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPT09ICcpJyB8fCBjID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19FTkRfRVhQUiddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfU1RBUlRfQkxPQ0snXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPT09ICd9Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX0VORF9CTE9DSyddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJzsnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfU0VNSUNPTE9OJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tbWVudCA9ICcnO1xuICAgICAgICAgICAgICAgIC8vIHBlZWsgZm9yIGNvbW1lbnQgLyogLi4uICovXG4gICAgICAgICAgICAgICAgdmFyIGlubGluZV9jb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGggJiYgIShpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICcqJyAmJiBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcyArIDEpICYmIGlucHV0LmNoYXJBdChwYXJzZXJfcG9zICsgMSkgPT09ICcvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCJcXG5cIiB8fCBjID09PSBcIlxcclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubGluZV9jb21tZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA+PSBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlubGluZV9jb21tZW50ICYmIG5fbmV3bGluZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJy8qJyArIGNvbW1lbnQgKyAnKi8nLCAnVEtfSU5MSU5FX0NPTU1FTlQnXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbJy8qJyArIGNvbW1lbnQgKyAnKi8nLCAnVEtfQkxPQ0tfQ09NTUVOVCddO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHBlZWsgZm9yIGNvbW1lbnQgLy8gLi4uXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBjO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpICE9PSAnXFxyJyAmJiBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgIT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ICs9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zID49IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbY29tbWVudCwgJ1RLX0NPTU1FTlQnXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gXCInXCIgfHwgYyA9PT0gJ1wiJyB8fCAvLyBzdHJpbmdcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIChjID09PSAnLycpIHx8IC8vIHJlZ2V4cFxuICAgICAgICAgICAgICAgICAgICAob3B0LmU0eCAmJiBjID09PSBcIjxcIiAmJiBpbnB1dC5zbGljZShwYXJzZXJfcG9zIC0gMSkubWF0Y2goL148KFstYS16QS1aOjAtOV8uXSt8e1tee31dKn18IVxcW0NEQVRBXFxbW1xcc1xcU10qP1xcXVxcXSlcXHMqKFstYS16QS1aOjAtOV8uXSs9KCdbXiddKid8XCJbXlwiXSpcInx7W157fV0qfSlcXHMqKSpcXC8/XFxzKj4vKSkgLy8geG1sXG4gICAgICAgICAgICAgICAgKSAmJiAoIC8vIHJlZ2V4IGFuZCB4bWwgY2FuIG9ubHkgYXBwZWFyIGluIHNwZWNpZmljIGxvY2F0aW9ucyBkdXJpbmcgcGFyc2luZ1xuICAgICAgICAgICAgICAgICAgICAobGFzdF90eXBlID09PSAnVEtfV09SRCcgJiYgaXNfc3BlY2lhbF93b3JkKGZsYWdzLmxhc3RfdGV4dCkpIHx8XG4gICAgICAgICAgICAgICAgICAgIChsYXN0X3R5cGUgPT09ICdUS19FTkRfRVhQUicgJiYgaW5fYXJyYXkocHJldmlvdXNfZmxhZ3MubW9kZSwgW01PREUuQ29uZGl0aW9uYWwsIE1PREUuRm9ySW5pdGlhbGl6ZXJdKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGluX2FycmF5KGxhc3RfdHlwZSwgWydUS19DT01NRU5UJywgJ1RLX1NUQVJUX0VYUFInLCAnVEtfU1RBUlRfQkxPQ0snLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1RLX0VORF9CTE9DSycsICdUS19PUEVSQVRPUicsICdUS19FUVVBTFMnLCAnVEtfRU9GJywgJ1RLX1NFTUlDT0xPTicsICdUS19DT01NQSdcbiAgICAgICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAgICAgKSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlcCA9IGMsXG4gICAgICAgICAgICAgICAgICAgIGVzYyA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXNfY2hhcl9lc2NhcGVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nID0gYztcblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXAgPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSByZWdleHBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5fY2hhcl9jbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVzYyB8fCBpbl9jaGFyX2NsYXNzIHx8IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSAhPT0gc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nX3N0cmluZyArPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnXFxcXCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICdbJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5fY2hhcl9jbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluX2NoYXJfY2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVzYyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY29tcGxldGUgc3RyaW5nL3JleHAgd2hlbiBlbmQtb2YtZmlsZSByZWFjaGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYWlsIG91dCB3aXRoIHdoYXQgaGFkIGJlZW4gcmVjZWl2ZWQgc28gZmFyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Jlc3VsdGluZ19zdHJpbmcsICdUS19TVFJJTkcnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0LmU0eCAmJiBzZXAgPT09ICc8Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBlNHggeG1sIGxpdGVyYWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhtbFJlZ0V4cCA9IC88KFxcLz8pKFstYS16QS1aOjAtOV8uXSt8e1tee31dKn18IVxcW0NEQVRBXFxbW1xcc1xcU10qP1xcXVxcXSlcXHMqKFstYS16QS1aOjAtOV8uXSs9KCdbXiddKid8XCJbXlwiXSpcInx7W157fV0qfSlcXHMqKSooXFwvPylcXHMqPi9nO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhtbFN0ciA9IGlucHV0LnNsaWNlKHBhcnNlcl9wb3MgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHhtbFJlZ0V4cC5leGVjKHhtbFN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2guaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdFRhZyA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0VuZFRhZyA9ICEhIG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFnTmFtZSA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTaW5nbGV0b25UYWcgPSAoICEhIG1hdGNoW21hdGNoLmxlbmd0aCAtIDFdKSB8fCAodGFnTmFtZS5zbGljZSgwLCA4KSA9PT0gXCIhW0NEQVRBW1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09IHJvb3RUYWcgJiYgIWlzU2luZ2xldG9uVGFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbmRUYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLWRlcHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArK2RlcHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IHhtbFJlZ0V4cC5leGVjKHhtbFN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4bWxMZW5ndGggPSBtYXRjaCA/IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoIDogeG1sU3RyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IHhtbExlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt4bWxTdHIuc2xpY2UoMCwgeG1sTGVuZ3RoKSwgXCJUS19TVFJJTkdcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChlc2MgfHwgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpICE9PSBzZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nICs9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXNjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICd4JyB8fCBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICd1Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzX2NoYXJfZXNjYXBlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnXFxcXCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA+PSBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jb21wbGV0ZSBzdHJpbmcvcmV4cCB3aGVuIGVuZC1vZi1maWxlIHJlYWNoZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhaWwgb3V0IHdpdGggd2hhdCBoYWQgYmVlbiByZWNlaXZlZCBzbyBmYXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcmVzdWx0aW5nX3N0cmluZywgJ1RLX1NUUklORyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgKz0gc2VwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhhc19jaGFyX2VzY2FwZXMgJiYgb3B0LnVuZXNjYXBlX3N0cmluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nX3N0cmluZyA9IHVuZXNjYXBlX3N0cmluZyhyZXN1bHRpbmdfc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VwID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVnZXhwcyBtYXkgaGF2ZSBtb2RpZmllcnMgL3JlZ2V4cC9NT0QgLCBzbyBmZXRjaCB0aG9zZSwgdG9vXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoICYmIGluX2FycmF5KGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSwgd29yZGNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nICs9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW3Jlc3VsdGluZ19zdHJpbmcsICdUS19TVFJJTkcnXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPT09ICcjJykge1xuXG5cbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0X2xpbmVzLmxlbmd0aCA9PT0gMSAmJiBvdXRwdXRfbGluZXNbMF0udGV4dC5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnIScpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hlYmFuZ1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nID0gYztcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGggJiYgYyAhPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nICs9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt0cmltKHJlc3VsdGluZ19zdHJpbmcpICsgJ1xcbicsICdUS19VTktOT1dOJ107XG4gICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgIC8vIFNwaWRlcm1vbmtleS1zcGVjaWZpYyBzaGFycCB2YXJpYWJsZXMgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXNcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9Fbi9TaGFycF92YXJpYWJsZXNfaW5fSmF2YVNjcmlwdFxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9teHIubW96aWxsYS5vcmcvbW96aWxsYS1jZW50cmFsL3NvdXJjZS9qcy9zcmMvanNzY2FuLmNwcCBhcm91bmQgbGluZSAxOTM1XG4gICAgICAgICAgICAgICAgdmFyIHNoYXJwID0gJyMnO1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoICYmIGluX2FycmF5KGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSwgZGlnaXRzKSkge1xuICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcnAgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCAmJiBjICE9PSAnIycgJiYgYyAhPT0gJz0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICcjJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICdbJyAmJiBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcyArIDEpID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJwICs9ICdbXSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAneycgJiYgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MgKyAxKSA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFycCArPSAne30nO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbc2hhcnAsICdUS19XT1JEJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJzwnICYmIGlucHV0LnN1YnN0cmluZyhwYXJzZXJfcG9zIC0gMSwgcGFyc2VyX3BvcyArIDMpID09PSAnPCEtLScpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDM7XG4gICAgICAgICAgICAgICAgYyA9ICc8IS0tJztcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpICE9PSAnXFxuJyAmJiBwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGMgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZsYWdzLmluX2h0bWxfY29tbWVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfQ09NTUVOVCddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJy0nICYmIGZsYWdzLmluX2h0bWxfY29tbWVudCAmJiBpbnB1dC5zdWJzdHJpbmcocGFyc2VyX3BvcyAtIDEsIHBhcnNlcl9wb3MgKyAyKSA9PT0gJy0tPicpIHtcbiAgICAgICAgICAgICAgICBmbGFncy5pbl9odG1sX2NvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnLS0+JywgJ1RLX0NPTU1FTlQnXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPT09ICcuJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX0RPVCddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5fYXJyYXkoYywgcHVuY3QpKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGggJiYgaW5fYXJyYXkoYyArIGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSwgcHVuY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGMgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zID49IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX0NPTU1BJ107XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfRVFVQUxTJ107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfT1BFUkFUT1InXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX1VOS05PV04nXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9zdGFydF9leHByKCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0X29mX3N0YXRlbWVudCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbmRpdGlvbmFsIHN0YXJ0cyB0aGUgc3RhdGVtZW50IGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV4dF9tb2RlID0gTU9ERS5FeHByZXNzaW9uO1xuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICdbJykge1xuXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1dPUkQnIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJyknKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgYXJyYXkgaW5kZXggc3BlY2lmaWVyLCBicmVhayBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAvLyBhW3hdLCBmbigpW3hdXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbl9hcnJheShmbGFncy5sYXN0X3RleHQsIGxpbmVfc3RhcnRlcnMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRfbW9kZShuZXh0X21vZGUpO1xuICAgICAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5zcGFjZV9pbl9wYXJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5leHRfbW9kZSA9IE1PREUuQXJyYXlMaXRlcmFsO1xuICAgICAgICAgICAgICAgIGlmIChpc19hcnJheShmbGFncy5tb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhZ3MubGFzdF90ZXh0ID09PSAnWycgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChmbGFncy5sYXN0X3RleHQgPT09ICcsJyAmJiAobGFzdF9sYXN0X3RleHQgPT09ICddJyB8fCBsYXN0X2xhc3RfdGV4dCA9PT0gJ30nKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIF0sIFsgZ29lcyB0byBuZXcgbGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgWyBnb2VzIHRvIG5ldyBsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdC5rZWVwX2FycmF5X2luZGVudGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICdmb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRfbW9kZSA9IE1PREUuRm9ySW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbl9hcnJheShmbGFncy5sYXN0X3RleHQsIFsnaWYnLCAnd2hpbGUnXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dF9tb2RlID0gTU9ERS5Db25kaXRpb25hbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBuZXh0X21vZGUgPSBNT0RFLkV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmxhZ3MubGFzdF90ZXh0ID09PSAnOycgfHwgbGFzdF90eXBlID09PSAnVEtfU1RBUlRfQkxPQ0snKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0X3R5cGUgPT09ICdUS19FTkRfRVhQUicgfHwgbGFzdF90eXBlID09PSAnVEtfU1RBUlRfRVhQUicgfHwgbGFzdF90eXBlID09PSAnVEtfRU5EX0JMT0NLJyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICcuJykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IENvbnNpZGVyIHdoZXRoZXIgZm9yY2luZyB0aGlzIGlzIHJlcXVpcmVkLiAgUmV2aWV3IGZhaWxpbmcgdGVzdHMgd2hlbiByZW1vdmVkLlxuICAgICAgICAgICAgICAgIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoaW5wdXRfd2FudGVkX25ld2xpbmUpO1xuICAgICAgICAgICAgICAgIG91dHB1dF93cmFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyBvbiAoKCBhbmQgKSggYW5kIF1bIGFuZCBdKCBhbmQgLihcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlICE9PSAnVEtfV09SRCcgJiYgbGFzdF90eXBlICE9PSAnVEtfT1BFUkFUT1InKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZsYWdzLmxhc3Rfd29yZCA9PT0gJ2Z1bmN0aW9uJyB8fCBmbGFncy5sYXN0X3dvcmQgPT09ICd0eXBlb2YnKSB7XG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24oKSB2cyBmdW5jdGlvbiAoKVxuICAgICAgICAgICAgICAgIGlmIChvcHQuanNsaW50X2hhcHB5KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5fYXJyYXkoZmxhZ3MubGFzdF90ZXh0LCBsaW5lX3N0YXJ0ZXJzKSB8fCBmbGFncy5sYXN0X3RleHQgPT09ICdjYXRjaCcpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0LnNwYWNlX2JlZm9yZV9jb25kaXRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN1cHBvcnQgb2YgdGhpcyBraW5kIG9mIG5ld2xpbmUgcHJlc2VydmF0aW9uLlxuICAgICAgICAgICAgLy8gYSA9IChiICYmXG4gICAgICAgICAgICAvLyAgICAgKGMgfHwgZCkpO1xuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICcoJykge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgPT09ICdUS19FUVVBTFMnIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX09QRVJBVE9SJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0X29mX29iamVjdF9wcm9wZXJ0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldF9tb2RlKG5leHRfbW9kZSk7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgaWYgKG9wdC5zcGFjZV9pbl9wYXJlbikge1xuICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJbiBhbGwgY2FzZXMsIGlmIHdlIG5ld2xpbmUgd2hpbGUgaW5zaWRlIGFuIGV4cHJlc3Npb24gaXQgc2hvdWxkIGJlIGluZGVudGVkLlxuICAgICAgICAgICAgaW5kZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfZW5kX2V4cHIoKSB7XG4gICAgICAgICAgICAvLyBzdGF0ZW1lbnRzIGluc2lkZSBleHByZXNzaW9ucyBhcmUgbm90IHZhbGlkIHN5bnRheCwgYnV0Li4uXG4gICAgICAgICAgICAvLyBzdGF0ZW1lbnRzIG11c3QgYWxsIGJlIGNsb3NlZCB3aGVuIHRoZWlyIGNvbnRhaW5lciBjbG9zZXNcbiAgICAgICAgICAgIHdoaWxlIChmbGFncy5tb2RlID09PSBNT0RFLlN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ10nICYmIGlzX2FycmF5KGZsYWdzLm1vZGUpICYmIGZsYWdzLm11bHRpbGluZV9mcmFtZSAmJiAhb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmbGFncy5tdWx0aWxpbmVfZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0LnNwYWNlX2luX3BhcmVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1NUQVJUX0VYUFInKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICgpIFtdIG5vIGlubmVyIHNwYWNlIGluIGVtcHR5IHBhcmVucyBsaWtlIHRoZXNlLCBldmVyLCByZWYgIzMyMFxuICAgICAgICAgICAgICAgICAgICB0cmltX291dHB1dCgpO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICddJyAmJiBvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbikge1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgcmVzdG9yZV9tb2RlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmVfcmVkdW5kYW50X2luZGVudGF0aW9uKHByZXZpb3VzX2ZsYWdzKTtcblxuICAgICAgICAgICAgLy8gZG8ge30gd2hpbGUgKCkgLy8gbm8gc3RhdGVtZW50IHJlcXVpcmVkIGFmdGVyXG4gICAgICAgICAgICBpZiAoZmxhZ3MuZG9fd2hpbGUgJiYgcHJldmlvdXNfZmxhZ3MubW9kZSA9PT0gTU9ERS5Db25kaXRpb25hbCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzX2ZsYWdzLm1vZGUgPSBNT0RFLkV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgZmxhZ3MuZG9fYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmbGFncy5kb193aGlsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfc3RhcnRfYmxvY2soKSB7XG4gICAgICAgICAgICBzZXRfbW9kZShNT0RFLkJsb2NrU3RhdGVtZW50KTtcblxuICAgICAgICAgICAgdmFyIGVtcHR5X2JyYWNlcyA9IGlzX25leHQoJ30nKTtcbiAgICAgICAgICAgIHZhciBlbXB0eV9hbm9ueW1vdXNfZnVuY3Rpb24gPSBlbXB0eV9icmFjZXMgJiYgZmxhZ3MubGFzdF93b3JkID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgICAgbGFzdF90eXBlID09PSAnVEtfRU5EX0VYUFInO1xuXG4gICAgICAgICAgICBpZiAob3B0LmJyYWNlX3N0eWxlID09PSBcImV4cGFuZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSAhPT0gJ1RLX09QRVJBVE9SJyAmJlxuICAgICAgICAgICAgICAgICAgICAoZW1wdHlfYW5vbnltb3VzX2Z1bmN0aW9uIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0X3R5cGUgPT09ICdUS19FUVVBTFMnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoaXNfc3BlY2lhbF93b3JkKGZsYWdzLmxhc3RfdGV4dCkgJiYgZmxhZ3MubGFzdF90ZXh0ICE9PSAnZWxzZScpKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gY29sbGFwc2VcbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlICE9PSAnVEtfT1BFUkFUT1InICYmIGxhc3RfdHlwZSAhPT0gJ1RLX1NUQVJUX0VYUFInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9CTE9DSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgVEtfT1BFUkFUT1Igb3IgVEtfU1RBUlRfRVhQUlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfYXJyYXkocHJldmlvdXNfZmxhZ3MubW9kZSkgJiYgZmxhZ3MubGFzdF90ZXh0ID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0X2xhc3RfdGV4dCA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSwgeyBpbiBhcnJheSBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTsgLy8gW2EsIGIsIGMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICBpbmRlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9lbmRfYmxvY2soKSB7XG4gICAgICAgICAgICAvLyBzdGF0ZW1lbnRzIG11c3QgYWxsIGJlIGNsb3NlZCB3aGVuIHRoZWlyIGNvbnRhaW5lciBjbG9zZXNcbiAgICAgICAgICAgIHdoaWxlIChmbGFncy5tb2RlID09PSBNT0RFLlN0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVtcHR5X2JyYWNlcyA9IGxhc3RfdHlwZSA9PT0gJ1RLX1NUQVJUX0JMT0NLJztcblxuICAgICAgICAgICAgaWYgKG9wdC5icmFjZV9zdHlsZSA9PT0gXCJleHBhbmRcIikge1xuICAgICAgICAgICAgICAgIGlmICghZW1wdHlfYnJhY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNraXAge31cbiAgICAgICAgICAgICAgICBpZiAoIWVtcHR5X2JyYWNlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfYXJyYXkoZmxhZ3MubW9kZSkgJiYgb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIFJFQUxMWSBuZWVkIGEgbmV3bGluZSBoZXJlLCBidXQgbmV3bGluZXIgd291bGQgc2tpcCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN0b3JlX21vZGUoKTtcbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfd29yZCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydF9vZl9zdGF0ZW1lbnQoKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBjb25kaXRpb25hbCBzdGFydHMgdGhlIHN0YXRlbWVudCBpZiBhcHByb3ByaWF0ZS5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRfd2FudGVkX25ld2xpbmUgJiYgIWlzX2V4cHJlc3Npb24oZmxhZ3MubW9kZSkgJiZcbiAgICAgICAgICAgICAgICAobGFzdF90eXBlICE9PSAnVEtfT1BFUkFUT1InIHx8IChmbGFncy5sYXN0X3RleHQgPT09ICctLScgfHwgZmxhZ3MubGFzdF90ZXh0ID09PSAnKysnKSkgJiZcbiAgICAgICAgICAgICAgICBsYXN0X3R5cGUgIT09ICdUS19FUVVBTFMnICYmXG4gICAgICAgICAgICAgICAgKG9wdC5wcmVzZXJ2ZV9uZXdsaW5lcyB8fCBmbGFncy5sYXN0X3RleHQgIT09ICd2YXInKSkge1xuXG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmxhZ3MuZG9fYmxvY2sgJiYgIWZsYWdzLmRvX3doaWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICd3aGlsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZG8ge30gIyMgd2hpbGUgKClcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmbGFncy5kb193aGlsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyB7fSBzaG91bGQgYWx3YXlzIGhhdmUgd2hpbGUgYXMgdGhlIG5leHQgd29yZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZG9uJ3Qgc2VlIHRoZSBleHBlY3RlZCB3aGlsZSwgcmVjb3ZlclxuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmRvX2Jsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBtYXkgYmUgZm9sbG93ZWQgYnkgZWxzZSwgb3Igbm90XG4gICAgICAgICAgICAvLyBCYXJlL2lubGluZSBpZnMgYXJlIHRyaWNreVxuICAgICAgICAgICAgLy8gTmVlZCB0byB1bndpbmQgdGhlIG1vZGVzIGNvcnJlY3RseTogaWYgKGEpIGlmIChiKSBjKCk7IGVsc2UgZCgpOyBlbHNlIGUoKTtcbiAgICAgICAgICAgIGlmIChmbGFncy5pZl9ibG9jaykge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ICE9PSAnZWxzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGZsYWdzLm1vZGUgPT09IE1PREUuU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0b3JlX21vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmbGFncy5pZl9ibG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICdjYXNlJyB8fCAodG9rZW5fdGV4dCA9PT0gJ2RlZmF1bHQnICYmIGZsYWdzLmluX2Nhc2Vfc3RhdGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MuY2FzZV9ib2R5IHx8IG9wdC5qc2xpbnRfaGFwcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGNhc2VzIGZvbGxvd2luZyBvbmUgYW5vdGhlclxuICAgICAgICAgICAgICAgICAgICBkZWluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICBmbGFncy5jYXNlX2JvZHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICBmbGFncy5pbl9jYXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmbGFncy5pbl9jYXNlX3N0YXRlbWVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChmbGFncy52YXJfbGluZSAmJiBsYXN0X3R5cGUgIT09ICdUS19FUVVBTFMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5fYXJyYXkoZmxhZ3MubGFzdF90ZXh0LCBbJ30nLCAnOyddKSB8fCAoanVzdF9hZGRlZF9uZXdsaW5lKCkgJiYgISBpbl9hcnJheShmbGFncy5sYXN0X3RleHQsIFsneycsICc6JywgJz0nLCAnLCddKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZXJlIGlzIGEgbmljZSBjbGVhbiBzcGFjZSBvZiBhdCBsZWFzdCBvbmUgYmxhbmsgbGluZVxuICAgICAgICAgICAgICAgICAgICAvLyBiZWZvcmUgYSBuZXcgZnVuY3Rpb24gZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoICEganVzdF9hZGRlZF9ibGFua2xpbmUoKSAmJiAhIGZsYWdzLmhhZF9jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgPT09ICdUS19XT1JEJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhZ3MubGFzdF90ZXh0ID09PSAnZ2V0JyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICdzZXQnIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJ25ldycgfHwgZmxhZ3MubGFzdF90ZXh0ID09PSAncmV0dXJuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX09QRVJBVE9SJyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb28gPSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzX2V4cHJlc3Npb24oZmxhZ3MubW9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gKGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0NPTU1BJyB8fCBsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9FWFBSJyB8fCBsYXN0X3R5cGUgPT09ICdUS19FUVVBTFMnIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX09QRVJBVE9SJykge1xuICAgICAgICAgICAgICAgIGlmICghc3RhcnRfb2Zfb2JqZWN0X3Byb3BlcnR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dfd3JhcF9vcl9wcmVzZXJ2ZWRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgIGZsYWdzLmxhc3Rfd29yZCA9IHRva2VuX3RleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVmaXggPSAnTk9ORSc7XG5cbiAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgPT09ICdUS19FTkRfQkxPQ0snKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbl9hcnJheSh0b2tlbl90ZXh0LCBbJ2Vsc2UnLCAnY2F0Y2gnLCAnZmluYWxseSddKSkge1xuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5icmFjZV9zdHlsZSA9PT0gXCJleHBhbmRcIiB8fCBvcHQuYnJhY2Vfc3R5bGUgPT09IFwiZW5kLWV4cGFuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnU1BBQ0UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1NFTUlDT0xPTicgJiYgZmxhZ3MubW9kZSA9PT0gTU9ERS5CbG9ja1N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGZvciBTVEFURU1FTlQgYXMgd2VsbD9cbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1NFTUlDT0xPTicgJiYgaXNfZXhwcmVzc2lvbihmbGFncy5tb2RlKSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICdTUEFDRSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1NUUklORycpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1dPUkQnKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ID0gJ1NQQUNFJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfU1RBUlRfQkxPQ0snKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ID0gJ05FV0xJTkUnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0X3R5cGUgPT09ICdUS19FTkRfRVhQUicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbl9hcnJheSh0b2tlbl90ZXh0LCBsaW5lX3N0YXJ0ZXJzKSAmJiBmbGFncy5sYXN0X3RleHQgIT09ICcpJykge1xuICAgICAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICdlbHNlJykge1xuICAgICAgICAgICAgICAgICAgICBwcmVmaXggPSAnU1BBQ0UnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluX2FycmF5KHRva2VuX3RleHQsIFsnZWxzZScsICdjYXRjaCcsICdmaW5hbGx5J10pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSAhPT0gJ1RLX0VORF9CTE9DSycgfHwgb3B0LmJyYWNlX3N0eWxlID09PSBcImV4cGFuZFwiIHx8IG9wdC5icmFjZV9zdHlsZSA9PT0gXCJlbmQtZXhwYW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyaW1fb3V0cHV0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIHRyaW1tZWQgYW5kIHRoZXJlJ3Mgc29tZXRoaW5nIG90aGVyIHRoYW4gYSBjbG9zZSBibG9jayBiZWZvcmUgdXNcbiAgICAgICAgICAgICAgICAgICAgLy8gcHV0IGEgbmV3bGluZSBiYWNrIGluLiAgSGFuZGxlcyAnfSAvLyBjb21tZW50JyBzY2VuYXJpby5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUudGV4dFtsaW5lLnRleHQubGVuZ3RoIC0gMV0gIT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJlZml4ID09PSAnTkVXTElORScpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNfc3BlY2lhbF93b3JkKGZsYWdzLmxhc3RfdGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gbmV3bGluZSBiZXR3ZWVuICdyZXR1cm4gbm5uJ1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSAhPT0gJ1RLX0VORF9FWFBSJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGxhc3RfdHlwZSAhPT0gJ1RLX1NUQVJUX0VYUFInIHx8IHRva2VuX3RleHQgIT09ICd2YXInKSAmJiBmbGFncy5sYXN0X3RleHQgIT09ICc6Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbmVlZCB0byBmb3JjZSBuZXdsaW5lIG9uICd2YXInOiBmb3IgKHZhciB4ID0gMC4uLilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnaWYnICYmIGZsYWdzLmxhc3Rfd29yZCA9PT0gJ2Vsc2UnICYmIGZsYWdzLmxhc3RfdGV4dCAhPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8gbmV3bGluZSBmb3IgfSBlbHNlIGlmIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV9yZWluZGVudGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbl9hcnJheSh0b2tlbl90ZXh0LCBsaW5lX3N0YXJ0ZXJzKSAmJiBmbGFncy5sYXN0X3RleHQgIT09ICcpJykge1xuICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV9yZWluZGVudGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzX2FycmF5KGZsYWdzLm1vZGUpICYmIGZsYWdzLmxhc3RfdGV4dCA9PT0gJywnICYmIGxhc3RfbGFzdF90ZXh0ID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7IC8vIH0sIGluIGxpc3RzIGdldCBhIG5ld2xpbmUgdHJlYXRtZW50XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZWZpeCA9PT0gJ1NQQUNFJykge1xuICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgIGZsYWdzLmxhc3Rfd29yZCA9IHRva2VuX3RleHQ7XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAndmFyJykge1xuICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV9yZWluZGVudGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmVfdGFpbnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ2RvJykge1xuICAgICAgICAgICAgICAgIGZsYWdzLmRvX2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICdpZicpIHtcbiAgICAgICAgICAgICAgICBmbGFncy5pZl9ibG9jayA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfc2VtaWNvbG9uKCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0X29mX3N0YXRlbWVudCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbmRpdGlvbmFsIHN0YXJ0cyB0aGUgc3RhdGVtZW50IGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgICAgICAgIC8vIFNlbWljb2xvbiBjYW4gYmUgdGhlIHN0YXJ0IChhbmQgZW5kKSBvZiBhIHN0YXRlbWVudFxuICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlIChmbGFncy5tb2RlID09PSBNT0RFLlN0YXRlbWVudCAmJiAhZmxhZ3MuaWZfYmxvY2sgJiYgIWZsYWdzLmRvX2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmVzdG9yZV9tb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChmbGFncy5tb2RlID09PSBNT0RFLk9iamVjdExpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSdyZSBpbiBPQkpFQ1QgbW9kZSBhbmQgc2VlIGEgc2VtaWNvbG9uLCBpdHMgaW52YWxpZCBzeW50YXhcbiAgICAgICAgICAgICAgICAvLyByZWNvdmVyIGJhY2sgdG8gdHJlYXRpbmcgdGhpcyBhcyBhIEJMT0NLXG4gICAgICAgICAgICAgICAgZmxhZ3MubW9kZSA9IE1PREUuQmxvY2tTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfc3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0X29mX3N0YXRlbWVudCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbmRpdGlvbmFsIHN0YXJ0cyB0aGUgc3RhdGVtZW50IGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgICAgICAgIC8vIE9uZSBkaWZmZXJlbmNlIC0gc3RyaW5ncyB3YW50IGF0IGxlYXN0IGEgc3BhY2UgYmVmb3JlXG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1dPUkQnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0NPTU1BJyB8fCBsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9FWFBSJyB8fCBsYXN0X3R5cGUgPT09ICdUS19FUVVBTFMnIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX09QRVJBVE9SJykge1xuICAgICAgICAgICAgICAgIGlmICghc3RhcnRfb2Zfb2JqZWN0X3Byb3BlcnR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dfd3JhcF9vcl9wcmVzZXJ2ZWRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9lcXVhbHMoKSB7XG4gICAgICAgICAgICBpZiAoZmxhZ3MudmFyX2xpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGdvdCBhbiAnPScgaW4gYSB2YXItbGluZSwgZGlmZmVyZW50IGZvcm1hdHRpbmcvbGluZS1icmVha2luZywgZXRjIHdpbGwgbm93IGJlIGRvbmVcbiAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV90YWludGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX2NvbW1hKCkge1xuICAgICAgICAgICAgaWYgKGZsYWdzLnZhcl9saW5lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzX2V4cHJlc3Npb24oZmxhZ3MubW9kZSkgfHwgbGFzdF90eXBlID09PSAnVEtfRU5EX0JMT0NLJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyBub3QgYnJlYWsgb24gY29tbWEsIGZvcih2YXIgYSA9IDEsIGIgPSAyKVxuICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV90YWludGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLnZhcl9saW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MudmFyX2xpbmVfdGFpbnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV90YWludGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGFzdF90eXBlID09PSAnVEtfRU5EX0JMT0NLJyAmJiBmbGFncy5tb2RlICE9PSBNT0RFLkV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgIGlmIChmbGFncy5tb2RlID09PSBNT0RFLk9iamVjdExpdGVyYWwgJiYgZmxhZ3MubGFzdF90ZXh0ID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLm1vZGUgPT09IE1PREUuT2JqZWN0TGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRVhQUiBvciBET19CTE9DS1xuICAgICAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfb3BlcmF0b3IoKSB7XG4gICAgICAgICAgICB2YXIgc3BhY2VfYmVmb3JlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBzcGFjZV9hZnRlciA9IHRydWU7XG4gICAgICAgICAgICBpZiAoaXNfc3BlY2lhbF93b3JkKGZsYWdzLmxhc3RfdGV4dCkpIHtcbiAgICAgICAgICAgICAgICAvLyBcInJldHVyblwiIGhhZCBhIHNwZWNpYWwgaGFuZGxpbmcgaW4gVEtfV09SRC4gTm93IHdlIG5lZWQgdG8gcmV0dXJuIHRoZSBmYXZvclxuICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoYWNrIGZvciBhY3Rpb25zY3JpcHQncyBpbXBvcnQgLio7XG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJyonICYmIGxhc3RfdHlwZSA9PT0gJ1RLX0RPVCcgJiYgIWxhc3RfbGFzdF90ZXh0Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJzonICYmIGZsYWdzLmluX2Nhc2UpIHtcbiAgICAgICAgICAgICAgICBmbGFncy5jYXNlX2JvZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGluZGVudCgpO1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIGZsYWdzLmluX2Nhc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnOjonKSB7XG4gICAgICAgICAgICAgICAgLy8gbm8gc3BhY2VzIGFyb3VuZCBleG90aWMgbmFtZXNwYWNpbmcgc3ludGF4IG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi81LjEvI3NlYy03LjkuMVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBuZXdsaW5lIGJldHdlZW4gLS0gb3IgKysgYW5kIGFueXRoaW5nIGVsc2Ugd2Ugc2hvdWxkIHByZXNlcnZlIGl0LlxuICAgICAgICAgICAgaWYgKGlucHV0X3dhbnRlZF9uZXdsaW5lICYmICh0b2tlbl90ZXh0ID09PSAnLS0nIHx8IHRva2VuX3RleHQgPT09ICcrKycpKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5fYXJyYXkodG9rZW5fdGV4dCwgWyctLScsICcrKycsICchJ10pIHx8IChpbl9hcnJheSh0b2tlbl90ZXh0LCBbJy0nLCAnKyddKSAmJiAoaW5fYXJyYXkobGFzdF90eXBlLCBbJ1RLX1NUQVJUX0JMT0NLJywgJ1RLX1NUQVJUX0VYUFInLCAnVEtfRVFVQUxTJywgJ1RLX09QRVJBVE9SJ10pIHx8IGluX2FycmF5KGZsYWdzLmxhc3RfdGV4dCwgbGluZV9zdGFydGVycykgfHwgZmxhZ3MubGFzdF90ZXh0ID09PSAnLCcpKSkge1xuICAgICAgICAgICAgICAgIC8vIHVuYXJ5IG9wZXJhdG9ycyAoYW5kIGJpbmFyeSArLy0gcHJldGVuZGluZyB0byBiZSB1bmFyeSkgc3BlY2lhbCBjYXNlc1xuXG4gICAgICAgICAgICAgICAgc3BhY2VfYmVmb3JlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc3BhY2VfYWZ0ZXIgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICc7JyAmJiBpc19leHByZXNzaW9uKGZsYWdzLm1vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciAoOzsgKytpKVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgXl5eXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2JlZm9yZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1dPUkQnICYmIGluX2FycmF5KGZsYWdzLmxhc3RfdGV4dCwgbGluZV9zdGFydGVycykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfYmVmb3JlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoKGZsYWdzLm1vZGUgPT09IE1PREUuQmxvY2tTdGF0ZW1lbnQgfHwgZmxhZ3MubW9kZSA9PT0gTU9ERS5TdGF0ZW1lbnQpICYmIChmbGFncy5sYXN0X3RleHQgPT09ICd7JyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICc7JykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8geyBmb287IC0taSB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvbygpOyAtLWJhcjtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW5fdGV4dCA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLnRlcm5hcnlfZGVwdGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYWdzLm1vZGUgPT09IE1PREUuQmxvY2tTdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdzLm1vZGUgPSBNT0RFLk9iamVjdExpdGVyYWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfYmVmb3JlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MudGVybmFyeV9kZXB0aCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW5fdGV4dCA9PT0gJz8nKSB7XG4gICAgICAgICAgICAgICAgZmxhZ3MudGVybmFyeV9kZXB0aCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gfHwgc3BhY2VfYmVmb3JlO1xuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSBzcGFjZV9hZnRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9ibG9ja19jb21tZW50KCkge1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gc3BsaXRfbmV3bGluZXModG9rZW5fdGV4dCk7XG4gICAgICAgICAgICB2YXIgajsgLy8gaXRlcmF0b3IgZm9yIHRoaXMgY2FzZVxuICAgICAgICAgICAgdmFyIGphdmFkb2MgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gYmxvY2sgY29tbWVudCBzdGFydHMgd2l0aCBhIG5ldyBsaW5lXG4gICAgICAgICAgICBwcmludF9uZXdsaW5lKGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbF9saW5lc19zdGFydF93aXRoKGxpbmVzLnNsaWNlKDEpLCAnKicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGphdmFkb2MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlyc3QgbGluZSBhbHdheXMgaW5kZW50ZWRcbiAgICAgICAgICAgIHByaW50X3Rva2VuKGxpbmVzWzBdKTtcbiAgICAgICAgICAgIGZvciAoaiA9IDE7IGogPCBsaW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChqYXZhZG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGphdmFkb2M6IHJlZm9ybWF0IGFuZCByZS1pbmRlbnRcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oJyAnICsgdHJpbShsaW5lc1tqXSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vcm1hbCBjb21tZW50cyBvdXRwdXQgcmF3XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV0udGV4dC5wdXNoKGxpbmVzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZvciBjb21tZW50cyBvZiBtb3JlIHRoYW4gb25lIGxpbmUsIG1ha2Ugc3VyZSB0aGVyZSdzIGEgbmV3IGxpbmUgYWZ0ZXJcbiAgICAgICAgICAgIHByaW50X25ld2xpbmUoZmFsc2UsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX2lubGluZV9jb21tZW50KCkge1xuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfY29tbWVudCgpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dF93YW50ZWRfbmV3bGluZSkge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmltX291dHB1dCh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgcHJpbnRfbmV3bGluZShmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfZG90KCkge1xuICAgICAgICAgICAgaWYgKGlzX3NwZWNpYWxfd29yZChmbGFncy5sYXN0X3RleHQpKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFsbG93IHByZXNlcnZlZCBuZXdsaW5lcyBiZWZvcmUgZG90cyBpbiBnZW5lcmFsXG4gICAgICAgICAgICAgICAgLy8gZm9yY2UgbmV3bGluZXMgb24gZG90cyBhZnRlciBjbG9zZSBwYXJlbiB3aGVuIGJyZWFrX2NoYWluZWQgLSBmb3IgYmFyKCkuYmF6KClcbiAgICAgICAgICAgICAgICBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKGZsYWdzLmxhc3RfdGV4dCA9PT0gJyknICYmIG9wdC5icmVha19jaGFpbmVkX21ldGhvZHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX3Vua25vd24oKSB7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dFt0b2tlbl90ZXh0Lmxlbmd0aCAtIDFdID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAvLyBBZGQgc3VwcG9ydCBmb3IgcmVxdWlyZS5qc1xuICAgICAgICBpZiAodHlwZW9mIGRlZmluZS5hbWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRlZmluZShmdW5jdGlvbihyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgICAgICAgICAgICBleHBvcnRzLmpzX2JlYXV0aWZ5ID0ganNfYmVhdXRpZnk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIGlzIEFNRCAoIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWRqcy9hbWRqcy1hcGkvd2lraS9BTUQjZGVmaW5lYW1kLXByb3BlcnR5LSApXG4gICAgICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBqc19iZWF1dGlmeTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIEFkZCBzdXBwb3J0IGZvciBDb21tb25KUy4gSnVzdCBwdXQgdGhpcyBmaWxlIHNvbWV3aGVyZSBvbiB5b3VyIHJlcXVpcmUucGF0aHNcbiAgICAgICAgLy8gYW5kIHlvdSB3aWxsIGJlIGFibGUgdG8gYHZhciBqc19iZWF1dGlmeSA9IHJlcXVpcmUoXCJiZWF1dGlmeVwiKS5qc19iZWF1dGlmeWAuXG4gICAgICAgIGV4cG9ydHMuanNfYmVhdXRpZnkgPSBqc19iZWF1dGlmeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UncmUgcnVubmluZyBhIHdlYiBwYWdlIGFuZCBkb24ndCBoYXZlIGVpdGhlciBvZiB0aGUgYWJvdmUsIGFkZCBvdXIgb25lIGdsb2JhbFxuICAgICAgICB3aW5kb3cuanNfYmVhdXRpZnkgPSBqc19iZWF1dGlmeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgZXZlbiBoYXZlIHdpbmRvdywgdHJ5IGdsb2JhbC5cbiAgICAgICAgZ2xvYmFsLmpzX2JlYXV0aWZ5ID0ganNfYmVhdXRpZnk7XG4gICAgfVxuXG59KCkpO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSJdfQ==
