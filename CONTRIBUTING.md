# Contributing to Dogescript

* First of all, thank you for taking the time to fuel this rocket to the moon.
* Second, prior to contributing, familiarize yourself with the [Code of Conduct](#CODE_OF_CONDUCT.md) and with any resources provided here.
* And thirdly, the code is more what you'd call "guidelines" than actual rules.

> My only request is that everyone is kind and respectful to each other. -remixz

## Table of Contents


* [Community](#community)
* [Alpha Versions](#alpha-versions)
* [Testing](#testing)
* [Building](#building)


## Community

Join us at [dogescript.slack.com](dogescript.slack.com). Since it is slack, you'll need an invite to the channel. Visit [this site to get invited](https://doge-invite.herokuapp.com/). The invite site is built with [slack-invite-automation](https://github.com/outsideris/slack-invite-automation) and is deployed to heroku.
Since we are on the free tier, dyno's take a bit to load so give it at least 30 seconds to load the first time.

## Alpha versions

If you wish to take your dogescript to the moon and live at the edge of amaze, you can install the dogescript version as it exists in this repository:

1. `npm install` the repository
1. link the newer version with `npm link`
1. Verify by running `dogescript`, something like the following should show up (version # might be different but the pre syntax will still be there):
```bash
$ dogescript
[dogescript@2.4.0-pre]
DOGE>
```
1. To restore, navigate out of the dogescript repository and reinstall an earlier version:
`npm install dogescript@2.3.0 -g`


## Testing

We utilize [Jest](https://jestjs.io/) under the hood for testing. If your PR is bringing any new functionality to dogescript, it must be tested and included under the `npm test` task.

To start the testing suite run:

```bash
$ npm install # If you haven't already

$ npm test
```

Similarly, you may run any of [Jest's CLI options](https://jestjs.io/docs/en/cli#reference) as well. For example if you wanted to have the tests to live-reload on code change, you could do so by adding `--watch` like so:

````bash
$ npm test -- --watch
````


### Creating Compiler Tests
Compiler tests are automatically generated and run with `jest`. in order for a compiler test to be created you must

1. Create the appropriate folder(s) [within the language-spec directory](./test/language-spec)
2. Create a `source.djs` with the dogescript to test.
3. Create a `expect.js` with the expected output.

After that the test runner should pick them up & display coverage.

> ⚠️ To keep the tests sane please try to use foo/bar/baz/buzz as custom identifiers and strings (as they are not doge-like and easier to visually grep).


## Building

We currently utilize [Webpack](https://webpack.js.org/) for building dogescript. If you'd like to build your own version of dogescript you can run:

```bash
# in the parent directory:
npm install
# and then:
npm run build # builds dogescript
```