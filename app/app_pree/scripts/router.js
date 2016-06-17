var preeController = require('./controllers/preeController'),
    loader = require('./loader'),
    FeedView = require('./views/FeedView'),
    FeedSelectorView = require('./views/FeedSelectorView');

var AppRouter = Backbone.Router.extend({

    routes: {
        '': 'dashboard',
        'about': 'about'
    },

    initialize: function() {
        $('#app-content').append('<div id="js-app"></div>').ready(
            function(){
                $('#js-app').hide();
            }
        );

    },

    dashboard: function() {
        loader.show('questions');
        var feedView = new FeedView({
            el: $('#pree_feed')
        });
        // preeController.getQuestions()
        //     .then(function(model) {
        //         var feedView = new FeedView({
        //             el: $("#pree_feed"),
        //             model: model,
        //             collection: model.questionCollection
        //         });
        //         var feedSelectorView = new FeedSelectorView({ el: $("#pree_feed_tabs"), model: model });
        //     });
    },

    about: function() {}

});

module.exports = AppRouter;
