'use strict';

var PreeQuestionModel = require('./PreeQuestionModel'); 
 
var PreeQuestionCollectionModel = Backbone.Collection.extend({
    
    model: PreeQuestionModel,
    
    initialize : function(attributes, options) {
     console.log("PreeQuestionCollectionModel instantiated");
    }
 });
    
module.exports = PreeQuestionCollectionModel;
