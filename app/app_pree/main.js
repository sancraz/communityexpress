define(['jquery','backbone','./scripts/router','./models/FeedModel','./views/FeedView',
       './views/FeedSelectorView'],
  function($,Backbone,Router, FeedModel, FeedView,  FeedSelectorView){
  console.log(Router);
  const router = new Router();

  // NOTE: router.initialize called automatically
  Backbone.history.start();
  
  // create a model
  var feedModel=new FeedModel();
  var feedView=new FeedView({ el: $("#pree_feed"), model: feedModel });  
  
  //var feedSelectorModel=new FeedSelectorModel({},{feedModel:feedModel});
  var feedSelectorView=new FeedSelectorView({ el: $("#pree_feed_tabs"), model: feedModel });

  
  
  
});
