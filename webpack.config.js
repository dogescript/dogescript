const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    "dogescript": "./index.js",
    "dogescript.min": "./index.js",
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        // minimize: true,
      }),
    ],
  },

  // Enable if you want sourcemaps on build
  // devtool: "sourcemap",

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