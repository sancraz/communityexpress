'use strict';

var template = require('ejs!../templates/centralLayout.ejs'),
    App = require('../app');

var CentralLayoutView = Mn.LayoutView.extend({

    template: template,

    regions: {
        filtersRegion: '#filters-region',
        questionsRegion: '#questions-region'
    },

    showFiltersView: function(view){
        this.filtersRegion.show(view);
    },

    showQuestionsView: function(view) {
        debugger;
        this.questionsRegion.show(view);
    }
});

module.exports = CentralLayoutView;
