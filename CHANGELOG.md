# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0]

### Added

- Loading of dogescript files in REPL [#111](https://github.com/dogescript/dogescript/pull/111)
- Add `pawse` as an alias to `debooger` [#121](https://github.com/dogescript/dogescript/pull/121)
- Add `--run` option to repl [#122](https://github.com/dogescript/dogescript/pull/122)
- Add increment and decrement operators [#123](https://github.com/dogescript/dogescript/pull/123)
- Add commonjs `export` keyword [#131](https://github.com/dogescript/dogescript/pull/131)
- Support comparison operators as expressions [#186](https://github.com/dogescript/dogescript/pull/186)
- Support binary operators as expression [#191](https://github.com/dogescript/dogescript/pull/191)
- Add property accessor [#192](https://github.com/dogescript/dogescript/pull/192)
- Add non line breaking function call terminator [#195](https://github.com/dogescript/dogescript/pull/195)
- Add array access operator [#197](https://github.com/dogescript/dogescript/pull/197)
- Add an explicit `return` keyword [#208](https://github.com/dogescript/dogescript/pull/208)
- Add ECMA6 `class` support [Class Support Issue](https://github.com/dogescript/dogescript/issues/126)
- Add `break` keyword [#254](https://github.com/dogescript/dogescript/pull/254)
- Add command to exit repl [#255](https://github.com/dogescript/dogescript/pull/255)
- Add new unambiguous equality operators [#257](https://github.com/dogescript/dogescript/pull/257)
- Added async function support 
  - [#259](https://github.com/dogescript/dogescript/pull/259) 
  - [#260](https://github.com/dogescript/dogescript/pull/260)
  - [#262](https://github.com/dogescript/dogescript/pull/262)
- Add generator functions [#261](https://github.com/dogescript/dogescript/pull/261)

### Changed

- Enable usage of assignment operators as expressions [#118](https://github.com/dogescript/dogescript/pull/118)
- Deprecate `true-doge` mode [#122](https://github.com/dogescript/dogescript/pull/122)
- Fix an edge case with `plz` and json [#147](https://github.com/dogescript/dogescript/pull/147)
- Fix object assignment without need for `very` [#184](https://github.com/dogescript/dogescript/pull/184)
- Fix inlined `json` [#188](https://github.com/dogescript/dogescript/pull/188)
- Fix `maybe` [#223](https://github.com/dogescript/dogescript/pull/223)
- Remove ambiguity for post/pre increment/decrement [#242](https://github.com/dogescript/dogescript/pull/242)
- Fix npm bin creation [#246](https://github.com/dogescript/dogescript/pull/246)
- Fix REPL run cannot run express or long lived processes[#271](https://github.com/dogescript/dogescript/pull/271)


[Inreleased]: https://github.com/dogescript/dogescript/compare/6fb5d4dfc93c507b83474119d9e869350e7e11a1...HEAD
[2.4.0]: https://github.com/dogescript/dogescript/compare/6fb5d4dfc93c507b83474119d9e869350e7e11a1...HEAD
