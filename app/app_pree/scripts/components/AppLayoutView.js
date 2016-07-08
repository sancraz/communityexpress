'use strict';

var AppLayoutView = Mn.LayoutView.extend({

    template: require('ejs!../templates/appLayout.ejs'),

    el: '#app-container',

    regions: {
        headerRegion: '#header-region',
        leftRegion: '#left-region',
        centralRegion: '#central-region',
        rightRegion: '#right-region'
    },

    initialize: function() {
        this.render();
    }
});

module.exports = AppLayoutView;
