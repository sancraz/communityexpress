var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/app_sitelette/sitelette.js'
};

module.exports = config;