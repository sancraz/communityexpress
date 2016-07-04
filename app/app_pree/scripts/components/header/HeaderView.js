'use strict';

var template = require('ejs!./templates/header.ejs');

var HeaderView = Mn.LayoutView.extend({

    template: template,

    regions: {
        infoRegion: '.info-region',
        popupRegion: '.popup-region'
    },

    ui: {
        signin: '.signin-button',
        signout: '.signout-button'
    },

    events: {
        'click @ui.signin': 'signin',
        'click @ui.signout': 'confirmSignout'
    },

    initialize: function(options) {
        this.user = options.user;
    },

    serializeData: function() {
        return {
            user: this.user
        };
    },

    onRender: function() {
        this.trigger('infoView:show');
    },

    confirmSignout: function () {
        this.trigger('confirmSignout');
    },

    signin: function(triggerEvent) {
        this.trigger('signin', triggerEvent);
    }
});

module.exports = HeaderView;
