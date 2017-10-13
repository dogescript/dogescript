var fs = require('fs');
var path = require('path');
var test = require('tape');
var glob = require('glob');

var dogescript = require('../index');

var specDir = path.join(__dirname, 'spec');

var skipped = [];

// gotta go deeper
var walkSync = function(dir, filelist)
{
  filez = fs.readdirSync(dir);
  filelist = filelist || [];
  filez.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      walkSync(dir + '/' + file, filelist);
    }
    if(path.basename(file) === 'source.djs')
    {
      filelist.push(dir);
    }
  });
  return filelist;
}

// handle subdirectories
var testdirectories = walkSync(specDir,[]);
testdirectories.sort();
testdirectories.forEach(function (directory)
{
  if(fs.existsSync(path.join(directory, 'source.djs')))
  {
    var relative = path.relative(specDir, directory);
    var testName = relative.split(path.sep).join('/'); // convert \ to / jic
    
    test(testName, function(t) {
      t.plan(1);
      
      var skip = fs.existsSync(path.join(directory, 'skip'));
      if(skip)
      {
        t.skip('skipped');
      }
      else
      {
        if (fs.existsSync(path.join(directory, 'expect.js')))
        {
          var source = fs.readFileSync(path.join(directory, 'source.djs'), 'utf8');
          var expected = fs.readFileSync(path.join(directory, 'expect.js'), 'utf8').trim().replace(/\r\n/, '\n');

          var actual = dogescript(source, true);
          // fs.writeFileSync(path.join(path.dirname(target), 'dump.js'), actual, 'utf8');

          t.equal(actual, expected);
        }
        else
        {
          t.fail('No expected js exists in ' + directory);
        }
      }
    });
  }
});
