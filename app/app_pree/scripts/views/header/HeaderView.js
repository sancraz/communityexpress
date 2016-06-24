'use strict';

var template = require('ejs!./header.ejs'),
    InfoView = require('./infoView');

var HeaderView = Mn.LayoutView.extend({

    template: template,

    regions: {
        infoRegion: '.info-region'
    },

    onShow: function() {
        this.infoRegion.show(new InfoView())
    }
});

module.exports = HeaderView;
