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
    $('#app-container').on('click', 'a[href]:not([data-bypass])', function(evt) {
        // Get the absolute anchor href.
        var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
        // Get the absolute root.
        var root = location.protocol + '//' + location.host;

        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            // Backbone.history.navigate(href.attr, true);
        }
    });

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
