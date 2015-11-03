'use strict';

var Backbone = require ('backbone'),
	Marionette = require('backbone.marionette'),
	App = require('./main.js'),
	FirstView = require('./views/first_view.js'),
	Controller = require('./controllers/controller.js');

var Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'showProject'
    },

    routes : {}

});

App.API = {
	showProject: function() {
    	var controller = new Controller();
    	controller.renderFirstView();
    }
};

App.vent.on('start:all', function() {
	new Router({
		controller: App.API
	});
	App.API.showProject();
});