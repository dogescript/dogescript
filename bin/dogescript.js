#!/usr/bin/env node

var fs       = require('fs');
var path     = require('path');
var argv     = require('optimist').usage('Usage: dogescript <file>').demand(1).argv;
var beautify = require('js-beautify').js_beautify;

var parser   = require('../lib/parser');

var file = fs.readFile(path.resolve(process.cwd(), argv._[0]), {encoding: 'utf-8'}, function (err, script) {
    var lines = script.split('\n');
    var output = '';

    for (var i = 0; i < lines.length; i++) {
        output += parser(lines[i]);
    }

    if (argv.beautify){
     process.stdout.write(beautify(output))
 	}else{
 	 fs.writeFile(path.resolve(process.cwd(),argv._[1]), output, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was compile!");
		    }
		});
 	}
});