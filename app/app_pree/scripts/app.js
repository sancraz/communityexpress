'use strict';

var Router = require('./router'),
    sessionActions = require('./actions/sessionActions');

// var App = function() {
//     debugger;
//     this.params.canCreateAnonymousUser = true;
// };

var App = {

    init: function() {
        this.params = {};
        // this.params.canCreateAnonymousUser = true;
        var router = new Router;

        if (this.params.UID) {
            localStorage.setItem("cmxUID", this.params.UID);
            sessionActions.authenticate(this.params.UID)
                .always(function() {
                    Backbone.history.start({pushState: true});
                });
        } else if (localStorage.cmxUID) {
            sessionActions.getSessionFromLocalStorage().then(function () {
                Backbone.history.start({pushState: true});
            });
        } else if (this.params.canCreateAnonymousUser) {
            $.when(sessionActions.createAnonymousUser()).done(function() {
                sessionActions.getSessionFromLocalStorage().then(function () {
                    Backbone.history.start({pushState: true});
                });
            });
        } else {
            Backbone.history.start();
        }
    }
};

module.exports = App;
