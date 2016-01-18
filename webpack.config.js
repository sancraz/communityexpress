var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './app/main.js',
	output: {
		path: './app/build/', 
		filename: 'bundle.js'
		// publicPath: '/public/'
	},
	devtool: 'source-map',
	watch: true,
	keepalive: true,
	exclude: ['app/vendor/scripts', 'app/vendor/styles'],
	module: {
		loaders: [
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap'),
				exclude: ['app/vendor/styles', 'node_modules']
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
				exclude: ["app/vendor/styles", "node_modules"]
			},
			{
				test: /vendor\/.+\.(jsx|js)$/,
				loader: 'imports?jQuery=jquery,$=jquery,this=>window',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'_': 'underscore',
			'Backbone': 'backbone'
		}),
	],
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.es6']
	},
}