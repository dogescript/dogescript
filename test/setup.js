var fs = require('fs');
var path = require('path');
var walk = require('walk');
var util = require('./util');

var specDir = path.join(__dirname, 'spec');

// deal with CRLF from windows folks writing javascript :(
function readCleanCRLF(fpath) {
  return fs.readFileSync(fpath, 'utf8')
    .trim()
    .replace(/\r\n/gm, '\n');
}

// TODO: Replace me.
function getFolderName(filePath) {
  // windows
  if (filePath.indexOf('/') == -1) {
    return filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
  }

  // unix
  return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
}

// Returns a promise to a map of records containing
// { specFileDir: { missingExpectFile: bool, missingSourceFile: bool }}
function getSpecFiles(specPath) {
  return new Promise(function (resolve,) {
      var testDirs = {};
      var skywalker = walk.walk(specPath);

      // Walk every folder in the file tree adding any folders that;
      // have an expect.js and have a source.js
      skywalker.on('names', function(fpath, children) {
        var missingExpectFile = children.indexOf('expect.js') === -1;
        var missingSourceFile = children.indexOf('source.djs') === -1;

        // Could throw an error here for invalid test format
        if(missingExpectFile || missingSourceFile) return;

        testDirs[fpath] = { missingExpectFile, missingSourceFile };
      });

      skywalker.on('end', function() {
        resolve(testDirs);
    });
  });
}

// Takes a specFileMapping and transforms it into a serializable format
// For the test suite to use (globals are not permitted)
function formatSpecMetadata(testDirMapping) {
  return Object
    .keys(testDirMapping)
    .map(function(dir) {
      var testName = getFolderName(dir);

      // Separate by directory if it wasnt a directory with a name-like-this
      if(!testName.includes('-'))
      {
        var relative = path.relative(specDir, dir);
        testName = relative.split(path.sep).join('-');
      }

      return [testName, dir];
    });
}

// setup.js, global setup for jest
module.exports =  function() {
  return getSpecFiles(specDir)
    .then(formatSpecMetadata)
    .then(function (specMetadata) {
      util.writeTmpFile('specMetadata.json', JSON.stringify(specMetadata));
    });
};