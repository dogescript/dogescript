var fs = require('fs');
var path = require('path');
const { exec } = require('child_process');
var util = require('./util');

const TRANSPILE_PATH = path.join(__dirname, 'transpile');
const BINARY_PATH = path.join(__dirname, '..', 'dist', 'dogescript.bin.js');

function generateFilePath(folderName, fileName) {
  return path.join(TRANSPILE_PATH, folderName, fileName);
}

function runTest(testDirName)
{
  it(`${testDirName} should transpile correctly`, function (done) {
    const expectedPath = generateFilePath(testDirName, 'expected.js')
    const sourcePath = generateFilePath(testDirName, 'source.djs');

    /**
     * Execute the binary and capture the stdout
     */
     exec(`node ${BINARY_PATH} ${sourcePath}`, { encoding: 'UTF-8' }, (error, stdout, stderr) => {
       expect(error).toEqual(null);
       expect(stderr).toEqual("");

       var expectedOutput = util.readCleanCRLF(expectedPath);
       var actual = util.cleanCRLF(stdout);

       expect(actual).toEqual(expectedOutput);
       done();
     });
  });
}

describe("Transpiling tests", function () {
  runTest('escaped-quotes');
  runTest('iota')
});
