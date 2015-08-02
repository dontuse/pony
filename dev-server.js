var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var webpack = require('webpack');
var devServer = new WebpackDevServer(
    webpack(config),
    {
        contentBase: __dirname,
        publicPath: '/dist/'
    }
).listen(8090, 'localhost');