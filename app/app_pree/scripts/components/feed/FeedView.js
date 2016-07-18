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
        'sharePopup:show': 'openSharePopup'
    },

    events: {
        // 'scroll': 'calculateScroll'
    },

    initialize : function() {
        this.listenTo(this.model, "change", this.modelEventHandler);
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
        var windowHeight = $(window).height();
        var lastQuestionTop = this.$el.find('#'+this.model.get('previousId')).offset().top;
        if (lastQuestionTop < windowHeight) {
            this.trigger('getPreviousQuestions', this.model.get('previousId'));
            this.$el.unbind('scroll');
        };
    },

    collapseDetails: function(view) {
        if (this.viewWithExpandedDetails) {
            this.viewWithExpandedDetails.triggerMethod('collapseDetailsInChild');
        }
        this.viewWithExpandedDetails = view;
    },

    onAnswerQuestion: function(view, choiceId, uuid) {
        this.trigger('answerQuestion', choiceId, uuid, view);
    },

    onCheckIfUserLogged: function(view, callback) {
        this.trigger('checkIfUserLogged', callback);
    },

    openSharePopup: function(view, questionModel) {
        this.trigger('sharePopup:show', questionModel);
    },

    rerenderChild: function(model) {

    }

});

module.exports = feedView;
