# Test notes

Run the test via `npm test`

The test run using [tape](https://www.npmjs.org/package/tape) so you can also use a custom TAP reporter:

````
node ./test/spec.test.js | tap-unfunk
````

## Creating compiler tests

1. Create the appropriate folder(s)
1. Create a `source.djs` with the dogescript to test.
1. Create a `expect.js` with the expected output.

To keep the tests sane use foo/bar/baz/buzz as custom identifiers and strings (as they are not doge-like).

## Trying to debug your code.
1. Browserify the `exerciser.js` file into `bunde.js` with: `browserify exerciser.js > bundle.js`
2. Load up the exerciser page
3. Write your dogescript code on the left side (note the produced javascript on the right)
4. Find the spot in the bundle.js file where you'd like to debug
5. Set a breakpoint and then press run code()

## Todo

- fix notrly / but notrly
- make separate case for operators used in rly/much/many
