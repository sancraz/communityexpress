/*global define*/

'use strict';

var CatalogBasketItem = Backbone.Model.extend({
    /*
     * what is id, cid and idAttribute?
     * http://stackoverflow.com/questions/12169822/backbone-js-id-vs-idattribute-vs-cid
     * 
     * So, we are telling backbone to use the 'uUID' value as the id value for
     * this item.
     */
    idAttribute : 'uUID',

    groupId : null,
    catalogId : null,
    groupDisplayText:null,
    catalogDisplayText:null,
    itemId : null,
    /*
     * we save the uUID also, so that we can scan by groupId and find the uUID
     * maybe we can just use the 'id'?
     */
    uUID : null,
    itemName : null,
    itemType : null,

    add : function(n) {
        var curr = this.get('quantity');
        this.set('quantity', curr + (n || 1));
    },

    initialize : function(options) {
        this.groupId = options.groupId;
        this.catalogId = options.catalogId;
        this.groupDisplayText= options.groupDisplayText;
        this.catalogDisplayText= options.catalogDisplayText;
        this.itemId = options.itemId;
        this.uUID = options.uUID;
        this.itemName = options.itemName;
        this.itemType = options.itemType.enumText;
        // console.log("CatalogBasketItem:initialize::"+this.itemName+",
        // "+this.groupId+", "+this.catalogId);
    }

});

var CatalogBasketModel = Backbone.Collection.extend({

    model : CatalogBasketItem,
    /* catalog uuid */
    idAttribute : 'uUID',

    initialize : function() {
        this.prices = new Backbone.Model();

    },

    setCatalogDetails : function(catalogDetails) { 
        this.idAttribute = catalogDetails.catalogUUID;
        this.catalogDisplayText = catalogDetails.catalogDisplayText;
        this.catalogType = catalogDetails.catalogType;
    },

    changeItemInCombo : function(item, groupId, groupDisplayText,catalogId,catalogDisplayText) {

        /*
         * find item with same group in this. remove it. add new item.
         */
        var self = this;
        var foundElementToRemove = false;
        this.each(function(itemInCart, index, list) {
            if (typeof itemInCart === 'undefined') {
                console.log("itemInCart undefined, ignoring");
            } else {
                var quantity = itemInCart.get('quantity');
                var itemName = itemInCart.itemName;
                var group = itemInCart.groupId;
                if (group === groupId && foundElementToRemove === false) {
                    foundElementToRemove = true;
                    self.remove(itemInCart.get('uUID'));
                }
            }
        });
        /*
         * add the new item
         */
        var itemOptions = _.extend({}, item.attributes, {
            quantity : 1,
            groupId : groupId,
            catalogId : catalogId,
            groupDisplayText:groupDisplayText,
            catalogDisplayText:catalogDisplayText
        });

        /*
         * create basketItem model
         */

        var itemModel = new CatalogBasketItem(itemOptions);

        /*
         * add the itemModel to the collection
         */
        this.add(itemModel);

        this.dumpCartToConsole();

    },

    addItem : function(item, count, groupId, groupDisplayText,catalogId,catalogDisplayText) {
        // console.log("BasketModel:addItem::"+item.get('itemName')+",
        // "+groupId+", "+catalogId);

        var itemModel = this.get(item.get('uUID'));
        if (itemModel) {
            itemModel.add(count);
        } else {
            /*
             * create item options, pass groupId, catalogId
             */
            var itemOptions = _.extend({}, item.attributes, {
                quantity : count || 1,
                groupId : groupId,
                groupDisplayText:groupDisplayText,
                catalogId : catalogId,
                catalogDisplayText:catalogDisplayText
            });

            /*
             * create basketItem model
             */

            var itemModel = new CatalogBasketItem(itemOptions);

            /*
             * add the itemModel to the collection
             */
            this.add(itemModel);
        }
        this.dumpCartToConsole();
    },
    addItemRaw : function(itemRaw, count, groupId,groupDisplayText, catalogId,catalogDisplayText) {

        /*
         * create item options, pass groupId, catalogId
         */
        var itemOptions = _.extend({}, itemRaw, {
            quantity : count || 1,
            groupId : groupId,
            groupDisplayText:groupDisplayText,
            catalogId : catalogId,
            catalogDisplayText:catalogDisplayText
            
        });

        /*
         * create basketItem model
         */

        var itemModel = new CatalogBasketItem(itemOptions);

        /*
         * add the itemModel to the collection
         */
        this.add(itemModel);

        this.dumpCartToConsole();
    },

    removeItem : function(item) {
        this.remove(item.get('uUID'));
    },

    getNumOf : function(item) {
        var model = this.get(item.get('uUID'));
        if (model) {
            return model.get('quantity');
        } else {
            return 0;
        }
    },

    getTotalPrice : function() {
        return this.reduce(function(sum, item, id) {
            return sum += item.get('quantity') * item.get('price');
        }.bind(this), 0).toFixed(2);
    },

    count : function() {
        return this.reduce(function(sum, item) {
            return sum += item.get('quantity');
        }.bind(this), 0);
    },

    dumpCartToConsole : function() {
        console.log("************----- current cart --------");
        console.log(" CatalogBasket for catalog:" + this.catalogName);
        this.each(function(item, index, list) {
            var quantity = item.get('quantity');
            var itemName = item.itemName;
            var group = item.groupId;

            console.log("*** " + itemName + ":[" + quantity + "] from Group:" + group);
        });
        console.log("*************---------------------------");
    },

    removeAllItems : function() {
        this.reset();
    },
    
    isComboGroupRepresented:function(groupId){
        
        var itemId;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                 if(item.groupId===groupId){
                     itemId=item.id;
                 }
            }
        });
        return itemId;
    },
    
    hasCombo : function() {
        var comboCount= _(this.getComboCatalogs()).size(); 
        if(comboCount>0){
            return true;
        }else{
            return false;
        }
//        var hasCombo = false;
//        this.each(function(item, index, list) {
//            if (hasCombo === false && item.itemType === 'COMBO') {
//                hasCombo = true;
//            }
//            ;
//        });
//        return hasCombo;
    },

    getComboCatalogs : function(){
        var comboCatalogsArray={};
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                if(! _(comboCatalogsArray).has(item.catalogId)){ 
                  comboCatalogsArray[item.catalogId]={catalogDisplayText:item.catalogDisplayText,price:item.get('price')};  
                }else{
                    /* update the price */
                    var tmpObj=  comboCatalogsArray[item.catalogId];
                    var tmpPrice=tmpObj.price;
                    var newPrice=tmpPrice+item.get('price');
                    tmpObj.price=newPrice;
                    comboCatalogsArray[item.catalogId]=tmpObj;
                }
            }
            ;
        });
        return comboCatalogsArray;
    },
    getComboCount : function() { 
        return  _(this.getComboCatalogs()).size();
    },

    getComboPrice : function() {
        var comboPrice=0;
        this.each(function(item, index, list) {
            if (item.itemType === 'COMBO') {
                comboPrice=comboPrice+item.get('price'); 
            }
            ;
        });
        return comboPrice;
    },

    nonComboItemCount : function() {
        var nonComboCount=0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboCount=nonComboCount+item.get('quantity');
            }
            ;
        });
        return nonComboCount;
    },

    getNonComboPrice : function() {
        var nonComboPrice=0;
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboPrice=nonComboPrice+item.get('price'); 
            }
            ;
        });
        return nonComboPrice;
    },
    getNonComboItems : function() {
        var nonComboItems=[];
        this.each(function(item, index, list) {
            if (item.itemType !== 'COMBO') {
                nonComboItems.push({itemName:item.itemName, quantity:item.get('quantity'), price:item.get('price')});
            }
            ;
        });
        return nonComboItems;
    },

});

module.exports = CatalogBasketModel;
