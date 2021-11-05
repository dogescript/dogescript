var util = require('./util');

// Tear down function after all tests are run
module.exports = function() {
  console.log("\n🛁 Cleaning Up...\n")

  return new Promise(function (resolve) {
    util.deleteTmpFolder();
  });
}