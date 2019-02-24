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

test("handles json ", function (t){
  t.plan(1);
  var input = "very x is { foo: bar }";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["very", "x", "is", "{", "foo:", "bar", "}"]);
});

test("handles arrays", function (t){
  t.plan(1);
  var input = "very x is [1, 2, 3]";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["very", "x", "is", "[1,", "2,", "3]"]);
});

test("doens't break single quoted strings", function (t) {
  t.plan(1);
  var input = "'hello world!'";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["'hello world!'"]);
});
