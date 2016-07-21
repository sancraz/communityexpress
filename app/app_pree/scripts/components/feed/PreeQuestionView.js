'use strict';

var template = require('ejs!./templates/preeQuestion.ejs'),
    loader = require('../../loader'),
    preeQuestionCategoriesView = require('./PreeQuestionCategories'),
    preeQuestionTagsView = require('./PreeQuestionTags'),
    answerCountView = require('./AnswerCountView');

var FeedSelectorView = Mn.LayoutView.extend({

    template: template,

    regions: {
        pree_question_expanded_menu: '.pree_question_expanded_menu',
        pree_question_answers: '.pree_question_answers',
        pree_question_likes_count: '.pree_question_likes_count',
        popup_region: '.pree_question_answer_details'
    },

    tagName: 'li',

    id: function() {
        return this.model.get('id');
    },

    ui: {
        preeQuestion: '.pree_question',
        questionBody: '.questionBody',
        preeQuestionCategories: '.pree_question_categories_button',
        preeQuestionTags: '.pree_question_tags_button',
        preeQuestionDetailed: '.pree_question_detailed',
        closeCategories: '.pree_question_categories_close',
        closeTags: '.pree_question_tags_close',
        answer: '.pree_question_answer',
        likesButton: '.pree_question_likes_button',
        likeCount: '.pree_question_likes_count',
        shareButton: '.pree_question_share_button'
    },

    events: {
        'click @ui.questionBody': 'checkIfAnswered',
        'click @ui.preeQuestionCategories': 'expandCategories',
        'click @ui.preeQuestionTags': 'expandTags',
        'click @ui.likesButton': 'addLike',
        'click @ui.answer': 'checkIfUserCanAnswer',
        'click @ui.shareButton': 'openShareQuestionView'
    },

    initialize : function() {
        console.log("FeedSelectorView initialized");
        this.model.set('message', '');
        this.id = this.model.get('id');
        this.listenTo(this.model, "change", this.modelEventHandler);
        this.isAnswered = this.model.get('currentChoiceForUser') === -1 ? false : true;
        // this.isAnswered = true;
    },

    reinitialize: function(attrs, isCorrect) {
        this.model.set(attrs);
        var pollType = attrs.pollType.enumText,
            message;
        switch (pollType) {
            case 'FACT':
                isCorrect ?
                message = 'CONGRATULATIONS You answered correctly.<br /> You\'ve been awarded ' +(200 + attrs.points) + ' Points!'
                : message = 'Thank you, but you answered incorrectly.<br /> You\'ve been awarded ' + attrs.points + ' Points just for answering!<br /> See the correct answer below. Your new points total is';
                break;
            case 'PREDICTION':
                isCorrect ?
                message = 'CORRECT 250 Points'
                : message = 'INCORRECT 50 Points';
                break;
            case 'OPINION':
                message = 'Thank you! You\'ve been awarded ' + (attrs.points) + ' Points.<br /> Your new points total is';
                break;
            default:
        };
        this.model.set('message', message);
        this.justAnswered = true;
        this.render();
    },

    // onBeforeRender: function() {
    //     this.model.attributes.choices[0].entryCountForThisChoice = 1;
    // },

    onRender: function() {
        this.pree_question_answers.show(new answerCountView({
            answers: this.model.get('totalAnswers')
        }));
        if (this.isAnswered) {
            // this.onIsAnswered();
        };
        if (this.justAnswered) {
            setTimeout(_.bind(function() {
                this.showAnswerInfo();
            }, this), 500);
        };
    },

    onIsAnswered: function() {
        // TODO we dont have answered from server and choice id ???
        var choiceId = this.model.get('currentChoiceForUser'),
            answer = this.ui.answer.find('input[data-id="' + choiceId + '"]');
        answer.prop('checked', true);
        this.ui.answer.css('pointer-events', 'none');
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
            isCorrect = input.data('iscorrect'),
            uuid = input.attr('name');

        //TODO bug with radio input !!!!!!
        input.prop('checked', true);
        input.addClass('checked');
        this.trigger('answerQuestion', choiceId, uuid, isCorrect, this);
        // this.showAnswerInfo();
        // loader.show('ANSWER');
    },

    showAnswerInfo: function() {
        this.ui.preeQuestion.addClass('active');
        this.trigger('collapseDetails');
        this.ui.preeQuestionDetailed.collapse('show');
        this.ui.answer.css('pointer-events', 'none');
    },

    checkIfUserCanAnswer: function(e) {
        // if (this.isAnswered) return;
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

    checkIfAnswered: function() {
        if (this.isAnswered) {
            this.showAnswerInfo();
        }
    },

    onUserShouldLogin: function() {
        loader.showFlashMessage('Please, sign in to answer.');
    },

    onCollapseDetailsInChild: function() {
        this.ui.preeQuestion.removeClass('active');
        this.ui.preeQuestionDetailed.collapse('hide');
    },

    addLike: function(e) {
        e.preventDefault();
        e.stopPropagation();
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

    openShareQuestionView: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger('sharePopup:show', this.model);
    }
});

module.exports = FeedSelectorView;
