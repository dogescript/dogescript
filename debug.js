
var beautify = require('js-beautify').js_beautify;
// easy setup for debugging
var dogescript = require("./index.js")

var code = `
very a is '\''
`
// finalized product is beautified as part of tests
console.log(beautify(dogescript.default(code)));
