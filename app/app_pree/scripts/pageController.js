'use strict';

var App = require('./app');

module.exports = {

    feed: function() {
        var centralPartController = require('./controllers/centralPartController'),
        	rightPartController = require('./controllers/rightPartController'),
            headerController = require('./controllers/headerController'),
            leftPartController = require('./controllers/leftPartController');
        headerController.showLayout();
        centralPartController.showLayout();
        // leftPartController.showLayout();
        rightPartController.showLayout();
    },

    auth: function() {
        var authController = require('./components/auth/authController');
        authController.showLayout();
    }
};
