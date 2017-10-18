var fs = require('fs');
var path = require('path');
var test = require('tape');
var walk = require('walk');

var dogescript = require('../index');

var specDir = path.join(__dirname, 'spec');

// deal with CRLF from windows folks writing javascript :(
function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

// Pop a directory off it's path (os safe)
function dotdotSlash(filePath) {
  var str;
  if (filePath.indexOf('/') == -1) { // windows
    str = filePath.substring(0, filePath.lastIndexOf('\\'));
  }
  else { // unix
    str = filePath.substring(0, filePath.lastIndexOf('/'));
  }

  return str + '/'
}

function getFolderName(filePath) {
  if (filePath.indexOf('/') == -1) { // windows
    return filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
  }
  else { // unix
    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
  }
}

var testDirs = {};

// Who's your daddy and what does he do?
var skywalker = walk.walk(specDir);

// Walk every folder in the file tree adding any folders that;
// have an expect.js and have a source.js
skywalker.on('names', function(fpath, children) {
  var missingExpectFile = children.indexOf('expect.js') === -1;
  var missingSourceFile = children.indexOf('source.djs') === -1;

  
  if(missingExpectFile || missingSourceFile) return;  
  testDirs[fpath] = { missingExpectFile, missingSourceFile };
});

skywalker.on('end', function() {
  let fObj = {}
  var keys = Object.keys(testDirs);
  keys.forEach(dir => {
    var testFilePath   = path.join(dir, 'expect.js');
    var sourcePath     = path.join(dir, 'source.djs');

    var testFile = readCleanCRLF(testFilePath);
    var source   = readCleanCRLF(sourcePath);
    const actual = dogescript(source, true);
    
    var testName = getFolderName(dir);
    
    // separate by directory if it wasnt a directory with a name-like-this
    if(!testName.includes('-'))
    {
      var relative = path.relative(specDir, dir);
      testName = relative.split(path.sep).join('-');
    }
    
    test(testName, function(t) {
      t.plan(1);
        
      var skip = fs.existsSync(path.join(dir, 'skip'));
      if(skip)
      {
        t.skip('skipped');
        return;
      }
      
      if (fs.existsSync(path.join(dir, 'expect.js')))
      {
        var testFilePath   = path.join(dir, 'expect.js');
        var sourcePath     = path.join(dir, 'source.djs');

        var testFile = readCleanCRLF(testFilePath);
        var source   = readCleanCRLF(sourcePath);
    
        var actual = dogescript(source, true);
        
        // uncomment for debug
        // fs.writeFileSync(path.join(path.dirname(target), 'dump.js'), actual, 'utf8');
        t.equal(actual, testFile);
      }
      else
      {
        t.fail('No expected js exists in ' + dir);
      }
    });    
  });
});