'use strict';

var App = require('./app');

module.exports = {

    feed: function() {
        var centralPartController = require('./controllers/centralPartController'),
            headerController = require('./controllers/headerController');
        headerController.showLayout();
        centralPartController.showLayout();
    },

    auth: function() {
        var authController = require('./components/auth/authController'),
            headerController = require('./controllers/headerController');
        headerController.showLayout();
        authController.showLayout();
    }
};
