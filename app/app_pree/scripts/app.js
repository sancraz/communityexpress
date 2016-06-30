'use strict';

var Router = require('./router'),
    sessionActions = require('./actions/sessionActions'),
    HeaderView = require('./views/header/HeaderView');

var App = new Mn.Application();

App.on('before:start', function() {

    var AppLayoutView = Mn.LayoutView.extend({

        template: require('ejs!./templates/appLayout.ejs'),

        el: '#app-container',

        regions: {
            headerRegion: '#header-region',
            leftRegion: '#left-region',
            centralRegion: '#central-region',
            rightRegion: '#right-region'
        },

        initialize: function() {
            this.render();
        }
    });

    App.regions = new AppLayoutView();
});

App.on('start',function() {
    this.params = {};
    // this.params.canCreateAnonymousUser = true;
    var router = new Router();

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
});

module.exports = App;
