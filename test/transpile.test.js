var fs = require('fs');
var path = require('path');
var test = require('tape');
var walk = require('walk');

// deal with CRLF from windows folks writing javascript :(
function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

function cleanCRLF(str) {
  return str.trim().replace(/\r\n/gm, '\n');
}

var transpileDir = path.join(__dirname, 'transpile');

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
  
  // windows
  if (filePath.indexOf('/') == -1) { 
    return filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
  }
  
  // unix
  return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
}

var testDirs = {};

// Who's your daddy and what does he do?
var skywalker = walk.walk(transpileDir);

// Walk every folder in the file tree adding any folders that;
// have an expected.js and have a source.js
skywalker.on('names', function(fpath, children) {
  var missingExpectFile = children.indexOf('expected.js') === -1;
  var missingSourceFile = children.indexOf('source.djs') === -1;

  
  if(missingExpectFile || missingSourceFile) return;
  
  testDirs[fpath] = { missingExpectFile, missingSourceFile };
});

skywalker.on('end', function() {

  var keys = Object.keys(testDirs);
  keys.forEach(dir => {

    var expectPath   = path.join(dir, 'expected.js');
    var sourcePath     = path.join(dir, 'source.djs');
    var expected = readCleanCRLF(expectPath);

    /**
     * Execute the binary and capture the stdout
     */
    const { exec } = require('child_process');
    const child = exec(`node ./bin/dogescript.js ${sourcePath}`,
      (err, stdout, stderr) => {
        if(err)
        {
          console.error(`exec error: ${err}`);
          return;
        }
      }
    );

    // stream the output
    var readable = child.stdout;
    readable.setEncoding('utf8');

    // when the process sends us data, validate they look the same
    readable.on('data', function(chunk) {

      var actual = cleanCRLF(chunk.toString());
      test(`transpilation of ${path.basename(dir)} should work`, function (t) {
        t.plan(1);

        t.equal(actual,expected);
      });

    });
  });
});
