'use strict';

var template = require('ejs!../templates/preeQuestionCategories.ejs');

var PreeQuestionCategories = Mn.ItemView.extend({

	template: template,

	className: 'pree_question_categories',

	ui: {
		closeCategories: '.pree_question_categories_close'
	},

	events: {
		'click @ui.closeCategories': 'closeCategories'
	},

	serializeData: function() {
		return {
			categories: this.options.categories
		};
	},

	closeCategories: function() {
		this.destroy();
	}
});

module.exports = PreeQuestionCategories;
