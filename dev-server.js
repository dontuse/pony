var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var compiler = webpack(config);
var devServer = new WebpackDevServer(
    compiler,
    {
        contentBase: __dirname,
        publicPath: '/'
    }
).listen(8088, 'localhost');