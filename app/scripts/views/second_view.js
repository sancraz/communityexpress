'use strict';

var Backbone = require('backbone'),
	Marionette = require('backbone.marionette'),
	template = require('../templates/second_template.html');

var SecondView = Marionette.ItemView.extend({

	template: template,

	events: {
		'click .second_button': 'goToFirstView'
	},

	goToFirstView: function(e) {
		App.vent.trigger('render:first_view');
	},

});

module.exports = SecondView;