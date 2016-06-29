'use strict';

var template = require('ejs!./header.ejs'),
    loader = require('../../loader'),
    Vent = require('../../Vent'),
    h = require('../../globalHelpers'),
    config = require('../../appConfig'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    SignInView = require('./SignInView'),
    SignOutView = require('./SignOutView'),
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
        'click @ui.signin': 'toggle',
        'click @ui.signout': 'confirmSignout'
    },

    initialize: function() {
        this.user = sessionActions.getCurrentUser();
        this.listenTo(Vent, 'login_success logout_success', this.changeStatus, this);
    },

    serializeData: function() {
        return {
            user: this.user
        };
    },

    onRender: function() {
        this.infoRegion.show(new InfoView());
    },

    changeStatus: function(loginMethod) {
        switch (loginMethod) {
            case 'success':
                this.$el.find('.modal').modal('hide').on('hidden.bs.modal', _.bind(function() {
                    this.render();
                }, this));
                break;
            case 'fromLocalstorage',
                'loggedOut':
                this.render();
                break;
            default:
        }

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
        }, function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    signin: function() {
        this.popupRegion.show(new SignInView({
            parent: this
        }));
    },

    toggle: function () {
        if ( !this.user.getUID()) {
            this.signin();
        } else {
            this.confirmSignout();
        }
    }
});

module.exports = HeaderView;
