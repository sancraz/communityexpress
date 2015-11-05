var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './app/scripts/app.js',
	output: {
		path: './app/build/', 
		filename: 'bundle.js',
		publicPath: '/public/assets'
	},
	devtool: 'source-map',
	watch: true,
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.es6']
	},
	module: {
		loaders: [
			{
				test: /\.(png|jpg|ttf|eot|woff)$/,
				loader: 'url-loader?limit=10000',
				exclude: /node_modules/
			},
			{
				test: /\.js/,
				loader: 'babel',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap'),
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
				exclude: /node_modules/
			},
			// {
			// 	test: /\.scss$/,
			// 	loader: 'style-loader!css-loader!sass-loader?sourceMap!autoprefixer-loader', 
			// 	include: path.join(__dirname, 'app/styles') 
			// },
			// {
			// 	test: /\.css$/,
			// 	loader: 'style-loader!css-loader?sourceMap!autoprefixer-loader', 
			// 	include: path.join(__dirname, 'app/styles')
			// },
			{ 
				test: /\.html$/, 
				loader: 'html-loader',
				include: path.join(__dirname, 'app/scripts')
			},
			{
				test: /\.hbs/,
				loader: 'handlebars-loader',
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
			'_': 'underscore'
		}),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			}
		})
	]
}