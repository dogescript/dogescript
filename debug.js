
var beautify = require('js-beautify').js_beautify;
// easy setup for debugging
var dogescript = require("./index.js")

var code = `
very x
x is foo giv bar giv baz
very y
y is foo levl 1 levl 2
`
// finalized product is beautified as part of tests
console.log(beautify(dogescript.default(code)));
