/*global define*/

'use strict';

var RosterBasketDerivedItem = require('../models/RosterBasketDerivedItem'); //


var RosterBasketDerivedCollection = Backbone.Collection.extend({

  model : RosterBasketDerivedItem,

  initialize : function( models, options) {
    var self=this;
    this.basket = options.basket; /* real roster model */
    /* create the derived object */
    _(this.basket.catalogs.models).each(function (catalog, ii, ll){
      /*if COMBO, one entry per combo */

      if (typeof catalog.quantity === 'undefined') {
        /* COMBO orders, just get the catalog price */
        //totalPrice=totalPrice+(catalog.get('price')*catalog.get('quantity')) ;
        var catalogId = catalog.id;
      //  _(catalog.get('groups')).each(function(group, indexd, listd) {
      //    var groupId = group.groupId;
        //  _(group.unSubgroupedItems).each(function(item, index, list) {
            var entryItem =  new RosterBasketDerivedItem( {
              rosterEntryType: 'COMBO',
              uUID: catalogId,
              itemId: "",//groupId,
              groupId: "",//groupId,
              catalogId: catalogId,
              displayText:catalog.get('catalogDisplayText'),
              quantity:catalog.get('quantity'), //item.quantity,
              price:catalog.get('price'),
              removeItem:function( ){
                console.log("removing "+catalogId);
              }
            });
          self.add(entryItem);
          //console.log('orderItems : '+_(orderItems).size());
      //  });
    //  });
    } else {
      console.log("From " + catalog.catalogUUID + ", type:" + catalog.catalogType);
      /* A la carte (ITEMZIED) catalog items. NOTE: model = item */
      _(catalog.models).each(function(item, index, list) {
        var entryItem =  new RosterBasketDerivedItem( {
          rosterEntryType:'ITEMIZED',
          uUID:item.get('catalogId'),
          itemId: item.get('itemId'),
          groupId: item.get('groupId'),
          catalogId: item.get('catalogId'),
          displayText: item.get('itemName'),
          quantity: item.get('quantity'),
          price:item.get('price'),
          removeItem:function( ){
            console.log("removing "+catalogId);
          }
        });
        self.add(entryItem);
        //console.log('orderItems : '+_(orderItems).size());
      });
    }
  });

},

reset : function(){

}
/* define a remove funtion for this object, so we can remove it from the basket without having
to look it up */


/* if ITEMIZED, one entry per item within the catalog */


});

module.exports = RosterBasketDerivedCollection;
