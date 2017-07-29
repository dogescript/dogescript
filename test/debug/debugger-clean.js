var fs = require('fs');
var path = require('path');

console.log('Cleaning ' + __dirname);

var loaderPath = path.join(__dirname, 'debugger-data-loader.js');
var harnessPath = path.join(__dirname, 'debugger-harness.js');

if(fs.existsSync(loaderPath))
{
  fs.unlinkSync(loaderPath);
}

if(fs.existsSync(harnessPath))
{
  fs.unlinkSync(harnessPath);
}