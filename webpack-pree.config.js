'use strict';

var config = require('./webpack.config.js'),
    handlebars = { test: /\.hbs$/, loader: "handlebars-loader" };

config.entry = {
    'bundle':'./app/app_pree/main.js'
};

config.output = {
    path: './app/app_pree/build/', 
    filename: '[name].js'
};

config.module.loaders.push(handlebars);

module.exports = config;
