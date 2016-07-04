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
    }
});

module.exports = CentralLayoutView;
