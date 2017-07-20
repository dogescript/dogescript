![dogescript](doge.gif)

## dogescript 

+[![NPM version](https://badge.fury.io/js/dogescript.svg)](http://badge.fury.io/js/dogescript) [![Build Status](https://secure.travis-ci.org/alistairyves/dogescript.svg?branch=master)](http://travis-ci.org/alistairyves/dogescript) [![Dependency Status](https://david-dm.org/alistairyves/dogescript.svg)](https://david-dm.org/alistairyves/dogescript) [![devDependency Status](https://david-dm.org/alistairyves/dogescript/dev-status.svg)](https://david-dm.org/alistairyves/dogescript#info=devDependencies)

(aka when Zach went insane)

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

### Language documentation

* Introduction to Dogescript - http://alexdantas.net/stuff/posts/introduction-to-dogescript/
* `LANGUAGE.md`

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

Dogescript has been made possible thanks to the contributions of many people. Thank you to everyone who has contributed in some way!

```bash
$ git log --format='%aN' | sort -u

Bart van der Schoor
Ben Atkin
Chad Engler
Chris Wheatley
Daniel Lockhart
Elan Shanker
Erik Erwitt
Jacob Groundwater
Joe Dailey
Johann Philipp Strathausen
Joseph Dailey
Nicholas Scheurich
Patrick Piemonte
Ray Toal
Zach Bruggeman
achesak
alehander42
dogejs
jasdev
noformnocontent
```
