'use strict';

var Backbone = require('backbone'),
	Marionette = require('backbone.marionette'),
	template = require('../templates/first_template.html');

var FirstView = Marionette.ItemView.extend({

	template: template,

	events: {
		'click .my_button': 'goToSecondView'
	},

	goToSecondView: function(e) {
		App.vent.trigger('render:second_view');
	},

});

module.exports = FirstView;