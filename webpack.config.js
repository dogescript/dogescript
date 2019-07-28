const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    "dogescript": "./index.js",
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dogescript.js',
    library: 'dogescript',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },

  // Enable if you want sourcemaps on build
  // devtool: "sourcemap",

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /.js$/,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};