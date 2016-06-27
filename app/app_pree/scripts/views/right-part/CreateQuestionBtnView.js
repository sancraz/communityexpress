'use strict';

var App = require('../../app'),
	template = require('ejs!./createQuestionBtn.ejs');

var CreateQuestionBtnView = Mn.ItemView.extend({

    template: template,

    ui: {
    	create: '.createQuestionBtn'
    },

    events: {
    	'click @ui.create' : 'createQuestion'
    },

    createQuestion: function() {
    	console.log('create question');
    	App.trigger('createNewQuestion:show');
    }

});

module.exports = CreateQuestionBtnView;
