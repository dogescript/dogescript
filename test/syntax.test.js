import dogescript from '../index';

function expectInvalidSyntaxError(source, errorMessage) {
  var test = function() {
    return dogescript(source, true);
  };

  expect(test).toThrow(new SyntaxError(errorMessage));
}

function expectError(source, errorMessage) {
  var test = function() {
    return dogescript(source, true);
  };

  expect(test).toThrow(new Error(errorMessage));
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

  describe("giv", function() {
    it("'giv' without argument throws syntax error", function () {
      expectInvalidSyntaxError(
        'array giv',
        "Expected argument but got nothing. Allowed construct: obj giv [arg]. Parsed tokens [array,giv] from input \"array giv\""
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
        'Expected setter name but got nothing. Allowed construct: sit [name] much [arg]. Parsed tokens [sit] from input \"sit\"'
      );
    });

    it("'sit' without 'much' throws syntax error", function () {
      expectError(
        'sit fnName',
        "Invalid parse state! Expected: 'much' but got: 'undefined' from chain: []. Parsed tokens [sit,fnName] from input \"sit fnName\""
      );
    });
  });

  describe("stay", function() {
    it("'stay' without function name throws syntax error", function () {
      expectInvalidSyntaxError(
        'stay',
        'Expected function name but got nothing. Allowed construct: stay [name] <much [arg]>. Parsed tokens [stay] from input \"stay\"'
      );
    });
  });

  describe("bigify", function() {
    it("'bigify' without argument name throws syntax error", function () {
      expectInvalidSyntaxError(
        'bigify',
        'Expected argument name but got nothing. Allowed construct: bigify [arg]. Parsed tokens [bigify] from input \"bigify\"'
      );
    });
  });

  describe("smallify", function() {
    it("'smallify' without argument name throws syntax error", function () {
      expectInvalidSyntaxError(
        'smallify',
        'Expected argument name but got nothing. Allowed construct: smallify [arg]. Parsed tokens [smallify] from input \"smallify\"'
      );
    });
  });

});