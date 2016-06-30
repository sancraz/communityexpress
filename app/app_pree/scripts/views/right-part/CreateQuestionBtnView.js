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
    	console.log('create question');
		if (this.user.getUID()) {
	    	App.trigger('createNewQuestion:show');
		} else {
			App.trigger('signinForm:show');
		}
    }

});

module.exports = CreateQuestionBtnView;
