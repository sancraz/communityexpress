var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/app_chalkboards/chalkboards.js'
};

module.exports = config;