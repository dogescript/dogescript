var fs = require('fs');
var path = require('path');
const { exec } = require('child_process');
var util = require('./util');

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
  var expectedPath   = path.join(__dirname, 'transpile', testDirName, 'expected.js');
  return readCleanCRLF(expectedPath);
}

function fetchSource(testDirName)
{
  return path.join(__dirname, 'transpile', testDirName, 'source.djs');
}

function runTest(testDirName)
{
  it(`${testDirName} should transpile correctly`, function (done) {
    var expected = fetchExpected(testDirName);
    var sourcePath = fetchSource(testDirName, 'source.djs');
    /**
     * Execute the binary and capture the stdout
     */
     exec(`node ./bin/dogescript.js ${sourcePath}`, { encoding: 'UTF-8' }, (error, stdout, stderr) => {
       expect(error).toEqual(null);
       var actual = cleanCRLF(stdout);

       expect(expected).toEqual(actual);
       done();
     });
  });
}

describe("Transpiling tests", function () {
  runTest('escaped-quotes');
  runTest('iota')
});
