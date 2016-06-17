'use strict';

var template = require('ejs!../templates/preeQuestionCreate.ejs');

var PreeQuestionCreateView = Mn.ItemView.extend({

	template: template,

	initialize: function() {
		console.log('Create question start...');
	},

	ui: {
		closeButton: '.pree_question_edit_close'
	},

	events: {
		'click @ui.closeButton': 'close'
	},

	close: function() {
		this.destroy();
	}

});

module.exports = PreeQuestionCreateView;
