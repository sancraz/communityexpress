'use strict';

var App = require('../app'),
    Vent = require('../Vent'),
    HeaderView = require('../views/header/HeaderView'),
    SignInView = require('../views/header/SignInView');

module.exports = {

    showLayout: function() {
        this.headerView = new HeaderView();
        App.regions.getRegion('headerRegion').show(this.headerView);
        App.on('signinForm:show', _.bind(this.headerView.signin, this.headerView));
        this.headerView.listenTo(Vent, 'login_success logout_success', this.headerView.changeStatus, this.headerView);
        this.headerView.listenTo(this.headerView, 'signin', _.bind(this.signin, this));
    },

    signin: function(triggerEvent) {
        var signInView = new SignInView({
            parent: this.headerView,
            event: triggerEvent
        });
        signInView.listenTo(signInView, 'openView', _.bind(this.openViewAfterSignIn, this))
        this.headerView.getRegion('popupRegion').show(signInView);
    },

    openViewAfterSignIn: function(triggerEvent) {
        App.trigger(triggerEvent);
    }
}
