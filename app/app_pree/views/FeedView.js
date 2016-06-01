define([ "jquery", "lodash", "backbone" ], function($, _, Backbone) {
 var feedView = Backbone.View.extend({

  initialize : function() {
   console.log("feedView initialized");
   this.listenTo(this.model, "change", this.modelEventHandler);
  },

  modelEventHandler : function() {
   console.log(" Model event received");
   this.render();
  },

  render : function() {

   var ul;

   if (this.$el.has('ul').length) {
    console.log('ul found');
   } else {
    console.log('ul not found');
    this.$el.empty();
    this.$el.append("<ul></ul>");

   }
   ul = this.$el.find('ul');

   $(ul[0]).empty();

   this.model.questionCollection.each(function(questionModel) {
    console.log(questionModel.get('title'));
    $(ul[0]).append('<li style="color:red;"> ' + questionModel.get('title') + "</li>")
   });

   /*
    * if there is no ul, then create one. then, for each item, add a new li from
    * model. Create a pqv with li as el.
    */
  }
 });

 return feedView;
});