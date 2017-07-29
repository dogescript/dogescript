var fs = require('fs');
var path = require('path');

console.log('Cleaning ' + __dirname);
fs.unlinkSync(path.join(__dirname, 'debugger-data-loader.js'));
fs.unlinkSync(path.join(__dirname, 'debugger-harness.js'));
