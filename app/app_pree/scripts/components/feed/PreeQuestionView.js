'use strict';

var template = require('ejs!./templates/preeQuestion.ejs'),
    loader = require('../../loader'),
    moment = require('moment'),
    preeQuestionCategoriesView = require('./PreeQuestionCategories'),
    preeQuestionTagsView = require('./PreeQuestionTags'),
    answerCountView = require('./AnswerCountView');

var FeedSelectorView = Mn.LayoutView.extend({

    template: template,

    regions: {
        pree_question_expanded_menu: '.pree_question_expanded_menu',
        pree_question_answers: '.pree_question_answers',
        popup_region: '.pree_question_answer_details'
    },

    tagName: 'li',

    id: function() {
        return this.model.get('id');
    },

    moment: moment,

    ui: {
        preeQuestion: '.pree_question',
        questionBody: '.questionBody',
        preeQuestionCategories: '.pree_question_categories_button',
        preeQuestionTags: '.pree_question_tags_button',
        preeQuestionDetailed: '.pree_question_detailed',
        closeCategories: '.pree_question_categories_close',
        closeTags: '.pree_question_tags_close',
        answer: '.pree_question_answer',
        answerInput: '.pree_question_answer input',
        likesButton: '.pree_question_likes_button',
        likeCount: '.pree_question_likes_count',
        shareButton: '.pree_question_share_button',
        answerBar: '#answerBar',
        answeredMask: '.pree_question_answered_mask'
    },

    events: {
        'click @ui.questionBody': 'checkIfAnswered',
        'click @ui.preeQuestionCategories': 'expandCategories',
        'click @ui.preeQuestionTags': 'expandTags',
        'click @ui.likesButton': 'addLikeDislike',
        'click @ui.answer': 'checkIfUserCanAnswer',
        'click @ui.shareButton': 'openShareQuestionView'
    },

    initialize : function() {
        this.model.set('activationDate', this.moment(this.model.get('activationDate')).format('MM/DD/YYYY'));
        console.log("FeedSelectorView initialized");
        this.model.set('messageLine1', '');
        this.model.set('messageLine2', '');
        this.id = this.model.get('id');
        this.listenTo(this.model, "change", this.modelEventHandler);
        this.isAnswered = this.model.isAnswered;
        this.isLiked = this.model.isLiked;
        this.currentAnswerChecked=this.model.currentAnswerChecked;
        //this.isAnswered = this.model.get('currentChoiceByUser') === -1 ? false : true;
        // this.isAnswered = true;
    },

    reinitialize: function(attrs, isCorrect) {
        this.model.set(attrs);
        this.model.set('activationDate', this.moment(this.model.get('activationDate')).format('MM/DD/YYYY'));
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

        if (this.model.get('activatedByUUID') === true) {
            this.ui.preeQuestion.addClass('activated_by_uuid');
        };
        if(this.model.highlighted===true){
            this.ui.preeQuestion.addClass('highlighted');
        }
        if (this.justAnswered===true) {
            setTimeout(_.bind(function() {
                this.showAnswerInfo();
            }, this), 500);
        };
        if(this.isAnswered===true){
          this.showMask();
        }
        if (this.isLiked===true) {
            this.ui.likesButton.find('div').addClass('active');
        }
    },

    showMask:function(){
      //$(this.el).find('.pree_question_answered_mask').show();
      this.ui.answeredMask.show();
      this.ui.answeredMask.click(function(e){
        /*absorb all clicks */
        e.preventDefault();
        e.stopPropagation();

        return false;
      });
    },
    onIsAnswered: function() {
        // TODO we dont have answered from server and choice id ???
        var choiceId = this.model.get('currentChoiceByUser'),
            answer = this.ui.answer.find('input[data-id="' + choiceId + '"]');
        answer.prop('checked', true);
        this.ui.answer.css('pointer-events', 'none');
        this.showMask();
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
            isCorrect = (input.attr('cmtyx-answer-iscorrect') == 'true'),
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

        // Adding jqPlot progress bars - IN PROGRESS
        this.ui.preeQuestionDetailed.on('shown.bs.collapse', _.bind(function() {
            var options = this.model.get('options'),
                dataArray = this.model.get('dataArray');
            if (!options) return;
            options.seriesDefaults.renderer = eval(options.seriesDefaults.renderer);
            options.axes.yaxis.renderer = eval(options.axes.yaxis.renderer);
            options.axes.yaxis.rendererOptions.tickRenderer = eval(options.axes.yaxis.rendererOptions.tickRenderer);
            $.jqplot('answerBar' + this.model.get('uuid'), dataArray, options);
        }, this));
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
        /* AF : adding fix, but I don't think I understand the
           actual problem. So, this is probably not going to work */
        $(this.ui.preeQuestion).removeClass('active');
        $(this.ui.preeQuestionDetailed).collapse('hide');
    },

    addLikeDislike: function(e) {
        this.trigger('addLikeDislike', this.model.get('uuid'));
        var currentLikes = this.model.get('likes');
        if (this.isLiked===false) {
            this.model.set({
                likes: currentLikes + 1,
                alreadyLiked: true
            });
            this.ui.likesButton.find('div').addClass('active');
        } else {
            // this.model.set({
            //     likes: currentLikes - 1,
            //     alreadyLiked: false
            // });
        };
    },

    openShareQuestionView: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger('sharePopup:show', this.model);
    }
});

module.exports = FeedSelectorView;
