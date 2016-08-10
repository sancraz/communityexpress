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
    TextMessageView = require('../components/feed/TextMessageView'),
    ShareQuestionView = require('../components/feed/ShareQuestionView'),
    ShareQuestionWithMobile = require('../components/feed/ShareQuestionWithMobile'),
    ShareQuestionWithEmail = require('../components/feed/ShareQuestionWithEmail'),
    FeedModel = require('../models/FeedModel'),
    MessagesCollection = require('../models/MessagesCollection'),
    MessageModel = require('../models/MessageModel'),
    PreeQuestionModel = require('../models/PreeQuestionModel');

module.exports = {

    showLayout: function() {
        App.regions = new AppLayoutView();
        this.user = sessionActions.getCurrentUser();

        $('.createQuestionBtn').show();
        $('.signin_button span').text(this.user.userName);
        $('.signin_button').attr('data-toggle', 'dropdown');
        $('.signin_button img').attr('src', 'images/Sign_out.png');
        $('.signout-button').text('Sign out');
        $('.signout-button').on('click', _.bind(this.signout, this));
        $('.createQuestionBtn').on('click', _.bind(this.showCreateNewQuestion, this));

        this.UID = this.user && this.user.UID ? this.user.UID : '';
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.showFilters();
        App.on('createNewQuestion:show', _.bind(this.showCreateNewQuestion, this));
        App.on('refreshFeed', _.bind(this.getQuestions, this));
        App.on('statusChanged', _.bind(this.getQuestions, this));
    },

    signout: function() {
        loader.show('');
        userController.logout(this.user.getUID()).then(function() {
            $('.signin_button span').text('Sign in');
            $('.signin_button').attr('data-toggle', '');
            $('.signin_button img').attr('src', 'images/Sign_in.png');
            $('.signout-button').text('Sign in');
            loader.showFlashMessage( 'signed out' );
            App.trigger('viewChange', 'auth');
        }.bind(this), function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    showFilters: function() {
        var filtersView = new FiltersView({});
        filtersView.listenTo(filtersView, 'getCategories', _.bind(this.getCategories, this));
        filtersView.listenTo(filtersView, 'getTags', _.bind(this.getTags, this));
        filtersView.listenTo(filtersView, 'getQuestions', _.bind(this.getQuestions, this));
        this.centralLayoutView.showFiltersView(filtersView);
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
        this.centralLayoutView.showShareQuestionView(shareQuestionView);
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
        this.centralLayoutView.showShareQuestionView(view)
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
                var successView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(successView);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to share question with ' + email);
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                var errorMessageView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(errorMessageView);
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
                var successView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(successView);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to share question with ' + phone);
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                var errorMessageView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(errorMessageView);
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
            var callback = _.bind(this.getQuestions, this);
            var successView = new TextMessageView({
                text: 'Successfully created a question',
                callback: callback
            });
            this.centralLayoutView.showTextMessageView(successView);
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
        gateway.sendRequest('getPreeQuestions', this.params)
        .then(_.bind(function(resp) {
            var model = new FeedModel(resp);
            this.showQuestions(model);
        }, this), function(e) {
          loader.hide();
          loader.showErrorMessage(e, 'unable to load questions')
        });
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
            model: model
        });
        this.feedView = feedView;
        feedView.listenTo(feedView, 'answerQuestion', _.bind(this.onAnswerQuestion, this));
        feedView.listenTo(feedView, 'checkIfUserLogged', _.bind(this.onCheckIfUserLogged, this));
        feedView.listenTo(feedView, 'sharePopup:show', _.bind(this.showShareQuestion, this));
        feedView.listenTo(feedView, 'getPreviousQuestions', _.bind(this.getPreviousQuestions, this));
        feedView.listenTo(feedView, 'addLikeDislike', _.bind(this.addLikeDislike, this));
        feedView.listenTo(feedView, 'showNotAnsweredError', _.bind(this.showNotAnsweredError, this));
        feedView.listenTo(feedView, 'getMessages', _.bind(this.getMessages, this));
        feedView.listenTo(feedView, 'postComment', _.bind(this.postComment, this));
        this.centralLayoutView.showQuestionsView(this.feedView);
    },

    getMessages: function(questionView, message) {

        var uuid = questionView.model.get('uuid');
        
        communicationActions.getMessages(uuid).then(_.bind(function(resp) {
            // if (resp.messages.length===0) return;
            this.preeQuestionMessagesView = new PreeQuestionMessagesView({
                collection: new MessagesCollection(resp.messages),
                user: this.user
            });
            if (message!==undefined) {
                this.preeQuestionMessagesView.collection.add(new MessageModel(message));
            }
            questionView.triggerMethod('showMessages', this.preeQuestionMessagesView);
        }, this));
    },

    postComment: function(questionView, options) {
        communicationActions.postComment(options).then(_.bind(function(resp) {
            this.getMessages(questionView, resp);
        }, this))
    },

    showNotAnsweredError: function(text) {
        var errorMessageView = new TextMessageView({
            text: text
        });
        this.centralLayoutView.showTextMessageView(errorMessageView)
    },

    addLikeDislike: function(options) {
        gateway.sendRequest('likeDislikePoll', {
            UID: this.user.UID,
            like: options.like,
            contestUUID: options.uuid
        }).then(function(resp) {
            console.log(resp);
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
            UID: this.UID,
            uuid: uuid,
            choice: choiceId
        }).then(_.bind(function(resp) {
            view.reinitialize(resp, isCorrect);
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'You can\'t answer this question'),
                callback = function() {
                    console.log('callback');
                };
            var errorMessageView = new TextMessageView({
                text: text,
                callback: callback
            });
            this.centralLayoutView.showTextMessageView(errorMessageView);
        }, this));
    }
}
