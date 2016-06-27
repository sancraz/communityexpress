'use strict';

var App = require('../app'),
    loader = require('../loader'),
    appCache = require('../appCache'),
    gateway = require('../APIGateway/gateway'),
    CentralLayoutView = require('../views/CentralLayoutView'),
    CreateQuestionView = require('../views/CreateQuestionView'),
    CreateQuestionModel = require('../models/PreeNewQuestionModel'),
    FeedView = require('../views/FeedView'),
    FiltersView = require('../views/FiltersView'),
    FeedModel = require('../models/FeedModel');

module.exports = {

    showLayout: function() {
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.showFilters();
        App.on('createNewQuestion:show', _.bind(this.showCreateNewQuestion, this));
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
        this.centralLayoutView.showNewQuestionView(this.createNewQuestion);
    },

    hideCreateNewQuestion: function() {
        if (this.createNewQuestion) {
            this.createNewQuestion.triggerMethod('discardQuestion');
        }
    },

    postNewQuestion: function(model, callback) {
        console.log(model.toJSON());

        gateway.sendRequest('createQuestion', {
            UID: 'user20.781305772384780045',
            payload: model.toJSON()
        }).then(_.bind(function(resp) {
            callback();
        }, this), function(e) {
            callback();
        });
    },

    getCategories: function(callback) {
        this.hideCreateNewQuestion();
        gateway.sendRequest('getPreeCategories', {
        }).then(_.bind(function(resp) {
            callback(resp);
        }, this), function(e) {

        });
    },

    getTags: function(callback) {
        this.hideCreateNewQuestion();
        gateway.sendRequest('getPreeTags', {
        }).then(_.bind(function(resp) {
            callback(resp);
        }, this), function(e) {

        });
    },

    getQuestions: function(params) {
        this.hideCreateNewQuestion();
        var UID = '';
        loader.show('questions');
        if ( appCache.get('user') && appCache.get('user').getUID ) {
            UID = appCache.get('user').getUID();
        }
        params['UID'] = UID;
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
        // var infoView = new InfoView({
        //     model: model
        // });
        var feedView = new FeedView({
            el: $('.pree_feed_questions'),
            collection: model.questionCollection
        });
        this.centralLayoutView.showQuestionsView(feedView)
    }
}
