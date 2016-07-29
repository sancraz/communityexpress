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
        'addLikeDislike': 'addLikeDislike'
    },

    events: {
        // 'scroll': 'calculateScroll'
    },

    initialize : function() {
        this.params = this.model.get('params');
        this.listenTo(this.model, "change", this.modelEventHandler);

        if (community.type === 'l') {
            // gateway.sendRequest('getQuestionByUUID', this.params.UID, community.uuidURL)
            //     .then(_.bind(function(resp) {
            //         this.collection.unshift(_.extend(resp, { activatedByUUID: true }));
            //     }, this));
            this.collection.unshift(_.extend({
                authorImageURL: 'https://communitylive.co/apptsvc/static/images/placeholder_200x200.png',
                userStatus: {
                    displayText: 'Not Answered',
                    enumText: 'NOT_ANSWERED',
                    id: 1
                },
                pollType: {
                    displayText: 'Fact',
                    enumText: 'FACT',
                    id: 1
                },
                tags: [],
                categories: [],
                authorUserName: 'Some Name',
                img_url: null,
                displayText: 'Cool question',
                choices: [],
                totalPoints: 0,
                totalAnswers: 0,
                uuid: 'someInterestingUUID',
                additionalInformation: '',
                infoURL1: '',
                infoURL2: '',
                likes: 0,
                messages: 0
            }, { activatedByUUID: true }));
        }
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

    addLikeDislike: function(view, uuid) {
        this.trigger('addLikeDislike', uuid);
    },

    rerenderChild: function(model) {

    }

});

module.exports = feedView;
