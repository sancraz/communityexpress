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
        this.params = this.model.get('params');
        this.listenTo(this.model, "change", this.modelEventHandler);
    },

    onShow: function() {
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

    rerenderChild: function(model) {

    }

});

module.exports = feedView;
