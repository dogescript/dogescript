const dogescript = require('../dist');
const fs = require('fs');
const path = require('path');
const util = require('./util');

// Generated via the globalSetup step
var testMetadata = require(util.getTmpfilePath("errorMetadata.json"))

function runErrorTest(filepath)
{
  var filename = path.basename(filepath);
  var testName = filename.substring(0, filename.length - 4);
  var source = util.readCleanCRLF(filepath);

  // The actual test, Generate our assertion that the generated code matches the output
  it(testName, function() {
    expect(() => dogescript(source, true)).toThrow();
  });
}

describe("Spec Tests:", function() {
  // Generate tests based off of the test metadata
  for (test of testMetadata) {
    runErrorTest(test);
  }
});
