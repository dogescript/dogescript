var dogescript = require('../index');
var fs = require('fs');
var path = require('path');
var util = require("./util");

// Generated via the globalSetup step
var testMetadata = require(util.getTmpfilePath("specMetadata.json"))

function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

function runSpecTest(testName, folder)
{
  var shouldSkip = fs.existsSync(path.join(folder, 'skip'));
  var testFn = shouldSkip ? it.skip : it;

  if (!fs.existsSync(path.join(folder, 'expect.js'))) {
    throw new Exception('No expected js exists in ' + folder)
  }

  var expectedOutputPath   = path.join(folder, 'expect.js');
  var sourcePath           = path.join(folder, 'source.djs');

  var expectedOutput = readCleanCRLF(expectedOutputPath);
  var source         = readCleanCRLF(sourcePath);
  var compiled       = dogescript(source, true);

  // The actual test, Generate our assertion that the generated code matches the output
  testFn(testName, function() {
    expect(expectedOutput).toEqual(compiled);
  });
}

describe("Spec Tests:", function() {
  // Generate tests based off of the test metadata
  for (test of testMetadata) {
    runSpecTest.apply(null, test)
  }
});
