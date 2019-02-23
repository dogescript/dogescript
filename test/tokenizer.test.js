var tokenizer = require('../lib/tokenizer');
var test = require('tape');

test("single word tokenizes appropriately", function (t) {
    t.plan(1);
    var tokens = tokenizer.tokenize('foo');
    t.deepEqual(tokens, ['foo']);
});

test("multiple words tokenize appropriately", function (t){
  t.plan(1);
  var input = "plz foo with a b c";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ['plz', 'foo', 'with', 'a', 'b', 'c']);
});

test("handles escaped single quotes", function (t){
  t.plan(1);
  var input = "plz foo with '\''";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["plz", "foo", "with", "'\''"]);
});
