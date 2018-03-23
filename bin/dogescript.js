#!/usr/bin/env node

var fs       = require('fs');
var path     = require('path');
var util     = require('util');
var stream   = require('stream');
var repl     = require('repl');
var argv     = require('optimist').usage('Usage: dogescript <file> [options]').argv;
var beautify = require('js-beautify').js_beautify;
var parser   = require('../lib/parser');
var pjson = require('../package.json');


// display version message
process.stdout.write("[dogescript@"+pjson.version+"]\n");

if (argv._[0]) {
    var file = fs.readFile(path.resolve(process.cwd(), argv._[0]), {encoding: 'utf-8'}, function (err, script) {
        var lines = '';

        if (argv['true-doge'])
        {
          process.stdout.write("!-- WARNING: true-doge mode is deprecated --!\n");
          lines = script.split(/ {3,}|\r?\n/);
        }
        else
        {
          lines = script.split(/\r?\n/);
        }

        var output = '';

        for (var i = 0; i < lines.length; i++) {
            output += parser(lines[i]);
        }

        // allow run mode
        if(argv.run)
        {
          const vm = require('vm');
          vm.runInNewContext(output,
            {
              require: require,
              console: console
            }
          );
          process.exit();
        }

        if (argv.beautify)
        {
          process.stdout.write(beautify(output, {break_chained_methods: false}) + '\n');
        }
        else
        {
          process.stdout.write(output);
        }
    });
} else {
    // streamy inheritance stuff
    // boilerblate from the docs
    function Stream () {
        stream.Transform.call(this);
    }
    util.inherits(Stream, stream.Transform);

    // see streams documentation
    Stream.prototype._transform = function (chunk, encoding, callback) {
        var script = parser(chunk.toString());
        var lines  = script.split(/\n+/);
        for (var i = 0; i < lines.length; i++) {
            // ignore empty lines
            if (lines[i] !== '') this.push(lines[i] + '\n');
        }
        callback();
    }

    var ds = new Stream();
    // pipe stdin through the dogescript translator to the repl
    // can't use options.eval with a custom eval function since the javascript evaluator reference gets overwritten and defaultEval is not accessible
    const replServer = repl.start({
        prompt : "DOGE> ",
        input  : ds,
        output : process.stdout
    });

    replServer.defineCommand('plz-load', {
      help: 'Loads a dogescript file into the repl',
      action(filename) {
         var file = fs.readFile(path.resolve(process.cwd(), filename), {encoding: 'utf-8'}, function (err, script) {
          if (argv['true-doge']) var lines = script.split(/ {3,}|\r?\n/);
          else var lines = script.split(/\r?\n/);
          replServer.editorMode = true;
          for (var i = 0; i < lines.length; i++) {
              replServer.write(parser(lines[i]));
          }
          replServer.editorMode = false;
          replServer.write('\n');
         });

        this.displayPrompt();
      }
    });

    // begin streaming stdin to the dg translator and repl
    process.stdin.pipe(ds);
}
