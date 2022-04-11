import dogescript from '../index';
import fs from 'fs';
import path from 'path';
import util from './util';

// Generated via the globalSetup step
var testMetadata = require(util.getTmpfilePath("specMetadata.json"))

// wipe content
if (fs.existsSync('./test_out/spec/')){
  fs.rmdirSync('./test_out/spec/', { recursive: true });
}
fs.mkdirSync('./test_out/spec/', { recursive: true });

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

      // ex: from test/language-spec/wow/end to wow/end
      var specStart = folder.indexOf('language-spec');
      var folderClean = folder.substring(specStart + 'language-spec/'.length).replace('\\', '/');
      var testDir = './test_out/spec/' + folderClean;
     
      fs.mkdirSync(testDir, {recursive: true});
      fs.writeFileSync(testDir + '/expected', expectedOutput);
      fs.writeFileSync(testDir + '/actual', compiled);
      fs.writeFileSync(testDir + '/source.djs', source);
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
