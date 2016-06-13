'use strict';

var template = require('ejs!../templates/preeQuestion.html'),
    preeQuestionCategoriesView = require('./PreeQuestionCategories'),
    preeQuestionTagsView = require('./PreeQuestionTags'),
    answerCountView = require('./AnswerCountView');

var FeedSelectorView = Mn.LayoutView.extend({

    template: template,

    regions: {
        pree_question_expanded_menu: '.pree_question_expanded_menu',
        pree_question_answers: '.pree_question_answers',
        pree_question_likes_count: '.pree_question_likes_count'
    },

    tagName: 'li',

    ui: {
        preeQuestionCategories: '.pree_question_categories_button',
        preeQuestionTags: '.pree_question_tags_button',
        closeCategories: '.pree_question_categories_close',
        closeTags: '.pree_question_tags_close'
    },

    events: {
        'click @ui.preeQuestionCategories': 'expandCategories',
        'click @ui.preeQuestionTags': 'expandTags'
    },

    // initialize : function() {
    //     console.log("FeedSelectorView initialized");
    // },

    onRender: function() {
        this.pree_question_answers.show(new answerCountView({
            answers: this.model.get('totalAnswers')
        }));
    },

    expandCategories: function() {
        this.pree_question_expanded_menu.show(new preeQuestionCategoriesView({
            categories: this.model.get('categories')
        }));
    },

    expandTags: function() {
        this.pree_question_expanded_menu.show(new preeQuestionTagsView({
            tags: this.model.get('tags')
        }));
    }

    // render: function() {
    //     this.$el.html(this.template(_.extend({}, this.model.attributes)));
    //     return this;
    // }
});

module.exports = FeedSelectorView;