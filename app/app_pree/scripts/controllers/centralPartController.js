'use strict';

var App = require('../app'),
    loader = require('../loader'),
    Vent = require('../Vent'),
    h = require('../globalHelpers'),
    sessionActions = require('../actions/sessionActions'),
    gateway = require('../APIGateway/gateway'),
    CentralLayoutView = require('../components/feed/CentralLayoutView'),
    CreateQuestionView = require('../components/feed/CreateQuestionView'),
    CreateQuestionModel = require('../models/PreeNewQuestionModel'),
    FeedView = require('../components/feed/FeedView'),
    FiltersView = require('../components/feed/FiltersView'),
    TextMessageView = require('../components/feed/TextMessageView'),
    ShareQuestionView = require('../components/feed/ShareQuestionView'),
    ShareQuestionWithMobile = require('../components/feed/ShareQuestionWithMobile'),
    ShareQuestionWithEmail = require('../components/feed/ShareQuestionWithEmail'),
    FeedModel = require('../models/FeedModel'),
    PreeQuestionModel = require('../models/PreeQuestionModel');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        this.UID = this.user && this.user.UID ? this.user.UID : '';
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.showFilters();
        App.on('createNewQuestion:show', _.bind(this.showCreateNewQuestion, this));
        App.on('refreshFeed', _.bind(this.getQuestions, this));
        App.on('statusChanged', _.bind(this.getQuestions, this));
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

    showShareQuestionEmailSMS: function(param, model) {
        var view;
        switch (param) {
            case 'sendSMS':
                view = new ShareQuestionWithMobile({
                    model: model
                });
                break;
            case 'sendEmail':
                view = new ShareQuestionWithEmail({
                    model: model
                });
                break;
            default:
        };
        view.listenTo(view, 'sendEmail', _.bind(this.sendEmail, this));
        view.listenTo(view, 'sendMobile', _.bind(this.sendMobile, this));
        this.centralLayoutView.showShareQuestionView(view)
    },

    sendEmail: function(uuid, email, view) {
        loader.show('email', 'sending');
        gateway.sendRequest('sendPromoURLToEmail', {
            UID: this.user.getUID(),
            contestUUID: uuid,
            toEmail: email
        }).then(_.bind(function(resp) {
            var text = 'Promotion URL is sent to ' + email;
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                var successView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(successView);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to send Promotion URL to ' + email);
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

    sendMobile: function(uuid, phone, view) {
        loader.show('to mobile', 'sending');
        gateway.sendRequest('sendPromoURLToMobileviaSMS', {
            UID: this.user.getUID(),
            contestUUID: uuid,
            toTelephoneNumber: phone
        }).then(_.bind(function() {
            var text = 'Promotion URL is sent to ' + phone;
            view.close();
            view.$el.on('hidden.bs.modal', _.bind(function() {
                loader.hide();
                var successView = new TextMessageView({
                    text: text
                });
                this.centralLayoutView.showTextMessageView(successView);
            }, this));
        }, this), _.bind(function(jqXHR) {
            var text = h().getErrorMessage(jqXHR, 'Unable to send Promotion URL to ' + phone);
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
        this.centralLayoutView.showQuestionsView(this.feedView);
    },

    addLikeDislike: function(uuid) {
        gateway.sendRequest('likeDislikePoll', {
            UID: this.user.UID,
            like: true,
            contestUUID: uuid
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
