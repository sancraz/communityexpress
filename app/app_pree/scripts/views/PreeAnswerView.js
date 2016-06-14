'use strict';

var template = require('ejs!../templates/preeAnswer.ejs'),
	loader = require('../loader');

var PreeAnswerView = Mn.LayoutView.extend({

	template: template,

	ui: {
		close: '.pree_question_answer_close'
	},

	events: {
		'click @ui.close': 'closeQuestionAnswer'
	},

	initialize: function() {
		console.log('Answer view initialized');
	},

	onShow: function() {
		loader.hide();
	},

	closeQuestionAnswer: function() {
		this.destroy();
	}
});

module.exports = PreeAnswerView;
