var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/chalkboards.js'
};

module.exports = config;