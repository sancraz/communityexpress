/*global define*/

'use strict';

var template = require('ejs!../../templates/partials/signInButton.ejs'),
    loader = require('../../loader'),
    Vent = require('../../Vent'),
    favoriteActions = require('../../actions/favoriteActions'),
    sessionActions = require('../../actions/sessionActions'),
    userController = require('../../controllers/userController'),
    h = require('../../globalHelpers');

var SignInButton = Backbone.View.extend({

    template: template,

    events: {
        'click': 'toggle'
    },

    initialize: function (options) {
        options = options || {};
        this.parent = options.parent;
        this.user = sessionActions.getCurrentUser();

        this.listenTo(Vent, 'login_success logout_success', this.render, this);
        this.listenTo(this.parent, 'hide', this.remove, this);
    },

    render: function () {
        this.$el.html(this.template({
            isSignedIn: this.user.getUID() ? true : false,
        }));
        return this;
    },

    confirmSignout: function () {
        this.parent.openSubview('confirmationPopup', {}, {
            text: 'Are you sure you want to sign out?',
            action: this.signout.bind(this)
        });
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
        this.parent.openSubview('signin', this.model);
    },

    toggle: function () {
        if ( !this.user.getUID()) {
            this.signin();
        } else {
            this.confirmSignout();
        }
    },

});

module.exports = SignInButton;
