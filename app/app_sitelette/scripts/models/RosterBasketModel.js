/*global define*/

'use strict';
var CatalogBasketModel = require('../models/CatalogBasketModel'); //

var RosterBasketModel = Backbone.Model.extend({

   // model : CatalogBasketModel,

    initialize : function(options) {
        /*
         * options must be null, otherwise, it will try to add items in the
         * collection from option
         */
       this.prices = new Backbone.Model(); 
       this.catalogs={};
    },

    rosterId : null,

    rosterDisplayText : null,

    /*
     * we save the uUID also, so that we can scan by groupId and find the uUID
     * maybe we can just use the 'id'?
     */
    uUID : null,
    rosterType : null,

//    add : function(n) {
//        var curr = this.get('quantity');
//        this.set('quantity', curr + (n || 1));
//    },

    /* catalog uuid */
    idAttribute : 'uUID',

    setRosterDetails : function(rosterDetails) {
        this.idAttribute = rosterDetails.rosterUUID;
        this.rosterId=rosterDetails.rosterUUID;
        this.rosterDisplayText = rosterDetails.rosterDisplayText;
        this.rosterType = rosterDetails.rosterType;
    },

     
    
    
    addCatalog : function(catalog, count,  catalogId,catalogDisplayText) {
        // console.log("BasketModel:addItem::"+item.get('itemName')+",
        // "+groupId+", "+catalogId);

        var catalogModel = this.catalogs[(catalog.catalogId)];
        if (catalogModel) {
        	var quantity=catalogModel.quantity;
        	quantity=quantity+count;
        	catalogModel.quantity=quantity;
        } else {
            /*
             * create item options, pass groupId, catalogId
             */
            var catalogDetails = _.extend({},   { 
                catalogUUID : catalog.catalogId,
                catalogDisplayText:catalog.displayText,
                catalogType:catalog.catalogType.enumText,
                quantity:count||1,
                price:catalog.price
            });

            /*
             * create basketItem model
             * REMEMBER: This is a collection, so no arguments. set them later.
             */ 

            var catalogModel = new CatalogBasketModel( );
            catalogModel.setCatalogDetails(catalogDetails);
            
            /*
             * add the itemModel to the collection
             */
            
        }
        this.catalogs[catalogId]=catalogModel;
        this.dumpCartToConsole();
    },

    removeCatalog : function(catalog) {
        this.remove(catalog.get('uUID'));
    },

    getNumOf : function(catalog) {
        var model = this.get(catalog.get('uUID'));
        if (model) {
            return model.get('quantity');
        } else {
            return 0;
        }
    },

    
    count : function() {
        return this.reduce(function(sum, catalog) {
            return sum += catalog.get('quantity');
        }.bind(this), 0);
    },

    dumpCartToConsole : function() {
        console.log("************----- current RosterBasketModel --------"); 
        _(this.catalogs).each(function(catalog, index, list) {
            if(catalog.catalogType==='COMBO'){ 
                var quantity = catalog.quantity;
                var catalogName = catalog.catalogDisplayText;
                var catalogId = catalog.catalogId;
                console.log("*** Combo " + catalogName + ":[" + quantity + "] @ "+catalog.price);
              
            }else{ 
               catalog.dumpCartToConsole();
                
            }
        });
        console.log("*************---------------------------");
    },

    removeAllItems : function() {
        this.reset();
    },

    isComboGroupRepresented : function(groupId) {

        var itemId;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                if (item.groupId === groupId) {
                    itemId = item.id;
                }
            }
        });
        return itemId;
    },

    hasCombo : function() {
        var comboCount = _(this.getComboCatalogs()).size();
        if (comboCount > 0) {
            return true;
        } else {
            return false;
        }
        // var hasCombo = false;
        // this.each(function(item, index, list) {
        // if (hasCombo === false && item.itemType === 'COMBO') {
        // hasCombo = true;
        // }
        // ;
        // });
        // return hasCombo;
    },

    getComboCatalogs : function() {
        var comboCatalogsArray = {};
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                if (!_(comboCatalogsArray).has(item.catalogId)) {
                    comboCatalogsArray[item.catalogId] = {
                        catalogDisplayText : item.catalogDisplayText,
                        price : item.get('price')
                    };
                } else {
                    /* update the price */
                    var tmpObj = comboCatalogsArray[item.catalogId];
                    var tmpPrice = tmpObj.price;
                    var newPrice = tmpPrice + item.get('price');
                    tmpObj.price = newPrice;
                    comboCatalogsArray[item.catalogId] = tmpObj;
                }
            }
            ;
        });
        return comboCatalogsArray;
    },
    getComboCount : function() {
        return _(this.getComboCatalogs()).size();
    },

    getComboPrice : function() {
        var comboPrice = 0;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                comboPrice = comboPrice + item.get('price');
            }
            ;
        });
        return comboPrice;
    },

    nonComboItemCount : function() {
        var nonComboCount = 0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboCount = nonComboCount + item.get('quantity');
            }
            ;
        });
        return nonComboCount;
    },

    getNonComboPrice : function() {
        var nonComboPrice = 0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboPrice = nonComboPrice + item.get('price');
            }
            ;
        });
        return nonComboPrice;
    },
    getNonComboItems : function() {
        var nonComboItems = [];
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboItems.push({
                    itemName : item.itemName,
                    quantity : item.get('quantity'),
                    price : item.get('price')
                });
            }
            ;
        });
        return nonComboItems;
    },

});

module.exports = RosterBasketModel;
