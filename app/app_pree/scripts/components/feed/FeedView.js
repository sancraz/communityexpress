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

    initialize : function() {
        this.listenTo(this.model, "change", this.modelEventHandler);
    },

    onRender: function() {
        loader.hide();
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.render();
    },

    collapseDetails: function(view) {
        if (this.viewWithExpandedDetails) {
            this.viewWithExpandedDetails.triggerMethod('collapseDetailsInChild');
        }
        this.viewWithExpandedDetails = view;
    },

    onAnswerQuestion: function(view, choiceId, uuid) {
        this.trigger('answerQuestion', choiceId, uuid);
    },

    onCheckIfUserLogged: function(view, callback) {
        this.trigger('checkIfUserLogged', callback);
    },

    openSharePopup: function(view, questionModel) {
        this.trigger('sharePopup:show', questionModel);
    }

});

module.exports = feedView;
