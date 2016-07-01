'use strict';

var App = require('../app'),
    loader = require('../loader'),
    Vent = require('../Vent'),
    sessionActions = require('../actions/sessionActions'),
    gateway = require('../APIGateway/gateway'),
    CentralLayoutView = require('../views/CentralLayoutView'),
    CreateQuestionView = require('../views/CreateQuestionView'),
    CreateQuestionModel = require('../models/PreeNewQuestionModel'),
    FeedView = require('../views/FeedView'),
    FiltersView = require('../views/FiltersView'),
    FeedModel = require('../models/FeedModel');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        this.UID = this.user && this.user.UID ? this.user.UID : '';
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.showFilters();
        App.on('createNewQuestion:show', _.bind(this.showCreateNewQuestion, this));
        App.on('refreshFeed', _.bind(this.getQuestions, this));
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
            callback();
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
        this.hideCreateNewQuestion();
        loader.show('questions');
        params['UID'] = this.UID;
        gateway.sendRequest('getPreeQuestions', params)
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

        var feedView = new FeedView({
            el: $('.pree_feed_questions'),
            collection: model.questionCollection
        });
        feedView.listenTo(feedView, 'answerQuestion', _.bind(this.onAnswerQuestion, this));
        feedView.listenTo(feedView, 'checkIfUserLogged', _.bind(this.onCheckIfUserLogged, this));
        this.centralLayoutView.showQuestionsView(feedView);
    },

    onCheckIfUserLogged: function(callback) {
        var logged = this.UID ? true : false;
        callback(logged);
    },

    onAnswerQuestion: function(choiceId, uuid) {
        console.log(choiceId, uuid);
        gateway.sendRequest('answerQuestion', {
            UID: this.UID,
            uuid: uuid,
            choice: choiceId
        }).then(_.bind(function(resp) {

        }, this), function(e) {

        });
    }

}
