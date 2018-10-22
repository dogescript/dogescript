var fs = require('fs');
var path = require('path');
var test = require('tape');

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
var expectedFilePath = path.join(transpileDir, 'expected.js');
var expected = readCleanCRLF(expectedFilePath);

/**
 * Execute the binary and capture the stdout
 */
const { exec } = require('child_process');
const child = exec('node ./bin/dogescript.js ./test/transpile/source.djs',
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
  test('transpilation should work', function (t) {
    t.plan(1);

    t.equal(actual,expected);
  });

});
