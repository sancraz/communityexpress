'use strict';

var template = require('ejs!./templates/preeQuestionTags.ejs');

var PreeQuestionTags = Mn.ItemView.extend({

	template: template,

	className: 'pree_question_tags',

	ui: {
		closeTags: '.pree_question_tags_close'
	},

	events: {
		'click @ui.closeTags': 'closeTags'
	},

	serializeData: function() {
		return {
			tags: this.options.tags
		};
	},

	closeTags: function() {
		this.destroy();
	}
});

module.exports = PreeQuestionTags;
