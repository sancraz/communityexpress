var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/app_sitelettes/sitelette.js'
};

module.exports = config;