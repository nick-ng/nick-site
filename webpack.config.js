const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

let siteTitle = 'Nick Ng';

if (process.env.NODE_ENV !== 'production') {
  siteTitle = `${siteTitle} - ${process.env.NODE_ENV || 'dev'}`;
}

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3434,
    proxy: [
      {
        context: ['/oll', '/api', '/pokemon_assets', '.json'],
        target: 'http://localhost:3435',
      },
      {
        context: ['/ws'],
        target: 'ws://localhost:3435',
        ws: true,
      },
    ],
  },
  mode: process.env.NODE_ENV || 'production',
  devtool: 'source-map',
  entry: {
    index: './src/entry.jsx',
    todos: './src/components/todos/index.jsx',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: { path: false },
  },
  module: {
    rules: [
      { test: /\.css$/, use: 'style-loader' },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: {
            modules: {
              mode: 'local',
              localIdentName: '[path][name]_[local]-[hash:base64:7]',
            },
          },
        },
      },
      {
        test: /\.m?js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/transform-runtime',
              '@babel/plugin-proposal-optional-chaining',
            ],
          },
        },
      },
      {
        test: /node_modules(\/|\\)vfile(\/|\\)core\.js/,
        use: [
          {
            loader: 'imports-loader',
            options: {
              type: 'commonjs',
              imports: ['single process/browser process'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: siteTitle,
      favicon: `${__dirname}/favicon.ico`,
      template: './index.html',
      inject: true,
    }),
  ],
};
