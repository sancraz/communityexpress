'use strict';

var App = require('./app');

module.exports = {

    feed: function() {
        var centralPartController = require('./controllers/centralPartController');
        centralPartController.showLayout();
    },

    auth: function() {
        var authController = require('./components/auth/authController');
        authController.showLayout();
    }
};
