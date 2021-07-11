const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const config = {
  entry: {
    content: path.join(__dirname, 'src/index.js'),
  },
  output: { path: path.join(__dirname, 'build'), filename: '[name].js' },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
  ],
  devtool: 'cheap-module-source-map',
}

module.exports = config
