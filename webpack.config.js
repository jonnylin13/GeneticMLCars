const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/'
  },
  plugins: [
    new CopyPlugin([
      { from: 'lib/courses', to: 'courses' },
      { from: 'index.html', to: 'index.html' }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    compress: true,
    port: 1234
  }
};
