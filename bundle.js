(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dogescript = require('dogescript');

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

output.value = dogescript(input.value, true);

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

},{"dogescript":2}],2:[function(require,module,exports){
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

},{"./lib/parser":3,"js-beautify":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./lib/beautify":7,"./lib/beautify-css":5,"./lib/beautify-html":6}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./beautify-css.js":5,"./beautify.js":7}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEJhcnRcXEFwcERhdGFcXFJvYW1pbmdcXG5wbVxcbm9kZV9tb2R1bGVzXFx3YXRjaGlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJEOi9fRWRpdGluZy9naXRodWIvZG9nZS9kb2dlc2NyaXB0LXBhZ2VzL2luZGV4LmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9pbmRleC5qcyIsIkQ6L19FZGl0aW5nL2dpdGh1Yi9kb2dlL2RvZ2VzY3JpcHQtcGFnZXMvbm9kZV9tb2R1bGVzL2RvZ2VzY3JpcHQvbGliL3BhcnNlci5qcyIsIkQ6L19FZGl0aW5nL2dpdGh1Yi9kb2dlL2RvZ2VzY3JpcHQtcGFnZXMvbm9kZV9tb2R1bGVzL2RvZ2VzY3JpcHQvbm9kZV9tb2R1bGVzL2pzLWJlYXV0aWZ5L2pzL2luZGV4LmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9ub2RlX21vZHVsZXMvanMtYmVhdXRpZnkvanMvbGliL2JlYXV0aWZ5LWNzcy5qcyIsIkQ6L19FZGl0aW5nL2dpdGh1Yi9kb2dlL2RvZ2VzY3JpcHQtcGFnZXMvbm9kZV9tb2R1bGVzL2RvZ2VzY3JpcHQvbm9kZV9tb2R1bGVzL2pzLWJlYXV0aWZ5L2pzL2xpYi9iZWF1dGlmeS1odG1sLmpzIiwiRDovX0VkaXRpbmcvZ2l0aHViL2RvZ2UvZG9nZXNjcmlwdC1wYWdlcy9ub2RlX21vZHVsZXMvZG9nZXNjcmlwdC9ub2RlX21vZHVsZXMvanMtYmVhdXRpZnkvanMvbGliL2JlYXV0aWZ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZG9nZXNjcmlwdCA9IHJlcXVpcmUoJ2RvZ2VzY3JpcHQnKTtcclxuXHJcbnZhciBpbnB1dCAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG9nZXNjcmlwdCcpO1xyXG52YXIgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2phdmFzY3JpcHQnKTtcclxuXHJcbnZhciBlZGl0b3IgPSBuZXcgQmVoYXZlKHtcclxuICAgIHRleHRhcmVhOiBpbnB1dCxcclxuICAgIHJlcGxhY2VUYWI6IHRydWUsXHJcbiAgICBzb2Z0VGFiczogdHJ1ZSxcclxuICAgIHRhYlNpemU6IDQsXHJcbiAgICBhdXRvT3BlbjogdHJ1ZSxcclxuICAgIG92ZXJ3cml0ZTogdHJ1ZSxcclxuICAgIGF1dG9TdHJpcDogdHJ1ZSxcclxuICAgIGF1dG9JbmRlbnQ6IHRydWUsXHJcbiAgICBmZW5jZTogZmFsc2VcclxufSk7XHJcblxyXG5CZWhhdmVIb29rcy5hZGQoJ2tleXVwJywgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBvdXRwdXQudmFsdWUgPSBkb2dlc2NyaXB0KGlucHV0LnZhbHVlLCB0cnVlKTtcclxufSk7XHJcblxyXG5vdXRwdXQudmFsdWUgPSBkb2dlc2NyaXB0KGlucHV0LnZhbHVlLCB0cnVlKTtcclxuXHJcbmZ1bmN0aW9uIGZpeFNpemUoKSB7XHJcbiAgICB2YXIgdG9wID0gaW5wdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XHJcbiAgICB2YXIgaGVpZ2h0ID0gKHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIDEwKSArICdweCc7XHJcbiAgICBpbnB1dC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICBvdXRwdXQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0OyBcclxufVxyXG5cclxuZml4U2l6ZSgpO1xyXG5cclxudmFyIGRlYm91bmNlID0gMDtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAoZGVib3VuY2UpIHtcclxuICAgICAgICBkZWJvdW5jZSA9IGNsZWFyVGltZW91dChkZWJvdW5jZSk7XHJcbiAgICB9XHJcbiAgICBkZWJvdW5jZSA9IHNldFRpbWVvdXQoZml4U2l6ZSwgNTApO1xyXG59KTtcclxuIiwiLyoqXG4gKiBkb2dlc2NyaXB0IC0gd293IHNvIHN5bnRheCBzdWNoIGxhbmd1YWdlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzIFphY2ggQnJ1Z2dlbWFuXG4gKlxuICogZG9nZXNjcmlwdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKlxuICogQHBhY2thZ2UgZG9nZXNjcmlwdFxuICogQGF1dGhvciAgWmFjaCBCcnVnZ2VtYW4gPHRhbGt0b0B6YWNoYnJ1Z2dlbWFuLm1lPlxuICovXG5cbnZhciBiZWF1dGlmeSA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuanNfYmVhdXRpZnk7XG5cbnZhciBwYXJzZXIgICA9IHJlcXVpcmUoJy4vbGliL3BhcnNlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmaWxlLCBiZWF1dHksIGRvZ2VNb2RlKSB7XG4gICAgaWYgKGRvZ2VNb2RlKSB2YXIgbGluZXMgPSBmaWxlLnNwbGl0KC8gezMsfXxcXHI/XFxuLyk7XG4gICAgZWxzZSB2YXIgbGluZXMgPSBmaWxlLnNwbGl0KC9cXHI/XFxuLyk7XG4gICAgdmFyIHNjcmlwdCA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzY3JpcHQgKz0gcGFyc2VyKGxpbmVzW2ldKTtcbiAgICB9XG5cbiAgICBpZiAoYmVhdXR5KSByZXR1cm4gYmVhdXRpZnkoc2NyaXB0KVxuICAgIGVsc2UgcmV0dXJuIHNjcmlwdDtcbn1cbiIsInZhciBtdWx0aUNvbW1lbnQgPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZSAobGluZSkge1xuICAgIC8vcmVwbGFjZSBkb2dldW1lbnQgYW5kIHdpbmRvZ2UgYWx3YXlzXG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZG9nZXVtZW50L2csICdkb2N1bWVudCcpLnJlcGxhY2UoL3dpbmRvZ2UvZywgJ3dpbmRvdycpO1xuXG4gICAgdmFyIGtleXMgPSBsaW5lLm1hdGNoKC8nW14nXSsnfFxcUysvZyk7XG4gICAgdmFyIHZhbGlkID0gWydzdWNoJywgJ3dvdycsICd3b3cmJywgJ3BseicsICcucGx6JywgJ2Rvc2UnLCAndmVyeScsICdzaGgnLCAncXVpZXQnLCAnbG91ZCcsICdybHknLCAnYnV0JywgJ21hbnknLCAnbXVjaCcsICdzbycsICd0cmFpbmVkJywgJ21heWJlJ107XG4gICAgdmFyIHZhbGlkS2V5cyA9IHsnaXMnOiAnID09PSAnLCAnbm90JzogJyAhPT0gJywgJ2FuZCc6ICAnICYmICcsICdvcic6ICAnIHx8ICcsICduZXh0JzogICc7ICcsICdhcyc6ICAnID0gJywgJ21vcmUnOiAgJyArPSAnLCAnbGVzcyc6ICAnIC09ICcsICdsb3RzJzogJyAqPSAnLCAnZmV3JzogJyAvPSAnLCAndmVyeSc6ICcgdmFyICcsICdzbWFsbGVyJzogJyA8ICcsICdiaWdnZXInOiAnID4gJywgJ3NtYWxsZXJpc2gnOiAnIDw9ICcsICdiaWdnZXJpc2gnOiAnID49ICcsICdub3RybHknOiAnICEgJ307XG4gICAgdmFyIHN0YXRlbWVudCA9ICcnO1xuXG4gICAgaWYgKGtleXMgPT09IG51bGwpIHJldHVybiBsaW5lICsgJ1xcbic7XG5cbiAgICAvLyBub3QgZG9nZXNjcmlwdCwgc3VjaCBqYXZhc2NyaXB0XG4gICAgaWYgKHZhbGlkLmluZGV4T2Yoa2V5c1swXSkgPT09IC0xICYmIGtleXNbMV0gIT09ICdpcycgJiYga2V5c1sxXSAhPT0gJ2Rvc2UnIHx8IG11bHRpQ29tbWVudCAmJiBrZXlzWzBdICE9PSAnbG91ZCcpIHJldHVybiBsaW5lICsgJ1xcbic7XG5cbiAgICAvLyB0cmFpbmVkIHVzZSBzdHJpY3RcbiAgICBpZiAoa2V5c1swXSA9PT0gJ3RyYWluZWQnKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAnXCJ1c2Ugc3RyaWN0XCI7XFxuJztcbiAgICB9XG5cbiAgICAvLyBzdWNoIGZ1bmN0aW9uXG4gICAgaWYgKGtleXNbMF0gPT09ICdzdWNoJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ2Z1bmN0aW9uICcgKyBrZXlzWzFdO1xuICAgICAgICBpZiAoa2V5c1syXSA9PT0gJ211Y2gnKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyAoJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAzOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSBrZXlzLmxlbmd0aCAtIDEpIHN0YXRlbWVudCArPSAnLCAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICcpIHsgXFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnICgpIHsgXFxuJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHdvdyBlbmQgZnVuY3Rpb24gYW5kIHJldHVyblxuICAgIGlmIChrZXlzWzBdID09PSAnd293JyB8fCBrZXlzWzBdID09PSAnd293JicpIHtcbiAgICAgICBpZiAodHlwZW9mIGtleXNbMV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ3JldHVybic7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyAnICsga2V5c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnO1xcbic7XG4gICAgICAgICAgICBpZiAoa2V5c1swXSA9PT0gJ3dvdyYnKSBzdGF0ZW1lbnQgKz0gJ30pIFxcbic7XG4gICAgICAgICAgICBlbHNlIHN0YXRlbWVudCArPSAnfSBcXG4nO1xuICAgICAgICB9IGVsc2UgaWYgKGtleXNbMF0gPT09ICd3b3cmJykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICd9KSBcXG4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICd9IFxcbic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwbHogZXhlY3V0ZSBmdW5jdGlvblxuICAgIGlmIChrZXlzWzBdID09PSAncGx6JyB8fCBrZXlzWzBdID09PSAnLnBseicgfHwga2V5c1swXSA9PT0gJ2Rvc2UnIHx8IGtleXNbMV0gPT09ICdkb3NlJykge1xuICAgICAgICBpZiAoa2V5c1sxXSA9PT0gJ2Rvc2UnKSBzdGF0ZW1lbnQgKz0ga2V5cy5zaGlmdCgpO1xuICAgICAgICBpZiAoa2V5c1swXS5jaGFyQXQoMCkgPT09ICcuJyB8fCBrZXlzWzBdID09PSAnZG9zZScpIHN0YXRlbWVudCArPSAnLic7XG4gICAgICAgIGlmIChrZXlzWzFdID09PSAnY29uc29sZS5sb2dlJyB8fCBrZXlzWzFdID09PSAnbG9nZScpIGtleXNbMV0gPSBrZXlzWzFdLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgaWYgKGtleXNbMl0gPT09ICd3aXRoJykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbMV0gKyAnKCc7XG4gICAgICAgICAgICBkdXBlID0ga2V5cy5zbGljZSgwKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAzOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChrZXlzW2ldID09PSAnLCcgfHwga2V5c1tpXSA9PT0gJyYnKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJ211Y2gnKSB7IC8vIGxhbWJkYSBmdW5jdGlvbnMgLSB0aGFua3MgQDAwRGF2byFcblxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ2Z1bmN0aW9uICgnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tpICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IGtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiAhPT0ga2V5cy5sZW5ndGggLSAxKSBzdGF0ZW1lbnQgKz0gJywgJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSAnKSB7XFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJykge1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrZXlzW2ldLnN1YnN0cigtMSkgPT09ICcmJyB8fCBrZXlzW2ldLnN1YnN0cigtMSkgPT09ICcsJykga2V5c1tpXSA9IGtleXNbaV0uc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChrZXlzW2ldLnN1YnN0cigtMSkgPT09ICc6Jykgc3RhdGVtZW50ICs9ICcgJztcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0ga2V5cy5sZW5ndGggLSAxICYmIGtleXNbaV0uc3Vic3RyKC0xKSAhPT0gJzonKSBzdGF0ZW1lbnQgKz0gJywgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGF0ZW1lbnQuc3Vic3RyKC0yKSA9PT0gJywgJykgc3RhdGVtZW50ID0gc3RhdGVtZW50LnNsaWNlKDAsIC0yKTtcbiAgICAgICAgICAgIGlmIChzdGF0ZW1lbnQuc3Vic3RyKC0zKSA9PT0gJywgXScgfHwgc3RhdGVtZW50LnN1YnN0cigtMykgPT09ICcsIH0nICkgc3RhdGVtZW50ID0gc3RhdGVtZW50LnJlcGxhY2Uoc3RhdGVtZW50LnN1YnN0cigtMyksIHN0YXRlbWVudC5zdWJzdHIoLTEpKTtcbiAgICAgICAgICAgIGlmIChkdXBlW2tleXMubGVuZ3RoIC0gMV0uc2xpY2UoLTEpID09PSAnJicpIHN0YXRlbWVudCArPSAnKVxcbic7XG4gICAgICAgICAgICBlbHNlIHN0YXRlbWVudCArPSAnKTtcXG4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGtleXNbMV0uc2xpY2UoLTEpID09PSAnJicpIHtcbiAgICAgICAgICAgICAgICBrZXlzWzFdID0ga2V5c1sxXS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbMV0gKyAnKClcXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1sxXSArICcoKTtcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmVyeSBuZXcgdmFyaWFibGVcbiAgICBpZiAoa2V5c1swXSA9PT0gJ3ZlcnknKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAndmFyICcgKyBrZXlzWzFdICsgJyA9ICc7XG4gICAgICAgIGlmIChrZXlzWzNdID09PSAnbmV3Jykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICduZXcgJyArIGtleXNbNF0gKyAnKCc7XG4gICAgICAgICAgICBpZiAoa2V5c1s1XSA9PT0gJ3dpdGgnKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDY7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXlzW2ldID09PSAnLCcpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXS5zdWJzdHIoLTEpID09PSAnLCcgJiYga2V5c1tpXS5jaGFyQXQoa2V5c1tpXS5sZW5ndGggLSAyKSAhPT0gJ30nKSBrZXlzW2ldID0ga2V5c1tpXS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPT0ga2V5cy5sZW5ndGggLSAxKSBzdGF0ZW1lbnQgKz0gJywgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJyk7XFxuJztcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleXNbM10gPT09ICdtdWNoJykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICdmdW5jdGlvbiAnO1xuICAgICAgICAgICAgaWYgKGtleXNbNF0pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0gJygnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSA0OyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IGtleXMubGVuZ3RoIC0gMSkgc3RhdGVtZW50ICs9ICcsICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSAnKSB7IFxcbic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCArPSAnICgpIHsgXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgdmFyIHJlY3Vyc2UgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAzOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChrZXlzW2ldLnN1YnN0cigtMSkgPT09ICcsJyAmJiBrZXlzW2ldLmNoYXJBdChrZXlzW2ldLmxlbmd0aCAtIDIpICE9PSAnfScpIGtleXNbaV0gPSBrZXlzW2ldLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICByZWN1cnNlICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsaWQuaW5kZXhPZihrZXlzWzNdKSAhPT0gLTEgfHwgKGtleXNbNF0gPT09ICdpcycgfHwga2V5c1s0XSA9PT0gJ2Rvc2UnKSkgc3RhdGVtZW50ICs9IHBhcnNlKHJlY3Vyc2UpO1xuICAgICAgICAgICAgZWxzZSBzdGF0ZW1lbnQgKz0gcmVjdXJzZSArICc7XFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzWzNdICsgJztcXG4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaXMgZXhpc3RpbmcgdmFyaWFibGVcbiAgICBpZiAoa2V5c1sxXSA9PT0gJ2lzJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1swXSArICcgPSAnO1xuICAgICAgICBpZiAoa2V5c1syXSA9PT0gJ25ldycpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnbmV3ICcgKyBrZXlzWzNdICsgJygnO1xuICAgICAgICAgICAgaWYgKGtleXNbNF0gPT09ICd3aXRoJykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSA1OyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJywnKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBrZXlzLmxlbmd0aCAtIDEpIHN0YXRlbWVudCArPSAnLCAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAnKTtcXG4nO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICB2YXIgcmVjdXJzZSA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDI7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVjdXJzZSArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGVtZW50ICs9IHBhcnNlKHJlY3Vyc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbMl0gKyAnO1xcbic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzaGggY29tbWVudFxuICAgIGlmIChrZXlzWzBdID09PSAnc2hoJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJy8vICc7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVtZW50ICs9ICdcXG4nO1xuICAgIH1cblxuICAgIC8vIHF1aWV0IHN0YXJ0IG11bHRpLWxpbmUgY29tbWVudFxuICAgIGlmIChrZXlzWzBdID09PSAncXVpZXQnKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAnLyogJztcbiAgICAgICAgbXVsdGlDb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZW1lbnQgKz0gJ1xcbic7XG4gICAgfVxuXG4gICAgLy8gbG91ZCBlbmQgbXVsdGktbGluZSBjb21tZW50XG4gICAgaWYgKGtleXNbMF0gPT09ICdsb3VkJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJyovICc7XG4gICAgICAgIG11bHRpQ29tbWVudCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSBrZXlzW2ldICsgJyAnO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlbWVudCArPSAnXFxuJztcbiAgICB9XG5cbiAgICB2YXIga2V5UGFyc2VyID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAodmFsaWRLZXlzW2tleV0pIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSB2YWxpZEtleXNba2V5XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmx5IGlmXG4gICAgaWYgKGtleXNbMF0gPT09ICdybHknKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAnaWYgKCc7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhcnNlZCA9IGtleVBhcnNlcihrZXlzW2ldKTtcbiAgICAgICAgICAgIGlmIChwYXJzZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVtZW50ICs9ICcpIHtcXG4nO1xuICAgIH1cblxuICAgIC8vIGJ1dCBlbHNlXG4gICAgaWYgKGtleXNbMF0gPT09ICdidXQnKSB7XG4gICAgICAgIGlmIChrZXlzWzFdID09PSAncmx5Jykge1xuICAgICAgICAgIHN0YXRlbWVudCArPSAnfSBlbHNlIGlmICgnO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgcGFyc2VkID0ga2V5UGFyc2VyKGtleXNbaV0pO1xuICAgICAgICAgICAgICBpZiAocGFyc2VkKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXRlbWVudCArPSAnKSB7XFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZW1lbnQgKz0gJ30gZWxzZSB7XFxuJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIG1hbnkgd2hpbGVcbiAgICBpZiAoa2V5c1swXSA9PT0gJ21hbnknKSB7XG4gICAgICAgIHN0YXRlbWVudCArPSAnd2hpbGUgKCc7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhcnNlZCA9IGtleVBhcnNlcihrZXlzW2ldKTtcbiAgICAgICAgICAgIGlmIChwYXJzZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9IGtleXNbaV0gKyAnICc7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVtZW50ICs9ICcpIHtcXG4nO1xuICAgIH1cblxuICAgIC8vIG11Y2ggZm9yXG4gICAgaWYgKGtleXNbMF0gPT09ICdtdWNoJykge1xuICAgICAgICBzdGF0ZW1lbnQgKz0gJ2ZvciAoJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VkID0ga2V5UGFyc2VyKGtleXNbaV0pO1xuICAgICAgICAgICAgaWYgKHBhcnNlZCkgY29udGludWU7XG4gICAgICAgICAgICBzdGF0ZW1lbnQgKz0ga2V5c1tpXSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZW1lbnQgKz0gJykge1xcbic7XG4gICAgfVxuXG4gICAgLy8gc28gcmVxdWlyZSAodGhhbmtzIEBtYXhvZ2RlbiEpXG4gICAgaWYgKGtleXNbMF0gPT09ICdzbycpIHtcbiAgICAgICAgaWYgKGtleXNbMl0gPT09ICdhcycpIHtcbiAgICAgICAgICAgIHN0YXRlbWVudCArPSAndmFyICcgKyBrZXlzWzNdICsgJyA9IHJlcXVpcmUoXFwnJyArIGtleXNbMV0gKyAnXFwnKTtcXG4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGVtZW50ICs9ICd2YXIgJyArIGtleXNbMV0gKyAnID0gcmVxdWlyZShcXCcnICsga2V5c1sxXSArICdcXCcpO1xcbic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtYXliZSBib29sZWFuIG9wZXJhdG9yXG4gICAgaWYgKGtleXNbMF0gPT09ICdtYXliZScpIHtcbiAgICAgICAgc3RhdGVtZW50ICs9ICcoISErTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSknO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGVtZW50O1xufVxuIiwiLyoqXG5UaGUgZm9sbG93aW5nIGJhdGNoZXMgYXJlIGVxdWl2YWxlbnQ6XG5cbnZhciBiZWF1dGlmeV9qcyA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5Jyk7XG52YXIgYmVhdXRpZnlfanMgPSByZXF1aXJlKCdqcy1iZWF1dGlmeScpLmpzO1xudmFyIGJlYXV0aWZ5X2pzID0gcmVxdWlyZSgnanMtYmVhdXRpZnknKS5qc19iZWF1dGlmeTtcblxudmFyIGJlYXV0aWZ5X2NzcyA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuY3NzO1xudmFyIGJlYXV0aWZ5X2NzcyA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuY3NzX2JlYXV0aWZ5O1xuXG52YXIgYmVhdXRpZnlfaHRtbCA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5JykuaHRtbDtcbnZhciBiZWF1dGlmeV9odG1sID0gcmVxdWlyZSgnanMtYmVhdXRpZnknKS5odG1sX2JlYXV0aWZ5O1xuXG5BbGwgbWV0aG9kcyByZXR1cm5lZCBhY2NlcHQgdHdvIGFyZ3VtZW50cywgdGhlIHNvdXJjZSBzdHJpbmcgYW5kIGFuIG9wdGlvbnMgb2JqZWN0LlxuKiovXG52YXIganNfYmVhdXRpZnkgPSByZXF1aXJlKCcuL2xpYi9iZWF1dGlmeScpLmpzX2JlYXV0aWZ5O1xudmFyIGNzc19iZWF1dGlmeSA9IHJlcXVpcmUoJy4vbGliL2JlYXV0aWZ5LWNzcycpLmNzc19iZWF1dGlmeTtcbnZhciBodG1sX2JlYXV0aWZ5ID0gcmVxdWlyZSgnLi9saWIvYmVhdXRpZnktaHRtbCcpLmh0bWxfYmVhdXRpZnk7XG5cbi8vIHRoZSBkZWZhdWx0IGlzIGpzXG52YXIgYmVhdXRpZnkgPSBmdW5jdGlvbiAoc3JjLCBjb25maWcpIHtcbiAgICByZXR1cm4ganNfYmVhdXRpZnkoc3JjLCBjb25maWcpO1xufTtcblxuLy8gc2hvcnQgYWxpYXNlc1xuYmVhdXRpZnkuanMgICA9IGpzX2JlYXV0aWZ5O1xuYmVhdXRpZnkuY3NzICA9IGNzc19iZWF1dGlmeTtcbmJlYXV0aWZ5Lmh0bWwgPSBodG1sX2JlYXV0aWZ5O1xuXG4vLyBsZWdhY3kgYWxpYXNlc1xuYmVhdXRpZnkuanNfYmVhdXRpZnkgICA9IGpzX2JlYXV0aWZ5O1xuYmVhdXRpZnkuY3NzX2JlYXV0aWZ5ICA9IGNzc19iZWF1dGlmeTtcbmJlYXV0aWZ5Lmh0bWxfYmVhdXRpZnkgPSBodG1sX2JlYXV0aWZ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlYXV0aWZ5O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLypqc2hpbnQgY3VybHk6dHJ1ZSwgZXFlcWVxOnRydWUsIGxheGJyZWFrOnRydWUsIG5vZW1wdHk6ZmFsc2UgKi9cbi8qXG5cbiAgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiAgQ29weXJpZ2h0IChjKSAyMDA3LTIwMTMgRWluYXIgTGllbG1hbmlzIGFuZCBjb250cmlidXRvcnMuXG5cbiAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICBTT0ZUV0FSRS5cblxuXG4gQ1NTIEJlYXV0aWZpZXJcbi0tLS0tLS0tLS0tLS0tLVxuXG4gICAgV3JpdHRlbiBieSBIYXJ1dHl1biBBbWlyamFueWFuLCAoYW1pcmphbnlhbkBnbWFpbC5jb20pXG5cbiAgICBCYXNlZCBvbiBjb2RlIGluaXRpYWxseSBkZXZlbG9wZWQgYnk6IEVpbmFyIExpZWxtYW5pcywgPGVsZnpAbGFhY3oubHY+XG4gICAgICAgIGh0dHA6Ly9qc2JlYXV0aWZpZXIub3JnL1xuXG4gICAgVXNhZ2U6XG4gICAgICAgIGNzc19iZWF1dGlmeShzb3VyY2VfdGV4dCk7XG4gICAgICAgIGNzc19iZWF1dGlmeShzb3VyY2VfdGV4dCwgb3B0aW9ucyk7XG5cbiAgICBUaGUgb3B0aW9ucyBhcmUgKGRlZmF1bHQgaW4gYnJhY2tldHMpOlxuICAgICAgICBpbmRlbnRfc2l6ZSAoNCkgICAgICAgICAgICAgICAgICAg4oCUIGluZGVudGF0aW9uIHNpemUsXG4gICAgICAgIGluZGVudF9jaGFyIChzcGFjZSkgICAgICAgICAgICAgICDigJQgY2hhcmFjdGVyIHRvIGluZGVudCB3aXRoLFxuICAgICAgICBzZWxlY3Rvcl9zZXBhcmF0b3JfbmV3bGluZSAodHJ1ZSkgLSBzZXBhcmF0ZSBzZWxlY3RvcnMgd2l0aCBuZXdsaW5lIG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCAoZS5nLiBcImEsXFxuYnJcIiBvciBcImEsIGJyXCIpXG4gICAgICAgIGVuZF93aXRoX25ld2xpbmUgKGZhbHNlKSAgICAgICAgICAtIGVuZCB3aXRoIGEgbmV3bGluZVxuXG4gICAgZS5nXG5cbiAgICBjc3NfYmVhdXRpZnkoY3NzX3NvdXJjZV90ZXh0LCB7XG4gICAgICAnaW5kZW50X3NpemUnOiAxLFxuICAgICAgJ2luZGVudF9jaGFyJzogJ1xcdCcsXG4gICAgICAnc2VsZWN0b3Jfc2VwYXJhdG9yJzogJyAnLFxuICAgICAgJ2VuZF93aXRoX25ld2xpbmUnOiBmYWxzZSxcbiAgICB9KTtcbiovXG5cbi8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCN0b2tlbml6YXRpb25cbi8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtc3ludGF4L1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGNzc19iZWF1dGlmeShzb3VyY2VfdGV4dCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIGluZGVudFNpemUgPSBvcHRpb25zLmluZGVudF9zaXplIHx8IDQ7XG4gICAgICAgIHZhciBpbmRlbnRDaGFyYWN0ZXIgPSBvcHRpb25zLmluZGVudF9jaGFyIHx8ICcgJztcbiAgICAgICAgdmFyIHNlbGVjdG9yU2VwYXJhdG9yTmV3bGluZSA9IHRydWU7XG4gICAgICAgIGlmIChvcHRpb25zLnNlbGVjdG9yX3NlcGFyYXRvcl9uZXdsaW5lICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHNlbGVjdG9yU2VwYXJhdG9yTmV3bGluZSA9IG9wdGlvbnMuc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmU7XG4gICAgICAgIHZhciBlbmRXaXRoTmV3bGluZSA9IG9wdGlvbnMuZW5kX3dpdGhfbmV3bGluZSB8fCBmYWxzZTtcblxuICAgICAgICAvLyBjb21wYXRpYmlsaXR5XG4gICAgICAgIGlmICh0eXBlb2YgaW5kZW50U2l6ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaW5kZW50U2l6ZSA9IHBhcnNlSW50KGluZGVudFNpemUsIDEwKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gdG9rZW5pemVyXG4gICAgICAgIHZhciB3aGl0ZVJlID0gL15cXHMrJC87XG4gICAgICAgIHZhciB3b3JkUmUgPSAvW1xcdyRcXC1fXS87XG5cbiAgICAgICAgdmFyIHBvcyA9IC0xLFxuICAgICAgICAgICAgY2g7XG5cbiAgICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlX3RleHQuY2hhckF0KCsrcG9zKTtcbiAgICAgICAgICAgIHJldHVybiBjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBlZWsoKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlX3RleHQuY2hhckF0KHBvcyArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWF0U3RyaW5nKGVuZENoYXIpIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHBvcztcbiAgICAgICAgICAgIHdoaWxlIChuZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09IFwiXFxcXFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IGVuZENoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc291cmNlX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBwb3MgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGVhdFdoaXRlc3BhY2UoKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICB3aGlsZSAod2hpdGVSZS50ZXN0KHBlZWsoKSkpIHtcbiAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwb3MgIT09IHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2tpcFdoaXRlc3BhY2UoKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICBkbyB7fSB3aGlsZSAod2hpdGVSZS50ZXN0KG5leHQoKSkpO1xuICAgICAgICAgICAgcmV0dXJuIHBvcyAhPT0gc3RhcnQgKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWF0Q29tbWVudCgpIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHBvcztcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09IFwiKlwiICYmIHBlZWsoKSA9PT0gXCIvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZV90ZXh0LnN1YnN0cmluZyhzdGFydCwgcG9zICsgMSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGxvb2tCYWNrKHN0cikge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZV90ZXh0LnN1YnN0cmluZyhwb3MgLSBzdHIubGVuZ3RoLCBwb3MpLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgICAgICAgc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJpbnRlclxuICAgICAgICB2YXIgaW5kZW50U3RyaW5nID0gc291cmNlX3RleHQubWF0Y2goL15bXFxyXFxuXSpbXFx0IF0qLylbMF07XG4gICAgICAgIHZhciBzaW5nbGVJbmRlbnQgPSBBcnJheShpbmRlbnRTaXplICsgMSkuam9pbihpbmRlbnRDaGFyYWN0ZXIpO1xuICAgICAgICB2YXIgaW5kZW50TGV2ZWwgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluZGVudCgpIHtcbiAgICAgICAgICAgIGluZGVudExldmVsKys7XG4gICAgICAgICAgICBpbmRlbnRTdHJpbmcgKz0gc2luZ2xlSW5kZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3V0ZGVudCgpIHtcbiAgICAgICAgICAgIGluZGVudExldmVsLS07XG4gICAgICAgICAgICBpbmRlbnRTdHJpbmcgPSBpbmRlbnRTdHJpbmcuc2xpY2UoMCwgLWluZGVudFNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByaW50ID0ge307XG4gICAgICAgIHByaW50W1wie1wiXSA9IGZ1bmN0aW9uIChjaCkge1xuICAgICAgICAgICAgcHJpbnQuc2luZ2xlU3BhY2UoKTtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgIHByaW50Lm5ld0xpbmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJpbnRbXCJ9XCJdID0gZnVuY3Rpb24gKGNoKSB7XG4gICAgICAgICAgICBwcmludC5uZXdMaW5lKCk7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChjaCk7XG4gICAgICAgICAgICBwcmludC5uZXdMaW5lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJpbnQuX2xhc3RDaGFyV2hpdGVzcGFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aGl0ZVJlLnRlc3Qob3V0cHV0W291dHB1dC5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcmludC5uZXdMaW5lID0gZnVuY3Rpb24gKGtlZXBXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgICBpZiAoIWtlZXBXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHByaW50Ll9sYXN0Q2hhcldoaXRlc3BhY2UoKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKCdcXG4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRlbnRTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChpbmRlbnRTdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBwcmludC5zaW5nbGVTcGFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoICYmICFwcmludC5fbGFzdENoYXJXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaCgnICcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIGlmIChpbmRlbnRTdHJpbmcpIHtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGluZGVudFN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgICAgLypfX19fX19fX19fX19fX19fX19fX18tLS0tLS0tLS0tLS0tLS0tLS0tLV9fX19fX19fX19fX19fX19fX19fXyovXG5cbiAgICAgICAgdmFyIGluc2lkZVJ1bGUgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBpc0FmdGVyU3BhY2UgPSBza2lwV2hpdGVzcGFjZSgpO1xuXG4gICAgICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnLycgJiYgcGVlaygpID09PSAnKicpIHsgLy8gY29tbWVudFxuICAgICAgICAgICAgICAgIHByaW50Lm5ld0xpbmUoKTtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChlYXRDb21tZW50KCksIFwiXFxuXCIsIGluZGVudFN0cmluZyk7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlciA9IGxvb2tCYWNrKFwiXCIpXG4gICAgICAgICAgICAgICAgaWYgKGhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICBwcmludC5uZXdMaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgZWF0V2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgIGlmIChwZWVrKCkgPT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goXCIge31cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50W1wie1wiXShjaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgb3V0ZGVudCgpO1xuICAgICAgICAgICAgICAgIHByaW50W1wifVwiXShjaCk7XG4gICAgICAgICAgICAgICAgaW5zaWRlUnVsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICBlYXRXaGl0ZXNwYWNlKCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gsIFwiIFwiKTtcbiAgICAgICAgICAgICAgICBpbnNpZGVSdWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdcIicgfHwgY2ggPT09ICdcXCcnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goZWF0U3RyaW5nKGNoKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChjaCwgJ1xcbicsIGluZGVudFN0cmluZyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnKCcpIHsgLy8gbWF5IGJlIGEgdXJsXG4gICAgICAgICAgICAgICAgaWYgKGxvb2tCYWNrKFwidXJsXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGNoKTtcbiAgICAgICAgICAgICAgICAgICAgZWF0V2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ggIT09ICcpJyAmJiBjaCAhPT0gJ1wiJyAmJiBjaCAhPT0gJ1xcJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChlYXRTdHJpbmcoJyknKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQWZ0ZXJTcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnQuc2luZ2xlU3BhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChjaCk7XG4gICAgICAgICAgICAgICAgICAgIGVhdFdoaXRlc3BhY2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnKScpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChjaCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICBlYXRXaGl0ZXNwYWNlKCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgICAgIGlmICghaW5zaWRlUnVsZSAmJiBzZWxlY3RvclNlcGFyYXRvck5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnQubmV3TGluZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50LnNpbmdsZVNwYWNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJ10nKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJ1snIHx8IGNoID09PSAnPScpIHsgLy8gbm8gd2hpdGVzcGFjZSBiZWZvcmUgb3IgYWZ0ZXJcbiAgICAgICAgICAgICAgICBlYXRXaGl0ZXNwYWNlKCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBZnRlclNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50LnNpbmdsZVNwYWNlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goY2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgc3dlZXRDb2RlID0gb3V0cHV0LmpvaW4oJycpLnJlcGxhY2UoL1tcXG4gXSskLywgJycpO1xuXG4gICAgICAgIC8vIGVzdGFibGlzaCBlbmRfd2l0aF9uZXdsaW5lXG4gICAgICAgIHZhciBzaG91bGQgPSBlbmRXaXRoTmV3bGluZTtcbiAgICAgICAgdmFyIGFjdHVhbGx5ID0gL1xcbiQvLnRlc3Qoc3dlZXRDb2RlKVxuICAgICAgICBpZiAoc2hvdWxkICYmICFhY3R1YWxseSlcbiAgICAgICAgICAgIHN3ZWV0Q29kZSArPSBcIlxcblwiO1xuICAgICAgICBlbHNlIGlmICghc2hvdWxkICYmIGFjdHVhbGx5KVxuICAgICAgICAgICAgc3dlZXRDb2RlID0gc3dlZXRDb2RlLnNsaWNlKDAsIC0xKTtcblxuICAgICAgICByZXR1cm4gc3dlZXRDb2RlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8gQWRkIHN1cHBvcnQgZm9yIHJlcXVpcmUuanNcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgICAgICAgIGV4cG9ydHMuY3NzX2JlYXV0aWZ5ID0gY3NzX2JlYXV0aWZ5O1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIEFkZCBzdXBwb3J0IGZvciBDb21tb25KUy4gSnVzdCBwdXQgdGhpcyBmaWxlIHNvbWV3aGVyZSBvbiB5b3VyIHJlcXVpcmUucGF0aHNcbiAgICAgICAgLy8gYW5kIHlvdSB3aWxsIGJlIGFibGUgdG8gYHZhciBodG1sX2JlYXV0aWZ5ID0gcmVxdWlyZShcImJlYXV0aWZ5XCIpLmh0bWxfYmVhdXRpZnlgLlxuICAgICAgICBleHBvcnRzLmNzc19iZWF1dGlmeSA9IGNzc19iZWF1dGlmeTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UncmUgcnVubmluZyBhIHdlYiBwYWdlIGFuZCBkb24ndCBoYXZlIGVpdGhlciBvZiB0aGUgYWJvdmUsIGFkZCBvdXIgb25lIGdsb2JhbFxuICAgICAgICB3aW5kb3cuY3NzX2JlYXV0aWZ5ID0gY3NzX2JlYXV0aWZ5O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBJZiB3ZSBkb24ndCBldmVuIGhhdmUgd2luZG93LCB0cnkgZ2xvYmFsLlxuICAgICAgICBnbG9iYWwuY3NzX2JlYXV0aWZ5ID0gY3NzX2JlYXV0aWZ5O1xuICAgIH1cblxufSgpKTtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLypqc2hpbnQgY3VybHk6dHJ1ZSwgZXFlcWVxOnRydWUsIGxheGJyZWFrOnRydWUsIG5vZW1wdHk6ZmFsc2UgKi9cbi8qXG5cbiAgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiAgQ29weXJpZ2h0IChjKSAyMDA3LTIwMTMgRWluYXIgTGllbG1hbmlzIGFuZCBjb250cmlidXRvcnMuXG5cbiAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbiAgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSU1xuICBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbiAgQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU5cbiAgQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICBTT0ZUV0FSRS5cblxuXG4gU3R5bGUgSFRNTFxuLS0tLS0tLS0tLS0tLS0tXG5cbiAgV3JpdHRlbiBieSBOb2NodW0gU29zc29ua28sIChuc29zc29ua29AaG90bWFpbC5jb20pXG5cbiAgQmFzZWQgb24gY29kZSBpbml0aWFsbHkgZGV2ZWxvcGVkIGJ5OiBFaW5hciBMaWVsbWFuaXMsIDxlbGZ6QGxhYWN6Lmx2PlxuICAgIGh0dHA6Ly9qc2JlYXV0aWZpZXIub3JnL1xuXG4gIFVzYWdlOlxuICAgIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UpO1xuXG4gICAgc3R5bGVfaHRtbChodG1sX3NvdXJjZSwgb3B0aW9ucyk7XG5cbiAgVGhlIG9wdGlvbnMgYXJlOlxuICAgIGluZGVudF9pbm5lcl9odG1sIChkZWZhdWx0IGZhbHNlKSAg4oCUIGluZGVudCA8aGVhZD4gYW5kIDxib2R5PiBzZWN0aW9ucyxcbiAgICBpbmRlbnRfc2l6ZSAoZGVmYXVsdCA0KSAgICAgICAgICDigJQgaW5kZW50YXRpb24gc2l6ZSxcbiAgICBpbmRlbnRfY2hhciAoZGVmYXVsdCBzcGFjZSkgICAgICDigJQgY2hhcmFjdGVyIHRvIGluZGVudCB3aXRoLFxuICAgIHdyYXBfbGluZV9sZW5ndGggKGRlZmF1bHQgMjUwKSAgICAgICAgICAgIC0gIG1heGltdW0gYW1vdW50IG9mIGNoYXJhY3RlcnMgcGVyIGxpbmUgKDAgPSBkaXNhYmxlKVxuICAgIGJyYWNlX3N0eWxlIChkZWZhdWx0IFwiY29sbGFwc2VcIikgLSBcImNvbGxhcHNlXCIgfCBcImV4cGFuZFwiIHwgXCJlbmQtZXhwYW5kXCJcbiAgICAgICAgICAgIHB1dCBicmFjZXMgb24gdGhlIHNhbWUgbGluZSBhcyBjb250cm9sIHN0YXRlbWVudHMgKGRlZmF1bHQpLCBvciBwdXQgYnJhY2VzIG9uIG93biBsaW5lIChBbGxtYW4gLyBBTlNJIHN0eWxlKSwgb3IganVzdCBwdXQgZW5kIGJyYWNlcyBvbiBvd24gbGluZS5cbiAgICB1bmZvcm1hdHRlZCAoZGVmYXVsdHMgdG8gaW5saW5lIHRhZ3MpIC0gbGlzdCBvZiB0YWdzLCB0aGF0IHNob3VsZG4ndCBiZSByZWZvcm1hdHRlZFxuICAgIGluZGVudF9zY3JpcHRzIChkZWZhdWx0IG5vcm1hbCkgIC0gXCJrZWVwXCJ8XCJzZXBhcmF0ZVwifFwibm9ybWFsXCJcbiAgICBwcmVzZXJ2ZV9uZXdsaW5lcyAoZGVmYXVsdCB0cnVlKSAtIHdoZXRoZXIgZXhpc3RpbmcgbGluZSBicmVha3MgYmVmb3JlIGVsZW1lbnRzIHNob3VsZCBiZSBwcmVzZXJ2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPbmx5IHdvcmtzIGJlZm9yZSBlbGVtZW50cywgbm90IGluc2lkZSB0YWdzIG9yIGZvciB0ZXh0LlxuICAgIG1heF9wcmVzZXJ2ZV9uZXdsaW5lcyAoZGVmYXVsdCB1bmxpbWl0ZWQpIC0gbWF4aW11bSBudW1iZXIgb2YgbGluZSBicmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVua1xuICAgIGluZGVudF9oYW5kbGViYXJzIChkZWZhdWx0IGZhbHNlKSAtIGZvcm1hdCBhbmQgaW5kZW50IHt7I2Zvb319IGFuZCB7ey9mb299fVxuXG4gICAgZS5nLlxuXG4gICAgc3R5bGVfaHRtbChodG1sX3NvdXJjZSwge1xuICAgICAgJ2luZGVudF9pbm5lcl9odG1sJzogZmFsc2UsXG4gICAgICAnaW5kZW50X3NpemUnOiAyLFxuICAgICAgJ2luZGVudF9jaGFyJzogJyAnLFxuICAgICAgJ3dyYXBfbGluZV9sZW5ndGgnOiA3OCxcbiAgICAgICdicmFjZV9zdHlsZSc6ICdleHBhbmQnLFxuICAgICAgJ3VuZm9ybWF0dGVkJzogWydhJywgJ3N1YicsICdzdXAnLCAnYicsICdpJywgJ3UnXSxcbiAgICAgICdwcmVzZXJ2ZV9uZXdsaW5lcyc6IHRydWUsXG4gICAgICAnbWF4X3ByZXNlcnZlX25ld2xpbmVzJzogNSxcbiAgICAgICdpbmRlbnRfaGFuZGxlYmFycyc6IGZhbHNlXG4gICAgfSk7XG4qL1xuXG4oZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiB0cmltKHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGx0cmltKHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXlxccysvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UsIG9wdGlvbnMsIGpzX2JlYXV0aWZ5LCBjc3NfYmVhdXRpZnkpIHtcbiAgICAgICAgLy9XcmFwcGVyIGZ1bmN0aW9uIHRvIGludm9rZSBhbGwgdGhlIG5lY2Vzc2FyeSBjb25zdHJ1Y3RvcnMgYW5kIGRlYWwgd2l0aCB0aGUgb3V0cHV0LlxuXG4gICAgICAgIHZhciBtdWx0aV9wYXJzZXIsXG4gICAgICAgICAgICBpbmRlbnRfaW5uZXJfaHRtbCxcbiAgICAgICAgICAgIGluZGVudF9zaXplLFxuICAgICAgICAgICAgaW5kZW50X2NoYXJhY3RlcixcbiAgICAgICAgICAgIHdyYXBfbGluZV9sZW5ndGgsXG4gICAgICAgICAgICBicmFjZV9zdHlsZSxcbiAgICAgICAgICAgIHVuZm9ybWF0dGVkLFxuICAgICAgICAgICAgcHJlc2VydmVfbmV3bGluZXMsXG4gICAgICAgICAgICBtYXhfcHJlc2VydmVfbmV3bGluZXM7XG5cbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgdG8gMS4zLjRcbiAgICAgICAgaWYgKChvcHRpb25zLndyYXBfbGluZV9sZW5ndGggPT09IHVuZGVmaW5lZCB8fCBwYXJzZUludChvcHRpb25zLndyYXBfbGluZV9sZW5ndGgsIDEwKSA9PT0gMCkgJiZcbiAgICAgICAgICAgICAgICAob3B0aW9ucy5tYXhfY2hhciA9PT0gdW5kZWZpbmVkIHx8IHBhcnNlSW50KG9wdGlvbnMubWF4X2NoYXIsIDEwKSA9PT0gMCkpIHtcbiAgICAgICAgICAgIG9wdGlvbnMud3JhcF9saW5lX2xlbmd0aCA9IG9wdGlvbnMubWF4X2NoYXI7XG4gICAgICAgIH1cblxuICAgICAgICBpbmRlbnRfaW5uZXJfaHRtbCA9IG9wdGlvbnMuaW5kZW50X2lubmVyX2h0bWwgfHwgZmFsc2U7XG4gICAgICAgIGluZGVudF9zaXplID0gcGFyc2VJbnQob3B0aW9ucy5pbmRlbnRfc2l6ZSB8fCA0LCAxMCk7XG4gICAgICAgIGluZGVudF9jaGFyYWN0ZXIgPSBvcHRpb25zLmluZGVudF9jaGFyIHx8ICcgJztcbiAgICAgICAgYnJhY2Vfc3R5bGUgPSBvcHRpb25zLmJyYWNlX3N0eWxlIHx8ICdjb2xsYXBzZSc7XG4gICAgICAgIHdyYXBfbGluZV9sZW5ndGggPSAgcGFyc2VJbnQob3B0aW9ucy53cmFwX2xpbmVfbGVuZ3RoLCAxMCkgPT09IDAgPyAzMjc4NiA6IHBhcnNlSW50KG9wdGlvbnMud3JhcF9saW5lX2xlbmd0aCB8fCAyNTAsIDEwKTtcbiAgICAgICAgdW5mb3JtYXR0ZWQgPSBvcHRpb25zLnVuZm9ybWF0dGVkIHx8IFsnYScsICdzcGFuJywgJ2JkbycsICdlbScsICdzdHJvbmcnLCAnZGZuJywgJ2NvZGUnLCAnc2FtcCcsICdrYmQnLCAndmFyJywgJ2NpdGUnLCAnYWJicicsICdhY3JvbnltJywgJ3EnLCAnc3ViJywgJ3N1cCcsICd0dCcsICdpJywgJ2InLCAnYmlnJywgJ3NtYWxsJywgJ3UnLCAncycsICdzdHJpa2UnLCAnZm9udCcsICdpbnMnLCAnZGVsJywgJ3ByZScsICdhZGRyZXNzJywgJ2R0JywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2J107XG4gICAgICAgIHByZXNlcnZlX25ld2xpbmVzID0gb3B0aW9ucy5wcmVzZXJ2ZV9uZXdsaW5lcyB8fCB0cnVlO1xuICAgICAgICBtYXhfcHJlc2VydmVfbmV3bGluZXMgPSBwcmVzZXJ2ZV9uZXdsaW5lcyA/IHBhcnNlSW50KG9wdGlvbnMubWF4X3ByZXNlcnZlX25ld2xpbmVzIHx8IDMyNzg2LCAxMCkgOiAwO1xuICAgICAgICBpbmRlbnRfaGFuZGxlYmFycyA9IG9wdGlvbnMuaW5kZW50X2hhbmRsZWJhcnMgfHwgZmFsc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gUGFyc2VyKCkge1xuXG4gICAgICAgICAgICB0aGlzLnBvcyA9IDA7IC8vUGFyc2VyIHBvc2l0aW9uXG4gICAgICAgICAgICB0aGlzLnRva2VuID0gJyc7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRfbW9kZSA9ICdDT05URU5UJzsgLy9yZWZsZWN0cyB0aGUgY3VycmVudCBQYXJzZXIgbW9kZTogVEFHL0NPTlRFTlRcbiAgICAgICAgICAgIHRoaXMudGFncyA9IHsgLy9BbiBvYmplY3QgdG8gaG9sZCB0YWdzLCB0aGVpciBwb3NpdGlvbiwgYW5kIHRoZWlyIHBhcmVudC10YWdzLCBpbml0aWF0ZWQgd2l0aCBkZWZhdWx0IHZhbHVlc1xuICAgICAgICAgICAgICAgIHBhcmVudDogJ3BhcmVudDEnLFxuICAgICAgICAgICAgICAgIHBhcmVudGNvdW50OiAxLFxuICAgICAgICAgICAgICAgIHBhcmVudDE6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy50YWdfdHlwZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy50b2tlbl90ZXh0ID0gdGhpcy5sYXN0X3Rva2VuID0gdGhpcy5sYXN0X3RleHQgPSB0aGlzLnRva2VuX3R5cGUgPSAnJztcbiAgICAgICAgICAgIHRoaXMubmV3bGluZXMgPSAwO1xuICAgICAgICAgICAgdGhpcy5pbmRlbnRfY29udGVudCA9IGluZGVudF9pbm5lcl9odG1sO1xuXG4gICAgICAgICAgICB0aGlzLlV0aWxzID0geyAvL1VpbGl0aWVzIG1hZGUgYXZhaWxhYmxlIHRvIHRoZSB2YXJpb3VzIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIHdoaXRlc3BhY2U6IFwiXFxuXFxyXFx0IFwiLnNwbGl0KCcnKSxcbiAgICAgICAgICAgICAgICBzaW5nbGVfdG9rZW46ICdicixpbnB1dCxsaW5rLG1ldGEsIWRvY3R5cGUsYmFzZWZvbnQsYmFzZSxhcmVhLGhyLHdicixwYXJhbSxpbWcsaXNpbmRleCw/eG1sLGVtYmVkLD9waHAsPyw/PScuc3BsaXQoJywnKSwgLy9hbGwgdGhlIHNpbmdsZSB0YWdzIGZvciBIVE1MXG4gICAgICAgICAgICAgICAgZXh0cmFfbGluZXJzOiAnaGVhZCxib2R5LC9odG1sJy5zcGxpdCgnLCcpLCAvL2ZvciB0YWdzIHRoYXQgbmVlZCBhIGxpbmUgb2Ygd2hpdGVzcGFjZSBiZWZvcmUgdGhlbVxuICAgICAgICAgICAgICAgIGluX2FycmF5OiBmdW5jdGlvbih3aGF0LCBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aGF0ID09PSBhcnJbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy50cmF2ZXJzZV93aGl0ZXNwYWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0X2NoYXIgPSAnJztcblxuICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuVXRpbHMuaW5fYXJyYXkoaW5wdXRfY2hhciwgdGhpcy5VdGlscy53aGl0ZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld2xpbmVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuVXRpbHMuaW5fYXJyYXkoaW5wdXRfY2hhciwgdGhpcy5VdGlscy53aGl0ZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXNlcnZlX25ld2xpbmVzICYmIGlucHV0X2NoYXIgPT09ICdcXG4nICYmIHRoaXMubmV3bGluZXMgPD0gbWF4X3ByZXNlcnZlX25ld2xpbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdsaW5lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9IHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5nZXRfY29udGVudCA9IGZ1bmN0aW9uKCkgeyAvL2Z1bmN0aW9uIHRvIGNhcHR1cmUgcmVndWxhciBjb250ZW50IGJldHdlZW4gdGFnc1xuXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0X2NoYXIgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGZhbHNlOyAvL2lmIGEgc3BhY2UgaXMgbmVlZGVkXG5cbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5pbnB1dC5jaGFyQXQodGhpcy5wb3MpICE9PSAnPCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zID49IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudC5sZW5ndGggPyBjb250ZW50LmpvaW4oJycpIDogWycnLCAnVEtfRU9GJ107XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmF2ZXJzZV93aGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvL2Rvbid0IHdhbnQgdG8gaW5zZXJ0IHVubmVjZXNzYXJ5IHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZW50X2hhbmRsZWJhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZWJhcnMgcGFyc2luZyBpcyBjb21wbGljYXRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHt7I2Zvb319IGFuZCB7ey9mb299fSBhcmUgZm9ybWF0dGVkIHRhZ3MuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB7e3NvbWV0aGluZ319IHNob3VsZCBnZXQgdHJlYXRlZCBhcyBjb250ZW50LCBleGNlcHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB7e2Vsc2V9fSBzcGVjaWZpY2FsbHkgYmVoYXZlcyBsaWtlIHt7I2lmfX0gYW5kIHt7L2lmfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwZWVrMyA9IHRoaXMuaW5wdXQuc3Vic3RyKHRoaXMucG9zLCAzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWVrMyA9PT0gJ3t7IycgfHwgcGVlazMgPT09ICd7ey8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlc2UgYXJlIHRhZ3MgYW5kIG5vdCBjb250ZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlucHV0LnN1YnN0cih0aGlzLnBvcywgMikgPT09ICd7eycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRfdGFnKHRydWUpID09PSAne3tlbHNlfX0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgPSB0aGlzLmlucHV0LmNoYXJBdCh0aGlzLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zKys7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5lX2NoYXJfY291bnQgPj0gdGhpcy53cmFwX2xpbmVfbGVuZ3RoKSB7IC8vaW5zZXJ0IGEgbGluZSB3aGVuIHRoZSB3cmFwX2xpbmVfbGVuZ3RoIGlzIHJlYWNoZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUoZmFsc2UsIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfaW5kZW50YXRpb24oY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5wdXNoKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaChpbnB1dF9jaGFyKTsgLy9sZXR0ZXIgYXQtYS10aW1lIChvciBzdHJpbmcpIGluc2VydGVkIHRvIGFuIGFycmF5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50Lmxlbmd0aCA/IGNvbnRlbnQuam9pbignJykgOiAnJztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0X2NvbnRlbnRzX3RvID0gZnVuY3Rpb24obmFtZSkgeyAvL2dldCB0aGUgZnVsbCBjb250ZW50IG9mIGEgc2NyaXB0IG9yIHN0eWxlIHRvIHBhc3MgdG8ganNfYmVhdXRpZnlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPT09IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJycsICdUS19FT0YnXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0X2NoYXIgPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIHZhciByZWdfbWF0Y2ggPSBuZXcgUmVnRXhwKCc8LycgKyBuYW1lICsgJ1xcXFxzKj4nLCAnaWdtJyk7XG4gICAgICAgICAgICAgICAgcmVnX21hdGNoLmxhc3RJbmRleCA9IHRoaXMucG9zO1xuICAgICAgICAgICAgICAgIHZhciByZWdfYXJyYXkgPSByZWdfbWF0Y2guZXhlYyh0aGlzLmlucHV0KTtcbiAgICAgICAgICAgICAgICB2YXIgZW5kX3NjcmlwdCA9IHJlZ19hcnJheSA/IHJlZ19hcnJheS5pbmRleCA6IHRoaXMuaW5wdXQubGVuZ3RoOyAvL2Fic29sdXRlIGVuZCBvZiBzY3JpcHRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPCBlbmRfc2NyaXB0KSB7IC8vZ2V0IGV2ZXJ5dGhpbmcgaW4gYmV0d2VlbiB0aGUgc2NyaXB0IHRhZ3NcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHRoaXMucG9zLCBlbmRfc2NyaXB0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MgPSBlbmRfc2NyaXB0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucmVjb3JkX3RhZyA9IGZ1bmN0aW9uKHRhZykgeyAvL2Z1bmN0aW9uIHRvIHJlY29yZCBhIHRhZyBhbmQgaXRzIHBhcmVudCBpbiB0aGlzLnRhZ3MgT2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSkgeyAvL2NoZWNrIGZvciB0aGUgZXhpc3RlbmNlIG9mIHRoaXMgdGFnIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzW3RhZyArICdjb3VudCddKys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFnc1t0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J11dID0gdGhpcy5pbmRlbnRfbGV2ZWw7IC8vYW5kIHJlY29yZCB0aGUgcHJlc2VudCBpbmRlbnQgbGV2ZWxcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBpbml0aWFsaXplIHRoaXMgdGFnIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzW3RhZyArICdjb3VudCddID0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzW3RhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXV0gPSB0aGlzLmluZGVudF9sZXZlbDsgLy9hbmQgcmVjb3JkIHRoZSBwcmVzZW50IGluZGVudCBsZXZlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3NbdGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddICsgJ3BhcmVudCddID0gdGhpcy50YWdzLnBhcmVudDsgLy9zZXQgdGhlIHBhcmVudCAoaS5lLiBpbiB0aGUgY2FzZSBvZiBhIGRpdiB0aGlzLnRhZ3MuZGl2MXBhcmVudClcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MucGFyZW50ID0gdGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddOyAvL2FuZCBtYWtlIHRoaXMgdGhlIGN1cnJlbnQgcGFyZW50IChpLmUuIGluIHRoZSBjYXNlIG9mIGEgZGl2ICdkaXYxJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucmV0cmlldmVfdGFnID0gZnVuY3Rpb24odGFnKSB7IC8vZnVuY3Rpb24gdG8gcmV0cmlldmUgdGhlIG9wZW5pbmcgdGFnIHRvIHRoZSBjb3JyZXNwb25kaW5nIGNsb3NlclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J10pIHsgLy9pZiB0aGUgb3BlbmVuZXIgaXMgbm90IGluIHRoZSBPYmplY3Qgd2UgaWdub3JlIGl0XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wX3BhcmVudCA9IHRoaXMudGFncy5wYXJlbnQ7IC8vY2hlY2sgdG8gc2VlIGlmIGl0J3MgYSBjbG9zYWJsZSB0YWcuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ZW1wX3BhcmVudCkgeyAvL3RpbGwgd2UgcmVhY2ggJycgKHRoZSBpbml0aWFsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J10gPT09IHRlbXBfcGFyZW50KSB7IC8vaWYgdGhpcyBpcyBpdCB1c2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBfcGFyZW50ID0gdGhpcy50YWdzW3RlbXBfcGFyZW50ICsgJ3BhcmVudCddOyAvL290aGVyd2lzZSBrZWVwIG9uIGNsaW1iaW5nIHVwIHRoZSBET00gVHJlZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wX3BhcmVudCkgeyAvL2lmIHdlIGNhdWdodCBzb21ldGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X2xldmVsID0gdGhpcy50YWdzW3RhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXV07IC8vc2V0IHRoZSBpbmRlbnRfbGV2ZWwgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFncy5wYXJlbnQgPSB0aGlzLnRhZ3NbdGVtcF9wYXJlbnQgKyAncGFyZW50J107IC8vYW5kIHNldCB0aGUgY3VycmVudCBwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy50YWdzW3RhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSArICdwYXJlbnQnXTsgLy9kZWxldGUgdGhlIGNsb3NlZCB0YWdzIHBhcmVudCByZWZlcmVuY2UuLi5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFnc1t0YWcgKyB0aGlzLnRhZ3NbdGFnICsgJ2NvdW50J11dOyAvLy4uLmFuZCB0aGUgdGFnIGl0c2VsZlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50YWdzW3RhZyArICdjb3VudCddID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy50YWdzW3RhZyArICdjb3VudCddO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdzW3RhZyArICdjb3VudCddLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmluZGVudF90b190YWcgPSBmdW5jdGlvbih0YWcpIHtcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCB0aGUgaW5kZW50YXRpb24gbGV2ZWwgdG8gdGhlIGxhc3QgdXNlIG9mIHRoaXMgdGFnLCBidXQgZG9uJ3QgcmVtb3ZlIGl0LlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50YWdzW3RhZyArICdjb3VudCddKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBfcGFyZW50ID0gdGhpcy50YWdzLnBhcmVudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGVtcF9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyArIHRoaXMudGFnc1t0YWcgKyAnY291bnQnXSA9PT0gdGVtcF9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRlbXBfcGFyZW50ID0gdGhpcy50YWdzW3RlbXBfcGFyZW50ICsgJ3BhcmVudCddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGVtcF9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfbGV2ZWwgPSB0aGlzLnRhZ3NbdGFnICsgdGhpcy50YWdzW3RhZyArICdjb3VudCddXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF90YWcgPSBmdW5jdGlvbihwZWVrKSB7IC8vZnVuY3Rpb24gdG8gZ2V0IGEgZnVsbCB0YWcgYW5kIHBhcnNlIGl0cyB0eXBlXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0X2NoYXIgPSAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gJycsXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydCwgdGFnX2VuZCxcbiAgICAgICAgICAgICAgICAgICAgdGFnX3N0YXJ0X2NoYXIsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdfcG9zID0gdGhpcy5wb3MsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdfbGluZV9jaGFyX2NvdW50ID0gdGhpcy5saW5lX2NoYXJfY291bnQ7XG5cbiAgICAgICAgICAgICAgICBwZWVrID0gcGVlayAhPT0gdW5kZWZpbmVkID8gcGVlayA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPj0gdGhpcy5pbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MgPSBvcmlnX3BvcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVfY2hhcl9jb3VudCA9IG9yaWdfbGluZV9jaGFyX2NvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQubGVuZ3RoID8gY29udGVudC5qb2luKCcnKSA6IFsnJywgJ1RLX0VPRiddO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9IHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5VdGlscy5pbl9hcnJheShpbnB1dF9jaGFyLCB0aGlzLlV0aWxzLndoaXRlc3BhY2UpKSB7IC8vZG9uJ3Qgd2FudCB0byBpbnNlcnQgdW5uZWNlc3Nhcnkgc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0X2NoYXIgPT09IFwiJ1wiIHx8IGlucHV0X2NoYXIgPT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0X2NoYXIgKz0gdGhpcy5nZXRfdW5mb3JtYXR0ZWQoaW5wdXRfY2hhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9jaGFyID09PSAnPScpIHsgLy9ubyBzcGFjZSBiZWZvcmUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCAmJiBjb250ZW50W2NvbnRlbnQubGVuZ3RoIC0gMV0gIT09ICc9JyAmJiBpbnB1dF9jaGFyICE9PSAnPicgJiYgc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbm8gc3BhY2UgYWZ0ZXIgPSBvciBiZWZvcmUgPlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGluZV9jaGFyX2NvdW50ID49IHRoaXMud3JhcF9saW5lX2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfbmV3bGluZShmYWxzZSwgY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9pbmRlbnRhdGlvbihjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5wdXNoKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZW50X2hhbmRsZWJhcnMgJiYgdGFnX3N0YXJ0X2NoYXIgPT09ICc8Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBpbnNpZGUgYW4gYW5nbGUtYnJhY2tldCB0YWcsIHB1dCBzcGFjZXMgYXJvdW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGViYXJzIG5vdCBpbnNpZGUgb2Ygc3RyaW5ncy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaW5wdXRfY2hhciArIHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKSkgPT09ICd7eycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dF9jaGFyICs9IHRoaXMuZ2V0X3VuZm9ybWF0dGVkKCd9fScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50Lmxlbmd0aCAmJiBjb250ZW50W2NvbnRlbnQubGVuZ3RoIC0gMV0gIT09ICcgJyAmJiBjb250ZW50W2NvbnRlbnQubGVuZ3RoIC0gMV0gIT09ICc8Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dF9jaGFyID0gJyAnICsgaW5wdXRfY2hhcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0X2NoYXIgPT09ICc8JyAmJiAhdGFnX3N0YXJ0X2NoYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydCA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydF9jaGFyID0gJzwnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGVudF9oYW5kbGViYXJzICYmICF0YWdfc3RhcnRfY2hhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQubGVuZ3RoID49IDIgJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdID09PSAneycgJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDJdID09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9jaGFyID09PSAnIycgfHwgaW5wdXRfY2hhciA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydCA9IHRoaXMucG9zIC0gMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdfc3RhcnQgPSB0aGlzLnBvcyAtIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19zdGFydF9jaGFyID0gJ3snO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5wdXNoKGlucHV0X2NoYXIpOyAvL2luc2VydHMgY2hhcmFjdGVyIGF0LWEtdGltZSAob3Igc3RyaW5nKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50WzFdICYmIGNvbnRlbnRbMV0gPT09ICchJykgeyAvL2lmIHdlJ3JlIGluIGEgY29tbWVudCwgZG8gc29tZXRoaW5nIHNwZWNpYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIHRyZWF0IGFsbCBjb21tZW50cyBhcyBsaXRlcmFscywgZXZlbiBtb3JlIHRoYW4gcHJlZm9ybWF0dGVkIHRhZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGp1c3QgbG9vayBmb3IgdGhlIGFwcHJvcHJpYXRlIGNsb3NlIHRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IFt0aGlzLmdldF9jb21tZW50KHRhZ19zdGFydCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZW50X2hhbmRsZWJhcnMgJiYgdGFnX3N0YXJ0X2NoYXIgPT09ICd7JyAmJiBjb250ZW50Lmxlbmd0aCA+IDIgJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDJdID09PSAnfScgJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoaW5wdXRfY2hhciAhPT0gJz4nKTtcblxuICAgICAgICAgICAgICAgIHZhciB0YWdfY29tcGxldGUgPSBjb250ZW50LmpvaW4oJycpO1xuICAgICAgICAgICAgICAgIHZhciB0YWdfaW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHRhZ19vZmZzZXQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFnX2NvbXBsZXRlLmluZGV4T2YoJyAnKSAhPT0gLTEpIHsgLy9pZiB0aGVyZSdzIHdoaXRlc3BhY2UsIHRoYXRzIHdoZXJlIHRoZSB0YWcgbmFtZSBlbmRzXG4gICAgICAgICAgICAgICAgICAgIHRhZ19pbmRleCA9IHRhZ19jb21wbGV0ZS5pbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWdfY29tcGxldGVbMF0gPT09ICd7Jykge1xuICAgICAgICAgICAgICAgICAgICB0YWdfaW5kZXggPSB0YWdfY29tcGxldGUuaW5kZXhPZignfScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vb3RoZXJ3aXNlIGdvIHdpdGggdGhlIHRhZyBlbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgdGFnX2luZGV4ID0gdGFnX2NvbXBsZXRlLmluZGV4T2YoJz4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRhZ19jb21wbGV0ZVswXSA9PT0gJzwnIHx8ICFpbmRlbnRfaGFuZGxlYmFycykge1xuICAgICAgICAgICAgICAgICAgICB0YWdfb2Zmc2V0ID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YWdfb2Zmc2V0ID0gdGFnX2NvbXBsZXRlWzJdID09PSAnIycgPyAzIDogMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRhZ19jaGVjayA9IHRhZ19jb21wbGV0ZS5zdWJzdHJpbmcodGFnX29mZnNldCwgdGFnX2luZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0YWdfY29tcGxldGUuY2hhckF0KHRhZ19jb21wbGV0ZS5sZW5ndGggLSAyKSA9PT0gJy8nIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXRpbHMuaW5fYXJyYXkodGFnX2NoZWNrLCB0aGlzLlV0aWxzLnNpbmdsZV90b2tlbikpIHsgLy9pZiB0aGlzIHRhZyBuYW1lIGlzIGEgc2luZ2xlIHRhZyB0eXBlIChlaXRoZXIgaW4gdGhlIGxpc3Qgb3IgaGFzIGEgY2xvc2luZyAvKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnU0lOR0xFJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZW50X2hhbmRsZWJhcnMgJiYgdGFnX2NvbXBsZXRlWzBdID09PSAneycgJiYgdGFnX2NoZWNrID09PSAnZWxzZScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudF90b190YWcoJ2lmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ0hBTkRMRUJBUlNfRUxTRSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9jb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWdfY2hlY2sgPT09ICdzY3JpcHQnKSB7IC8vZm9yIGxhdGVyIHNjcmlwdCBoYW5kbGluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkX3RhZyh0YWdfY2hlY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWdfdHlwZSA9ICdTQ1JJUFQnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YWdfY2hlY2sgPT09ICdzdHlsZScpIHsgLy9mb3IgZnV0dXJlIHN0eWxlIGhhbmRsaW5nIChmb3Igbm93IGl0IGp1c3RzIHVzZXMgZ2V0X2NvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVlaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRfdGFnKHRhZ19jaGVjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ1NUWUxFJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc191bmZvcm1hdHRlZCh0YWdfY2hlY2ssIHVuZm9ybWF0dGVkKSkgeyAvLyBkbyBub3QgcmVmb3JtYXQgdGhlIFwidW5mb3JtYXR0ZWRcIiB0YWdzXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSB0aGlzLmdldF91bmZvcm1hdHRlZCgnPC8nICsgdGFnX2NoZWNrICsgJz4nLCB0YWdfY29tcGxldGUpOyAvLy4uLmRlbGVnYXRlIHRvIGdldF91bmZvcm1hdHRlZCBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBjb250ZW50LnB1c2goY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByZXNlcnZlIGNvbGxhcHNlZCB3aGl0ZXNwYWNlIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhpcyB0YWcuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWdfc3RhcnQgPiAwICYmIHRoaXMuVXRpbHMuaW5fYXJyYXkodGhpcy5pbnB1dC5jaGFyQXQodGFnX3N0YXJ0IC0gMSksIHRoaXMuVXRpbHMud2hpdGVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuc3BsaWNlKDAsIDAsIHRoaXMuaW5wdXQuY2hhckF0KHRhZ19zdGFydCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWdfZW5kID0gdGhpcy5wb3MgLSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5VdGlscy5pbl9hcnJheSh0aGlzLmlucHV0LmNoYXJBdCh0YWdfZW5kICsgMSksIHRoaXMuVXRpbHMud2hpdGVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh0aGlzLmlucHV0LmNoYXJBdCh0YWdfZW5kICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnU0lOR0xFJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhZ19jaGVjay5jaGFyQXQoMCkgPT09ICchJykgeyAvL3BlZWsgZm9yIDwhIGNvbW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGNvbW1lbnRzIGNvbnRlbnQgaXMgYWxyZWFkeSBjb3JyZWN0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXBlZWspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnU0lOR0xFJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghcGVlaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFnX2NoZWNrLmNoYXJBdCgwKSA9PT0gJy8nKSB7IC8vdGhpcyB0YWcgaXMgYSBkb3VibGUgdGFnIHNvIGNoZWNrIGZvciB0YWctZW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJldHJpZXZlX3RhZyh0YWdfY2hlY2suc3Vic3RyaW5nKDEpKTsgLy9yZW1vdmUgaXQgYW5kIGFsbCBhbmNlc3RvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFnX3R5cGUgPSAnRU5EJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhdmVyc2Vfd2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvL290aGVyd2lzZSBpdCdzIGEgc3RhcnQtdGFnXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZF90YWcodGFnX2NoZWNrKTsgLy9wdXNoIGl0IG9uIHRoZSB0YWcgc3RhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfY2hlY2sudG9Mb3dlckNhc2UoKSAhPT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfY29udGVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ190eXBlID0gJ1NUQVJUJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxsb3cgcHJlc2VydmluZyBvZiBuZXdsaW5lcyBhZnRlciBhIHN0YXJ0IHRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmF2ZXJzZV93aGl0ZXNwYWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuVXRpbHMuaW5fYXJyYXkodGFnX2NoZWNrLCB0aGlzLlV0aWxzLmV4dHJhX2xpbmVycykpIHsgLy9jaGVjayBpZiB0aGlzIGRvdWJsZSBuZWVkcyBhbiBleHRyYSBsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUoZmFsc2UsIHRoaXMub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm91dHB1dC5sZW5ndGggJiYgdGhpcy5vdXRwdXRbdGhpcy5vdXRwdXQubGVuZ3RoIC0gMl0gIT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9uZXdsaW5lKHRydWUsIHRoaXMub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwZWVrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zID0gb3JpZ19wb3M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50ID0gb3JpZ19saW5lX2NoYXJfY291bnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQuam9pbignJyk7IC8vcmV0dXJucyBmdWxseSBmb3JtYXR0ZWQgdGFnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF9jb21tZW50ID0gZnVuY3Rpb24oc3RhcnRfcG9zKSB7IC8vZnVuY3Rpb24gdG8gcmV0dXJuIGNvbW1lbnQgY29udGVudCBpbiBpdHMgZW50aXJldHlcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHdpbGwgaGF2ZSB2ZXJ5IHBvb3IgcGVyZiwgYnV0IHdpbGwgd29yayBmb3Igbm93LlxuICAgICAgICAgICAgICAgIHZhciBjb21tZW50ID0gJycsXG4gICAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9ICc+JyxcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wb3MgPSBzdGFydF9wb3M7XG4gICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9IHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcysrO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDw9IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gaW5wdXRfY2hhcjtcblxuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IG5lZWQgdG8gY2hlY2sgZm9yIHRoZSBkZWxpbWl0ZXIgaWYgdGhlIGxhc3QgY2hhcnMgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnRbY29tbWVudC5sZW5ndGggLSAxXSA9PT0gZGVsaW1pdGVyW2RlbGltaXRlci5sZW5ndGggLSAxXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudC5pbmRleE9mKGRlbGltaXRlcikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgbmVlZCB0byBzZWFyY2ggZm9yIGN1c3RvbSBkZWxpbWl0ZXIgZm9yIHRoZSBmaXJzdCBmZXcgY2hhcmFjdGVyc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZWQgJiYgY29tbWVudC5sZW5ndGggPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnQuaW5kZXhPZignPCFbaWYnKSA9PT0gMCkgeyAvL3BlZWsgZm9yIDwhW2lmIGNvbmRpdGlvbmFsIGNvbW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxpbWl0ZXIgPSAnPCFbZW5kaWZdPic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbW1lbnQuaW5kZXhPZignPCFbY2RhdGFbJykgPT09IDApIHsgLy9pZiBpdCdzIGEgPFtjZGF0YVsgY29tbWVudC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9ICddXT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb21tZW50LmluZGV4T2YoJzwhWycpID09PSAwKSB7IC8vIHNvbWUgb3RoZXIgIVsgY29tbWVudD8gLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsaW1pdGVyID0gJ10+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29tbWVudC5pbmRleE9mKCc8IS0tJykgPT09IDApIHsgLy8gPCEtLSBjb21tZW50IC4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9ICctLT4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9IHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbWVudDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0X3VuZm9ybWF0dGVkID0gZnVuY3Rpb24oZGVsaW1pdGVyLCBvcmlnX3RhZykgeyAvL2Z1bmN0aW9uIHRvIHJldHVybiB1bmZvcm1hdHRlZCBjb250ZW50IGluIGl0cyBlbnRpcmV0eVxuXG4gICAgICAgICAgICAgICAgaWYgKG9yaWdfdGFnICYmIG9yaWdfdGFnLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihkZWxpbWl0ZXIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbnB1dF9jaGFyID0gJyc7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcbiAgICAgICAgICAgICAgICB2YXIgbWluX2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB2YXIgc3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRvIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPj0gdGhpcy5pbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRfY2hhciA9IHRoaXMuaW5wdXQuY2hhckF0KHRoaXMucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5VdGlscy5pbl9hcnJheShpbnB1dF9jaGFyLCB0aGlzLlV0aWxzLndoaXRlc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9jaGFyID09PSAnXFxuJyB8fCBpbnB1dF9jaGFyID09PSAnXFxyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogIERvbid0IGNoYW5nZSB0YWIgaW5kZW50aW9uIGZvciB1bmZvcm1hdHRlZCBibG9ja3MuICBJZiB1c2luZyBjb2RlIGZvciBodG1sIGVkaXRpbmcsIHRoaXMgd2lsbCBncmVhdGx5IGFmZmVjdCA8cHJlPiB0YWdzIGlmIHRoZXkgYXJlIHNwZWNpZmllZCBpbiB0aGUgJ3VuZm9ybWF0dGVkIGFycmF5J1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0aGlzLmluZGVudF9sZXZlbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZW50ICs9IHRoaXMuaW5kZW50X3N0cmluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3BhY2UgPSBmYWxzZTsgLy8uLi5hbmQgbWFrZSBzdXJlIG90aGVyIGluZGVudGF0aW9uIGlzIGVyYXNlZFxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gaW5wdXRfY2hhcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgc3BhY2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRlbnRfaGFuZGxlYmFycyAmJiBpbnB1dF9jaGFyID09PSAneycgJiYgY29udGVudC5sZW5ndGggJiYgY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDJdID09PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZWJhcnMgZXhwcmVzc2lvbnMgaW4gc3RyaW5ncyBzaG91bGQgYWxzbyBiZSB1bmZvcm1hdHRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gdGhpcy5nZXRfdW5mb3JtYXR0ZWQoJ319Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVzZSBleHByZXNzaW9ucyBhcmUgb3BhcXVlLiAgSWdub3JlIGRlbGltaXRlcnMgZm91bmQgaW4gdGhlbS5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9pbmRleCA9IGNvbnRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoY29udGVudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZGVsaW1pdGVyLCBtaW5faW5kZXgpID09PSAtMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmdldF90b2tlbiA9IGZ1bmN0aW9uKCkgeyAvL2luaXRpYWwgaGFuZGxlciBmb3IgdG9rZW4tcmV0cmlldmFsXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdF90b2tlbiA9PT0gJ1RLX1RBR19TQ1JJUFQnIHx8IHRoaXMubGFzdF90b2tlbiA9PT0gJ1RLX1RBR19TVFlMRScpIHsgLy9jaGVjayBpZiB3ZSBuZWVkIHRvIGZvcm1hdCBqYXZhc2NyaXB0XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdGhpcy5sYXN0X3Rva2VuLnN1YnN0cig3KTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLmdldF9jb250ZW50c190byh0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Rva2VuLCAnVEtfJyArIHR5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50X21vZGUgPT09ICdDT05URU5UJykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMuZ2V0X2NvbnRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbdG9rZW4sICdUS19DT05URU5UJ107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50X21vZGUgPT09ICdUQUcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5nZXRfdGFnKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFnX25hbWVfdHlwZSA9ICdUS19UQUdfJyArIHRoaXMudGFnX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Rva2VuLCB0YWdfbmFtZV90eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0X2Z1bGxfaW5kZW50ID0gZnVuY3Rpb24obGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBsZXZlbCA9IHRoaXMuaW5kZW50X2xldmVsICsgbGV2ZWwgfHwgMDtcbiAgICAgICAgICAgICAgICBpZiAobGV2ZWwgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkobGV2ZWwgKyAxKS5qb2luKHRoaXMuaW5kZW50X3N0cmluZyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmlzX3VuZm9ybWF0dGVkID0gZnVuY3Rpb24odGFnX2NoZWNrLCB1bmZvcm1hdHRlZCkge1xuICAgICAgICAgICAgICAgIC8vaXMgdGhpcyBhbiBIVE1MNSBibG9jay1sZXZlbCBsaW5rP1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5VdGlscy5pbl9hcnJheSh0YWdfY2hlY2ssIHVuZm9ybWF0dGVkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRhZ19jaGVjay50b0xvd2VyQ2FzZSgpICE9PSAnYScgfHwgIXRoaXMuVXRpbHMuaW5fYXJyYXkoJ2EnLCB1bmZvcm1hdHRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9hdCB0aGlzIHBvaW50IHdlIGhhdmUgYW4gIHRhZzsgaXMgaXRzIGZpcnN0IGNoaWxkIHNvbWV0aGluZyB3ZSB3YW50IHRvIHJlbWFpblxuICAgICAgICAgICAgICAgIC8vdW5mb3JtYXR0ZWQ/XG4gICAgICAgICAgICAgICAgdmFyIG5leHRfdGFnID0gdGhpcy5nZXRfdGFnKHRydWUgLyogcGVlay4gKi8gKTtcblxuICAgICAgICAgICAgICAgIC8vIHRlc3QgbmV4dF90YWcgdG8gc2VlIGlmIGl0IGlzIGp1c3QgaHRtbCB0YWcgKG5vIGV4dGVybmFsIGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgdmFyIHRhZyA9IChuZXh0X3RhZyB8fCBcIlwiKS5tYXRjaCgvXlxccyo8XFxzKlxcLz8oW2Etel0qKVxccypbXj5dKj5cXHMqJC8pO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgbmV4dF90YWcgY29tZXMgYmFjayBidXQgaXMgbm90IGFuIGlzb2xhdGVkIHRhZywgdGhlblxuICAgICAgICAgICAgICAgIC8vIGxldCdzIHRyZWF0IHRoZSAnYScgdGFnIGFzIGhhdmluZyBjb250ZW50XG4gICAgICAgICAgICAgICAgLy8gYW5kIHJlc3BlY3QgdGhlIHVuZm9ybWF0dGVkIG9wdGlvblxuICAgICAgICAgICAgICAgIGlmICghdGFnIHx8IHRoaXMuVXRpbHMuaW5fYXJyYXkodGFnLCB1bmZvcm1hdHRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMucHJpbnRlciA9IGZ1bmN0aW9uKGpzX3NvdXJjZSwgaW5kZW50X2NoYXJhY3RlciwgaW5kZW50X3NpemUsIHdyYXBfbGluZV9sZW5ndGgsIGJyYWNlX3N0eWxlKSB7IC8vaGFuZGxlcyBpbnB1dC9vdXRwdXQgYW5kIHNvbWUgb3RoZXIgcHJpbnRpbmcgZnVuY3Rpb25zXG5cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0ID0ganNfc291cmNlIHx8ICcnOyAvL2dldHMgdGhlIGlucHV0IGZvciB0aGUgUGFyc2VyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9jaGFyYWN0ZXIgPSBpbmRlbnRfY2hhcmFjdGVyO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X3N0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50X3NpemUgPSBpbmRlbnRfc2l6ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmJyYWNlX3N0eWxlID0gYnJhY2Vfc3R5bGU7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfbGV2ZWwgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMud3JhcF9saW5lX2xlbmd0aCA9IHdyYXBfbGluZV9sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5lX2NoYXJfY291bnQgPSAwOyAvL2NvdW50IHRvIHNlZSBpZiB3cmFwX2xpbmVfbGVuZ3RoIHdhcyBleGNlZWRlZFxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluZGVudF9zaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfc3RyaW5nICs9IHRoaXMuaW5kZW50X2NoYXJhY3RlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUgPSBmdW5jdGlvbihmb3JjZSwgYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcnIgfHwgIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9yY2UgfHwgKGFyclthcnIubGVuZ3RoIC0gMV0gIT09ICdcXG4nKSkgeyAvL3dlIG1pZ2h0IHdhbnQgdGhlIGV4dHJhIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByaW50X2luZGVudGF0aW9uID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbmRlbnRfbGV2ZWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2godGhpcy5pbmRlbnRfc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZV9jaGFyX2NvdW50ICs9IHRoaXMuaW5kZW50X3N0cmluZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmludF90b2tlbiA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQgfHwgdGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm91dHB1dC5sZW5ndGggJiYgdGhpcy5vdXRwdXRbdGhpcy5vdXRwdXQubGVuZ3RoIC0gMV0gPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmludF9pbmRlbnRhdGlvbih0aGlzLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGx0cmltKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJpbnRfdG9rZW5fcmF3KHRleHQpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByaW50X3Rva2VuX3JhdyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA+IDEgJiYgdGV4dFt0ZXh0Lmxlbmd0aCAtIDFdID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ybWF0dGVkIHRhZ3MgY2FuIGdyYWIgbmV3bGluZXMgYXMgdGhlaXIgbGFzdCBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC5wdXNoKHRleHQuc2xpY2UoMCwgLTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUoZmFsc2UsIHRoaXMub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgdGhpcy5uZXdsaW5lczsgbisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByaW50X25ld2xpbmUobiA+IDAsIHRoaXMub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld2xpbmVzID0gMDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRfbGV2ZWwrKztcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy51bmluZGVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRlbnRfbGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudF9sZXZlbC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qX19fX19fX19fX19fX19fX19fX19fLS0tLS0tLS0tLS0tLS0tLS0tLS1fX19fX19fX19fX19fX19fX19fX18qL1xuXG4gICAgICAgIG11bHRpX3BhcnNlciA9IG5ldyBQYXJzZXIoKTsgLy93cmFwcGluZyBmdW5jdGlvbnMgUGFyc2VyXG4gICAgICAgIG11bHRpX3BhcnNlci5wcmludGVyKGh0bWxfc291cmNlLCBpbmRlbnRfY2hhcmFjdGVyLCBpbmRlbnRfc2l6ZSwgd3JhcF9saW5lX2xlbmd0aCwgYnJhY2Vfc3R5bGUpOyAvL2luaXRpYWxpemUgc3RhcnRpbmcgdmFsdWVzXG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciB0ID0gbXVsdGlfcGFyc2VyLmdldF90b2tlbigpO1xuICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnRva2VuX3RleHQgPSB0WzBdO1xuICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnRva2VuX3R5cGUgPSB0WzFdO1xuXG4gICAgICAgICAgICBpZiAobXVsdGlfcGFyc2VyLnRva2VuX3R5cGUgPT09ICdUS19FT0YnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN3aXRjaCAobXVsdGlfcGFyc2VyLnRva2VuX3R5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdUS19UQUdfU1RBUlQnOlxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfbmV3bGluZShmYWxzZSwgbXVsdGlfcGFyc2VyLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbihtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aV9wYXJzZXIuaW5kZW50X2NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5pbmRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5pbmRlbnRfY29udGVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnQ09OVEVOVCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1RBR19TVFlMRSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfVEFHX1NDUklQVCc6XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF9uZXdsaW5lKGZhbHNlLCBtdWx0aV9wYXJzZXIub3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X3Rva2VuKG11bHRpX3BhcnNlci50b2tlbl90ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmN1cnJlbnRfbW9kZSA9ICdDT05URU5UJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfVEFHX0VORCc6XG4gICAgICAgICAgICAgICAgICAgIC8vUHJpbnQgbmV3IGxpbmUgb25seSBpZiB0aGUgdGFnIGhhcyBubyBjb250ZW50IGFuZCBoYXMgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpX3BhcnNlci5sYXN0X3Rva2VuID09PSAnVEtfQ09OVEVOVCcgJiYgbXVsdGlfcGFyc2VyLmxhc3RfdGV4dCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YWdfbmFtZSA9IG11bHRpX3BhcnNlci50b2tlbl90ZXh0Lm1hdGNoKC9cXHcrLylbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFnX2V4dHJhY3RlZF9mcm9tX2xhc3Rfb3V0cHV0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aV9wYXJzZXIub3V0cHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19leHRyYWN0ZWRfZnJvbV9sYXN0X291dHB1dCA9IG11bHRpX3BhcnNlci5vdXRwdXRbbXVsdGlfcGFyc2VyLm91dHB1dC5sZW5ndGggLSAxXS5tYXRjaCgvKD86PHx7eyMpXFxzKihcXHcrKS8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ19leHRyYWN0ZWRfZnJvbV9sYXN0X291dHB1dCA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19leHRyYWN0ZWRfZnJvbV9sYXN0X291dHB1dFsxXSAhPT0gdGFnX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfbmV3bGluZShmYWxzZSwgbXVsdGlfcGFyc2VyLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X3Rva2VuKG11bHRpX3BhcnNlci50b2tlbl90ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmN1cnJlbnRfbW9kZSA9ICdDT05URU5UJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfVEFHX1NJTkdMRSc6XG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGFkZCBhIG5ld2xpbmUgYmVmb3JlIGVsZW1lbnRzIHRoYXQgc2hvdWxkIHJlbWFpbiB1bmZvcm1hdHRlZC5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhZ19jaGVjayA9IG11bHRpX3BhcnNlci50b2tlbl90ZXh0Lm1hdGNoKC9eXFxzKjwoW2Etel0rKS9pKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YWdfY2hlY2sgfHwgIW11bHRpX3BhcnNlci5VdGlscy5pbl9hcnJheSh0YWdfY2hlY2tbMV0sIHVuZm9ybWF0dGVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X25ld2xpbmUoZmFsc2UsIG11bHRpX3BhcnNlci5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbihtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5jdXJyZW50X21vZGUgPSAnQ09OVEVOVCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RLX1RBR19IQU5ETEVCQVJTX0VMU0UnOlxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfdG9rZW4obXVsdGlfcGFyc2VyLnRva2VuX3RleHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlfcGFyc2VyLmluZGVudF9jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuaW5kZW50X2NvbnRlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIuY3VycmVudF9tb2RlID0gJ0NPTlRFTlQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdUS19DT05URU5UJzpcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X3Rva2VuKG11bHRpX3BhcnNlci50b2tlbl90ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmN1cnJlbnRfbW9kZSA9ICdUQUcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdUS19TVFlMRSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnVEtfU0NSSVBUJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG11bHRpX3BhcnNlci50b2tlbl90ZXh0ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLnByaW50X25ld2xpbmUoZmFsc2UsIG11bHRpX3BhcnNlci5vdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBtdWx0aV9wYXJzZXIudG9rZW5fdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYmVhdXRpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRfaW5kZW50X2xldmVsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aV9wYXJzZXIudG9rZW5fdHlwZSA9PT0gJ1RLX1NDUklQVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYmVhdXRpZmllciA9IHR5cGVvZiBqc19iZWF1dGlmeSA9PT0gJ2Z1bmN0aW9uJyAmJiBqc19iZWF1dGlmeTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobXVsdGlfcGFyc2VyLnRva2VuX3R5cGUgPT09ICdUS19TVFlMRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYmVhdXRpZmllciA9IHR5cGVvZiBjc3NfYmVhdXRpZnkgPT09ICdmdW5jdGlvbicgJiYgY3NzX2JlYXV0aWZ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRfc2NyaXB0cyA9PT0gXCJrZWVwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHRfaW5kZW50X2xldmVsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5pbmRlbnRfc2NyaXB0cyA9PT0gXCJzZXBhcmF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0X2luZGVudF9sZXZlbCA9IC1tdWx0aV9wYXJzZXIuaW5kZW50X2xldmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZW50YXRpb24gPSBtdWx0aV9wYXJzZXIuZ2V0X2Z1bGxfaW5kZW50KHNjcmlwdF9pbmRlbnRfbGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9iZWF1dGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgQmVhdXRpZmllciBpZiBhdmFsaWFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gX2JlYXV0aWZpZXIodGV4dC5yZXBsYWNlKC9eXFxzKi8sIGluZGVudGF0aW9uKSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbXBseSBpbmRlbnQgdGhlIHN0cmluZyBvdGhlcndpc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd2hpdGUgPSB0ZXh0Lm1hdGNoKC9eXFxzKi8pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbGV2ZWwgPSB3aGl0ZS5tYXRjaCgvW15cXG5cXHJdKiQvKVswXS5zcGxpdChtdWx0aV9wYXJzZXIuaW5kZW50X3N0cmluZykubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVpbmRlbnQgPSBtdWx0aV9wYXJzZXIuZ2V0X2Z1bGxfaW5kZW50KHNjcmlwdF9pbmRlbnRfbGV2ZWwgLSBfbGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL15cXHMqLywgaW5kZW50YXRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyfFxcbi9nLCAnXFxuJyArIHJlaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpX3BhcnNlci5wcmludF90b2tlbl9yYXcoaW5kZW50YXRpb24gKyB0cmltKHRleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aV9wYXJzZXIucHJpbnRfbmV3bGluZShmYWxzZSwgbXVsdGlfcGFyc2VyLm91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbXVsdGlfcGFyc2VyLmN1cnJlbnRfbW9kZSA9ICdUQUcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG11bHRpX3BhcnNlci5sYXN0X3Rva2VuID0gbXVsdGlfcGFyc2VyLnRva2VuX3R5cGU7XG4gICAgICAgICAgICBtdWx0aV9wYXJzZXIubGFzdF90ZXh0ID0gbXVsdGlfcGFyc2VyLnRva2VuX3RleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG11bHRpX3BhcnNlci5vdXRwdXQuam9pbignJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAvLyBBZGQgc3VwcG9ydCBmb3IgcmVxdWlyZS5qc1xuICAgICAgICBkZWZpbmUoW1wiLi9iZWF1dGlmeS5qc1wiLCBcIi4vYmVhdXRpZnktY3NzLmpzXCJdLCBmdW5jdGlvbihqc19iZWF1dGlmeSwgY3NzX2JlYXV0aWZ5KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBodG1sX2JlYXV0aWZ5OiBmdW5jdGlvbihodG1sX3NvdXJjZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZV9odG1sKGh0bWxfc291cmNlLCBvcHRpb25zLCBqc19iZWF1dGlmeSwgY3NzX2JlYXV0aWZ5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBBZGQgc3VwcG9ydCBmb3IgQ29tbW9uSlMuIEp1c3QgcHV0IHRoaXMgZmlsZSBzb21ld2hlcmUgb24geW91ciByZXF1aXJlLnBhdGhzXG4gICAgICAgIC8vIGFuZCB5b3Ugd2lsbCBiZSBhYmxlIHRvIGB2YXIgaHRtbF9iZWF1dGlmeSA9IHJlcXVpcmUoXCJiZWF1dGlmeVwiKS5odG1sX2JlYXV0aWZ5YC5cbiAgICAgICAgdmFyIGpzX2JlYXV0aWZ5ID0gcmVxdWlyZSgnLi9iZWF1dGlmeS5qcycpLmpzX2JlYXV0aWZ5O1xuICAgICAgICB2YXIgY3NzX2JlYXV0aWZ5ID0gcmVxdWlyZSgnLi9iZWF1dGlmeS1jc3MuanMnKS5jc3NfYmVhdXRpZnk7XG5cbiAgICAgICAgZXhwb3J0cy5odG1sX2JlYXV0aWZ5ID0gZnVuY3Rpb24oaHRtbF9zb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHlsZV9odG1sKGh0bWxfc291cmNlLCBvcHRpb25zLCBqc19iZWF1dGlmeSwgY3NzX2JlYXV0aWZ5KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UncmUgcnVubmluZyBhIHdlYiBwYWdlIGFuZCBkb24ndCBoYXZlIGVpdGhlciBvZiB0aGUgYWJvdmUsIGFkZCBvdXIgb25lIGdsb2JhbFxuICAgICAgICB3aW5kb3cuaHRtbF9iZWF1dGlmeSA9IGZ1bmN0aW9uKGh0bWxfc291cmNlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGVfaHRtbChodG1sX3NvdXJjZSwgb3B0aW9ucywgd2luZG93LmpzX2JlYXV0aWZ5LCB3aW5kb3cuY3NzX2JlYXV0aWZ5KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgZXZlbiBoYXZlIHdpbmRvdywgdHJ5IGdsb2JhbC5cbiAgICAgICAgZ2xvYmFsLmh0bWxfYmVhdXRpZnkgPSBmdW5jdGlvbihodG1sX3NvdXJjZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlX2h0bWwoaHRtbF9zb3VyY2UsIG9wdGlvbnMsIGdsb2JhbC5qc19iZWF1dGlmeSwgZ2xvYmFsLmNzc19iZWF1dGlmeSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KCkpO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qanNoaW50IGN1cmx5OnRydWUsIGVxZXFlcTp0cnVlLCBsYXhicmVhazp0cnVlLCBub2VtcHR5OmZhbHNlICovXG4vKlxuXG4gIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gIENvcHlyaWdodCAoYykgMjAwNy0yMDEzIEVpbmFyIExpZWxtYW5pcyBhbmQgY29udHJpYnV0b3JzLlxuXG4gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4gICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4gIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlNcbiAgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4gIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbiAgU09GVFdBUkUuXG5cbiBKUyBCZWF1dGlmaWVyXG4tLS0tLS0tLS0tLS0tLS1cblxuXG4gIFdyaXR0ZW4gYnkgRWluYXIgTGllbG1hbmlzLCA8ZWluYXJAanNiZWF1dGlmaWVyLm9yZz5cbiAgICAgIGh0dHA6Ly9qc2JlYXV0aWZpZXIub3JnL1xuXG4gIE9yaWdpbmFsbHkgY29udmVydGVkIHRvIGphdmFzY3JpcHQgYnkgVml0YWwsIDx2aXRhbDc2QGdtYWlsLmNvbT5cbiAgXCJFbmQgYnJhY2VzIG9uIG93biBsaW5lXCIgYWRkZWQgYnkgQ2hyaXMgSi4gU2h1bGwsIDxjaHJpc2pzaHVsbEBnbWFpbC5jb20+XG4gIFBhcnNpbmcgaW1wcm92ZW1lbnRzIGZvciBicmFjZS1sZXNzIHN0YXRlbWVudHMgYnkgTGlhbSBOZXdtYW4gPGJpdHdpc2VtYW5AZ21haWwuY29tPlxuXG5cbiAgVXNhZ2U6XG4gICAganNfYmVhdXRpZnkoanNfc291cmNlX3RleHQpO1xuICAgIGpzX2JlYXV0aWZ5KGpzX3NvdXJjZV90ZXh0LCBvcHRpb25zKTtcblxuICBUaGUgb3B0aW9ucyBhcmU6XG4gICAgaW5kZW50X3NpemUgKGRlZmF1bHQgNCkgICAgICAgICAgLSBpbmRlbnRhdGlvbiBzaXplLFxuICAgIGluZGVudF9jaGFyIChkZWZhdWx0IHNwYWNlKSAgICAgIC0gY2hhcmFjdGVyIHRvIGluZGVudCB3aXRoLFxuICAgIHByZXNlcnZlX25ld2xpbmVzIChkZWZhdWx0IHRydWUpIC0gd2hldGhlciBleGlzdGluZyBsaW5lIGJyZWFrcyBzaG91bGQgYmUgcHJlc2VydmVkLFxuICAgIG1heF9wcmVzZXJ2ZV9uZXdsaW5lcyAoZGVmYXVsdCB1bmxpbWl0ZWQpIC0gbWF4aW11bSBudW1iZXIgb2YgbGluZSBicmVha3MgdG8gYmUgcHJlc2VydmVkIGluIG9uZSBjaHVuayxcblxuICAgIGpzbGludF9oYXBweSAoZGVmYXVsdCBmYWxzZSkgLSBpZiB0cnVlLCB0aGVuIGpzbGludC1zdHJpY3RlciBtb2RlIGlzIGVuZm9yY2VkLlxuXG4gICAgICAgICAgICBqc2xpbnRfaGFwcHkgICAhanNsaW50X2hhcHB5XG4gICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICBmdW5jdGlvbiAoKSAgICAgIGZ1bmN0aW9uKClcblxuICAgIGJyYWNlX3N0eWxlIChkZWZhdWx0IFwiY29sbGFwc2VcIikgLSBcImNvbGxhcHNlXCIgfCBcImV4cGFuZFwiIHwgXCJlbmQtZXhwYW5kXCJcbiAgICAgICAgICAgIHB1dCBicmFjZXMgb24gdGhlIHNhbWUgbGluZSBhcyBjb250cm9sIHN0YXRlbWVudHMgKGRlZmF1bHQpLCBvciBwdXQgYnJhY2VzIG9uIG93biBsaW5lIChBbGxtYW4gLyBBTlNJIHN0eWxlKSwgb3IganVzdCBwdXQgZW5kIGJyYWNlcyBvbiBvd24gbGluZS5cblxuICAgIHNwYWNlX2JlZm9yZV9jb25kaXRpb25hbCAoZGVmYXVsdCB0cnVlKSAtIHNob3VsZCB0aGUgc3BhY2UgYmVmb3JlIGNvbmRpdGlvbmFsIHN0YXRlbWVudCBiZSBhZGRlZCwgXCJpZih0cnVlKVwiIHZzIFwiaWYgKHRydWUpXCIsXG5cbiAgICB1bmVzY2FwZV9zdHJpbmdzIChkZWZhdWx0IGZhbHNlKSAtIHNob3VsZCBwcmludGFibGUgY2hhcmFjdGVycyBpbiBzdHJpbmdzIGVuY29kZWQgaW4gXFx4Tk4gbm90YXRpb24gYmUgdW5lc2NhcGVkLCBcImV4YW1wbGVcIiB2cyBcIlxceDY1XFx4NzhcXHg2MVxceDZkXFx4NzBcXHg2Y1xceDY1XCJcblxuICAgIHdyYXBfbGluZV9sZW5ndGggKGRlZmF1bHQgdW5saW1pdGVkKSAtIGxpbmVzIHNob3VsZCB3cmFwIGF0IG5leHQgb3Bwb3J0dW5pdHkgYWZ0ZXIgdGhpcyBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAgICAgICAgICBOT1RFOiBUaGlzIGlzIG5vdCBhIGhhcmQgbGltaXQuIExpbmVzIHdpbGwgY29udGludWUgdW50aWwgYSBwb2ludCB3aGVyZSBhIG5ld2xpbmUgd291bGRcbiAgICAgICAgICAgICAgICBiZSBwcmVzZXJ2ZWQgaWYgaXQgd2VyZSBwcmVzZW50LlxuXG4gICAgZS5nXG5cbiAgICBqc19iZWF1dGlmeShqc19zb3VyY2VfdGV4dCwge1xuICAgICAgJ2luZGVudF9zaXplJzogMSxcbiAgICAgICdpbmRlbnRfY2hhcic6ICdcXHQnXG4gICAgfSk7XG5cbiovXG5cblxuKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGpzX2JlYXV0aWZ5KGpzX3NvdXJjZV90ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgYmVhdXRpZmllciA9IG5ldyBCZWF1dGlmaWVyKGpzX3NvdXJjZV90ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGJlYXV0aWZpZXIuYmVhdXRpZnkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBCZWF1dGlmaWVyKGpzX3NvdXJjZV90ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgaW5wdXQsIG91dHB1dF9saW5lcztcbiAgICAgICAgdmFyIHRva2VuX3RleHQsIHRva2VuX3R5cGUsIGxhc3RfdHlwZSwgbGFzdF9sYXN0X3RleHQsIGluZGVudF9zdHJpbmc7XG4gICAgICAgIHZhciBmbGFncywgcHJldmlvdXNfZmxhZ3MsIGZsYWdfc3RvcmU7XG4gICAgICAgIHZhciB3aGl0ZXNwYWNlLCB3b3JkY2hhciwgcHVuY3QsIHBhcnNlcl9wb3MsIGxpbmVfc3RhcnRlcnMsIGRpZ2l0cztcbiAgICAgICAgdmFyIHByZWZpeDtcbiAgICAgICAgdmFyIGlucHV0X3dhbnRlZF9uZXdsaW5lO1xuICAgICAgICB2YXIgb3V0cHV0X3dyYXBwZWQsIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW47XG4gICAgICAgIHZhciBpbnB1dF9sZW5ndGgsIG5fbmV3bGluZXMsIHdoaXRlc3BhY2VfYmVmb3JlX3Rva2VuO1xuICAgICAgICB2YXIgaGFuZGxlcnMsIE1PREUsIG9wdDtcbiAgICAgICAgdmFyIHByZWluZGVudF9zdHJpbmcgPSAnJztcblxuICAgICAgICB3aGl0ZXNwYWNlID0gXCJcXG5cXHJcXHQgXCIuc3BsaXQoJycpO1xuICAgICAgICB3b3JkY2hhciA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OV8kJy5zcGxpdCgnJyk7XG4gICAgICAgIGRpZ2l0cyA9ICcwMTIzNDU2Nzg5Jy5zcGxpdCgnJyk7XG5cbiAgICAgICAgcHVuY3QgPSAnKyAtICogLyAlICYgKysgLS0gPSArPSAtPSAqPSAvPSAlPSA9PSA9PT0gIT0gIT09ID4gPCA+PSA8PSA+PiA8PCA+Pj4gPj4+PSA+Pj0gPDw9ICYmICY9IHwgfHwgISAhISAsIDogPyBeIF49IHw9IDo6JztcbiAgICAgICAgcHVuY3QgKz0gJyA8JT0gPCUgJT4gPD89IDw/ID8+JzsgLy8gdHJ5IHRvIGJlIGEgZ29vZCBib3kgYW5kIHRyeSBub3QgdG8gYnJlYWsgdGhlIG1hcmt1cCBsYW5ndWFnZSBpZGVudGlmaWVyc1xuICAgICAgICBwdW5jdCA9IHB1bmN0LnNwbGl0KCcgJyk7XG5cbiAgICAgICAgLy8gd29yZHMgd2hpY2ggc2hvdWxkIGFsd2F5cyBzdGFydCBvbiBuZXcgbGluZS5cbiAgICAgICAgbGluZV9zdGFydGVycyA9ICdjb250aW51ZSx0cnksdGhyb3cscmV0dXJuLHZhcixpZixzd2l0Y2gsY2FzZSxkZWZhdWx0LGZvcix3aGlsZSxicmVhayxmdW5jdGlvbicuc3BsaXQoJywnKTtcblxuICAgICAgICBNT0RFID0ge1xuICAgICAgICAgICAgQmxvY2tTdGF0ZW1lbnQ6ICdCbG9ja1N0YXRlbWVudCcsIC8vICdCTE9DSydcbiAgICAgICAgICAgIFN0YXRlbWVudDogJ1N0YXRlbWVudCcsIC8vICdTVEFURU1FTlQnXG4gICAgICAgICAgICBPYmplY3RMaXRlcmFsOiAnT2JqZWN0TGl0ZXJhbCcsIC8vICdPQkpFQ1QnLFxuICAgICAgICAgICAgQXJyYXlMaXRlcmFsOiAnQXJyYXlMaXRlcmFsJywgLy8nW0VYUFJFU1NJT05dJyxcbiAgICAgICAgICAgIEZvckluaXRpYWxpemVyOiAnRm9ySW5pdGlhbGl6ZXInLCAvLycoRk9SLUVYUFJFU1NJT04pJyxcbiAgICAgICAgICAgIENvbmRpdGlvbmFsOiAnQ29uZGl0aW9uYWwnLCAvLycoQ09ORC1FWFBSRVNTSU9OKScsXG4gICAgICAgICAgICBFeHByZXNzaW9uOiAnRXhwcmVzc2lvbicgLy8nKEVYUFJFU1NJT04pJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGhhbmRsZXJzID0ge1xuICAgICAgICAgICAgJ1RLX1NUQVJUX0VYUFInOiBoYW5kbGVfc3RhcnRfZXhwcixcbiAgICAgICAgICAgICdUS19FTkRfRVhQUic6IGhhbmRsZV9lbmRfZXhwcixcbiAgICAgICAgICAgICdUS19TVEFSVF9CTE9DSyc6IGhhbmRsZV9zdGFydF9ibG9jayxcbiAgICAgICAgICAgICdUS19FTkRfQkxPQ0snOiBoYW5kbGVfZW5kX2Jsb2NrLFxuICAgICAgICAgICAgJ1RLX1dPUkQnOiBoYW5kbGVfd29yZCxcbiAgICAgICAgICAgICdUS19TRU1JQ09MT04nOiBoYW5kbGVfc2VtaWNvbG9uLFxuICAgICAgICAgICAgJ1RLX1NUUklORyc6IGhhbmRsZV9zdHJpbmcsXG4gICAgICAgICAgICAnVEtfRVFVQUxTJzogaGFuZGxlX2VxdWFscyxcbiAgICAgICAgICAgICdUS19PUEVSQVRPUic6IGhhbmRsZV9vcGVyYXRvcixcbiAgICAgICAgICAgICdUS19DT01NQSc6IGhhbmRsZV9jb21tYSxcbiAgICAgICAgICAgICdUS19CTE9DS19DT01NRU5UJzogaGFuZGxlX2Jsb2NrX2NvbW1lbnQsXG4gICAgICAgICAgICAnVEtfSU5MSU5FX0NPTU1FTlQnOiBoYW5kbGVfaW5saW5lX2NvbW1lbnQsXG4gICAgICAgICAgICAnVEtfQ09NTUVOVCc6IGhhbmRsZV9jb21tZW50LFxuICAgICAgICAgICAgJ1RLX0RPVCc6IGhhbmRsZV9kb3QsXG4gICAgICAgICAgICAnVEtfVU5LTk9XTic6IGhhbmRsZV91bmtub3duXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlX2ZsYWdzKGZsYWdzX2Jhc2UsIG1vZGUpIHtcbiAgICAgICAgICAgIHZhciBuZXh0X2luZGVudF9sZXZlbCA9IDA7XG4gICAgICAgICAgICBpZiAoZmxhZ3NfYmFzZSkge1xuICAgICAgICAgICAgICAgIG5leHRfaW5kZW50X2xldmVsID0gZmxhZ3NfYmFzZS5pbmRlbnRhdGlvbl9sZXZlbDtcbiAgICAgICAgICAgICAgICBuZXh0X2luZGVudF9sZXZlbCArPSAoZmxhZ3NfYmFzZS52YXJfbGluZSAmJiBmbGFnc19iYXNlLnZhcl9saW5lX3JlaW5kZW50ZWQpID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFqdXN0X2FkZGVkX25ld2xpbmUoKSAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFnc19iYXNlLmxpbmVfaW5kZW50X2xldmVsID4gbmV4dF9pbmRlbnRfbGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dF9pbmRlbnRfbGV2ZWwgPSBmbGFnc19iYXNlLmxpbmVfaW5kZW50X2xldmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5leHRfZmxhZ3MgPSB7XG4gICAgICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGZsYWdzX2Jhc2UsXG4gICAgICAgICAgICAgICAgbGFzdF90ZXh0OiBmbGFnc19iYXNlID8gZmxhZ3NfYmFzZS5sYXN0X3RleHQgOiAnJywgLy8gbGFzdCB0b2tlbiB0ZXh0XG4gICAgICAgICAgICAgICAgbGFzdF93b3JkOiBmbGFnc19iYXNlID8gZmxhZ3NfYmFzZS5sYXN0X3dvcmQgOiAnJywgLy8gbGFzdCAnVEtfV09SRCcgcGFzc2VkXG4gICAgICAgICAgICAgICAgdmFyX2xpbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhcl9saW5lX3RhaW50ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhcl9saW5lX3JlaW5kZW50ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluX2h0bWxfY29tbWVudDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbXVsdGlsaW5lX2ZyYW1lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpZl9ibG9jazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG9fYmxvY2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvX3doaWxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpbl9jYXNlX3N0YXRlbWVudDogZmFsc2UsIC8vIHN3aXRjaCguLil7IElOU0lERSBIRVJFIH1cbiAgICAgICAgICAgICAgICBpbl9jYXNlOiBmYWxzZSwgLy8gd2UncmUgb24gdGhlIGV4YWN0IGxpbmUgd2l0aCBcImNhc2UgMDpcIlxuICAgICAgICAgICAgICAgIGNhc2VfYm9keTogZmFsc2UsIC8vIHRoZSBpbmRlbnRlZCBjYXNlLWFjdGlvbiBibG9ja1xuICAgICAgICAgICAgICAgIGluZGVudGF0aW9uX2xldmVsOiBuZXh0X2luZGVudF9sZXZlbCxcbiAgICAgICAgICAgICAgICBsaW5lX2luZGVudF9sZXZlbDogZmxhZ3NfYmFzZSA/IGZsYWdzX2Jhc2UubGluZV9pbmRlbnRfbGV2ZWwgOiBuZXh0X2luZGVudF9sZXZlbCxcbiAgICAgICAgICAgICAgICBzdGFydF9saW5lX2luZGV4OiBvdXRwdXRfbGluZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGhhZF9jb21tZW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0ZXJuYXJ5X2RlcHRoOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dF9mbGFncztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzaW5nIG9iamVjdCBpbnN0ZWFkIG9mIHN0cmluZyB0byBhbGxvdyBmb3IgbGF0ZXIgZXhwYW5zaW9uIG9mIGluZm8gYWJvdXQgZWFjaCBsaW5lXG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlX291dHB1dF9saW5lKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvbWUgaW50ZXJwcmV0ZXJzIGhhdmUgdW5leHBlY3RlZCByZXN1bHRzIHdpdGggZm9vID0gYmF6IHx8IGJhcjtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBvcHRpb25zIDoge307XG4gICAgICAgIG9wdCA9IHt9O1xuXG4gICAgICAgIC8vIGNvbXBhdGliaWxpdHlcbiAgICAgICAgaWYgKG9wdGlvbnMuc3BhY2VfYWZ0ZXJfYW5vbl9mdW5jdGlvbiAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuanNsaW50X2hhcHB5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuanNsaW50X2hhcHB5ID0gb3B0aW9ucy5zcGFjZV9hZnRlcl9hbm9uX2Z1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmJyYWNlc19vbl9vd25fbGluZSAhPT0gdW5kZWZpbmVkKSB7IC8vZ3JhY2VmdWwgaGFuZGxpbmcgb2YgZGVwcmVjYXRlZCBvcHRpb25cbiAgICAgICAgICAgIG9wdC5icmFjZV9zdHlsZSA9IG9wdGlvbnMuYnJhY2VzX29uX293bl9saW5lID8gXCJleHBhbmRcIiA6IFwiY29sbGFwc2VcIjtcbiAgICAgICAgfVxuICAgICAgICBvcHQuYnJhY2Vfc3R5bGUgPSBvcHRpb25zLmJyYWNlX3N0eWxlID8gb3B0aW9ucy5icmFjZV9zdHlsZSA6IChvcHQuYnJhY2Vfc3R5bGUgPyBvcHQuYnJhY2Vfc3R5bGUgOiBcImNvbGxhcHNlXCIpO1xuXG4gICAgICAgIC8vIGdyYWNlZnVsIGhhbmRsaW5nIG9mIGRlcHJlY2F0ZWQgb3B0aW9uXG4gICAgICAgIGlmIChvcHQuYnJhY2Vfc3R5bGUgPT09IFwiZXhwYW5kLXN0cmljdFwiKSB7XG4gICAgICAgICAgICBvcHQuYnJhY2Vfc3R5bGUgPSBcImV4cGFuZFwiO1xuICAgICAgICB9XG5cblxuICAgICAgICBvcHQuaW5kZW50X3NpemUgPSBvcHRpb25zLmluZGVudF9zaXplID8gcGFyc2VJbnQob3B0aW9ucy5pbmRlbnRfc2l6ZSwgMTApIDogNDtcbiAgICAgICAgb3B0LmluZGVudF9jaGFyID0gb3B0aW9ucy5pbmRlbnRfY2hhciA/IG9wdGlvbnMuaW5kZW50X2NoYXIgOiAnICc7XG4gICAgICAgIG9wdC5wcmVzZXJ2ZV9uZXdsaW5lcyA9IChvcHRpb25zLnByZXNlcnZlX25ld2xpbmVzID09PSB1bmRlZmluZWQpID8gdHJ1ZSA6IG9wdGlvbnMucHJlc2VydmVfbmV3bGluZXM7XG4gICAgICAgIG9wdC5icmVha19jaGFpbmVkX21ldGhvZHMgPSAob3B0aW9ucy5icmVha19jaGFpbmVkX21ldGhvZHMgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG9wdGlvbnMuYnJlYWtfY2hhaW5lZF9tZXRob2RzO1xuICAgICAgICBvcHQubWF4X3ByZXNlcnZlX25ld2xpbmVzID0gKG9wdGlvbnMubWF4X3ByZXNlcnZlX25ld2xpbmVzID09PSB1bmRlZmluZWQpID8gMCA6IHBhcnNlSW50KG9wdGlvbnMubWF4X3ByZXNlcnZlX25ld2xpbmVzLCAxMCk7XG4gICAgICAgIG9wdC5zcGFjZV9pbl9wYXJlbiA9IChvcHRpb25zLnNwYWNlX2luX3BhcmVuID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBvcHRpb25zLnNwYWNlX2luX3BhcmVuO1xuICAgICAgICBvcHQuanNsaW50X2hhcHB5ID0gKG9wdGlvbnMuanNsaW50X2hhcHB5ID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBvcHRpb25zLmpzbGludF9oYXBweTtcbiAgICAgICAgb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24gPSAob3B0aW9ucy5rZWVwX2FycmF5X2luZGVudGF0aW9uID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBvcHRpb25zLmtlZXBfYXJyYXlfaW5kZW50YXRpb247XG4gICAgICAgIG9wdC5zcGFjZV9iZWZvcmVfY29uZGl0aW9uYWwgPSAob3B0aW9ucy5zcGFjZV9iZWZvcmVfY29uZGl0aW9uYWwgPT09IHVuZGVmaW5lZCkgPyB0cnVlIDogb3B0aW9ucy5zcGFjZV9iZWZvcmVfY29uZGl0aW9uYWw7XG4gICAgICAgIG9wdC51bmVzY2FwZV9zdHJpbmdzID0gKG9wdGlvbnMudW5lc2NhcGVfc3RyaW5ncyA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogb3B0aW9ucy51bmVzY2FwZV9zdHJpbmdzO1xuICAgICAgICBvcHQud3JhcF9saW5lX2xlbmd0aCA9IChvcHRpb25zLndyYXBfbGluZV9sZW5ndGggPT09IHVuZGVmaW5lZCkgPyAwIDogcGFyc2VJbnQob3B0aW9ucy53cmFwX2xpbmVfbGVuZ3RoLCAxMCk7XG4gICAgICAgIG9wdC5lNHggPSAob3B0aW9ucy5lNHggPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG9wdGlvbnMuZTR4O1xuXG4gICAgICAgIGlmKG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyl7XG4gICAgICAgICAgICBvcHQuaW5kZW50X2NoYXIgPSAnXFx0JztcbiAgICAgICAgICAgIG9wdC5pbmRlbnRfc2l6ZSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgaW5kZW50X3N0cmluZyA9ICcnO1xuICAgICAgICB3aGlsZSAob3B0LmluZGVudF9zaXplID4gMCkge1xuICAgICAgICAgICAgaW5kZW50X3N0cmluZyArPSBvcHQuaW5kZW50X2NoYXI7XG4gICAgICAgICAgICBvcHQuaW5kZW50X3NpemUgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChqc19zb3VyY2VfdGV4dCAmJiAoanNfc291cmNlX3RleHQuY2hhckF0KDApID09PSAnICcgfHwganNfc291cmNlX3RleHQuY2hhckF0KDApID09PSAnXFx0JykpIHtcbiAgICAgICAgICAgIHByZWluZGVudF9zdHJpbmcgKz0ganNfc291cmNlX3RleHQuY2hhckF0KDApO1xuICAgICAgICAgICAganNfc291cmNlX3RleHQgPSBqc19zb3VyY2VfdGV4dC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQgPSBqc19zb3VyY2VfdGV4dDtcbiAgICAgICAgLy8gY2FjaGUgdGhlIHNvdXJjZSdzIGxlbmd0aC5cbiAgICAgICAgaW5wdXRfbGVuZ3RoID0ganNfc291cmNlX3RleHQubGVuZ3RoO1xuXG4gICAgICAgIGxhc3RfdHlwZSA9ICdUS19TVEFSVF9CTE9DSyc7IC8vIGxhc3QgdG9rZW4gdHlwZVxuICAgICAgICBsYXN0X2xhc3RfdGV4dCA9ICcnOyAvLyBwcmUtbGFzdCB0b2tlbiB0ZXh0XG4gICAgICAgIG91dHB1dF9saW5lcyA9IFtjcmVhdGVfb3V0cHV0X2xpbmUoKV07XG4gICAgICAgIG91dHB1dF93cmFwcGVkID0gZmFsc2U7XG4gICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSBmYWxzZTtcbiAgICAgICAgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4gPSBbXTtcblxuICAgICAgICAvLyBTdGFjayBvZiBwYXJzaW5nL2Zvcm1hdHRpbmcgc3RhdGVzLCBpbmNsdWRpbmcgTU9ERS5cbiAgICAgICAgLy8gV2UgdG9rZW5pemUsIHBhcnNlLCBhbmQgb3V0cHV0IGluIGFuIGFsbW9zdCBwdXJlbHkgYSBmb3J3YXJkLW9ubHkgc3RyZWFtIG9mIHRva2VuIGlucHV0XG4gICAgICAgIC8vIGFuZCBmb3JtYXR0ZWQgb3V0cHV0LiAgVGhpcyBtYWtlcyB0aGUgYmVhdXRpZmllciBsZXNzIGFjY3VyYXRlIHRoYW4gZnVsbCBwYXJzZXJzXG4gICAgICAgIC8vIGJ1dCBhbHNvIGZhciBtb3JlIHRvbGVyYW50IG9mIHN5bnRheCBlcnJvcnMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZvciBleGFtcGxlLCB0aGUgZGVmYXVsdCBtb2RlIGlzIE1PREUuQmxvY2tTdGF0ZW1lbnQuIElmIHdlIHNlZSBhICd7JyB3ZSBwdXNoIGEgbmV3IGZyYW1lIG9mIHR5cGVcbiAgICAgICAgLy8gTU9ERS5CbG9ja1N0YXRlbWVudCBvbiB0aGUgdGhlIHN0YWNrLCBldmVuIHRob3VnaCBpdCBjb3VsZCBiZSBvYmplY3QgbGl0ZXJhbC4gIElmIHdlIGxhdGVyXG4gICAgICAgIC8vIGVuY291bnRlciBhIFwiOlwiLCB3ZSdsbCBzd2l0Y2ggdG8gdG8gTU9ERS5PYmplY3RMaXRlcmFsLiAgSWYgd2UgdGhlbiBzZWUgYSBcIjtcIixcbiAgICAgICAgLy8gbW9zdCBmdWxsIHBhcnNlcnMgd291bGQgZGllLCBidXQgdGhlIGJlYXV0aWZpZXIgZ3JhY2VmdWxseSBmYWxscyBiYWNrIHRvXG4gICAgICAgIC8vIE1PREUuQmxvY2tTdGF0ZW1lbnQgYW5kIGNvbnRpbnVlcyBvbi5cbiAgICAgICAgZmxhZ19zdG9yZSA9IFtdO1xuICAgICAgICBzZXRfbW9kZShNT0RFLkJsb2NrU3RhdGVtZW50KTtcblxuICAgICAgICBwYXJzZXJfcG9zID0gMDtcblxuICAgICAgICB0aGlzLmJlYXV0aWZ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKmpzaGludCBvbmV2YXI6dHJ1ZSAqL1xuICAgICAgICAgICAgdmFyIHQsIGksIGtlZXBfd2hpdGVzcGFjZSwgc3dlZXRfY29kZTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB0ID0gZ2V0X25leHRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICB0b2tlbl90ZXh0ID0gdFswXTtcbiAgICAgICAgICAgICAgICB0b2tlbl90eXBlID0gdFsxXTtcblxuICAgICAgICAgICAgICAgIGlmICh0b2tlbl90eXBlID09PSAnVEtfRU9GJykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBrZWVwX3doaXRlc3BhY2UgPSBvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbiAmJiBpc19hcnJheShmbGFncy5tb2RlKTtcbiAgICAgICAgICAgICAgICBpbnB1dF93YW50ZWRfbmV3bGluZSA9IG5fbmV3bGluZXMgPiAwO1xuXG4gICAgICAgICAgICAgICAgaWYgKGtlZXBfd2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbl9uZXdsaW5lczsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKGkgPiAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQubWF4X3ByZXNlcnZlX25ld2xpbmVzICYmIG5fbmV3bGluZXMgPiBvcHQubWF4X3ByZXNlcnZlX25ld2xpbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuX25ld2xpbmVzID0gb3B0Lm1heF9wcmVzZXJ2ZV9uZXdsaW5lcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQucHJlc2VydmVfbmV3bGluZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuX25ld2xpbmVzID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbl9uZXdsaW5lczsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbdG9rZW5fdHlwZV0oKTtcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBjbGVhbmVzdCBoYW5kbGluZyBvZiBpbmxpbmUgY29tbWVudHMgaXMgdG8gdHJlYXQgdGhlbSBhcyB0aG91Z2ggdGhleSBhcmVuJ3QgdGhlcmUuXG4gICAgICAgICAgICAgICAgLy8gSnVzdCBjb250aW51ZSBmb3JtYXR0aW5nIGFuZCB0aGUgYmVoYXZpb3Igc2hvdWxkIGJlIGxvZ2ljYWwuXG4gICAgICAgICAgICAgICAgLy8gQWxzbyBpZ25vcmUgdW5rbm93biB0b2tlbnMuICBBZ2FpbiwgdGhpcyBzaG91bGQgcmVzdWx0IGluIGJldHRlciBiZWhhdmlvci5cbiAgICAgICAgICAgICAgICBpZiAodG9rZW5fdHlwZSAhPT0gJ1RLX0lOTElORV9DT01NRU5UJyAmJiB0b2tlbl90eXBlICE9PSAnVEtfQ09NTUVOVCcgJiZcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5fdHlwZSAhPT0gJ1RLX0JMT0NLX0NPTU1FTlQnICYmIHRva2VuX3R5cGUgIT09ICdUS19VTktOT1dOJykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0X2xhc3RfdGV4dCA9IGZsYWdzLmxhc3RfdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgbGFzdF90eXBlID0gdG9rZW5fdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MubGFzdF90ZXh0ID0gdG9rZW5fdGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmxhZ3MuaGFkX2NvbW1lbnQgPSAodG9rZW5fdHlwZSA9PT0gJ1RLX0lOTElORV9DT01NRU5UJyB8fCB0b2tlbl90eXBlID09PSAnVEtfQ09NTUVOVCdcbiAgICAgICAgICAgICAgICAgICAgfHwgdG9rZW5fdHlwZSA9PT0gJ1RLX0JMT0NLX0NPTU1FTlQnKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBzd2VldF9jb2RlID0gb3V0cHV0X2xpbmVzWzBdLnRleHQuam9pbignJyk7XG4gICAgICAgICAgICBmb3IgKHZhciBsaW5lX2luZGV4ID0gMTsgbGluZV9pbmRleCA8IG91dHB1dF9saW5lcy5sZW5ndGg7IGxpbmVfaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIHN3ZWV0X2NvZGUgKz0gJ1xcbicgKyBvdXRwdXRfbGluZXNbbGluZV9pbmRleF0udGV4dC5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3ZWV0X2NvZGUgPSBzd2VldF9jb2RlLnJlcGxhY2UoL1tcXHJcXG4gXSskLywgJycpO1xuICAgICAgICAgICAgcmV0dXJuIHN3ZWV0X2NvZGU7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdHJpbV9vdXRwdXQoZWF0X25ld2xpbmVzKSB7XG4gICAgICAgICAgICBlYXRfbmV3bGluZXMgPSAoZWF0X25ld2xpbmVzID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBlYXRfbmV3bGluZXM7XG5cbiAgICAgICAgICAgIGlmIChvdXRwdXRfbGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdHJpbV9vdXRwdXRfbGluZShvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdLCBlYXRfbmV3bGluZXMpO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGVhdF9uZXdsaW5lcyAmJiBvdXRwdXRfbGluZXMubGVuZ3RoID4gMSAmJlxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdLnRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9saW5lcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJpbV9vdXRwdXRfbGluZShvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdLCBlYXRfbmV3bGluZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyaW1fb3V0cHV0X2xpbmUobGluZSkge1xuICAgICAgICAgICAgd2hpbGUgKGxpbmUudGV4dC5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAobGluZS50ZXh0W2xpbmUudGV4dC5sZW5ndGggLSAxXSA9PT0gJyAnIHx8XG4gICAgICAgICAgICAgICAgICAgIGxpbmUudGV4dFtsaW5lLnRleHQubGVuZ3RoIC0gMV0gPT09IGluZGVudF9zdHJpbmcgfHxcbiAgICAgICAgICAgICAgICAgICAgbGluZS50ZXh0W2xpbmUudGV4dC5sZW5ndGggLSAxXSA9PT0gcHJlaW5kZW50X3N0cmluZykpIHtcbiAgICAgICAgICAgICAgICBsaW5lLnRleHQucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0cmltKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIGNvdWxkIHVzZSBqdXN0IHN0cmluZy5zcGxpdCwgYnV0XG4gICAgICAgIC8vIElFIGRvZXNuJ3QgbGlrZSByZXR1cm5pbmcgZW1wdHkgc3RyaW5nc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNwbGl0X25ld2xpbmVzKHMpIHtcbiAgICAgICAgICAgIC8vcmV0dXJuIHMuc3BsaXQoL1xceDBkXFx4MGF8XFx4MGEvKTtcblxuICAgICAgICAgICAgcyA9IHMucmVwbGFjZSgvXFx4MGQvZywgJycpO1xuICAgICAgICAgICAgdmFyIG91dCA9IFtdLFxuICAgICAgICAgICAgICAgIGlkeCA9IHMuaW5kZXhPZihcIlxcblwiKTtcbiAgICAgICAgICAgIHdoaWxlIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0LnB1c2gocy5zdWJzdHJpbmcoMCwgaWR4KSk7XG4gICAgICAgICAgICAgICAgcyA9IHMuc3Vic3RyaW5nKGlkeCArIDEpO1xuICAgICAgICAgICAgICAgIGlkeCA9IHMuaW5kZXhPZihcIlxcblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGp1c3RfYWRkZWRfbmV3bGluZSgpIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBsaW5lLnRleHQubGVuZ3RoID09PSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24ganVzdF9hZGRlZF9ibGFua2xpbmUoKSB7XG4gICAgICAgICAgICBpZiAoanVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0X2xpbmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gc3RhcnQgb2YgdGhlIGZpbGUgYW5kIG5ld2xpbmUgPSBibGFua1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsaW5lID0gb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZS50ZXh0Lmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoZm9yY2VfbGluZXdyYXApIHtcbiAgICAgICAgICAgIGZvcmNlX2xpbmV3cmFwID0gKGZvcmNlX2xpbmV3cmFwID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBmb3JjZV9saW5ld3JhcDtcbiAgICAgICAgICAgIGlmIChvcHQud3JhcF9saW5lX2xlbmd0aCAmJiAhZm9yY2VfbGluZXdyYXApIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgdmFyIHByb3Bvc2VkX2xpbmVfbGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAvLyBuZXZlciB3cmFwIHRoZSBmaXJzdCB0b2tlbiBvZiBhIGxpbmUuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUudGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3Bvc2VkX2xpbmVfbGVuZ3RoID0gbGluZS50ZXh0LmpvaW4oJycpLmxlbmd0aCArIHRva2VuX3RleHQubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID8gMSA6IDApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcG9zZWRfbGluZV9sZW5ndGggPj0gb3B0LndyYXBfbGluZV9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlX2xpbmV3cmFwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoKG9wdC5wcmVzZXJ2ZV9uZXdsaW5lcyAmJiBpbnB1dF93YW50ZWRfbmV3bGluZSkgfHwgZm9yY2VfbGluZXdyYXApICYmICFqdXN0X2FkZGVkX25ld2xpbmUoKSkge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoZmFsc2UsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gRXhwcmVzc2lvbnMgYW5kIGFycmF5IGxpdGVyYWxzIGFscmVhZHkgaW5kZW50IHRoZWlyIGNvbnRlbnRzLlxuICAgICAgICAgICAgICAgIGlmICghKGlzX2FycmF5KGZsYWdzLm1vZGUpIHx8IGlzX2V4cHJlc3Npb24oZmxhZ3MubW9kZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF93cmFwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludF9uZXdsaW5lKGZvcmNlX25ld2xpbmUsIHByZXNlcnZlX3N0YXRlbWVudF9mbGFncykge1xuICAgICAgICAgICAgb3V0cHV0X3dyYXBwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKCFwcmVzZXJ2ZV9zdGF0ZW1lbnRfZmxhZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MubGFzdF90ZXh0ICE9PSAnOycpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGZsYWdzLm1vZGUgPT09IE1PREUuU3RhdGVtZW50ICYmICFmbGFncy5pZl9ibG9jayAmJiAhZmxhZ3MuZG9fYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3V0cHV0X2xpbmVzLmxlbmd0aCA9PT0gMSAmJiBqdXN0X2FkZGVkX25ld2xpbmUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gbm8gbmV3bGluZSBvbiBzdGFydCBvZiBmaWxlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3JjZV9uZXdsaW5lIHx8ICFqdXN0X2FkZGVkX25ld2xpbmUoKSkge1xuICAgICAgICAgICAgICAgIGZsYWdzLm11bHRpbGluZV9mcmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2xpbmVzLnB1c2goY3JlYXRlX291dHB1dF9saW5lKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJpbnRfdG9rZW5fbGluZV9pbmRlbnRhdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChqdXN0X2FkZGVkX25ld2xpbmUoKSkge1xuICAgICAgICAgICAgICAgIHZhciBsaW5lID0gb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAob3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24gJiYgaXNfYXJyYXkoZmxhZ3MubW9kZSkgJiYgaW5wdXRfd2FudGVkX25ld2xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJldmVudCByZW1vdmluZyBvZiB0aGlzIHdoaXRlc3BhY2UgYXMgcmVkdW5kYW50XG4gICAgICAgICAgICAgICAgICAgIGxpbmUudGV4dC5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aGl0ZXNwYWNlX2JlZm9yZV90b2tlbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS50ZXh0LnB1c2god2hpdGVzcGFjZV9iZWZvcmVfdG9rZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWluZGVudF9zdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUudGV4dC5wdXNoKHByZWluZGVudF9zdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfaW5kZW50X3N0cmluZyhmbGFncy5pbmRlbnRhdGlvbl9sZXZlbCArXG4gICAgICAgICAgICAgICAgICAgICAgICAoZmxhZ3MudmFyX2xpbmUgJiYgZmxhZ3MudmFyX2xpbmVfcmVpbmRlbnRlZCA/IDEgOiAwKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAob3V0cHV0X3dyYXBwZWQgPyAxIDogMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByaW50X2luZGVudF9zdHJpbmcobGV2ZWwpIHtcbiAgICAgICAgICAgIC8vIE5ldmVyIGluZGVudCB5b3VyIGZpcnN0IG91dHB1dCBpbmRlbnQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBmaWxlXG4gICAgICAgICAgICBpZiAob3V0cHV0X2xpbmVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICBmbGFncy5saW5lX2luZGVudF9sZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGV2ZWw7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHQucHVzaChpbmRlbnRfc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcmludF90b2tlbl9zcGFjZV9iZWZvcmUoKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9IG91dHB1dF9saW5lc1tvdXRwdXRfbGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAob3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiAmJiBsaW5lLnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3Rfb3V0cHV0ID0gbGluZS50ZXh0W2xpbmUudGV4dC5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdF9vdXRwdXQgIT09ICcgJyAmJiBsYXN0X291dHB1dCAhPT0gaW5kZW50X3N0cmluZykgeyAvLyBwcmV2ZW50IG9jY2Fzc2lvbmFsIGR1cGxpY2F0ZSBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHQucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByaW50X3Rva2VuKHByaW50YWJsZV90b2tlbikge1xuICAgICAgICAgICAgcHJpbnRhYmxlX3Rva2VuID0gcHJpbnRhYmxlX3Rva2VuIHx8IHRva2VuX3RleHQ7XG4gICAgICAgICAgICBwcmludF90b2tlbl9saW5lX2luZGVudGF0aW9uKCk7XG4gICAgICAgICAgICBvdXRwdXRfd3JhcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcHJpbnRfdG9rZW5fc3BhY2VfYmVmb3JlKCk7XG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gZmFsc2U7XG4gICAgICAgICAgICBvdXRwdXRfbGluZXNbb3V0cHV0X2xpbmVzLmxlbmd0aCAtIDFdLnRleHQucHVzaChwcmludGFibGVfdG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5kZW50KCkge1xuICAgICAgICAgICAgZmxhZ3MuaW5kZW50YXRpb25fbGV2ZWwgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlaW5kZW50KCkge1xuICAgICAgICAgICAgaWYgKGZsYWdzLmluZGVudGF0aW9uX2xldmVsID4gMCAmJlxuICAgICAgICAgICAgICAgICgoIWZsYWdzLnBhcmVudCkgfHwgZmxhZ3MuaW5kZW50YXRpb25fbGV2ZWwgPiBmbGFncy5wYXJlbnQuaW5kZW50YXRpb25fbGV2ZWwpKVxuICAgICAgICAgICAgICAgIGZsYWdzLmluZGVudGF0aW9uX2xldmVsIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVfcmVkdW5kYW50X2luZGVudGF0aW9uKGZyYW1lKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGVmZmVjdGl2ZSBidXQgaGFzIHNvbWUgaXNzdWVzOlxuICAgICAgICAgICAgLy8gICAgIC0gbGVzcyB0aGFuIGdyZWF0IHBlcmZvcm1hbmNlIGR1ZSB0byBhcnJheSBzcGxpY2luZ1xuICAgICAgICAgICAgLy8gICAgIC0gY2FuIGNhdXNlIGxpbmUgd3JhcCB0byBoYXBwZW4gdG9vIHNvb24gZHVlIHRvIGluZGVudCByZW1vdmFsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgYWZ0ZXIgd3JhcCBwb2ludHMgYXJlIGNhbGN1bGF0ZWRcbiAgICAgICAgICAgIC8vIFRoZXNlIGlzc3VlcyBhcmUgbWlub3IgY29tcGFyZWQgdG8gdWdseSBpbmRlbnRhdGlvbi5cblxuICAgICAgICAgICAgaWYgKGZyYW1lLm11bHRpbGluZV9mcmFtZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgb25lIGluZGVudCBmcm9tIGVhY2ggbGluZSBpbnNpZGUgdGhpcyBzZWN0aW9uXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBmcmFtZS5zdGFydF9saW5lX2luZGV4O1xuICAgICAgICAgICAgdmFyIHNwbGljZV9pbmRleCA9IDA7XG4gICAgICAgICAgICB2YXIgbGluZTtcblxuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDwgb3V0cHV0X2xpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxpbmUgPSBvdXRwdXRfbGluZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG5cbiAgICAgICAgICAgICAgICAvLyBza2lwIGVtcHR5IGxpbmVzXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUudGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2tpcCB0aGUgcHJlaW5kZW50IHN0cmluZyBpZiBwcmVzZW50XG4gICAgICAgICAgICAgICAgaWYgKHByZWluZGVudF9zdHJpbmcgJiYgbGluZS50ZXh0WzBdID09PSBwcmVpbmRlbnRfc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZV9pbmRleCA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3BsaWNlX2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgb25lIGluZGVudCwgaWYgcHJlc2VudFxuICAgICAgICAgICAgICAgIGlmIChsaW5lLnRleHRbc3BsaWNlX2luZGV4XSA9PT0gaW5kZW50X3N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBsaW5lLnRleHQuc3BsaWNlKHNwbGljZV9pbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0X21vZGUobW9kZSkge1xuICAgICAgICAgICAgaWYgKGZsYWdzKSB7XG4gICAgICAgICAgICAgICAgZmxhZ19zdG9yZS5wdXNoKGZsYWdzKTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c19mbGFncyA9IGZsYWdzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c19mbGFncyA9IGNyZWF0ZV9mbGFncyhudWxsLCBtb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmxhZ3MgPSBjcmVhdGVfZmxhZ3MocHJldmlvdXNfZmxhZ3MsIG1vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNfYXJyYXkobW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGUgPT09IE1PREUuQXJyYXlMaXRlcmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNfZXhwcmVzc2lvbihtb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5fYXJyYXkobW9kZSwgW01PREUuRXhwcmVzc2lvbiwgTU9ERS5Gb3JJbml0aWFsaXplciwgTU9ERS5Db25kaXRpb25hbF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzdG9yZV9tb2RlKCkge1xuICAgICAgICAgICAgaWYgKGZsYWdfc3RvcmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzX2ZsYWdzID0gZmxhZ3M7XG4gICAgICAgICAgICAgICAgZmxhZ3MgPSBmbGFnX3N0b3JlLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRfb2Zfb2JqZWN0X3Byb3BlcnR5KCkge1xuICAgICAgICAgICAgcmV0dXJuIGZsYWdzLm1vZGUgPT09IE1PREUuT2JqZWN0TGl0ZXJhbCAmJiBmbGFncy5sYXN0X3RleHQgPT09ICc6JyAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLnRlcm5hcnlfZGVwdGggPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdGFydF9vZl9zdGF0ZW1lbnQoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJ2RvJyB8fFxuICAgICAgICAgICAgICAgICAgICAoZmxhZ3MubGFzdF90ZXh0ID09PSAnZWxzZScgJiYgdG9rZW5fdGV4dCAhPT0gJ2lmJykgfHxcbiAgICAgICAgICAgICAgICAgICAgKGxhc3RfdHlwZSA9PT0gJ1RLX0VORF9FWFBSJyAmJiAocHJldmlvdXNfZmxhZ3MubW9kZSA9PT0gTU9ERS5Gb3JJbml0aWFsaXplciB8fCBwcmV2aW91c19mbGFncy5tb2RlID09PSBNT0RFLkNvbmRpdGlvbmFsKSkpKSB7XG4gICAgICAgICAgICAgICAgLy8gSXNzdWUgIzI3NjpcbiAgICAgICAgICAgICAgICAvLyBJZiBzdGFydGluZyBhIG5ldyBzdGF0ZW1lbnQgd2l0aCBbaWYsIGZvciwgd2hpbGUsIGRvXSwgcHVzaCB0byBhIG5ldyBsaW5lLlxuICAgICAgICAgICAgICAgIC8vIGlmIChhKSBpZiAoYikgaWYoYykgZCgpOyBlbHNlIGUoKTsgZWxzZSBmKCk7XG4gICAgICAgICAgICAgICAgYWxsb3dfd3JhcF9vcl9wcmVzZXJ2ZWRfbmV3bGluZShcbiAgICAgICAgICAgICAgICAgICAgaW5fYXJyYXkodG9rZW5fdGV4dCwgWydkbycsICdmb3InLCAnaWYnLCAnd2hpbGUnXSkpO1xuXG4gICAgICAgICAgICAgICAgc2V0X21vZGUoTU9ERS5TdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgIC8vIElzc3VlICMyNzU6XG4gICAgICAgICAgICAgICAgLy8gSWYgc3RhcnRpbmcgb24gYSBuZXdsaW5lLCBhbGwgb2YgYSBzdGF0ZW1lbnQgc2hvdWxkIGJlIGluZGVudGVkLlxuICAgICAgICAgICAgICAgIC8vIGlmIG5vdCwgdXNlIGxpbmUgd3JhcHBpbmcgbG9naWMgZm9yIGluZGVudC5cbiAgICAgICAgICAgICAgICBpZiAoanVzdF9hZGRlZF9uZXdsaW5lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF93cmFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWxsX2xpbmVzX3N0YXJ0X3dpdGgobGluZXMsIGMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZSA9IHRyaW0obGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmNoYXJBdCgwKSAhPT0gYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc19zcGVjaWFsX3dvcmQod29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluX2FycmF5KHdvcmQsIFsnY2FzZScsICdyZXR1cm4nLCAnZG8nLCAnaWYnLCAndGhyb3cnLCAnZWxzZSddKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluX2FycmF5KHdoYXQsIGFycikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09PSB3aGF0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVuZXNjYXBlX3N0cmluZyhzKSB7XG4gICAgICAgICAgICB2YXIgZXNjID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgb3V0ID0gJycsXG4gICAgICAgICAgICAgICAgcG9zID0gMCxcbiAgICAgICAgICAgICAgICBzX2hleCA9ICcnLFxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAwLFxuICAgICAgICAgICAgICAgIGM7XG5cbiAgICAgICAgICAgIHdoaWxlIChlc2MgfHwgcG9zIDwgcy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgICAgIGMgPSBzLmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICAgIHBvcysrO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVzYykge1xuICAgICAgICAgICAgICAgICAgICBlc2MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2ltcGxlIGhleC1lc2NhcGUgXFx4MjRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNfaGV4ID0gcy5zdWJzdHIocG9zLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICd1Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5pY29kZS1lc2NhcGUsIFxcdTIxMzRcbiAgICAgICAgICAgICAgICAgICAgICAgIHNfaGV4ID0gcy5zdWJzdHIocG9zLCA0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyArPSA0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZSBjb21tb24gZXNjYXBlLCBlLmcgXFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJ1xcXFwnICsgYztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghc19oZXgubWF0Y2goL15bMDEyMzQ1Njc4OWFiY2RlZkFCQ0RFRl0rJC8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21lIHdlaXJkIGVzY2FwaW5nLCBiYWlsIG91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYXZpbmcgd2hvbGUgc3RyaW5nIGludGFjdFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBlc2NhcGVkID0gcGFyc2VJbnQoc19oZXgsIDE2KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXNjYXBlZCA+PSAweDAwICYmIGVzY2FwZWQgPCAweDIwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWF2ZSAweDAwLi4uMHgxZiBlc2NhcGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXFxceCcgKyBzX2hleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXFxcdScgKyBzX2hleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVzY2FwZWQgPT09IDB4MjIgfHwgZXNjYXBlZCA9PT0gMHgyNyB8fCBlc2NhcGVkID09PSAweDVjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzaW5nbGUtcXVvdGUsIGFwb3N0cm9waGUsIGJhY2tzbGFzaCAtIGVzY2FwZSB0aGVzZVxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXFxcJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoZXNjYXBlZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJ3gnICYmIGVzY2FwZWQgPiAweDdlICYmIGVzY2FwZWQgPD0gMHhmZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgYmFpbCBvdXQgb24gXFx4N2YuLlxceGZmLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhdmluZyB3aG9sZSBzdHJpbmcgZXNjYXBlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3MgcHJvYmFibHkgY29tcGxldGVseSBiaW5hcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXNjYXBlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgICAgICBlc2MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc19uZXh0KGZpbmQpIHtcbiAgICAgICAgICAgIHZhciBsb2NhbF9wb3MgPSBwYXJzZXJfcG9zO1xuICAgICAgICAgICAgdmFyIGMgPSBpbnB1dC5jaGFyQXQobG9jYWxfcG9zKTtcbiAgICAgICAgICAgIHdoaWxlIChpbl9hcnJheShjLCB3aGl0ZXNwYWNlKSAmJiBjICE9PSBmaW5kKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxfcG9zKys7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsX3BvcyA+PSBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjID0gaW5wdXQuY2hhckF0KGxvY2FsX3Bvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYyA9PT0gZmluZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldF9uZXh0X3Rva2VuKCkge1xuICAgICAgICAgICAgdmFyIGksIHJlc3VsdGluZ19zdHJpbmc7XG5cbiAgICAgICAgICAgIG5fbmV3bGluZXMgPSAwO1xuXG4gICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA+PSBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWycnLCAnVEtfRU9GJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlucHV0X3dhbnRlZF9uZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICB3aGl0ZXNwYWNlX2JlZm9yZV90b2tlbiA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgYyA9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcblxuICAgICAgICAgICAgd2hpbGUgKGluX2FycmF5KGMsIHdoaXRlc3BhY2UpKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbl9uZXdsaW5lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICB3aGl0ZXNwYWNlX2JlZm9yZV90b2tlbiA9IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobl9uZXdsaW5lcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gaW5kZW50X3N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4ucHVzaChpbmRlbnRfc3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGVzcGFjZV9iZWZvcmVfdG9rZW4ucHVzaCgnICcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbJycsICdUS19FT0YnXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluX2FycmF5KGMsIHdvcmRjaGFyKSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbl9hcnJheShpbnB1dC5jaGFyQXQocGFyc2VyX3BvcyksIHdvcmRjaGFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyArPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA9PT0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzbWFsbCBhbmQgc3VycHJpc2luZ2x5IHVudWdseSBoYWNrIGZvciAxRS0xMCByZXByZXNlbnRhdGlvblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zICE9PSBpbnB1dF9sZW5ndGggJiYgYy5tYXRjaCgvXlswLTldK1tFZV0kLykgJiYgKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJy0nIHx8IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJysnKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBzaWduID0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBnZXRfbmV4dF90b2tlbigpO1xuICAgICAgICAgICAgICAgICAgICBjICs9IHNpZ24gKyB0WzBdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19XT1JEJ107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09ICdpbicpIHsgLy8gaGFjayBmb3IgJ2luJyBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19PUEVSQVRPUiddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19XT1JEJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAnKCcgfHwgYyA9PT0gJ1snKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfU1RBUlRfRVhQUiddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJyknIHx8IGMgPT09ICddJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbYywgJ1RLX0VORF9FWFBSJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAneycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19TVEFSVF9CTE9DSyddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfRU5EX0JMT0NLJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19TRU1JQ09MT04nXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPT09ICcvJykge1xuICAgICAgICAgICAgICAgIHZhciBjb21tZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgLy8gcGVlayBmb3IgY29tbWVudCAvKiAuLi4gKi9cbiAgICAgICAgICAgICAgICB2YXIgaW5saW5lX2NvbW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICcqJykge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCAmJiAhKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJyonICYmIGlucHV0LmNoYXJBdChwYXJzZXJfcG9zICsgMSkgJiYgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MgKyAxKSA9PT0gJy8nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudCArPSBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjID09PSBcIlxcblwiIHx8IGMgPT09IFwiXFxyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lX2NvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zID49IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5saW5lX2NvbW1lbnQgJiYgbl9uZXdsaW5lcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnLyonICsgY29tbWVudCArICcqLycsICdUS19JTkxJTkVfQ09NTUVOVCddO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsnLyonICsgY29tbWVudCArICcqLycsICdUS19CTE9DS19DT01NRU5UJ107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcGVlayBmb3IgY29tbWVudCAvLyAuLi5cbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IGM7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgIT09ICdcXHInICYmIGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSAhPT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjb21tZW50LCAnVEtfQ09NTUVOVCddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmIChjID09PSBcIidcIiB8fCBjID09PSAnXCInIHx8IC8vIHN0cmluZ1xuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgICAgKGMgPT09ICcvJykgfHwgLy8gcmVnZXhwXG4gICAgICAgICAgICAgICAgICAgIChvcHQuZTR4ICYmIGMgPT09IFwiPFwiICYmIGlucHV0LnNsaWNlKHBhcnNlcl9wb3MgLSAxKS5tYXRjaCgvXjwoWy1hLXpBLVo6MC05Xy5dK3x7W157fV0qfXwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdKVxccyooWy1hLXpBLVo6MC05Xy5dKz0oJ1teJ10qJ3xcIlteXCJdKlwifHtbXnt9XSp9KVxccyopKlxcLz9cXHMqPi8pKSAvLyB4bWxcbiAgICAgICAgICAgICAgICApICYmICggLy8gcmVnZXggYW5kIHhtbCBjYW4gb25seSBhcHBlYXIgaW4gc3BlY2lmaWMgbG9jYXRpb25zIGR1cmluZyBwYXJzaW5nXG4gICAgICAgICAgICAgICAgICAgIChsYXN0X3R5cGUgPT09ICdUS19XT1JEJyAmJiBpc19zcGVjaWFsX3dvcmQoZmxhZ3MubGFzdF90ZXh0KSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGxhc3RfdHlwZSA9PT0gJ1RLX0VORF9FWFBSJyAmJiBpbl9hcnJheShwcmV2aW91c19mbGFncy5tb2RlLCBbTU9ERS5Db25kaXRpb25hbCwgTU9ERS5Gb3JJbml0aWFsaXplcl0pKSB8fFxuICAgICAgICAgICAgICAgICAgICAoaW5fYXJyYXkobGFzdF90eXBlLCBbJ1RLX0NPTU1FTlQnLCAnVEtfU1RBUlRfRVhQUicsICdUS19TVEFSVF9CTE9DSycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnVEtfRU5EX0JMT0NLJywgJ1RLX09QRVJBVE9SJywgJ1RLX0VRVUFMUycsICdUS19FT0YnLCAnVEtfU0VNSUNPTE9OJywgJ1RLX0NPTU1BJ1xuICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICApKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VwID0gYyxcbiAgICAgICAgICAgICAgICAgICAgZXNjID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhc19jaGFyX2VzY2FwZXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgPSBjO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcCA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIHJlZ2V4cFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbl9jaGFyX2NsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZXNjIHx8IGluX2NoYXJfY2xhc3MgfHwgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpICE9PSBzZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nICs9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVzYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2MgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICdcXFxcJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJ1snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbl9jaGFyX2NsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5fY2hhcl9jbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXNjID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VyX3BvcyA+PSBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jb21wbGV0ZSBzdHJpbmcvcmV4cCB3aGVuIGVuZC1vZi1maWxlIHJlYWNoZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhaWwgb3V0IHdpdGggd2hhdCBoYWQgYmVlbiByZWNlaXZlZCBzbyBmYXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbcmVzdWx0aW5nX3N0cmluZywgJ1RLX1NUUklORyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHQuZTR4ICYmIHNlcCA9PT0gJzwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlIGU0eCB4bWwgbGl0ZXJhbHNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeG1sUmVnRXhwID0gLzwoXFwvPykoWy1hLXpBLVo6MC05Xy5dK3x7W157fV0qfXwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdKVxccyooWy1hLXpBLVo6MC05Xy5dKz0oJ1teJ10qJ3xcIlteXCJdKlwifHtbXnt9XSp9KVxccyopKihcXC8/KVxccyo+L2c7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeG1sU3RyID0gaW5wdXQuc2xpY2UocGFyc2VyX3BvcyAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0geG1sUmVnRXhwLmV4ZWMoeG1sU3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC5pbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290VGFnID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRW5kVGFnID0gISEgbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YWdOYW1lID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1NpbmdsZXRvblRhZyA9ICggISEgbWF0Y2hbbWF0Y2gubGVuZ3RoIC0gMV0pIHx8ICh0YWdOYW1lLnNsaWNlKDAsIDgpID09PSBcIiFbQ0RBVEFbXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnTmFtZSA9PT0gcm9vdFRhZyAmJiAhaXNTaW5nbGV0b25UYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VuZFRhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tZGVwdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrZGVwdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlcHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0geG1sUmVnRXhwLmV4ZWMoeG1sU3RyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhtbExlbmd0aCA9IG1hdGNoID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiB4bWxTdHIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0geG1sTGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3htbFN0ci5zbGljZSgwLCB4bWxMZW5ndGgpLCBcIlRLX1NUUklOR1wiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGUgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVzYyB8fCBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgIT09IHNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJ3gnIHx8IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNfY2hhcl9lc2NhcGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlc2MgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICdcXFxcJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZXJfcG9zID49IGlucHV0X2xlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmNvbXBsZXRlIHN0cmluZy9yZXhwIHdoZW4gZW5kLW9mLWZpbGUgcmVhY2hlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmFpbCBvdXQgd2l0aCB3aGF0IGhhZCBiZWVuIHJlY2VpdmVkIHNvIGZhci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtyZXN1bHRpbmdfc3RyaW5nLCAnVEtfU1RSSU5HJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDE7XG4gICAgICAgICAgICAgICAgcmVzdWx0aW5nX3N0cmluZyArPSBzZXA7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzX2NoYXJfZXNjYXBlcyAmJiBvcHQudW5lc2NhcGVfc3RyaW5ncykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRpbmdfc3RyaW5nID0gdW5lc2NhcGVfc3RyaW5nKHJlc3VsdGluZ19zdHJpbmcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZXAgPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWdleHBzIG1heSBoYXZlIG1vZGlmaWVycyAvcmVnZXhwL01PRCAsIHNvIGZldGNoIHRob3NlLCB0b29cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGggJiYgaW5fYXJyYXkoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpLCB3b3JkY2hhcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgKz0gaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbcmVzdWx0aW5nX3N0cmluZywgJ1RLX1NUUklORyddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJyMnKSB7XG5cblxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRfbGluZXMubGVuZ3RoID09PSAxICYmIG91dHB1dF9saW5lc1swXS50ZXh0Lmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICchJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBzaGViYW5nXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgPSBjO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCAmJiBjICE9PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdGluZ19zdHJpbmcgKz0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3RyaW0ocmVzdWx0aW5nX3N0cmluZykgKyAnXFxuJywgJ1RLX1VOS05PV04nXTtcbiAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgLy8gU3BpZGVybW9ua2V5LXNwZWNpZmljIHNoYXJwIHZhcmlhYmxlcyBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL0VuL1NoYXJwX3ZhcmlhYmxlc19pbl9KYXZhU2NyaXB0XG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL214ci5tb3ppbGxhLm9yZy9tb3ppbGxhLWNlbnRyYWwvc291cmNlL2pzL3NyYy9qc3NjYW4uY3BwIGFyb3VuZCBsaW5lIDE5MzVcbiAgICAgICAgICAgICAgICB2YXIgc2hhcnAgPSAnIyc7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGggJiYgaW5fYXJyYXkoaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpLCBkaWdpdHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFycCArPSBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyX3BvcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlIChwYXJzZXJfcG9zIDwgaW5wdXRfbGVuZ3RoICYmIGMgIT09ICcjJyAmJiBjICE9PSAnPScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNoYXJBdChwYXJzZXJfcG9zKSA9PT0gJ1snICYmIGlucHV0LmNoYXJBdChwYXJzZXJfcG9zICsgMSkgPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcnAgKz0gJ1tdJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgPT09ICd7JyAmJiBpbnB1dC5jaGFyQXQocGFyc2VyX3BvcyArIDEpID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXJwICs9ICd7fSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJfcG9zICs9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtzaGFycCwgJ1RLX1dPUkQnXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAnPCcgJiYgaW5wdXQuc3Vic3RyaW5nKHBhcnNlcl9wb3MgLSAxLCBwYXJzZXJfcG9zICsgMykgPT09ICc8IS0tJykge1xuICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMztcbiAgICAgICAgICAgICAgICBjID0gJzwhLS0nO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQocGFyc2VyX3BvcykgIT09ICdcXG4nICYmIHBhcnNlcl9wb3MgPCBpbnB1dF9sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYyArPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmxhZ3MuaW5faHRtbF9jb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19DT01NRU5UJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjID09PSAnLScgJiYgZmxhZ3MuaW5faHRtbF9jb21tZW50ICYmIGlucHV0LnN1YnN0cmluZyhwYXJzZXJfcG9zIC0gMSwgcGFyc2VyX3BvcyArIDIpID09PSAnLS0+Jykge1xuICAgICAgICAgICAgICAgIGZsYWdzLmluX2h0bWxfY29tbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMjtcbiAgICAgICAgICAgICAgICByZXR1cm4gWyctLT4nLCAnVEtfQ09NTUVOVCddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfRE9UJ107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbl9hcnJheShjLCBwdW5jdCkpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyc2VyX3BvcyA8IGlucHV0X2xlbmd0aCAmJiBpbl9hcnJheShjICsgaW5wdXQuY2hhckF0KHBhcnNlcl9wb3MpLCBwdW5jdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYyArPSBpbnB1dC5jaGFyQXQocGFyc2VyX3Bvcyk7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlcl9wb3MgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlcl9wb3MgPj0gaW5wdXRfbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfQ09NTUEnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc9Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19FUVVBTFMnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2MsICdUS19PUEVSQVRPUiddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtjLCAnVEtfVU5LTk9XTiddO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX3N0YXJ0X2V4cHIoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRfb2Zfc3RhdGVtZW50KCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY29uZGl0aW9uYWwgc3RhcnRzIHRoZSBzdGF0ZW1lbnQgaWYgYXBwcm9wcmlhdGUuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuZXh0X21vZGUgPSBNT0RFLkV4cHJlc3Npb247XG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ1snKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlID09PSAnVEtfV09SRCcgfHwgZmxhZ3MubGFzdF90ZXh0ID09PSAnKScpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhcnJheSBpbmRleCBzcGVjaWZpZXIsIGJyZWFrIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICAgICAgICAgIC8vIGFbeF0sIGZuKClbeF1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluX2FycmF5KGZsYWdzLmxhc3RfdGV4dCwgbGluZV9zdGFydGVycykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNldF9tb2RlKG5leHRfbW9kZSk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnNwYWNlX2luX3BhcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV4dF9tb2RlID0gTU9ERS5BcnJheUxpdGVyYWw7XG4gICAgICAgICAgICAgICAgaWYgKGlzX2FycmF5KGZsYWdzLm1vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICdbJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJywnICYmIChsYXN0X2xhc3RfdGV4dCA9PT0gJ10nIHx8IGxhc3RfbGFzdF90ZXh0ID09PSAnfScpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gXSwgWyBnb2VzIHRvIG5ldyBsaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9LCBbIGdvZXMgdG8gbmV3IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0LmtlZXBfYXJyYXlfaW5kZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJ2ZvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dF9tb2RlID0gTU9ERS5Gb3JJbml0aWFsaXplcjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluX2FycmF5KGZsYWdzLmxhc3RfdGV4dCwgWydpZicsICd3aGlsZSddKSkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0X21vZGUgPSBNT0RFLkNvbmRpdGlvbmFsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5leHRfbW9kZSA9IE1PREUuRXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICc7JyB8fCBsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9CTE9DSycpIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0VORF9FWFBSJyB8fCBsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9FWFBSJyB8fCBsYXN0X3R5cGUgPT09ICdUS19FTkRfQkxPQ0snIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQ29uc2lkZXIgd2hldGhlciBmb3JjaW5nIHRoaXMgaXMgcmVxdWlyZWQuICBSZXZpZXcgZmFpbGluZyB0ZXN0cyB3aGVuIHJlbW92ZWQuXG4gICAgICAgICAgICAgICAgYWxsb3dfd3JhcF9vcl9wcmVzZXJ2ZWRfbmV3bGluZShpbnB1dF93YW50ZWRfbmV3bGluZSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3dyYXBwZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nIG9uICgoIGFuZCApKCBhbmQgXVsgYW5kIF0oIGFuZCAuKFxuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0X3R5cGUgIT09ICdUS19XT1JEJyAmJiBsYXN0X3R5cGUgIT09ICdUS19PUEVSQVRPUicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmxhZ3MubGFzdF93b3JkID09PSAnZnVuY3Rpb24nIHx8IGZsYWdzLmxhc3Rfd29yZCA9PT0gJ3R5cGVvZicpIHtcbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbigpIHZzIGZ1bmN0aW9uICgpXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5qc2xpbnRfaGFwcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbl9hcnJheShmbGFncy5sYXN0X3RleHQsIGxpbmVfc3RhcnRlcnMpIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJ2NhdGNoJykge1xuICAgICAgICAgICAgICAgIGlmIChvcHQuc3BhY2VfYmVmb3JlX2NvbmRpdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3VwcG9ydCBvZiB0aGlzIGtpbmQgb2YgbmV3bGluZSBwcmVzZXJ2YXRpb24uXG4gICAgICAgICAgICAvLyBhID0gKGIgJiZcbiAgICAgICAgICAgIC8vICAgICAoYyB8fCBkKSk7XG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJygnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0VRVUFMUycgfHwgbGFzdF90eXBlID09PSAnVEtfT1BFUkFUT1InKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnRfb2Zfb2JqZWN0X3Byb3BlcnR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0X21vZGUobmV4dF9tb2RlKTtcbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICBpZiAob3B0LnNwYWNlX2luX3BhcmVuKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEluIGFsbCBjYXNlcywgaWYgd2UgbmV3bGluZSB3aGlsZSBpbnNpZGUgYW4gZXhwcmVzc2lvbiBpdCBzaG91bGQgYmUgaW5kZW50ZWQuXG4gICAgICAgICAgICBpbmRlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9lbmRfZXhwcigpIHtcbiAgICAgICAgICAgIC8vIHN0YXRlbWVudHMgaW5zaWRlIGV4cHJlc3Npb25zIGFyZSBub3QgdmFsaWQgc3ludGF4LCBidXQuLi5cbiAgICAgICAgICAgIC8vIHN0YXRlbWVudHMgbXVzdCBhbGwgYmUgY2xvc2VkIHdoZW4gdGhlaXIgY29udGFpbmVyIGNsb3Nlc1xuICAgICAgICAgICAgd2hpbGUgKGZsYWdzLm1vZGUgPT09IE1PREUuU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmVzdG9yZV9tb2RlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnXScgJiYgaXNfYXJyYXkoZmxhZ3MubW9kZSkgJiYgZmxhZ3MubXVsdGlsaW5lX2ZyYW1lICYmICFvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbikge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZsYWdzLm11bHRpbGluZV9mcmFtZSkge1xuICAgICAgICAgICAgICAgIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHQuc3BhY2VfaW5fcGFyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlID09PSAnVEtfU1RBUlRfRVhQUicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gKCkgW10gbm8gaW5uZXIgc3BhY2UgaW4gZW1wdHkgcGFyZW5zIGxpa2UgdGhlc2UsIGV2ZXIsIHJlZiAjMzIwXG4gICAgICAgICAgICAgICAgICAgIHRyaW1fb3V0cHV0KCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ10nICYmIG9wdC5rZWVwX2FycmF5X2luZGVudGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICByZXN0b3JlX21vZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdG9yZV9tb2RlKCk7XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZV9yZWR1bmRhbnRfaW5kZW50YXRpb24ocHJldmlvdXNfZmxhZ3MpO1xuXG4gICAgICAgICAgICAvLyBkbyB7fSB3aGlsZSAoKSAvLyBubyBzdGF0ZW1lbnQgcmVxdWlyZWQgYWZ0ZXJcbiAgICAgICAgICAgIGlmIChmbGFncy5kb193aGlsZSAmJiBwcmV2aW91c19mbGFncy5tb2RlID09PSBNT0RFLkNvbmRpdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNfZmxhZ3MubW9kZSA9IE1PREUuRXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICBmbGFncy5kb19ibG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZsYWdzLmRvX3doaWxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9zdGFydF9ibG9jaygpIHtcbiAgICAgICAgICAgIHNldF9tb2RlKE1PREUuQmxvY2tTdGF0ZW1lbnQpO1xuXG4gICAgICAgICAgICB2YXIgZW1wdHlfYnJhY2VzID0gaXNfbmV4dCgnfScpO1xuICAgICAgICAgICAgdmFyIGVtcHR5X2Fub255bW91c19mdW5jdGlvbiA9IGVtcHR5X2JyYWNlcyAmJiBmbGFncy5sYXN0X3dvcmQgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICAgICAgICBsYXN0X3R5cGUgPT09ICdUS19FTkRfRVhQUic7XG5cbiAgICAgICAgICAgIGlmIChvcHQuYnJhY2Vfc3R5bGUgPT09IFwiZXhwYW5kXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlICE9PSAnVEtfT1BFUkFUT1InICYmXG4gICAgICAgICAgICAgICAgICAgIChlbXB0eV9hbm9ueW1vdXNfZnVuY3Rpb24gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfdHlwZSA9PT0gJ1RLX0VRVUFMUycgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc19zcGVjaWFsX3dvcmQoZmxhZ3MubGFzdF90ZXh0KSAmJiBmbGFncy5sYXN0X3RleHQgIT09ICdlbHNlJykpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBjb2xsYXBzZVxuICAgICAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgIT09ICdUS19PUEVSQVRPUicgJiYgbGFzdF90eXBlICE9PSAnVEtfU1RBUlRfRVhQUicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1NUQVJUX0JMT0NLJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBUS19PUEVSQVRPUiBvciBUS19TVEFSVF9FWFBSXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19hcnJheShwcmV2aW91c19mbGFncy5tb2RlKSAmJiBmbGFncy5sYXN0X3RleHQgPT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RfbGFzdF90ZXh0ID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LCB7IGluIGFycmF5IGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpOyAvLyBbYSwgYiwgYywge1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgIGluZGVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX2VuZF9ibG9jaygpIHtcbiAgICAgICAgICAgIC8vIHN0YXRlbWVudHMgbXVzdCBhbGwgYmUgY2xvc2VkIHdoZW4gdGhlaXIgY29udGFpbmVyIGNsb3Nlc1xuICAgICAgICAgICAgd2hpbGUgKGZsYWdzLm1vZGUgPT09IE1PREUuU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmVzdG9yZV9tb2RlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZW1wdHlfYnJhY2VzID0gbGFzdF90eXBlID09PSAnVEtfU1RBUlRfQkxPQ0snO1xuXG4gICAgICAgICAgICBpZiAob3B0LmJyYWNlX3N0eWxlID09PSBcImV4cGFuZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbXB0eV9icmFjZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCB7fVxuICAgICAgICAgICAgICAgIGlmICghZW1wdHlfYnJhY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc19hcnJheShmbGFncy5tb2RlKSAmJiBvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgUkVBTExZIG5lZWQgYSBuZXdsaW5lIGhlcmUsIGJ1dCBuZXdsaW5lciB3b3VsZCBza2lwIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5rZWVwX2FycmF5X2luZGVudGF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQua2VlcF9hcnJheV9pbmRlbnRhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV93b3JkKCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0X29mX3N0YXRlbWVudCgpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbmRpdGlvbmFsIHN0YXJ0cyB0aGUgc3RhdGVtZW50IGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dF93YW50ZWRfbmV3bGluZSAmJiAhaXNfZXhwcmVzc2lvbihmbGFncy5tb2RlKSAmJlxuICAgICAgICAgICAgICAgIChsYXN0X3R5cGUgIT09ICdUS19PUEVSQVRPUicgfHwgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJy0tJyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICcrKycpKSAmJlxuICAgICAgICAgICAgICAgIGxhc3RfdHlwZSAhPT0gJ1RLX0VRVUFMUycgJiZcbiAgICAgICAgICAgICAgICAob3B0LnByZXNlcnZlX25ld2xpbmVzIHx8IGZsYWdzLmxhc3RfdGV4dCAhPT0gJ3ZhcicpKSB7XG5cbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmbGFncy5kb19ibG9jayAmJiAhZmxhZ3MuZG9fd2hpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ3doaWxlJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkbyB7fSAjIyB3aGlsZSAoKVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmRvX3doaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIHt9IHNob3VsZCBhbHdheXMgaGF2ZSB3aGlsZSBhcyB0aGUgbmV4dCB3b3JkLlxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBkb24ndCBzZWUgdGhlIGV4cGVjdGVkIHdoaWxlLCByZWNvdmVyXG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuZG9fYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIG1heSBiZSBmb2xsb3dlZCBieSBlbHNlLCBvciBub3RcbiAgICAgICAgICAgIC8vIEJhcmUvaW5saW5lIGlmcyBhcmUgdHJpY2t5XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHVud2luZCB0aGUgbW9kZXMgY29ycmVjdGx5OiBpZiAoYSkgaWYgKGIpIGMoKTsgZWxzZSBkKCk7IGVsc2UgZSgpO1xuICAgICAgICAgICAgaWYgKGZsYWdzLmlmX2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgIT09ICdlbHNlJykge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZmxhZ3MubW9kZSA9PT0gTU9ERS5TdGF0ZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RvcmVfbW9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmlmX2Jsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ2Nhc2UnIHx8ICh0b2tlbl90ZXh0ID09PSAnZGVmYXVsdCcgJiYgZmxhZ3MuaW5fY2FzZV9zdGF0ZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIGlmIChmbGFncy5jYXNlX2JvZHkgfHwgb3B0LmpzbGludF9oYXBweSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBzd2l0Y2ggY2FzZXMgZm9sbG93aW5nIG9uZSBhbm90aGVyXG4gICAgICAgICAgICAgICAgICAgIGRlaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmNhc2VfYm9keSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgIGZsYWdzLmluX2Nhc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZsYWdzLmluX2Nhc2Vfc3RhdGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLnZhcl9saW5lICYmIGxhc3RfdHlwZSAhPT0gJ1RLX0VRVUFMUycpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmVfcmVpbmRlbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbl9hcnJheShmbGFncy5sYXN0X3RleHQsIFsnfScsICc7J10pIHx8IChqdXN0X2FkZGVkX25ld2xpbmUoKSAmJiAhIGluX2FycmF5KGZsYWdzLmxhc3RfdGV4dCwgWyd7JywgJzonLCAnPScsICcsJ10pKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlcmUgaXMgYSBuaWNlIGNsZWFuIHNwYWNlIG9mIGF0IGxlYXN0IG9uZSBibGFuayBsaW5lXG4gICAgICAgICAgICAgICAgICAgIC8vIGJlZm9yZSBhIG5ldyBmdW5jdGlvbiBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmICggISBqdXN0X2FkZGVkX2JsYW5rbGluZSgpICYmICEgZmxhZ3MuaGFkX2NvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX1dPUkQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmbGFncy5sYXN0X3RleHQgPT09ICdnZXQnIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJ3NldCcgfHwgZmxhZ3MubGFzdF90ZXh0ID09PSAnbmV3JyB8fCBmbGFncy5sYXN0X3RleHQgPT09ICdyZXR1cm4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfT1BFUkFUT1InIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJz0nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvbyA9IGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNfZXhwcmVzc2lvbihmbGFncy5tb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAoZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGFzdF90eXBlID09PSAnVEtfQ09NTUEnIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX1NUQVJUX0VYUFInIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX0VRVUFMUycgfHwgbGFzdF90eXBlID09PSAnVEtfT1BFUkFUT1InKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdGFydF9vZl9vYmplY3RfcHJvcGVydHkoKSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgZmxhZ3MubGFzdF93b3JkID0gdG9rZW5fdGV4dDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZWZpeCA9ICdOT05FJztcblxuICAgICAgICAgICAgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0VORF9CTE9DSycpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWluX2FycmF5KHRva2VuX3RleHQsIFsnZWxzZScsICdjYXRjaCcsICdmaW5hbGx5J10pKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LmJyYWNlX3N0eWxlID09PSBcImV4cGFuZFwiIHx8IG9wdC5icmFjZV9zdHlsZSA9PT0gXCJlbmQtZXhwYW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICdTUEFDRSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfU0VNSUNPTE9OJyAmJiBmbGFncy5tb2RlID09PSBNT0RFLkJsb2NrU3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgZm9yIFNUQVRFTUVOVCBhcyB3ZWxsP1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfU0VNSUNPTE9OJyAmJiBpc19leHByZXNzaW9uKGZsYWdzLm1vZGUpKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ID0gJ1NQQUNFJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfU1RSSU5HJykge1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfV09SRCcpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnU1BBQ0UnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsYXN0X3R5cGUgPT09ICdUS19TVEFSVF9CTE9DSycpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSAnTkVXTElORSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RfdHlwZSA9PT0gJ1RLX0VORF9FWFBSJykge1xuICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByZWZpeCA9ICdORVdMSU5FJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluX2FycmF5KHRva2VuX3RleHQsIGxpbmVfc3RhcnRlcnMpICYmIGZsYWdzLmxhc3RfdGV4dCAhPT0gJyknKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJ2Vsc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICdTUEFDRSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4ID0gJ05FV0xJTkUnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5fYXJyYXkodG9rZW5fdGV4dCwgWydlbHNlJywgJ2NhdGNoJywgJ2ZpbmFsbHknXSkpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlICE9PSAnVEtfRU5EX0JMT0NLJyB8fCBvcHQuYnJhY2Vfc3R5bGUgPT09IFwiZXhwYW5kXCIgfHwgb3B0LmJyYWNlX3N0eWxlID09PSBcImVuZC1leHBhbmRcIikge1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpbV9vdXRwdXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5lID0gb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgdHJpbW1lZCBhbmQgdGhlcmUncyBzb21ldGhpbmcgb3RoZXIgdGhhbiBhIGNsb3NlIGJsb2NrIGJlZm9yZSB1c1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXQgYSBuZXdsaW5lIGJhY2sgaW4uICBIYW5kbGVzICd9IC8vIGNvbW1lbnQnIHNjZW5hcmlvLlxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZS50ZXh0W2xpbmUudGV4dC5sZW5ndGggLSAxXSAhPT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmVmaXggPT09ICdORVdMSU5FJykge1xuICAgICAgICAgICAgICAgIGlmIChpc19zcGVjaWFsX3dvcmQoZmxhZ3MubGFzdF90ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyBuZXdsaW5lIGJldHdlZW4gJ3JldHVybiBubm4nXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlICE9PSAnVEtfRU5EX0VYUFInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgobGFzdF90eXBlICE9PSAnVEtfU1RBUlRfRVhQUicgfHwgdG9rZW5fdGV4dCAhPT0gJ3ZhcicpICYmIGZsYWdzLmxhc3RfdGV4dCAhPT0gJzonKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBubyBuZWVkIHRvIGZvcmNlIG5ld2xpbmUgb24gJ3Zhcic6IGZvciAodmFyIHggPSAwLi4uKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICdpZicgJiYgZmxhZ3MubGFzdF93b3JkID09PSAnZWxzZScgJiYgZmxhZ3MubGFzdF90ZXh0ICE9PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBubyBuZXdsaW5lIGZvciB9IGVsc2UgaWYge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluX2FycmF5KHRva2VuX3RleHQsIGxpbmVfc3RhcnRlcnMpICYmIGZsYWdzLmxhc3RfdGV4dCAhPT0gJyknKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNfYXJyYXkoZmxhZ3MubW9kZSkgJiYgZmxhZ3MubGFzdF90ZXh0ID09PSAnLCcgJiYgbGFzdF9sYXN0X3RleHQgPT09ICd9Jykge1xuICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTsgLy8gfSwgaW4gbGlzdHMgZ2V0IGEgbmV3bGluZSB0cmVhdG1lbnRcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJlZml4ID09PSAnU1BBQ0UnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgZmxhZ3MubGFzdF93b3JkID0gdG9rZW5fdGV4dDtcblxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICd2YXInKSB7XG4gICAgICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3JlaW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmbGFncy52YXJfbGluZV90YWludGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnZG8nKSB7XG4gICAgICAgICAgICAgICAgZmxhZ3MuZG9fYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9rZW5fdGV4dCA9PT0gJ2lmJykge1xuICAgICAgICAgICAgICAgIGZsYWdzLmlmX2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9zZW1pY29sb24oKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRfb2Zfc3RhdGVtZW50KCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY29uZGl0aW9uYWwgc3RhcnRzIHRoZSBzdGF0ZW1lbnQgaWYgYXBwcm9wcmlhdGUuXG4gICAgICAgICAgICAgICAgLy8gU2VtaWNvbG9uIGNhbiBiZSB0aGUgc3RhcnQgKGFuZCBlbmQpIG9mIGEgc3RhdGVtZW50XG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKGZsYWdzLm1vZGUgPT09IE1PREUuU3RhdGVtZW50ICYmICFmbGFncy5pZl9ibG9jayAmJiAhZmxhZ3MuZG9fYmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXN0b3JlX21vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICBmbGFncy52YXJfbGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmVfcmVpbmRlbnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZsYWdzLm1vZGUgPT09IE1PREUuT2JqZWN0TGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGluIE9CSkVDVCBtb2RlIGFuZCBzZWUgYSBzZW1pY29sb24sIGl0cyBpbnZhbGlkIHN5bnRheFxuICAgICAgICAgICAgICAgIC8vIHJlY292ZXIgYmFjayB0byB0cmVhdGluZyB0aGlzIGFzIGEgQkxPQ0tcbiAgICAgICAgICAgICAgICBmbGFncy5tb2RlID0gTU9ERS5CbG9ja1N0YXRlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9zdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRfb2Zfc3RhdGVtZW50KCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY29uZGl0aW9uYWwgc3RhcnRzIHRoZSBzdGF0ZW1lbnQgaWYgYXBwcm9wcmlhdGUuXG4gICAgICAgICAgICAgICAgLy8gT25lIGRpZmZlcmVuY2UgLSBzdHJpbmdzIHdhbnQgYXQgbGVhc3QgYSBzcGFjZSBiZWZvcmVcbiAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfV09SRCcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGFzdF90eXBlID09PSAnVEtfQ09NTUEnIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX1NUQVJUX0VYUFInIHx8IGxhc3RfdHlwZSA9PT0gJ1RLX0VRVUFMUycgfHwgbGFzdF90eXBlID09PSAnVEtfT1BFUkFUT1InKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdGFydF9vZl9vYmplY3RfcHJvcGVydHkoKSkge1xuICAgICAgICAgICAgICAgICAgICBhbGxvd193cmFwX29yX3ByZXNlcnZlZF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX2VxdWFscygpIHtcbiAgICAgICAgICAgIGlmIChmbGFncy52YXJfbGluZSkge1xuICAgICAgICAgICAgICAgIC8vIGp1c3QgZ290IGFuICc9JyBpbiBhIHZhci1saW5lLCBkaWZmZXJlbnQgZm9ybWF0dGluZy9saW5lLWJyZWFraW5nLCBldGMgd2lsbCBub3cgYmUgZG9uZVxuICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3RhaW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfY29tbWEoKSB7XG4gICAgICAgICAgICBpZiAoZmxhZ3MudmFyX2xpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNfZXhwcmVzc2lvbihmbGFncy5tb2RlKSB8fCBsYXN0X3R5cGUgPT09ICdUS19FTkRfQkxPQ0snKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBicmVhayBvbiBjb21tYSwgZm9yKHZhciBhID0gMSwgYiA9IDIpXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3RhaW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MudmFyX2xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MudmFyX2xpbmVfcmVpbmRlbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcblxuICAgICAgICAgICAgICAgIGlmIChmbGFncy52YXJfbGluZV90YWludGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnZhcl9saW5lX3RhaW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0X3R5cGUgPT09ICdUS19FTkRfQkxPQ0snICYmIGZsYWdzLm1vZGUgIT09IE1PREUuRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLm1vZGUgPT09IE1PREUuT2JqZWN0TGl0ZXJhbCAmJiBmbGFncy5sYXN0X3RleHQgPT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MubW9kZSA9PT0gTU9ERS5PYmplY3RMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIHByaW50X25ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBFWFBSIG9yIERPX0JMT0NLXG4gICAgICAgICAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dF9zcGFjZV9iZWZvcmVfdG9rZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9vcGVyYXRvcigpIHtcbiAgICAgICAgICAgIHZhciBzcGFjZV9iZWZvcmUgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHNwYWNlX2FmdGVyID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChpc19zcGVjaWFsX3dvcmQoZmxhZ3MubGFzdF90ZXh0KSkge1xuICAgICAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgaGFkIGEgc3BlY2lhbCBoYW5kbGluZyBpbiBUS19XT1JELiBOb3cgd2UgbmVlZCB0byByZXR1cm4gdGhlIGZhdm9yXG4gICAgICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGhhY2sgZm9yIGFjdGlvbnNjcmlwdCdzIGltcG9ydCAuKjtcbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnKicgJiYgbGFzdF90eXBlID09PSAnVEtfRE9UJyAmJiAhbGFzdF9sYXN0X3RleHQubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0ID09PSAnOicgJiYgZmxhZ3MuaW5fY2FzZSkge1xuICAgICAgICAgICAgICAgIGZsYWdzLmNhc2VfYm9keSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaW5kZW50KCk7XG4gICAgICAgICAgICAgICAgcHJpbnRfdG9rZW4oKTtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgZmxhZ3MuaW5fY2FzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRva2VuX3RleHQgPT09ICc6OicpIHtcbiAgICAgICAgICAgICAgICAvLyBubyBzcGFjZXMgYXJvdW5kIGV4b3RpYyBuYW1lc3BhY2luZyBzeW50YXggb3BlcmF0b3JcbiAgICAgICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTcuOS4xXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIG5ld2xpbmUgYmV0d2VlbiAtLSBvciArKyBhbmQgYW55dGhpbmcgZWxzZSB3ZSBzaG91bGQgcHJlc2VydmUgaXQuXG4gICAgICAgICAgICBpZiAoaW5wdXRfd2FudGVkX25ld2xpbmUgJiYgKHRva2VuX3RleHQgPT09ICctLScgfHwgdG9rZW5fdGV4dCA9PT0gJysrJykpIHtcbiAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbl9hcnJheSh0b2tlbl90ZXh0LCBbJy0tJywgJysrJywgJyEnXSkgfHwgKGluX2FycmF5KHRva2VuX3RleHQsIFsnLScsICcrJ10pICYmIChpbl9hcnJheShsYXN0X3R5cGUsIFsnVEtfU1RBUlRfQkxPQ0snLCAnVEtfU1RBUlRfRVhQUicsICdUS19FUVVBTFMnLCAnVEtfT1BFUkFUT1InXSkgfHwgaW5fYXJyYXkoZmxhZ3MubGFzdF90ZXh0LCBsaW5lX3N0YXJ0ZXJzKSB8fCBmbGFncy5sYXN0X3RleHQgPT09ICcsJykpKSB7XG4gICAgICAgICAgICAgICAgLy8gdW5hcnkgb3BlcmF0b3JzIChhbmQgYmluYXJ5ICsvLSBwcmV0ZW5kaW5nIHRvIGJlIHVuYXJ5KSBzcGVjaWFsIGNhc2VzXG5cbiAgICAgICAgICAgICAgICBzcGFjZV9iZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzcGFjZV9hZnRlciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJzsnICYmIGlzX2V4cHJlc3Npb24oZmxhZ3MubW9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yICg7OyArK2kpXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICBeXl5cbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfYmVmb3JlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGFzdF90eXBlID09PSAnVEtfV09SRCcgJiYgaW5fYXJyYXkoZmxhZ3MubGFzdF90ZXh0LCBsaW5lX3N0YXJ0ZXJzKSkge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9iZWZvcmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgoZmxhZ3MubW9kZSA9PT0gTU9ERS5CbG9ja1N0YXRlbWVudCB8fCBmbGFncy5tb2RlID09PSBNT0RFLlN0YXRlbWVudCkgJiYgKGZsYWdzLmxhc3RfdGV4dCA9PT0gJ3snIHx8IGZsYWdzLmxhc3RfdGV4dCA9PT0gJzsnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB7IGZvbzsgLS1pIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gZm9vKCk7IC0tYmFyO1xuICAgICAgICAgICAgICAgICAgICBwcmludF9uZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbl90ZXh0ID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MudGVybmFyeV9kZXB0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmxhZ3MubW9kZSA9PT0gTU9ERS5CbG9ja1N0YXRlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3MubW9kZSA9IE1PREUuT2JqZWN0TGl0ZXJhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzcGFjZV9iZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbGFncy50ZXJuYXJ5X2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbl90ZXh0ID09PSAnPycpIHtcbiAgICAgICAgICAgICAgICBmbGFncy50ZXJuYXJ5X2RlcHRoICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiB8fCBzcGFjZV9iZWZvcmU7XG4gICAgICAgICAgICBwcmludF90b2tlbigpO1xuICAgICAgICAgICAgb3V0cHV0X3NwYWNlX2JlZm9yZV90b2tlbiA9IHNwYWNlX2FmdGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlX2Jsb2NrX2NvbW1lbnQoKSB7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBzcGxpdF9uZXdsaW5lcyh0b2tlbl90ZXh0KTtcbiAgICAgICAgICAgIHZhciBqOyAvLyBpdGVyYXRvciBmb3IgdGhpcyBjYXNlXG4gICAgICAgICAgICB2YXIgamF2YWRvYyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBibG9jayBjb21tZW50IHN0YXJ0cyB3aXRoIGEgbmV3IGxpbmVcbiAgICAgICAgICAgIHByaW50X25ld2xpbmUoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsX2xpbmVzX3N0YXJ0X3dpdGgobGluZXMuc2xpY2UoMSksICcqJykpIHtcbiAgICAgICAgICAgICAgICAgICAgamF2YWRvYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBsaW5lIGFsd2F5cyBpbmRlbnRlZFxuICAgICAgICAgICAgcHJpbnRfdG9rZW4obGluZXNbMF0pO1xuICAgICAgICAgICAgZm9yIChqID0gMTsgaiA8IGxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZShmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGphdmFkb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gamF2YWRvYzogcmVmb3JtYXQgYW5kIHJlLWluZGVudFxuICAgICAgICAgICAgICAgICAgICBwcmludF90b2tlbignICcgKyB0cmltKGxpbmVzW2pdKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9ybWFsIGNvbW1lbnRzIG91dHB1dCByYXdcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0X2xpbmVzW291dHB1dF9saW5lcy5sZW5ndGggLSAxXS50ZXh0LnB1c2gobGluZXNbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZm9yIGNvbW1lbnRzIG9mIG1vcmUgdGhhbiBvbmUgbGluZSwgbWFrZSBzdXJlIHRoZXJlJ3MgYSBuZXcgbGluZSBhZnRlclxuICAgICAgICAgICAgcHJpbnRfbmV3bGluZShmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfaW5saW5lX2NvbW1lbnQoKSB7XG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9jb21tZW50KCkge1xuICAgICAgICAgICAgaWYgKGlucHV0X3dhbnRlZF9uZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZShmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyaW1fb3V0cHV0KHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgICAgICBwcmludF9uZXdsaW5lKGZhbHNlLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZV9kb3QoKSB7XG4gICAgICAgICAgICBpZiAoaXNfc3BlY2lhbF93b3JkKGZsYWdzLmxhc3RfdGV4dCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfc3BhY2VfYmVmb3JlX3Rva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYWxsb3cgcHJlc2VydmVkIG5ld2xpbmVzIGJlZm9yZSBkb3RzIGluIGdlbmVyYWxcbiAgICAgICAgICAgICAgICAvLyBmb3JjZSBuZXdsaW5lcyBvbiBkb3RzIGFmdGVyIGNsb3NlIHBhcmVuIHdoZW4gYnJlYWtfY2hhaW5lZCAtIGZvciBiYXIoKS5iYXooKVxuICAgICAgICAgICAgICAgIGFsbG93X3dyYXBfb3JfcHJlc2VydmVkX25ld2xpbmUoZmxhZ3MubGFzdF90ZXh0ID09PSAnKScgJiYgb3B0LmJyZWFrX2NoYWluZWRfbWV0aG9kcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVfdW5rbm93bigpIHtcbiAgICAgICAgICAgIHByaW50X3Rva2VuKCk7XG5cbiAgICAgICAgICAgIGlmICh0b2tlbl90ZXh0W3Rva2VuX3RleHQubGVuZ3RoIC0gMV0gPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbmV3bGluZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIC8vIEFkZCBzdXBwb3J0IGZvciByZXF1aXJlLmpzXG4gICAgICAgIGlmICh0eXBlb2YgZGVmaW5lLmFtZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGVmaW5lKGZ1bmN0aW9uKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgICAgICAgICAgICAgIGV4cG9ydHMuanNfYmVhdXRpZnkgPSBqc19iZWF1dGlmeTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgaXMgQU1EICggaHR0cHM6Ly9naXRodWIuY29tL2FtZGpzL2FtZGpzLWFwaS93aWtpL0FNRCNkZWZpbmVhbWQtcHJvcGVydHktIClcbiAgICAgICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzX2JlYXV0aWZ5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gQWRkIHN1cHBvcnQgZm9yIENvbW1vbkpTLiBKdXN0IHB1dCB0aGlzIGZpbGUgc29tZXdoZXJlIG9uIHlvdXIgcmVxdWlyZS5wYXRoc1xuICAgICAgICAvLyBhbmQgeW91IHdpbGwgYmUgYWJsZSB0byBgdmFyIGpzX2JlYXV0aWZ5ID0gcmVxdWlyZShcImJlYXV0aWZ5XCIpLmpzX2JlYXV0aWZ5YC5cbiAgICAgICAgZXhwb3J0cy5qc19iZWF1dGlmeSA9IGpzX2JlYXV0aWZ5O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBJZiB3ZSdyZSBydW5uaW5nIGEgd2ViIHBhZ2UgYW5kIGRvbid0IGhhdmUgZWl0aGVyIG9mIHRoZSBhYm92ZSwgYWRkIG91ciBvbmUgZ2xvYmFsXG4gICAgICAgIHdpbmRvdy5qc19iZWF1dGlmeSA9IGpzX2JlYXV0aWZ5O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBJZiB3ZSBkb24ndCBldmVuIGhhdmUgd2luZG93LCB0cnkgZ2xvYmFsLlxuICAgICAgICBnbG9iYWwuanNfYmVhdXRpZnkgPSBqc19iZWF1dGlmeTtcbiAgICB9XG5cbn0oKSk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIl19
