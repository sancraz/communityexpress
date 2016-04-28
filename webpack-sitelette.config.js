var config = require('./webpack.config.js');

config.entry = {
	'bundle':'./app/sitelette.js'
};

module.exports = config;