'use strict';

var App = require('../../app'),
    AppLayoutView = require('../AppLayoutView'),
    loader = require('../../loader'),
    Vent = require('../../Vent'),
    gateway = require('../../APIGateway/gateway'),
    h = require('../../globalHelpers'),
    sessionActions = require('../../actions/sessionActions'),
    ContactLayoutView = require('./views/ContactLayoutView'),
    SignInView = require('./views/SignInView'),
    SignUpView = require('./views/SignUpView'),
    TextMessageView = require('../feed/TextMessageView');

module.exports = {

    showLayout: function() {
        App.regions = new AppLayoutView();
        this.contactLayoutView = new ContactLayoutView();
        App.regions.getRegion('centralRegion').show(this.contactLayoutView);

        $('.createQuestionBtn').hide();
        $('.signin_button').on('click', _.bind(this.authenticate, this, 'signin'));

        Vent.on('login_success', _.bind(this.navigateToFeed, this));
        this.contactLayoutView.listenTo(this.contactLayoutView, 'signin signup', _.bind(this.authenticate, this));
        this.contactLayoutView.listenTo(this.contactLayoutView, 'sendContactInfo', _.bind(this.sendContactInfo, this));
    },

    sendContactInfo: function(options) {
        loader.show('sending');
        gateway.sendRequest('sendContactInfo', {
            payload: options
        }).then(_.bind(function(resp) {
            loader.hide();
            var text = 'successfully sent your info';
            var successView = new TextMessageView({
                text: text
            });
            this.contactLayoutView.openPopupView(successView);
        }, this), _.bind(function(jqXHR) {
            loader.hide();
            var text = h().getErrorMessage(jqXHR, 'Unable to send information');
            var errorView = new TextMessageView({
                text: text
            });
            this.contactLayoutView.openPopupView(errorView);
        }, this));
    },

    authenticate: function(auth) {
        var view;
        switch (auth) {
            case 'signin':
                view = new SignInView();
                this.contactLayoutView.listenTo(view, 'signup', _.bind(this.authenticate, this));
                break;
            case 'signup':
                view = new SignUpView();
            default:
        };
        this.popup = view;
        this.contactLayoutView.openPopupView(view);
        this.contactLayoutView.listenTo(view, 'submitSignin', _.bind(this.submitSignin, this));
    },

    submitSignin: function() {
        loader.show('');
        sessionActions.startSession(this.popup.val().username, this.popup.val().password)
            .then(function(response) {
                loader.showFlashMessage( 'successfully signed in as ' + response.username );
                this.popup.close();
            }.bind(this), function(jqXHR) {
                if( jqXHR.status === 400 ) {
                    this.popup.showLoginError();
                    loader.hide();
                }else{
                    loader.showFlashMessage(h().getErrorMessage(jqXHR, 'Error signin in'));
                }
            }.bind(this));
        return false;
    },

    navigateToFeed: function() {
        this.contactLayoutView.$el.on('hidden.bs.modal', _.bind(function() {
            $('.signin_button').off('click');
            App.trigger('viewChange', 'feed');
        }, this));
    }
};
