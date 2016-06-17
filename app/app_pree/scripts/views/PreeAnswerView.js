'use strict';

var template = require('ejs!../templates/preeAnswer.ejs'),
	loader = require('../loader');

var PreeAnswerView = Mn.LayoutView.extend({

	template: template,

	ui: {
		closeButton: '.pree_question_answer_close'
	},

	events: {
		'click @ui.closeButton': 'close'
	},

	initialize: function() {
		console.log('Answer view initialized');
	},

	onShow: function() {
		loader.hide();
	},

	close: function() {
		this.destroy();
	}
});

module.exports = PreeAnswerView;
