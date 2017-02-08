const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:6]',
        },
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nick Ng',
      favicon: `${__dirname}/favicon.ico`,
      template: './index.html',
      inject: 'true',
    }),
  ],
};
