# Test notes

We utilize [Jest](https://jestjs.io/) under the hood for testing. To start the testing suite you can run:

```
$ npm test
```

Similarly, you may run any of [Jest's CLI options](https://jestjs.io/docs/en/cli#reference) as well. For example if you wanted to have the tests to live-reload on code change, you could do so by adding `--watch` like so:

````
$ npm test -- --watch
````


## Creating compiler tests
Transformative tests are automatically generated and run with `jest`. in order for your test to be ran you must

1. Create the appropriate folder(s) in [spec](./spec)
2. Create a `source.djs` with the dogescript to test.
3. Create a `expect.js` with the expected output.

After that the test runner should pick them up & display coverage.

> ⚠️ To keep the tests sane please use foo/bar/baz/buzz as custom identifiers and strings (as they are not doge-like and easier to visually grep).