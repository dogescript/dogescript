
var beautify = require('js-beautify').js_beautify;
// easy setup for debugging
var dogescript = require("./index.js")

var code = `
very x is foo giv bar giv baz
console dose loge with x
`
// finalized product is beautified as part of tests
console.log(beautify(dogescript.default(code)));
