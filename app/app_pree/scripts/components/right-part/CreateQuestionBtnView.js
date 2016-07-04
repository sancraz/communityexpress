'use strict';

var App = require('../../app'),
	template = require('ejs!./createQuestionBtn.ejs'),
	sessionActions = require('../../actions/sessionActions');

var CreateQuestionBtnView = Mn.ItemView.extend({

    template: template,

    ui: {
    	create: '.createQuestionBtn'
    },

    events: {
    	'click @ui.create' : 'createQuestion'
    },

	initialize: function() {
		this.user = sessionActions.getCurrentUser();
	},

    createQuestion: function() {
		if (this.user.getUID()) {
			this.trigger('createQuestion');
		} else {
			this.trigger('signin');
		}
    }

});

module.exports = CreateQuestionBtnView;
