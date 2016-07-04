'use strict';

var template = require('ejs!./templates/info.ejs');

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
