'use strict';

var App = require('../app'),
    Vent = require('../Vent'),
    loader = require('../loader'),
    h = require('../globalHelpers'),
    config = require('../appConfig'),
    sessionActions = require('../actions/sessionActions'),
    userController = require('./userController'),
    HeaderView = require('../components/header/HeaderView'),
    InfoView = require('../components/header/infoView'),
    SignInView = require('../components/header/SignInView'),
    SignUpView = require('../components/header/SignUpView'),
    SignOutView = require('../components/header/SignOutView');

module.exports = {

    showLayout: function() {
        this.user = sessionActions.getCurrentUser();
        this.headerView = new HeaderView({
            user: this.user
        });
        App.regions.getRegion('headerRegion').show(this.headerView);
        this.showInfoView();
        App.on('signinForm:show', _.bind(this.headerView.signin, this.headerView));
        this.headerView.listenTo(this.headerView, 'infoView:show', _.bind(this.showInfoView, this));
        this.headerView.listenTo(Vent, 'login_success logout_success', this.changeStatus, this);
        this.headerView.listenTo(this.headerView, 'signin', _.bind(this.signin, this));
        this.headerView.listenTo(this.headerView, 'confirmSignout', _.bind(this.confirmSignout, this));
    },

    showInfoView: function() {
        var infoView = new InfoView();
        this.headerView.getRegion('infoRegion').show(infoView);
        infoView.listenTo(infoView, 'refreshFeed', _.bind(this.refreshFeed, this));
    },

    signin: function(triggerEvent) {
        var signInView = new SignInView({
            parent: this.headerView,
            event: triggerEvent
        });
        this.headerView.getRegion('popupRegion').show(signInView);
        signInView.listenTo(signInView, 'signUpView:show', _.bind(this.openSignupView, this));
        signInView.listenTo(signInView, 'openView', _.bind(this.openViewAfterSignIn, this));
        signInView.listenTo(signInView, 'passwordRecovery', _.bind(this.passwordRecovery, this));
    },

    openSignupView: function() {
        var signUpView = new SignUpView();
        this.headerView.getRegion('popupRegion').show(signUpView);
    },

    confirmSignout: function() {
        var signOutView = new SignOutView({
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        });
        this.headerView.getRegion('popupRegion').show(signOutView);
    },

    signout: function() {
        loader.show('');
        userController.logout(this.user.getUID()).then(function(){
            loader.showFlashMessage( 'signed out' );
        }, function(e){
            loader.showFlashMessage(h().getErrorMessage(e, config.defaultErrorMsg));
        });
    },

    changeStatus: function(loginMethod) {
        switch (loginMethod) {
            case 'success':
                this.$el.find('.modal').modal('hide').on('hidden.bs.modal', _.bind(function() {
                    this.render();
                }, this));
                break;
            case 'fromLocalstorage':
            case 'loggedOut':
                this.render();
                break;
            default:
        }
    },

    openViewAfterSignIn: function(triggerEvent) {
        App.trigger(triggerEvent);
    },

    passwordRecovery: function() {
        console.log('start password recovery');
    },

    refreshFeed: function() {
        App.trigger('refreshFeed', {
			filterType: ''
		});
    }
}
