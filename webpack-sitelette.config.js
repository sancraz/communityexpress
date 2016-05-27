var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/app_sitelette/sitelette.js'
};

config.output = {
	path: './app/app_sitelette/build/', 
	filename: '[name].js'
};

module.exports = config;