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
* `--run` - Runs the dogescript code

#### Javascript

`dogescript(file, beauty, trueDoge)`
* `file` - A string of Dogescript.
* `beauty` - A boolean, set to true if you want the output to be ran through a beautifier.
* `trueDoge` - A boolean, set to true if you want to enable true-doge mode. *Deprecated in 2.4.0, to be removed in 3.0.0*

#### REPL Commands

* `.plz-load [path_to_doge]`: loads dogescript code in the given file and adds it to the REPL environment. For this example, *iota* is a function that produces a series from 0 to n, ie: `iota 5 => [0,1,2,3,4]`, and is defined in `repl-test/iota.djs`.
* `.plz-exit`: exits the REPL environment and terminates the process. An alternative to `.exit`.

**iota.djs**
```djs
such iota much n
  very series is Array dose apply with null {length:n}&
  dose map with Number.call Number
wow series
```

*Loaded and execute*
```bash
DOGE> .plz-load repl-test/iota.djs
DOGE> undefined
DOGE> plz iota with 5
[ 0, 1, 2, 3, 4 ]
DOGE>
```

### Language documentation

* [`LANGUAGE.md`](/LANGUAGE.md)

### Projects using dogescript

* [Doge Adventure!](https://github.com/ngscheurich/doge-adventure): A text adventure game inspired by [leonsumbitches](http://dailydoge.tumblr.com/post/21839788086/leonsumbitches-you-have-encountered-a-doge).
* [Doge Game of Life](https://github.com/eerwitt/doge-game-of-life): Conway's Game of Life in dogescript.
* [doge-toe](https://github.com/alexdantas/doge-toe): Tic-Tac-Toe in dogescript.

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
Jan Monterrubio (AnEmortalKid)
Joe Dailey
Johann Philipp Strathausen
Joseph Dailey
Mario Nachbaur
Nicholas Scheurich
Patrick Piemonte
Peter Carnesciali
Ray Toal
Zach Bruggeman
achesak
alehander42
alistair.mersereau
dogejs
jasdev
noformnocontent
```

## Community

Join us at [dogescript.slack.com](http://dogescript.slack.com). Since it is slack, you'll need an invite to the channel. Visit [this site to get invited](https://doge-invite.herokuapp.com/). The invite site is built with [slack-invite-automation](https://github.com/outsideris/slack-invite-automation) and is deployed to heroku. Since we are on the free tier, dyno's take a bit to load so give it at least 30 seconds to load the first time.
