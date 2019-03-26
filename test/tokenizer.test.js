var tokenizer = require('../lib/tokenizer');
var test = require('tape');

test("handles single word", function (t) {
    t.plan(1);
    var tokens = tokenizer.tokenize('foo');
    t.deepEqual(tokens, ['foo']);
});

test("handles multiple words", function (t){
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

test("handles json", function (t){
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

test("handles string with spaces without breaking it", function (t) {
  t.plan(1);
  var input = "'hello world!'";
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["'hello world!'"]);
});

test("handles json with string value", function(t){
  t.plan(1);
  var input = "{ some: \"json\" }"
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["{", "some:", "\"json\"", "}"]);
});

test("handles array declarations", function(t) {
  t.plan(1);
  var input = "[1, 2, 3]"
  var tokens = tokenizer.tokenize(input);
  t.deepEqual(tokens, ["[1,", "2,", "3]"]);
});
