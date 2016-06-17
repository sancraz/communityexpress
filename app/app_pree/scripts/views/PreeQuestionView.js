'use strict';

var template = require('ejs!../templates/preeQuestion.ejs'),
    loader = require('../loader'),
    preeQuestionCategoriesView = require('./PreeQuestionCategories'),
    preeQuestionTagsView = require('./PreeQuestionTags'),
    answerCountView = require('./AnswerCountView'),
    preeAnswerView = require('./PreeAnswerView'),
    preeQuestionCreateView = require('./PreeQuestionCreateView');

var FeedSelectorView = Mn.LayoutView.extend({

    template: template,

    regions: {
        pree_question_expanded_menu: '.pree_question_expanded_menu',
        pree_question_answers: '.pree_question_answers',
        pree_question_likes_count: '.pree_question_likes_count',
        popup_region: '.pree_question_answer_details'
    },

    tagName: 'li',

    ui: {
        preeQuestionCategories: '.pree_question_categories_button',
        preeQuestionTags: '.pree_question_tags_button',
        closeCategories: '.pree_question_categories_close',
        closeTags: '.pree_question_tags_close',
        answer: '.pree_question_answer',
        likesButton: '.pree_question_likes_button',
        likeCount: '.pree_question_likes_count',
        createNewQuestion: '.pree_question_user_avatar'
    },

    events: {
        'click @ui.preeQuestionCategories': 'expandCategories',
        'click @ui.preeQuestionTags': 'expandTags',
        'click @ui.likesButton': 'addLike',
        'click @ui.answer': 'openAnswerView',
        'click @ui.createNewQuestion': 'openQuestionCreateView'
    },

    initialize : function() {
        console.log("FeedSelectorView initialized");
        this.listenTo(this.model, "change", this.modelEventHandler);
    },

    onRender: function() {
        this.pree_question_answers.show(new answerCountView({
            answers: this.model.get('totalAnswers')
        }));
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.model.changedAttribute();
        this.render();
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
    },

    openAnswerView: function() {
        loader.show('ANSWER');
        var alreadyAnswered = this.model.get('alreadyAnswered');
        if (alreadyAnswered) {
            loader.show('already answered');
        } else {
            this.popup_region.show(new preeAnswerView({
                model: this.model
            }));
        }
    },

    addLike: function() {
        var currentLikes = this.model.get('likes');
        if (!this.model.get('alreadyLiked')) {
            this.model.set({
                likes: currentLikes + 1,
                alreadyLiked: true
            });
        } else {
            this.model.set({
                likes: currentLikes - 1,
                alreadyLiked: false
            });
        };
    },

    openQuestionCreateView: function() {
        console.log('create question');
        this.popup_region.show(new preeQuestionCreateView());
    }
});

module.exports = FeedSelectorView;
