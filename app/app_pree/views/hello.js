define(["jquery","lodash","backbone.marionette","./template.hbs"],
function ($,_,Marionette,template) {
  var helloItem=Marionette.ItemView.extend({
    template: template,
    serializeData() {
      return {
        name: 'Pree!'
      };
    }

  });
  return helloItem;
});
