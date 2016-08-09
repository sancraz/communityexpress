'use strict';

var PreeQuestionView = require('./PreeQuestionView'),
    preeController = require('../../controllers/preeController'),
    loader = require('../../loader');

var feedView = Mn.CollectionView.extend({

    childView: PreeQuestionView,

    childEvents: {
        'collapseDetails': 'collapseDetails',
        'answerQuestion' : 'onAnswerQuestion',
        'checkIfUserLogged': 'onCheckIfUserLogged',
        'sharePopup:show': 'openSharePopup',
        'addLikeDislike': 'addLikeDislike',
        'showNotAnsweredError': 'showNotAnsweredError',
        'getMessages': 'getMessages',
        'postComment': 'postComment'
    },

    events: {
        // 'scroll': 'calculateScroll'
    },

    initialize : function() {
        this.params = this.model.get('params');
        this.listenTo(this.model, "change", this.modelEventHandler);
        /* I implemented this but commented out because we changed the design */

        /*
          check if share url, then load the question shared.
        */

        /*
        if( (typeof window.community.type !== 'undefined' ) && (window.community.type==='l')){
          switch(window.community.type){
            case 'l':
             console.log(" share detected "+window.community.uuidURL);
             var contestUUID = window.community.uuidURL;
              gateway.sendRequest('getPreeQuestionByUUID',{ UID: this.params.UID, contestUUID: contestUUID})
                   .then(_.bind(function(resp) {
                     this.collection.unshift(_.extend(resp, { activatedByUUID: true }));
                  }, this));


            break;
            default:
             console.log(" WARNING: Unknown share type: "+window.community.type+", ignoring");
           }
        }else{
          console.log(" no share detected");
        }
        */

    },

    onShow: function() {
        console.log(this.collection);
        this.bindScroll();
    },

    onRender: function() {
        loader.hide();
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.render();
    },

    bindScroll: function() {
        this.$el.bind('scroll', _.bind(this.calculateScroll, this));
    },

    calculateScroll: function(e) {
        if (!this.model.get('previousId')) {
            return;
        };
        var windowHeight = $(window).height();
        var lastQuestionTop = this.$el.find('#'+this.model.get('previousId')).offset().top;
        if (lastQuestionTop < windowHeight) {
            this.params.nextId = this.model.get('previousId');
            this.params.count = 5;
            if (!this.params.nextId) return;
            this.trigger('getPreviousQuestions', this.params);
            this.$el.unbind('scroll');
        };
    },

    collapseDetails: function(view) {
        if (this.viewWithExpandedDetails) {
            this.viewWithExpandedDetails.triggerMethod('collapseDetailsInChild');
        }
        this.viewWithExpandedDetails = view;
    },

    onAnswerQuestion: function(view, choiceId, uuid, isCorrect) {
        this.trigger('answerQuestion', choiceId, uuid, isCorrect, view);
    },

    onCheckIfUserLogged: function(view, callback) {
        this.trigger('checkIfUserLogged', callback);
    },

    openSharePopup: function(view, questionModel) {
        this.trigger('sharePopup:show', questionModel);
    },

    addLikeDislike: function(view, options) {
        this.trigger('addLikeDislike', options);
    },

    showNotAnsweredError: function(view, text) {
        this.trigger('showNotAnsweredError', text);
    },

    getMessages: function(view) {
        this.trigger('getMessages', view);
    },

    postComment: function(view, options) {
        this.trigger('postComment', view, options);
    },

    rerenderChild: function(model) {

    }

});

module.exports = feedView;
