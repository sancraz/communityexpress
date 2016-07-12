'use strict';

var Router = require('./router'),
    sessionActions = require('./actions/sessionActions'),
    userController = require('./controllers/userController'),
    pageController = require('./pageController'),
    HeaderView = require('./components/header/HeaderView');

var App = new Mn.Application();

App.goToPage = function(viewName) {
    if (viewName === 'feed') {
        viewName = userController.hasCurrentUser() ? 'feed' : 'auth';
    };
    pageController[viewName]();
};

App.on('viewChange', App.goToPage);

App.on('start',function() {

    this.params = window.community;

    Backbone.history.start({pushState: true});

    if (localStorage.cmxUID) {
        sessionActions.getSessionFromLocalStorage().then(function () {
            App.trigger('viewChange','feed');
        });
    } else {
        App.trigger('viewChange','auth');
    }
});

module.exports = App;
