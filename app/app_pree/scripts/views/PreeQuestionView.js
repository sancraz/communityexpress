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
        preeQuestion: '.pree_question',
        preeQuestionCategories: '.pree_question_categories_button',
        preeQuestionTags: '.pree_question_tags_button',
        preeQuestionDetailed: '.pree_question_detailed',
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
        'click @ui.answer': 'checkIfUserCanAnswer',
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



    openAnswerView: function(e) {
        var input = $(e.currentTarget).find('input'),
            choiceId = input.data('id'),
            uuid = input.attr('name');

        //TODO bug with radio input !!!!!!
        input.prop('checked', true);
        input.addClass('checked');
        this.trigger('answerQuestion', choiceId, uuid);
        this.ui.preeQuestion.addClass('active');
        this.trigger('collapseDetails');
        this.ui.answer.css('pointer-events', 'none');
        this.ui.preeQuestionDetailed.collapse('show');
        // loader.show('ANSWER');
    },

    checkIfUserCanAnswer: function(e) {
        var input = $(e.currentTarget).find('input');
        input.prop('checked', false);
        this.trigger('checkIfUserLogged', _.bind(function(logged){
            if (logged) {
                this.openAnswerView(e);
            } else {
                // this.model.set('isAnonymous', true);
                if (this.model.get('isAnonymous')) {
                    this.openAnswerView(e);
                } else {
                    this.onUserShouldLogin();
                }
            }
        }, this));
    },

    onUserShouldLogin: function() {
        loader.showFlashMessage('Please, sign in to answer.');
    },

    onCollapseDetailsInChild: function() {
        this.ui.preeQuestion.removeClass('active');
        this.ui.preeQuestionDetailed.collapse('hide');
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
