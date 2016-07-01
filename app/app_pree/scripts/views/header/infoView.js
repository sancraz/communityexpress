'use strict';

var template = require('ejs!./info.ejs');

var InfoView = Mn.ItemView.extend({
    template: template,

    className: 'infoPanel',

    ui: {
        refreshFeed: '.refresh-feed'
    },

    events: {
        'click @ui.refreshFeed': 'onRefreshFeed'
    },

    onRefreshFeed: function() {
        this.trigger('refreshFeed');
    }
});

module.exports = InfoView;
