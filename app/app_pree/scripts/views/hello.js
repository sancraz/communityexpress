define(["jquery","lodash","backbone.marionette","./template.hbs"],
function ($,_,Marionette,template) {
  var helloItem=Marionette.ItemView.extend({
    template: template,
    serializeData: function() {
      return {
        name: 'Pree!'
      };
    }

  });
  return helloItem;
});
