var fs = require('fs');
var path = require('path');

console.log('Cleaning ' + __dirname);

var bundlePath = path.join(__dirname, 'exerciser-bundle.js');

if(fs.existsSync(bundlePath))
{
  fs.unlinkSync(bundlePath);
}
