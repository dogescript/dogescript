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

var parser = require('./lib/parser');

function parse(file, beauty, dogeMode) {
    if (dogeMode) var lines = file.split(/ {3,}|\r?\n/);
    else var lines = file.split(/\r?\n/);
    var script = '';

    for (var i = 0; i < lines.length; i++) {
        script += parser(lines[i]);
    }

    if (beauty) return beautify(script)
    else return script;
}

module.exports = parse;

if (window && document) {

    function getXHR() {
        if (XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        return new ActiveXObject('Microsoft.XMLHTTP');
    }

    var queue = [];
    var seen = [];

    function stepQueue() {
        while (queue.length > 0 && queue[0].ready) {
            var script = queue.shift();
            exec(script.text);
        }
    }

    function exec(source) {
        var js = ';\n' + parse(source);
        if (js) {
            with (window) {
                eval(js);
            }
        }
    }

    function getLoadEval(script) {
        var res = {
            type: 'load',
            async: (script.getAttribute('async') || script.getAttribute('defer')),
            ready: false,
            text: null
        };

        var xhr = getXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                res.ready = true;
                res.text = xhr.responseText;
                stepQueue();
            }
        };

        xhr.open('GET', script.getAttribute('src'), true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(null);

        return res;
    }

    function getInlineEval(script) {
        return {
            type: 'inline',
            ready: true,
            text: script.innerHTML
        };
    }

    function processTags() {
        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (seen.indexOf(script) > -1) {
                continue;
            }
            seen.push(script);

            if (script.getAttribute('type') === 'text/dogescript') {
                if (script.getAttribute('src')) {
                    var res = getLoadEval(script);
                    if (!res.async) {
                        queue.push(res);
                    }
                }
                else {
                    queue.push(getInlineEval(script));
                }
            }
        }
        stepQueue();
    }

    processTags();

    window.addEventListener('load', function () {
        processTags();
    })
}
