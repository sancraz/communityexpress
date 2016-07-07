'use strict';

var App = require('./app');

var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController'),
        	rightPartController = require('./controllers/rightPartController'),
            headerController = require('./controllers/headerController'),
            leftPartController = require('./controllers/leftPartController');
        headerController.showLayout();
        centralPartController.showLayout();
        leftPartController.showLayout();
        rightPartController.showLayout();
    },

    authenticate: function() {
        var authController = require('./components/auth/authController');
        authController.showLayout();
    }
};

var AppRouter = Mn.AppRouter.extend({

    controller: API,

    appRoutes: {
        '': 'dashboard',
        'auth': 'authenticate'
    }
});

module.exports = AppRouter;
