var WebpackStrip = require('strip-loader'),
	webpack = require('webpack'),
	devConfig = require('./webpack.config.js'),
	stripLoader = {
		test: [/\.js$/, /\.es6$/],
		exclude: /node_modules/,
		loader: WebpackStrip.loader('console.log', 'perfLog')
	};

// To disable watch mode
devConfig.watch = false;

// Simple Webpack loader to strip custom functions from your code
devConfig.module.loaders.push(stripLoader);

// To minimize scripts
devConfig.plugins.push( new webpack.optimize.UglifyJsPlugin({
		include: /\.js$/,
		minimize: true
	})
);

module.exports = devConfig;