'use strict';

var App = require('../app'),
    AppLayoutView = require('../components/AppLayoutView'),
    loader = require('../loader'),
    Vent = require('../Vent'),
    h = require('../globalHelpers'),
    userController = require('./userController'),
    sessionActions = require('../actions/sessionActions'),
    communicationActions = require('../actions/communicationActions'),
    gateway = require('../APIGateway/gateway'),
    CentralLayoutView = require('../components/feed/CentralLayoutView'),
    CreateQuestionView = require('../components/feed/CreateQuestionView'),
    PreeQuestionMessagesView = require('../components/feed/PreeQuestionMessagesView'),
    CreateQuestionModel = require('../models/PreeNewQuestionModel'),
    FeedView = require('../components/feed/FeedView'),
    FiltersView = require('../components/feed/FiltersView'),
    InfoPanelView = require('../components/feed/InfoPanelView'),
    TextMessageView = require('../components/feed/TextMessageView'),
    ShareQuestionView = require('../components/feed/ShareQuestionView'),
    ShareQuestionWithMobile = require('../components/feed/ShareQuestionWithMobile'),
    ShareQuestionWithEmail = require('../components/feed/ShareQuestionWithEmail'),
    FeedModel = require('../models/FeedModel'),
    MessagesModel = require('../models/MessagesModel'),
    MessagesCollection = require('../models/MessagesCollection'),
    MessageModel = require('../models/MessageModel'),
    PreeQuestionModel = require('../models/PreeQuestionModel');

module.exports = {

    showLayout: function() {
        App.regions = new AppLayoutView();
        this.user = sessionActions.getCurrentUser();
        this.UID = this.user && this.user.UID ? this.user.UID : '';
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.showFilters();
        if (this.user.UID !== ''  && typeof this.user.UID !== 'undefined' && !window.community.sharedPree) {
            this.showInfoPanel();
        }
        App.on('createNewQuestion:show', _.bind(this.showCreateNewQuestion, this));
        App.on('refreshFeed', _.bind(this.getQuestions, this));
        App.on('statusChanged', _.bind(this.getQuestions, this));
        App.on('signout', _.bind(this.hideFilters, this));
    },

    showFilters: function() {
        this.filtersView = new FiltersView({});
        this.filtersView.listenTo(this.filtersView, 'getCategories', _.bind(this.getCategories, this));
        this.filtersView.listenTo(this.filtersView, 'getTags', _.bind(this.getTags, this));
        this.filtersView.listenTo(this.filtersView, 'getQuestions', _.bind(this.getQuestions, this));
        this.filtersView.listenTo(this.filtersView, 'getQuestion', _.bind(this.getQuestion, this));
        this.centralLayoutView.showFiltersView(this.filtersView);
    },

    showInfoPanel: function() {
        this.infoPanelView = new InfoPanelView();
        this.infoPanelView.listenTo(this.infoPanelView, 'selectFilter', _.bind(function(filter) {
            this.filtersView.triggerMethod('selectFiltersTab', filter);
        }, this));
        this.infoPanelView.listenTo(this.infoPanelView, 'createQuestion', _.bind(this.showCreateNewQuestion, this));
    },

    hideFilters: function() {
        this.infoPanelView.$el.hide();
    },

    showCreateNewQuestion: function() {
        if (this.createNewQuestion) return;
        var model = new CreateQuestionModel();

        this.createNewQuestion = new CreateQuestionView({
                model: model
            });

        this.createNewQuestion.listenTo(this.createNewQuestion, 'onNewQuestin:discarded', _.bind(function(){
            this.createNewQuestion = null;
        }, this));
        this.createNewQuestion.listenTo(this.createNewQuestion, 'onNewQuestin:post', _.bind(this.postNewQuestion, this));
        this.createNewQuestion.listenTo(this.createNewQuestion, 'getCategories', _.bind(this.getCategories, this));
        this.createNewQuestion.listenTo(this.createNewQuestion, 'getTags', _.bind(this.getTags, this));
        this.centralLayoutView.showNewQuestionView(this.createNewQuestion);
        this.createNewQuestion.listenTo(Vent, 'logout_success', _.bind(this.createNewQuestion.onDiscardQuestion, this.createNewQuestion));
    },

    showShareQuestion: function(questionModel) {
        var shareQuestionView = new ShareQuestionView({
            model: questionModel
        });
        shareQuestionView.listenTo(shareQuestionView, 'shareQuestion', _.bind(this.showShareQuestionEmailSMS, this));
        App.regions.getRegion('popupRegion').show(shareQuestionView);
    },

    showShareQuestionEmailSMS: function(options) {
        var view;
        switch (options.param) {
            case 'sendSMS':
                view = new ShareQuestionWithMobile(options);
                break;
            case 'sendEmail':
                view = new ShareQuestionWithEmail(options);
                break;
            default:
        };
        view.listenTo(view, 'sendEmail', _.bind(this.sendEmail, this));
        view.listenTo(view, 'sendMobile', _.bind(this.sendMobile, this));
        App.regions.getRegion('popupRegion').show(view);
    },

    sendEmail: function(uuid, email, shareUrl, view) {
        loader.show('email', 'sending');
        gateway.sendRequest('sendPromoURLToEmail', {
            UID: this.user.getUID(),
            contestUUID: uuid,
            toEmail: email,
            shareUrl: shareUrl
        }).then(_.bind(function(resp) {
            var text = 'Question Shared with : ' + email;
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                this.showTextMessageView(text);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to share question with ' + email);
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                this.showTextMessageView(text);
            }, this));
        }, this));
    },

    sendMobile: function(uuid, phone, shareUrl, view) {
        loader.show('to mobile', 'sending');
        gateway.sendRequest('sendPromoURLToMobileviaSMS', {
            UID: this.user.getUID(),
            contestUUID: uuid,
            toTelephoneNumber: phone,
            shareUrl: shareUrl
        }).then(_.bind(function() {
            var text = 'Question Shared with ' + phone;
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                this.showTextMessageView(text);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to share question with ' + phone);
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                this.showTextMessageView(text);
            }, this));
        }, this));
    },

    hideCreateNewQuestion: function() {
        if (this.createNewQuestion) {
            this.createNewQuestion.triggerMethod('discardQuestion');
        }
    },

    postNewQuestion: function(model, callback) {
        console.log(model.toJSON());

        gateway.sendRequest('createQuestion', {
            UID: this.user.getUID(),
            payload: model.toJSON()
        }).then(_.bind(function(resp) {
            var callback = _.bind(this.getQuestions, this),
                text = 'Successfully created a question';
            this.showTextMessageView(text, callback);
        }, this), function(e) {
            callback();
        });
    },

    getCategories: function(callback, silent) {
        if (!silent) {
            this.hideCreateNewQuestion();
        }
        gateway.sendRequest('getPreeCategories', {
            UID: this.UID
        }).then(_.bind(function(resp) {
            callback(resp);
        }, this), function(e) {

        });
    },

    getTags: function(callback, silent) {
        if (!silent) {
            this.hideCreateNewQuestion();
        }
        gateway.sendRequest('getPreeTags', {
            UID: this.UID
        }).then(_.bind(function(resp) {
            callback(resp);
        }, this), function(e) {

        });
    },

    getQuestions: function(params) {
        loader.hide();
        this.params = params || {};
        this.hideCreateNewQuestion();
        loader.show('questions');
        this.params['UID'] = this.user.UID;
        // this.params['throw'] = true;
        gateway.sendRequest('getPreeQuestions', this.params)
        .then(_.bind(function(resp) {
            var model = new FeedModel(resp);
            this.showQuestions(model);
        }, this), _.bind(function(e) {
          loader.hide();
          var text = h().getErrorMessage(e, 'unable to load questions');
          this.showTextMessageView(text);
      }, this));
    },

    getQuestion: function(params) {
        loader.hide();
        this.params = params || {};
        loader.show('shared question');
        this.params['UID'] = sessionActions.getCurrentUser().getUID();
        // this.params['throw'] = true;
        gateway.sendRequest('getPreeQuestionByUUID', this.params)
        .then(_.bind(function(resp) {
            loader.hide();
            var model = new FeedModel();
            model.questionCollection.add(resp);
            this.showQuestions(model);
        }, this), _.bind(function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'unable to load question'),
                callback = function() {
                    window.location = window.location.pathname;
                };
            this.showTextMessageView(text, callback);
        }, this));
    },

    showQuestions: function(model) {
        //!!! hardcoded isAnonymous
        model.questionCollection.each(function(model) {
            model.set('isAnonymous', !!Math.floor(Math.random()*2));
        });
        model.set('params', this.params);

        var feedView = new FeedView({
            el: $('.pree_feed_questions'),
            collection: model.questionCollection,
            model: model,
            user: this.user
        });
        this.feedView = feedView;
        feedView.listenTo(feedView, 'answerQuestion', _.bind(this.onAnswerQuestion, this));
        feedView.listenTo(feedView, 'checkIfUserLogged', _.bind(this.onCheckIfUserLogged, this));
        feedView.listenTo(feedView, 'sharePopup:show', _.bind(this.showShareQuestion, this));
        feedView.listenTo(feedView, 'getPreviousQuestions', _.bind(this.getPreviousQuestions, this));
        feedView.listenTo(feedView, 'addLikeDislike', _.bind(this.addLikeDislike, this));
        feedView.listenTo(feedView, 'showTextMessage', _.bind(this.showTextMessageView, this));
        feedView.listenTo(feedView, 'getMessages', _.bind(this.getMessages, this));
        feedView.listenTo(feedView, 'postComment', _.bind(this.postComment, this));
        feedView.listenTo(feedView, 'refreshPanels', _.bind(this.refreshPanels, this));
        feedView.listenTo(feedView, 'showPreviousMessages', _.bind(this.showPreviousMessages, this));
        this.centralLayoutView.showQuestionsView(this.feedView);
    },

    refreshPanels: function() {
        $('.pree_share_first_tile').css({
            'font-size': '20px',
            'color': '#ff0000',
            'text-align': 'center'
        }).text('Thank you for answering.')
    },

    getMessages: function(questionView) {
        loader.hide();
        var uuid = questionView.model.get('uuid');
        loader.show('question comments');

        communicationActions.getMessages(uuid)
        .then(_.bind(function(resp) {
            loader.hide();
            if (resp.comments.length===0) return;
            var model = new MessagesModel(resp);
            if (resp.hasPrevious===true) {
                this.showPreviousButton(questionView, resp);
            }
            this.showMessages(model, questionView);
        }, this), _.bind(function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'unable to load comments');
            this.showTextMessageView(text);
        }, this));
    },

    showMessages: function(model, questionView) {
        this.preeQuestionMessagesView = new PreeQuestionMessagesView({
            model: model,
            collection: model.messagesCollection,
            user: this.user,
            parent: questionView
        });
        questionView.triggerMethod('showMessages', this.preeQuestionMessagesView);

        this.preeQuestionMessagesView.listenTo(this.preeQuestionMessagesView, 'hideRootCommentField', _.bind(function() {
            questionView.triggerMethod('hideRootCommentField');
        }, this));
        this.preeQuestionMessagesView.listenTo(this.preeQuestionMessagesView, 'showRootCommentField', _.bind(function() {
            questionView.triggerMethod('showRootCommentField');
        }, this));
        this.preeQuestionMessagesView.listenTo(this.preeQuestionMessagesView, 'postComment', _.bind(this.postComment, this));
        this.preeQuestionMessagesView.listenTo(this.preeQuestionMessagesView, 'deleteComment', _.bind(this.deleteComment, this));
    },

    showPreviousButton: function(questionView, resp) {
        var options = {
            'nextId': resp.firstIdInWindow,
            'previousId': resp.lastIdInWindow
        };
        questionView.triggerMethod('showPreviousButton', options);
    },

    showPreviousMessages: function(options) {
        communicationActions.getPreviousMessages(options).then(_.bind(function(resp) {
            this.preeQuestionMessagesView.model.set({
                'previousId': resp.lastIdInWindow,
                'nextId': resp.firstIdInWindow
            });
            _.each(resp.comments, _.bind(function(comment) {
                var model = new MessageModel(comment);
                this.preeQuestionMessagesView.collection.add(model);
            },this));
            loader.hide();
        }, this), _.bind(function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'unable to load comments');
            this.showTextMessageView(text);
        }, this));
    },

    postComment: function(questionView, options) {
        communicationActions.postComment(options)
        .then(_.bind(function(resp) {
            questionView.onShowRootCommentField();
            var textarea = questionView.$el.find('.root_textarea');
            textarea.val('').css('height', 0).css('height', textarea[0].scrollHeight + 2 + 'px');
            this.getMessages(questionView, resp);
        }, this), _.bind(function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'unable to post comment');
            this.showTextMessageView(text);
        }, this));
    },

    deleteComment: function(questionView, options) {
        communicationActions.deleteComment(options)
        .then(_.bind(function(resp) {
            debugger;
            questionView.onShowRootCommentField();
            this.getMessages(questionView, resp);
        }, this), _.bind(function(e) {
            loader.hide();
            var text = h().getErrorMessage(e, 'unable to delete comment');
            this.showTextMessageView(text);
        }, this));
    },

    addLikeDislike: function(options, view) {
        gateway.sendRequest('likeDislikePoll', {
            UID: this.user.UID,
            like: options.like,
            contestUUID: options.uuid
        }).then(function(resp) {
            view.model.set({
                'likes': resp.likes,
                'likeStatus': resp.likeStatus
            });
            view.isLiked = view.model.get('likeStatus').enumText==='LIKE';
        });
    },

    getPreviousQuestions: function(params) {
        loader.show('');
        gateway.sendRequest('getPreeQuestions', params).then(_.bind(function(resp) {
            this.feedView.model.set({
                'previousId': resp.previousId,
                'nextId': resp.nextId
            });
            _.each(resp.questions, _.bind(function(question) {
                var model = new PreeQuestionModel(question);
                this.feedView.collection.add(model);
            },this));
            this.feedView.bindScroll();
            loader.hide();
        }, this));
    },

    onCheckIfUserLogged: function(callback) {
        var logged = this.UID ? true : false;
        callback(logged);
    },

    onAnswerQuestion: function(choiceId, uuid, isCorrect, view) {
        console.log(choiceId, uuid);
        gateway.sendRequest('answerQuestion', {
            UID: window.community.sharedPree===true ? '' : this.UID,
            uuid: uuid,
            choice: choiceId
        }).then(_.bind(function(resp) {
            view.reinitialize(resp, isCorrect);
        }, this), _.bind(function(jqXHR) {
            view.$el.find('input').prop('checked', false);
            var text = h().getErrorMessage(jqXHR, 'You can\'t answer this question'),
                callback = function() {
                    console.log('callback');
                };
            this.showTextMessageView(text, callback);
        }, this));
    },

    showTextMessageView: function(text, callback) {
        var textMessageView = new TextMessageView({
            text: text,
            callback: callback
        });
        App.regions.getRegion('popupRegion').show(textMessageView);
    }
};
