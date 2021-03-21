import Scanner from '../lib/scanner';

function tokenize(input) {
    return new Scanner(input).scan();
}

it("handles single word", function () {
    var tokens = tokenize('foo');
    expect(tokens).toEqual(['foo']);
});

it("handles multiple words", function () {
  var input = "plz foo with a b c";
  var tokens = tokenize(input);
  expect(tokens).toEqual(['plz', 'foo', 'with', 'a', 'b', 'c']);
});

it("handles escaped single quotes", function () {
  // escape the \
  var input = "plz foo with '\\''";
  var tokens = tokenize(input);
  expect(tokens).toEqual(["plz", "foo", "with", "'\\''"]);
});

it("handles json", function () {
  var input = "very x is { foo: bar }";
  var tokens = tokenize(input);
  expect(tokens).toEqual(["very", "x", "is", "{", "foo:", "bar", "}"]);
});

it("handles arrays", function () {
  var input = "very x is [1, 2, 3]";
  var tokens = tokenize(input);
  expect(tokens).toEqual(["very", "x", "is", "[1,", "2,", "3]"]);
});

it("handles string with spaces without breaking it", function ()  {
  var input = "'hello world!'";
  var tokens = tokenize(input);
  expect(tokens).toEqual(["'hello world!'"]);
});

it("handles json with string value", function(){
  var input = "{ some: \"json\" }"
  var tokens = tokenize(input);
  expect(tokens).toEqual(["{", "some:", "\"json\"", "}"]);
});

it("handles array declarations", function() {
  var input = "[1, 2, 3]"
  var tokens = tokenize(input);
  expect(tokens).toEqual(["[1,", "2,", "3]"]);
});

describe("double quote support", function() {
  it("tokenizes double quoted strings", function() {
    // input literal "foo bar blah"
    var input = "\"foo bar blah\""
    var tokens = tokenize(input);
    expect(tokens).toEqual(['"foo bar blah"'])
  });
  it("handles escaped quotes", function() {
    // escape the \
    var input = '"foo \\"bar\\" blah"'
    var tokens = tokenize(input);
    expect(tokens).toEqual(['"foo \\"bar\\" blah"']);
  });
});