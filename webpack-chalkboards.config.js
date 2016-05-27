var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/app_chalkboards/chalkboards.js'
};

config.output = {
	path: './app/app_chalkboards/build/', 
	filename: '[name].js'
}

module.exports = config;