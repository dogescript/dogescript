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