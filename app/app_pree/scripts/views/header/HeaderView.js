'use strict';

var template = require('ejs!./header.ejs'),
    loader = require('../../loader'),
    sessionActions = require('../../actions/sessionActions'),
    SignInView = require('./SignInView'),
    InfoView = require('./infoView');

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

    initialize: function() {
        this.user = sessionActions.getCurrentUser();
    },

    onShow: function() {
        this.infoRegion.show(new InfoView());
    },

    confirmSignout: function () {
        this.popupRegion.show(new SignOutView({
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        }))
    },

    signout: function() {
        loader.show();
        userController.logout(this.user.getUID()).then(function(){
            loader.showFlashMessage( 'signed out' );
            // $('.menu_button_5').removeClass('navbutton_sign_out').addClass('navbutton_sign_in');
        }, function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    signin: function() {
        this.popupRegion.show(new SignInView({
            parent: this
        }));
    },
});

module.exports = HeaderView;
