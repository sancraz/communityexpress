/*global define*/

'use strict';


var RosterBasketDerivedItem = Backbone.Model.extend({
  /*
  * what is id, cid and idAttribute?
  * http://stackoverflow.com/questions/12169822/backbone-js-id-vs-idattribute-vs-cid
  *
  * So, we are telling backbone to use the 'uUID' value as the id value for
  * this item.
  */

  defaults :{
    groupId : null,
    catalogId : null,
    itemId : null,
    uuid:'',

    displayText:"",
    rosterEntryType:"ITEM", /* ITEM or COMBO */
    price:0,
    quantity:0,

    editable:true,
    selected:false
  },

  initialize : function(options) {
    this.set('displayText',options.displayText);
    this.set('rosterEntryType',options.rosterEntryType);
    this.set('groupId' , options.groupId);
    this.set('catalogId' ,options.catalogId);
    this.set('itemId' , options.itemId);
    this.set('uUID', options.uUID);
    this.set('price',options.price);
    this.set('quantity', options.quantity);
    this.set('removeItem',options.removeItem);
  },

  removeItem : function(options){
    console.log(" removing items in itemmodel");
  }

});


module.exports = RosterBasketDerivedItem;
