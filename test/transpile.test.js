var fs = require('fs');
var path = require('path');
var test = require('tape');
const { exec } = require('child_process');

// deal with CRLF from windows folks writing javascript :(
function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

function cleanCRLF(str) {
  return str.trim().replace(/\r\n/gm, '\n');
}

function fetchExpected(testDirName)
{
  var expectedPath   = path.join(transpileDir, testDirName, 'expected.js');
  return readCleanCRLF(expectedPath);
}

function fetchSource(testDirName)
{
  return path.join(transpileDir, testDirName, 'source.djs');
}

var transpileDir = path.join(__dirname, 'transpile');

function runTest(testDirName)
{
  test(`${testDirName} should transpile correctly`, function (t) {
    t.plan(1);
    var expected = fetchExpected(testDirName);
    var sourcePath = fetchSource(testDirName, 'source.djs');
    /**
     * Execute the binary and capture the stdout
     */
     exec(`node ./bin/dogescript.js ${sourcePath}`, { encoding: 'UTF-8' }, (error, stdout, stderr) => {
       if (error) {
         t.fail(`exec error: ${error}`);
         return;
       }
       var actual = cleanCRLF(stdout);
       t.equal(expected, actual);
     });
  });
}

runTest('escaped-quotes');
runTest('iota');
