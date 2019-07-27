# Test notes

Run the test via `npm test`

We utilize [jest](https://jestjs.io/) for testing. you can set the tests to live-reload on changes by adding `--watch`:

````
$ npm test -- --watch
````

Similarly, you may run any of [jest's CLI options](https://jestjs.io/docs/en/cli#reference) in this manner.

## Creating compiler tests
Transformative tests are automatically generated and run with `jest`. in order for your test to be ran you must

1. Create the appropriate folder(s) in [spec](./spec)
2. Create a `source.djs` with the dogescript to test.
3. Create a `expect.js` with the expected output.

After that the test runner should pick them up & display coverage.

To keep the tests sane please use foo/bar/baz/buzz as custom identifiers and strings (as they are not doge-like and easier to visually grep).