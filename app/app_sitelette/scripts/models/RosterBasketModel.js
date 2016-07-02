/*global define*/

'use strict';
var CatalogBasketModel = require('../models/CatalogBasketModel'); //

var RosterBasketModel = Backbone.Model.extend({

    // model : CatalogBasketModel,

    initialize: function(options) {
        /*
         * options must be null, otherwise, it will try to add items in the
         * collection from option
         */
        this.prices = new Backbone.Model();
        //this.collection={};
        this.catalogs = new Backbone.Collection();
    },



    rosterId: null,

    rosterDisplayText: null,

    /*
     * we save the uUID also, so that we can scan by groupId and find the uUID
     * maybe we can just use the 'id'?
     */
    uUID: null,
    rosterType: null,

    //    add : function(n) {
    //        var curr = this.get('quantity');
    //        this.set('quantity', curr + (n || 1));
    //    },

    /* catalog uuid */
    idAttribute: 'uUID',

    setRosterDetails: function(rosterDetails) {
        this.idAttribute = rosterDetails.rosterUUID;
        this.rosterId = rosterDetails.rosterUUID;
        this.rosterDisplayText = rosterDetails.rosterDisplayText;
        this.rosterType = rosterDetails.rosterType;
    },




    addCatalog: function(catalog, count, catalogId, catalogDisplayText) {
        // console.log("BasketModel:addItem::"+item.get('itemName')+",
        // "+groupId+", "+catalogId);
        //var xxx=
        //this.catalogs.add(catalog);
        //his.catalogs.remove(catalogId);


        var catalogModel = this.catalogs.get(catalog.catalogId);
        if (catalogModel) {
            var quantity = catalogModel.get('quantity');
            quantity = quantity + count;
            catalogModel.set('quantity', quantity);
        } else {
            /*
             * create item options, pass groupId, catalogId
             */
            var catalogDetails = _.extend({}, {
                catalogUUID: catalog.catalogId,
                catalogDisplayText: catalog.displayText,
                catalogType: catalog.catalogType.enumText,
                quantity: count || 1,
                price: catalog.price,
                catalog: catalog,
                itemName: "",
                itemType: 'COMBO'
            });

            /*
             * create basketItem model
             * REMEMBER: This is a collection, so no arguments. set them later.
             */

            var catalogModel = new CatalogBasketModel();
            catalogModel.setCatalogDetails(catalogDetails);
            catalogModel.groups = catalog.groups;

            /*
             * add the itemModel to the collection
             */
            this.catalogs.add(catalogModel);
        }
        this.dumpCartToConsole();
        this.trigger('change');
    },

    removeCatalog: function(catalog) {
        this.remove(catalogs.get(catalog.catalogId));
    },

    getNumOf: function(catalog) {
        var model = this.get(catalog.get('uUID'));
        if (model) {
            return model.quantity;
        } else {
            return 0;
        }
    },


    count: function() {
        /* we return the sum of combos and ala-la-care items */
        var comboCount = this.getComboCount();
        var nonComboCount = this.getNonComboItemCount();
        return comboCount + nonComboCount;
    },
    reset: function() {

    },
    getItems: function(sasl) {
        var orderItems = [];
        this.catalogs.each(function(catalog, tt, ee) {
            if (typeof catalog.quantity !== 'undefined') {
                /* A la carte (ITEMZIED) catalog items. NOTE: model = item */
                _(catalog.models).each(function(item, index, list) {
                    var orderItem = {
                        serviceAccommodatorId: sasl.sa(),
                        serviceLocationId: sasl.sl(),
                        priceId: item.get('priceId'),
                        itemId: item.get('itemId'),
                        groupId: item.get('groupId'),
                        catalogId: item.get('catalogId'),
                        itemVersion: item.get('itemVersion'),
                        quantity: item.get('quantity')
                    };

                    orderItems.push(orderItem);
                    console.log('orderItems : '+_(orderItems).size());
                });
            } else {
                /* COMBO orders, just get the catalog price */
                //totalPrice=totalPrice+(catalog.get('price')*catalog.get('quantity')) ;
                _(catalog.get('groups')).each(function(group, indexd, listd) {
                    _(group.unSubgroupedItems).each(function(item, index, list) {
                        var orderItem = {
                            serviceAccommodatorId: sasl.sa(),
                            serviceLocationId: sasl.sl(),
                            priceId: item.priceId,
                            itemId: item.itemId,
                            groupId: item.groupId,
                            catalogId: item.catalogId,
                            itemVersion: item.itemVersion,
                            quantity: catalog.get('quantity'), //item.quantity,
                        };
                        orderItems.push(orderItem);
                        console.log('orderItems : '+_(orderItems).size());
                    });

                });
            }
        });
        console.log('FINAL: orderItems : '+_(orderItems).size());
        return orderItems;
        /*
        return [ {
            serviceAccommodatorId:  sasl.sa(),
            serviceLocationId:  sasl.sl(),
            priceId: 1,//item.get('priceId'),
            itemId: 13,//item.get('itemId'),
            groupId:'SIDES',//item.get('groupId'),
            catalogId:'ITEMIZEDCOMBO',//item.get('catalogId'),
            itemVersion: 1,//item.get('itemVersion'),
            quantity: 4,//item.get('quantity')
        }];
            /*
            return {
                serviceAccommodatorId: this.sasl.sa(),
                serviceLocationId: this.sasl.sl(),
                priceId: item.get('priceId'),
                itemId: item.get('itemId'),
                groupId:item.get('groupId'),
                catalogId:item.get('catalogId'),
                itemVersion: item.get('itemVersion'),
                quantity: item.get('quantity')
            };
            */

    },
    dumpCartToConsole: function() {
        console.log("************----- current RosterBasketModel --------");
        this.catalogs.each(function(catalog, index, list) {
            if (typeof catalog.catalogType !== 'undefined') { //catalog.get('catalogType')==='COMBO'){
                catalog.dumpCartToConsole();
            } else {
                var quantity = catalog.get('quantity');
                var catalogName = catalog.get('catalogDisplayText');
                var catalogId = catalog.get('catalogId');
                console.log("*** Combo " + catalogName + ":[" + quantity + "] @ " + catalog.get('price'));
            }
        });
        console.log("*************---------------------------");
    },
    removeItem: function(catalogId) {
        console.log("removeItem:" + catalogId);
    },
    removeAllItems: function() {
        this.catalogs.reset();
    },

    isComboGroupRepresented: function(groupId) {

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

    hasCombo: function() {
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

    getComboCatalogs: function() {
        var comboCatalogsArray = {};
        this.catalogs.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                if (!_(comboCatalogsArray).has(item.catalogId)) {
                    comboCatalogsArray[item.catalogId] = {
                        catalogDisplayText: item.catalogDisplayText,
                        price: item.get('price')
                    };
                } else {
                    /* update the price */
                    var tmpObj = comboCatalogsArray[item.catalogId];
                    var tmpPrice = tmpObj.price;
                    var newPrice = tmpPrice + item.get('price');
                    tmpObj.price = newPrice;
                    comboCatalogsArray[item.catalogId] = tmpObj;
                }
            };
        });
        return comboCatalogsArray;
    },

    /* TODO */
    getComboPrice: function() {
        var comboPrice = 0;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                comboPrice = comboPrice + item.get('price');
            };
        });
        return comboPrice;
    },

    getTotalPrice: function() {
        var totalPrice = 0;

        this.catalogs.each(function(catalog, index, list) {
            if (typeof catalog.quantity !== 'undefined') {
                /* A la carte (ITEMZIED) catalog items */
                _(catalog.models).each(function(model, index, list) {
                    console.log(model.itemName + " : " + model.get('quantity') + ' at $ ' + model.get('price'));
                    totalPrice = totalPrice + (model.get('quantity') * model.get('price'));
                });
            } else {
                /* COMBO orders, just get the catalog price */
                totalPrice = totalPrice + (catalog.get('price') * catalog.get('quantity'));
            }
        });
        return totalPrice;
    },

    getComboCount: function() {
        var count = 0;
        this.catalogs.each(function(catalog, index, list) {
            /* is this added as the hacked catalog model? */
            if (typeof catalog.quantity !== 'undefined') {; // ignore, since it is ala carte.
            } else {
                //console.log(" catalog in basket "+catalog.get('catalogDisplayText'));
                count = count + catalog.get('quantity');
            }
        });
        return count;
    },

    getNonComboItemCount: function() {
        var count = 0;
        this.catalogs.each(function(catalog, index, list) {
            if (catalog.get('catalogType') !== 'COMBO') {

                catalog.each(function(item, index, list) {
                    count = count + item.get('quantity');
                    //console.log('item: '+item.itemName+" quantity["+item.get('quantity')+"]");
                });
            }
        });

        return count;
    }

});

module.exports = RosterBasketModel;
