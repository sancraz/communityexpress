/*global define*/

'use strict';

var BasketItem = Backbone.Model.extend({
/* what is id, cid and idAttribute? 
 * http://stackoverflow.com/questions/12169822/backbone-js-id-vs-idattribute-vs-cid
 * 
 * So, we are telling backbone to use the 'uUID' value as the id value for this item.
 * for 
 */
	idAttribute : 'uUID',
	
	groupId : null,
	catalogId : null,
	itemId:null,
	/*
	 * we save the uUID also, so that we can scan by groupId and find the uUID
	 * maybe we can just use the 'id'?
	 */
	uUID:null,
	itemName:null,

	add : function(n) {
		var curr = this.get('quantity');
		this.set('quantity', curr + (n || 1));
	}, 
	
	initialize:function(options){
		this.groupId=options.groupId;
		this.catalogId=options.catalogId;
		this.itemId=options.itemId;
		this.uUID=options.uUID;
		this.itemName=options.itemName;
		console.log("BasketItem:initialize::"+this.itemName+", "+this.groupId+", "+this.catalogId);
	}

});

var Basket = Backbone.Collection.extend({

	model : BasketItem,
	
	initialize : function(options) {
		this.prices = new Backbone.Model();
	},

	changeItemInCombo:function(item,groupId,catalogId){
		console.log("BasketModel:changeItemInCombo::"+item.get('itemName')+", "+groupId+", "+catalogId);
		
		
	},
	
	addItem : function(item, count, groupId, catalogId) {
		console.log("BasketModel:addItem::"+item.get('itemName')+", "+groupId+", "+catalogId);
		
		
		var itemModel = this.get(item.get('uUID'));
		if (itemModel) {
			itemModel.add(count);
		} else {
			/*
			 * create item options, pass groupId, catalogId
			 */
			var itemOptions = _.extend({}, item.attributes, {
				quantity : count || 1,
				groupId:groupId,
				catalogId: catalogId
			});
			
			/*
			 * create basketItem model
			 */
			
			var itemModel = new BasketItem(itemOptions);
			
			/*
			 * add the itemModel to the collection
			 */
			this.add(itemModel);
		}
		
		/*
		 * dump basket to console
		 */
		console.log("----- current cart --------");
		this.each(function(item, index, list)
		  {
			var quantity=item.get('quantity');
			var itemName=item.itemName;
			var group=item.groupId;
			
		     console.log(itemName+":["+quantity+"] from Group:"+group);
		  });
		console.log("---------------------------");
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

});

module.exports = Basket;
