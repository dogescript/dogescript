var dogescript = require('../index');
var test = require('tape');

function withInvalidSyntax(source) {
    try {
        dogescript(source, true);
    } catch (error) {
        return error;
    }
    return null;
}

test("'plz foo with' without arguments throws syntax error", function (t) {
    t.plan(2);
    var err = withInvalidSyntax('plz foo with');
    const msg = err.message;
    t.ok(err instanceof SyntaxError, 'throws SyntaxError');
    t.ok(msg.includes("Expected arguments but got nothing. Allowed construct: with [args]."));
});

test("'dose y with' without arguments throws syntax error", function (t) {
    t.plan(2);
    var err = withInvalidSyntax('dose y with');
    const msg = err.message;
    t.ok(err instanceof SyntaxError, 'throws SyntaxError');
    t.ok(msg.includes("Expected arguments but got nothing. Allowed construct: with [args]."));
});

test("'very foo is plz bar with' without arguments throws syntax error", function (t){
    t.plan(2);
    var err = withInvalidSyntax('very foo is plz bar with');
    const msg = err.message;
    t.ok(err instanceof SyntaxError, 'throws SyntaxError');
    t.ok(msg.includes("Expected arguments but got nothing. Allowed construct: with [args]."));
});

test("'levl' without argument throws syntax error", function (t) {
  t.plan(2);
  var err = withInvalidSyntax('array levl');
  const msg = err.message;
  t.ok(err instanceof SyntaxError, 'throws SyntaxError');
  t.ok(msg.includes("Expected argument but got nothing. Allowed construct: obj levl [arg]."), 'Contains correct message');
});

test("'git' without function name throws syntax error", function (t) {
  t.plan(2);
  var err = withInvalidSyntax('git');
  const msg = err.message;
  t.ok(err instanceof SyntaxError, 'throws SyntaxError');
  t.ok(msg.includes("Expected getter name but got nothing. Allowed construct: git [name]."), 'Contains correct message');
});

test("'sit' without function name throws syntax error", function (t) {
  t.plan(2);
  var err = withInvalidSyntax('sit');
  const msg = err.message;
  t.ok(err instanceof SyntaxError, 'throws SyntaxError');
  t.ok(msg.includes("Expected setter name but got nothing. Allowed construct: sit [name] with [arg]."), 'Contains correct message');
});

test("'sit' without 'with' throws syntax error", function (t) {
  t.plan(2);
  var err = withInvalidSyntax('sit fnName');
  const msg = err.message;
  t.ok(err instanceof SyntaxError, 'throws SyntaxError');
  t.ok(msg.includes("Expected: 'with' but got: 'undefined' from chain: []. Allowed construct: sit [name] with [arg]."), 'Contains correct message');
});

test("'sit' without an argument throws a syntax error", function (t) {
  t.plan(2);
  var err = withInvalidSyntax('sit fnName with');
  const msg = err.message;
  t.ok(err instanceof SyntaxError, 'throws SyntaxError');
  t.ok(msg.includes("Expected setter argument but got nothing. Allowed construct: sit [name] with [arg]."), 'Contains correct message');
});