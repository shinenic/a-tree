const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const port = process.env.PORT || 5566

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: port,
    historyApiFallback: {
      index: 'index.html',
    },
    open: true,
    hot: true,
    proxy: {
      '/api/v3': {
        target: 'http://localhost:5567',
        pathRewrite: { '^/api/v3': '' },
      },
    },
  },
  entry: {
    main: path.resolve(__dirname, '..', 'src/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
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
    new ReactRefreshWebpackPlugin({ overlay: false }),
    new HtmlWebPackPlugin({
      // template: path.resolve(__dirname, '..', 'public/index.html'),
      template: path.resolve(__dirname, '..', 'public/code-page/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.LOCAL_MODE': JSON.stringify(process.env.LOCAL_MODE),
      'process.env.API_PORT': JSON.stringify(process.env.API_PORT),
    }),
  ],
}
