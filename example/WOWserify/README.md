# WOWserify

A sample page displaying dogescript on one text area, and javascript in another.

1. To generate the page, use Browserify on `index.js` and port it over to `bundle.js` with 'browserify index.js > bundle.js`

# To run code
1. Use the console, there should be a `rundoge` function available which takes dogescript code and uses `window.eval` to execute it
2. As a sample, you can use this: `rundoge(document.getElementsByClassName('dogescript')[0].value)` in the chrome console and it will try to execute the code on the left pane
