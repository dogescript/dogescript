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

var parser = require('./lib/parser');

module.exports = function (file) {
    var lines = file.split('\n');
    var script = '';

    for (var i = 0; i < lines.length; i++) {
        script += parser(lines[i]);
    }

    return script;
}
