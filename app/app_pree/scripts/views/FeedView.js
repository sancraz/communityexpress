'use strict';

var PreeQuestionView = require('./PreeQuestionView'),
    preeController = require('../controllers/preeController'),
    loader = require('../loader');

var feedView = Mn.CollectionView.extend({

    childView: PreeQuestionView,

    childViewContainer: '.pree_feed_questions',

    initialize : function() {
        this.getQuestions();
        this.listenTo(this.model, "change", this.modelEventHandler);
    },

    getQuestions: function() {
        preeController.getQuestions().then(function(model) {
            this.model = model;
            this.collection = model.questionCollection;
            this.render();
        }.bind(this));
    },

    onRender: function() {
        loader.hide();
    },

    modelEventHandler : function() {
        console.log(" Model event received");
        this.render();
    }
});

module.exports = feedView;
