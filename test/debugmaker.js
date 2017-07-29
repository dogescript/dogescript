var fs = require('fs');
var path = require('path');
var beautify = require('js-beautify').js_beautify;

var dogescript = require('../index');

process.argv.forEach(function (val, index, array) {
  
  // only grab the last argument
  console.log(index + '/' + (array.length-1) + ': ' + val);
  if(index == array.length-1)
  {
    console.log('Writing debug data for ' + val);
    
    var specDir = path.join(__dirname, 'spec');
    var debugDir = path.join(__dirname, 'debug');
    
    var testPath = path.join(specDir, val);
    console.log('testPath: '+testPath);
    
    // deal with CRLF from windows folks writing javascript :(
    var expected = fs.readFileSync(path.join(testPath, 'expect.js'), 'utf8').trim().replace(/\r\n/gm, '\n');
    console.log('expects:\n'+expected +'\n');
    
    var source = fs.readFileSync(path.join(testPath, 'source.djs'), 'utf8');
    console.log('source:\n'+source +'\n');
    
    var actual = dogescript(source, true);
    console.log('actual:\n'+actual +'\n');
    
    var statements = '';
    statements += 'document.getElementById(\'dogescript-code\').textContent = `'+source+'`;'
    statements += 'document.getElementById(\'expected-code\').textContent = `'+expected+'`;'
    statements += 'document.getElementById(\'actual-code\').textContent = `'+actual+'`;'
    
    var debugDataLoaderPath = path.join(debugDir, "debugger-data-loader.js");
    console.log('Creating debugger-data-loader.js in ' + debugDataLoaderPath);
    
    fs.writeFile(debugDataLoaderPath, statements, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
    });
  }
});