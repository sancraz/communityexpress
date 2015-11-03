'use strict';

var Backbone = require ('backbone'),
	Marionette = require('backbone.marionette');

var App = window.App = new Marionette.Application();

App.on('before:start', function() {
	var RootView = Marionette.LayoutView.extend({
		el: 'body',

		regions: {
			main: '#landing'
		}
	});

	App.regions = new RootView();
});

App.on('start', function() {
	Backbone.history.start();
	App.vent.trigger('start:all');
});

module.exports = App;
require('./router.js');