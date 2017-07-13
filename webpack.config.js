const path = require('path');
const webpack = require('webpack');
const ROOT_PATH = path.resolve(__dirname); //, '..');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        "lunatech": [
            './src/js/main'
        ]
    },
    output: {
        path: ROOT_PATH + '/static/js',
        filename: 'bundle.[name].js',
        publicPath: '/static/js/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { 
                test: /\.js$/, 
                loaders: ['babel-loader', 'eslint-loader'], 
                exclude: [/node_modules/, /ide_support/, /yfiles/]
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
                include: path.resolve(ROOT_PATH, 'app/')
            },
            {
                test: /\.html/, loader: 'raw'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?name=img/[name]&hash=sha512&digest=hex'
                ]
            },
            {
                test: /\.json/, loader: 'json'
            },
            {
                test: /\.woff/, loader: 'file-loader'
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: []
};