var path = require('path')
var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  // entry: './entry.js',
  entry: './src/index.tsx',
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.js|jsx$/, loaders: ['babel'] },
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ],
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
}
