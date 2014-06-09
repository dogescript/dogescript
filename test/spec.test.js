var fs = require('fs');
var path = require('path');
var test = require('tape');
var glob = require('glob');

var dogescript = require('../index');

var specDir = path.join(__dirname, 'spec');

var skipped = [];

var files = glob.sync('*/*/source.djs', {
    cwd: specDir
});

files.sort();
files.forEach(function (file) {
    var target = path.join(specDir, file);
    if (!fs.statSync(target).isFile()) {
        return;
    }

    test(path.dirname(file), function (t) {
        t.plan(1);

        var skip = fs.existsSync(path.join(path.dirname(target), 'skip'));
        if (skip) {
            t.skip('skipped');
        }
        else {
            var source = fs.readFileSync(target, 'utf8');
            var expected = fs.readFileSync(path.join(path.dirname(target), 'expect.js'), 'utf8').trim().replace(/\r\n/, '\n');

            var actual = dogescript(source, true);

            // uncomment this line for debugging
            // fs.writeFileSync(path.join(path.dirname(target), 'dump.js'), actual, 'utf8');

            t.equal(actual, expected);
        }
    });
});
