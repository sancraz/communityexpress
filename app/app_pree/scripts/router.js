define(['jquery','backbone','../views/hello'],function($,Backbone, HelloView){
  var AppRouter=Backbone.Router.extend({ 
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
      var helloView = new HelloView().render();

      $('#js-app').empty().append(helloView.$el).ready(
        function(){
          $('#js-app').fadeIn('slow');
        }
      )
    },

    about: function() {
      var helloView = new HelloView({
        template: _.template('Im the about page')
      }).render();

      $('#js-app').empty().append(helloView.$el);
    }

  });

  return   AppRouter;


});
