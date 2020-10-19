import fs from 'fs';
import path from 'path';
import util from 'util';
import stream from 'stream';
import repl from 'repl';
import optimist from 'optimist';
import { js_beautify as beautify } from 'js-beautify'
import parser from '../lib/parser';
import pjson from '../package.json';
import vm from 'vm';

var argv = optimist.usage('Usage: dogescript <file> [options]').argv;

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

        // run code if desired
        if(argv.run)
        {
          const contextObject = {
            // HACK, kill the webpack warning
            require: eval('require'),
            console: console
          };
          vm.runInNewContext(output, contextObject, {
            breakOnSigint: true
          });
        }
        else {
          if (argv.beautify)
          {
            process.stdout.write(beautify(output, {break_chained_methods: false}) + '\n');
          }
          else
          {
            process.stdout.write(output);
          }
        }
    });
} else {
    // display version message in repl
    process.stdout.write("[dogescript@"+pjson.version+"]\n");

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

    replServer.defineCommand('plz-exit', {
      help: 'Exits the repl',
      action()
      {
        process.exit();
      }
    }
    );

    // begin streaming stdin to the dg translator and repl
    process.stdin.pipe(ds);
}
