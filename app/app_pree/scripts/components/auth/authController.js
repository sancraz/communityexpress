'use strict';

var App = require('../../app'),
    loader = require('../../loader'),
    sessionActions = require('../../actions/sessionActions'),
    ContactLayoutView = require('./views/ContactLayoutView'),
    SignInView = require('./views/SignInView'),
    SignUpView = require('./views/SignUpView');

module.exports = {

    showLayout: function() {
        this.contactLayoutView = new ContactLayoutView();
        App.regions.getRegion('centralRegion').show(this.contactLayoutView);
        this.contactLayoutView.listenTo(this.contactLayoutView, 'signin signup', _.bind(this.authenticate, this));
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
        this.contactLayoutView.openAuthView(view);
        this.contactLayoutView.listenTo(view, 'submitSignin', _.bind(this.submitSignin, this));
    },

    submitSignin: function() {
        loader.show('');
        sessionActions.startSession(this.popup.val().username, this.popup.val().password)
            .then(function(response) {
                this.popup.$el.on('hidden.bs.modal', _.bind(function() {
                    loader.showFlashMessage( 'successfully signed in as ' + response.username );
                    App.router.navigate('/', { trigger: true });
                }, this.popup));
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
    }
};
