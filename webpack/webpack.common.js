const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = (_, { mode }) => {
  const isDev = mode === 'development'

  return {
    entry: {
      content: path.join(__dirname, '..', 'src/index.js'),
      background: path.join(__dirname, '..', 'src/background.js'),
    },
    output: {
      path: path.join(__dirname, '..', isDev ? 'dist' : 'build'),
      filename: '[name].js',
      clean: !isDev,
    },
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
      modules: [path.resolve(__dirname, '..', 'src'), 'node_modules'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'extension', to: '.' }],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devtool: 'cheap-module-source-map',
  }
}
