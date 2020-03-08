import dogescript from '../index';
import fs from 'fs';
import path from 'path';
import util from './util';

// Generated via the globalSetup step
var testMetadata = require(util.getTmpfilePath("specMetadata.json"))

function runSpecTest(testName, folder)
{
  var shouldSkip = fs.existsSync(path.join(folder, 'skip'));
  var testFn = shouldSkip ? it.skip : it;

  if (!fs.existsSync(path.join(folder, 'expect.js'))) {
    throw new Exception('No expected js exists in ' + folder)
  }

  var expectedOutputPath   = path.join(folder, 'expect.js');
  var sourcePath           = path.join(folder, 'source.djs');

  var expectedOutput = util.readCleanCRLF(expectedOutputPath);
  var source         = util.readCleanCRLF(sourcePath);
  var compiled       = dogescript(source, true);

  // The actual test, Generate our assertion that the generated code matches the output
  testFn(testName, function() {
    try {
      expect(compiled).toEqual(expectedOutput);
    }catch(e)
    {
      console.log('Test Failed:' + testName);
      throw e;
    }
  });
}

describe("Spec Tests:", function() {
  // Generate tests based off of the test metadata
  for (test of testMetadata) {
    runSpecTest.apply(null, test)
  }
});
