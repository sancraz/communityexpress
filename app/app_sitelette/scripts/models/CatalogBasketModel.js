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
	itemId : null,
	/*
	 * we save the uUID also, so that we can scan by groupId and find the uUID
	 * maybe we can just use the 'id'?
	 */
	uUID : null,
	itemName : null,

	add : function(n) {
		var curr = this.get('quantity');
		this.set('quantity', curr + (n || 1));
	},

	initialize : function(options) {
		this.groupId = options.groupId;
		this.catalogId = options.catalogId;
		this.itemId = options.itemId;
		this.uUID = options.uUID;
		this.itemName = options.itemName;
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

	setCatalogDetails: function (catalogDetails){
	    this.idAttribute=catalogDetails.catalogUUID;
	    this.catalogName=catalogDetails.catalogName; 
	    this.catalogType=catalogDetails.catalogType;
	},
	
	changeItemInCombo : function(item, groupId, catalogId) {
		 
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
			catalogId : catalogId
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

	addItem : function(item, count, groupId, catalogId) {
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
				catalogId : catalogId
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
	addItemRaw : function(itemRaw, count, groupId, catalogId) {

		/*
		 * create item options, pass groupId, catalogId
		 */
		var itemOptions = _.extend({}, itemRaw, {
			quantity : count || 1,
			groupId : groupId,
			catalogId : catalogId
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
		console.log(" CatalogBasket for catalog:"+this.catalogName);
		this.each(function(item, index, list) {
			var quantity = item.get('quantity');
			var itemName = item.itemName;
			var group = item.groupId;

			console.log("*** " + itemName + ":[" + quantity + "] from Group:"
					+ group);
		});
		console.log("*************---------------------------");
	},

	removeAllItems : function() {
		this.reset();
	},
	
	hasCombo : function(){
	  return false;
	},
	
	getComboCount : function(){
	  return 1;  
	},
	
	getComboPrice : function(){
	  return "44.00";
	},
  
	nonComboItemCount : function(){
      return 99;
  },

  getNonComboPrice:function(){
      return "0.00";
  }
	
});

module.exports = CatalogBasketModel;
