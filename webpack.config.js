var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var BowerWebpackPlugin = require("bower-webpack-plugin");
// var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');

module.exports = {
	entry: './app/scripts/main.js',
	output: {
		path: './app/build/', 
		filename: 'bundle.js',
		publicPath: '/public/'
	},
	devtool: 'source-map',
	watch: true,
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
			{ 
				test: /\.html$/, 
				loader: 'html-loader',
				include: path.join(__dirname, 'app/scripts')
			},
			{
				test: /\.hbs/,
				loader: 'handlebars-loader',
				exclude: /node_modules/
			},
			{
				test: /vendor\/.+\.(jsx|js)$/,
				loader: 'imports?jQuery=jquery,$=jquery,this=>window',
				exclude: /node_modules/
			},
			{
				test: /\.ejs$/,
				loader: "ejs-loader?variable=data",
				exclude: /node_modules/
			},
		]
	},
	plugins: [
		// new ModernizrWebpackPlugin(),
		// new BowerWebpackPlugin({
		// 	modulesDirectories: ["bower_components"],
		// 	manifestFiles:      "bower.json",
		// 	includes:           /.*/,
		// 	excludes:           [],
		// 	searchResolveModulesDirectories: true
		// }),
		new ExtractTextPlugin('styles.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'_': 'underscore'
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	minimize: true,
		// 	compress: {
		// 		warnings: false
		// 	}
		// })
	],
	resolve: {
		alias: {
			'addToHomescreen': './vendor/add-to-homescreen/src/addtohomescreen',
			'jquerymobile_config': './jquerymobile_config',
			'jquerymobile': './vendor/jquery-mobile/js/jquery.mobile-1.4.0'
		},
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.es6']
	},
}