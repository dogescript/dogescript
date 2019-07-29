/**
 * dogescript - wow so syntax such language
 *
 * Copyright (c) 2013-2014 Zach Bruggeman
 *
 * dogescript is licensed under the MIT License.
 *
 * @package dogescript
 * @author  Zach Bruggeman <talkto@zachbruggeman.me>
 */

var beautify = require('js-beautify').js_beautify;
var xhr      = require('xhr');

var parser = require('./lib/parser');

function parse (file, beauty, dogeMode) {
    if (dogeMode) var lines = file.split(/ {3,}|\r?\n/);
    else var lines = file.split(/\r?\n/);
    var script = '';

    for (var i = 0; i < lines.length; i++) {
        script += parser(lines[i]);
    }

    if (beauty) return beautify(script)
    else return script;
}

exports.default = parse;

// TODO: Investigate
if (typeof window !== 'undefined' && window !== null) {

    var queue = [];
    var seen = [];

    var stepQueue = function () {
        while (queue.length > 0 && queue[0].ready) {
            var script = queue.shift();
            exec(script.text);
        }
    }

    var exec = function (source) {
        var js = ';\n' + parse(source);
        if (js) {
            // TODO: Evaluate me and if i work
            // with (window) {
                eval(js);
            // }
        }
    }

    var getLoadEval = function (script) {
        var res = {
            type: 'load',
            ready: false,
            text: ''
        };

        xhr(script.getAttribute('src'), function (err, resp, body) {
            if (err) {
                throw err;
            }
            res.ready = true;
            if (body) {
                res.text = body;
            }
            stepQueue();
        });
        return res;
    }

    var getInlineEval = function (script) {
        return {
            type: 'inline',
            ready: true,
            text: script.innerHTML
        };
    }

    var processTags = function () {
        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (seen.indexOf(script) > -1) {
                continue;
            }
            seen.push(script);

            if (script.getAttribute('type') === 'text/dogescript') {
                if (script.getAttribute('src')) {
                    queue.push(getLoadEval(script));
                } else {
                    queue.push(getInlineEval(script));
                }
            }
        }
        stepQueue();
    }

    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', processTags);
    } else {
      window.attachEvent('onload', processTags);
    }
}

