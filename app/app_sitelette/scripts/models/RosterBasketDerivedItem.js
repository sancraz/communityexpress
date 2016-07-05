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
    idAttribute : 'uuid',

    groupId : null,
    catalogId : null,
    itemId : null,
    uuid:'',

    displayText:"",
    rosterEntryType:"ITEM", /* ITEM or COMBO */
    price:0,
    quantity:0,

    editable:true,
    selected:false,


    initialize : function(options) {
        this.displayText=options.displayText;
        this.rosterEntryType=options.rosterEntryType;
        this.groupId = options.groupId;
        this.catalogId = options.catalogId;
        this.itemId = options.itemId;
        this.uUID = options.uUID;
        this.price=options.price;
        this.quantity=options.quantity;
        this.removeItem=options.removeItem;
    },

    removeItem : function(options){
      console.log(" removing items in itemmodel");
    }

});


module.exports = RosterBasketDerivedItem;
