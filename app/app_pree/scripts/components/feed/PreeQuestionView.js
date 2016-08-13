'use strict';

var template = require('ejs!./templates/preeQuestion.ejs'),
    loader = require('../../loader'),
    moment = require('moment'),
    preeQuestionCategoriesView = require('./PreeQuestionCategories'),
    preeQuestionTagsView = require('./PreeQuestionTags'),
    communicationActions = require('../../actions/communicationActions'),
    jqPlotOptions = require('./jqPlotOptions'),
    answerCountView = require('./AnswerCountView');

var FeedSelectorView = Mn.LayoutView.extend({

    template: template,

    regions: {
        pree_question_expanded_menu: '.pree_question_expanded_menu',
        pree_question_answers: '.pree_question_answers',
        popup_region: '.pree_question_answer_details',
        messages_region: '.messages_region'
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
        answeredMask: '.pree_question_answered_mask',
        infoIcon: '.show_hide_answer_info',
        messageIcon: '.pree_question_comment_button',
        messages: '.pree_question_messages',
        rootCommentField: '.root_comment_field',
        postRootComment: '.root_comment_field a',
        messageBody: '.root_comment_field textarea',
        messageLength: '.message_length'
    },

    events: {
        'click @ui.preeQuestionCategories': 'expandCategories',
        'click @ui.preeQuestionTags': 'expandTags',
        'click @ui.likesButton': 'addLikeDislike',
        'click @ui.answer': 'checkIfUserCanAnswer',
        'click @ui.shareButton': 'openShareQuestionView',
        'click @ui.infoIcon': 'showAnswerInfo',
        'click @ui.messageIcon': 'getMessages',
        'click @ui.postRootComment': 'postRootComment',
        'keyup @ui.messageBody': 'calculateMessageLength'
    },

    initialize : function() {
        this.model.set('user', this.options.user);
        this.model.set('timeAgo', this.moment(this.model.get('activationDate')).fromNow());
        console.log("FeedSelectorView initialized");
        this.model.set('messageLine1', '');
        this.model.set('messageLine2', '');
        this.id = this.model.get('id');
        this.listenTo(this.model, "change", this.modelEventHandler);
        this.isAnswered = this.model.isAnswered;
        this.isLiked = this.model.isLiked;
        this.currentLikes = this.model.get('likes');
        this.currentAnswerChecked=this.model.currentAnswerChecked;
        this.expandedMessages = false;
        //this.isAnswered = this.model.get('currentChoiceByUser') === -1 ? false : true;
        // this.isAnswered = true;
    },

    reinitialize: function(attrs, isCorrect) {
        this.model.set(attrs);
        this.model.set('timeAgo', this.moment(this.model.get('activationDate')).fromNow());
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
        }
        if(this.model.highlighted===true){
            this.ui.preeQuestion.addClass('highlighted');
        }
        if (this.justAnswered===true) {
            this.ui.infoIcon.show();
            setTimeout(_.bind(function() {
                this.showAnswerInfo();
            }, this), 500);
        }
        if(this.isAnswered===true){
          this.showMask();
          this.ui.infoIcon.show();
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

        this.ui.preeQuestionDetailed.on('shown.bs.collapse', _.bind(function() {
            if (this.jqPlotCreated===true) return;

            var options = jqPlotOptions.options,
                colorChoices = jqPlotOptions.colorChoices;

            var array = [], a = [], b = [];
            _.each(this.model.get('choices'), function(choice) {
                a.push(choice.choiceId);
                b.push(choice.entryCountForThisChoice);
            });
            b.reverse();
            for (var i = 0; i < a.length; i++) {
                options.axes.yaxis.ticks[i] = a.length - i;
                array.push([b[i], a[i]]);
                options.seriesColors[i] = colorChoices[i];
            }
            var dataArray = [array];

            // var options = this.model.get('options'),
            //     dataArray = this.model.get('dataArray');
            options.seriesDefaults.renderer = $.jqplot.BarRenderer;
            options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
            options.axes.yaxis.rendererOptions.tickRenderer = $.jqplot.AxisTickRenderer;
            $.jqplot('answerBar' + this.model.get('uuid'), dataArray, options);
            this.jqPlotCreated = true;
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

    addLikeDislike: function() {
        if (this.isAnswered===true || this.justAnswered===true) {
            if (this.isLiked===true) {
                this.trigger('addLikeDislike', {
                    uuid: this.model.get('uuid'),
                    like: false
                });
                this.isLiked = false;
                this.currentLikes = this.currentLikes - 1;
                this.ui.likeCount.text(this.currentLikes);
                this.ui.likesButton.find('div').removeClass('active');
            } else {
                this.trigger('addLikeDislike', {
                    uuid: this.model.get('uuid'),
                    like: true
                });
                this.isLiked = true;
                this.currentLikes = this.currentLikes + 1;
                this.ui.likeCount.text(this.currentLikes);
                this.ui.likesButton.find('div').addClass('active');
            }
        } else {
            var text = 'Please answer the question before liking';
            this.trigger('showNotAnsweredError', text);
        }
    },

    openShareQuestionView: function() {
        this.trigger('sharePopup:show', this.model);
    },

    getMessages: function() {
        if (this.expandedMessages===false) {
            this.trigger('getMessages', this.model.get('uuid'));
        }
        this.trigger('collapseMessages');
        this.onShowRootCommentField();
    },

    onShowMessages: function(view) {
        this.expandedMessages = true;
        this.messages_region.show(view);
        var scrollTop = $('.pree_feed_questions').scrollTop() - $('.pree_feed_questions').offset().top + this.ui.messages.offset().top;
        $('.pree_feed_questions').animate({
            scrollTop: scrollTop
        }, 10);
    },

    onHideMessages: function() {
        this.expandedMessages = false;
        this.messages_region.empty();
    },

    postRootComment: function() {
        var options = {
            messageBody: this.ui.messageBody.val(),
            inReplyToMessageId: 1,
            authorId: this.model.get('user').UID,
            communicationId: this.model.get('uuid'),
            urgent: false
        };
        this.trigger('postComment', options);
    },

    onHideRootCommentField: function() {
        this.ui.rootCommentField.slideUp();
    },

    onShowRootCommentField: function() {
        this.ui.rootCommentField.slideDown();
    },

    calculateMessageLength: function(e) {
        var maxLength = 500;
        var messageLength = this.ui.messageBody.val().length;
        if (messageLength >= maxLength) {
            this.ui.messageBody.val(this.ui.messageBody.val().substring(0, maxLength));
            this.ui.messageLength.html(0);
            this.ui.messageBody.attr('maxlength', maxLength);
            return;
        }
        var counter = maxLength - messageLength;
        this.ui.messageLength.html(counter);

        if(e.keyCode == 8) {
            this.ui.messageBody.attr('maxlength', '');
        }

        var height = this.ui.messageBody[0].scrollHeight + 2;
        this.ui.messageBody.css({
            overflow: 'hidden',
            height: height + 'px'
        });
    }
});

module.exports = FeedSelectorView;
