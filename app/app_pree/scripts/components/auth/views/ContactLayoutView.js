'use strict';

var template = require('ejs!../templates/contactLayout.ejs');

var ContactLayoutView = Mn.LayoutView.extend({

    template: template,

    className: 'contact-form',

    regions: {
        popupRegion: '#popup-region'
    },

    ui: {
        signin: '.signin-button',
        signup: '.signup-button'
    },

    events: {
        'click @ui.signin': 'signin',
        'click @ui.signup': 'signup'
    },

    signin: function() {
        this.trigger('signin', 'signin');
    },

    signup: function() {
        this.trigger('signup', 'signup');
    },

    openAuthView: function(view) {
        this.popupRegion.show(view);
    }

});

module.exports = ContactLayoutView;
