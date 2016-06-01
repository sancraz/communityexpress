define([ "lodash", "backbone","../models/PreeQuestionModel" ], function(_, Backbone,PreeQuestionModel) {
 
 
 var PreeQuestionCollectionModel = Backbone.Collection.extend({
  model: PreeQuestionModel,
  
  
  initialize : function(attributes, options) {
   console.log("PreeQuestionCollectionModel instantiated");
  }
 });
  
 return PreeQuestionCollectionModel;
});