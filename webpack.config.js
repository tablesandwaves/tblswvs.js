const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node-modules/, },
      { test: /\.js$/, loader: 'source-map-loader', },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'tblswvs.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'tblswvs',
      type: 'umd'
    },
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production',
};
