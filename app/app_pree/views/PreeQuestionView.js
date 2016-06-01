define([ "jquery", "lodash", "backbone", "../models/FeedModel" ], function($,
  _, Backbone, feedModel) {
 var FeedSelectorView = Backbone.View.extend({

  initialize : function() {
   console.log("FeedSelectorView initialized");
   this.render();
  },

  render : function() {
    
  }
 });

 return FeedSelectorView;
});