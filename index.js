require("babel-core/register")
require("babel-polyfill")
var ds = require("./dist/dogescript")

ds.main(__dirname, process.argv.slice(2, process.argv.length))
  .catch(function(err) { console.log(err) })
