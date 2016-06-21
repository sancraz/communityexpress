'use strict';

var App = require('../app'),
    gateway = require('../APIGateway/gateway'),
    CentralLayoutView = require('../views/CentralLayoutView'),
    FeedView = require('../views/FeedView'),
    FeedModel = require('../models/FeedModel');

module.exports = {

    showLayout: function() {
        this.centralLayoutView = new CentralLayoutView();
        App.regions.getRegion('centralRegion').show(this.centralLayoutView);
        this.getQuestions();
    },

    getQuestions: function() {
        gateway.sendRequest('getPreeQuestions', {
          // throw: true
      }).then(_.bind(function(resp) {
            var model = new FeedModel(resp);
            this.showQuestions(model);
        }, this), function(e) {
          loader.hide();
          loader.showErrorMessage(e, 'unable to load questions')
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

    showQuestions: function(model) {
        // var infoView = new InfoView({
        //     model: model
        // });
        var feedView = new FeedView({
            // el: $('#pree_feed')
            collection: model.questionCollection
        });
        this.centralLayoutView.showQuestionsView(feedView)
    }
}
