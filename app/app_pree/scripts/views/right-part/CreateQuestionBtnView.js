'use strict';

var template = require('ejs!./createQuestionBtn.ejs');

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
    }

});

module.exports = CreateQuestionBtnView;
