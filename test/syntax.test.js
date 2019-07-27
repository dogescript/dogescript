function expectInvalidSyntaxError(source, errorMessage) {
  var dogescript = require('../index');

  var test = function() {
    return dogescript(source, true);
  };

  expect(test).toThrow(new SyntaxError(errorMessage));
}


describe("Syntax Errors", function() {


  describe("with", function() {

    it("'plz foo with' without arguments throws syntax error", function () {
      expectInvalidSyntaxError(
        'plz foo with',
        "Expected arguments but got nothing. Allowed construct: with [args]. Parsed tokens [plz,foo,with] from input \"plz foo with\""
      );
    });

    it("'dose y with' without arguments throws syntax error", function () {
        expectInvalidSyntaxError(
          'dose y with',
          'Expected arguments but got nothing. Allowed construct: with [args]. Parsed tokens [dose,y,with] from input \"dose y with\"'
        );
    });

    it("'very foo is plz bar with' without arguments throws syntax error", function (){
        expectInvalidSyntaxError(
          'very foo is plz bar with',
          "Expected arguments but got nothing. Allowed construct: with [args]. Parsed tokens [very,foo,is,plz,bar,with] from input \"very foo is plz bar with\""
        );
    });

  });


  describe("levl", function() {
    it("'levl' without argument throws syntax error", function () {
      expectInvalidSyntaxError(
        'array levl',
        "Expected argument but got nothing. Allowed construct: obj levl [arg]. Parsed tokens [array,levl] from input \"array levl\""
      );
    });
  });


  describe("git", function() {

    it("'git' without function name throws syntax error", function () {
      expectInvalidSyntaxError(
        'git',
        "Expected getter name but got nothing. Allowed construct: git [name]. Parsed tokens [git] from input \"git\""
      );
    });

  });


  describe("sit", function() {

    it("'sit' without function name throws syntax error", function () {
      expectInvalidSyntaxError(
        'sit',
        'Expected setter name but got nothing. Allowed construct: sit [name] with [arg]. Parsed tokens [sit] from input \"sit\"'
      );
    });

    it("'sit' without 'with' throws syntax error", function () {
      expectInvalidSyntaxError(
        'sit fnName',
        "Expected: 'with' but got: 'undefined' from chain: []. Allowed construct: sit [name] with [arg]. Parsed tokens [sit,fnName] from input \"sit fnName\""
      );
    });

    it("'sit' without an argument throws a syntax error", function () {
      expectInvalidSyntaxError(
        'sit fnName with',
        "Expected setter argument but got nothing. Allowed construct: sit [name] with [arg]. Parsed tokens [sit,fnName,with] from input \"sit fnName with\"",
      );
    });

  });

});
