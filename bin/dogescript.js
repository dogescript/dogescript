#!/usr/bin/env node

var fs       = require('fs');
var path     = require('path');
var util     = require('util');
var stream   = require('stream');
var repl     = require('repl');
var argv     = require('optimist').usage('Usage: dogescript <file>').argv;
var beautify = require('js-beautify').js_beautify;
var parser   = require('../lib/parser');

if (argv._[0]){
  var file = fs.readFile(path.resolve(process.cwd(), argv._[0]), {encoding: 'utf-8'}, function (err, script) {
      var lines = script.split('\n');
      var output = '';

      for (var i = 0; i < lines.length; i++) {
          output += parser(lines[i]);
      }

      if (argv.beautify) process.stdout.write(beautify(output))
      else process.stdout.write(output);
  });
}
else {

  // streamy inheritance stuff
  // boilerblate from the docs
  util.inherits(DogeJSStream, stream.Transform);
  function DogeJSStream(){
    stream.Transform.call(this);
  }
  
  // see streams documentation
  DogeJSStream.prototype._transform = function(chunk, encoding, next){
    var script = parser( chunk.toString() );
    var lines  = script.split(/\n+/);
    for(var i=0; i<lines.length; i++) {
      // ignore empty lines
      if(lines[i]!=='') this.push( lines[i] + '\n' );
    }
    next();
  }

  var ds = new DogeJSStream();

  // pipe stdin through the dogescript tranlator to the repl
  repl.start({
    prompt : "DOGE> ",
    input  : ds,
    output : process.stdout
  });

  // begin streaming stdin to the dg translator and repl
  process.stdin.pipe(ds);
 
}
