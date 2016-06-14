'use strict';

var PreeQuestionView = require('./PreeQuestionView'),
    loader = require('../loader');

// var feedView = Backbone.View.extend({
var feedView = Mn.CollectionView.extend({

    childView: PreeQuestionView,

    initialize : function() {
        this.render();
        this.listenTo(this.model, "change", this.modelEventHandler);
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
