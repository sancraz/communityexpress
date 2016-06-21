var loader = require('./loader');

var API = {
    dashboard: function() {
        var centralPartController = require('./controllers/centralPartController');
        centralPartController.showLayout();
    }
};

var AppRouter = Mn.AppRouter.extend({

    controller: API,

    appRoutes: {
        '': 'dashboard'
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
