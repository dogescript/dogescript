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
1. Optionally, create a `scenario.desc` file describing the test, this will be displayed if the test fails.

To keep the tests sane use foo/bar/baz/buzz as custom identifiers and strings (as they are not doge-like).

# Debug package

There are new npm scripts that help with debugging code:
- `exerciser:make`: loads the most recent dogescript copy and allows you to use the exerciser.html page to write dogescript code and see the converted javascript. Additionally, you can run code and debug through the parser bundled in `exerciser-bundle.js`
- `debug': runs both `debug:harness` and `debug:make` in that order.
  - `debug:harness`: loads dogescript from `index.js` into `debug-harness.js`
  - `debug:make`: takes the last argument given to it as a path to a test. Loads the expected, source and the actual value from the test into `debugger-data-loader.js`.
After running `npm run debug <PATH>`, you can open up debugger-page and you should see the `source | expected | actual` output. The `Run Parser` button will work similarly to the exerciser, in case you wish to debug why the code parsed the way it parsed.
  - `debug:clean`: removes both `debugger-harness.js` and `debugger-data-loader.js`

Assume the `loops/many` test failed after a parser update and you wish to debug why. 

You would run `npm run debug loops/many` which would produce the necessary js files so the `debugger-page` can display the source, expected and actual values.