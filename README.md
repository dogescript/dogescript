![dogescript](doge.gif)

## dogescript 

[![NPM version](https://badge.fury.io/js/dogescript.svg)](http://badge.fury.io/js/dogescript) [![Build Status](https://secure.travis-ci.org/dogescript/dogescript.svg?branch=master)](http://travis-ci.org/dogescript/dogescript) [![Dependency Status](https://david-dm.org/dogescript/dogescript.svg)](https://david-dm.org/dogescript/dogescript) [![devDependency Status](https://david-dm.org/dogescript/dogescript/dev-status.svg)](https://david-dm.org/dogescript/dogescript#info=devDependencies)



This is an implementation of the best new compile-to-JS language, dogescript. Wow. 

And yes, I am very aware I went about a very, er, *non-conventional*, way of parsing a language, and is probably riddled with bugs and edge-cases. However, this is dogescript, so anything goes!

```
    wow
         such dogescript
     very compiled
                  next-generation
       npm wow
```


### Installation

`npm install -g dogescript`

### Usage

#### Command Line

`dogescript` without a file launches a REPL.

`dogescript location/to/dogescript.djs` pipes the result to stdout. Use a command like `dogescript dogescript.djs > compiled.js` to save to a file.

Options:

* `--beautify` - Runs the code through a beautifier.
* `--true-doge` - Implements "true doge" mode, which splits lines by 3 spaces, instead of by newlines. This stays behind a flag until the spacing it exports is identical to non-true-doge mode. *Deprecated in 2.4.0, to be removed in 3.0.0*

#### Javascript

`dogescript(file, beauty, trueDoge)`
* `file` - A string of Dogescript.
* `beauty` - A boolean, set to true if you want the output to be ran through a beautifier.
* `trueDoge` - A boolean, set to true if you want to enable true-doge mode. *Deprecated in 2.4.0, to be removed in 3.0.0*

#### REPL Commands

* `.load-doge [path_to_doge]`: loads dogescript code in the given file and adds it to the REPL environment. For this example, *iota* is a function that produces a series from 0 to n, ie: `iota 5 => [0,1,2,3,4]`, and is defined in `repl-test/iota.djs`.
```bash
DOGE> .load-doge repl-test/iota.djs
DOGE> undefined
DOGE> plz iota with 5
[ 0, 1, 2, 3, 4 ]
DOGE>
```

### Developer versions

If you wish to take your dogescript to the moon and leave at the edge of amaze, you can install the dogescript version as it exists in this repository:

1. `npm install` the repository
1. link the newer version with `npm link`
1. Verify by running `dogescript`, something like the following should show up (version # might be different but the pre syntax will still be there):
```bash
$ dogescript
[dogescript@2.4.0-pre]
DOGE>
```
1. To restore, navigate out of the dogescript repository and reinstall an earlier version:
`npm install dogescript@2.3.0 -g`


### Language documentation

* [`LANGUAGE.md`](/LANGUAGE.md)

### Projects using dogescript

* [Doge Adventure!](https://github.com/ngscheurich/doge-adventure): A text adventure game inspired by [leonsumbitches](http://dailydoge.tumblr.com/post/21839788086/leonsumbitches-you-have-encountered-a-doge).
* [Doge Game of Life](https://github.com/eerwitt/doge-game-of-life): Conway's Game of Life in dogescript.
* [doge-toe](http://alexdantas.net/games/doge-toe/): Tic-Tac-Toe in dogescript.

### Utilities

#### Syntax highlighting

* [vim-dogescript](https://github.com/valeriangalliat/vim-dogescript): Vim highlighting.
* [dogescript-mode](https://github.com/alexdantas/dogescript-mode): Emacs highlighting.

#### Build plugins

* [dogeify](https://github.com/remixz/dogeify): A [Browserify](http://browserify.org/) transform for dogescript, also usable in [Gulp](https://github.com/gulpjs/gulp)
* [dogescript-loader](https://github.com/Bartvds/dogescript-loader): A [Webpack](https://Webpack.github.io) loader to bundle dogescript modules.
* [grunt-dogescript](https://github.com/Bartvds/grunt-dogescript): A [Grunt](http://gruntjs.com) plugin to compile dogescript (written in Dogescript!).
* [require-doge](https://github.com/Bartvds/require-doge): Directly require() dogescript .djs files in [node.js](http://www.nodejs.org).
* [lineman-dogescript](https://github.com/linemanjs/lineman-dogescript): A [Lineman](http://linemanjs.com/) plugin to compile dogescript.

### Contributors

Dogescript was originally created by [Zach Bruggeman](https://twitter.com/zachbruggeman), and is now maintained by the [@dogescript/core](https://github.com/orgs/dogescript/people) team. Thank you to every contributor who's helped along the way!

```
$ git log --format='%aN' | sort -u
Alistair Mersereau
AnEmortalKid
Bart van der Schoor
Bartvds
Ben Atkin
Cassidy Bridges
Chad Engler
Chris Wheatley
Christina Liu
Daniel Lockhart
Elan Shanker
Erik Erwitt
Jacob Groundwater
Joe Dailey
Johann Philipp Strathausen
Joseph Dailey
Mario Nachbaur
Nicholas Scheurich
Patrick Piemonte
Ray Toal
Zach Bruggeman
achesak
alehander42
alistair.mersereau
dogejs
jasdev
noformnocontent
```
