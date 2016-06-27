'use strict';

var gateway = require('../APIGateway/gateway'),
	template = require('ejs!../templates/createQuestion.ejs'),
	TagsView = require('./autocomplete/TagsView');

var CreateQuestionView = Mn.LayoutView.extend({

	template: template,

	regions: {
	},

	ui: {
		container: '.create-question-container',
		discard: '.discard-btn'
	},

	events: {
		'click @ui.discard': 'discardQuestion'
	},

	serializeData: function() {
		return {};
	},

	onShow: function() {
		this.ui.container.collapse('show');
	},

	discardQuestion: function() {
		this.ui.container.collapse('hide');
	}
});

module.exports = CreateQuestionView;