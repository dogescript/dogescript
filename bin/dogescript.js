#!/usr/bin/env node

var fs   = require('fs');
var path = require('path');
var argv = require('optimist').usage('Usage: dogescript <file>').demand(1).argv;
var es   = require('event-stream');

var parser = require('../lib/parser');

fs.createReadStream(path.resolve(process.cwd(), argv._[0]))
    .pipe(es.split())
    .pipe(es.mapSync(parser))
    .pipe(process.stdout);
