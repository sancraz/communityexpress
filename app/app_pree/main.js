'use strict';

require('./styles/pree_styles.css');
require('./styles/style.css');

var Router = require('./scripts/router'),
    FeedModel = require('./scripts/models/FeedModel'),
    FeedView = require('./scripts/views/FeedView'),
    FeedSelectorView = require('./scripts/views/FeedSelectorView');

var App = {

    initialize: function() {
        var router = new Router;
        Backbone.history.start();

        // var feedModel = new FeedModel();
        // var feedView = new FeedView({ el: $("#pree_feed"), model: feedModel });
        // var feedSelectorView = new FeedSelectorView({ el: $("#pree_feed_tabs"), model: feedModel });
    }
};

App.initialize();
