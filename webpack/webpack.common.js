const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const PACKAGE = require('../package.json')

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
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'],
            },
          },
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
        patterns: [
          { from: './public/icon192.png', to: '.' },
          { from: './manifest.json', to: '.' },
        ],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new LodashModuleReplacementPlugin(),
      ...(process.env.ANALYZER ? [new BundleAnalyzerPlugin()] : []),
      ...(!isDev
        ? [
            new ZipPlugin({
              path: path.resolve(__dirname, '..'),
              filename: PACKAGE.name + ' - ' + PACKAGE.version + '.zip',
            }),
          ]
        : []),
    ],
    devtool: 'cheap-module-source-map',
  }
}
