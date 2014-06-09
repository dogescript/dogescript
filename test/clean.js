var fs = require('fs');
var path = require('path');
var glob = require('glob');

var specDir = path.join(__dirname, 'spec');

var files = glob.sync('*/*/dump.js', {
    cwd: specDir
});

files.forEach(function(file) {
    var target = path.join(specDir, file);
    fs.unlinkSync(target);
    console.log(file);
});
