/*global define*/

'use strict';

var  CatalogBasketModel = require('../models/CatalogBasketModel'),//
 
var RosterBasketModel = Backbone.Collection.extend({

	model : CatalogBasketModel,

	initialize : function(options) {
		this.prices = new Backbone.Model();
		this.catalogName="";
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

		var itemModel = new CatalogBasketModel(itemOptions);

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

			var itemModel = new CatalogBasketModel(itemOptions);

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

		var itemModel = new CatalogBasketModel(itemOptions);

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
		console.log("************----- current rosterCart --------");
		this.each(function(item, index, list) {
		    item.dumpCartToConsole();
//			var quantity = item.get('quantity');
//			var itemName = item.itemName;
//			var group = item.groupId;
//
//			console.log("*** " + itemName + ":[" + quantity + "] from Group:"
//					+ group);
		});
		console.log("*************---------------------------");
	},

	removeAllItems : function() {
		this.reset();
	}

});

module.exports = CatalogBasketModel;
