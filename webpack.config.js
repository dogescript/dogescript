const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    "dogescript": "./index.js",
    "dogescript.bin": "./bin/dogescript.bin.js"
  },

  mode: "production",

  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'dogescript',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this',

  },

  target: "node",

  // Enable if you want sourcemaps on build
  // devtool: "sourcemap",

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /.js$/,
      }),
    ],
  },

  plugins: [
    // Adds shebang to the binary
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      include: /^dogescript.bin.js/
    })
  ],

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