var path = require('path');
var process = require('process');
var walk = require('walk');
var util = require('./util');
const { exec } = require('child_process');


var specDir = path.join(__dirname, 'language-spec');
var errorDir = path.join(__dirname, 'invalid-syntax');

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

// Returns a promise to a list of filenames
function getErrorFiles() {
  return new Promise(function (resolve,) {
    var list = [];
    var skywalker = walk.walk(errorDir);

    skywalker.on('file', function (root, fileStats, next) {
      if (fileStats.name.endsWith('.djs')) {
        list.push(path.resolve(root, fileStats.name));
      }
      next();
    });

    skywalker.on('end', function () {
      resolve(list);
    });
  });
}

// Build our project for E2E testing
function buildProject() {
  const ROOT_DIR = path.join(__dirname, '..');
  const buildCommand = "npm run build";

  console.log("\n\n🛠  Building dogescript...\n")
  return new Promise((resolve, reject) => {
    /**
     * Compile the binary for testing
     */
    exec(`cd ${ROOT_DIR} && ${buildCommand}`, { encoding: 'UTF-8' }, (error, stdout, stderr) => {
      const errorOutput = stderr.toString();
      const stdOutput = stdout.toString();
      const errMsg = "Failed to start testing suite, compiler build failed";

      if (error || errorOutput) {
        console.error(errorOutput);
        console.error(stdOutput);
        console.error(errMsg)
        reject([
          new Error(errMsg),
          stdOutput,
          errorOutput,
        ]);
      }

      resolve();
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
  return Promise.all([
    getSpecFiles(specDir)
      .then(formatSpecMetadata)
      .then(function (specMetadata) {
        util.writeTmpFile('specMetadata.json', JSON.stringify(specMetadata));
      }),
    getErrorFiles()
      .then(function (errorMetadata) {
        util.writeTmpFile('errorMetadata.json', JSON.stringify(errorMetadata));
      }),
  ])
    .then(buildProject);
};
