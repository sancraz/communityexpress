'use strict';

var template = require('ejs!../templates/preeQuestion.html');

var QuestionItem = Marionette.ItemView.extend({

	template: template,

	tagName: 'li',

	initialize: function() {
		console.log(this.model.attributes);
	}
});

module.exports = QuestionItem;
