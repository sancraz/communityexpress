'use strict';

var Router = require('./router'),
    sessionActions = require('./actions/sessionActions'),
    HeaderView = require('./components/header/HeaderView');

var App = new Mn.Application();

App.on('before:start', function() {

    // var AppLayoutView = Mn.LayoutView.extend({
    //
    //     template: require('ejs!./templates/appLayout.ejs'),
    //
    //     el: '#app-container',
    //
    //     regions: {
    //         headerRegion: '#header-region',
    //         leftRegion: '#left-region',
    //         centralRegion: '#central-region',
    //         rightRegion: '#right-region'
    //     },
    //
    //     initialize: function() {
    //         this.render();
    //     }
    // });
    //
    // App.regions = new AppLayoutView();
});

App.on('start',function() {
    this.params = {};
    App.router = new Router();

    if (localStorage.cmxUID) {
        sessionActions.getSessionFromLocalStorage().then(function () {
            Backbone.history.start({pushState: true});
        });
    } else {
        Backbone.history.start({
            pushState: true,
            silent: true
        });
        App.router.navigate('#auth', {trigger: true});
    }
});

module.exports = App;
