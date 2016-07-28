'use strict';

var template = require('ejs!./templates/centralLayout.ejs'),
    App = require('../../app');

var CentralLayoutView = Mn.LayoutView.extend({

    template: template,

    className: 'container-fluid',

    regions: {
        filtersRegion: '#filters-region',
        newQuestionRegion: '#new-question-region',
        questionsRegion: '#questions-region',
        popupRegion: '#popup_region'
    },

    onShow: function() {
        // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        // setTimeout(function() {
        //     var myScroll = new IScroll('#questions-region');
        // }, 200);
    },

    showFiltersView: function(view){
        this.filtersRegion.show(view);
    },

    showNewQuestionView: function(view) {
        this.newQuestionRegion.show(view);
    },

    showQuestionsView: function(view) {
        this.questionsRegion.show(view);
    },

    showShareQuestionView: function(view) {
        this.popupRegion.show(view);
    },

    showTextMessageView: function(view) {
        this.popupRegion.show(view);
    }
});

module.exports = CentralLayoutView;
