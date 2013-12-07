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
