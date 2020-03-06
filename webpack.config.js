const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Nick Ng',
        favicon: `${__dirname}/favicon.ico`,
        template: './index.html',
        inject: 'true',
    }),
];
if (process.env.NODE_ENV === 'production') {
    console.log('Production build!'); // eslint-disable-line no-console
    plugins.push(new webpack.optimize.UglifyJsPlugin());
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        })
    );
}

module.exports = {
    devtool: 'source-map',
    entry: './src/entry.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
        publicPath: '/',
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
                options: {
                    modules: {
                        mode: 'local',
                        localIdentName: '[path][name]__[local]--[hash:base64:5]',
                    },
                },
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },
    plugins,
};
