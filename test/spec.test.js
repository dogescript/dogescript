var fs = require('fs');
var path = require('path');
var test = require('tape');

var dogescript = require('../index');

var specDir = path.join(__dirname, 'spec');

var files = fs.readdirSync(specDir);
files.sort();
files.forEach(function (dir) {
    var target = path.join(specDir, dir);
    if (!fs.statSync(target).isDirectory()) {
        return;
    }

    test(path.basename(dir), function (t) {
        t.plan(1);
        
        var source = fs.readFileSync(path.join(target, 'source.djs'), 'utf8');
        var expected = fs.readFileSync(path.join(target, 'expect.js'), 'utf8').trim().replace(/\r\n/, '\n');
        var actual = dogescript(source, true);
        t.equal(actual, expected);
    });
});
